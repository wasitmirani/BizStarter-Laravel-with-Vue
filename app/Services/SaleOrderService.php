<?php

namespace App\Services;

use App\Models\SaleOrder;
use App\Models\SaleOrderItem;
use Exception;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class SaleOrderService extends BaseService
{
    protected function model(): ?string
    {
        return SaleOrder::class;
    }

    public function createOrder(array $data): SaleOrder
    {
        return DB::transaction(function () use ($data) {
            $items = $data['items'] ?? [];
            unset($data['items']);

            $data['uuid'] = $data['uuid'] ?? (string) Str::uuid();

            $order = $this->create($data);

            foreach ($items as $item) {
                $item['sale_order_id'] = $order->id;
                $item['subtotal'] = ($item['unit_price'] ?? 0) * ($item['quantity'] ?? 1) - ($item['discount'] ?? 0) + ($item['tax'] ?? 0);
                SaleOrderItem::create($item);
                // inventory update if Product model exists
                if (class_exists('\App\Models\Product') && !empty($item['product_id'])) {
                    try {
                        $product = app('\App\Models\Product')->find($item['product_id']);
                        if ($product) {
                            $product->decrement('stock', $item['quantity'] ?? 0);
                        }
                    } catch (Exception $e) {
                        // ignore inventory update errors
                    }
                }
            }

            return $order->load('items');
        });
    }

    public function updateOrder($id, array $data): SaleOrder
    {
        return DB::transaction(function () use ($id, $data) {
            $items = $data['items'] ?? [];
            unset($data['items']);

            $order = $this->update($id, $data);

            // simple approach: delete existing items and recreate
            $order->items()->delete();

            foreach ($items as $item) {
                $item['sale_order_id'] = $order->id;
                $item['subtotal'] = ($item['unit_price'] ?? 0) * ($item['quantity'] ?? 1) - ($item['discount'] ?? 0) + ($item['tax'] ?? 0);
                SaleOrderItem::create($item);
            }

            return $order->fresh('items');
        });
    }
}
