<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-layout="modern" data-theme="material"
    data-bs-theme="light" data-sidebar-colors="dark" data-sidebar-image="none" data-sidebar="large"
    data-topbar-colors="light" data-nav-type="boxed" dir="ltr" data-colors="default">

@php
    $tenant = $tenant ?? tenant();
    $tenantName = $tenant?->name ?? config('app.name');
    $tenantColor = $tenant?->primary_color ?: '#4f46e5';
    $tenantLogo = $tenant?->logo;
    $tenantHost = request()->getHost();
    $rgb = sscanf(ltrim((string) $tenantColor, '#'), '%02x%02x%02x') ?: [79, 70, 229];
@endphp

<head>
    <meta charset="utf-8">
    <title>@yield('title', 'Sign In — ' . $tenantName)</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="description" content="{{ $tenantName }}">
    <meta name="author" content="{{ $tenantName }}">
    <meta name="theme-color" content="{{ $tenantColor }}">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="{{ $tenantName }}">

    <script>
        (function() {
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

            keys.forEach(function(key) {
                var stored = sessionStorage.getItem(key);
                if (stored) {
                    html.setAttribute(key, stored);
                }
            });
        })();
    </script>

    <link rel="shortcut icon" href="{{ global_asset('/assets/images/favicon.ico') }}">
    <link rel="manifest" href="/manifest.webmanifest">
    <link rel="apple-touch-icon" href="/icons/icon-192.png">
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />

    <link href="{{ global_asset('/assets/css/bootstrap.rtl.css') }}" rel="stylesheet" type="text/css" disabled>
    <link href="{{ global_asset('/assets/css/app.rtl.css') }}" rel="stylesheet" type="text/css" disabled>
    <link rel="stylesheet" crossorigin href="{{ global_asset('/assets/css/virtual-select.css') }}">
    <link rel="stylesheet" crossorigin href="{{ global_asset('/assets/css/admin.css') }}">

    <style>
        :root {
            --bs-primary: {{ $tenantColor }};
            --bs-primary-rgb: {{ implode(', ', $rgb) }};
        }
        .btn-primary {
            background-color: {{ $tenantColor }};
            border-color: {{ $tenantColor }};
        }
        .btn-primary:hover,
        .btn-primary:focus {
            filter: brightness(0.92);
            background-color: {{ $tenantColor }};
            border-color: {{ $tenantColor }};
        }
        .text-gradient {
            background-image: linear-gradient(90deg, {{ $tenantColor }}, {{ $tenantColor }});
            -webkit-background-clip: text;
            background-clip: text;
        }
        .form-check-input:checked {
            background-color: {{ $tenantColor }};
            border-color: {{ $tenantColor }};
        }
        .tenant-auth-panel {
            background: linear-gradient(160deg, {{ $tenantColor }} 0%, #0f172a 70%);
        }
        .tenant-auth-logo {
            max-height: 40px;
            width: auto;
        }
    </style>

    @if (app()->environment('local'))
        @vite(['resources/css/app.css'])
    @endif
</head>

<body class="sidebar-hidden">
    <div class="body-effect-img"></div>
    <div class="body-top-line"></div>
    <div class="body-bottom-line"></div>

    <div class="auth-wrapper auth-modern">
        <div class="row justify-content-between align-items-center h-100 p-xl-5 g-0">
            <div class="col-lg-7 h-100 position-relative">
                @yield('content')
            </div>

            <div class="col-lg-5 h-100 overflow-hidden position-relative d-none d-lg-block rounded-20px">
                <div class="tenant-auth-panel w-100 h-100 d-flex flex-column justify-content-end p-6 p-xl-10 text-white">
                    @if ($tenantLogo)
                        <img src="{{ $tenantLogo }}" alt="{{ $tenantName }}" class="tenant-auth-logo mb-auto align-self-start bg-white rounded-3 p-2">
                    @else
                        <img src="{{ global_asset('/assets/images/logo-white.webp') }}" alt="{{ $tenantName }}" class="tenant-auth-logo mb-auto align-self-start">
                    @endif

                    <div class="mt-auto">
                        <h3 class="text-white mb-3">{{ $tenantName }}</h3>
                        <p class="text-white text-opacity-75 mb-4 fs-16">
                            Sign in to manage your workspace on <strong>{{ $tenantHost }}</strong>.
                        </p>
                        <div class="d-flex flex-wrap gap-2">
                            <span class="badge bg-white bg-opacity-10 border border-white border-opacity-25 px-3 py-6px rounded">{{ $tenantName }}</span>
                            <span class="badge bg-white bg-opacity-10 border border-white border-opacity-25 px-3 py-6px rounded">{{ $tenantHost }}</span>
                            @if (!empty($tenant?->email))
                                <span class="badge bg-white bg-opacity-10 border border-white border-opacity-25 px-3 py-6px rounded">{{ $tenant->email }}</span>
                            @endif
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        (function () {
            var toggle = document.getElementById('passwordShowIcon');
            var input = document.getElementById('passwordInput');
            if (!toggle || !input) return;
            toggle.addEventListener('click', function () {
                var hidden = input.getAttribute('type') === 'password';
                input.setAttribute('type', hidden ? 'text' : 'password');
                toggle.querySelectorAll('i').forEach(function (icon) {
                    icon.classList.toggle('d-none');
                });
            });
        })();
    </script>
</body>
</html>
