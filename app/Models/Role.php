<?php

namespace App\Models;

use App\Models\Concerns\HasNameGuardFilters;
use App\Models\Concerns\InteractsWithListQuery;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    use HasNameGuardFilters, InteractsWithListQuery;

    protected $guarded = [];
    protected $prefix = 'RL00';

    /**
     * Keep RBAC records on the session guard.
     *
     * Without this, Sanctum sets auth.defaults.guard to "sanctum" for API
     * requests and Spatie creates/loads roles with a guard that has no
     * configured provider, which breaks role relations (e.g. users()).
     */
    protected $guard_name = 'web';

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
