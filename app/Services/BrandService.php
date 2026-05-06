<?php

namespace App\Services;

use App\Models\Brand;

class BrandService extends BaseService
{
    protected function model(): ?string
    {
        return Brand::class;
    }

    public function brands(array $params = [])
    {
        $perPage = (int) ($params['per_page'] ?? 15);
        $perPage = $perPage > 0 ? $perPage : 15;

        return $this->model
            ->when(!isset($params['sort_by']), fn($q) => $q->latest())
            ->when(isset($params['sort_by']), fn($q) => $q->sortingBy($params['sort_by'], $params['sort_dir'] ?? 'desc'))
            ->filters($params)
            ->retrieve($params['paginated'] ?? true, $perPage);
    }

    public function saveBrand(array $data): Brand
    {
        $payload = array_merge($data, [
            'uuid' => genUUID(),
            'slug' => setSlug($data['name']),
        ]);

        return $this->model->create($payload);
    }

    public function updateBrand(string $uuid, array $data): Brand
    {
        $brand = $this->model->where('uuid', $uuid)->firstOrFail();
        $data['slug'] = setSlug($data['name'] ?? $brand->name);
        $brand->update($data);

        return $brand->fresh();
    }

    public function fetchByUuid(string $uuid): ?Brand
    {
        return $this->model->where('uuid', $uuid)->first();
    }

    public function deleteByUuid(string $uuid): bool
    {
        $brand = $this->model->where('uuid', $uuid)->firstOrFail();
        return (bool) $brand->delete();
    }
}
