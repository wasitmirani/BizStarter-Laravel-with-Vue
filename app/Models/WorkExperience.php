<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkExperience extends Model
{
    protected $guarded = [];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_current' => 'boolean',
        'skills' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function months(): int
    {
        if ($this->start_date === null) {
            return 0;
        }

        $end = $this->is_current ? now() : ($this->end_date ?? now());

        return max(0, $this->start_date->diffInMonths($end));
    }
}
