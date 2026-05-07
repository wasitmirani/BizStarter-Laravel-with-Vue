<?php

namespace App\Models;

use App\Models\BaseModel;
use App\Models\Concerns\HasNameGuardFilters;
use App\Models\Concerns\InteractsWithListQuery;


class Warehouse extends BaseModel
{
    use HasNameGuardFilters, InteractsWithListQuery;


    protected $guarded = [];

    protected $casts = [
        'is_default' => 'boolean',
        'allow_partial_packing' => 'boolean',
        'allow_partial_picking' => 'boolean',
        'scan_unique_location' => 'boolean',
        'scan_unique_container' => 'boolean',
        'longitude' => 'float',
        'latitude' => 'float',
    ];

    protected $prefix = "WH00";

    public function scopeSearch($query, ?string $search)
    {
        if (!$search) {
            return $query;
        }

        $search = trim($search);
        $id = str_replace($this->prefix, '', $search);

        return $query->where(function ($q) use ($search, $id) {
            $q->where('name', 'LIKE', "%{$search}%")
                ->orWhere('label', 'LIKE', "%{$search}%");
           

            if (is_numeric($id)) {
                $q->orWhere('id', $id);
            }
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

    public function country(){
        return $this->belongsTo(Country::class);
    }
}
