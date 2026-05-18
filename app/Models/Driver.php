<?php

namespace App\Models;

use App\Enums\DriverStatusEnum;
use App\Enums\DriverTypeEnum;
use App\Models\Concerns\InteractsWithListQuery;
use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    use InteractsWithListQuery;

    protected $guarded = [];

    protected $prefix = 'DR00';

    protected $hidden = [
        'user',
    ];

    protected $appends = [
        'uuid',
        'full_name',
        'phone',
        'email',
        'address',
        'city',
        'profile_image',
    ];

    protected function casts(): array
    {
        return [
            'license_expiry_date' => 'date',
            'joining_date' => 'date',
            'type' => DriverTypeEnum::class,
            'status' => DriverStatusEnum::class,
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function warehouses()
    {
        return $this->belongsToMany(Warehouse::class, 'driver_warehouse');
    }

    public function getUuidAttribute(): ?string
    {
        return $this->user?->uuid;
    }

    public function getFullNameAttribute(): ?string
    {
        return $this->user?->name;
    }

    public function getPhoneAttribute(): ?string
    {
        return $this->user?->phone;
    }

    public function getEmailAttribute(): ?string
    {
        return $this->user?->email;
    }

    public function getAddressAttribute(): ?string
    {
        return $this->user?->address;
    }

    public function getCityAttribute(): ?string
    {
        return $this->user?->city;
    }

    public function getProfileImageAttribute(): ?string
    {
        return $this->user?->thumbnail;
    }

    public function scopeSearch($query, ?string $search)
    {
        if (! $search) {
            return $query;
        }

        $search = trim($search);
        $id = str_replace($this->prefix, '', $search);

        return $query->where(function ($q) use ($search, $id) {
            $q->where('driver_code', 'LIKE', "%{$search}%")
                ->orWhere('cnic', 'LIKE', "%{$search}%")
                ->orWhere('license_number', 'LIKE', "%{$search}%")
                ->orWhereHas('user', function ($userQuery) use ($search) {
                    $userQuery->where('name', 'LIKE', "%{$search}%")
                        ->orWhere('first_name', 'LIKE', "%{$search}%")
                        ->orWhere('last_name', 'LIKE', "%{$search}%")
                        ->orWhere('email', 'LIKE', "%{$search}%")
                        ->orWhere('phone', 'LIKE', "%{$search}%")
                        ->orWhere('city', 'LIKE', "%{$search}%");
                });

            if (is_numeric($id)) {
                $q->orWhere('id', $id);
            }
        });
    }

    public function scopeFilters($query, array $filters)
    {
        $tenantId = tenant('id')?->id ?? null;

        return $query
            ->when($tenantId, fn ($q) => $q->whereHas('user', fn ($uq) => $uq->where('tenant_id', $tenantId)))
            ->when($filters['id'] ?? null, fn ($q, $id) => $q->where('id', $id))
            ->when($filters['uuid'] ?? null, fn ($q, $uuid) => $q->whereHas('user', fn ($uq) => $uq->where('uuid', $uuid)))
            ->when($filters['type'] ?? null, fn ($q, $type) => $q->where('type', $type))
            ->when($filters['status'] ?? null, fn ($q, $status) => $q->where('status', $status))
            ->when($filters['city'] ?? null, fn ($q, $city) => $q->whereHas('user', fn ($uq) => $uq->where('city', 'LIKE', "%{$city}%")))
            ->when($filters['warehouse_id'] ?? null, fn ($q, $warehouseId) => $q->whereHas('warehouses', fn ($wq) => $wq->where('warehouses.id', $warehouseId)))
            ->when($filters['search'] ?? null, fn ($q, $search) => $q->search($search))
            ->when($filters['created_from'] ?? null, fn ($q, $from) => $q->whereDate('created_at', '>=', $from))
            ->when($filters['created_between'] ?? null, fn ($q, $range) => $q->whereBetween('created_at', explode(',', $range)))
            ->when($filters['date_range'] ?? null, fn ($q, $days) => $q->where('created_at', '>=', now()->subDays((int) $days)->startOfDay()));
    }
}
