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
            
            $permissions = $data['permissions'] ?? [];
            
            unset($data['permissions']);
            
            $role->update($data);
            
            if (!empty($permissions)) {
                $role->syncPermissions($permissions);
            }
            
            return $role->fresh(['users', 'permissions']);
        });
    }
}
