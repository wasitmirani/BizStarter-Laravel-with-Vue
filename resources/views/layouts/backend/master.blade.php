<!doctype html>
<html lang="en">


<head>
    <meta charset="utf-8">
    <title>{{ $title ?? config('app.name') }}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="{{ config('app.name') }}">

    <meta name="keywords" content="{{ config('app.name') }}">

    <meta name="author" content="Wasit Mirani">

    <meta name="theme-color" content="#002855">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="{{ config('app.name') }}">

    <!-- App favicon -->
    <link rel="shortcut icon" href="/favicon.ico">
    <link rel="manifest" href="/manifest.webmanifest">
    <link rel="apple-touch-icon" href="/icons/icon-192.png">
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />


</head>

<body>
    <div id="app">

        @yield('content')



    </div>
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
                'tenant_id' => $user->tenant_id,
                'token' => $user->token,
                'roles' => $user->roles
                    ->map(
                        fn($role) => [
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

            // Backward compatibility for legacy code paths.
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

    @if (app()->environment('local'))
        @vite(['resources/ts/Backend/app.ts', 'resources/css/app.css'])
    @else
        {!! loadBuiltAssets('resources/ts/Backend/app.ts') !!}
    @endif

</body>

</html>
