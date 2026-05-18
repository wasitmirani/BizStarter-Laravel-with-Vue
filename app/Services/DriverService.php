<?php

namespace App\Services;

use App\Enums\UserTypeEnum;
use App\Models\Driver;
use App\Models\User;
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

    public function getDriversList($params, $relations = ['user', 'warehouses:id,name,label'], $withCount = [])
    {
        $sortBy = $params['sort_by'] ?? 'id';
        $sortDir = $params['sort_dir'] ?? 'asc';

        $query = $this->model
            ->withCount($withCount)
            ->filters($params)
            ->with($relations);

        if ($sortBy === 'full_name') {
            $query->join('users', 'users.id', '=', 'drivers.user_id')
                ->orderBy('users.name', $sortDir)
                ->select('drivers.*');
        } else {
            $query->sortingBy($sortBy, $sortDir);
        }

        return $query->retrieve($params['paginated'] ?? false, $this->resolvePerPage($params));
    }

    public function saveDriver(array $data)
    {
        return DB::transaction(function () use ($data) {
            $warehouseIds = $data['warehouse_ids'] ?? [];
            [$userData, $driverData] = $this->splitDriverPayload($data);

            $userService = app(UserService::class);
            $user = User::create(array_merge($userData, [
                'user_type' => UserTypeEnum::Driver->value,
                'user_name' => $userService->generateUsername($userData['first_name'], $userData['last_name']),
                'slug' => mapFirstNameLastSlug($userData['first_name'], $userData['last_name']),
                'uuid' => $this->generateUniqueUserUuid(),
                'tenant_id' => tenant('id')->id ?? null,
            ]));

            $driver = $this->model->create(array_merge($driverData, [
                'user_id' => $user->id,
                'driver_code' => $this->generateUniqueDriverCode(),
            ]));

            $driver->warehouses()->sync($warehouseIds);

            return $driver->load(['user', 'warehouses:id,name,label']);
        });
    }

    public function updateDriver(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $warehouseIds = array_key_exists('warehouse_ids', $data) ? ($data['warehouse_ids'] ?? []) : null;
            [$userData, $driverData] = $this->splitDriverPayload($data);

            $driver = $this->model->with('user')->findOrFail($id);
            $driver->update($driverData);

            if ($driver->user) {
                $driver->user->update($userData);
            }

            if ($warehouseIds !== null) {
                $driver->warehouses()->sync($warehouseIds);
            }

            return $driver->fresh(['user', 'warehouses:id,name,label']);
        });
    }

    public function deleteDriver(int $id): void
    {
        DB::transaction(function () use ($id) {
            $driver = $this->model->with('user')->findOrFail($id);
            $user = $driver->user;
            $driver->delete();

            if ($user && $user->user_type === UserTypeEnum::Driver) {
                $user->delete();
            }
        });
    }

    public function getDriverByUuid(string $uuid): Driver
    {
        $driver = $this->model
            ->with(['user', 'warehouses:id,name,label'])
            ->whereHas('user', fn ($q) => $q->where('uuid', $uuid))
            ->first();

        if (! $driver) {
            throw new \RuntimeException('Driver not found');
        }

        return $driver;
    }

    private function splitDriverPayload(array $data): array
    {
        $fullName = trim((string) ($data['full_name'] ?? ''));
        $parts = preg_split('/\s+/', $fullName, 2);
        $firstName = $parts[0] ?? '';
        $lastName = $parts[1] ?? '';

        $userData = [
            'name' => $fullName,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'address' => $data['address'] ?? null,
            'city' => $data['city'] ?? null,
        ];

        if (! empty($data['password'])) {
            $userData['password'] = $data['password'];
        }

        if (array_key_exists('profile_image', $data)) {
            $userData['thumbnail'] = $this->normalizeThumbnail($data['profile_image']);
        }

        $driverData = array_filter([
            'type' => $data['type'] ?? null,
            'cnic' => $data['cnic'] ?? null,
            'license_number' => $data['license_number'] ?? null,
            'license_expiry_date' => $data['license_expiry_date'] ?? null,
            'joining_date' => $data['joining_date'] ?? null,
            'status' => $data['status'] ?? null,
        ], fn ($value) => $value !== null);

        return [$userData, $driverData];
    }

    private function normalizeThumbnail(?string $value): ?string
    {
        if (empty($value)) {
            return null;
        }

        return basename(parse_url($value, PHP_URL_PATH) ?: $value);
    }

    private function generateUniqueDriverCode(): string
    {
        do {
            $code = 'DRV-' . str_pad((string) random_int(1, 99999), 5, '0', STR_PAD_LEFT);
        } while ($this->model->where('driver_code', $code)->exists());

        return $code;
    }

    private function generateUniqueUserUuid(): string
    {
        do {
            $uuid = genUUID();
        } while (User::where('uuid', $uuid)->exists());

        return $uuid;
    }
}
