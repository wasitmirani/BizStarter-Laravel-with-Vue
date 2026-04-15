<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\backend\role\RoleController;
use App\Http\Controllers\backend\user\UserController;
use App\Http\Controllers\backend\media\UploadController;
use App\Http\Controllers\backend\setting\SettingController;

Route::get('/me', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// Route::get('/me', static fn () => response()->json(['user_name'=>"wasitmirani"]));
// ->middleware('auth:api')
Route::prefix('/app')->group(function () {
    Route::middleware('auth:sanctum')->get('/permissions', function (Request $request) {
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

    // Uploads
    Route::prefix('upload')->group(function() {
        Route::post('/{type}/image',[UploadController::class,'uploadSingleImage']);
    });

    Route::prefix('/dropdown')->group( function(){
        Route::get('/options-list',[SettingController::class,'getListOptions']);
        Route::get('/languages-list',[SettingController::class,'getLanguages']);
        Route::get('/timezones-list',[SettingController::class,'getTimezones']);
        Route::get('/roles-list',[RoleController::class,'getRoles']);
        Route::get('/users-list',[UserController::class,'getUsers']);
    });

});
