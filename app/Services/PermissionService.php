<?php

namespace App\Services;

use App\Models\Permission;
use App\Models\Role;
use App\Models\Tenant;
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
        // Build allowed filters array from params
        $filterData = [];
        foreach ($this->allowedFilters as $filter) {
            if (isset($params[$filter])) {
                $filterData[$filter] = $params[$filter];
            }
        }

        return $this->model
            ->withCount($withCount)
            ->sorting($params['sort_dir'] ?? 'asc')
            ->filters($filterData)
            ->with($relations)
            ->retrieve($params['paginated'] ?? false, $this->resolvePerPage($params));
    }

    /**
     * Save a new permission
     */
    public function savePermission($data)
    {
        return DB::transaction(function () use ($data) {
            // Check if permission with same name already exists
            $existingPermission = $this->model->where('name', $data['name'])
                ->where('tenant_id', tenant('id')->id ?? null)
                ->first();

            if ($existingPermission) {
                throw new \Exception('Permission with this name already exists');
            }

            // Prepare permission data
            $permissionData = array_merge($data, [
                'tenant_id' => tenant('id')->id ?? null,
                'slug' => $this->generateUniqueSlug($data['name']),
                'guard_name' => $data['guard_name'] ?? 'api',
                'uuid' => $this->generateUniqueUuid(),
            ]);

            // Remove any relationship data
            unset($permissionData['roles'], $permissionData['users']);

            // Create the permission
            $permission = $this->model->create($permissionData);

            // Sync roles if provided
            if (!empty($data['roles'])) {
                $permission->roles()->sync($data['roles']);
            }

            // Sync users if provided (if you have this relationship)
            if (!empty($data['users']) && method_exists($permission, 'users')) {
                $permission->users()->sync($data['users']);
            }

            return $permission->load(['roles']);
        });
    }

    /**
     * Update an existing permission
     */
    public function updatePermission($id, $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $permission = $this->model->findOrFail($id);

            // Check for duplicate name (excluding current permission)
            $existingPermission = $this->model->where('name', $data['name'])
                ->where('tenant_id', $permission->tenant_id)
                ->where('id', '!=', $id)
                ->first();

            if ($existingPermission) {
                throw new \Exception('Permission with this name already exists');
            }

            // Prepare update data
            $updateData = [
                'name' => $data['name'] ?? $permission->name,
                'slug' => isset($data['name']) ? $this->generateUniqueSlug($data['name'], $permission->id) : $permission->slug,
                'guard_name' => $data['guard_name'] ?? $permission->guard_name,
            ];

            // Update the permission
            $permission->update($updateData);

            // Sync roles if provided
            if (array_key_exists('roles', $data)) {
                $permission->roles()->sync($data['roles'] ?? []);
            }

            // Sync users if provided and relationship exists
            if (array_key_exists('users', $data) && method_exists($permission, 'users')) {
                $permission->users()->sync($data['users'] ?? []);
            }

            return $permission->fresh(['roles']);
        });
    }

    /**
     * Get permission by UUID
     */
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

    /**
     * Delete a permission
     */
    public function deletePermission($id)
    {
        return DB::transaction(function () use ($id) {
            $permission = $this->model->findOrFail($id);

            // Detach all roles before deleting
            $permission->roles()->detach();

            // Detach users if relationship exists
            if (method_exists($permission, 'users')) {
                $permission->users()->detach();
            }

            return $permission->delete();
        });
    }

    /**
     * Assign permission to role
     */
    public function assignPermissionToRole($permissionId, $roleId)
    {
        return DB::transaction(function () use ($permissionId, $roleId) {
            $permission = $this->model->findOrFail($permissionId);
            $role = app(Role::class)->findOrFail($roleId);

            if (!$role->hasPermissionTo($permission->name)) {
                $role->givePermissionTo($permission);
            }

            return $permission;
        });
    }

    /**
     * Remove permission from role
     */
    public function removePermissionFromRole($permissionId, $roleId)
    {
        return DB::transaction(function () use ($permissionId, $roleId) {
            $permission = $this->model->findOrFail($permissionId);
            $role = app(Role::class)->findOrFail($roleId);

            $role->revokePermissionTo($permission);

            return $permission;
        });
    }

    /**
     * Generate unique slug for permission
     */
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

    /**
     * Generate unique UUID
     */
    private function generateUniqueUuid()
    {
        do {
            $uuid = genUUID();
        } while ($this->model->where('uuid', $uuid)->exists());

        return $uuid;
    }

    /**
     * Get permissions by guard name
     */
    public function getPermissionsByGuard($guardName = 'api')
    {
        return $this->model->where('guard_name', $guardName)->get();
    }

    /**
     * Sync permissions for a role
     */
    public function syncRolePermissions($roleId, array $permissionIds)
    {
        return DB::transaction(function () use ($roleId, $permissionIds) {
            $role = app(Role::class)->findOrFail($roleId);
            $permissions = $this->model->whereIn('id', $permissionIds)->get();

            return $role->syncPermissions($permissions);
        });
    }
}
