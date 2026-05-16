<?php

use App\Http\Controllers\Backend\Dropdown\DropDownController;
use App\Http\Controllers\Backend\Media\UploadController;
use App\Http\Controllers\Backend\Permission\PermissionController;
use App\Http\Controllers\Backend\Role\RoleController;
use App\Http\Controllers\Backend\Settings\SettingController;
use App\Http\Controllers\Backend\Tenant\TenantController;
use App\Http\Controllers\Backend\User\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Models\Permission;

Route::get('/me', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// Route::get('/me', static fn () => response()->json(['user_name'=>"wasitmirani"]));
// ->middleware('auth:api')
Route::prefix('/app')->middleware('auth:sanctum')->group(function () {
    Route::get('/permissions', function (Request $request) {
        return response()->json([
            'permissions' => $request->user()->getAllPermissions()->pluck('name')->values()->all(),
        ]);
    });


    // Users
    Route::resource('user', UserController::class);
    Route::post('/password/update', [UserController::class, 'updatePassword']);
    Route::post('user/{uuid}/impersonate', [UserController::class, 'impersonate']);
    Route::post('impersonate/leave', [UserController::class, 'leaveImpersonate']);

    // Roles
    Route::resource('role',RoleController::class);

    // Permissions
    Route::resource('permission',PermissionController::class);

    // Tenants
    Route::resource('tenant', TenantController::class);
    Route::get('tenant-settings/current', [TenantController::class, 'current']);
    Route::put('tenant-settings/current', [TenantController::class, 'updateCurrent']);

    // Uploads
    Route::prefix('upload')->group(function() {
        Route::post('/{type}/image',[UploadController::class,'uploadSingleImage']);
    });

    Route::prefix('/dropdown')->group( function(){
        Route::get('/options-list',[DropDownController::class,'getListOptions']);
        Route::get('/languages-list',[DropDownController::class,'getLanguages']);
        Route::get('/timezones-list',[DropDownController::class,'getTimezones']);
        Route::get('/countries-list',[DropDownController::class,'getCountries']);
        Route::get('/roles-list',[RoleController::class,'getRoles']);
        Route::get('/users-list',[UserController::class,'getUsers']);
        Route::get('/permissions-list',[PermissionController::class,'getPermissionsList']);
    });

});
