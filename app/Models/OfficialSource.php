<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OfficialSource extends Model
{
    protected $guarded = [];

    protected $casts = [
        'last_checked_at' => 'datetime',
    ];

    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }

    public function snapshots(): HasMany
    {
        return $this->hasMany(SourceSnapshot::class);
    }

    public function latestSnapshot(): ?SourceSnapshot
    {
        return $this->snapshots()->latest('captured_at')->first();
    }
}
