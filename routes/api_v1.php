<?php

use App\Http\Controllers\Api\V1\AccountController;
use App\Http\Controllers\Api\V1\ApplicationController;
use App\Http\Controllers\Api\V1\BookmarkController;
use App\Http\Controllers\Api\V1\CatalogSyncController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\DocumentController;
use App\Http\Controllers\Api\V1\EducationRecordController;
use App\Http\Controllers\Api\V1\EligibilityController;
use App\Http\Controllers\Api\V1\LanguageQualificationController;
use App\Http\Controllers\Api\V1\NotificationPreferenceController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\ProgramController;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Controllers\Api\V1\ScholarshipController;
use App\Http\Controllers\Api\V1\StudyPreferenceController;
use App\Http\Controllers\Api\V1\TaskController;
use App\Http\Controllers\Api\V1\UniversityController;
use App\Http\Controllers\Api\V1\WorkExperienceController;
use App\Services\Admissions\ProfileCompletionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'throttle:120,1'])->prefix('v1')->group(function () {
    Route::get('/me', function (Request $request, ProfileCompletionService $completion) {
        $user = $request->user();

        return responseJson('Authenticated user', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'thumbnail' => $user->thumbnail,
            ],
            'completion' => $completion->forUser($user),
        ]);
    });

    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Private applicant profile and records.
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    Route::apiResource('education', EducationRecordController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::apiResource('language-qualifications', LanguageQualificationController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::apiResource('work-experiences', WorkExperienceController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::get('/preferences', [StudyPreferenceController::class, 'show']);
    Route::put('/preferences', [StudyPreferenceController::class, 'update']);

    Route::get('/notification-preferences', [NotificationPreferenceController::class, 'show']);
    Route::put('/notification-preferences', [NotificationPreferenceController::class, 'update']);
    Route::get('/notifications', function (Request $request) {
        return responseJson('Notification deliveries fetched successfully', [
            'deliveries' => $request->user()->notificationDeliveries()->latest()->limit(50)->get(),
        ]);
    });

    // Shared catalog.
    Route::get('/universities', [UniversityController::class, 'index']);
    Route::get('/universities/{university}', [UniversityController::class, 'show']);
    Route::post('/catalog/sync', [CatalogSyncController::class, 'sync'])->middleware('throttle:4,1');
    Route::get('/programs', [ProgramController::class, 'index']);
    Route::get('/programs/{program}', [ProgramController::class, 'show']);
    Route::get('/scholarships', [ScholarshipController::class, 'index']);
    Route::get('/scholarships/{scholarship}', [ScholarshipController::class, 'show']);

    // Personalized matches.
    Route::get('/eligibility', [EligibilityController::class, 'index']);
    Route::post('/eligibility/reassess', [EligibilityController::class, 'reassess']);

    Route::get('/bookmarks', [BookmarkController::class, 'index']);
    Route::post('/bookmarks', [BookmarkController::class, 'store']);
    Route::delete('/bookmarks/{program}', [BookmarkController::class, 'destroy']);

    // Private application workspace.
    Route::apiResource('applications', ApplicationController::class);
    Route::get('/documents', [DocumentController::class, 'index']);
    Route::post('/documents', [DocumentController::class, 'store']);
    Route::get('/documents/{document}/download', [DocumentController::class, 'download']);
    Route::delete('/documents/{document}', [DocumentController::class, 'destroy']);

    Route::apiResource('tasks', TaskController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::get('/reports', [ReportController::class, 'index']);
    Route::post('/reports/generate', [ReportController::class, 'generate']);

    Route::get('/account', [AccountController::class, 'show']);
    Route::patch('/account', [AccountController::class, 'update']);
    Route::post('/account/password', [AccountController::class, 'updatePassword']);
    Route::post('/account/avatar', [AccountController::class, 'uploadAvatar']);
    Route::get('/account/export', [AccountController::class, 'export']);
    Route::delete('/account', [AccountController::class, 'destroy']);
});
