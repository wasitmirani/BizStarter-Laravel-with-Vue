<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProfile extends Model
{
    protected $guarded = [];

    protected $casts = [
        'onboarding_completed_at' => 'datetime',
        'target_intake_year' => 'integer',
        'onboarding_step' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isComplete(): bool
    {
        return $this->onboarding_completed_at !== null;
    }
}
