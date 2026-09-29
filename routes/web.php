<?php

use App\Http\Controllers\Backend\BackendController;
use Illuminate\Support\Facades\Route;

require __DIR__.'/auth.php';

Route::get('/', fn () => auth()->check()
    ? redirect('/app/dashboard')
    : redirect()->route('login')
)->name('root');

Route::get('/app', fn () => redirect('/app/dashboard'))
    ->middleware(['auth', 'verified']);

Route::get('/app/{module?}/{feature?}/{action?}/{id?}', [BackendController::class, 'index'])
    ->name('backend.dashboard')
    ->middleware(['auth', 'verified']);
