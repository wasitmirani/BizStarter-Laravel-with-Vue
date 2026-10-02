<?php

use App\Http\Controllers\Backend\Dashboard\DashboardController;
use App\Http\Controllers\Backend\Dropdown\DropDownController;
use App\Http\Controllers\Backend\Media\UploadController;
use App\Http\Controllers\Backend\Permission\PermissionController;
use App\Http\Controllers\Backend\Role\RoleController;
use App\Http\Controllers\Backend\Tenant\TenantController;
use App\Http\Controllers\Backend\User\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/me', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('/app')->middleware('auth:sanctum')->group(function () {
    Route::get('/permissions', function (Request $request) {
        return response()->json([
            'permissions' => $request->user()->getAllPermissions()->pluck('name')->values()->all(),
        ]);
    });

    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Tenants
    Route::get('tenant', [TenantController::class, 'index'])->middleware('permission:tenants-list');
    Route::post('tenant', [TenantController::class, 'store'])->middleware('permission:create-tenant');
    Route::get('tenant/{tenant}', [TenantController::class, 'show'])->middleware('permission:show-tenant');
    Route::put('tenant/{tenant}', [TenantController::class, 'update'])->middleware('permission:edit-tenant');
    Route::patch('tenant/{tenant}', [TenantController::class, 'update'])->middleware('permission:edit-tenant');
    Route::delete('tenant/{tenant}', [TenantController::class, 'destroy'])->middleware('permission:delete-tenant');
    Route::patch('tenant/{tenant}/status', [TenantController::class, 'updateStatus'])->middleware('permission:edit-tenant');
    Route::post('tenant/{tenant}/domains', [TenantController::class, 'storeDomain'])->middleware('permission:edit-tenant');
    Route::delete('tenant/{tenant}/domains/{domain}', [TenantController::class, 'destroyDomain'])->middleware('permission:edit-tenant');

    // Users
    Route::get('user', [UserController::class, 'index'])->middleware('permission:users-list');
    Route::post('user', [UserController::class, 'store'])->middleware('permission:create-user');
    Route::get('user/{user}', [UserController::class, 'show'])->middleware('permission:show-user');
    Route::put('user/{user}', [UserController::class, 'update'])->middleware('permission:edit-user');
    Route::patch('user/{user}', [UserController::class, 'update'])->middleware('permission:edit-user');
    Route::delete('user/{user}', [UserController::class, 'destroy'])->middleware('permission:delete-user');
    Route::post('/password/update', [UserController::class, 'updatePassword']);
    Route::post('user/{uuid}/impersonate', [UserController::class, 'impersonate']);
    Route::post('impersonate/leave', [UserController::class, 'leaveImpersonate']);

    // Roles
    Route::get('role', [RoleController::class, 'index'])->middleware('permission:roles-list');
    Route::post('role', [RoleController::class, 'store'])->middleware('permission:create-role');
    Route::get('role/{role}', [RoleController::class, 'show'])->middleware('permission:show-role');
    Route::put('role/{role}', [RoleController::class, 'update'])->middleware('permission:edit-role');
    Route::patch('role/{role}', [RoleController::class, 'update'])->middleware('permission:edit-role');
    Route::delete('role/{role}', [RoleController::class, 'destroy'])->middleware('permission:delete-role');

    // Permissions
    Route::get('permission', [PermissionController::class, 'index'])->middleware('permission:permissions-list');
    Route::post('permission', [PermissionController::class, 'store'])->middleware('permission:create-permission');
    Route::get('permission/{permission}', [PermissionController::class, 'show'])->middleware('permission:show-permission');
    Route::put('permission/{permission}', [PermissionController::class, 'update'])->middleware('permission:edit-permission');
    Route::patch('permission/{permission}', [PermissionController::class, 'update'])->middleware('permission:edit-permission');
    Route::delete('permission/{permission}', [PermissionController::class, 'destroy'])->middleware('permission:delete-permission');

    // Uploads
    Route::prefix('upload')->group(function () {
        Route::post('/{type}/image', [UploadController::class, 'uploadSingleImage']);
    });

    Route::prefix('/dropdown')->group(function () {
        Route::get('/options-list', [DropDownController::class, 'getListOptions']);
        Route::get('/languages-list', [DropDownController::class, 'getLanguages']);
        Route::get('/timezones-list', [DropDownController::class, 'getTimezones']);
        Route::get('/countries-list', [DropDownController::class, 'getCountries']);
        Route::get('/roles-list', [RoleController::class, 'getRoles']);
        Route::get('/users-list', [UserController::class, 'getUsers']);
        Route::get('/permissions-list', [PermissionController::class, 'getPermissionsList']);
    });
});
