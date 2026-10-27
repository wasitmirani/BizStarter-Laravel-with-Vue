<?php

use App\Jobs\SendAdmissionsDigest;
use App\Models\DailyReport;
use App\Models\NotificationDelivery;
use App\Models\NotificationPreference;
use App\Models\User;
use App\Notifications\AdmissionsDigestNotification;
use App\Services\Admissions\DigestService;
use App\Services\Admissions\EligibilityEngine;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Queue;

function admissionsDigestUser(): User
{
    $user = admissionsApplicant();
    admissionsProgram();

    app(EligibilityEngine::class)->recalculateForUser($user);

    NotificationPreference::create([
        'user_id' => $user->id,
        'email' => $user->email,
        'frequency' => 'daily',
        'preferred_time' => '09:00',
        'timezone' => 'UTC',
        'reminder_windows' => [7],
    ]);

    return $user->fresh();
}

it('builds a digest from stored assessments only', function () {
    $user = admissionsDigestUser();

    $report = app(DigestService::class)->generate($user);

    expect($report->payload['counts']['likely_eligible'])->toBe(1)
        ->and($report->payload['counts']['potential_match'])->toBe(0)
        ->and($report->payload['top_matches'])->toHaveCount(1)
        ->and($report->summary)->toContain('You have 1 likely eligible');

    // Same user and day refreshes the existing report instead of duplicating it.
    app(DigestService::class)->generate($user);

    expect(DailyReport::where('user_id', $user->id)->count())->toBe(1);
});

it('sends an email digest and records the delivery', function () {
    Notification::fake();

    $user = admissionsDigestUser();

    (new SendAdmissionsDigest($user->id, 'email', 'digest:email:once'))
        ->handle(app(DigestService::class));

    Notification::assertSentTo($user, AdmissionsDigestNotification::class);

    expect(NotificationDelivery::where('dedupe_key', 'digest:email:once')->value('status'))->toBe('sent')
        ->and(NotificationDelivery::where('dedupe_key', 'digest:email:once')->value('sent_at'))->not->toBeNull()
        ->and(DailyReport::where('user_id', $user->id)->value('delivered_at'))->not->toBeNull();
});

it('does not send the same digest twice for one dedupe key', function () {
    Notification::fake();

    $user = admissionsDigestUser();
    $job = new SendAdmissionsDigest($user->id, 'email', 'digest:email:dedupe');

    $job->handle(app(DigestService::class));
    $job->handle(app(DigestService::class));

    Notification::assertSentToTimes($user, AdmissionsDigestNotification::class, 1);
    expect(NotificationDelivery::where('dedupe_key', 'digest:email:dedupe')->count())->toBe(1);
});

it('skips the slack digest when no webhook is configured', function () {
    Http::fake();

    $user = admissionsDigestUser();

    (new SendAdmissionsDigest($user->id, 'slack', 'digest:slack:missing'))
        ->handle(app(DigestService::class));

    Http::assertNothingSent();

    expect(NotificationDelivery::where('dedupe_key', 'digest:slack:missing')->value('status'))->toBe('skipped');
});

it('posts the slack digest when a webhook is configured', function () {
    Http::fake();

    $user = admissionsDigestUser();
    $user->notificationPreference->update([
        'slack_enabled' => true,
        'slack_webhook_url' => 'https://hooks.slack.test/services/demo',
    ]);

    (new SendAdmissionsDigest($user->id, 'slack', 'digest:slack:configured'))
        ->handle(app(DigestService::class));

    Http::assertSent(fn ($request) => $request->url() === 'https://hooks.slack.test/services/demo');

    expect(NotificationDelivery::where('dedupe_key', 'digest:slack:configured')->value('status'))->toBe('sent');
});

it('queues digests when the local hour matches the preference', function () {
    Queue::fake();

    $this->travelTo(now()->copy()->setTime(9, 30));

    $user = admissionsDigestUser();

    $this->artisan('admissions:send-digests')->assertSuccessful();

    Queue::assertPushed(SendAdmissionsDigest::class, function (SendAdmissionsDigest $job) use ($user) {
        return $job->userId === $user->id
            && $job->channel === 'email'
            && str_contains($job->dedupeKey, "admissions-digest:{$user->id}:email:");
    });
});

it('does not queue digests for users who turned them off', function () {
    Queue::fake();

    $this->travelTo(now()->copy()->setTime(9, 30));

    $user = admissionsDigestUser();
    $user->notificationPreference->update(['frequency' => 'off']);

    $this->artisan('admissions:send-digests')->assertSuccessful();

    Queue::assertNotPushed(SendAdmissionsDigest::class);
});

it('does not queue digests outside the preferred hour', function () {
    Queue::fake();

    $this->travelTo(now()->copy()->setTime(14, 0));

    admissionsDigestUser();

    $this->artisan('admissions:send-digests')->assertSuccessful();

    Queue::assertNotPushed(SendAdmissionsDigest::class);
});
