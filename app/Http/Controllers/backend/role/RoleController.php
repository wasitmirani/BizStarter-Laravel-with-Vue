<?php

namespace App\Http\Controllers\backend\role;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\DropdownService;

class RoleController extends Controller
{
    public function getRoles(Request $request)
    {
        $roles = app(DropdownService::class)->getRolesDropdown($request->all());
        return response()->json(['roles' => $roles]);
    }
}
