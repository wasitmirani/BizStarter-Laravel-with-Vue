<?php

namespace App\Models;

use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    protected $guarded = [];

    // Query scopes, relationships, and other model methods can be added here


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

    public function scopeRetrieve($query,$paginated  = false, $perPage = 15)
    {
       return $query->when($paginated,
        fn($q) => $q->paginate($perPage),
        fn($q) => $q->get()
       );
    }
}
