<?php

namespace App\Contracts;

interface CatalogFilterable
{
    public const ALLOWED_FILTERS = [
        'id' => 'id',
        'uuid' => 'uuid',
        'search' => 'search',
        'query' => 'query',
        'per_page' => 'per_page',
        'sort_by' => 'sort_by',
        'sort_dir' => 'sort_dir',
        'date_range' => 'date_range',
        'category_id' => 'category_id',
        'brand_id' => 'brand_id',
        'type' => 'type',
        'product_id' => 'product_id',
        'supplier_id' => 'supplier_id',
        'warehouse_id' => 'warehouse_id',
        'status' => 'status',
        'tenant_id' => 'tenant_id',
        'paginated' => 'paginated',
    ];
}
