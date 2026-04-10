<?php

namespace App\Http\Controllers\backend\catalog;

use App\Contracts\CatalogFilterable;
use App\Http\Controllers\Controller;
use App\Services\ProductVariantService;
use Illuminate\Http\Request;

class ProductVariantController extends Controller implements CatalogFilterable
{
    public function __construct(protected ProductVariantService $productVariantService) {}

    public function index(Request $request)
    {
        $filters = $request->only(self::ALLOWED_FILTERS);
        return responseJson('variants fetched successfully', [
            'variants' => $this->productVariantService->variants($filters),
        ], true);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'product_id' => 'required|exists:products,id',
            'sku' => 'required|string|max:255|unique:product_variants,sku',
            'barcode' => 'nullable|string|max:255|unique:product_variants,barcode',
            'price' => 'nullable|numeric|min:0',
            'retail_price' => 'nullable|numeric|min:0',
            'thumbnail' => 'nullable|string|max:255',
            'is_default' => 'nullable|boolean',
            'status' => 'nullable|in:active,inactive',
            'sort_order' => 'nullable|integer|min:0',
            'meta' => 'nullable|array',
        ]);

        if (!empty($data['thumbnail'])) {
            $data['thumbnail'] = basename(parse_url($data['thumbnail'], PHP_URL_PATH) ?: $data['thumbnail']);
        }

        $variant = $this->productVariantService->saveVariant($data);
        return responseJson('variant created successfully', ['variant' => $variant], true, 201);
    }

    public function show(string $uuid)
    {
        $variant = $this->productVariantService->fetchByUuid($uuid);
        return responseJson('variant fetched successfully', ['variant' => $variant], true);
    }

    public function update(Request $request, string $uuid)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'product_id' => 'required|exists:products,id',
            'sku' => 'required|string|max:255|unique:product_variants,sku,' . $uuid . ',uuid',
            'barcode' => 'nullable|string|max:255|unique:product_variants,barcode,' . $uuid . ',uuid',
            'price' => 'nullable|numeric|min:0',
            'retail_price' => 'nullable|numeric|min:0',
            'thumbnail' => 'nullable|string|max:255',
            'is_default' => 'nullable|boolean',
            'status' => 'nullable|in:active,inactive',
            'sort_order' => 'nullable|integer|min:0',
            'meta' => 'nullable|array',
        ]);

        if (!empty($data['thumbnail'])) {
            $data['thumbnail'] = basename(parse_url($data['thumbnail'], PHP_URL_PATH) ?: $data['thumbnail']);
        }

        $variant = $this->productVariantService->updateVariant($uuid, $data);
        return responseJson('variant updated successfully', ['variant' => $variant], true);
    }

    public function destroy(string $uuid)
    {
        $this->productVariantService->deleteByUuid($uuid);
        return responseJson('variant deleted successfully', null, true);
    }
}
