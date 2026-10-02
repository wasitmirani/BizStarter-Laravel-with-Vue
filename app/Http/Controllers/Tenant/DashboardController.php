<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function __invoke(Request $request): View
    {
        return view('tenant.dashboard', [
            'tenant' => tenant(),
            'user' => $request->user(),
        ]);
    }
}
