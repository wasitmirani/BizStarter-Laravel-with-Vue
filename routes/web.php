<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Backend\BackendController;
use App\Http\Controllers\frontend\FrontendController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

});

require __DIR__.'/auth.php';
// Ensure POST /logout exists (named route 'logout') so form POSTs are handled
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

Route::get('/', fn() => auth()->check() ? redirect('/app/dashboard') : redirect('login'))->name('root');

Route::get('/manifest.json', function () {
    $manifest = [
        'id' => '/',
        'name' => config('app.name'),
        'short_name' => config('app.name'),
        'description' => config('app.name').' admin dashboard — order and warehouse management.',
        'lang' => 'en',
        'dir' => 'ltr',
        'start_url' => '/app',
        'display' => 'standalone',
        'display_override' => ['standalone', 'minimal-ui'],
        'background_color' => '#002855',
        'theme_color' => '#002855',
        'orientation' => 'portrait-primary',
        'scope' => '/',
        'categories' => ['business', 'productivity'],
        'icons' => [
            [
                'src' => '/icons/icon-192.png',
                'sizes' => '192x192',
                'type' => 'image/png',
                'purpose' => 'any',
            ],
            [
                'src' => '/icons/icon-512.png',
                'sizes' => '512x512',
                'type' => 'image/png',
                'purpose' => 'any',
            ],
        ],
    ];

    return response()->json($manifest)
        ->header('Content-Type', 'application/manifest+json');
});

Route::get('/logout', [AuthenticatedSessionController::class, 'getDestroy']);
Route::get('/testapp',function(){
    return view('welcome');
});
// Removed GET /logout in favor of POST route defined in routes/auth.php
Route::get('/app', fn() => redirect('/app/dashboard'))->middleware(['auth', 'verified']);

Route::get('/app/{module?}/{feature?}/{action?}/{id?}', [BackendController::class, 'index'])->name('backend.dashboard')->middleware(['auth', 'verified']);
// Route::get('/{path?}',[FrontendController::class, 'index'])->where('path', '^(?!app).*$');

// ->middleware(['auth', 'verified'])





