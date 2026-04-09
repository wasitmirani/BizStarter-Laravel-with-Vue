<?php

namespace App\Http\Controllers\backend\catalog;

use App\Contracts\CatalogFilterable;
use App\Http\Controllers\Controller;
use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller implements CatalogFilterable
{
    public function __construct(protected ProductService $productService) {}

    public function index(Request $request)
    {
        $filters = $request->only(self::ALLOWED_FILTERS);
        return responseJson('products fetched successfully', [
            'products' => $this->productService->products($filters),
        ], true);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:products,slug',
            'category_id' => 'nullable|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'type' => 'nullable|in:service,digital,physical,bundle',
            'sku' => 'required|string|max:255|unique:products,sku',
            'reference_sku' => 'required|string|max:255',
            'barcode' => 'required|string|max:255|unique:products,barcode',
            'uom' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'retail_price' => 'nullable|numeric|min:0',
            'thumbnail' => 'nullable|string|max:255',
            'min_expiry_days' => 'nullable|integer|min:0',
            'fulfillment_strategy' => 'nullable|in:fifo,lifo,fefo',
            'track_expiry_dates' => 'nullable|boolean',
            'tags' => 'nullable|array',
            'meta' => 'nullable|array',
            'tenant_id' => 'nullable|exists:users,id',
            'sort_order' => 'nullable|integer|min:0',
        ]);
        if (!empty($data['thumbnail'])) {
            $data['thumbnail'] = basename(parse_url($data['thumbnail'], PHP_URL_PATH) ?: $data['thumbnail']);
        }

        $product = $this->productService->saveProduct($data);
        return responseJson('product created successfully', ['product' => $product], true, 201);
    }

    public function show(string $uuid)
    {
        $product = $this->productService->fetchByUuid($uuid);
        return responseJson('product fetched successfully', ['product' => $product], true);
    }

    public function update(Request $request, string $uuid)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:products,slug,' . $uuid . ',uuid',
            'category_id' => 'nullable|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'type' => 'nullable|in:service,digital,physical,bundle',
            'sku' => 'required|string|max:255|unique:products,sku,' . $uuid . ',uuid',
            'reference_sku' => 'required|string|max:255',
            'barcode' => 'required|string|max:255|unique:products,barcode,' . $uuid . ',uuid',
            'uom' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'retail_price' => 'nullable|numeric|min:0',
            'thumbnail' => 'nullable|string|max:255',
            'min_expiry_days' => 'nullable|integer|min:0',
            'fulfillment_strategy' => 'nullable|in:fifo,lifo,fefo',
            'track_expiry_dates' => 'nullable|boolean',
            'tags' => 'nullable|array',
            'meta' => 'nullable|array',
            'tenant_id' => 'nullable|exists:users,id',
            'sort_order' => 'nullable|integer|min:0',
        ]);
        if (!empty($data['thumbnail'])) {
            $data['thumbnail'] = basename(parse_url($data['thumbnail'], PHP_URL_PATH) ?: $data['thumbnail']);
        }

        $product = $this->productService->updateProduct($uuid, $data);
        return responseJson('product updated successfully', ['product' => $product], true);
    }

    public function destroy(string $uuid)
    {
        $this->productService->deleteByUuid($uuid);
        return responseJson('product deleted successfully', null, true);
    }
}
