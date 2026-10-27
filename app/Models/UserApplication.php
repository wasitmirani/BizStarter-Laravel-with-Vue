<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserApplication extends Model
{
    public const STATUSES = ['planned', 'in_progress', 'submitted', 'offer', 'rejected', 'withdrawn'];

    protected $guarded = [];

    protected $casts = [
        'submitted_at' => 'datetime',
        'decision_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function admissionCall(): BelongsTo
    {
        return $this->belongsTo(AdmissionCall::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(ApplicationDocument::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(UserTask::class);
    }
}
