<?php

namespace App\Services;

use App\Models\Role;
use App\Services\BaseService;



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

    public function getRolesList($params,$relations =[], $withCount = [])
    {
        // Assuming Role is an Eloquent model
        return $this->model
        ->withCount($withCount)
        ->sorting($params['sort_dir'] ?? 'asc')
        ->filters($this->allowedFilters)
        ->with($relations)
        ->retrieve($params['paginated'] ?? false, $this->resolvePerPage($params));
    }

    public function saveRole($data)
    {
        $role = $this->model->create($data);
        if (isset($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }
        if (isset($data['users'])) {
            $role->users()->sync($data['users']);
        }
        return $role;
    
    }
}
