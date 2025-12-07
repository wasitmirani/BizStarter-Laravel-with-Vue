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

            <header class="app-header sticky" id="header">

                <!-- Start::main-header-container -->
                <div class="main-header-container container-fluid px-0">

                    <!-- Start::header-content-left -->
                    <div class="header-content-left">

                        <!-- Start::header-element -->
                        <div class="header-element">
                            <div class="horizontal-logo">
                                <a href="index.php.html" class="header-logo">
                                    <img :src="`/backend/assets/images/brand-logos/desktop-logo.png`" alt="logo" class="desktop-logo">
                                    <img :src="`/backend/assets/images/brand-logos/toggle-logo.png`" alt="logo" class="toggle-logo">
                                    <img :src="`/backend/assets/images/brand-logos/desktop-dark.png`" alt="logo" class="desktop-dark">
                                    <img :src="`/backend/assets/images/brand-logos/toggle-dark.png`" alt="logo" class="toggle-dark">
                                </a>
                            </div>
                        </div>
                        <!-- End::header-element -->

                        <!-- Start::header-element -->
                        <div class="header-element mx-lg-0 mx-2">
                            <a aria-label="Hide Sidebar" class="sidemenu-toggle header-link animated-arrow hor-toggle horizontal-navtoggle" data-bs-toggle="sidebar" href="javascript:void(0);"><span></span></a>
                        </div>
                        <!-- End::header-element -->

                        <!-- Start::header-element -->
                        <div class="header-element header-search d-md-block d-none my-auto">
                            <!-- Start::header-link -->
                            <input type="text" class="header-search-bar form-control" id="header-search" placeholder="Search for Results..." spellcheck="false" autocomplete="off" autocapitalize="off">
                            <a href="javascript:void(0);" class="header-search-icon border-0">
                                <i class="bi bi-search"></i>
                            </a>
                            <!-- End::header-link -->
                        </div>
                        <!-- End::header-element -->

                    </div>
                    <!-- End::header-content-left -->

                    <!-- Start::header-content-right -->
                    <ul class="header-content-right">

                        <!-- Start::header-element -->
                        <li class="header-element d-md-none d-block">
                            <a href="javascript:void(0);" class="header-link" data-bs-toggle="modal" data-bs-target="#header-responsive-search">
                                <!-- Start::header-link-icon -->
                                <i class="bi bi-search header-link-icon"></i>
                                <!-- End::header-link-icon -->
                            </a>
                        </li>
                        <!-- End::header-element -->

                        <!-- Start::header-element -->
                        <li class="header-element country-selector dropdown">
                            <!-- Start::header-link|dropdown-toggle -->
                            <a href="javascript:void(0);" class="header-link dropdown-toggle" data-bs-auto-close="outside" data-bs-toggle="dropdown">
                                <svg xmlns="http://www.w3.org/2000/svg" class="header-link-icon" width="1em" height="1em" viewbox="0 0 24 24">
                                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor">
                                        <path d="M7 8.38h4.5m5.5 0h-2.5m-3 0h3m-3 0V7m3 1.38c-.527 1.886-1.632 3.669-2.893 5.236M8.393 17c1.019-.937 2.17-2.087 3.214-3.384m0 0c-.643-.754-1.543-1.973-1.8-2.525m1.8 2.525l1.929 2.005"></path>
                                        <path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12"></path>
                                    </g>
                                </svg>
                            </a>
                            <!-- End::header-link|dropdown-toggle -->
                            <ul class="main-header-dropdown dropdown-menu dropdown-menu-end" data-popper-placement="none">
                                <li>
                                    <a class="dropdown-item d-flex align-items-center" href="javascript:void(0);">
                                        <span class="avatar avatar-rounded avatar-xs lh-1 me-2">
                                            <img :src="`/backend/assets/images/flags/us_flag.jpg`" alt="img">
                                        </span>
                                        English
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item d-flex align-items-center" href="javascript:void(0);">
                                        <span class="avatar avatar-rounded avatar-xs lh-1 me-2">
                                            <img :src="`/backend/assets/images/flags/spain_flag.jpg`" alt="img">
                                        </span>
                                        español
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item d-flex align-items-center" href="javascript:void(0);">
                                        <span class="avatar avatar-rounded avatar-xs lh-1 me-2">
                                            <img :src="`/backend/assets/images/flags/french_flag.jpg`" alt="img">
                                        </span>
                                        français
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item d-flex align-items-center" href="javascript:void(0);">
                                        <span class="avatar avatar-rounded avatar-xs lh-1 me-2">
                                            <img :src="`/backend/assets/images/flags/uae_flag.jpg`" alt="img">
                                        </span>
                                        عربي
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item d-flex align-items-center" href="javascript:void(0);">
                                        <span class="avatar avatar-rounded avatar-xs lh-1 me-2">
                                            <img :src="`/backend/assets/images/flags/germany_flag.jpg`" alt="img">
                                        </span>
                                        Deutsch
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item d-flex align-items-center" href="javascript:void(0);">
                                        <span class="avatar avatar-rounded avatar-xs lh-1 me-2">
                                            <img :src="`/backend/assets/images/flags/china_flag.jpg`" alt="img">
                                        </span>
                                        中国人
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item d-flex align-items-center" href="javascript:void(0);">
                                        <span class="avatar avatar-rounded avatar-xs lh-1 me-2">
                                            <img :src="`/backend/assets/images/flags/italy_flag.jpg`" alt="img">
                                        </span>
                                        Italiano
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item d-flex align-items-center" href="javascript:void(0);">
                                        <span class="avatar avatar-rounded avatar-xs lh-1 me-2">
                                            <img :src="`/backend/assets/images/flags/russia_flag.jpg`" alt="img">
                                        </span>
                                        Русский
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <!-- End::header-element -->

                        <!-- Start::header-element -->
                        <li class="header-element header-theme-mode">
                            <!-- Start::header-link|layout-setting -->
                            <a href="javascript:void(0);" class="header-link layout-setting">
                                <span class="light-layout">
                                    <!-- Start::header-link-icon -->
                                    <svg xmlns="http://www.w3.org/2000/svg" class="header-link-icon" width="1em" height="1em" viewbox="0 0 24 24">
                                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21.5 14.078A8.557 8.557 0 0 1 9.922 2.5C5.668 3.497 2.5 7.315 2.5 11.873a9.627 9.627 0 0 0 9.627 9.627c4.558 0 8.376-3.168 9.373-7.422" color="currentColor"></path>
                                    </svg>
                                    <!-- End::header-link-icon -->
                                </span>
                                <span class="dark-layout">
                                    <!-- Start::header-link-icon -->
                                    <svg xmlns="http://www.w3.org/2000/svg" class="header-link-icon" width="1em" height="1em" viewbox="0 0 24 24">
                                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 12a5 5 0 1 1-10 0a5 5 0 0 1 10 0M12 2v1.5m0 17V22m7.07-2.929l-1.06-1.06M5.99 5.989L4.928 4.93M22 12h-1.5m-17 0H2m17.071-7.071l-1.06 1.06M5.99 18.011l-1.06 1.06" color="currentColor"></path>
                                    </svg>
                                    <!-- End::header-link-icon -->
                                </span>
                            </a>
                            <!-- End::header-link|layout-setting -->
                        </li>
                        <!-- End::header-element -->

                        <!-- Start::header-element -->
                        <li class="header-element cart-dropdown dropdown">
                            <!-- Start::header-link|dropdown-toggle -->
                            <a href="javascript:void(0);" class="header-link dropdown-toggle" data-bs-auto-close="outside" data-bs-toggle="dropdown">
                                <svg xmlns="http://www.w3.org/2000/svg" class="header-link-icon" width="1em" height="1em" viewbox="0 0 24 24">
                                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor">
                                        <path d="M8 16h7.263c4.488 0 5.17-2.82 5.998-6.93c.239-1.187.358-1.78.071-2.175s-.837-.395-1.938-.395H6"></path>
                                        <path d="M8 16L5.379 3.515A2 2 0 0 0 3.439 2H2.5m6.38 14h-.411C7.105 16 6 17.151 6 18.571a.42.42 0 0 0 .411.429H17.5"></path>
                                        <circle cx="10.5" cy="20.5" r="1.5"></circle>
                                        <circle cx="17.5" cy="20.5" r="1.5"></circle>
                                    </g>
                                </svg>
                                <span class="badge bg-primary rounded-pill header-icon-badge" id="cart-icon-badge">5</span>
                            </a>
                            <!-- End::header-link|dropdown-toggle -->
                            <!-- Start::main-header-dropdown -->
                            <div class="main-header-dropdown cart-dropdown dropdown-menu dropdown-menu-end" data-popper-placement="none">
                                <div class="p-3">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <p class="mb-0 fs-16">Cart Items<span class="badge bg-secondary-transparent ms-1 fs-12" id="cart-data">5</span></p>
                                        <a href="products.php.html" class="d-inline-flex align-items-center"><span class="text-primary text-decoration-underline">Continue
                                            Shopping </span><i class="ti ti-arrow-narrow-right ms-1 text-primary"></i></a>
                                    </div>
                                </div>
                                <div class="dropdown-divider"></div>
                                <ul class="list-unstyled mb-0" id="header-cart-items-scroll">
                                    <li class="dropdown-item">
                                        <div class="d-flex align-items-center cart-dropdown-item gap-3">
                                            <div class="lh-1">
                                                <span class="avatar avatar-md bg-gray-300">
                                                    <img :src="`/backend/assets/images/ecommerce/jpg/1.jpg`" alt="img">
                                                </span>
                                            </div>
                                            <div class="flex-fill">
                                                <div class="d-flex align-items-center justify-content-between mb-0">
                                                    <div class="mb-0 fs-14 fw-medium">
                                                        <a href="cart.php.html">SoundSync Headphones</a>
                                                        <div class="d-flex align-items-center gap-2">
                                                            <div class="input-group border-0 rounded flex-nowrap">
                                                                <span class="badge me-1 mt-1 rounded-circle bg-primary-transparent product-quantity-minus"><i class="ri-subtract-line"></i></span>
                                                                <input type="text" class="form-control form-control-sm bg-transparent border-0 p-0 text-center w-100" aria-label="quantity" id="product-quantity4" value="1">
                                                                <span class="badge ms-1 mt-1 rounded-circle bg-primary-transparent product-quantity-plus"><i class="ri-add-line"></i></span>
                                                            </div>
                                                            <span class="fs-12 text-default">Color : <span class="text-cart-headset fw-semibold">Ocean
                                                                    Blue</span></span>
                                                        </div>
                                                    </div>
                                                    <div class="text-end">
                                                        <a href="javascript:void(0);" class="header-cart-remove dropdown-item-close"><i class="ri-delete-bin-line"></i></a>
                                                        <h6 class="fw-medium mb-0 mt-1 text-nowrap">$75<span class="text-decoration-line-through text-muted fw-normal ms-1 fs-13 d-inline-block">$99</span>
                                                        </h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="dropdown-item">
                                        <div class="d-flex align-items-center cart-dropdown-item gap-3">
                                            <div class="lh-1">
                                                <span class="avatar avatar-md bg-gray-300">
                                                    <img :src="`/backend/assets/images/ecommerce/jpg/2.jpg`" alt="img">
                                                </span>
                                            </div>
                                            <div class="flex-fill">
                                                <div class="d-flex align-items-center justify-content-between mb-0">
                                                    <div class="mb-0 fs-14 fw-medium">
                                                        <a href="cart.php.html">Western Ladies Bag</a>
                                                        <div class="d-flex align-items-center gap-2">
                                                            <div class="input-group border-0 rounded flex-nowrap">
                                                                <span class="badge me-1 mt-1 rounded-circle bg-primary-transparent product-quantity-minus"><i class="ri-subtract-line"></i></span>
                                                                <input type="text" class="form-control form-control-sm bg-transparent border-0 p-0 text-center w-100" aria-label="quantity" id="product-quantity4" value="2">
                                                                <span class="badge ms-1 mt-1 rounded-circle bg-primary-transparent product-quantity-plus"><i class="ri-add-line"></i></span>
                                                            </div>
                                                            <span class="fs-12 text-default">Color : <span class="text-cart-handbag fw-semibold">Blush
                                                                Pink</span></span>
                                                        </div>
                                                    </div>
                                                    <div class="text-end">
                                                        <a href="javascript:void(0);" class="header-cart-remove dropdown-item-close"><i class="ri-delete-bin-line"></i></a>
                                                        <h6 class="fw-medium mb-0 mt-1 text-nowrap">$120<span class="text-decoration-line-through text-muted fw-normal ms-1 fs-13 d-inline-block">$149</span>
                                                        </h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="dropdown-item">
                                        <div class="d-flex align-items-center cart-dropdown-item gap-3">
                                            <div class="lh-1">
                                                <span class="avatar avatar-md bg-gray-300">
                                                    <img :src="`/backend/assets/images/ecommerce/jpg/9.jpg`" alt="img">
                                                </span>
                                            </div>
                                            <div class="flex-fill">
                                                <div class="d-flex align-items-center justify-content-between mb-0">
                                                    <div class="mb-0 fs-14 fw-medium">
                                                        <a href="cart.php.html">Elitr Alarm Clock</a>
                                                        <div class="d-flex align-items-center gap-2">
                                                            <div class="input-group border-0 rounded flex-nowrap">
                                                                <span class="badge me-1 mt-1 rounded-circle bg-primary-transparent product-quantity-minus"><i class="ri-subtract-line"></i></span>
                                                                <input type="text" class="form-control form-control-sm bg-transparent border-0 p-0 text-center w-100" aria-label="quantity" id="product-quantity4" value="1">
                                                                <span class="badge ms-1 mt-1 rounded-circle bg-primary-transparent product-quantity-plus"><i class="ri-add-line"></i></span>
                                                            </div>
                                                            <span class="fs-12 text-default">Color : <span class="text-cart-alaramclock fw-semibold">Sky
                                                                Blue</span></span>
                                                        </div>
                                                    </div>
                                                    <div class="text-end">
                                                        <a href="javascript:void(0);" class="header-cart-remove dropdown-item-close"><i class="ri-delete-bin-line"></i></a>
                                                        <h6 class="fw-medium mb-0 mt-1 text-nowrap">$30<span class="text-decoration-line-through text-muted fw-normal ms-1 fs-13 d-inline-block">$49</span>
                                                        </h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="dropdown-item">
                                        <div class="d-flex align-items-center cart-dropdown-item gap-3">
                                            <div class="lh-1">
                                                <span class="avatar avatar-md bg-gray-300">
                                                    <img :src="`/backend/assets/images/ecommerce/jpg/4.jpg`" alt="img">
                                                </span>
                                            </div>
                                            <div class="flex-fill">
                                                <div class="d-flex align-items-center justify-content-between mb-0">
                                                    <div class="mb-0 fs-14 fw-medium">
                                                        <a href="cart.php.html">Aus Polo Assn Laptop</a>
                                                        <div class="d-flex align-items-center gap-2">
                                                            <div class="input-group border-0 rounded flex-nowrap">
                                                                <span class="badge me-1 mt-1 rounded-circle bg-primary-transparent product-quantity-minus"><i class="ri-subtract-line"></i></span>
                                                                <input type="text" class="form-control form-control-sm bg-transparent border-0 p-0 text-center w-100" aria-label="quantity" id="product-quantity4" value="3">
                                                                <span class="badge ms-1 mt-1 rounded-circle bg-primary-transparent product-quantity-plus"><i class="ri-add-line"></i></span>
                                                            </div>
                                                            <span class="fs-12 text-default">Color : <span class="text-cart-sweatshirt fw-semibold">Soft
                                                                Peach</span></span>
                                                        </div>
                                                    </div>
                                                    <div class="text-end">
                                                        <a href="javascript:void(0);" class="header-cart-remove dropdown-item-close"><i class="ri-delete-bin-line"></i></a>
                                                        <h6 class="fw-medium mb-0 mt-1 text-nowrap">$70<span class="text-decoration-line-through text-muted fw-normal ms-1 fs-13 d-inline-block">$129</span>
                                                        </h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="dropdown-item">
                                        <div class="d-flex align-items-center cart-dropdown-item gap-3">
                                            <div class="lh-1">
                                                <span class="avatar avatar-md bg-gray-300">
                                                    <img :src="`/backend/assets/images/ecommerce/jpg/5.jpg`" alt="img">
                                                </span>
                                            </div>
                                            <div class="flex-fill">
                                                <div class="d-flex align-items-center justify-content-between mb-0">
                                                    <div class="mb-0 fs-14 fw-medium">
                                                        <a href="cart.php.html">Wooden Sofa Set</a>
                                                        <div class="d-flex align-items-center gap-2">
                                                            <div class="input-group border-0 rounded flex-nowrap">
                                                                <span class="badge me-1 mt-1 rounded-circle bg-primary-transparent product-quantity-minus"><i class="ri-subtract-line"></i></span>
                                                                <input type="text" class="form-control form-control-sm bg-transparent border-0 p-0 text-center w-100" aria-label="quantity" id="product-quantity4" value="2">
                                                                <span class="badge ms-1 mt-1 rounded-circle bg-primary-transparent product-quantity-plus"><i class="ri-add-line"></i></span>
                                                            </div>
                                                            <span class="fs-12 text-default">Color : <span class="text-cart-smartwatch fw-semibold">Crimson
                                                                Red</span></span>
                                                        </div>
                                                    </div>
                                                    <div class="text-end">
                                                        <a href="javascript:void(0);" class="header-cart-remove dropdown-item-close"><i class="ri-delete-bin-line"></i></a>
                                                        <h6 class="fw-medium mb-0 mt-1 text-nowrap">$200<span class="text-decoration-line-through text-muted fw-normal ms-1 fs-13 d-inline-block">$249</span>
                                                        </h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                                <div class="p-3 empty-header-item border-top">
                                    <div class="d-flex align-items-center justify-content-between mb-3">
                                        <div class="fw-medium fs-14">Order Total :</div>
                                        <h6 class="mb-0">$740</h6>
                                    </div>
                                    <div class="text-center d-grid">
                                        <a href="checkout.php.html" class="btn btn-primary btn-wave">Proceed to
                                            checkout</a>
                                    </div>
                                </div>
                                <div class="p-5 empty-item d-none">
                                    <div class="text-center">
                                        <span class="avatar avatar-xl avatar-rounded bg-primary-transparent">
                                            <i class="ri-shopping-cart-2-line fs-2"></i>
                                        </span>
                                        <h6 class="fw-medium mb-1 mt-3">Your Cart is Empty</h6>
                                        <span class="mb-3 fw-normal fs-13 d-block">Add some items to make it happy :)</span>
                                    </div>
                                </div>
                            </div>
                            <!-- End::main-header-dropdown -->
                        </li>
                        <!-- End::header-element -->

                        <!-- Start::header-element -->
                        <li class="header-element notifications-dropdown d-xl-block d-none dropdown">
                            <!-- Start::header-link|dropdown-toggle -->
                            <a href="javascript:void(0);" class="header-link dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="outside" id="messageDropdown" aria-expanded="false">
                                <svg xmlns="http://www.w3.org/2000/svg" class="header-link-icon" width="1em" height="1em" viewbox="0 0 24 24">
                                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor">
                                        <path d="M2.53 14.77c-.213 1.394.738 2.361 1.902 2.843c4.463 1.85 10.673 1.85 15.136 0c1.164-.482 2.115-1.45 1.902-2.843c-.13-.857-.777-1.57-1.256-2.267c-.627-.924-.689-1.931-.69-3.003C19.525 5.358 16.157 2 12 2S4.475 5.358 4.475 9.5c0 1.072-.062 2.08-.69 3.003c-.478.697-1.124 1.41-1.255 2.267"></path>
                                        <path d="M8 19c.458 1.725 2.076 3 4 3c1.925 0 3.541-1.275 4-3"></path>
                                    </g>
                                </svg>
                                <span class="header-icon-pulse bg-pink rounded pulse pulse-pink"></span>
                            </a>
                            <!-- End::header-link|dropdown-toggle -->
                            <!-- Start::main-header-dropdown -->
                            <div class="main-header-dropdown dropdown-menu dropdown-menu-end" data-popper-placement="none">
                                <div class="p-3">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <p class="mb-0 fs-16">Notifications  <span class="badge bg-secondary-transparent ms-1" id="notifiation-data">20</span></p>
                                        <a href="javascript:void(0);" class="text-primary text-decoration-underline">Mark As Read<i class="ri-arrow-right-line ms-1"></i></a>
                                    </div>
                                </div>
                                <div class="dropdown-divider"></div>
                                <ul class="nav nav-tabs nav-tabs-header m-3 p-2 rounded bg-light" role="tablist">
                                    <li class="nav-item border-0" role="presentation">
                                        <a class="nav-link active" data-bs-toggle="tab" role="tab" aria-current="page" href="#tabpane1" aria-selected="true">View All</a>
                                    </li>
                                    <li class="nav-item border-0" role="presentation">
                                        <a class="nav-link" data-bs-toggle="tab" role="tab" aria-current="page" href="#tabpane2" aria-selected="false" tabindex="-1">Mentions</a>
                                    </li>
                                    <li class="nav-item border-0" role="presentation">
                                        <a class="nav-link" data-bs-toggle="tab" role="tab" aria-current="page" href="#tabpane3" aria-selected="false" tabindex="-1">Followers</a>
                                    </li>
                                    <li class="nav-item border-0" role="presentation">
                                        <a class="nav-link" data-bs-toggle="tab" role="tab" aria-current="page" href="#tabpane4" aria-selected="false" tabindex="-1">Invites</a>
                                    </li>
                                </ul>
                                <div class="tab-content border-top">
                                    <div class="tab-pane show active text-muted p-0 border-0" id="tabpane1" role="tabpanel">
                                        <ul class="list-unstyled mb-0" id="header-notification-scroll">
                                            <li class="dropdown-item">
                                                <div class="d-flex align-items-start">
                                                    <div class="pe-2 lh-1">
                                                        <span class="avatar avatar-md bg-light text-default">
                                                            <img :src="`/backend/assets/images/faces/1.jpg`" alt="img">
                                                        </span>
                                                    </div>
                                                    <div class="flex-grow-1 d-flex align-items-start justify-content-between">
                                                        <div>
                                                            <p class="mb-1"><a href="javascript:void(0);"><span class="fw-semibold me-1">@Williams Jhon</span>Following
                                                                    You</a></p>
                                                            <div class="text-muted fs-13">
                                                                <span><i class="ri-time-line me-1"></i>Wedenesday 3:42 PM</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p class="mb-0 fs-12 text-muted d-inline-flex align-items-center"><i class="ri-checkbox-blank-circle-fill me-1 fs-8 text-danger"></i>4
                                                                Sec</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li class="dropdown-item">
                                                <div class="d-flex align-items-start">
                                                    <div class="pe-2 lh-1">
                                                        <span class="avatar avatar-md bg-light text-default">
                                                            <img :src="`/backend/assets/images/faces/2.jpg`" alt="img">
                                                        </span>
                                                    </div>
                                                    <div class="flex-grow-1 d-flex align-items-start justify-content-between">
                                                        <div>
                                                            <p class="mb-1"><a href="javascript:void(0);"><span class="fw-semibold me-1">@JasonSam</span>Commented On your
                                                                    post.</a></p>
                                                            <div class="text-muted fs-13">
                                                                <span><i class="ri-time-line me-1"></i>Wedenesday 3:42 PM</span>
                                                            </div>
                                                            <div class="p-2 mt-2 rounded bg-light border text-default">
                                                                Amazing! Fast, to the point,really amazing to work with them!!!
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p class="mb-0 fs-12 text-muted text-nowrap d-inline-flex align-items-center">
                                                                <i class="ri-checkbox-blank-circle-fill me-1 fs-8 text-primary"></i>12
                                                                Sec</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li class="dropdown-item">
                                                <div class="d-flex align-items-start">
                                                    <div class="pe-2 lh-1">
                                                        <span class="avatar avatar-md bg-secondary-transparent">
                                                            <i class="ri-shopping-bag-3-line fs-18"></i>
                                                        </span>
                                                    </div>
                                                    <div class="flex-grow-1 d-flex align-items-start justify-content-between">
                                                        <div>
                                                            <p class="mb-1"><a href="javascript:void(0);">Successfully purchages a
                                                                    business plan for <span class="text-danger fw-medium">$19,269</span></a></p>
                                                            <div class="text-muted fs-13">
                                                                <span><i class="ri-time-line me-1"></i>Monday 11.30 AM</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p class="mb-0 fs-12 text-muted d-inline-flex text-nowrap ms-4 align-items-center">
                                                                <i class="ri-checkbox-blank-circle-fill me-1 fs-8 text-danger"></i>15
                                                                Min</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li class="dropdown-item">
                                                <div class="d-flex align-items-start">
                                                    <div class="pe-2 lh-1">
                                                        <span class="avatar avatar-md bg-light text-default">
                                                            <img :src="`/backend/assets/images/faces/4.jpg`" alt="img">
                                                        </span>
                                                    </div>
                                                    <div class="flex-grow-1 d-flex align-items-start justify-content-between">
                                                        <div>
                                                            <p class="mb-1"><a href="javascript:void(0);"><span class="fw-semibold me-1">@Khabib Hussain</span>Liked Your
                                                                    Post.</a></p>
                                                            <div class="text-muted fs-13">
                                                                <span><i class="ri-time-line me-1"></i>Saterday 9.30 PM</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p class="mb-0 fs-12 text-muted d-inline-flex align-items-center"><i class="ri-checkbox-blank-circle-fill me-1 fs-8 text-primary"></i>2
                                                                Days</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="tab-pane text-muted p-0 border-0" id="tabpane2" role="tabpanel">
                                        <ul class="list-unstyled mb-0" id="header-notification-scroll1">
                                            <li class="dropdown-item">
                                                <div class="d-flex align-items-start">
                                                    <div class="pe-2 lh-1">
                                                        <span class="avatar avatar-md bg-light text-default">
                                                            <img :src="`/backend/assets/images/faces/6.jpg`" alt="img">
                                                        </span>
                                                    </div>
                                                    <div class="flex-grow-1 d-flex align-items-start justify-content-between">
                                                        <div>
                                                            <p class="mb-1"><a href="javascript:void(0);"><span class="fw-semibold me-1">@Meisha Kerr</span>Liked Your
                                                                    Post</a></p>
                                                            <div class="text-muted fs-13">
                                                                <span><i class="ri-time-line me-1"></i>Friday 11.19 PM</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p class="mb-0 fs-12 text-muted d-inline-flex align-items-center"><i class="ri-checkbox-blank-circle-fill me-1 fs-8 text-danger"></i>5 Sec</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li class="dropdown-item">
                                                <div class="d-flex align-items-start">
                                                    <div class="pe-2 lh-1">
                                                        <span class="avatar avatar-md bg-light text-default">
                                                            <img :src="`/backend/assets/images/faces/7.jpg`" alt="img">
                                                        </span>
                                                    </div>
                                                    <div class="flex-grow-1 d-flex align-items-start justify-content-between">
                                                        <div>
                                                            <p class="mb-1"><a href="javascript:void(0);"><span class="fw-semibold me-1">@
                                                                        Jessica</span>Commented On your post.</a></p>
                                                            <div class="text-muted fs-13">
                                                                <span><i class="ri-time-line me-1"></i>Thursday 4.55 PM</span>
                                                            </div>
                                                            <div class="p-2 mt-2 rounded bg-light border text-default">
                                                                It sounds like you had a great experience!What specifically?
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p class="mb-0 fs-12 text-muted text-nowrap d-inline-flex align-items-center">
                                                                <i class="ri-checkbox-blank-circle-fill me-1 fs-8 text-primary"></i>12
                                                                Sec</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li class="dropdown-item">
                                                <div class="d-flex align-items-start">
                                                    <div class="pe-2 lh-1">
                                                        <span class="avatar avatar-md bg-light text-default">
                                                            <img :src="`/backend/assets/images/faces/8.jpg`" alt="img">
                                                        </span>
                                                    </div>
                                                    <div class="flex-grow-1 d-flex align-items-start justify-content-between">
                                                        <div>
                                                            <p class="mb-1"><a href="javascript:void(0);"><span class="fw-semibold me-1">@Khabib Hussain</span>Added You on
                                                                    Story..</a></p>
                                                            <div class="text-muted fs-13">
                                                                <span><i class="ri-time-line me-1"></i>Monday 8.30 AM</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p class="mb-0 fs-12 text-muted d-inline-flex align-items-center"><i class="ri-checkbox-blank-circle-fill me-1 fs-8 text-danger"></i>2 Hours</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li class="dropdown-item">
                                                <div class="d-flex align-items-start">
                                                    <div class="pe-2 lh-1">
                                                        <span class="avatar avatar-md bg-light text-default">
                                                            <img :src="`/backend/assets/images/faces/8.jpg`" alt="img">
                                                        </span>
                                                    </div>
                                                    <div class="flex-grow-1 d-flex align-items-start justify-content-between">
                                                        <div>
                                                            <p class="mb-1"><a href="javascript:void(0);"><span class="fw-semibold me-1">@Simon Cowall</span>Reply Your Story.</a></p>
                                                            <div class="text-muted fs-13">
                                                                <span><i class="ri-time-line me-1"></i>Tuesday 12.17 PM</span>
                                                            </div>
                                                            <div class="p-2 mt-2 rounded bg-light border text-default">
                                                            Shall We Meet On Meeting Today?
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p class="mb-0 fs-12 text-muted d-inline-flex align-items-center"><i class="ri-checkbox-blank-circle-fill me-1 fs-8 text-danger"></i>1 Day</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="tab-pane text-muted p-0 border-0" id="tabpane3" role="tabpanel">
                                        <ul class="list-unstyled mb-0" id="header-notification-scroll2">
                                            <li class="dropdown-item">
                                                <div class="d-flex align-items-start">
                                                    <div class="pe-2 lh-1">
                                                        <span class="avatar avatar-md bg-light text-default">
                                                            <img :src="`/backend/assets/images/faces/2.jpg`" alt="img">
                                                        </span>
                                                    </div>
                                                    <div class="flex-grow-1 d-flex align-items-start justify-content-between">
                                                        <div>
                                                            <p class="mb-1"><a href="javascript:void(0);"><span class="fw-semibold me-1">@Kakashi Si</span>Started Following You</a></p>
                                                            <div class="text-muted fs-13">
                                                                <span><i class="ri-time-line me-1"></i>Friday 11.19 PM</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p class="mb-0 fs-12 text-muted d-inline-flex align-items-center"><i class="ri-checkbox-blank-circle-fill me-1 fs-8 text-primary"></i>2 Sec</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li class="dropdown-item">
                                                <div class="d-flex align-items-start">
                                                    <div class="pe-2 lh-1">
                                                        <span class="avatar avatar-md bg-light text-default">
                                                            <img :src="`/backend/assets/images/faces/3.jpg`" alt="img">
                                                        </span>
                                                    </div>
                                                    <div class="flex-grow-1 d-flex align-items-start justify-content-between">
                                                        <div>
                                                            <p class="mb-1"><a href="javascript:void(0);"><span class="fw-semibold me-1">@
                                                                        RoboRhythms</span>Accepeted Your Request.</a></p>
                                                            <div class="text-muted fs-13">
                                                                <span><i class="ri-time-line me-1"></i>Thursday 4.55 PM</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p class="mb-0 fs-12 text-muted text-nowrap d-inline-flex align-items-center">
                                                                <i class="ri-checkbox-blank-circle-fill me-1 fs-8 text-danger"></i>11 Sec</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li class="dropdown-item">
                                                <div class="d-flex align-items-start">
                                                    <div class="pe-2 lh-1">
                                                        <span class="avatar avatar-md bg-light text-default">
                                                            <img :src="`/backend/assets/images/faces/4.jpg`" alt="img">
                                                        </span>
                                                    </div>
                                                    <div class="flex-grow-1 d-flex align-items-start justify-content-between">
                                                        <div>
                                                            <p class="mb-1"><a href="javascript:void(0);"><span class="fw-semibold me-1">@Sarah Brown</span>Started Following You</a></p>
                                                            <div class="text-muted fs-13">
                                                                <span><i class="ri-time-line me-1"></i>Monday 8.30 AM</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p class="mb-0 fs-12 text-muted d-inline-flex align-items-center"><i class="ri-checkbox-blank-circle-fill me-1 fs-8 text-primary"></i>12 Min</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li class="dropdown-item">
                                                <div class="d-flex align-items-start">
                                                    <div class="pe-2 lh-1">
                                                        <span class="avatar avatar-md bg-light text-default">
                                                            <img :src="`/backend/assets/images/faces/8.jpg`" alt="img">
                                                        </span>
                                                    </div>
                                                    <div class="flex-grow-1 d-flex align-items-start justify-content-between">
                                                        <div>
                                                            <p class="mb-1"><a href="javascript:void(0);"><span class="fw-semibold me-1">@
                                                                        Jane Smith</span>Send A friend Request.</a></p>
                                                            <div class="text-muted fs-13">
                                                                <span><i class="ri-time-line me-1"></i>Tuesday 12.17 PM</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p class="mb-0 fs-12 text-muted d-inline-flex align-items-center"><i class="ri-checkbox-blank-circle-fill me-1 fs-8 text-danger"></i>5 Days</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="tab-pane text-muted p-0 border-0" id="tabpane4" role="tabpanel">
                                        <ul class="list-unstyled mb-0" id="header-notification-scroll3">
                                            <li class="dropdown-item">
                                                <div class="d-flex align-items-start">
                                                    <div class="pe-2 lh-1">
                                                        <span class="avatar avatar-md bg-primary-transparent">
                                                            <i class="ri-shopping-bag-3-line fs-18"></i>
                                                        </span>
                                                    </div>
                                                    <div class="flex-grow-1 d-flex align-items-start justify-content-between">
                                                        <div>
                                                            <p class="mb-1"><a href="javascript:void(0);">Successfully purchages a
                                                                    business plan for <span class="text-danger fw-medium">$19,269</span></a></p>
                                                            <div class="text-muted fs-13">
                                                                <span><i class="ri-time-line me-1"></i>Monday 11.30 AM</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p class="mb-0 fs-12 text-muted d-inline-flex text-nowrap ms-4 align-items-center">
                                                                <i class="ri-checkbox-blank-circle-fill me-1 fs-8 text-primary"></i>Yesterday</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li class="dropdown-item">
                                                <div class="d-flex align-items-start">
                                                    <div class="pe-2 lh-1">
                                                        <span class="avatar avatar-md bg-secondary-transparent">
                                                            <i class="ri-wallet-3-line fs-18"></i>
                                                        </span>
                                                    </div>
                                                    <div class="flex-grow-1 d-flex align-items-start justify-content-between">
                                                        <div>
                                                            <p class="mb-1"><a href="javascript:void(0);">You Withdraw a<span class="fw-semibold text-primary"> $500 </span>From SBI ATM</a></p>
                                                            <div class="text-muted fs-13">
                                                                <span><i class="ri-time-line me-1"></i>Monday 11.30 AM</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p class="mb-0 fs-12 text-muted d-inline-flex text-nowrap ms-4 align-items-center">
                                                                <i class="ri-checkbox-blank-circle-fill me-1 fs-8 text-danger"></i>2 Days</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li class="dropdown-item">
                                                <div class="d-flex align-items-start">
                                                    <div class="pe-2 lh-1">
                                                        <span class="avatar avatar-md bg-danger-transparent">
                                                            <i class="ri-slideshow-3-line fs-18"></i>
                                                        </span>
                                                    </div>
                                                    <div class="flex-grow-1 d-flex align-items-start justify-content-between">
                                                        <div>
                                                            <p class="mb-1"><a href="javascript:void(0);">Your Inviting to the meeting<span class="fw-semibold text-orange"> Tommorow</span></a></p>
                                                            <div class="text-muted fs-13">
                                                                <span><i class="ri-time-line me-1"></i>Monday 8.30 AM</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p class="mb-0 fs-12 text-muted d-inline-flex align-items-center"><i class="ri-checkbox-blank-circle-fill me-1 fs-8 text-primary"></i>12 Min</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li class="dropdown-item">
                                                <div class="d-flex align-items-start">
                                                    <div class="pe-2 lh-1">
                                                        <span class="avatar avatar-md bg-warning-transparent">
                                                            <i class="ri-article-line fs-18"></i>
                                                        </span>
                                                    </div>
                                                    <div class="flex-grow-1 d-flex align-items-start justify-content-between">
                                                        <div>
                                                            <p class="mb-1"><a href="javascript:void(0);"><span class="fw-semibold me-1 text-warning">@
                                                                        Jane Smith</span>Assign a work to you</a></p>
                                                            <div class="text-muted fs-13">
                                                                <span><i class="ri-time-line me-1"></i>Tuesday 12.17 PM</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p class="mb-0 fs-12 text-muted d-inline-flex align-items-center"><i class="ri-checkbox-blank-circle-fill me-1 fs-8 text-danger"></i>5 Days</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="p-3 empty-header-item1 border-top">
                                    <div class="d-grid">
                                        <a href="javascript:void(0);" class="btn btn-primary btn-wave">View All</a>
                                    </div>
                                </div>
                                <div class="p-5 empty-item1 d-none">
                                    <div class="text-center">
                                        <span class="avatar avatar-xl avatar-rounded bg-secondary-transparent">
                                            <i class="ri-notification-off-line fs-2"></i>
                                        </span>
                                        <h6 class="fw-medium mt-3">No New Notifications</h6>
                                    </div>
                                </div>
                            </div>
                            <!-- End::main-header-dropdown -->
                        </li>
                        <!-- End::header-element -->

                        <!-- Start::header-element -->
                        <li class="header-element header-fullscreen">
                            <!-- Start::header-link -->
                            <a onclick="openFullscreen();" href="javascript:void(0);" class="header-link">
                                <svg xmlns="http://www.w3.org/2000/svg" class=" full-screen-open header-link-icon" width="1em" height="1em" viewbox="0 0 24 24">
                                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m12.567 7.934l2.742.1c.407.015.73.35.73.758v2.615m-5.5 2.027l5.044-5.018M2 17c0-1.886 0-2.828.586-3.414S4.114 13 6 13h1c1.886 0 2.828 0 3.414.586S11 15.114 11 17v1c0 1.886 0 2.828-.586 3.414S8.886 22 7 22H6c-1.886 0-2.828 0-3.414-.586S2 19.886 2 18zm0-8.5v2M14 2h-4m12 12v-4m-8.5 12h2M2.06 5.5c.154-1.066.453-1.821 1.036-2.404S4.434 2.214 5.5 2.06m13 0c1.066.154 1.821.453 2.404 1.036c.582.583.882 1.338 1.036 2.404m0 13c-.154 1.066-.454 1.821-1.036 2.404c-.583.582-1.338.882-2.404 1.036" color="currentColor"></path>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" class="full-screen-close header-link-icon d-none" width="1em" height="1em" viewbox="0 0 24 24">
                                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor">
                                        <path d="M2 10.002c.029-3.414.218-5.296 1.46-6.537C4.924 2 7.282 2 11.997 2s7.073 0 8.538 1.465S22 7.287 22 12.003c0 4.715 0 7.073-1.465 8.537c-1.241 1.242-3.123 1.431-6.537 1.46"></path>
                                        <path d="M4.999 13c-1.17.035-1.868.165-2.351.648s-.613 1.18-.648 2.35M8.001 13c1.17.035 1.868.165 2.351.648s.613 1.18.648 2.35m0 3.003c-.035 1.17-.165 1.868-.648 2.351s-1.18.613-2.35.648m-3.003 0c-1.17-.035-1.868-.165-2.351-.648s-.613-1.18-.648-2.35m14.413-7.996l-2.903-.066c-.432-.01-.777-.345-.782-.757l-.031-2.644m7.331-3.773l-6.747 6.601"></path>
                                    </g>
                                </svg>
                            </a>
                            <!-- End::header-link -->
                        </li>
                        <!-- End::header-element -->

                        <!-- Start::header-element -->
                        <li class="header-element dropdown">
                            <!-- Start::header-link|dropdown-toggle -->
                            <a href="javascript:void(0);" class="header-link dropdown-toggle" id="mainHeaderProfile" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                <div class="d-flex align-items-center">
                                    <div>
                                        <img :src="`/backend/assets/images/faces/14.jpg`" alt="img" class="avatar avatar-xs">
                                    </div>
                                </div>
                            </a>
                            <!-- End::header-link|dropdown-toggle -->
                            <ul class="main-header-dropdown dropdown-menu pt-0 overflow-hidden header-profile-dropdown dropdown-menu-end" aria-labelledby="mainHeaderProfile">
                                <li><a class="dropdown-item d-flex align-items-center" href="profile.php.html"><i class="ti ti-user me-2 fs-16"></i>Profile</a></li>
                                <li><a class="dropdown-item d-flex align-items-center" href="mail.php.html"><i class="ti ti-mail me-2 fs-16"></i>Inbox</a></li>
                                <li><a class="dropdown-item d-flex align-items-center" href="to-do-list.php.html"><i class="ti ti-checklist me-2 fs-16"></i>Task Manager</a></li>
                                <li><a class="dropdown-item d-flex align-items-center" href="mail-settings.php.html"><i class="ti ti-settings me-2 fs-16"></i>Settings</a></li>
                                <li><a class="dropdown-item d-flex align-items-center" href="chat.php.html"><i class="ti ti-headset me-2 fs-16"></i>Support</a></li>
                                <li><a class="dropdown-item d-flex align-items-center" href="sign-in-cover.php.html"><i class="ti ti-logout me-2 fs-16"></i>Log Out</a></li>
                            </ul>
                        </li>
                        <!-- End::header-element -->

                        <!-- Start::header-element -->
                        <li class="header-element">
                            <!-- Start::header-link|switcher-icon -->
                            <a href="javascript:void(0);" class="header-link switcher-icon" data-bs-toggle="offcanvas" data-bs-target="#switcher-canvas">
                                <svg xmlns="http://www.w3.org/2000/svg" class="header-link-icon" width="1em" height="1em" viewbox="0 0 24 24">
                                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor">
                                        <path d="m21.318 7.141l-.494-.856c-.373-.648-.56-.972-.878-1.101c-.317-.13-.676-.027-1.395.176l-1.22.344c-.459.106-.94.046-1.358-.17l-.337-.194a2 2 0 0 1-.788-.967l-.334-.998c-.22-.66-.33-.99-.591-1.178c-.261-.19-.609-.19-1.303-.19h-1.115c-.694 0-1.041 0-1.303.19c-.261.188-.37.518-.59 1.178l-.334.998a2 2 0 0 1-.789.967l-.337.195c-.418.215-.9.275-1.358.17l-1.22-.345c-.719-.203-1.078-.305-1.395-.176c-.318.129-.505.453-.878 1.1l-.493.857c-.35.608-.525.911-.491 1.234c.034.324.268.584.736 1.105l1.031 1.153c.252.319.431.875.431 1.375s-.179 1.056-.43 1.375l-1.032 1.152c-.468.521-.702.782-.736 1.105s.14.627.49 1.234l.494.857c.373.647.56.971.878 1.1s.676.028 1.395-.176l1.22-.344a2 2 0 0 1 1.359.17l.336.194c.36.23.636.57.788.968l.334.997c.22.66.33.99.591 1.18c.262.188.609.188 1.303.188h1.115c.694 0 1.042 0 1.303-.189s.371-.519.59-1.179l.335-.997c.152-.399.428-.738.788-.968l.336-.194c.42-.215.9-.276 1.36-.17l1.22.344c.718.204 1.077.306 1.394.177c.318-.13.505-.454.878-1.101l.493-.857c.35-.607.525-.91.491-1.234s-.268-.584-.736-1.105l-1.031-1.152c-.252-.32-.431-.875-.431-1.375s.179-1.056.43-1.375l1.032-1.153c.468-.52.702-.781.736-1.105s-.14-.626-.49-1.234"></path>
                                        <path d="M15.52 12a3.5 3.5 0 1 1-7 0a3.5 3.5 0 0 1 7 0"></path>
                                    </g>
                                </svg>
                            </a>
                            <!-- End::header-link|switcher-icon -->
                        </li>
                        <!-- End::header-element -->

                    </ul>
                    <!-- End::header-content-right -->

                </div>
                <!-- End::main-header-container -->

            </header>
             <!-- End::main-header -->
</div>
</template>

