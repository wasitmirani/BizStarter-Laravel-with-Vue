<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class DeviceHistory extends BaseModel
{
    use HasFactory;

    protected $guarded=[];

    protected function casts(): array
    {
        return [
            'device_information' => 'array',
        ];
    }
}
