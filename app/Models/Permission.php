<?php

namespace App\Models;

use App\Models\Concerns\HasNameGuardFilters;
use App\Models\Concerns\InteractsWithListQuery;
use Spatie\Permission\Models\Permission as SpatiePermission;

class Permission extends SpatiePermission
{
    use HasNameGuardFilters, InteractsWithListQuery;

    protected $prefix = 'PR00';
    protected $guarded = [];

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
