<?php

namespace App\Models;

use App\Support\CountryName;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class University extends Model
{
    protected $guarded = [];

    public function programs(): HasMany
    {
        return $this->hasMany(Program::class);
    }

    public function officialSources(): HasMany
    {
        return $this->hasMany(OfficialSource::class);
    }

    public function getCountryNameAttribute(): ?string
    {
        return CountryName::for($this->country);
    }

    public function getAllProgramsCountAttribute(): int
    {
        return $this->programs()->count();
    }
}
