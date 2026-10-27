<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Scholarship extends Model
{
    protected $guarded = [];

    protected $casts = [
        'eligibility_criteria' => 'array',
        'required_documents' => 'array',
        'verified_at' => 'datetime',
        'is_sample' => 'boolean',
    ];

    public function calls(): HasMany
    {
        return $this->hasMany(ScholarshipCall::class);
    }

    public function nextCall(): ?ScholarshipCall
    {
        return $this->calls()
            ->whereDate('deadline', '>=', now()->toDateString())
            ->orderBy('deadline')
            ->first();
    }
}
