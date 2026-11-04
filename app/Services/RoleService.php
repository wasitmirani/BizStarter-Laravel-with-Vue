<?php

namespace App\Services;

use App\Models\Role;
use App\Services\BaseService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;

class RoleService extends BaseService
{
    protected $allowedFilters = [
        'id',
        'search',
        'name',
        'guard_name',
    ];

    protected function model(): ?string
    {
        return Role::class;
    }

    public function getRolesList($params, $relations = [], $withCount = [])
    {
        return $this->model
            ->withCount($withCount)
            ->sorting($params['sort_dir'] ?? 'asc')
            ->filters($params)
            ->with($relations)
            ->retrieve($params['paginated'] ?? false, $this->resolvePerPage($params));
    }

    public function saveRole($data)
    {
        return DB::transaction(function () use ($data) {
            $permissions = $data['permissions'] ?? [];
            $users = $data['users'] ?? [];
            unset($data['permissions'], $data['users']);

            $data = array_merge($data, [
                'slug' => setSlug($data['name']),
                'guard_name' => $data['guard_name'] ?? 'web',
                'uuid' => genUUID(),
            ]);

            $role = $this->model->create($data);

            if (!empty($permissions)) {
                $role->syncPermissions($permissions);
            }

            if (!empty($users)) {
                $role->users()->sync($users);
            }

            return $role->load(['users', 'permissions']);
        });
    }

    /**
     * Resolve a role by uuid, falling back to its numeric id.
     */
    public function findByIdentifier(int|string $identifier): ?Role
    {
        if (is_numeric($identifier)) {
            return $this->model->find((int) $identifier);
        }

        return $this->model->where('uuid', $identifier)->first();
    }

    public function updateRole($id, $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $role = $this->findByIdentifier($id);

            if (!$role) {
                throw new ModelNotFoundException('Role not found');
            }

            $permissions = $data['permissions'] ?? null;
            $users = $data['users'] ?? null;

            unset($data['permissions'], $data['users']);

            $role->update([
                'name' => $data['name'] ?? $role->name,
                'slug' => setSlug($data['name'] ?? $role->name),
            ]);

            if ($permissions !== null) {
                $role->syncPermissions($permissions);
            }

            if ($users !== null) {
                $role->users()->sync($users);
            }

            return $role->fresh(['users:id,name,email,thumbnail', 'permissions:id,name']);
        });
    }

    public function getRoleByUuid($uuid, $relations = [])
    {
        $role = $this->model
            ->with($relations)
            ->when(
                is_numeric($uuid),
                fn ($query) => $query->where('id', $uuid),
                fn ($query) => $query->where('uuid', $uuid),
            )
            ->first();

        if (!$role) {
            throw new \Exception('Role not found');
        }

        return $role;
    }
}
