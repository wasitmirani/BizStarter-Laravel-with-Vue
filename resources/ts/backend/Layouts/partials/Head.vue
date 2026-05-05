<script setup lang="ts">
let auth_user = window.user;

function logOut(event:any) {
    event.preventDefault();
    window.location.href = window.location.origin + '/logout';

    }
</script>
<template >
<div>
      <!-- Start::main-header -->
 <header class="app-header">
            <div class="container-fluid flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                    <div class="logo-topbar">
                        <!-- Sidenav Menu Brand Logo -->
                        <a href="index.html" class="logo-box">
                            <!-- Light Brand Logo -->
                            <div class="logo-light">
                                <img :src="`/backend/images/logo.png`" class="logo-lg h-6" alt="Light logo">
                                <img :src="`/backend/images/logo-sm.png`" class="logo-sm h-6" alt="Small logo">
                            </div>

                            <!-- Dark Brand Logo -->
                            <div class="logo-dark">
                                <img :src="`/backend/images/logo-black.png`" class="logo-lg h-6" alt="Dark logo">
                                <img :src="`/backend/images/logo-sm.png`" class="logo-sm h-6" alt="Small logo">
                            </div>
                        </a>
                    </div>

                    <!-- Sidenav Menu Toggle Button -->
                    <button id="button-toggle-menu" class="btn rounded-full bg-primary btn-icon text-white">
                        <i class="iconify tabler--menu-4 text-xl"></i>
                    </button>

                    <!-- Topnav Menu Toggle Button for Horizontal -->
                    <div class="topnav-toggle-button">
                        <button type="button" class="hs-collapse-toggle btn topnav-toggle-button"
                            data-hs-collapse="#topnav-menu" id="topnav-menu-collapse" aria-expanded="false"
                            aria-controls="topnav-menu" aria-label="Toggle navigation">
                            <i class="iconify tabler--menu-4 text-xl"></i>
                        </button>
                    </div>

                    <!-- Topbar Search -->

                    <!-- Topbar Search -->
                    <div id="search-box-rounded" class="hidden xl:flex">
                        <div class="input-icon-group">
                            <i
                                class="iconify tabler--search input-icon text-lg text-(--topbar-item-color)/50! placeholder:opacity-50"></i>
                            <input type="search" id="topbar-search"
                                class="form-input w-57.5 rounded-full! border-(--topbar-search-border)! bg-(--topbar-search-bg)! text-(--topbar-item-color)! placeholder:opacity-50"
                                placeholder="Quick Search...">
                        </div>
                    </div>

                    <!-- Topbar Search -->

                    

                   
                </div>

                <div class="flex items-center gap-2.5">
                    <!-- Light/Dark Mode Button -->

                    <!-- Light/Dark Mode Dropdown -->
                    <div id="theme-dropdown" class="sm:inline-flex hidden">
                        <div
                            class="topbar-item hs-dropdown relative inline-flex [--auto-close:inside] [--placement:bottom-right]">
                            <button class="topbar-link hs-dropdown-toggle rounded-full" type="button"
                                aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                                <i class="iconify tabler--sun topbar-link-icon hidden" id="theme-icon-light"></i>
                                <i class="iconify tabler--moon topbar-link-icon hidden" id="theme-icon-dark"></i>
                                <i class="iconify tabler--sun-moon topbar-link-icon hidden" id="theme-icon-system"></i>
                            </button>

                            <div class="hs-dropdown-menu" role="menu" aria-orientation="vertical"
                                aria-labelledby="dropdown-menu">
                                <div class="theme-mode">
                                    <input class="peer invisible absolute size-0" type="radio" name="data-theme"
                                        id="topbar-dropdown-light" value="light" checked>
                                    <label class="dropdown-item peer-checked:bg-default-100"
                                        for="topbar-dropdown-light">
                                        <i class="iconify tabler--sun me-1 align-middle text-base"></i>
                                        Light
                                    </label>
                                </div>

                                <div class="theme-mode">
                                    <input class="peer invisible absolute size-0" type="radio" name="data-theme"
                                        id="topbar-dropdown-dark" value="dark">
                                    <label class="dropdown-item peer-checked:bg-default-100" for="topbar-dropdown-dark">
                                        <i class="iconify tabler--moon me-1 align-middle text-base"></i>
                                        Dark
                                    </label>
                                </div>

                                <div class="theme-mode">
                                    <input class="peer invisible absolute size-0" type="radio" name="data-theme"
                                        id="topbar-dropdown-system" value="system">
                                    <label class="dropdown-item peer-checked:bg-default-100"
                                        for="topbar-dropdown-system">
                                        <i class="iconify tabler--sun-moon me-1 align-middle text-base"></i>
                                        System
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div id="notification-dropdown-people"
                        class="topbar-item hs-dropdown relative inline-flex [--auto-close:inside] [--placement:bottom-right]">
                        <button class="topbar-link hs-dropdown-toggle relative flex items-center" type="button"
                            aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                            <i class="iconify tabler--bell topbar-link-icon"></i>
                            <span
                                class="badge bg-danger absolute -end-px -top-4 size-4 rounded-full leading-0 text-white">5</span>
                        </button>

                        <div class="hs-dropdown-menu min-w-80 p-0 space-y-0" role="menu" aria-orientation="vertical"
                            aria-labelledby="dropdown-menu">
                            <div class="border-default-300 border-b px-3 py-2">
                                <div class="flex items-center justify-between">
                                    <h6 class="text-base font-semibold">Notifications</h6>
                                    <a href="#!" class="badge badge-label py-1.5 bg-success/15 text-success">0
                                        Notification</a>
                                </div>
                            </div>

                            <div style="max-height: 300px" data-simplebar="">
                                <!-- item 1 -->
                                <!-- <div class="dropdown-item gap-6 px-4.5 py-3 text-wrap" id="message-1">
                                    <span class="shrink-0 relative">
                                        <img :src="`/backend/images/users/user-4.jpg`" class="size-9 rounded-full"
                                            alt="User Avatar">
                                        <span
                                            class="absolute -top-3 -end-2 border-2 border-card bg-success text-white flex size-5.5 items-center justify-center rounded-full">
                                            <i class="iconify tabler--bell text-2xs align-middle"></i>
                                            <span class="sr-only">unread notification</span>
                                        </span>
                                    </span>

                                    <span class="grow text-default-400">
                                        <span class="font-medium text-body-color">Emily Johnson</span>
                                        commented on a task in
                                        <span class="font-medium text-body-color">Design Sprint</span>
                                        <br>
                                        <span class="text-xs">12 minutes ago</span>
                                    </span>
                                </div> -->

                              
                            </div>
                            <!-- end dropdown-->

                            <!-- All-->
                            <a href="javascript:void(0);"
                                class="dropdown-item text-reset border-light justify-center border-t py-3 font-bold underline underline-offset-2">Read
                                All Messages</a>
                        </div>
                    </div>

                    <!-- FullScreen Toggle -->
                    <div id="fullscreen-toggler" class="md:inline-flex hidden">
                        <div class="topbar-item">
                            <button class="topbar-link btn group size-8 rounded-full" data-toggle="fullscreen"
                                aria-label="Full Screen">
                                <i
                                    class="iconify tabler--maximize topbar-link-icon group-[.fullscreen-active]:hidden"></i>
                                <i
                                    class="iconify tabler--minimize hidden topbar-link-icon group-[.fullscreen-active]:inline-block"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Monochrome Mode Button -->
                    <div class="xl:inline-flex hidden">
                        <div id="monochrome-toggler" class="topbar-item">
                            <button class="topbar-link btn btn-sm size-8 rounded-full" id="monochrome-mode"
                                type="button" aria-label="Monochrome Mode">
                                <i class="iconify tabler--palette topbar-link-icon"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Setting Offcanvas Button -->
                    <!-- <div class="sm:inline-flex hidden">
                        <div class="topbar-item btn-theme-setting">
                            <button class="topbar-link btn btn-icon size-8 rounded-full" type="button"
                                aria-haspopup="dialog" aria-expanded="false" aria-controls="theme-customization"
                                data-hs-overlay="#theme-customization">
                                <i class="iconify tabler--settings topbar-link-icon"></i>
                            </button>
                        </div>
                    </div> -->

                    <!-- Language Dropdown Button -->

                    <!-- <div id="language-selector-rounded"
                        class="topbar-item hs-dropdown relative inline-flex [--placement:bottom-right]">
                        <button class="topbar-link hs-dropdown-toggle font-bold relative flex items-center"
                            type="button" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                            <img :src="`/backend/images/flags/us.svg`" alt="" class="me-3 size-4.5 rounded-full"
                                id="selected-language-image">
                            <span id="selected-language-code">EN</span>
                        </button>

                        <div class="hs-dropdown-menu" role="menu" aria-orientation="vertical"
                            aria-labelledby="dropdown-menu">
                            <a href="javascript:void(0);" class="dropdown-item" data-translator-lang="en"
                                title="English">
                                <img :src="`/backend/images/flags/us.svg`" alt="English" class="me-1 size-4 rounded-full"
                                    height="18" data-translator-image="">
                                <span class="align-middle">English</span>
                            </a>
                            <a href="javascript:void(0);" class="dropdown-item" data-translator-lang="de"
                                title="German">
                                <img :src="`/backend/images/flags/de.svg`" alt="German" class="me-1 size-4 rounded-full" height="18"
                                    data-translator-image="">
                                <span class="align-middle">Deutsch</span>
                            </a>
                            <a href="javascript:void(0);" class="dropdown-item" data-translator-lang="it"
                                title="Italian">
                                <img :src="`/backend/images/flags/it.svg`" alt="Italian" class="me-1 size-4 rounded-full"
                                    height="18" data-translator-image="">
                                <span class="align-middle">Italiano</span>
                            </a>
                            <a href="javascript:void(0);" class="dropdown-item" data-translator-lang="es"
                                title="Spanish">
                                <img :src="`/backend/images/flags/es.svg`" alt="Spanish" class="me-1 size-4 rounded-full"
                                    height="18" data-translator-image="">
                                <span class="align-middle">Español</span>
                            </a>
                            <a href="javascript:void(0);" class="dropdown-item" data-translator-lang="ru"
                                title="Russian">
                                <img :src="`/backend/images/flags/ru.svg`" alt="Russian" class="me-1 size-4 rounded-full"
                                    height="18" data-translator-image="">
                                <span class="align-middle">Русский</span>
                            </a>
                            <a href="javascript:void(0);" class="dropdown-item" data-translator-lang="hi" title="Hindi">
                                <img :src="`/backend/images/flags/in.svg`" alt="Hindi" class="me-1 size-4 rounded-full"
                                    data-translator-image="">
                                <span class="align-middle">हिन्दी</span>
                            </a>
                            <a href="javascript:void(0);" class="dropdown-item" data-translator-lang="ar"
                                title="Arabic">
                                <img :src="`/backend/images/flags/sa.svg`" alt="Arabic" class="me-1 size-4 rounded-full"
                                    data-translator-image="">
                                <span class="align-middle">عربي</span>
                            </a>
                        </div>
                    </div> -->

                    <!-- Profile Dropdown Button -->
                    <div id="user-dropdown-detailed"
                        class="topbar-item hs-dropdown before:bg-default-700/35 relative inline-flex before:h-4.5 before:w-px before:content-['']">
                        <button class="hs-dropdown-toggle topbar-link ms-2.5 cursor-pointer items-center px-3! flex"
                            aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                            <img :src="`/backend/images/users/user-1.jpg`" alt="user-image" class="size-8 rounded-full lg:me-3">
                            <div class="hidden lg:flex items-center gap-1.5">
                                <span class="flex flex-col items-start">
                                    <h5 class="pro-username">David Dev</h5>
                                    <span class="text-xs/none mb-0.5">Admin Head</span>
                                </span>
                                <i class="iconify tabler--chevron-down align-middle"></i>
                            </div>
                        </button>

                        <div class="hs-dropdown-menu min-w-48" role="menu" aria-orientation="vertical"
                            aria-labelledby="hs-dropdown-with-icons">
                            <!-- Header -->
                            <div class="py-2 px-3.5">
                                <h6 class="text-xs">Welcome back 👋!</h6>
                            </div>

                            <!-- My Profile -->
                            <a href="#!" class="dropdown-item">
                                <i class="iconify tabler--user-circle text-base align-middle"></i>
                                <span class="align-middle">Profile</span>
                            </a>

                            <!-- Notifications -->
                            <!-- <a href="javascript:void(0);" class="dropdown-item">
                                <i class="iconify tabler--bell-ringing text-base align-middle"></i>
                                <span class="align-middle">Notifications</span>
                            </a> -->

                            <!-- Settings -->
                            <!-- <a href="javascript:void(0);" class="dropdown-item">
                                <i class="iconify tabler--settings-2 text-base align-middle"></i>
                                <span class="align-middle">Account Settings</span>
                            </a> -->

                            <!-- Support -->
                            <!-- <a href="javascript:void(0);" class="dropdown-item">
                                <i class="iconify tabler--headset text-base align-middle"></i>
                                <span class="align-middle">Support Center</span>
                            </a> -->

                            <!-- Divider -->
                            <div class="dropdown-divider"></div>

                            <!-- Lock -->
                            <!-- <a href="auth-lock-screen.html" class="dropdown-item">
                                <i class="iconify tabler--lock text-base align-middle"></i>
                                <span class="align-middle">Lock Screen</span>
                            </a> -->

                            <!-- Logout -->
                            <a href="javascript:void(0);" class="dropdown-item font-semibold">
                                <i class="iconify tabler--logout text-base align-middle"></i>
                                <span class="align-middle">Log Out</span>
                            </a>
                        </div>
                    </div>

                    <!-- Profile Dropdown Button -->
                </div>
            </div>
        </header>
        <!-- Topbar End -->



</div>
</template>

