<?php

namespace App\Services;

use App\Models\Category;

class CategoryService extends BaseService
{
    protected function model(): ?string
    {
        return Category::class;
    }

    public function categories(array $params = [])
    {
        $perPage = (int) ($params['per_page'] ?? 15);
        $perPage = $perPage > 0 ? $perPage : 15;

        return $this->model
            ->when(!isset($params['sort_by']), fn($q) => $q->latest())
            ->when(isset($params['sort_by']), fn($q) => $q->sortingBy($params['sort_by'], $params['sort_dir'] ?? 'desc'))
            ->filters($params)
            ->retrieve($params['paginated'] ?? true, $perPage);
    }

    public function saveCategory(array $data): Category
    {
        $payload = array_merge($data, [
            'uuid' => genUUID(),
            'slug' => setSlug($data['name']),
        ]);

        return $this->model->create($payload);
    }

    public function updateCategory(string $uuid, array $data): Category
    {
        $category = $this->model->where('uuid', $uuid)->firstOrFail();
        $data['slug'] = setSlug($data['name'] ?? $category->name);
        $category->update($data);

        return $category->fresh();
    }

    public function fetchByUuid(string $uuid): ?Category
    {
        return $this->model->where('uuid', $uuid)->first();
    }

    public function deleteByUuid(string $uuid): bool
    {
        $category = $this->model->where('uuid', $uuid)->firstOrFail();
        return (bool) $category->delete();
    }
}
