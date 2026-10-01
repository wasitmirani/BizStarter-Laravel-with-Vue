<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-layout="modern" data-theme="material" data-bs-theme="light" data-sidebar-colors="dark" data-sidebar-image="none" data-sidebar="large" data-topbar-colors="light" data-nav-type="boxed" dir="ltr" data-colors="default" data-profile-sidebar>
<head>
    <meta charset="utf-8">
    <title>{{ $title ?? config('app.name') }}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="description" content="{{ config('app.name') }}">
    <meta name="author" content="{{ config('app.name') }}">
    <meta name="theme-color" content="#002855">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="{{ config('app.name') }}">

    <link rel="shortcut icon" href="{{ asset('favicon.ico') }}">
    <link rel="manifest" href="/manifest.webmanifest">
    <link rel="apple-touch-icon" href="/icons/icon-192.png">
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />

    {{-- ASSETS --}}
    <link rel="shortcut icon" href="/assets/images/favicon.ico">

    <!-- Bootstrap CSS (RTL, enabled when dir=rtl) -->
    <link href="{{ asset('/backend/assets/css/bootstrap.rtl.css') }}" rel="stylesheet" type="text/css" disabled>
    <!-- App CSS (RTL, enabled when dir=rtl) -->
    <link href="{{ asset('/backend/assets/css/app.rtl.css') }}" rel="stylesheet" type="text/css" disabled>

    <!-- Prefetch Alloce bundles (loaded after React mounts layout) -->
    <link rel="modulepreload" crossorigin href="{{ asset('/backend/assets/admin.bundle-DOCqQWIh.js') }}">
    <link rel="modulepreload" crossorigin href="{{ asset('/backend/assets/main-BSp6wgyE.js') }}">
    <link rel="modulepreload" crossorigin href="{{ asset('/backend/assets/apexcharts.esm-CF-OO0O0.js') }}">

    <link rel="stylesheet" crossorigin href="{{ asset('/backend/assets/css/virtual-select.css') }}">
    <link rel="stylesheet" crossorigin href="{{ asset('/backend/assets/css/admin.css') }}">
</head>
<body class="sidebar-hidden">
    <div class="body-effect-img"></div>
    <div class="body-top-line"></div>
    <div class="body-bottom-line"></div>
    <div id="app">
        @yield('content')
    </div>

    @php
        $authUser = null;
        $permissions = [];

        $appConfig = [
            'appName' => config('app.name'),
            'appEnv' => app()->environment(),
            'appUrl' => config('app.url'),
            'locale' => app()->getLocale(),
            'fallbackLocale' => config('app.fallback_locale'),
            'theme' => [
                'layout' => 'backend',
            ],
        ];

        if (Auth::check()) {
            $user = Auth::user()->loadMissing(['roles:id,name']);

            $authUser = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'thumbnail' => $user->thumbnail,
                'token' => $user->token,
                'roles' => $user->roles
                    ->map(
                        fn ($role) => [
                            'id' => $role->id,
                            'name' => $role->name,
                        ],
                    )
                    ->values(),
            ];

            $permissions = $user->getAllPermissions()->pluck('name')->values();
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
     <!-- Vendor scripts used across pages -->
  <script src="{{ asset('/backend/assets/virtual-select.min-DQ103J38.js') }}"></script>
  <script src="{{ asset('/backend/assets/libs/dayjs/dayjs.min.js') }}"></script>
  <script src="{{ asset('/backend/assets/libs/dayjs/plugin/quarterOfYear.js') }}"></script>
    @if (app()->environment('local'))
        @vite(['resources/ts/backend/app.ts', 'resources/css/app.css'])
    @else
        {!! loadBuiltAssets('resources/ts/backend/app.ts') !!}
    @endif
</body>
</html>
