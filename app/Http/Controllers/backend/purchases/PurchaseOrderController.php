<?php

namespace App\Http\Controllers\backend\purchases;

use App\Contracts\CatalogFilterable;
use App\Http\Controllers\Controller;
use App\Services\PurchaseOrderService;
use Illuminate\Http\Request;

class PurchaseOrderController extends Controller implements CatalogFilterable
{
    public function __construct(protected PurchaseOrderService $purchaseOrderService) {}

    public function index(Request $request)
    {
        $filters = $request->only(self::ALLOWED_FILTERS);

        return responseJson('purchase orders fetched successfully', [
            'purchase_orders' => $this->purchaseOrderService->purchaseOrders($filters),
        ], true);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'supplier_id' => 'nullable|integer|exists:suppliers,id',
            'warehouse_id' => 'nullable|integer|exists:warehouses,id',
            'order_date' => 'required|date',
            'expected_date' => 'nullable|date|after_or_equal:order_date',
            'payment_term' => 'nullable|string|max:255',
            'payment_type' => 'nullable|string|max:255',
            'supplier_reference_id' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'taxes' => 'nullable|numeric|min:0',
            'shipping_charges' => 'nullable|numeric|min:0',
            'supplier_notes' => 'nullable|string',
            'meta' => 'nullable|array',
            'tenant_id' => 'nullable|exists:users,id',
            'line_items' => 'required|array|min:1',
            'line_items.*.variant_id' => 'nullable|exists:product_variants,id',
            'line_items.*.name' => 'nullable|string|max:255',
            'line_items.*.sku' => 'nullable|string|max:255',
            'line_items.*.option_name' => 'nullable|string|max:255',
            'line_items.*.option_value' => 'nullable|string|max:255',
            'line_items.*.quantity' => 'required|numeric|min:0.01',
            'line_items.*.unit_price' => 'nullable|numeric|min:0',
            'line_items.*.line_tax' => 'nullable|numeric|min:0',
            'line_items.*.sort_order' => 'nullable|integer|min:0',
            'line_items.*.meta' => 'nullable|array',
        ]);

        $purchaseOrder = $this->purchaseOrderService->savePurchaseOrder($data);

        return responseJson('purchase order created successfully', ['purchase_order' => $purchaseOrder], true, 201);
    }

    public function show(string $uuid)
    {
        $purchaseOrder = $this->purchaseOrderService->fetchByUuid($uuid);

        return responseJson('purchase order fetched successfully', ['purchase_order' => $purchaseOrder], true);
    }

    public function update(Request $request, string $uuid)
    {
        $data = $request->validate([
            'supplier_id' => 'nullable|integer|exists:suppliers,id',
            'warehouse_id' => 'nullable|integer|exists:warehouses,id',
            'order_date' => 'required|date',
            'expected_date' => 'nullable|date|after_or_equal:order_date',
            'payment_term' => 'nullable|string|max:255',
            'payment_type' => 'nullable|string|max:255',
            'supplier_reference_id' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'taxes' => 'nullable|numeric|min:0',
            'shipping_charges' => 'nullable|numeric|min:0',
            'supplier_notes' => 'nullable|string',
            'meta' => 'nullable|array',
            'tenant_id' => 'nullable|exists:users,id',
            'line_items' => 'required|array|min:1',
            'line_items.*.variant_id' => 'nullable|exists:product_variants,id',
            'line_items.*.name' => 'nullable|string|max:255',
            'line_items.*.sku' => 'nullable|string|max:255',
            'line_items.*.option_name' => 'nullable|string|max:255',
            'line_items.*.option_value' => 'nullable|string|max:255',
            'line_items.*.quantity' => 'required|numeric|min:0.01',
            'line_items.*.unit_price' => 'nullable|numeric|min:0',
            'line_items.*.line_tax' => 'nullable|numeric|min:0',
            'line_items.*.sort_order' => 'nullable|integer|min:0',
            'line_items.*.meta' => 'nullable|array',
        ]);

        $purchaseOrder = $this->purchaseOrderService->updatePurchaseOrder($uuid, $data);

        return responseJson('purchase order updated successfully', ['purchase_order' => $purchaseOrder], true);
    }

    public function destroy(string $uuid)
    {
        $this->purchaseOrderService->deleteByUuid($uuid);

        return responseJson('purchase order deleted successfully', null, true);
    }
}
