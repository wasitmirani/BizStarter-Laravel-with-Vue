<?php

namespace App\Http\Controllers\Backend\Permission;

use App\Contracts\UserFilterable;
use App\Http\Controllers\Controller;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller implements UserFilterable
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
}
