<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeviceHistory extends BaseModel
{
    use HasFactory;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'device_information' => 'array',
            'last_login_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
