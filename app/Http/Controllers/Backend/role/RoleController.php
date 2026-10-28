<?php

namespace App\Http\Controllers\Backend\Role;

use App\Contracts\BaseFilterable;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Models\Role;
use App\Models\User;
use App\Services\DropdownService;
use App\Services\RoleService;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller implements BaseFilterable
{
    public function getRoles(Request $request)
    {
        $roles = app(DropdownService::class)->getRolesDropdown($request->all());
        return response()->json(['roles' => $roles]);
    }

    public function index(Request $request){
        $filters = $request->only(self::ALLOWED_FILTERS);
        $filters['paginated'] = true;
        $roles = app(RoleService::class)->getRolesList($filters, withCount: ['users', 'permissions']);

        $data = [
            'roles' => $roles,
            'stats' => [
                'total' => Role::count(),
                'system' => Role::where('scope', 'system')->count(),
                'custom' => Role::where(function ($query) {
                    $query->whereNull('scope')->orWhere('scope', '!=', 'system');
                })->count(),
                'permissions' => Permission::count(),
                'assigned_users' => User::has('roles')->count(),
            ],
        ];
        return responseJson('Roles fetched successfully', $data, true);
    }

    public function store(StoreRoleRequest $request){
        
        $data = $request->validated();
        $role = app(RoleService::class)->saveRole($data);
        return responseJson('Role created successfully', ['role' => $role], true);
    }

    public function show($uuid)
    {
        try {
            $role = app(RoleService::class)->getRoleByUuid($uuid, ['users:id,name,thumbnail,uuid,email', 'permissions:id,name']);

            if (! $role) {
                return responseJson('Role not found', null, false, 404);
            }

            return responseJson('Role fetched successfully', ['role' => $role], true);
        } catch (\Exception $e) {
            return responseJson('Role not found', null, false, 404);
        }
    }
    public function update(UpdateRoleRequest $request, $id)
    {
        try {
            $data = $request->validated();
            $role = app(RoleService::class)->updateRole($id, $data);
            return responseJson('Role updated successfully', ['role' => $role], true);
        } catch (\Exception $e) {
            return responseJson('Failed to update role: ' . $e->getMessage(), null, false, 500);
        }
    }

    public function destroy($id)
    {
        try {
            $role = Role::findOrFail($id);

            // Built-in roles are required by the platform and must never be removed.
            if ($role->scope === 'system' || in_array(strtolower($role->name), ['admin', 'super-admin'], true)) {
                return responseJson('Built-in roles cannot be deleted', null, false, 403);
            }

            $role->delete();
            return responseJson('Role deleted successfully', null, true);
        } catch (\Exception $e) {
            return responseJson('Failed to delete role', null, false, 500);
        }
    }
}
