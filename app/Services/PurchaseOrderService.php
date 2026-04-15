<?php

namespace App\Services;

use App\Models\ProductVariant;
use App\Models\PurchaseOrder;
use Illuminate\Support\Facades\DB;

class PurchaseOrderService extends BaseService
{
    protected function model(): ?string
    {
        return PurchaseOrder::class;
    }

    public function purchaseOrders(array $params = [])
    {
        $perPage = (int) ($params['per_page'] ?? 15);
        $perPage = $perPage > 0 ? $perPage : 15;

        return $this->model
            ->withCount('items')
            ->when(!isset($params['sort_by']), fn($q) => $q->latest())
            ->when(isset($params['sort_by']), fn($q) => $q->sortingBy($params['sort_by'], $params['sort_dir'] ?? 'desc'))
            ->filters($params)
            ->retrieve($params['paginated'] ?? true, $perPage);
    }

    protected function generatePoNumber(): string
    {
        $prefix = 'PO-' . now()->format('Ymd') . '-';
        $last = $this->model
            ->whereDate('created_at', now()->toDateString())
            ->latest('id')
            ->value('id');
        $sequence = str_pad((string) (($last ?? 0) + 1), 4, '0', STR_PAD_LEFT);

        return $prefix . $sequence;
    }

    protected function normalizeItem(array $item, int $index): array
    {
        $variantId = isset($item['variant_id']) && $item['variant_id'] !== '' ? (int) $item['variant_id'] : null;
        $variant = $variantId ? ProductVariant::with('product:id')->find($variantId) : null;
        $qty = max(0.01, (float) ($item['quantity'] ?? 0));
        $unitPrice = (float) ($item['unit_price'] ?? ($variant?->price ?? 0));
        $lineTax = (float) ($item['line_tax'] ?? 0);
        $lineTotal = ($qty * $unitPrice) + $lineTax;

        return [
            'variant_id' => $variant?->id,
            'product_id' => $variant?->product_id,
            'name' => $item['name'] ?? $variant?->name,
            'sku' => $item['sku'] ?? $variant?->sku,
            'option_name' => $item['option_name'] ?? $variant?->option_name,
            'option_value' => $item['option_value'] ?? $variant?->option_value,
            'quantity' => $qty,
            'unit_price' => $unitPrice,
            'line_tax' => $lineTax,
            'line_total' => $lineTotal,
            'sort_order' => (int) ($item['sort_order'] ?? $index),
            'meta' => $item['meta'] ?? null,
        ];
    }

    protected function computeTotals(array $items, float $taxes = 0, float $shipping = 0): array
    {
        $subTotal = array_reduce($items, fn($carry, $row) => $carry + (float) ($row['quantity'] * $row['unit_price']), 0);
        $total = $subTotal + $taxes + $shipping;

        return [
            'sub_total' => round($subTotal, 2),
            'taxes' => round($taxes, 2),
            'shipping_charges' => round($shipping, 2),
            'total' => round($total, 2),
        ];
    }

    public function savePurchaseOrder(array $data): PurchaseOrder
    {
        return DB::transaction(function () use ($data) {
            $items = array_values($data['line_items'] ?? []);
            $normalizedItems = array_map(fn($row, $idx) => $this->normalizeItem($row, $idx), $items, array_keys($items));
            $totals = $this->computeTotals($normalizedItems, (float) ($data['taxes'] ?? 0), (float) ($data['shipping_charges'] ?? 0));

            $payload = array_merge($data, $totals, [
                'uuid' => genUUID(),
                'po_number' => $this->generatePoNumber(),
            ]);
            unset($payload['line_items']);

            $purchaseOrder = $this->model->create($payload);
            $purchaseOrder->items()->createMany($normalizedItems);

            return $purchaseOrder->fresh(['items.variant:id,uuid,name,sku,price,product_id']);
        });
    }

    public function updatePurchaseOrder(string $uuid, array $data): PurchaseOrder
    {
        return DB::transaction(function () use ($uuid, $data) {
            $purchaseOrder = $this->model->where('uuid', $uuid)->firstOrFail();
            $items = array_values($data['line_items'] ?? []);
            $normalizedItems = array_map(fn($row, $idx) => $this->normalizeItem($row, $idx), $items, array_keys($items));
            $totals = $this->computeTotals($normalizedItems, (float) ($data['taxes'] ?? 0), (float) ($data['shipping_charges'] ?? 0));

            $payload = array_merge($data, $totals);
            unset($payload['line_items']);

            $purchaseOrder->update($payload);
            $purchaseOrder->items()->delete();
            $purchaseOrder->items()->createMany($normalizedItems);

            return $purchaseOrder->fresh(['items.variant:id,uuid,name,sku,price,product_id']);
        });
    }

    public function fetchByUuid(string $uuid): ?PurchaseOrder
    {
        return $this->model->with(['items.variant:id,uuid,name,sku,price,product_id'])->where('uuid', $uuid)->first();
    }

    public function deleteByUuid(string $uuid): bool
    {
        $purchaseOrder = $this->model->where('uuid', $uuid)->firstOrFail();

        return (bool) $purchaseOrder->delete();
    }
}
