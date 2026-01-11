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

                    <div id="megamenu-columns" class="md:inline-flex hidden">
                        <div class="topbar-item hs-dropdown relative inline-flex">
                            <button class="topbar-link hs-dropdown-toggle btn px-2.5! font-medium" type="button"
                                aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">Mega Menu <i
                                    class="iconify tabler--chevron-down"></i></button>

                            <div class="hs-dropdown-menu p-0 md:min-w-3xl" role="menu" aria-orientation="vertical"
                                aria-labelledby="dropdown-menu">
                                <div style="max-height: 380px" data-simplebar="">
                                    <div class="grid md:grid-cols-3">
                                        <div class="p-3">
                                            <h5 class="py-2 px-3.5 font-semibold mb-2 text-sm">Dashboard &amp; Analytics
                                            </h5>
                                            <ul class="list-unstyled megamenu-list">
                                                <li>
                                                    <a href="javascript:void(0);" class="dropdown-item">
                                                        <i
                                                            class="iconify tabler--chevron-right align-middle me-1 text-default-400"></i>
                                                        Sales Dashboard
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="javascript:void(0);" class="dropdown-item">
                                                        <i
                                                            class="iconify tabler--chevron-right align-middle me-1 text-default-400"></i>
                                                        Marketing Dashboard
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="javascript:void(0);" class="dropdown-item">
                                                        <i
                                                            class="iconify tabler--chevron-right align-middle me-1 text-default-400"></i>
                                                        Finance Overview
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="javascript:void(0);" class="dropdown-item">
                                                        <i
                                                            class="iconify tabler--chevron-right align-middle me-1 text-default-400"></i>
                                                        User Analytics
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="javascript:void(0);" class="dropdown-item">
                                                        <i
                                                            class="iconify tabler--chevron-right align-middle me-1 text-default-400"></i>
                                                        Traffic Insights
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>

                                        <div class="p-3">
                                            <h5 class="py-2 px-3.5 font-semibold mb-2 text-sm">Project Management</h5>
                                            <ul class="list-unstyled megamenu-list">
                                                <li>
                                                    <a href="javascript:void(0);" class="dropdown-item">
                                                        <i
                                                            class="iconify tabler--minus align-middle me-1 text-default-400"></i>
                                                        Kanban Workflow
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="javascript:void(0);" class="dropdown-item">
                                                        <i
                                                            class="iconify tabler--minus align-middle me-1 text-default-400"></i>
                                                        Project Timeline
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="javascript:void(0);" class="dropdown-item">
                                                        <i
                                                            class="iconify tabler--minus align-middle me-1 text-default-400"></i>
                                                        Task Management
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="javascript:void(0);" class="dropdown-item">
                                                        <i
                                                            class="iconify tabler--minus align-middle me-1 text-default-400"></i>
                                                        Team Members
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="javascript:void(0);" class="dropdown-item">
                                                        <i
                                                            class="iconify tabler--minus align-middle me-1 text-default-400"></i>
                                                        Assignments
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>

                                        <div class="p-3 bg-light/50">
                                            <h5 class="py-2 px-3.5 font-semibold mb-2 text-sm">User Management</h5>
                                            <ul class="list-unstyled megamenu-list">
                                                <li>
                                                    <a href="javascript:void(0);" class="dropdown-item">
                                                        <i
                                                            class="iconify tabler--chevron-right align-middle me-1 text-default-400"></i>
                                                        User Profiles
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="javascript:void(0);" class="dropdown-item">
                                                        <i
                                                            class="iconify tabler--chevron-right align-middle me-1 text-default-400"></i>
                                                        Access Control
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="javascript:void(0);" class="dropdown-item">
                                                        <i
                                                            class="iconify tabler--chevron-right align-middle me-1 text-default-400"></i>
                                                        Security Settings
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="javascript:void(0);" class="dropdown-item">
                                                        <i
                                                            class="iconify tabler--chevron-right align-middle me-1 text-default-400"></i>
                                                        User Groups
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="javascript:void(0);" class="dropdown-item">
                                                        <i
                                                            class="iconify tabler--chevron-right align-middle me-1 text-default-400"></i>
                                                        Authentication
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <!-- end row-->
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="megamenu-apps" class="md:inline-flex hidden">
                        <div class="topbar-item hs-dropdown relative inline-flex">
                            <button class="topbar-link hs-dropdown-toggle btn px-2.5! font-medium" type="button"
                                aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">Apps <i
                                    class="iconify tabler--chevron-down"></i></button>

                            <div class="hs-dropdown-menu p-0 md:min-w-3xl" role="menu" aria-orientation="vertical"
                                aria-labelledby="dropdown-menu">
                                <div style="max-height: 380px" data-simplebar="">
                                    <div class="grid md:grid-cols-3">
                                        <div class="p-3 space-y-3">
                                            <a href="#!" class="dropdown-item">
                                                <span class="flex items-center gap-3">
                                                    <span
                                                        class="size-9 flex items-center justify-center text-primary border border-light bg-light/50 rounded">
                                                        <i class="iconify tabler--basket size-5.5"></i>
                                                    </span>
                                                    <span>
                                                        <h5 class="text-sm">eCommerce</h5>
                                                        <span class="text-default-400 text-xs">UI/UX Team</span>
                                                    </span>
                                                </span>
                                            </a>

                                            <a href="#!" class="dropdown-item">
                                                <span class="flex items-center gap-3">
                                                    <span
                                                        class="size-9 flex items-center justify-center text-success border border-light bg-light/50 rounded">
                                                        <i class="iconify tabler--message size-5.5"></i>
                                                    </span>
                                                    <span>
                                                        <h5 class="text-sm">Chat</h5>
                                                        <span class="text-default-400 text-xs">Conversation with
                                                            Team</span>
                                                    </span>
                                                </span>
                                            </a>

                                            <a href="#!" class="dropdown-item">
                                                <span class="flex items-center gap-3">
                                                    <span
                                                        class="size-9 flex items-center justify-center text-danger border border-light bg-light/50 rounded">
                                                        <i class="iconify tabler--list-check size-5.5"></i>
                                                    </span>
                                                    <span>
                                                        <h5 class="text-sm">Task</h5>
                                                        <span class="text-default-400 text-xs">UI/UX Team</span>
                                                    </span>
                                                </span>
                                            </a>

                                            <a href="#!" class="dropdown-item">
                                                <span class="flex items-center gap-3">
                                                    <span
                                                        class="size-9 flex items-center justify-center text-info border border-light bg-light/50 rounded">
                                                        <i class="iconify tabler--mailbox size-5.5"></i>
                                                    </span>
                                                    <span>
                                                        <h5 class="text-sm">Email</h5>
                                                        <span class="text-default-400 text-xs">UI/UX Team</span>
                                                    </span>
                                                </span>
                                            </a>
                                        </div>

                                        <div class="p-3 space-y-3">
                                            <a href="#!" class="dropdown-item">
                                                <span class="flex items-center gap-3">
                                                    <span
                                                        class="size-9 flex items-center justify-center text-secondary border border-light bg-light/50 rounded">
                                                        <i class="iconify tabler--building size-5.5"></i>
                                                    </span>
                                                    <span>
                                                        <h5 class="text-sm">Companies</h5>
                                                        <span class="text-default-400 text-xs">UI/UX Team</span>
                                                    </span>
                                                </span>
                                            </a>

                                            <a href="#!" class="dropdown-item">
                                                <span class="flex items-center gap-3">
                                                    <span
                                                        class="size-9 flex items-center justify-center text-dark border border-light bg-light/50 rounded">
                                                        <i class="iconify tabler--id size-5.5"></i>
                                                    </span>
                                                    <span>
                                                        <h5 class="text-sm">Contacts Diary</h5>
                                                        <span class="text-default-400 text-xs">UI/UX Team</span>
                                                    </span>
                                                </span>
                                            </a>

                                            <a href="#!" class="dropdown-item">
                                                <span class="flex items-center gap-3">
                                                    <span
                                                        class="size-9 flex items-center justify-center text-warning border border-light bg-light/50 rounded">
                                                        <i class="iconify tabler--calendar size-5.5"></i>
                                                    </span>
                                                    <span>
                                                        <h5 class="text-sm">Calendar</h5>
                                                        <span class="text-default-400 text-xs">UI/UX Team</span>
                                                    </span>
                                                </span>
                                            </a>

                                            <a href="#!" class="dropdown-item">
                                                <span class="flex items-center gap-3">
                                                    <span
                                                        class="size-9 flex items-center justify-center text-success border border-light bg-light/50 rounded">
                                                        <i class="iconify tabler--lifebuoy size-5.5"></i>
                                                    </span>
                                                    <span>
                                                        <h5 class="text-sm">Support</h5>
                                                        <span class="text-default-400 text-xs">UI/UX Team</span>
                                                    </span>
                                                </span>
                                            </a>
                                        </div>

                                        <div class="row-span-2 bg-light/50">
                                            <div
                                                class="h-full relative rounded-e overflow-hidden bg-[url(//backend/images/stock/small-8.jpg)] bg-cover">
                                                <div
                                                    class="p-6 absolute inset-0 bg-gradient bg-secondary/90 flex items-center justify-center">
                                                    <div class="text-center text-white">
                                                        <i class="iconify tabler--atom text-4xl"></i>
                                                        <p class="text-white/75 mb-base uppercase">Special</p>
                                                        <h3 class="font-semibold text-white mb-3 text-xl">Get Early
                                                            Discount</h3>
                                                        <h4 class="font-medium text-base mb-1">
                                                            <del class="text-opacity-75 text-white">$49.00</del>
                                                            /
                                                            <span class="font-bold text-white">$15 USD</span>
                                                        </h4>
                                                        <button type="button"
                                                            class="mt-base btn btn-sm bg-danger text-white hover:bg-danger-hover">
                                                            <i class="iconify tabler--shopping-cart me-1.5"></i>
                                                            Buy Now
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- end .bg-light-->
                                        </div>

                                        <div class="col-span-2">
                                            <div
                                                class="grid grid-cols-2 border-t border-light border-dashed text-center">
                                                <div class="p-6">
                                                    <p class="font-medium text-default-400 mb-3 text-2xs uppercase">-:
                                                        &nbsp; Support &nbsp;:-</p>
                                                    <h5 class="text-md">help@mydomain.com</h5>
                                                </div>

                                                <div class="p-6">
                                                    <p class="font-medium text-default-400 mb-3 text-2xs uppercase">-:
                                                        &nbsp; Help: &nbsp;:-</p>
                                                    <h5 class="text-md">+(12) 3456 7890</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- end row-->
                                </div>
                            </div>
                        </div>
                    </div>
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

                    <div id="apps-dropdown-grid" class="xl:inline-flex hidden">
                        <div
                            class="topbar-item hs-dropdown relative inline-flex [--auto-close:inside] [--placement:bottom-right]">
                            <button class="topbar-link hs-dropdown-toggle relative flex items-center" type="button"
                                aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                                <i class="iconify tabler--apps topbar-link-icon"></i>
                            </button>

                            <div class="hs-dropdown-menu w-80 p-3" role="menu" aria-orientation="vertical"
                                aria-labelledby="dropdown-menu">
                                <div class="grid grid-cols-3 items-center gap-1.5">
                                    <a href="javascript:void(0);"
                                        class="dropdown-item flex-col gap-0 border border-dashed border-default-300 rounded text-center py-3">
                                        <span
                                            class="size-8 rounded-full bg-light flex items-center justify-center mx-auto mb-1.5">
                                            <img :src="`/backend/images/logos/google.svg`" alt="Google Logo" class="h-4.5">
                                        </span>
                                        <span class="align-middle font-medium">Google</span>
                                    </a>

                                    <a href="javascript:void(0);"
                                        class="dropdown-item flex-col gap-0 border border-dashed border-default-300 rounded text-center py-3">
                                        <span
                                            class="size-8 rounded-full bg-light flex items-center justify-center mx-auto mb-1.5">
                                            <img :src="`/backend/images/logos/figma.svg`" alt="Figma Logo" class="h-4.5">
                                        </span>
                                        <span class="align-middle font-medium">Figma</span>
                                    </a>

                                    <a href="javascript:void(0);"
                                        class="dropdown-item flex-col gap-0 border border-dashed border-default-300 rounded text-center py-3">
                                        <span
                                            class="size-8 rounded-full bg-light flex items-center justify-center mx-auto mb-1.5">
                                            <img :src="`/backend/images/logos/slack.svg`" alt="Slack Logo" class="h-4.5">
                                        </span>
                                        <span class="align-middle font-medium">Slack</span>
                                    </a>

                                    <a href="javascript:void(0);"
                                        class="dropdown-item flex-col gap-0 border border-dashed border-default-300 rounded text-center py-3">
                                        <span
                                            class="size-8 rounded-full bg-light flex items-center justify-center mx-auto mb-1.5">
                                            <img :src="`/backend/images/logos/dropbox.svg`" alt="Dropbox Logo" class="h-4.5">
                                        </span>
                                        <span class="align-middle font-medium">Dropbox</span>
                                    </a>

                                    <div class="text-center">
                                        <a href="javascript:void(0);"
                                            class="btn btn-sm btn-icon rounded-full bg-danger text-white hover:bg-danger-hover">
                                            <i class="iconify tabler--circle-dashed-plus text-lg"></i>
                                        </a>
                                    </div>

                                    <a href="javascript:void(0);"
                                        class="dropdown-item flex-col gap-0 border border-dashed border-default-300 rounded text-center py-3">
                                        <span
                                            class="size-8 rounded-full flex items-center justify-center bg-primary/15 text-primary mx-auto mb-1.5">
                                            <i class="iconify tabler--calendar text-lg"></i>
                                        </span>
                                        <span class="align-middle font-medium">Calendar</span>
                                    </a>

                                    <a href="javascript:void(0);"
                                        class="dropdown-item flex-col gap-0 border border-dashed border-default-300 rounded text-center py-3">
                                        <span
                                            class="size-8 rounded-full flex items-center justify-center bg-primary/15 text-primary mx-auto mb-1.5">
                                            <i class="iconify tabler--message-circle text-lg"></i>
                                        </span>
                                        <span class="align-middle font-medium">Chat</span>
                                    </a>

                                    <a href="javascript:void(0);"
                                        class="dropdown-item flex-col gap-0 border border-dashed border-default-300 rounded text-center py-3">
                                        <span
                                            class="size-8 rounded-full flex items-center justify-center bg-primary/15 text-primary mx-auto mb-1.5">
                                            <i class="iconify tabler--folder text-lg"></i>
                                        </span>
                                        <span class="align-middle font-medium">Files</span>
                                    </a>

                                    <a href="javascript:void(0);"
                                        class="dropdown-item flex-col gap-0 border border-dashed border-default-300 rounded text-center py-3">
                                        <span
                                            class="size-8 rounded-full flex items-center justify-center bg-primary/15 text-primary mx-auto mb-1.5">
                                            <i class="iconify tabler--users text-lg"></i>
                                        </span>
                                        <span class="align-middle font-medium">Team</span>
                                    </a>
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
                                    <a href="#!" class="badge badge-label py-1.5 bg-success/15 text-success">07
                                        Notification</a>
                                </div>
                            </div>

                            <div style="max-height: 300px" data-simplebar="">
                                <!-- item 1 -->
                                <div class="dropdown-item gap-6 px-4.5 py-3 text-wrap" id="message-1">
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
                                </div>

                                <!-- Notification 2 -->
                                <div class="dropdown-item gap-6 px-4.5 py-3 text-wrap" id="message-2">
                                    <span class="shrink-0 relative">
                                        <img :src="`/backend/images/users/user-5.jpg`" class="size-9 rounded-full"
                                            alt="User Avatar">
                                        <span
                                            class="absolute -top-3 -end-2 border-2 border-card bg-info text-white flex size-5.5 items-center justify-center rounded-full">
                                            <i class="iconify tabler--cloud-upload text-2xs align-middle"></i>
                                            <span class="sr-only">upload notification</span>
                                        </span>
                                    </span>
                                    <span class="grow text-default-400">
                                        <span class="font-medium text-body-color">Michael Lee</span>
                                        uploaded files to
                                        <span class="font-medium text-body-color">Marketing Assets</span>
                                        <br>
                                        <span class="text-xs">25 minutes ago</span>
                                    </span>
                                </div>

                                <!-- Notification 3 - Server CPU Alert -->
                                <div class="dropdown-item gap-6 px-4.5 py-3 text-wrap" id="message-6">
                                    <span class="shrink-0 relative">
                                        <span class="size-9 rounded-full bg-light flex items-center justify-center">
                                            <i class="iconify tabler--database text-lg"></i>
                                        </span>
                                        <span
                                            class="absolute -top-3 -end-2 border-2 border-card bg-danger text-white flex size-5.5 items-center justify-center rounded-full">
                                            <i class="iconify tabler--alert-circle text-2xs align-middle"></i>
                                            <span class="sr-only">server alert</span>
                                        </span>
                                    </span>
                                    <span class="grow text-default-400">
                                        <span class="font-medium text-body-color">Server #3</span>
                                        CPU usage exceeded 90%
                                        <br>
                                        <span class="text-xs">Just now</span>
                                    </span>
                                </div>

                                <!-- Notification 4 -->
                                <div class="dropdown-item gap-6 px-4.5 py-3 text-wrap" id="message-3">
                                    <span class="shrink-0 relative">
                                        <img :src="`/backend/images/users/user-6.jpg`" class="size-9 rounded-full"
                                            alt="User Avatar">
                                        <span
                                            class="absolute -top-3 -end-2 border-2 border-card bg-warning text-white flex size-5.5 items-center justify-center rounded-full">
                                            <i class="iconify tabler--alert-triangle text-2xs align-middle"></i>
                                            <span class="sr-only">alert</span>
                                        </span>
                                    </span>
                                    <span class="grow text-default-400">
                                        <span class="font-medium text-body-color">Sophia Ray</span>
                                        flagged an issue in
                                        <span class="font-medium text-body-color">Bug Tracker</span>
                                        <br>
                                        <span class="text-xs">40 minutes ago</span>
                                    </span>
                                </div>

                                <!-- Notification 5 -->
                                <div class="dropdown-item gap-6 px-4.5 py-3 text-wrap" id="message-4">
                                    <span class="shrink-0 relative">
                                        <img :src="`/backend/images/users/user-7.jpg`" class="size-9 rounded-full"
                                            alt="User Avatar">
                                        <span
                                            class="absolute -top-3 -end-2 border-2 border-card bg-primary text-white flex size-5.5 items-center justify-center rounded-full">
                                            <i class="iconify tabler--calendar-event text-2xs align-middle"></i>
                                            <span class="sr-only">event notification</span>
                                        </span>
                                    </span>
                                    <span class="grow text-default-400">
                                        <span class="font-medium text-body-color">David Kim</span>
                                        scheduled a meeting for
                                        <span class="font-medium text-body-color">UX Review</span>
                                        <br>
                                        <span class="text-xs">1 hour ago</span>
                                    </span>
                                </div>

                                <!-- Notification 6 -->
                                <div class="dropdown-item gap-6 px-4.5 py-3 text-wrap" id="message-5">
                                    <span class="shrink-0 relative">
                                        <img :src="`/backend/images/users/user-8.jpg`" class="size-9 rounded-full"
                                            alt="User Avatar">
                                        <span
                                            class="absolute -top-3 -end-2 border-2 border-card bg-secondary text-white flex size-5.5 items-center justify-center rounded-full">
                                            <i class="iconify tabler--edit text-2xs align-middle"></i>
                                            <span class="sr-only">edit</span>
                                        </span>
                                    </span>
                                    <span class="grow text-default-400">
                                        <span class="font-medium text-body-color">Isabella White</span>
                                        updated the document in
                                        <span class="font-medium text-body-color">Product Specs</span>
                                        <br>
                                        <span class="text-xs">2 hours ago</span>
                                    </span>
                                </div>

                                <!-- Notification 7 - Deployment Success -->
                                <div class="dropdown-item gap-6 px-4.5 py-3 text-wrap" id="message-7">
                                    <span class="shrink-0 relative">
                                        <span class="size-9 rounded-full bg-light flex items-center justify-center">
                                            <i class="iconify tabler--rocket text-lg"></i>
                                        </span>
                                        <span
                                            class="absolute -top-3 -end-2 border-2 border-card bg-success text-white flex size-5.5 items-center justify-center rounded-full">
                                            <i class="iconify tabler--check text-2xs align-middle"></i>
                                            <span class="sr-only">deployment</span>
                                        </span>
                                    </span>
                                    <span class="grow text-default-400">
                                        <span class="font-medium text-body-color">Production Server</span>
                                        deployment completed successfully
                                        <br>
                                        <span class="text-xs">30 minutes ago</span>
                                    </span>
                                </div>
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
                    <div class="sm:inline-flex hidden">
                        <div class="topbar-item btn-theme-setting">
                            <button class="topbar-link btn btn-icon size-8 rounded-full" type="button"
                                aria-haspopup="dialog" aria-expanded="false" aria-controls="theme-customization"
                                data-hs-overlay="#theme-customization">
                                <i class="iconify tabler--settings topbar-link-icon"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Language Dropdown Button -->

                    <div id="language-selector-rounded"
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
                    </div>

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
                            <a href="javascript:void(0);" class="dropdown-item">
                                <i class="iconify tabler--bell-ringing text-base align-middle"></i>
                                <span class="align-middle">Notifications</span>
                            </a>

                            <!-- Settings -->
                            <a href="javascript:void(0);" class="dropdown-item">
                                <i class="iconify tabler--settings-2 text-base align-middle"></i>
                                <span class="align-middle">Account Settings</span>
                            </a>

                            <!-- Support -->
                            <a href="javascript:void(0);" class="dropdown-item">
                                <i class="iconify tabler--headset text-base align-middle"></i>
                                <span class="align-middle">Support Center</span>
                            </a>

                            <!-- Divider -->
                            <div class="dropdown-divider"></div>

                            <!-- Lock -->
                            <a href="auth-lock-screen.html" class="dropdown-item">
                                <i class="iconify tabler--lock text-base align-middle"></i>
                                <span class="align-middle">Lock Screen</span>
                            </a>

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

