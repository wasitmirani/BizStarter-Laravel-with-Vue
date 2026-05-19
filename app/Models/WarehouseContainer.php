<?php

namespace App\Models;

use App\Models\Concerns\HasNameGuardFilters;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WarehouseContainer extends BaseModel
{
    use HasNameGuardFilters;

    protected $guarded = [];

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }
}

