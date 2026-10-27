<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admissions\ProfileRequest;
use App\Models\AuditLog;
use App\Models\UserProfile;
use App\Services\Admissions\EligibilityEngine;
use App\Services\Admissions\ProfileCompletionService;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function __construct(
        protected ProfileCompletionService $completion,
        protected EligibilityEngine $engine,
    ) {}

    public function show(Request $request)
    {
        $user = $request->user();
        $profile = UserProfile::firstOrCreate(['user_id' => $user->id]);

        return responseJson('Profile fetched successfully', [
            'profile' => $profile,
            'completion' => $this->completion->forUser($user),
            'education' => $user->educations()->orderByDesc('graduation_year')->get(),
            'language_qualifications' => $user->languageQualifications()->latest()->get(),
            'work_experiences' => $user->workExperiences()->latest('start_date')->get(),
            'study_preferences' => $user->studyPreference,
            'notification_preferences' => $user->notificationPreference,
            'slack_webhook_configured' => filled($user->notificationPreference?->slack_webhook_url),
        ]);
    }

    public function update(ProfileRequest $request)
    {
        $user = $request->user();
        $profile = UserProfile::firstOrCreate(['user_id' => $user->id]);

        $data = collect($request->validated())->except('complete')->toArray();
        $profile->fill($data);

        if ($request->boolean('complete')) {
            $profile->onboarding_completed_at = now();
            $profile->onboarding_step = 6;
        }

        $profile->save();

        AuditLog::record('profile.updated', $profile);
        $this->engine->recalculateForUser($user->fresh());

        return responseJson('Profile updated successfully', [
            'profile' => $profile->fresh(),
            'completion' => $this->completion->forUser($user->fresh()),
        ]);
    }
}
