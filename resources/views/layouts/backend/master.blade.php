<!DOCTYPE html>
<html lang="en" dir="ltr" data-nav-layout="vertical" data-theme-mode="light" data-header-styles="transparent" data-width="fullwidth" data-menu-styles="transparent" data-page-style="regular" data-toggled="close"  data-vertical-style="default" data-toggled="double-menu-open">


    <head>

        <!-- Meta Data -->

    <!-- Meta Data -->
    <meta charset="UTF-8">
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>  - {{ config('app.name') }} </title>
    <meta name="Description" content="{{ config('app.name') }}">
    <meta name="Author" content="Wasit Mirani  https://github.com/wasitmirani">
	<meta name="keywords" content="{{ config('app.name') }}">
    <!-- Google Fonts: Inter, Roboto, Nunito, and Poppins for modern admin look -->
    <!-- Google Fonts: Inter, Roboto, Nunito, Poppins, and Open Sans for modern admin look -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Nunito:wght@400;600;700&family=Poppins:wght@400;500;600;700&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
        <!-- Title -->


        <!-- Favicon -->
        <link rel="icon" href="{{asset('/backend//images/brand-logos/favicon.ico')}}" type="image/x-icon">

        <!-- Start::Styles -->

        <!-- Choices JS -->
        <script src="{{asset('/backend/assets/libs/choices.js/public/assets/scripts/choices.min.js')}}"></script>

        <!-- Main Theme Js -->
        <script src="{{asset('/backend/assets/js/main.js')}}"></script>

        <!-- Bootstrap Css -->
        <link id="style" href="{{asset('/backend/assets/libs/bootstrap/css/bootstrap.min.css')}}" rel="stylesheet">

        <!-- Style Css -->
        <link href="{{asset('/backend/assets/css/styles.css')}}" rel="stylesheet">

        <!-- Icons Css -->
        <link href="{{asset('/backend/assets/css/icons.css')}}" rel="stylesheet">

        <!-- Node Waves Css -->
        <link href="{{asset('/backend/assets/libs/node-waves/waves.min.css')}} " rel="stylesheet">

        <!-- Simplebar Css -->
        <link href="{{asset('/backend/assets/libs/simplebar/simplebar.min.css')}}" rel="stylesheet">

        <!-- Color Picker Css -->
        <link rel="stylesheet" href="{{asset('/backend/assets/libs/flatpickr/flatpickr.min.css')}}">
        <link rel="stylesheet" href="{{asset('/backend/assets/libs/%40simonwep/pickr/themes/nano.min.css')}}">

        <!-- Choices Css -->
        <link rel="stylesheet" href="{{asset('/backend/assets/libs/choices.js/public/assets/styles/choices.min.css')}}">

        <!-- FlatPickr CSS -->
        <link rel="stylesheet" href="{{asset('/backend/assets/libs/flatpickr/flatpickr.min.css')}}">

        <!-- Auto Complete CSS -->
        <link rel="stylesheet" href="{{asset('/backend/assets/libs/%40tarekraafat/autocomplete.js/css/autoComplete.css')}}">

        <!-- Date & Time Picker CSS -->
        <link rel="stylesheet" href="{{asset('/backend/assets/libs/flatpickr/flatpickr.min.css')}}">        <!-- End::Styles -->


        <link rel="stylesheet" href="{{asset('/backend/assets/libs/swiper/swiper-bundle.min.css')}}">


    </head>

<body>
 <!-- Start::main-switcher -->
    @component('layouts.backend.components.switcher')

    @endcomponent

        <!-- End::main-switcher -->

        <!-- Loader -->
        <div id="loader">
            <img src="{{asset('/backend/assets/images/media/loader.svg')}}" alt="">
        </div>
        <!-- Loader -->

        <!-- PAGE -->

    <div class="page">
        <div id="app">


            @yield('content')


        </div>
        </div>

        <!-- END PAGE-->

        <!-- SCRIPTS -->

        <!-- Scroll To Top -->
        <div class="scrollToTop">
            <span class="arrow lh-1"><i class="ti ti-caret-up fs-20"></i></span>
        </div>
        <div id="responsive-overlay"></div>
        <!-- Scroll To Top -->


        <!-- SIMPLEBAR JS -->



<script src="{{asset('/backend/assets/libs/@popperjs/core/umd/popper.min.js')}}"></script>

<!-- Bootstrap JS -->
<script src="{{asset('/backend/assets/libs/bootstrap/js/bootstrap.bundle.min.js')}}"></script>

 @vite(['resources/ts/backend/app.ts', 'resources/css/app.css'])
<script>
    function loadScript(src) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const s = document.createElement('script');
                s.src = src;
                s.onload = resolve;
                document.body.appendChild(s);
            }, 100);
        });
    }

    async function loadAllScripts() {
        await loadScript("{{asset('/backend/assets/js/defaultmenu.min.js')}}");
        await loadScript("{{asset('/backend/assets/libs/node-waves/waves.min.js')}}");
        await loadScript("{{asset('/backend/assets/js/sticky.js')}}");
        await loadScript("{{asset('/backend/assets/libs/simplebar/simplebar.min.js')}}");
        await loadScript("{{asset('/backend/assets/js/simplebar.js')}}");
        await loadScript("{{asset('/backend/assets/libs/%40tarekraafat/autocomplete.js/autoComplete.min.js')}}");
        await loadScript("{{asset('/backend/assets/libs/%40simonwep/pickr/pickr.es5.min.js')}}");
        await loadScript("{{asset('/backend/assets/libs/flatpickr/flatpickr.min.js')}}");
        await loadScript("{{asset('/backend/assets/libs/apexcharts/apexcharts.min.js')}}");
        await loadScript("{{asset('/backend/assets/js/ecommerce-dashboard.js')}}");
        await loadScript("{{asset('/backend/assets/js/custom.js')}}");
        await loadScript("{{asset('/backend/assets/js/custom-switcher.min.js')}}");
    }

    loadAllScripts();
</script>

    </body>

</html>
