<?php

namespace App\Http\Controllers\backend\role;

use App\Contracts\UserFilterable;
use App\Http\Controllers\Controller;
use App\Services\DropdownService;
use App\Services\RoleService;
use Illuminate\Http\Request;

class RoleController extends Controller implements UserFilterable
{
    public function getRoles(Request $request)
    {
        $roles = app(DropdownService::class)->getRolesDropdown($request->all());
        return response()->json(['roles' => $roles]);
    }

    public function index(Request $request){

        $filters = $request->only(self::ALLOWED_FILTERS);
        $filters['paginated'] = true;
        $roles =app(RoleService::class)->getRolesList($filters,withCount: ['users','permissions']);
        // app(RoleService::class)->getRolesList(['limit'=>4],['users:id,name'])
         $data=[
            'roles'=>$roles,
        ];
        return responseJson('users fetched successfully',$data,true);
    }
}
