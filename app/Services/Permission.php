<?php

namespace App\Services;

use App\Models\Role;
use App\Models\Tenant;
use App\Services\BaseService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;

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

    public function getRolesList($params, $relations = [], $withCount = [])
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

    public function saveRole($data)
    {
        return DB::transaction(function () use ($data) {
            $permissions = $data['permissions'] ?? [];
            $users = $data['users'] ?? [];
            unset($data['permissions'], $data['users']);
            $data = array_merge($data, [
                'tenant_id' => tenant('id')->id,
                'slug' => setSlug($data['name']),
                'guard_name'=>  'api',
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

    public function updateRole($id, $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $role = $this->model->findOrFail($id);
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

            return $role->fresh(['users', 'permissions']);
        });
    }

    public function getRoleByUuid($uuid, $relations = [])
    {
        try {
            return $this->model->select('name','id','created_at')->with($relations)->where('uuid', $uuid)->first();
        } catch (ModelNotFoundException $e) {
            throw new \Exception('Role not found');
        }
    }
}
