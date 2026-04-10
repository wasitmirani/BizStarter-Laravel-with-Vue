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

    public function saveVariant(array $data): ProductVariant
    {
        $payload = array_merge($data, [
            'uuid' => genUUID(),
            'slug' => setSlug($data['name']),
        ]);

        return $this->model->create($payload);
    }

    public function updateVariant(string $uuid, array $data): ProductVariant
    {
        $variant = $this->model->where('uuid', $uuid)->firstOrFail();
        $data['slug'] = setSlug($data['name'] ?? $variant->name);
        $variant->update($data);

        return $variant->fresh(['product:id,name,uuid']);
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
