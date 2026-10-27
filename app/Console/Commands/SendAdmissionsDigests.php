<?php

namespace App\Console\Commands;

use App\Jobs\SendAdmissionsDigest;
use App\Models\NotificationPreference;
use App\Services\Admissions\DigestService;
use Illuminate\Console\Command;
use Throwable;

class SendAdmissionsDigests extends Command
{
    protected $signature = 'admissions:send-digests';

    protected $description = 'Queue admissions digest emails and Slack messages for users whose schedule is due';

    public function handle(DigestService $digests): int
    {
        $now = now();
        $queued = 0;

        NotificationPreference::query()
            ->with('user')
            ->where('frequency', '!=', 'off')
            ->chunkById(100, function ($preferences) use ($now, $digests, &$queued) {
                foreach ($preferences as $preference) {
                    $user = $preference->user;

                    if (! $user || ! $user->is_active) {
                        continue;
                    }

                    if ($user->eligibilityAssessments()->doesntExist()) {
                        continue;
                    }

                    try {
                        $local = $now->copy()->setTimezone($preference->timezone ?: config('app.timezone', 'UTC'));
                    } catch (Throwable) {
                        $local = $now->copy();
                    }

                    if ($local->hour !== $this->preferredHour($preference)) {
                        continue;
                    }

                    if ($preference->frequency === 'weekly' && ! $local->isMonday()) {
                        continue;
                    }

                    if ($preference->frequency === 'urgent_only') {
                        $window = min($preference->reminder_windows ?: [7]);

                        if ($digests->urgentDeadlineCount($user, $window) === 0) {
                            continue;
                        }
                    }

                    $date = $local->toDateString();

                    if (filled($preference->email ?? $user->email)) {
                        SendAdmissionsDigest::dispatch(
                            $user->id,
                            'email',
                            "admissions-digest:{$user->id}:email:{$date}",
                        );
                        $queued++;
                    }

                    if ($preference->slack_enabled && $preference->hasSlackWebhook()) {
                        SendAdmissionsDigest::dispatch(
                            $user->id,
                            'slack',
                            "admissions-digest:{$user->id}:slack:{$date}",
                        );
                        $queued++;
                    }
                }
            });

        $this->info("Queued {$queued} admissions digest message(s).");

        return self::SUCCESS;
    }

    private function preferredHour(NotificationPreference $preference): int
    {
        $time = (string) ($preference->preferred_time ?? '09:00');

        return (int) substr($time, 0, 2);
    }
}
