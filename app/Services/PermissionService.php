<?php

namespace App\Services;

use App\Models\Permission;
use App\Models\Role;
use App\Services\BaseService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PermissionService extends BaseService
{
    protected $allowedFilters = [
        'id',
        'search',
        'name',
    ];

    protected function model(): ?string
    {
        return Permission::class;
    }

    public function getPermissionsList($params, $relations = [], $withCount = [])
    {
        return $this->model
            ->withCount($withCount)
            ->sorting($params['sort_dir'] ?? 'asc')
            ->filters($params)
            ->with($relations)
            ->retrieve($params['paginated'] ?? false, $this->resolvePerPage($params));
    }

    public function savePermission($data)
    {
        return DB::transaction(function () use ($data) {
            $existingPermission = $this->model->where('name', $data['name'])
                ->where('guard_name', $data['guard_name'] ?? 'web')
                ->first();

            if ($existingPermission) {
                throw new \Exception('Permission with this name already exists');
            }

            $permissionData = array_merge($data, [
                'slug' => $this->generateUniqueSlug($data['name']),
                'guard_name' => $data['guard_name'] ?? 'web',
                'uuid' => $this->generateUniqueUuid(),
                'scope' => $data['scope'] ?? 'system',
            ]);

            unset($permissionData['roles'], $permissionData['users']);

            $permission = $this->model->create($permissionData);

            if (!empty($data['roles'])) {
                $permission->roles()->sync($data['roles']);
            }

            if (!empty($data['users']) && method_exists($permission, 'users')) {
                $permission->users()->sync($data['users']);
            }

            return $permission->load(['roles']);
        });
    }

    public function updatePermission($id, $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $permission = $this->model->findOrFail($id);

            $existingPermission = $this->model->where('name', $data['name'])
                ->where('guard_name', $data['guard_name'] ?? $permission->guard_name)
                ->where('id', '!=', $id)
                ->first();

            if ($existingPermission) {
                throw new \Exception('Permission with this name already exists');
            }

            $updateData = [
                'name' => $data['name'] ?? $permission->name,
                'slug' => isset($data['name']) ? $this->generateUniqueSlug($data['name'], $permission->id) : $permission->slug,
                'guard_name' => $data['guard_name'] ?? $permission->guard_name,
            ];

            $permission->update($updateData);

            if (array_key_exists('roles', $data)) {
                $permission->roles()->sync($data['roles'] ?? []);
            }

            if (array_key_exists('users', $data) && method_exists($permission, 'users')) {
                $permission->users()->sync($data['users'] ?? []);
            }

            return $permission->fresh(['roles']);
        });
    }

    public function getPermissionByUuid($uuid, $relations = [])
    {
        try {
            $permission = $this->model->with($relations)->where('uuid', $uuid)->first();

            if (!$permission) {
                throw new ModelNotFoundException('Permission not found');
            }

            return $permission;
        } catch (ModelNotFoundException $e) {
            Log::warning('Permission not found by UUID: ' . $uuid);
            throw new \Exception('Permission not found');
        }
    }

    public function deletePermission($id)
    {
        return DB::transaction(function () use ($id) {
            $permission = $this->model->findOrFail($id);
            $permission->roles()->detach();

            if (method_exists($permission, 'users')) {
                $permission->users()->detach();
            }

            return $permission->delete();
        });
    }

    private function generateUniqueSlug($name, $excludeId = null)
    {
        $slug = setSlug($name);
        $originalSlug = $slug;
        $counter = 1;

        $query = $this->model->where('slug', $slug);
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        while ($query->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $query = $this->model->where('slug', $slug);
            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }
            $counter++;
        }

        return $slug;
    }

    private function generateUniqueUuid()
    {
        do {
            $uuid = genUUID();
        } while ($this->model->where('uuid', $uuid)->exists());

        return $uuid;
    }
}
