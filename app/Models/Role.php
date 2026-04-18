<?php

namespace App\Models;

use App\Models\Concerns\HasNameGuardFilters;
use App\Models\Concerns\InteractsWithListQuery;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    use HasNameGuardFilters, InteractsWithListQuery;

    protected $guarded = [];
    protected $prefix ="RL00";

    // Query scopes, relationships, and other model methods can be added here

     protected static function booted()
    {
        // ✅ Auto assign tenant
        static::creating(function ($role) {
            if (auth()->check() && !$role->tenant_id) {
                $role->tenant_id = auth()->user()->tenant_id;
            }
        });

        // ✅ Prevent tenant from creating super-admin
        static::creating(function ($role) {
            if (
                auth()->check() &&
                auth()->user()->tenant_id &&
                strtolower($role->name) === 'super-admin'
            ) {
                abort(403, 'Super Admin role is reserved.');
            }
        });

        // ✅ Global scope for tenant
        // static::addGlobalScope('tenant', function ($query) {
        //     if (auth()->check()) {
        //         $query->where(function ($q) {
        //             $q->whereNull('tenant_id') // global roles
        //               ->orWhere('tenant_id', auth()->user()->tenant_id);
        //         });
        //     }
        // });

    }
    public function scopeSearch($query, ?string $search)
    {
        if (!$search) {
            return $query;
        }
        $search = trim($search);
        $id = str_replace($this->prefix, '', $search);

        return $query->where(function ($q) use ($search, $id) {
            $q->where('name', 'LIKE', "%{$search}%");
            if (is_numeric($id)) {
                $q->orWhere('id', $id);
            }
        });
    }
}
