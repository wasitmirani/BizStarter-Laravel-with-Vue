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

    public function saveVariant(array $data): ProductVariant
    {
        $variantName = $this->buildVariantName($data);
        $payload = array_merge($data, [
            'uuid' => genUUID(),
            'name' => $variantName,
            'slug' => setSlug($variantName),
        ]);

        return $this->model->create($payload);
    }

    public function updateVariant(string $uuid, array $data): ProductVariant
    {
        $variant = $this->model->where('uuid', $uuid)->firstOrFail();
        $variantName = $this->buildVariantName(array_merge($variant->toArray(), $data));
        $data['name'] = $variantName;
        $data['slug'] = setSlug($variantName);
        $variant->update($data);

        return $variant->fresh(['product:id,name,uuid']);
    }

    public function saveBulkVariants(int $productId, array $variants): array
    {
        $created = [];
        foreach ($variants as $variantData) {
            $payload = array_merge($variantData, [
                'product_id' => $productId,
            ]);
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
