<?php

namespace App\Services\Admissions;

use App\Models\AdmissionCall;
use App\Models\EligibilityAssessment;
use App\Models\Program;
use App\Models\User;

class EligibilityEngine
{
    /**
     * Recalculate every assessment for one user only. Profile changes never
     * touch another applicant's assessments.
     */
    public function recalculateForUser(User $user): int
    {
        $user->load([
            'profile',
            'educations',
            'languageQualifications',
            'workExperiences',
            'studyPreference',
            'bookmarks',
        ]);

        $programs = Program::with(['university', 'admissionCalls'])
            ->where('status', '!=', 'archived')
            ->get();

        $keptIds = [];

        foreach ($programs as $program) {
            $assessment = $this->assess($user, $program);
            $keptIds[] = $program->id;

            EligibilityAssessment::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'program_id' => $program->id,
                ],
                [
                    'admission_call_id' => $assessment['admission_call_id'],
                    'status' => $assessment['status'],
                    'score' => $assessment['score'],
                    'matching_criteria' => $assessment['matching_criteria'],
                    'unmet_criteria' => $assessment['unmet_criteria'],
                    'unknown_criteria' => $assessment['unknown_criteria'],
                    'evidence_urls' => $assessment['evidence_urls'],
                    'next_action' => $assessment['next_action'],
                    'assessed_at' => now(),
                ],
            );
        }

        EligibilityAssessment::where('user_id', $user->id)
            ->when($keptIds !== [], fn ($query) => $query->whereNotIn('program_id', $keptIds))
            ->delete();

        return count($keptIds);
    }

    /**
     * Rules-based assessment. A score is a match strength only — never an
     * admission probability. Missing official evidence yields
     * "insufficient_evidence" instead of a guessed answer.
     *
     * @return array<string, mixed>
     */
    public function assess(User $user, Program $program): array
    {
        $user->loadMissing([
            'profile',
            'educations',
            'languageQualifications',
            'workExperiences',
            'studyPreference',
        ]);
        $program->loadMissing(['university', 'admissionCalls']);

        $profile = $user->profile;
        $preferences = $user->studyPreference;
        $education = $user->educations->sortByDesc('graduation_year')->first();
        $qualifications = $user->languageQualifications;
        $call = $this->upcomingCall($program);

        $matching = [];
        $unmet = [];
        $unknown = [];
        $hardFail = false;
        $preferenceGap = false;

        // 1. Degree level (mandatory).
        if (filled($program->required_degree_level)) {
            if (! $education) {
                $unknown[] = 'No education record added yet.';
            } elseif ($this->degreeRank($education->degree_level) < $this->degreeRank($program->required_degree_level)) {
                $unmet[] = "A {$program->required_degree_level} degree is required; your recorded qualification is {$education->degree_level}.";
                $hardFail = true;
            } else {
                $matching[] = "Degree level satisfies the {$program->required_degree_level} requirement.";
            }
        }

        // 2. Academic result (mandatory when published). Never converts scales.
        if ($program->minimum_grade_percentage !== null) {
            if (! $education || $education->grade_value === null || $education->grade_max === null) {
                $unknown[] = 'Final grade or grading scale is not recorded.';
            } elseif ((float) $education->grade_max !== 100.0) {
                $unknown[] = 'Your grading scale is not 0–100. The university must confirm equivalence; no automatic conversion is applied.';
            } elseif ($education->gradePercentage() < (float) $program->minimum_grade_percentage) {
                $unmet[] = "Minimum grade is {$program->minimum_grade_percentage}%; your recorded result is {$education->gradePercentage()}%.";
                $hardFail = true;
            } else {
                $matching[] = 'Recorded grade meets the published minimum.';
            }
        }

        // 3. Prerequisite subjects.
        $requiredSubjects = $program->required_subjects ?? [];
        if ($requiredSubjects !== []) {
            $subjects = $education?->prerequisite_subjects ?? [];
            if ($subjects === []) {
                $unknown[] = 'Prerequisite subjects are not recorded for your qualification.';
            } else {
                $missing = array_values(array_filter(
                    $requiredSubjects,
                    fn ($required) => ! $this->hasSubject($subjects, $required),
                ));

                if ($missing !== []) {
                    $unmet[] = 'Missing prerequisite subject(s): '.implode(', ', $missing).'.';
                    $hardFail = true;
                } else {
                    $matching[] = 'Recorded prerequisite subjects cover the program requirements.';
                }
            }
        }

        // 4. Language requirement.
        if (filled($program->required_language_test)) {
            $test = strtolower((string) $program->required_language_test);
            $testLabel = match ($test) {
                'ielts' => 'IELTS',
                'toefl' => 'TOEFL',
                'pte' => 'PTE',
                'moi' => 'MOI',
                'cambridge' => 'Cambridge',
                'duolingo' => 'Duolingo',
                default => ucfirst($test),
            };
            $qualification = $qualifications->first(
                fn ($item) => strtolower((string) $item->test_type) === $test
                    || ($test === 'moi' && strtolower((string) $item->test_type) === 'moi'),
            );

            if (! $qualification) {
                $unknown[] = "No {$testLabel} result recorded. MOI or another certificate must be confirmed with the university before assuming it is accepted.";
            } elseif ($qualification->isExpired()) {
                $unmet[] = "{$testLabel} certificate is expired.";
                $hardFail = true;
            } elseif ($qualification->score === null) {
                $unknown[] = "{$testLabel} is recorded without a score.";
            } elseif ($program->minimum_language_score !== null && $qualification->score < (float) $program->minimum_language_score) {
                $unmet[] = "Minimum {$testLabel} score is {$program->minimum_language_score}; your recorded score is {$qualification->score}.";
                $hardFail = true;
            } else {
                $matching[] = "{$testLabel} result meets the published requirement.";
            }
        } else {
            $unknown[] = 'The language requirement is not published for this program.';
        }

        // 5. Professional experience (only when the program makes it mandatory).
        if ($program->minimum_work_experience_months) {
            $months = $user->workExperiences->sum(fn ($experience) => $experience->months());

            if ($user->workExperiences->isEmpty()) {
                $unknown[] = 'Work experience is not recorded.';
            } elseif ($months < $program->minimum_work_experience_months) {
                $unmet[] = "The program requires {$program->minimum_work_experience_months} months of experience; you recorded {$months} months.";
                $hardFail = true;
            } else {
                $matching[] = 'Professional experience meets the published minimum.';
            }
        }

        // 6. Admission call, deadline and applicant categories.
        if (! $call) {
            $unknown[] = 'No verified upcoming admission call is stored for this program.';
        } else {
            if ($call->deadline !== null && $call->deadline->isPast()) {
                $unmet[] = 'The application deadline has passed.';
                $hardFail = true;
            } elseif ($call->daysLeft() !== null) {
                $matching[] = "Application deadline: {$call->deadline->format('d M Y')} ({$call->daysLeft()} days left).";
            }

            $categories = $call->applicant_categories ?? [];
            if ($categories !== []) {
                $category = $profile?->applicant_category;
                if (! filled($category)) {
                    $unknown[] = 'The call restricts applicant categories; your applicant category is not set.';
                } elseif (! $this->hasSubject($categories, $category)) {
                    $unmet[] = "Applicant category '{$category}' is not listed in this call.";
                    $hardFail = true;
                } else {
                    $matching[] = 'Applicant category is accepted by this call.';
                }
            }
        }

        // 7. Tuition budget (preference, not an admission requirement).
        if ($preferences?->max_tuition !== null && $program->tuition_max !== null) {
            if ((float) $program->tuition_max <= (float) $preferences->max_tuition) {
                $matching[] = 'Tuition is within your stated budget.';
            } else {
                $gap = (float) $program->tuition_max - (float) $preferences->max_tuition;
                $unmet[] = 'Tuition is €'.number_format($gap, 0).' above your stated budget.';
                $preferenceGap = true;
            }
        }

        // 8. Study preferences: institution type and subject relevance.
        if ($preferences) {
            if (in_array($preferences->institution_type, ['public', 'private'], true)
                && $program->university
                && $preferences->institution_type !== $program->university->type) {
                $unmet[] = "You prefer {$preferences->institution_type} universities; this is a {$program->university->type} university.";
                $preferenceGap = true;
            }

            $subjects = $preferences->subject_areas ?? [];
            if ($subjects !== [] && ! $this->hasSubject($subjects, $program->subject_area)) {
                $unmet[] = "{$program->subject_area} is outside your selected subject areas.";
                $preferenceGap = true;
            }
        }

        // 9. Scholarship availability when the applicant needs funding.
        if ($preferences?->needs_scholarship) {
            $hasScholarship = $this->hasRegionalScholarship($program);
            if ($hasScholarship) {
                $matching[] = 'At least one tracked scholarship covers this university region.';
            } else {
                $unmet[] = 'No tracked scholarship covers this university region yet.';
                $preferenceGap = true;
            }
        }

        $total = count($matching) + count($unmet) + count($unknown);
        $score = $total > 0 ? (int) round((count($matching) / $total) * 100) : 0;

        if ($hardFail) {
            $status = EligibilityAssessment::NOT_ELIGIBLE;
        } elseif ($unknown !== []) {
            $status = EligibilityAssessment::INSUFFICIENT_EVIDENCE;
        } elseif ($preferenceGap) {
            $status = $score < 50 ? EligibilityAssessment::AMBITIOUS : EligibilityAssessment::POTENTIAL_MATCH;
        } else {
            $status = EligibilityAssessment::LIKELY_ELIGIBLE;
        }

        return [
            'status' => $status,
            'score' => $score,
            'matching_criteria' => array_values($matching),
            'unmet_criteria' => array_values($unmet),
            'unknown_criteria' => array_values($unknown),
            'evidence_urls' => $this->evidenceUrls($program, $call),
            'admission_call_id' => $call?->id,
            'next_action' => $this->nextAction($status, $call, $unknown),
        ];
    }

    private function upcomingCall(Program $program): ?AdmissionCall
    {
        return $program->admissionCalls
            ->filter(fn (AdmissionCall $call) => $call->deadline === null || ! $call->deadline->isPast())
            ->sortBy(fn (AdmissionCall $call) => $call->deadline?->timestamp ?? PHP_INT_MAX)
            ->first();
    }

    private function degreeRank(?string $level): int
    {
        return match (strtolower((string) $level)) {
            'high_school' => 1,
            'bachelor' => 2,
            'master' => 3,
            'phd' => 4,
            default => 0,
        };
    }

    /** @param array<int, string> $values */
    private function hasSubject(array $values, string $needle): bool
    {
        $needle = strtolower(trim($needle));

        foreach ($values as $value) {
            $value = strtolower(trim((string) $value));
            if ($value === '') {
                continue;
            }
            if ($value === $needle || str_contains($value, $needle) || str_contains($needle, $value)) {
                return true;
            }
        }

        return false;
    }

    private function hasRegionalScholarship(Program $program): bool
    {
        $region = $program->university?->region;

        if (! $region) {
            return false;
        }

        return \App\Models\Scholarship::where('region', $region)
            ->whereHas('calls', fn ($query) => $query->whereDate('deadline', '>=', now()->toDateString()))
            ->exists();
    }

    /** @return array<int, string> */
    private function evidenceUrls(Program $program, ?AdmissionCall $call): array
    {
        return array_values(array_unique(array_filter([
            $call?->source_url,
            $program->source_url,
            $program->application_url,
            $program->university?->admissions_page_url,
        ])));
    }

    private function nextAction(string $status, ?AdmissionCall $call, array $unknown): string
    {
        return match ($status) {
            EligibilityAssessment::NOT_ELIGIBLE => 'Review the unmet mandatory criteria and target programs that match your degree and prerequisites.',
            EligibilityAssessment::INSUFFICIENT_EVIDENCE => 'Add the missing profile data or confirm it with the university: '.($unknown[0] ?? 'official requirements not published.'),
            EligibilityAssessment::AMBITIOUS => 'Confirm funding options and tuition before investing time in this application.',
            EligibilityAssessment::POTENTIAL_MATCH => 'Compare the unmet preferences, then decide whether to bookmark or apply.',
            default => $call?->deadline
                ? "Prepare the required documents before {$call->deadline->format('d M Y')}."
                : 'Confirm the next intake dates on the official university page.',
        };
    }
}
