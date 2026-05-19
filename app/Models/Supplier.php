<?php

namespace App\Models;

use App\Models\Concerns\InteractsWithListQuery;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use InteractsWithListQuery;

    protected $guarded = [];

    public function scopeSearch($query, ?string $search)
    {
        if (!$search) {
            return $query;
        }

        $search = trim($search);

        return $query->where(function ($q) use ($search) {
            $q->where('name', 'LIKE', "%{$search}%")
                ->orWhere('email', 'LIKE', "%{$search}%")
                ->orWhere('phone', 'LIKE', "%{$search}%")
                ->orWhere('city', 'LIKE', "%{$search}%")
                ->orWhere('country', 'LIKE', "%{$search}%");
        });
    }

    public function scopeFilters($query, array $filters)
    {
        return $query
            ->when($filters['id'] ?? null, fn ($q, $id) => $q->where('id', $id))
            ->when($filters['uuid'] ?? null, fn ($q, $uuid) => $q->where('uuid', $uuid))
            ->when($filters['status'] ?? null, fn ($q, $status) => $q->where('status', $status))
            ->when($filters['search'] ?? null, fn ($q, $search) => $q->search($search))
            ->when($filters['created_from'] ?? null, fn ($q, $from) => $q->whereDate('created_at', '>=', $from))
            ->when($filters['created_between'] ?? null, fn ($q, $range) => $q->whereBetween('created_at', explode(',', $range)))
            ->when($filters['date_range'] ?? null, fn ($q, $days) => $q->where('created_at', '>=', now()->subDays((int) $days)->startOfDay()));
    }
}
