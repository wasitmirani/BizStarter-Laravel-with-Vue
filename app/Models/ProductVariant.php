<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class ProductVariant extends Model
{
    use SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'meta' => 'array',
        'is_default' => 'boolean',
        'price' => 'decimal:2',
        'retail_price' => 'decimal:2',
    ];

    public function getThumbnailAttribute($value)
    {
        $default = config('images.defaults.product', 'product-default.jpg');
        $backendPath = config('images.paths.backend', 'backend/images/');

        if ($value && $value !== 'default.png' && Storage::disk('public')->exists('images/product/' . $value)) {
            return asset('storage/images/product/' . $value);
        }

        return asset($backendPath . 'products/' . $default);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function scopeSearch($query, ?string $search)
    {
        if (!$search) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('name', 'LIKE', "%{$search}%")
                ->orWhere('slug', 'LIKE', "%{$search}%")
                ->orWhere('sku', 'LIKE', "%{$search}%")
                ->orWhere('barcode', 'LIKE', "%{$search}%");
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
            ->when($filters['product_id'] ?? null, fn($q, $productId) => $q->where('product_id', $productId))
            ->when($filters['status'] ?? null, fn($q, $status) => $q->where('status', $status))
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
