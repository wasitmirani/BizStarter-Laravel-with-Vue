<?php

declare(strict_types=1);

use App\Http\Controllers\Tenant\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Tenant\TenantAppController;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Routes for tenant domains only. Auth uses the tenant database users table.
| Authenticated UI is a Vue SPA under /app (same pattern as central backend).
|
*/

Route::middleware([
    'web',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {
    Route::get('/', function () {
        if (auth()->check()) {
            return redirect('/app/dashboard');
        }

        return redirect()->route('tenant.login');
    })->name('tenant.home');

    Route::middleware('guest')->group(function () {
        Route::get('/login', [AuthenticatedSessionController::class, 'create'])
            ->name('tenant.login');
        Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    });

    Route::middleware('auth')->group(function () {
        Route::redirect('/dashboard', '/app/dashboard');

        Route::get('/app', fn () => redirect('/app/dashboard'));

        Route::get('/app/{module?}/{feature?}/{action?}/{id?}', [TenantAppController::class, 'index'])
            ->name('tenant.dashboard');

        Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
            ->name('tenant.logout');
    });
});
