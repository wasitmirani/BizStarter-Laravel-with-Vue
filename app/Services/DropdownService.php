<?php

namespace App\Services;

class DropdownService
{

    public function getRolesDropdown($params)
    {
        // Assuming RoleService is another service that fetches roles
        $roles = app(RoleService::class)->getRolesList($params ?? []);
        return $roles;
    }

    public function countries($params){
        $coun   
    }
}
