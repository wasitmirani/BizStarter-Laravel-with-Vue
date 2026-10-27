<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LanguageQualification extends Model
{
    protected $guarded = [];

    protected $casts = [
        'score' => 'float',
        'score_max' => 'float',
        'certificate_available' => 'boolean',
        'issue_date' => 'date',
        'expiry_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isExpired(): bool
    {
        return $this->expiry_date !== null && $this->expiry_date->isPast();
    }
}
