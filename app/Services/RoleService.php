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

    public function getRolesList($params,$relations =[])
    {
        // Assuming Role is an Eloquent model
      return $this->model->sorting($params['sort_dir'] ?? 'asc')
                  ->filters($this->allowedFilters)
                  ->with($relations)
                  ->retrieve($params['paginated'] ?? false, $params['per_page'] ?? 15);


    }
}
