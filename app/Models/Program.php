<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Program extends Model
{
    protected $guarded = [];

    protected $casts = [
        'required_subjects' => 'array',
        'required_documents' => 'array',
        'tuition_min' => 'float',
        'tuition_max' => 'float',
        'minimum_grade_percentage' => 'float',
        'minimum_language_score' => 'float',
        'minimum_work_experience_months' => 'integer',
        'duration_months' => 'integer',
        'source_verified_at' => 'datetime',
        'is_sample' => 'boolean',
    ];

    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }

    public function admissionCalls(): HasMany
    {
        return $this->hasMany(AdmissionCall::class);
    }

    public function assessments(): HasMany
    {
        return $this->hasMany(EligibilityAssessment::class);
    }

    public function nextOpenCall(): ?AdmissionCall
    {
        return $this->admissionCalls()
            ->whereDate('deadline', '>=', now()->toDateString())
            ->orderBy('deadline')
            ->first();
    }

    public function tuitionLabel(): string
    {
        if ($this->tuition_min === null && $this->tuition_max === null) {
            return 'Tuition not published';
        }

        if ($this->tuition_max === null || $this->tuition_min === $this->tuition_max) {
            return '€'.number_format((float) $this->tuition_min, 0);
        }

        return '€'.number_format((float) $this->tuition_min, 0).' – €'.number_format((float) $this->tuition_max, 0);
    }
}
