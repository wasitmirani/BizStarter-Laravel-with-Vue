<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationPreference extends Model
{
    protected $guarded = [];

    protected $hidden = ['slack_webhook_url'];

    protected $casts = [
        'reminder_windows' => 'array',
        'scholarship_alerts' => 'boolean',
        'new_announcements' => 'boolean',
        'eligibility_change_alerts' => 'boolean',
        'slack_enabled' => 'boolean',
        'slack_webhook_url' => 'encrypted',
        'last_notified_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function hasSlackWebhook(): bool
    {
        return $this->slack_enabled && filled($this->slack_webhook_url);
    }
}
