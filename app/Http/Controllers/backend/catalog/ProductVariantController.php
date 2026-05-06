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
            'name' => 'nullable|string|max:255',
            'product_id' => 'required|exists:products,id',
            'sku' => 'required|string|max:255|unique:product_variants,sku',
            'barcode' => 'nullable|string|max:255|unique:product_variants,barcode',
            'option_name' => 'nullable|string|max:255',
            'option_value' => 'nullable|string|max:255',
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
            'name' => 'nullable|string|max:255',
            'product_id' => 'required|exists:products,id',
            'sku' => 'required|string|max:255|unique:product_variants,sku,' . $uuid . ',uuid',
            'barcode' => 'nullable|string|max:255|unique:product_variants,barcode,' . $uuid . ',uuid',
            'option_name' => 'nullable|string|max:255',
            'option_value' => 'nullable|string|max:255',
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

    public function bulkStore(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'variants' => 'required|array|min:1',
            'variants.*.name' => 'nullable|string|max:255',
            'variants.*.sku' => 'required|string|max:255',
            'variants.*.barcode' => 'nullable|string|max:255',
            'variants.*.option_name' => 'required|string|max:255',
            'variants.*.option_value' => 'nullable|string|max:255',
            'variants.*.option_values' => 'required|array|min:1',
            'variants.*.option_values.*' => 'required|string|max:255|distinct',
            'variants.*.sku_values' => 'nullable|array',
            'variants.*.sku_values.*' => 'nullable|string|max:255|distinct',
            'variants.*.barcode_values' => 'nullable|array',
            'variants.*.barcode_values.*' => 'nullable|string|max:255|distinct',
            'variants.*.price' => 'nullable|numeric|min:0',
            'variants.*.retail_price' => 'nullable|numeric|min:0',
            'variants.*.status' => 'nullable|in:active,inactive',
            'variants.*.sort_order' => 'nullable|integer|min:0',
            'variants.*.is_default' => 'nullable|boolean',
        ]);

        foreach ($data['variants'] as $index => $variant) {
            $cleanValues = array_values(array_filter(
                array_map(fn($value) => trim((string) $value), (array) ($variant['option_values'] ?? [])),
                fn($value) => $value !== ''
            ));
            if (empty($cleanValues)) {
                return responseJson(
                    "row " . ($index + 1) . " must contain at least one option value",
                    ['errors' => ["variants.{$index}.option_values" => ['Provide at least one option value.']]],
                    false,
                    422
                );
            }
            $cleanSkus = array_values(array_filter(
                array_map(fn($value) => trim((string) $value), (array) ($variant['sku_values'] ?? [])),
                fn($value) => $value !== ''
            ));
            if (!empty($cleanSkus) && count($cleanSkus) !== count($cleanValues)) {
                return responseJson(
                    "row " . ($index + 1) . " sku values count mismatch",
                    ['errors' => ["variants.{$index}.sku_values" => ['SKU values count must match option values count.']]],
                    false,
                    422
                );
            }
            $cleanBarcodes = array_values(array_filter(
                array_map(fn($value) => trim((string) $value), (array) ($variant['barcode_values'] ?? [])),
                fn($value) => $value !== ''
            ));
            if (!empty($cleanBarcodes) && count($cleanBarcodes) !== count($cleanValues)) {
                return responseJson(
                    "row " . ($index + 1) . " barcode values count mismatch",
                    ['errors' => ["variants.{$index}.barcode_values" => ['Barcode values count must match option values count.']]],
                    false,
                    422
                );
            }
            $data['variants'][$index]['option_values'] = $cleanValues;
            $data['variants'][$index]['sku_values'] = $cleanSkus;
            $data['variants'][$index]['barcode_values'] = $cleanBarcodes;
            $data['variants'][$index]['option_name'] = trim((string) ($variant['option_name'] ?? ''));
        }

        $created = $this->productVariantService->saveBulkVariants((int) $data['product_id'], $data['variants']);

        return responseJson('variants created successfully', ['variants' => $created], true, 201);
    }

    public function destroy(string $uuid)
    {
        $this->productVariantService->deleteByUuid($uuid);
        return responseJson('variant deleted successfully', null, true);
    }
}
