<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            // Scope central web routes to central domains so Laravel 13's
            // domain-route precedence keeps them ahead of tenant catch-alls.
            //
            // Laravel 13 keeps the FIRST registered name in the route name
            // lookup, so prefer the current request host (or APP_URL) first.
            // Otherwise route('login') always points at 127.0.0.1.
            $domains = config('tenancy.central_domains');
            $preferred = request()->getHost() ?: parse_url((string) config('app.url'), PHP_URL_HOST);

            if (is_string($preferred) && $preferred !== '' && in_array($preferred, $domains, true)) {
                $domains = array_values(array_unique([$preferred, ...$domains]));
            }

            foreach ($domains as $domain) {
                Route::middleware('web')
                    ->domain($domain)
                    ->group(base_path('routes/web.php'));
            }
        },
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
