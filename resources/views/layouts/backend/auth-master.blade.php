<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-layout="modern" data-theme="material"
    data-bs-theme="light" data-sidebar-colors="dark" data-sidebar-image="none" data-sidebar="large"
    data-topbar-colors="light" data-nav-type="boxed" dir="ltr" data-colors="default">

<head>
    <meta charset="utf-8">
    <title>@yield('title', config('app.name'))</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="description" content="{{ config('app.name') }} — European master's admission intelligence.">
    <meta name="author" content="{{ config('app.name') }}">
    <meta name="theme-color" content="#002855">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="{{ config('app.name') }}">

    {{-- Apply layout prefs before CSS paint to avoid a theme flash. --}}
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

    <link rel="shortcut icon" href="{{ asset('favicon.ico') }}">
    <link rel="manifest" href="/manifest.webmanifest">
    <link rel="apple-touch-icon" href="/icons/icon-192.png">
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />

    {{-- ASSETS (Alloce expects /assets/...; public/assets → public/backend/assets) --}}
    <link rel="shortcut icon" href="{{ asset('/assets/images/favicon.ico') }}">

    <!-- Bootstrap CSS (RTL, enabled when dir=rtl) -->
    <link href="{{ asset('/assets/css/bootstrap.rtl.css') }}" rel="stylesheet" type="text/css" disabled>
    <!-- App CSS (RTL, enabled when dir=rtl) -->
    <link href="{{ asset('/assets/css/app.rtl.css') }}" rel="stylesheet" type="text/css" disabled>

    <!-- Prefetch Alloce bundles (loaded after Vue mounts layout). -->
    <link rel="modulepreload" crossorigin href="{{ asset('/assets/admin.bundle-DOCqQWIh.js') }}">
    <link rel="modulepreload" crossorigin href="{{ asset('/assets/main-BSp6wgyE.js') }}">
    <link rel="modulepreload" crossorigin href="{{ asset('/assets/apexcharts.esm-CF-OO0O0.js') }}">

    <link rel="stylesheet" crossorigin href="{{ asset('/assets/css/virtual-select.css') }}">
    <link rel="stylesheet" crossorigin href="{{ asset('/assets/css/admin.css') }}">

    <style>
        .auth-unipilot {
            min-height: 100vh;
            background:
                radial-gradient(900px 600px at 8% -10%, rgba(99, 102, 241, 0.12), transparent 60%),
                radial-gradient(700px 500px at 95% 100%, rgba(139, 92, 246, 0.09), transparent 55%),
                var(--dx-body-bg, #f5f7fb);
        }

        .auth-unipilot .auth-content-column {
            min-height: 100vh;
        }

        .auth-unipilot .auth-brand {
            display: inline-flex;
            align-items: center;
            gap: 10px;
        }

        .auth-unipilot .auth-brand-mark {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            flex-shrink: 0;
            border-radius: 11px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: #fff;
            box-shadow: 0 10px 22px -12px rgba(99, 102, 241, 0.95);
        }

        .auth-unipilot .auth-brand-text {
            display: flex;
            flex-direction: column;
            line-height: 1.05;
        }

        .auth-unipilot .auth-brand-name {
            color: var(--dx-body-color, #0f172a);
            font-size: 18px;
            font-weight: 800;
            letter-spacing: -0.02em;
        }

        .auth-unipilot .auth-brand-sub {
            margin-top: 3px;
            color: var(--dx-body-color, #0f172a);
            opacity: 0.45;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
        }

        .auth-unipilot .ui-icon {
            flex-shrink: 0;
            vertical-align: -0.125em;
        }

        .auth-unipilot .auth-shell {
            width: 100%;
            max-width: 430px;
        }

        .auth-unipilot .auth-shell .card {
            border: 1px solid var(--dx-border-color, #e8ecf2);
            border-radius: 18px;
            box-shadow: 0 24px 60px -40px rgba(15, 23, 42, 0.35);
        }

        .auth-unipilot .auth-product-panel {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 32px;
            height: 100%;
            min-height: calc(100vh - 32px);
            padding: 44px;
            border-radius: 26px;
            overflow: hidden;
            color: #f8fbff;
            background:
                radial-gradient(520px 420px at 85% 10%, rgba(56, 189, 248, 0.28), transparent 60%),
                radial-gradient(620px 520px at 10% 95%, rgba(99, 102, 241, 0.32), transparent 62%),
                linear-gradient(158deg, #071f44 0%, #0d326f 52%, #16499c 100%);
        }

        .auth-unipilot .auth-product-panel::before,
        .auth-unipilot .auth-product-panel::after {
            content: '';
            position: absolute;
            border-radius: 50%;
            border: 1px solid rgba(255, 255, 255, 0.12);
            pointer-events: none;
        }

        .auth-unipilot .auth-product-panel::before {
            width: 420px;
            height: 420px;
            top: -160px;
            right: -140px;
        }

        .auth-unipilot .auth-product-panel::after {
            width: 260px;
            height: 260px;
            bottom: -110px;
            left: -80px;
        }

        .auth-unipilot .auth-panel-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 7px 13px;
            border-radius: 999px;
            border: 1px solid rgba(255, 255, 255, 0.18);
            background: rgba(255, 255, 255, 0.08);
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.06em;
            text-transform: uppercase;
        }

        .auth-unipilot .auth-panel-title {
            margin: 22px 0 14px;
            font-size: clamp(26px, 2.4vw, 34px);
            line-height: 1.2;
            font-weight: 700;
            letter-spacing: -0.02em;
            color: #fff;
        }

        .auth-unipilot .auth-panel-lead {
            margin: 0;
            max-width: 420px;
            font-size: 15px;
            line-height: 1.65;
            color: rgba(235, 244, 255, 0.78);
        }

        .auth-unipilot .auth-panel-features {
            display: flex;
            flex-direction: column;
            gap: 18px;
        }

        .auth-unipilot .auth-panel-features li {
            display: flex;
            align-items: flex-start;
            gap: 13px;
        }

        .auth-unipilot .auth-panel-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 38px;
            flex-shrink: 0;
            border-radius: 11px;
            border: 1px solid rgba(255, 255, 255, 0.16);
            background: rgba(255, 255, 255, 0.10);
            font-size: 17px;
        }

        .auth-unipilot .auth-panel-features p {
            margin: 0;
        }

        .auth-unipilot .auth-panel-features .feature-title {
            font-size: 14px;
            font-weight: 600;
            color: #fff;
        }

        .auth-unipilot .auth-panel-features .feature-text {
            font-size: 13px;
            line-height: 1.55;
            color: rgba(235, 244, 255, 0.68);
        }

        .auth-unipilot .auth-panel-footer {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .auth-unipilot .auth-panel-footer .badge {
            border: 1px solid rgba(255, 255, 255, 0.18) !important;
            background: rgba(255, 255, 255, 0.08);
            color: rgba(248, 251, 255, 0.92);
            font-weight: 500;
            padding: 7px 12px;
            border-radius: 999px;
        }

        @media (max-width: 991.98px) {
            .auth-unipilot .auth-shell {
                max-width: 460px;
            }
        }
    </style>
</head>

<body class="sidebar-hidden">
    <div class="auth-wrapper auth-modern auth-unipilot">
        <div class="row g-0">
            <div class="col-12 col-lg-6 col-xl-7 d-flex flex-column auth-content-column">
                <header class="d-flex align-items-center justify-content-between gap-3 px-4 px-md-6 py-4">
                    <a href="{{ url('/') }}" class="auth-brand d-inline-flex align-items-center text-decoration-none" aria-label="{{ config('app.name') }}">
                        <span class="auth-brand-mark"><x-ui-icon name="graduation-cap" :size="19" /></span>
                        <span class="auth-brand-text">
                            <span class="auth-brand-name">UniPilot</span>
                            <span class="auth-brand-sub">Admissions</span>
                        </span>
                    </a>
                    <span class="badge border text-muted bg-transparent d-none d-sm-inline-flex align-items-center gap-1">
                        <x-ui-icon name="lock" :size="15" /> Private workspace
                    </span>
                </header>

                <main class="flex-grow-1 d-flex align-items-center justify-content-center px-4 px-md-6 py-5">
                    <div class="auth-shell">
                        @yield('content')
                    </div>
                </main>

                <footer class="d-flex flex-wrap align-items-center justify-content-between gap-2 px-4 px-md-6 pb-4 pt-2 text-muted fs-14">
                    <span>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</span>
                    <span class="d-inline-flex align-items-center gap-1">
                        <x-ui-icon name="shield-check" :size="15" /> Built for international applicants
                    </span>
                </footer>
            </div>

            <div class="col-lg-6 col-xl-5 d-none d-lg-block p-3 p-xxl-4">
                <aside class="auth-product-panel">
                    <div>
                        <span class="auth-panel-badge">
                            <x-ui-icon name="graduation-cap" :size="14" /> European master's admissions
                        </span>
                        <h1 class="auth-panel-title">From shortlist to submission, without the guesswork.</h1>
                        <p class="auth-panel-lead">
                            UniPilot keeps every program, deadline, document and eligibility check in one private
                            workspace built for international applicants.
                        </p>
                    </div>

                    <ul class="auth-panel-features list-unstyled mb-0">
                        <li>
                            <span class="auth-panel-icon"><x-ui-icon name="target" :size="17" /></span>
                            <div>
                                <p class="feature-title">Eligibility with clear evidence</p>
                                <p class="feature-text">Rules-based statuses only. Match scores are never presented as admission probability.</p>
                            </div>
                        </li>
                        <li>
                            <span class="auth-panel-icon"><x-ui-icon name="calendar-check" :size="17" /></span>
                            <div>
                                <p class="feature-title">Every deadline in one timeline</p>
                                <p class="feature-text">Applications, tasks and documents stay linked, so nothing slips between intakes.</p>
                            </div>
                        </li>
                        <li>
                            <span class="auth-panel-icon"><x-ui-icon name="link" :size="17" /></span>
                            <div>
                                <p class="feature-title">Official sources, clearly labelled</p>
                                <p class="feature-text">Catalog records link to the university page. Demo data is marked until verified.</p>
                            </div>
                        </li>
                    </ul>

                    <div class="auth-panel-footer">
                        <span class="badge">Rules-based matching</span>
                        <span class="badge">Private by default</span>
                        <span class="badge">Official source links</span>
                    </div>
                </aside>
            </div>
        </div>
    </div>

    <!-- Vendor scripts used across pages -->
    <script src="{{ asset('/assets/virtual-select.min-DQ103J38.js') }}"></script>
    <script src="{{ asset('/assets/libs/dayjs/dayjs.min.js') }}"></script>
    <script src="{{ asset('/assets/libs/dayjs/plugin/quarterOfYear.js') }}"></script>

    @if (app()->environment('local'))
        @vite(['resources/ts/backend/app.ts', 'resources/css/app.css'])
    @else
        {!! loadBuiltAssets('resources/ts/backend/app.ts') !!}
    @endif
</body>

</html>
