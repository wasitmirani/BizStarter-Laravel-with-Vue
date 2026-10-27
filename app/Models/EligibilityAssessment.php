<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EligibilityAssessment extends Model
{
    public const LIKELY_ELIGIBLE = 'likely_eligible';
    public const POTENTIAL_MATCH = 'potential_match';
    public const AMBITIOUS = 'ambitious';
    public const NOT_ELIGIBLE = 'not_eligible';
    public const INSUFFICIENT_EVIDENCE = 'insufficient_evidence';

    public const STATUSES = [
        self::LIKELY_ELIGIBLE,
        self::POTENTIAL_MATCH,
        self::AMBITIOUS,
        self::NOT_ELIGIBLE,
        self::INSUFFICIENT_EVIDENCE,
    ];

    protected $guarded = [];

    protected $casts = [
        'matching_criteria' => 'array',
        'unmet_criteria' => 'array',
        'unknown_criteria' => 'array',
        'evidence_urls' => 'array',
        'assessed_at' => 'datetime',
        'score' => 'integer',
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

    public function statusLabel(): string
    {
        return match ($this->status) {
            self::LIKELY_ELIGIBLE => 'Likely Eligible',
            self::POTENTIAL_MATCH => 'Potential Match',
            self::AMBITIOUS => 'Ambitious',
            self::NOT_ELIGIBLE => 'Not Eligible',
            default => 'Insufficient Evidence',
        };
    }
}
