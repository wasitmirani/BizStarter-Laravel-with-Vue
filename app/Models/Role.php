<?php

namespace App\Models;

use App\Models\Concerns\HasNameGuardFilters;
use App\Models\Concerns\InteractsWithListQuery;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Permission\Models\Role as SpatieRole;
use Spatie\Permission\PermissionRegistrar;

class Role extends SpatieRole
{
    use HasNameGuardFilters, InteractsWithListQuery;

    protected $guarded = [];
    protected $prefix = 'RL00';

    /**
     * Spatie resolves the user model from the current auth guard, which becomes
     * "sanctum" during API requests. That guard has no provider, so counting or
     * loading users would fail. This app only ever has one user model.
     */
    public function users(): BelongsToMany
    {
        return $this->morphedByMany(
            User::class,
            'model',
            config('permission.table_names.model_has_roles'),
            app(PermissionRegistrar::class)->pivotRole,
            config('permission.column_names.model_morph_key')
        );
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
