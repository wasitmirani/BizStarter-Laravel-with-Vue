<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;

class TenantAppController extends Controller
{
    public function index()
    {
        return view('tenant.pages.index');
    }
}
