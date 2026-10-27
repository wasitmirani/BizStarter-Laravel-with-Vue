<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScholarshipCall extends Model
{
    protected $guarded = [];

    protected $casts = [
        'opens_at' => 'date',
        'deadline' => 'date',
        'eligibility_criteria' => 'array',
        'verified_at' => 'datetime',
        'is_sample' => 'boolean',
    ];

    public function scholarship(): BelongsTo
    {
        return $this->belongsTo(Scholarship::class);
    }
}
