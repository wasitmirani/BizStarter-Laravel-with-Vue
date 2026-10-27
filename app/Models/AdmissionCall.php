<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdmissionCall extends Model
{
    protected $guarded = [];

    protected $casts = [
        'opens_at' => 'date',
        'deadline' => 'date',
        'published_at' => 'date',
        'applicant_categories' => 'array',
        'requirements' => 'array',
        'verified_at' => 'datetime',
        'is_sample' => 'boolean',
    ];

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function isOpen(): bool
    {
        return $this->deadline === null || $this->deadline->isFuture() || $this->deadline->isToday();
    }

    public function daysLeft(): ?int
    {
        return $this->deadline
            ? (int) now()->startOfDay()->diffInDays($this->deadline->startOfDay(), false)
            : null;
    }
}
