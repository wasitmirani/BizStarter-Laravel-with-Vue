<?php

namespace App\Http\Controllers\Backend\Permission;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
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
        $permissions = Permission::orderBy('name', 'asc')->paginate(10);
        return responseJson('Permissions fetched successfully', ['permissions' => $permissions], true);
    }
}
