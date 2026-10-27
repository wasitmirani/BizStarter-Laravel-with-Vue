<?php

namespace App\Jobs;

use App\Models\NotificationDelivery;
use App\Models\User;
use App\Notifications\AdmissionsDigestNotification;
use App\Services\Admissions\DigestService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Throwable;

class SendAdmissionsDigest implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $backoff = 60;

    public function __construct(
        public int $userId,
        public string $channel,
        public string $dedupeKey,
    ) {}

    public function handle(DigestService $digests): void
    {
        $user = User::with('notificationPreference')->find($this->userId);

        if (! $user?->notificationPreference) {
            return;
        }

        $preferences = $user->notificationPreference;

        $delivery = NotificationDelivery::firstOrCreate(
            ['dedupe_key' => $this->dedupeKey],
            [
                'user_id' => $user->id,
                'channel' => $this->channel,
                'subject' => 'Admissions digest',
                'status' => 'queued',
            ],
        );

        if ($delivery->status === 'sent') {
            return;
        }

        try {
            $report = $digests->generate($user);

            if ($this->channel === 'slack') {
                if (! $preferences->hasSlackWebhook()) {
                    $delivery->update(['status' => 'skipped']);

                    return;
                }

                Http::timeout(10)->post($preferences->slack_webhook_url, [
                    'text' => "*Admissions digest — {$report->report_date->format('d M Y')}*\n{$report->summary}",
                ])->throw();
            } else {
                $user->notify(new AdmissionsDigestNotification($report));
                $report->update(['delivered_at' => now()]);
            }

            $delivery->update([
                'status' => 'sent',
                'sent_at' => now(),
                'error' => null,
            ]);
        } catch (Throwable $exception) {
            $delivery->update([
                'status' => 'failed',
                'attempts' => $delivery->attempts + 1,
                'error' => Str::limit($exception->getMessage(), 500),
            ]);

            throw $exception;
        }
    }
}
