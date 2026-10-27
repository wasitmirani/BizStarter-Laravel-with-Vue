<?php

use App\Models\AdmissionCall;
use App\Models\EligibilityAssessment;
use App\Models\LanguageQualification;
use App\Models\Program;
use App\Models\Scholarship;
use App\Models\ScholarshipCall;
use App\Models\StudyPreference;
use App\Models\University;
use App\Models\User;
use App\Models\UserProfile;
use App\Services\Admissions\EligibilityEngine;

function admissionsProgram(array $overrides = []): Program
{
    $university = University::create([
        'name' => 'Test University',
        'slug' => 'test-university-'.uniqid(),
        'region' => 'Lombardy',
        'type' => 'public',
    ]);

    $program = Program::create(array_merge([
        'university_id' => $university->id,
        'title' => 'MSc Computer Science',
        'slug' => 'msc-cs-'.uniqid(),
        'subject_area' => 'Computer Science',
        'language' => 'en',
        'tuition_min' => 0,
        'tuition_max' => 4000,
        'required_degree_level' => 'bachelor',
        'minimum_grade_percentage' => 70,
        'required_subjects' => ['Computer Science', 'Mathematics'],
        'required_language_test' => 'ielts',
        'minimum_language_score' => 6,
        'verification_status' => 'confirmed',
    ], $overrides));

    AdmissionCall::create([
        'program_id' => $program->id,
        'intake_year' => now()->year + 1,
        'intake_label' => 'Next intake',
        'deadline' => now()->addMonths(2)->toDateString(),
        'applicant_categories' => ['international'],
        'source_url' => 'https://example.test/admissions',
        'verification_status' => 'confirmed',
    ]);

    return $program->fresh();
}

function admissionsApplicant(array $profileOverrides = [], array $educationOverrides = []): User
{
    $user = User::factory()->create();

    UserProfile::create(array_merge([
        'user_id' => $user->id,
        'full_name' => 'Test Applicant',
        'nationality' => 'IN',
        'country_of_residence' => 'IN',
        'applicant_category' => 'international',
        'target_intake_year' => now()->year + 1,
    ], $profileOverrides));

    $user->educations()->create(array_merge([
        'qualification_title' => 'BSc Computer Science',
        'degree_level' => 'bachelor',
        'institution_name' => 'Test College',
        'institution_country' => 'IN',
        'graduation_year' => now()->year - 1,
        'grading_system' => 'percentage',
        'grade_value' => 85,
        'grade_max' => 100,
        'prerequisite_subjects' => ['Computer Science', 'Mathematics'],
        'transcript_available' => true,
        'certificate_available' => true,
    ], $educationOverrides));

    LanguageQualification::create([
        'user_id' => $user->id,
        'language' => 'en',
        'test_type' => 'ielts',
        'score' => 7,
        'score_max' => 9,
        'certificate_available' => true,
    ]);

    StudyPreference::create([
        'user_id' => $user->id,
        'subject_areas' => ['Computer Science'],
        'institution_type' => 'any',
        'max_tuition' => 5000,
        'needs_scholarship' => false,
    ]);

    return $user->fresh();
}

it('marks a fully evidenced applicant as likely eligible', function () {
    $user = admissionsApplicant();
    $program = admissionsProgram();

    Scholarship::create([
        'name' => 'Regional grant',
        'slug' => 'regional-grant-'.uniqid(),
        'provider' => 'Region',
        'region' => 'Lombardy',
        'verification_status' => 'confirmed',
    ])->calls()->create([
        'intake_year' => now()->year + 1,
        'deadline' => now()->addMonths(3)->toDateString(),
        'status' => 'open',
    ]);

    $result = app(EligibilityEngine::class)->assess($user, $program);

    expect($result['status'])->toBe(EligibilityAssessment::LIKELY_ELIGIBLE)
        ->and($result['unmet_criteria'])->toBeEmpty()
        ->and($result['evidence_urls'])->not->toBeEmpty();
});

it('returns insufficient evidence when a mandatory language result is missing', function () {
    $user = admissionsApplicant();
    $user->languageQualifications()->delete();
    $program = admissionsProgram();

    $result = app(EligibilityEngine::class)->assess($user->fresh(), $program);

    expect($result['status'])->toBe(EligibilityAssessment::INSUFFICIENT_EVIDENCE)
        ->and($result['unknown_criteria'])->not->toBeEmpty();
});

it('returns not eligible when the mandatory grade is below the minimum', function () {
    $user = admissionsApplicant([], ['grade_value' => 60]);
    $program = admissionsProgram();

    $result = app(EligibilityEngine::class)->assess($user, $program);

    expect($result['status'])->toBe(EligibilityAssessment::NOT_ELIGIBLE)
        ->and($result['unmet_criteria'])->toHaveCount(1);
});

it('does not convert an unfamiliar grading scale', function () {
    $user = admissionsApplicant([], ['grading_system' => 'gpa', 'grade_value' => 3.6, 'grade_max' => 4]);
    $program = admissionsProgram();

    $result = app(EligibilityEngine::class)->assess($user, $program);

    expect($result['status'])->toBe(EligibilityAssessment::INSUFFICIENT_EVIDENCE)
        ->and(implode(' ', $result['unknown_criteria']))->toContain('grading scale');
});

it('recalculates assessments only for the affected user', function () {
    $userA = admissionsApplicant();
    $userB = admissionsApplicant();
    admissionsProgram();

    app(EligibilityEngine::class)->recalculateForUser($userA);

    expect($userA->eligibilityAssessments()->count())->toBe(1)
        ->and($userB->eligibilityAssessments()->count())->toBe(0);
});
