<?php

namespace App\Notifications;

use App\Models\DailyReport;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdmissionsDigestNotification extends Notification
{
    use Queueable;

    public function __construct(public DailyReport $report) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $counts = $this->report->payload['counts'] ?? [];

        return (new MailMessage)
            ->subject('Your admissions digest — '.$this->report->report_date->format('d M Y'))
            ->greeting('Hello '.$notifiable->name)
            ->line($this->report->summary)
            ->line(sprintf('Likely eligible: %d', $counts['likely_eligible'] ?? 0))
            ->line(sprintf('Potential matches: %d', $counts['potential_match'] ?? 0))
            ->line(sprintf('Need verification: %d', $counts['needs_verification'] ?? 0))
            ->line(sprintf('Not eligible: %d', $counts['not_eligible'] ?? 0))
            ->action('Open your dashboard', url('/app/dashboard'))
            ->line('Match strength shows how many published criteria you satisfy. It is not a probability of admission.')
            ->line('Always confirm requirements and deadlines on the official university page.');
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'report_id' => $this->report->id,
            'summary' => $this->report->summary,
        ];
    }
}
