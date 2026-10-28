<?php

namespace App\Http\Controllers\Backend\Permission;

use App\Contracts\BaseFilterable;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePermissionRequest;
use App\Http\Requests\UpdatePermissionRequest;
use App\Models\Permission;
use App\Models\Role;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PermissionController extends Controller implements BaseFilterable
{
    public function getPermissionsList(Request $request){
        try {
            $permissions = Permission::orderBy('name', 'asc')->get(['id', 'name']);

            $data = [
                'permissions' => $permissions,
            ];

            return responseJson('Permissions fetched successfully', $data, true);
        } catch (\Exception $e) {
            return responseJson('Failed to fetch permissions', null, false, 500);
        }
    }


    public function index(Request $request){
        // Implement pagination, filtering, etc. as needed

        $filters = $request->only(self::ALLOWED_FILTERS);
        $filters['paginated'] = true;
        $permissions =app(PermissionService::class)->getPermissionsList($filters, withCount: ['roles', 'users']);
        $data = [
            'permissions' => $permissions,
            'stats' => [
                'total' => Permission::count(),
                'system' => Permission::where('scope', 'system')->count(),
                'custom' => Permission::where(function ($query) {
                    $query->whereNull('scope')->orWhere('scope', '!=', 'system');
                })->count(),
                'roles' => Role::count(),
                'assigned_roles' => DB::table(config('permission.table_names.role_has_permissions'))->count(),
            ],
        ];
        return responseJson('Permissions fetched successfully', $data, true);
    }

    public function store(StorePermissionRequest $request){
        $data = $request->validated();
        $permission = app(PermissionService::class)->savePermission($data);
        return responseJson('Permission created successfully', ['permission' => $permission], true);
    }

    public function show($uuid)
    {
        try {
            $permission = app(PermissionService::class)->getPermissionByUuid($uuid, ['roles:id,name,uuid,scope']);
            return responseJson('Permission fetched successfully', ['permission' => $permission], true);
        } catch (\Exception $e) {
            return responseJson('Permission not found', null, false, 404);
        }
    }

    public function update(UpdatePermissionRequest $request, $id)
    {
        try {
            $data = $request->validated();
            $permission = app(PermissionService::class)->updatePermission($id, $data);
            return responseJson('Permission updated successfully', ['permission' => $permission], true);
        } catch (\Exception $e) {
            return responseJson('Failed to update permission: ' . $e->getMessage(), null, false, 500);
        }
    }

    public function destroy($id)
    {
        try {
            $permission = Permission::findOrFail($id);

            if ($permission->scope === 'system') {
                return responseJson('Built-in permissions cannot be deleted', null, false, 403);
            }

            app(PermissionService::class)->deletePermission($id);
            return responseJson('Permission deleted successfully', null, true);
        } catch (\Exception $e) {
            return responseJson('Failed to delete permission', null, false, 500);
        }
    }

}
