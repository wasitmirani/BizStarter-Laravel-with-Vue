<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApplicationDocument extends Model
{
    protected $guarded = [];

    protected $casts = [
        'size' => 'integer',
    ];

    protected $hidden = ['path'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(UserApplication::class, 'user_application_id');
    }
}
