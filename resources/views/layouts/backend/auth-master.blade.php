
<!DOCTYPE html>
<html lang="en" dir="ltr" data-nav-layout="vertical" data-vertical-style="overlay" data-theme-mode="light" data-header-styles="light" data-menu-styles="light" data-toggled="close">

    <head>

        <!-- Meta Data -->
		<meta charset="UTF-8">
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="Description" content="{{ config('app.name') }}">
        <meta name="Author" content="{{ config('app.name') }}">
        <meta name="keywords" content="{{ config('app.name') }}">
        
        <!-- TITLE -->
		    <title> {{ config('app.name') }} | @yield('title') </title>
     
<!-- App favicon -->
<link rel="shortcut icon" href=""{{ asset('/backend/images/favicon.ico') }}" />

 <script>
        // Build config from HTML attributes
        function getSystemTheme() {
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        }

        // Build config from HTML attributes
        const htmlConfig = {
            dir: html.getAttribute("dir") || defaultConfig.dir,
            skin: html.getAttribute("data-skin") || defaultConfig.skin,
            theme: html.getAttribute("data-theme") === "system" ? getSystemTheme() : html.getAttribute("data-theme") || (defaultConfig["theme"] === "system" ? getSystemTheme() : defaultConfig["theme"]),
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
<link rel="stylesheet" href="{{ asset('/backend/assets/app-mNboU33O.css') }}" />
<script src="{{ asset('/backend/assets/demo.js') }}"></script>
	</head>

    <body>

        

        


       <!-- Start Page Content here -->
       <div class="flex min-h-screen items-center p-12.5">
        <div class="container">
            <div class="flex justify-center">
                <div class="xl:w-5/6">
                    <div class="absolute end-0 top-0">
                        <img src="{{ asset('/backend/images/auth-card-bg.svg') }}" alt="auth-card-bg" />
                    </div>

                    <div class="absolute start-0 bottom-0 rotate-180">
                        <img src="{{ asset('/backend/images/auth-card-bg.svg') }}" alt="auth-card-bg" />
                    </div>
                    <div class="card rounded-2xl">
                        @yield('content')
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- End Page content -->

    <div>
     
    </div>
</body>
</html>

