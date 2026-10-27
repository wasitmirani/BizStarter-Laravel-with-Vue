<?php

namespace App\Services\Admissions;

use App\Models\User;

class ProfileCompletionService
{
    /**
     * Completion is intentionally based on the data the matching engine needs,
     * not on optional fields such as work experience.
     *
     * @return array{percentage:int, completed:int, total:int, missing:array<int, array{step:string,label:string}>}
     */
    public function forUser(User $user): array
    {
        $profile = $user->profile;
        $preferences = $user->studyPreference;
        $educations = $user->educations()->get();
        $languages = $user->languageQualifications()->get();

        $checks = [
            'personal' => [
                'label' => 'Full name',
                'done' => filled($profile?->full_name),
            ],
            'nationality' => [
                'label' => 'Nationality',
                'done' => filled($profile?->nationality),
            ],
            'residence' => [
                'label' => 'Country of residence',
                'done' => filled($profile?->country_of_residence),
            ],
            'intake' => [
                'label' => 'Target intake year',
                'done' => filled($profile?->target_intake_year),
            ],
            'education' => [
                'label' => 'At least one education record',
                'done' => $educations->isNotEmpty(),
            ],
            'grading' => [
                'label' => 'Grading scale and result',
                'done' => $educations->contains(fn ($education) => $education->grade_value !== null && $education->grade_max !== null),
            ],
            'language' => [
                'label' => 'Language qualification or MOI',
                'done' => $languages->isNotEmpty(),
            ],
            'subjects' => [
                'label' => 'At least one subject preference',
                'done' => ! empty($preferences?->subject_areas),
            ],
            'budget' => [
                'label' => 'Maximum tuition budget',
                'done' => $preferences?->max_tuition !== null,
            ],
            'notifications' => [
                'label' => 'Notification preferences',
                'done' => $user->notificationPreference !== null,
            ],
        ];

        $completed = collect($checks)->where('done', true)->count();
        $total = count($checks);

        $missing = collect($checks)
            ->reject(fn ($check) => $check['done'])
            ->map(fn ($check, $key) => [
                'step' => $key,
                'label' => $check['label'],
            ])
            ->values()
            ->all();

        return [
            'percentage' => $total > 0 ? (int) round(($completed / $total) * 100) : 0,
            'completed' => $completed,
            'total' => $total,
            'missing' => $missing,
        ];
    }
}
