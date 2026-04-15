<?php

namespace App\Models;

use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    protected $guarded = [];

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
        static::addGlobalScope('tenant', function ($query) {
            if (auth()->check()) {
                $query->where(function ($q) {
                    $q->whereNull('tenant_id') // global roles
                      ->orWhere('tenant_id', auth()->user()->tenant_id);
                });
            }
        });
    }
    public function scopeSorting($query, $direction = 'asc')
    {
        return $query->orderBy('name', $direction);
    }
    public function scopeSearch($query, ?string $search)
    {
        if ($search) {
            return $query->where('name', 'like', "%{$search}%");
        }
        return $query;
    }

    public function scopeLimit($query, $limit)
    {
        return $query->take($limit);
    }

    public function scopeFilters($query, array $filters)
    {
        return $query
            ->when($filters['id'] ?? false, function ($query, $id) {
                return $query->where('id', $id);
            })
            ->when($filters['search'] ?? false, function ($query, $search) {
                return $query->search($search);
            })
            ->when($filters['guard_name'] ?? false, function ($query, $guardName) {
                return $query->where('guard_name', $guardName);
            });
    }

    public function scopeRetrieve($query, $paginated  = false, $perPage = 15)
    {
        $paginated = filter_var($paginated, FILTER_VALIDATE_BOOLEAN);
        return $query->when(
            $paginated,
            fn($q) => $q->paginate($perPage),
            fn($q) => $q->get()
        );
    }
}
