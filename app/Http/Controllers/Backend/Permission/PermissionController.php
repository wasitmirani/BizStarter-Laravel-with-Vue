<?php

namespace App\Http\Controllers\Backend\Permission;

use App\Contracts\BaseFilterable;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePermissionRequest;
use App\Http\Requests\UpdatePermissionRequest;
use App\Models\Permission;
use App\Services\PermissionService;
use Illuminate\Http\Request;

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
            $permission = app(PermissionService::class)->getPermissionByUuid($uuid, ['roles:id,name']);
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
            app(PermissionService::class)->deletePermission($id);
            return responseJson('Permission deleted successfully', null, true);
        } catch (\Exception $e) {
            return responseJson('Failed to delete permission', null, false, 500);
        }
    }

}
