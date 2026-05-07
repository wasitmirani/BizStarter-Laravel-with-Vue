<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Brand extends Model
{
    use SoftDeletes;

    protected $guarded = [];

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function scopeSearch($query, ?string $search)
    {
        if (!$search) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('name', 'LIKE', "%{$search}%")
                ->orWhere('slug', 'LIKE', "%{$search}%")
                ->orWhere('code', 'LIKE', "%{$search}%");
        });
    }

    public function scopeSortingBy($query, string $column = 'id', string $direction = 'desc')
    {
        return $query->orderBy($column, $direction);
    }

    public function scopeFilters($query, array $filters)
    {
        return $query
            ->when($filters['id'] ?? null, fn($q, $id) => $q->where('id', $id))
            ->when($filters['uuid'] ?? null, fn($q, $uuid) => $q->where('uuid', $uuid))
            ->when($filters['tenant_id'] ?? null, fn($q, $tenantId) => $q->where('tenant_id', $tenantId))
            ->when($filters['date_range'] ?? null, fn($q, $days) =>
                $q->where('created_at', '>=', now()->subDays((int) $days)->startOfDay()))
            ->when($filters['search'] ?? ($filters['query'] ?? null), fn($q, $search) => $q->search($search));
    }

    public function scopeRetrieve($query, $paginated = true, int $perPage = 15)
    {
        $paginated = filter_var($paginated, FILTER_VALIDATE_BOOLEAN);
        return $query->when(
            $paginated,
            fn($q) => $q->paginate($perPage),
            fn($q) => $q->get()
        );
    }
}
