<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PurchaseOrder extends Model
{
    use SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'tags' => 'array',
        'meta' => 'array',
        'order_date' => 'date',
        'expected_date' => 'date',
        'sub_total' => 'decimal:2',
        'taxes' => 'decimal:2',
        'shipping_charges' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function items()
    {
        return $this->hasMany(PurchaseOrderItem::class)->orderBy('sort_order');
    }

    public function scopeSearch($query, ?string $search)
    {
        if (!$search) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('po_number', 'LIKE', "%{$search}%")
                ->orWhere('supplier_reference_id', 'LIKE', "%{$search}%")
                ->orWhere('payment_term', 'LIKE', "%{$search}%")
                ->orWhere('payment_type', 'LIKE', "%{$search}%")
                ->orWhere('supplier_notes', 'LIKE', "%{$search}%");
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
            ->when($filters['supplier_id'] ?? null, fn($q, $supplierId) => $q->where('supplier_id', $supplierId))
            ->when($filters['warehouse_id'] ?? null, fn($q, $warehouseId) => $q->where('warehouse_id', $warehouseId))
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
