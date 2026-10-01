<?php

namespace App\Providers;

use App\Enums\RolesEnum;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::before(function ($user, $ability) {
            if (method_exists($user, 'hasAnyRole') && $user->hasAnyRole([
                RolesEnum::SUPER_ADMIN->value,
                RolesEnum::ADMIN->value,
            ])) {
                return true;
            }

            return null;
        });
    }
}
