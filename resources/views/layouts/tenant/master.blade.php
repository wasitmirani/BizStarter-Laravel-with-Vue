<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-layout="modern" data-theme="material" data-bs-theme="light" data-sidebar-colors="dark" data-sidebar-image="none" data-sidebar="large" data-topbar-colors="light" data-nav-type="boxed" dir="ltr" data-colors="default">
<head>
    <meta charset="utf-8">
    <title>{{ $title ?? (tenant('name') ?? config('app.name')) }}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="description" content="{{ tenant('name') ?? config('app.name') }}">
    <meta name="author" content="{{ tenant('name') ?? config('app.name') }}">
    <meta name="theme-color" content="{{ tenant('primary_color') ?? '#002855' }}">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="{{ tenant('name') ?? config('app.name') }}">

    <script>
        (function () {
            var html = document.documentElement;
            var keys = [
                'data-layout',
                'data-theme',
                'data-nav-type',
                'data-bs-theme',
                'data-sidebar',
                'data-sidebar-colors',
                'data-topbar-colors',
                'data-colors',
                'data-sidebar-image',
            ];

            if (sessionStorage.getItem('data-profile-sidebar') === 'true') {
                html.setAttribute('data-profile-sidebar', 'true');
            } else {
                html.removeAttribute('data-profile-sidebar');
                sessionStorage.removeItem('data-profile-sidebar');
            }

            keys.forEach(function (key) {
                var stored = sessionStorage.getItem(key);
                if (stored) {
                    html.setAttribute(key, stored);
                }
            });

            // Tenant admin defaults to large sidebar (match central backend).
            if (!sessionStorage.getItem('data-sidebar')) {
                html.setAttribute('data-sidebar', 'large');
            }
        })();
    </script>

    <link rel="shortcut icon" href="{{ asset('favicon.ico') }}">
    <link rel="manifest" href="/manifest.webmanifest">
    <link rel="apple-touch-icon" href="/icons/icon-192.png">
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />

    <link rel="shortcut icon" href="{{ asset('/assets/images/favicon.ico') }}">
    <link href="{{ asset('/assets/css/bootstrap.rtl.css') }}" rel="stylesheet" type="text/css" disabled>
    <link href="{{ asset('/assets/css/app.rtl.css') }}" rel="stylesheet" type="text/css" disabled>

    <link rel="modulepreload" crossorigin href="{{ asset('/assets/admin.bundle-DOCqQWIh.js') }}">
    <link rel="modulepreload" crossorigin href="{{ asset('/assets/main-BSp6wgyE.js') }}">
    <link rel="modulepreload" crossorigin href="{{ asset('/assets/apexcharts.esm-CF-OO0O0.js') }}">

    <link rel="stylesheet" crossorigin href="{{ asset('/assets/css/virtual-select.css') }}">
    <link rel="stylesheet" crossorigin href="{{ asset('/assets/css/admin.css') }}">
</head>
<body class="sidebar-hidden">
    <div id="app">
        @yield('content')
    </div>

    @php
        $authUser = null;
        $permissions = [];
        $tenantModel = tenant();

        $appConfig = [
            'appName' => $tenantModel?->name ?? config('app.name'),
            'appEnv' => app()->environment(),
            'appUrl' => config('app.url'),
            'locale' => app()->getLocale(),
            'fallbackLocale' => config('app.fallback_locale'),
            'theme' => [
                'layout' => 'tenant',
            ],
            'tenant' => $tenantModel ? [
                'id' => $tenantModel->id,
                'name' => $tenantModel->name,
                'email' => $tenantModel->email,
                'primary_color' => $tenantModel->primary_color,
                'logo' => $tenantModel->logo,
                'domain' => request()->getHost(),
            ] : null,
        ];

        if (Auth::check()) {
            $user = Auth::user();

            try {
                $user->loadMissing(['roles:id,name']);
            } catch (\Throwable $e) {
                // Tenant may not have roles seeded yet.
            }

            $authUser = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'thumbnail' => $user->thumbnail ?? null,
                'token' => $user->token ?? null,
                'roles' => collect($user->roles ?? [])
                    ->map(fn ($role) => [
                        'id' => $role->id,
                        'name' => $role->name,
                    ])
                    ->values(),
            ];

            try {
                $permissions = $user->getAllPermissions()->pluck('name')->values();
            } catch (\Throwable $e) {
                $permissions = [];
            }
        }
    @endphp

    <script>
        (function() {
            const appContext = Object.freeze({
                auth: Object.freeze({
                    user: @json($authUser),
                    permissions: @json($permissions),
                    token: @json($authUser['token'] ?? null),
                }),
                config: Object.freeze(@json($appConfig)),
                layout: Object.freeze(window.config ?? {}),
                token: @json($authUser['token'] ?? null),
            });

            Object.defineProperty(window, "__APP_CONTEXT__", {
                value: appContext,
                writable: false,
                configurable: false,
            });

            Object.defineProperty(window, "user", {
                get() {
                    return window.__APP_CONTEXT__.auth?.user;
                },
                configurable: true,
            });

            Object.defineProperty(window, "permissions", {
                get() {
                    return window.__APP_CONTEXT__.auth.permissions;
                },
                configurable: true,
            });
        })();
    </script>

    <script src="{{ asset('/assets/virtual-select.min-DQ103J38.js') }}"></script>
    <script src="{{ asset('/assets/libs/dayjs/dayjs.min.js') }}"></script>
    <script src="{{ asset('/assets/libs/dayjs/plugin/quarterOfYear.js') }}"></script>

    @if (app()->environment('local'))
        @vite(['resources/ts/tenant/app.ts', 'resources/css/app.css'])
    @else
        {!! loadBuiltAssets('resources/ts/tenant/app.ts') !!}
    @endif
</body>
</html>
