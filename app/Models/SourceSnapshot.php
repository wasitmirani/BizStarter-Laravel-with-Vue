<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SourceSnapshot extends Model
{
    protected $guarded = [];

    protected $casts = [
        'captured_at' => 'datetime',
        'http_status' => 'integer',
    ];

    public function source(): BelongsTo
    {
        return $this->belongsTo(OfficialSource::class, 'official_source_id');
    }
}
