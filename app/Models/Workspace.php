<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Workspace extends Model
{
    protected $guarded = [];

    protected $casts = [
        'settings' => 'array',
        'trial_ends_at' => 'datetime',
        'suspended_at' => 'datetime',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'workspace_members')
            ->using(WorkspaceMember::class)
            ->withPivot(['id', 'role', 'joined_at'])
            ->withTimestamps();
    }

    public function memberRecords(): HasMany
    {
        return $this->hasMany(WorkspaceMember::class);
    }

    public function subscription(): HasOne
    {
        return $this->hasOne(Subscription::class)->latestOfMany();
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class)->latest('issued_at');
    }

    public function invitations(): HasMany
    {
        return $this->hasMany(WorkspaceInvitation::class)->latest();
    }

    public function plan(): ?Plan
    {
        return $this->subscription?->plan;
    }

    public function whatsappAccount(): HasOne
    {
        return $this->hasOne(WhatsAppAccount::class);
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(CrmContact::class);
    }

    public function tags(): HasMany
    {
        return $this->hasMany(CrmTag::class);
    }

    public function conversations(): HasMany
    {
        return $this->hasMany(CrmConversation::class);
    }

    public function crmTemplates(): HasMany
    {
        return $this->hasMany(CrmTemplate::class);
    }

    public function campaigns(): HasMany
    {
        return $this->hasMany(CrmCampaign::class);
    }

    public function isSuspended(): bool
    {
        return $this->suspended_at !== null;
    }

    public function hasActiveSubscription(): bool
    {
        return (bool) $this->subscription?->isActive();
    }

    /**
     * Seat and resource usage for the current billing period.
     */
    public function usage(): array
    {
        $plan = $this->plan();
        $seatLimit = (int) ($plan?->limit('seats', 1) ?? 1);
        $memberCount = $this->memberRecords()->count();

        return [
            'members' => [
                'used' => $memberCount,
                'limit' => $seatLimit,
                'unlimited' => $seatLimit < 0,
                'percent' => $seatLimit > 0 ? min(100, (int) round($memberCount / $seatLimit * 100)) : 100,
            ],
            'storage' => [
                'used_mb' => 0,
                'limit_mb' => (int) ($plan?->limit('storage_mb', 1024) ?? 1024),
                'unlimited' => (int) ($plan?->limit('storage_mb', 1024) ?? 1024) < 0,
                'percent' => 0,
            ],
            'api_calls' => [
                'used' => 0,
                'limit' => (int) ($plan?->limit('api_calls', 10000) ?? 10000),
                'unlimited' => (int) ($plan?->limit('api_calls', 10000) ?? 10000) < 0,
                'percent' => 0,
            ],
        ];
    }
}
