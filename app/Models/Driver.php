<?php

namespace App\Models;

use App\Enums\DriverStatusEnum;
use App\Enums\DriverTypeEnum;
use App\Models\Concerns\InteractsWithListQuery;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Driver extends Model
{
    use InteractsWithListQuery;

    protected $guarded = [];

    protected $prefix = 'DR00';

    protected function casts(): array
    {
        return [
            'license_expiry_date' => 'date',
            'joining_date' => 'date',
            'type' => DriverTypeEnum::class,
            'status' => DriverStatusEnum::class,
        ];
    }

    public function getProfileImageAttribute($value)
    {
        if ($value && $value !== 'default.png' && Storage::disk('public')->exists('images/driver/' . $value)) {
            return asset('storage/images/driver/' . $value);
        }

        return asset('backend/images/users/user-5.jpg');
    }

    public function scopeSearch($query, ?string $search)
    {
        if (!$search) {
            return $query;
        }

        $search = trim($search);
        $id = str_replace($this->prefix, '', $search);

        return $query->where(function ($q) use ($search, $id) {
            $q->where('full_name', 'LIKE', "%{$search}%")
                ->orWhere('driver_code', 'LIKE', "%{$search}%")
                ->orWhere('email', 'LIKE', "%{$search}%")
                ->orWhere('phone', 'LIKE', "%{$search}%")
                ->orWhere('cnic', 'LIKE', "%{$search}%")
                ->orWhere('license_number', 'LIKE', "%{$search}%")
                ->orWhere('city', 'LIKE', "%{$search}%");

            if (is_numeric($id)) {
                $q->orWhere('id', $id);
            }
        });
    }

    public function warehouses()
    {
        return $this->belongsToMany(Warehouse::class, 'driver_warehouse');
    }

    public function scopeFilters($query, array $filters)
    {
        $tenantId = tenant('id')?->id ?? null;

        return $query
            ->when($tenantId, fn ($q) => $q->where('tenant_id', $tenantId))
            ->when($filters['id'] ?? null, fn ($q, $id) => $q->where('id', $id))
            ->when($filters['uuid'] ?? null, fn ($q, $uuid) => $q->where('uuid', $uuid))
            ->when($filters['type'] ?? null, fn ($q, $type) => $q->where('type', $type))
            ->when($filters['status'] ?? null, fn ($q, $status) => $q->where('status', $status))
            ->when($filters['city'] ?? null, fn ($q, $city) => $q->where('city', 'LIKE', "%{$city}%"))
            ->when($filters['warehouse_id'] ?? null, fn ($q, $warehouseId) => $q->whereHas('warehouses', fn ($wq) => $wq->where('warehouses.id', $warehouseId)))
            ->when($filters['search'] ?? null, fn ($q, $search) => $q->search($search))
            ->when($filters['created_from'] ?? null, fn ($q, $from) => $q->whereDate('created_at', '>=', $from))
            ->when($filters['created_between'] ?? null, fn ($q, $range) => $q->whereBetween('created_at', explode(',', $range)))
            ->when($filters['date_range'] ?? null, fn ($q, $days) => $q->where('created_at', '>=', now()->subDays((int) $days)->startOfDay()));
    }
}
