<?php

namespace App\Services\Admissions;

use App\Models\DailyReport;
use App\Models\EligibilityAssessment;
use App\Models\User;

class DigestService
{
    /**
     * Build (or refresh) today's report for a user from stored assessments only.
     */
    public function generate(User $user, string $type = 'daily'): DailyReport
    {
        $assessments = $user->eligibilityAssessments()->get();

        $counts = [
            'likely_eligible' => $assessments->where('status', EligibilityAssessment::LIKELY_ELIGIBLE)->count(),
            'potential_match' => $assessments->where('status', EligibilityAssessment::POTENTIAL_MATCH)->count(),
            'needs_verification' => $assessments->where('status', EligibilityAssessment::INSUFFICIENT_EVIDENCE)->count(),
            'not_eligible' => $assessments->where('status', EligibilityAssessment::NOT_ELIGIBLE)->count(),
        ];

        $topMatches = $assessments
            ->whereIn('status', [EligibilityAssessment::LIKELY_ELIGIBLE, EligibilityAssessment::POTENTIAL_MATCH])
            ->sortByDesc('score')
            ->take(5)
            ->map(fn (EligibilityAssessment $assessment) => [
                'program_id' => $assessment->program_id,
                'status' => $assessment->status,
                'score' => $assessment->score,
            ])
            ->values()
            ->all();

        $summary = sprintf(
            'You have %d likely eligible and %d potential matches. %d programs still need verification.',
            $counts['likely_eligible'],
            $counts['potential_match'],
            $counts['needs_verification'],
        );

        $payload = [
            'counts' => $counts,
            'top_matches' => $topMatches,
            'generated_at' => now()->toIso8601String(),
        ];

        // whereDate keeps the lookup correct on every driver: the date cast is
        // stored as a datetime string, so a plain equality match can miss on SQLite.
        $report = DailyReport::query()
            ->where('user_id', $user->id)
            ->whereDate('report_date', now()->toDateString())
            ->where('type', $type)
            ->first();

        if ($report) {
            $report->update(['summary' => $summary, 'payload' => $payload]);

            return $report;
        }

        return DailyReport::create([
            'user_id' => $user->id,
            'report_date' => now()->toDateString(),
            'type' => $type,
            'summary' => $summary,
            'payload' => $payload,
        ]);
    }

    /**
     * Count high-confidence matches with a deadline inside the user's shortest reminder window.
     */
    public function urgentDeadlineCount(User $user, int $window = 7): int
    {
        return $user->eligibilityAssessments()
            ->whereIn('status', [EligibilityAssessment::LIKELY_ELIGIBLE, EligibilityAssessment::POTENTIAL_MATCH])
            ->whereHas('admissionCall', function ($query) use ($window) {
                $query->whereBetween('deadline', [now()->toDateString(), now()->addDays($window)->toDateString()]);
            })
            ->count();
    }
}
