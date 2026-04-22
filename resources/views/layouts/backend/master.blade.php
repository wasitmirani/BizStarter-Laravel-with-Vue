<!doctype html>
<html lang="en" dir="ltr" data-skin="default" data-theme="light" data-topbar-color="light" data-menu-color="light" data-layout-position="fixed" data-layout-width="fluid" data-sidenav-size="default">


<head>
    <meta charset="utf-8">
    <title>{{ $title ?? config('app.name') }}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description"
    content="{{ config('app.name') }} is an advanced Order Management System (OMS) and Warehouse Management System (WMS) designed to streamline order processing, inventory control, shipment tracking, warehouse operations, and fulfillment workflows.">

<meta name="keywords"
    content="{{ config('app.name') }}, OMS, WMS, order management system, warehouse management system, inventory management, shipment tracking, logistics software, fulfillment system, courier integration, warehouse dashboard, supply chain management">

<meta name="author" content="Wasit Mirani">

<meta name="theme-color" content="#002855">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="LarabaseAdmin">

    <!-- App favicon -->
    <link rel="shortcut icon" href="/favicon.ico">
    <link rel="manifest" href="/manifest.webmanifest">
    <link rel="apple-touch-icon" href="/icons/icon-192.png">
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
    <script>
        ;
        (function() {
            const html = document.documentElement
            const storageKey = "__THEME_CONFIG__"
            const savedConfig = sessionStorage.getItem(storageKey)

            // Default config
            const defaultConfig = {
                dir: "ltr",
                skin: "default",
                theme: "light",
                width: "fluid",
                position: "fixed",
                orientation: "vertical",
                "sidenav-size": "on-hover-active",
                "sidenav-user": false,
                "topbar-color": "light",
                "sidenav-color": "dark",
            }

            // Build config from HTML attributes
            function getSystemTheme() {
                return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
            }

            // Build config from HTML attributes
            const htmlConfig = {
                dir: html.getAttribute("dir") || defaultConfig.dir,
                skin: html.getAttribute("data-skin") || defaultConfig.skin,
                theme: html.getAttribute("data-theme") === "system" ? getSystemTheme() : html.getAttribute(
                    "data-theme") || (defaultConfig["theme"] === "system" ? getSystemTheme() : defaultConfig[
                    "theme"]),
                "topbar-color": html.getAttribute("data-topbar-color") || defaultConfig["topbar-color"],
                "sidenav-color": html.getAttribute("data-menu-color") || defaultConfig["sidenav-color"],
                "sidenav-size": html.getAttribute("data-sidenav-size") || defaultConfig["sidenav-size"],
                "sidenav-user": html.hasAttribute("data-sidenav-user") || defaultConfig["sidenav-user"],
                position: html.getAttribute("data-layout-position") || defaultConfig["position"],
                width: html.getAttribute("data-layout-width") || defaultConfig["width"],
            }

            // Save merged config as defaults globally
            window.defaultConfig = structuredClone(htmlConfig)

            // Load from session if exists
            let config = savedConfig ? JSON.parse(savedConfig) : htmlConfig
            window.config = config

            // Apply layout attributes immediately
            html.setAttribute("dir", config.dir)
            html.setAttribute("data-skin", config.skin)
            html.setAttribute("data-theme", config.theme)
            html.setAttribute("data-topbar-color", config["topbar-color"])
            html.setAttribute("data-menu-color", config["sidenav-color"])
            html.setAttribute("data-layout-position", config["position"])
            html.setAttribute("data-layout-width", config["width"])

            if (config["sidenav-user"] === true) {
                html.setAttribute("data-sidenav-user", "true")
            } else {
                html.removeAttribute("data-sidenav-user")
            }

            if (config["sidenav-size"]) {
                let size = config["sidenav-size"]

                if (window.innerWidth <= 1140) {
                    size = "offcanvas"
                }

                html.setAttribute("data-sidenav-size", size)
            }
        })()
    </script>



    <script type="module" src="{{ asset('/backend/assets/index-BqADLC_c.js') }}"></script>
    <link rel="modulepreload" href="{{ asset('/backend/assets/app-COk2rsMN.js') }}  ">
    <link rel="modulepreload" href="{{ asset('/backend/assets/custom-table-CE10VYSu.js') }}">
    <link rel="modulepreload" href="{{ asset('/backend/assets/world-merc-olTKUgBy.js') }}">
    <link rel="stylesheet" href="{{ asset('/backend/assets/app-mNboU33O.css') }}">
    <script src="{{ asset('/backend/assets/demo.js') }}"></script>



    <style>
        :root,
:host {
    --font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;

    /* Core Colors */
    --color-black: #000;
    --color-white: #fff;

    /* Body */
    --color-body-bg: #f6f7fb;
    --color-body-color: #4c4c5c;
    --color-card: var(--color-white);

    /* Primary Theme */
    --color-primary: #002855;
    --color-primary-hover: #001f40;

    /* Secondary Colors */
    --color-secondary: #7b70ef;
    --color-secondary-hover: #695fcb;

    --color-success: #02bc9c;
    --color-success-hover: #02a085;

    --color-info: #5bc3e1;
    --color-info-hover: #4da6bf;

    --color-warning: #f9bf59;
    --color-warning-hover: #d4a24c;

    --color-danger: #f7577e;
    --color-danger-hover: #d24a6b;

    --color-purple: #7b70ef;
    --color-light: #eef2f7;
    --color-light-hover: #8a969c;
    --color-dark: #313a46;
    --color-dark-hover: #343a40;

    /* Charts */
    --color-chart-primary: #002855;
    --color-chart-secondary: #7b70ef;
    --color-chart-alpha: #02bc9c;
    --color-chart-beta: #f7577e;
    --color-chart-gamma: #f9bf59;
    --color-chart-delta: #5bc3e1;
    --color-chart-zeta: #db9052;
    --color-chart-gray: #edeff3;
    --color-chart-dark: #001f40;
    --color-chart-border-color: #ecf4fc;
    --color-chart-title-color: #bbcae1;

    /* Default Palette */
    --color-default-100: #f6f7fb;
    --color-default-200: #eef2f7;
    --color-default-300: #e7e9eb;
    --color-default-400: #9ba6b7;
    --color-default-500: #a1a9b1;
    --color-default-600: #8a969c;
    --color-default-700: #6c757d;
    --color-default-800: #343a40;
    --color-default-900: #313a46;

    /* Layout */
    --topbar-height: 65px;
    --sidenav-width: 245px;
    --sidenav-width-md: 200px;
    --sidenav-width-sm: 75px;

    /* Sidebar */
    --sidenav-item-font-size: .875rem;
    --sidenav-item-gap: 12px;
    --sidenav-item-padding-x: 10px;
    --sidenav-item-padding-y: 10px;
    --sidenav-item-font-weight: 500;

    /* Sidebar Behavior */
    --sidenav-item-hover-color: var(--color-primary);
    --sidenav-item-active-color: var(--color-primary);

    /* Fonts */
    --font-body: "Nunito", sans-serif;
    --font-secondary: "Google Sans", sans-serif;
    --text-body: .875rem;

    /* Radius / Shadow */
    --radius: 4px;
    --shadow: 0px 1px 4px 0px #828fa326;
}

/* Enterprise Sidebar Recommendation */
.side-nav .menu-item .menu-link:hover,
.side-nav .menu-item .menu-link.active {
    background: rgba(0, 40, 85, 0.08);
    color: #002855 !important;
    border-radius: 6px;
}

/* Active Utility */
.!bg-primary {
    background-color: #002855 !important;
}

.!text-primary {
    color: #002855 !important;
}

/* Buttons */
.btn-primary {
    background-color: #002855;
    border-color: #002855;
}

.btn-primary:hover {
    background-color: #001f40;
    border-color: #001f40;
}
        </style>
        <style>
            body {
                font-family: 'Instrument Sans', sans-serif !important;
                font-size: 14px;
                font-weight: 400;
                line-height: 1.5;
            }

            h1, h2, h3, h4, h5 {
                font-weight: 600;
            }
        </style>
</head>

<body
@component('layouts.backend.components.switcher')
    @endcomponent
    <div class="wrapper">
    <div id="app">

        @yield('content')



    </div>
    </div>

    @auth
        <script>
            window.user = @json(Auth::user()->load(['roles']));
            window.permissions = @json(Auth::user()->getAllPermissions()->pluck('name')->values());
        </script>
    @else
        <script>
            window.user = null;
            window.permissions = [];
        </script>
    @endauth

    @if(app()->environment('local'))
    @vite(['resources/ts/Backend/app.ts', 'resources/css/app.css'])
@else
    {!! loadBuiltAssets('resources/ts/Backend/app.ts') !!}
@endif

</body>

</html>
