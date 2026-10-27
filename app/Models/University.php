<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class University extends Model
{
    protected $guarded = [];

    public function programs(): HasMany
    {
        return $this->hasMany(Program::class);
    }

    public function getAllProgramsCountAttribute(): int
    {
        return $this->programs()->count();
    }
}
