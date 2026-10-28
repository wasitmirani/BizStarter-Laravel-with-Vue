<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use App\Services\Admissions\ProfileCompletionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AccountController extends Controller
{
    public function show(Request $request, ProfileCompletionService $completion)
    {
        $user = $request->user()->load('roles:id,name');

        return responseJson('Account fetched successfully', [
            'user' => $this->userPayload($user),
            'completion' => $completion->forUser($user),
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'string', 'email', 'max:190', Rule::unique('users', 'email')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:30'],
            'first_name' => ['nullable', 'string', 'max:80'],
            'last_name' => ['nullable', 'string', 'max:80'],
        ]);

        $emailChanged = strcasecmp($data['email'], (string) $user->email) !== 0;

        $user->fill($data);

        if ($emailChanged) {
            $user->email_verified_at = null;
        }

        $user->save();

        AuditLog::record('account.updated', $user, ['fields' => array_keys($data)]);

        return responseJson('Account updated successfully', [
            'user' => $this->userPayload($user->fresh('roles')),
        ]);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = $request->user();
        $user->forceFill(['password' => Hash::make((string) $request->input('password'))])->save();

        // Keep the current session signed in, revoke every other personal access token.
        $currentTokenId = $user->currentAccessToken()?->id;

        if ($currentTokenId) {
            $user->tokens()->whereKeyNot($currentTokenId)->delete();
        }

        AuditLog::record('account.password_updated', $user);

        return responseJson('Password updated successfully');
    }

    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $user = $request->user();
        $path = $request->file('avatar')->store('images/user', 'public');

        $user->thumbnail = basename($path);
        $user->save();

        AuditLog::record('account.avatar_updated', $user);

        return responseJson('Avatar updated successfully', [
            'thumbnail' => $user->thumbnail,
        ]);
    }

    private function userPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'phone' => $user->phone,
            'user_name' => $user->user_name,
            'thumbnail' => $user->thumbnail,
            'roles' => $user->relationLoaded('roles') ? $user->roles->map(fn ($role) => ['id' => $role->id, 'name' => $role->name])->values() : [],
            'email_verified_at' => $user->email_verified_at?->toIso8601String(),
            'last_login' => $user->last_login,
            'created_at' => $user->created_at?->toIso8601String(),
        ];
    }

    public function export(Request $request)
    {
        $user = $request->user()->load([
            'profile',
            'educations',
            'languageQualifications',
            'workExperiences',
            'studyPreference',
            'notificationPreference',
            'applications.program',
            'tasks',
            'documents',
            'dailyReports',
        ]);

        $export = [
            'exported_at' => now()->toIso8601String(),
            'account' => [
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at?->toIso8601String(),
            ],
            'profile' => $user->profile,
            'education' => $user->educations,
            'language_qualifications' => $user->languageQualifications,
            'work_experiences' => $user->workExperiences,
            'study_preferences' => $user->studyPreference,
            // Webhook secrets are intentionally excluded from exports.
            'notification_preferences' => $user->notificationPreference?->makeHidden('slack_webhook_url'),
            'applications' => $user->applications,
            'tasks' => $user->tasks,
            'documents' => $user->documents,
            'reports' => $user->dailyReports,
        ];

        return responseJson('Personal data exported successfully', $export);
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        AuditLog::record('account.deleted', $user, ['email' => $user->email]);

        $user->tokens()->delete();
        $user->delete();

        return responseJson('Account deleted successfully');
    }
}
