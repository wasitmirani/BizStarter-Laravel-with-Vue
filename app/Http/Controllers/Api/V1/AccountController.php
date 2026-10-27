<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AccountController extends Controller
{
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
