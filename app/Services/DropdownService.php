<?php

namespace App\Services;

class DropdownService
{

    public function getRolesDropdown($params): array
    {
        // Assuming RoleService is another service that fetches roles
        $roles = app(RoleService::class)->getRolesList($params ?? []);
        return $roles->pluck('name', 'id')->toArray();
    }
}
