<?php

use App\Models\ApplicationDocument;
use App\Models\DailyReport;
use App\Models\EligibilityAssessment;
use App\Models\Program;
use App\Models\University;
use App\Models\User;
use App\Models\UserApplication;
use App\Models\UserProgramBookmark;
use App\Models\UserTask;
use Laravel\Sanctum\Sanctum;

function isolationProgram(): Program
{
    $existing = Program::where('slug', 'msc-isolation')->first();

    if ($existing) {
        return $existing;
    }

    $university = University::create([
        'name' => 'Isolation University',
        'slug' => 'isolation-university',
        'region' => 'Lazio',
        'type' => 'public',
    ]);

    return $program = Program::create([
        'university_id' => $university->id,
        'title' => 'MSc Isolation',
        'slug' => 'msc-isolation',
        'subject_area' => 'Computer Science',
        'language' => 'en',
        'verification_status' => 'confirmed',
    ]);
}

function isolationUser(string $suffix): User
{
    $user = User::factory()->create();
    $program = isolationProgram();

    $application = UserApplication::create([
        'user_id' => $user->id,
        'program_id' => $program->id,
        'status' => 'planned',
    ]);

    $user->tasks()->create(['title' => "Private task {$suffix}", 'status' => 'pending']);

    ApplicationDocument::create([
        'user_application_id' => $application->id,
        'user_id' => $user->id,
        'type' => 'cv',
        'name' => "CV {$suffix}",
        'path' => "admissions/{$user->id}/cv.pdf",
        'original_name' => 'cv.pdf',
    ]);

    DailyReport::create([
        'user_id' => $user->id,
        'report_date' => now()->toDateString(),
        'type' => 'daily',
        'summary' => "Report {$suffix}",
    ]);

    UserProgramBookmark::create(['user_id' => $user->id, 'program_id' => $program->id]);

    EligibilityAssessment::create([
        'user_id' => $user->id,
        'program_id' => $program->id,
        'status' => EligibilityAssessment::POTENTIAL_MATCH,
        'score' => 60,
    ]);

    return $user;
}

it('rejects unauthenticated access to applicant endpoints', function () {
    $this->getJson('/api/v1/profile')->assertUnauthorized();
    $this->getJson('/api/v1/dashboard')->assertUnauthorized();
});

it('keeps every private record scoped to its owner', function () {
    $userA = isolationUser('A');
    $userB = isolationUser('B');

    Sanctum::actingAs($userA);

    $this->getJson('/api/v1/applications')
        ->assertOk()
        ->assertJsonPath('result.applications.0.program.title', 'MSc Isolation')
        ->assertJsonMissing(['status' => 'submitted']);

    // User B's application is not accessible by id.
    $applicationB = $userB->applications()->first();
    $this->getJson("/api/v1/applications/{$applicationB->id}")->assertForbidden();
    $this->putJson("/api/v1/applications/{$applicationB->id}", ['program_id' => isolationProgram()->id])->assertForbidden();
    $this->deleteJson("/api/v1/applications/{$applicationB->id}")->assertForbidden();

    // User B's task.
    $taskB = $userB->tasks()->first();
    $this->putJson("/api/v1/tasks/{$taskB->id}", ['title' => 'Hijacked'])->assertForbidden();
    $this->deleteJson("/api/v1/tasks/{$taskB->id}")->assertForbidden();

    // User B's document (metadata and binary download).
    $documentB = $userB->documents()->first();
    $this->getJson("/api/v1/documents/{$documentB->id}/download")->assertForbidden();
    $this->deleteJson("/api/v1/documents/{$documentB->id}")->assertForbidden();

    // Reports and matches only contain the authenticated user's rows.
    $this->getJson('/api/v1/reports')
        ->assertOk()
        ->assertJsonPath('result.reports.0.user_id', $userA->id);

    $this->getJson('/api/v1/eligibility')
        ->assertOk()
        ->assertJsonPath('result.assessments.0.id', $userA->eligibilityAssessments()->first()->id);

    // Notification settings are per account.
    $this->putJson('/api/v1/notification-preferences', [
        'frequency' => 'daily',
        'email' => 'a@example.test',
    ])->assertOk();

    expect($userB->notificationPreference()->first())->toBeNull();
});

it('removes another user bookmark only from the acting account', function () {
    $userA = isolationUser('A');
    $userB = isolationUser('B');

    Sanctum::actingAs($userA);

    $this->deleteJson('/api/v1/bookmarks/'.isolationProgram()->id)->assertOk();

    expect(UserProgramBookmark::where('user_id', $userA->id)->exists())->toBeFalse()
        ->and(UserProgramBookmark::where('user_id', $userB->id)->exists())->toBeTrue();
});
