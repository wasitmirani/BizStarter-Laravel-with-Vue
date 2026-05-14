<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class TimeZone extends BaseModel
{
    use HasFactory;

    protected $table = 'timezones';

    public function getAllTimeZones()
    {
        return self::orderBy('name', 'asc')->get();
    }
}
