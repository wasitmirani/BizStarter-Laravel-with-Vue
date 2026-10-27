<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudyPreference extends Model
{
    protected $guarded = [];

    protected $casts = [
        'subject_areas' => 'array',
        'preferred_universities' => 'array',
        'preferred_regions' => 'array',
        'preferred_scholarship_types' => 'array',
        'max_tuition' => 'float',
        'application_budget' => 'float',
        'needs_scholarship' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
