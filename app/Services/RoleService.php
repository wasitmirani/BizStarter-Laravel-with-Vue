<?php

namespace App\Services;

use App\Models\User;
use Spatie\Permission\Models\Role;


class RoleService{



    public function getRolesList($params)
    {
        // Assuming Role is an Eloquent model
      return Role::sorting($params['sort_dir'] ?? 'asc')
                  ->filters($params->only(['id','search', 'name', 'guard_name']))
                  ->retrieve($params['paginated'] ?? false, $params['per_page'] ?? 15);


    }
}
