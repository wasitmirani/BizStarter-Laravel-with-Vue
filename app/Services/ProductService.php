<?php

namespace App\Services;

use App\Models\Product;

class ProductService extends BaseService
{
    protected function model(): ?string
    {
        return Product::class;
    }

    public function products(array $params = [])
    {
        $perPage = (int) ($params['per_page'] ?? 15);
        $perPage = $perPage > 0 ? $perPage : 15;

        return $this->model
            ->with(['category:id,name,uuid', 'brand:id,name,uuid'])
            ->when(!isset($params['sort_by']), fn($q) => $q->latest())
            ->when(isset($params['sort_by']), fn($q) => $q->sortingBy($params['sort_by'], $params['sort_dir'] ?? 'desc'))
            ->filters($params)
            ->retrieve($params['paginated'] ?? true, $perPage);
    }

    public function saveProduct(array $data): Product
    {
        $payload = array_merge($data, [
            'uuid' => genUUID(),
            'slug' => setSlug($data['name']),
        ]);

        return $this->model->create($payload);
    }

    public function updateProduct(string $uuid, array $data): Product
    {
        $product = $this->model->where('uuid', $uuid)->firstOrFail();
        $data['slug'] = setSlug($data['name'] ?? $product->name);
        $product->update($data);

        return $product->fresh(['category:id,name,uuid', 'brand:id,name,uuid']);
    }

    public function fetchByUuid(string $uuid): ?Product
    {
        return $this->model->with(['category:id,name,uuid', 'brand:id,name,uuid'])->where('uuid', $uuid)->first();
    }

    public function deleteByUuid(string $uuid): bool
    {
        $product = $this->model->where('uuid', $uuid)->firstOrFail();
        return (bool) $product->delete();
    }
}
