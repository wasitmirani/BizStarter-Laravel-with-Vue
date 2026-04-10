<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\backend\catalog\BrandController;
use App\Http\Controllers\backend\catalog\ProductController;
use App\Http\Controllers\backend\catalog\CategoryController;
use App\Http\Controllers\backend\catalog\ProductVariantController;
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

    Route::post('/password/update', [UserController::class, 'updatePassword']);
    Route::resource('user', UserController::class);
    Route::post('user/{uuid}/impersonate', [UserController::class, 'impersonate']);
    Route::post('impersonate/leave', [UserController::class, 'leaveImpersonate']);
    Route::resource('role',RoleController::class);
    Route::apiResource('category', CategoryController::class);
    Route::apiResource('brand', BrandController::class);
    Route::apiResource('product', ProductController::class);
    Route::apiResource('variant', ProductVariantController::class);
    Route::prefix('upload')->group(function() {
        Route::post('/{type}/image',[UploadController::class,'uploadSingleImage']);
    });

    Route::prefix('/list')->group( function(){
        Route::get('/options',[SettingController::class,'getListOptions']);
        Route::get('/languages',[SettingController::class,'getLanguages']);
        Route::get('/timezones',[SettingController::class,'getTimezones']);
        Route::get('/roles',[RoleController::class,'getRoles']);
        Route::get('/categories',[CategoryController::class,'index']);
        Route::get('/brands',[BrandController::class,'index']);
    });
});
