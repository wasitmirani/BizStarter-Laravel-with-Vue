<?php

namespace App\Services;

use App\Models\Driver;
use Illuminate\Support\Facades\DB;

class DriverService extends BaseService
{
    protected $allowedFilters = [
        'id',
        'search',
        'type',
        'status',
        'city',
        'warehouse_id',
    ];

    protected function model(): ?string
    {
        return Driver::class;
    }

    public function getDriversList($params, $relations = ['warehouses:id,name,label'], $withCount = [])
    {
        return $this->model
            ->withCount($withCount)
            ->sortingBy($params['sort_by'] ?? 'id', $params['sort_dir'] ?? 'asc')
            ->filters($params)
            ->with($relations)
            ->retrieve($params['paginated'] ?? false, $this->resolvePerPage($params));
    }

    public function saveDriver(array $data)
    {
        return DB::transaction(function () use ($data) {
            $warehouseIds = $data['warehouse_ids'] ?? [];
            unset($data['warehouse_ids']);

            $driverData = array_merge($this->normalizeDriverData($data), [
                'tenant_id' => tenant('id')->id ?? null,
                'driver_code' => $this->generateUniqueDriverCode(),
                'uuid' => $this->generateUniqueUuid(),
            ]);

            $driver = $this->model->create($driverData);
            $driver->warehouses()->sync($warehouseIds);

            return $driver->load('warehouses:id,name,label');
        });
    }

    public function updateDriver(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $warehouseIds = array_key_exists('warehouse_ids', $data) ? ($data['warehouse_ids'] ?? []) : null;
            unset($data['warehouse_ids']);

            $driver = $this->model->findOrFail($id);
            $driver->update($this->normalizeDriverData($data));

            if ($warehouseIds !== null) {
                $driver->warehouses()->sync($warehouseIds);
            }

            return $driver->fresh(['warehouses:id,name,label']);
        });
    }

    public function getDriverByUuid(string $uuid): Driver
    {
        $driver = $this->model->with('warehouses:id,name,label')->where('uuid', $uuid)->first();

        if (!$driver) {
            throw new \RuntimeException('Driver not found');
        }

        return $driver;
    }

    private function normalizeDriverData(array $data): array
    {
        if (array_key_exists('profile_image', $data) && empty($data['profile_image'])) {
            $data['profile_image'] = null;
        } elseif (!empty($data['profile_image'])) {
            $data['profile_image'] = basename(parse_url($data['profile_image'], PHP_URL_PATH) ?: $data['profile_image']);
        }

        return $data;
    }

    private function generateUniqueDriverCode(): string
    {
        do {
            $code = 'DRV-' . str_pad((string) random_int(1, 99999), 5, '0', STR_PAD_LEFT);
        } while ($this->model->where('driver_code', $code)->exists());

        return $code;
    }

    private function generateUniqueUuid(): string
    {
        do {
            $uuid = genUUID();
        } while ($this->model->where('uuid', $uuid)->exists());

        return $uuid;
    }
}
