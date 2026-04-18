<?php

namespace App\Models;

use Spatie\Permission\Models\Permission as SpatiePermission;

class Permission extends  SpatiePermission
{
    //
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
