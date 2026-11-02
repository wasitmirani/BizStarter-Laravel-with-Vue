<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subscription extends Model
{
    public const STATUS_TRIALING = 'trialing';
    public const STATUS_ACTIVE = 'active';
    public const STATUS_PAST_DUE = 'past_due';
    public const STATUS_CANCELED = 'canceled';
    public const STATUS_EXPIRED = 'expired';

    protected $guarded = [];

    protected $casts = [
        'trial_ends_at' => 'datetime',
        'current_period_start' => 'datetime',
        'current_period_end' => 'datetime',
        'canceled_at' => 'datetime',
        'cancel_at_period_end' => 'boolean',
        'meta' => 'array',
    ];

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', [self::STATUS_TRIALING, self::STATUS_ACTIVE]);
    }

    public function isTrialing(): bool
    {
        return $this->status === self::STATUS_TRIALING
            && (! $this->trial_ends_at || $this->trial_ends_at->isFuture());
    }

    public function isActive(): bool
    {
        if (! in_array($this->status, [self::STATUS_TRIALING, self::STATUS_ACTIVE], true)) {
            return false;
        }

        if ($this->isTrialing()) {
            return true;
        }

        return ! $this->current_period_end || $this->current_period_end->isFuture();
    }

    public function onGracePeriod(): bool
    {
        return $this->cancel_at_period_end
            && $this->current_period_end
            && $this->current_period_end->isFuture();
    }

    public function trialDaysLeft(): int
    {
        if (! $this->trial_ends_at) {
            return 0;
        }

        return max(0, (int) now()->startOfDay()->diffInDays($this->trial_ends_at->startOfDay(), false));
    }

    public function periodLabel(): string
    {
        if ($this->isTrialing()) {
            return 'Trial';
        }

        return ucfirst($this->billing_cycle);
    }
}
