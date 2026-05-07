<?php

namespace App\Services;

use App\Models\Warehouse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;

class WarehouseService extends BaseService
{
    protected $allowedFilters = [
        'id',
        'search',
        'name',
        'status',
    ];

    protected function model(): ?string
    {
        return Warehouse::class;
    }

    public function getWarehousesList($params=[], $relations = [], $withCount = [])
    {
        return $this->model
            ->withCount($withCount)
            ->sorting($params['sort_dir'] ?? 'asc')
            ->filters($params)
            ->with($relations)
            ->retrieve($params['paginated'] ?? false, $this->resolvePerPage($params));
    }

    public function saveWarehouse(array $data)
    {
        return DB::transaction(function () use ($data) {

            $warehouseData = array_merge($data, [
                'tenant_id' => tenant('id')->id ?? null,
                'slug'      => $this->generateUniqueSlug($data['name']),
                'uuid'      => $this->generateUniqueUuid(),
                // Generate 5 character warehouse label
                'label'     => generateWarehouseLabel($data['name']),
            ]);
        
            return $this->model->create($warehouseData);
        });
    }

    public function updateWarehouse(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $warehouse = $this->model->findOrFail($id);

            $updateData = $data;
            if (!empty($data['name'])) {
                $updateData['slug'] = $this->generateUniqueSlug($data['name'], $id);
            }

            $warehouse->update($updateData);

            return $warehouse->fresh();
        });
    }

    public function getWarehouseByUuid(string $uuid)
    {
        try {
            return $this->model->where('uuid', $uuid)->first();
        } catch (ModelNotFoundException $e) {
            throw new \Exception('Warehouse not found');
        }
    }

    private function generateUniqueSlug(string $name, ?int $excludeId = null): string
    {
        $slug = setSlug($name);
        $originalSlug = $slug;
        $counter = 1;

        while ($this->isSlugExists($slug, $excludeId)) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    private function isSlugExists(string $slug, ?int $excludeId = null): bool
    {
        return $this->model
            ->when($excludeId, fn ($query) => $query->where('id', '!=', $excludeId))
            ->where('slug', $slug)
            ->exists();
    }

    private function generateUniqueUuid(): string
    {
        do {
            $uuid = genUUID();
        } while ($this->model->where('uuid', $uuid)->exists());

        return $uuid;
    }
}
