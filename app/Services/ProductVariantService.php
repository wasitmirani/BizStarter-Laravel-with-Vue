<?php

namespace App\Services;

use App\Models\ProductVariant;

class ProductVariantService extends BaseService
{
    protected function model(): ?string
    {
        return ProductVariant::class;
    }

    public function variants(array $params = [])
    {
        $perPage = (int) ($params['per_page'] ?? 15);
        $perPage = $perPage > 0 ? $perPage : 15;

        return $this->model
            ->with(['product:id,name,uuid'])
            ->when(!isset($params['sort_by']), fn($q) => $q->latest())
            ->when(isset($params['sort_by']), fn($q) => $q->sortingBy($params['sort_by'], $params['sort_dir'] ?? 'desc'))
            ->filters($params)
            ->retrieve($params['paginated'] ?? true, $perPage);
    }

    protected function buildVariantName(array $data): string
    {
        $name = trim((string) ($data['name'] ?? ''));
        if ($name !== '') {
            return $name;
        }
        $optionName = trim((string) ($data['option_name'] ?? ''));
        $optionValue = trim((string) ($data['option_value'] ?? ''));
        if ($optionName !== '' || $optionValue !== '') {
            return trim($optionName . ': ' . $optionValue, ': ');
        }

        return trim((string) ($data['sku'] ?? 'Variant')) ?: 'Variant';
    }

    protected function resolveUniqueSlug(string $candidate, ?string $ignoreUuid = null, array &$usedSlugs = []): string
    {
        $base = trim($candidate, '-');
        if ($base === '') {
            $base = 'variant';
        }

        $slug = $base;
        $counter = 1;
        while (true) {
            $existsInBatch = isset($usedSlugs[$slug]);

            $query = $this->model->where('slug', $slug);
            if ($ignoreUuid) {
                $query->where('uuid', '!=', $ignoreUuid);
            }
            $existsInDb = $query->exists();

            if (!$existsInBatch && !$existsInDb) {
                $usedSlugs[$slug] = true;
                return $slug;
            }

            $counter++;
            $slug = "{$base}-{$counter}";
        }
    }

    public function saveVariant(array $data): ProductVariant
    {
        $variantName = $this->buildVariantName($data);
        $usedSlugs = [];
        $payload = array_merge($data, [
            'uuid' => genUUID(),
            'name' => $variantName,
            'slug' => $this->resolveUniqueSlug(setSlug($variantName), null, $usedSlugs),
        ]);

        return $this->model->create($payload);
    }

    public function updateVariant(string $uuid, array $data): ProductVariant
    {
        $variant = $this->model->where('uuid', $uuid)->firstOrFail();
        $variantName = $this->buildVariantName(array_merge($variant->toArray(), $data));
        $data['name'] = $variantName;
        $usedSlugs = [];
        $data['slug'] = $this->resolveUniqueSlug(setSlug($variantName), $uuid, $usedSlugs);
        $variant->update($data);

        return $variant->fresh(['product:id,name,uuid']);
    }

    public function saveBulkVariants(int $productId, array $variants): array
    {
        $created = [];
        $usedSkus = [];
        $usedSlugs = [];

        $resolveUniqueSku = function (string $candidate) use (&$usedSkus): string {
            $base = trim($candidate);
            if ($base === '') {
                $base = 'VARIANT';
            }
            $sku = $base;
            $counter = 0;

            while (
                isset($usedSkus[$sku]) ||
                $this->model->where('sku', $sku)->exists()
            ) {
                $counter++;
                $sku = "{$base}-{$counter}";
            }

            $usedSkus[$sku] = 0;
            return $sku;
        };

        foreach ($variants as $variantData) {
            $optionValues = array_values(array_filter(
                array_map(fn($value) => trim((string) $value), (array) ($variantData['option_values'] ?? [])),
                fn($value) => $value !== ''
            ));

            if (!empty($optionValues)) {
                $baseSku = trim((string) ($variantData['sku'] ?? ''));
                $baseBarcode = trim((string) ($variantData['barcode'] ?? ''));
                $skuValues = array_values(array_filter(
                    array_map(fn($value) => trim((string) $value), (array) ($variantData['sku_values'] ?? [])),
                    fn($value) => $value !== ''
                ));
                $barcodeValues = array_values(array_filter(
                    array_map(fn($value) => trim((string) $value), (array) ($variantData['barcode_values'] ?? [])),
                    fn($value) => $value !== ''
                ));
                foreach ($optionValues as $index => $optionValue) {
                    $generatedSku = $skuValues[$index] ?? null;
                    if (!$generatedSku) {
                        $skuSuffix = strtoupper(trim(preg_replace('/[^A-Za-z0-9]+/', '-', $optionValue) ?? '', '-'));
                        $generatedSku = $baseSku !== '' ? "{$baseSku}-{$skuSuffix}" : $skuSuffix;
                    }
                    $generatedSku = trim($generatedSku, '-');
                    if ($generatedSku === '') {
                        $generatedSku = strtoupper(trim((string) ($baseSku ?: 'VARIANT')));
                    }
                    $generatedSku = $resolveUniqueSku($generatedSku);
                    $payload = array_merge($variantData, [
                        'product_id' => $productId,
                        'option_value' => $optionValue,
                        'sku' => $generatedSku,
                        'barcode' => !empty($barcodeValues)
                            ? ($barcodeValues[$index] ?? null)
                            : ($index === 0 ? ($baseBarcode !== '' ? $baseBarcode : null) : null),
                        'is_default' => $index === 0 ? ($variantData['is_default'] ?? false) : false,
                    ]);
                    unset($payload['option_values'], $payload['sku_values'], $payload['barcode_values']);

                    $variantName = $this->buildVariantName($payload);
                    $payload['name'] = $variantName;
                    $payload['slug'] = $this->resolveUniqueSlug(setSlug($variantName), null, $usedSlugs);

                    $created[] = $this->saveVariant($payload);
                }
                continue;
            }

            $payload = array_merge($variantData, [
                'product_id' => $productId,
            ]);
            $singleSku = trim((string) ($payload['sku'] ?? ''));
            if ($singleSku !== '') {
                $payload['sku'] = $resolveUniqueSku($singleSku);
            }
            unset($payload['option_values']);
            unset($payload['sku_values']);
            unset($payload['barcode_values']);

            $variantName = $this->buildVariantName($payload);
            $payload['name'] = $variantName;
            $payload['slug'] = $this->resolveUniqueSlug(setSlug($variantName), null, $usedSlugs);

            $created[] = $this->saveVariant($payload);
        }

        return $created;
    }

    public function fetchByUuid(string $uuid): ?ProductVariant
    {
        return $this->model->with(['product:id,name,uuid'])->where('uuid', $uuid)->first();
    }

    public function deleteByUuid(string $uuid): bool
    {
        $variant = $this->model->where('uuid', $uuid)->firstOrFail();
        return (bool) $variant->delete();
    }
}
