<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class TimeZone extends BaseModel
{
    use HasFactory;
    protected $tabel = "time_zones";

    public function getAllTimeZones()
    {
        return self::orderBy('gmt_offset')->get();
    }
}
