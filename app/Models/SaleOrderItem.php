<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class SaleOrderItem extends BaseModel
{
    use HasFactory;

    protected $table = 'sale_order_items';
    protected $guarded = [];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'discount' => 'decimal:2',
        'tax' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    public function order()
    {
        return $this->belongsTo(SaleOrder::class, 'sale_order_id');
    }
}
