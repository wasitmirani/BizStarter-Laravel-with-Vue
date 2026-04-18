<?php

namespace App\Models;

use App\Models\Concerns\HasNameGuardFilters;
use App\Models\Concerns\InteractsWithListQuery;
use Spatie\Permission\Models\Permission as SpatiePermission;

class Permission extends SpatiePermission
{
    use HasNameGuardFilters, InteractsWithListQuery;

    protected $guarded = [];

     protected static function booted()
    {
        // ✅ Auto assign tenant
        static::creating(function ($permission) {
            if (auth()->check() && !$permission->tenant_id) {
                $permission->tenant_id = auth()->user()->tenant_id;
            }
        });
    }
}
