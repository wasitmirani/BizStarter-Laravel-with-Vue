<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>{{ $title ?? config('app.name') }}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description"
        content="Paces is a modern, responsive admin dashboard available on ThemeForest. Ideal for building CRM, CMS, project management tools, and custom web applications with a clean UI, flexible layouts, and rich features.">
    <meta name="keywords"
        content="Paces, admin dashboard, ThemeForest, Bootstrap 5 admin, responsive admin, CRM dashboard, CMS admin, web app UI, admin theme, premium admin template">
    <meta name="author" content="Coderthemes">
    <meta name="theme-color" content="#0f172a">

    <!-- App favicon -->
    <link rel="shortcut icon" href="/favicon.ico">
    <link rel="manifest" href="/manifest.webmanifest">
    <link rel="apple-touch-icon" href="/icons/icon-192.png">
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



    <script type="module" src="/backend/assets/index-BqADLC_c.js"></script>
    <link rel="modulepreload" href="/backend/assets/app-COk2rsMN.js">
    <link rel="modulepreload" href="/backend/assets/custom-table-CE10VYSu.js">
    <link rel="modulepreload" href="/backend/assets/world-merc-olTKUgBy.js">
    <link rel="stylesheet" href="/backend/assets/app-mNboU33O.css">


    <script type="module" src="/backend/assets/index-BqADLC_c.js"></script>
    <link rel="modulepreload" href="/backend/assets/app-COk2rsMN.js">
    <link rel="modulepreload" href="/backend/assets/custom-table-CE10VYSu.js">
    <link rel="modulepreload" href="/backend/assets/world-merc-olTKUgBy.js">
    <link rel="stylesheet" href="/backend/assets/app-mNboU33O.css">


    <script type="module" src="/backend/assets/index-BqADLC_c.js"></script>
    <link rel="modulepreload" href="/backend/assets/app-COk2rsMN.js">
    <link rel="modulepreload" href="/backend/assets/custom-table-CE10VYSu.js">
    <link rel="modulepreload" href="/backend/assets/world-merc-olTKUgBy.js">
    <link rel="stylesheet" href="/backend/assets/app-mNboU33O.css">


    <script type="module" src="/backend/assets/index-BqADLC_c.js"></script>
    <link rel="modulepreload" href="/backend/assets/app-COk2rsMN.js">
    <link rel="modulepreload" href="/backend/assets/custom-table-CE10VYSu.js">
    <link rel="modulepreload" href="/backend/assets/world-merc-olTKUgBy.js">
    <link rel="stylesheet" href="/backend/assets/app-mNboU33O.css">
</head>

<body
@component('layouts.backend.components.switcher')
    @endcomponent
    <div class="wrapper">
    <div id="app">

        @yield('content')


    </div>
    </div>




    @if(app()->environment('local'))
    @vite(['resources/ts/backend/app.ts', 'resources/css/app.css'])
@else
    {!! loadBuiltAssets('resources/ts/backend/app.ts') !!}
@endif

</body>

</html>
