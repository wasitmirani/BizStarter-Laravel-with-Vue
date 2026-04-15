<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetTenant
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check()) {
        $tenant = auth()->user()->tenant;

        if ($tenant) {
            if ($tenant->timezone) {
                config(['app.timezone' => $tenant->timezone->name]);
                date_default_timezone_set($tenant->timezone->name);
            }

            if ($tenant->language) {
                app()->setLocale($tenant->language->code);
            }
        }
    }
        return $next($request);
    }
}
