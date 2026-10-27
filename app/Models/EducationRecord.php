<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EducationRecord extends Model
{
    protected $guarded = [];

    protected $casts = [
        'grade_value' => 'float',
        'grade_max' => 'float',
        'graduation_year' => 'integer',
        'transcript_available' => 'boolean',
        'certificate_available' => 'boolean',
        'prerequisite_subjects' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** Normalised percentage only when the record already uses a 0-100 scale. */
    public function gradePercentage(): ?float
    {
        if ($this->grade_value === null || $this->grade_max === null || $this->grade_max <= 0) {
            return null;
        }

        if ((float) $this->grade_max !== 100.0) {
            return null;
        }

        return (float) $this->grade_value;
    }
}
