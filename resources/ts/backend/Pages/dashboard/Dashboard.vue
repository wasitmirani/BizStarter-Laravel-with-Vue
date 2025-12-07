
<template >
    <div>

                <!-- Start::page-header -->
                <div class="my-4 page-header-breadcrumb d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div>
                        <h1 class="page-title fw-medium fs-18 mb-2">Ecommerce</h1>
                        <div class="">
                            <nav>
                                <ol class="breadcrumb mb-0">
                                    <li class="breadcrumb-item"><a href="javascript:void(0);">Dashboard</a></li>
                                    <li class="breadcrumb-item active" aria-current="page">Ecommerce</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div class="btn-list">
                        <button class="btn btn-primary-light btn-wave me-2">
                            <i class="bx bx-crown align-middle"></i> Plan Upgrade
                        </button>
                        <button class="btn btn-secondary-light btn-wave me-0">
                            <i class="ri-upload-cloud-line align-middle"></i> Export Report
                        </button>
                    </div>
                </div>
                <!-- End::page-header -->

                <!-- Start:: row-1 -->
                <div class="row">
                    <div class="col-xxl-8">
                        <div class="row">
                            <div class="col-xl-6">
                                <div class="card custom-card overflow-hidden main-custom-card primary-dash-border">
                                    <div class="card-body p-0 ecommerce-main-card position-relative bg-primary bg-opacity-10">
                                        <div class="img-container">
                                            <img :src="`/backend/assets/images/media/media-76.png`">
                                        </div>
                                        <div class="p-4 rounded  z-2 position-relative">
                                            <div class="row">
                                                <div class="col-sm-7">
                                                    <div class="">
                                                        <div>
                                                            <span class="avatar avatar-md primary mb-3">
                                                                <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewbox="0 0 24 24" width="24px" fill="#00000">
                                                                    <rect fill="none" height="24" width="24"></rect>
                                                                    <path d="M10.5,9.44l5.32,1.99c1.24,0.46,2.21,1.41,2.74,2.57L19,14V7.5L14,4L9,7.5V9h0.33L10.5,9.44z M14.5,7h1v1h-1 V7z M14.5,9h1v1h-1V9z M12.5,7h1v1h-1V7z M12.5,9h1v1h-1V9z M3,13h2v7H3V13z M19.9,18.57l-5.93,1.84L7,18.48V13h1.61l5.82,2.17 C14.77,15.3,15,15.63,15,16c0,0-1.99-0.05-2.3-0.15l-2.38-0.79l-0.63,1.9l2.38,0.79c0.51,0.17,1.04,0.26,1.58,0.26H19 C19.39,18.01,19.74,18.24,19.9,18.57z" opacity=".8" fill="#fff"></path>
                                                                    <path d="M15.5,7h-1v1h1V7z M13.5,7h-1v1h1V7z M15.5,9h-1v1h1V9z M13.5,9h-1v1h1V9z M21,6.5V14h-2V7.5L14,4L9,7.5V9H7V6.5l7-5L21,6.5 z M19,16h-2c0-1.2-0.75-2.28-1.87-2.7L8.97,11H1v11h6v-1.44l7,1.94l8-2.5v-1C22,17.34,20.66,16,19,16z M3,20v-7h2v7H3z M13.97,20.41 L7,18.48V13h1.61l5.82,2.17C14.77,15.3,15,15.63,15,16c0,0-1.99-0.05-2.3-0.15l-2.38-0.79l-0.63,1.9l2.38,0.79 c0.51,0.17,1.04,0.26,1.58,0.26H19c0.39,0,0.74,0.23,0.9,0.56L13.97,20.41z"></path>
                                                                </svg>
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <h5 class="fw-semibold"> Welcome to our Store! </h5>
                                                            <p class="text-default mb-3">Explore the latest trends, shop
                                                                our curated collections, and enjoy exclusive discounts
                                                                and Offers.</p>
                                                            <button class="btn btn-primary btn-wave waves-effect waves-light">Start
                                                                shopping now<i class="ti ti-arrow-narrow-right align-middle mx-1"></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-3">
                                                    <img :src="`/backend/assets/images/media/png/14.png`" alt="" class="ecommerce-side-img d-md-block d-none">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-6">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="card custom-card main-custom-card">
                                            <div class="card-body">
                                                <div class="d-flex justify-content-between align-items-center flex-wrap gap-1">
                                                    <div>
                                                        <div class="fw-medium fs-13 mb-1">Total Orders</div>
                                                        <p class="fs-22 fw-semibold mb-1">
                                                            35,367
                                                        </p>
                                                        <div class="d-flex gap-2 justify-content-between flex-wrap align-items-center">
                                                            <div class="fs-12 mb-0 text-muted">Increased by </div>
                                                            <div class="badge bg-primary-transparent rounded-pill">+
                                                                2.3%</div>
                                                        </div>
                                                    </div>
                                                    <div class="text-primary p-1 rounded-circle border border-primary border-opacity-25 ms-auto">
                                                        <span class="avatar avatar-md rounded-circle primary">
                                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewbox="0 0 24 24" width="24px" fill="#00000">
                                                                <path d="M0 0h24v24H0V0z" fill="none"></path>
                                                                <path d="M15.55 11l2.76-5H6.16l2.37 5z" fill="#fff" opacity=".8"></path>
                                                                <path d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path>
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="card custom-card main-custom-card">
                                            <div class="card-body">
                                                <div class="d-flex justify-content-between align-items-center flex-wrap gap-1">
                                                    <div>
                                                        <div class="fs-13 align-middle mb-1">Total Revenue</div>
                                                        <p class="fw-semibold fs-22 mb-1">
                                                            $28,346.00
                                                        </p>
                                                        <div class="d-flex gap-2 justify-content-between flex-wrap align-items-center">
                                                            <div class="fs-12 mb-0 text-muted">Increased by </div>
                                                            <div class="badge bg-danger-transparent rounded-pill">-
                                                                12.0%</div>
                                                        </div>
                                                    </div>
                                                    <div class="text-secondary p-1 rounded-circle border border-secondary border-opacity-25 ms-auto">
                                                        <span class="avatar avatar-md secondary rounded-circle">
                                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewbox="0 0 24 24" width="24px" fill="#00000">
                                                                <path d="M0 0h24v24H0V0z" fill="none"></path>
                                                                <path d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm1.23 13.33V19H10.9v-1.69c-1.5-.31-2.77-1.28-2.86-2.97h1.71c.09.92.72 1.64 2.32 1.64 1.71 0 2.1-.86 2.1-1.39 0-.73-.39-1.41-2.34-1.87-2.17-.53-3.66-1.42-3.66-3.21 0-1.51 1.22-2.48 2.72-2.81V5h2.34v1.71c1.63.39 2.44 1.63 2.49 2.97h-1.71c-.04-.97-.56-1.64-1.94-1.64-1.31 0-2.1.59-2.1 1.43 0 .73.57 1.22 2.34 1.67 1.77.46 3.66 1.22 3.66 3.42-.01 1.6-1.21 2.48-2.74 2.77z" opacity=".8" fill="#fff"></path>
                                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"></path>
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="card custom-card main-custom-card">
                                            <div class="card-body">
                                                <div class="d-flex justify-content-between align-items-center flex-wrap gap-1">
                                                    <div>
                                                        <div class="fs-13 align-middle mb-1">Total Sales</div>
                                                        <p class="fw-semibold fs-22 mb-1">
                                                            24,573
                                                        </p>
                                                        <div class="d-flex gap-2 justify-content-between flex-wrap align-items-center">
                                                            <div class="fs-12 mb-0 text-muted">Increased by </div>
                                                            <div class="badge bg-primary-transparent rounded-pill">+
                                                                2.3%</div>
                                                        </div>
                                                    </div>
                                                    <div class="text-danger p-1 rounded-circle border border-danger border-opacity-25 ms-auto">
                                                        <span class="avatar avatar-md danger rounded-circle">
                                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewbox="0 0 24 24" width="24px" fill="#00000">
                                                                <path d="M0 0h24v24H0V0z" fill="none"></path>
                                                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm7 10c0 4.52-2.98 8.69-7 9.93-4.02-1.24-7-5.41-7-9.93V6.3l7-3.11 7 3.11V11zm-11.59.59L6 13l4 4 8-8-1.41-1.42L10 14.17z"></path>
                                                                <path d="M5 6.3V11c0 4.52 2.98 8.69 7 9.93 4.02-1.23 7-5.41 7-9.93V6.3l-7-3.11L5 6.3zM18 9l-8 8-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9z" opacity=".8" fill="#fff"></path>
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="card custom-card main-custom-card">
                                            <div class="card-body">
                                                <div class="d-flex justify-content-between align-items-center flex-wrap gap-1">
                                                    <div>
                                                        <div class="fs-13 align-middle mb-1">New Visitors</div>
                                                        <p class="fw-semibold fs-22 mb-1">
                                                            5,659
                                                        </p>
                                                        <div class="d-flex gap-2 justify-content-between flex-wrap align-items-center">
                                                            <div class="fs-12 mb-0 text-muted">Decreased by </div>
                                                            <div class="badge bg-danger-transparent rounded-pill">- 7.6%
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="text-warning p-1 rounded-circle border border-warning border-opacity-25 ms-auto">
                                                        <span class="avatar avatar-md warning rounded-circle">
                                                            <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewbox="0 0 24 24" width="24px" fill="#00000">
                                                                <g>
                                                                    <rect fill="none" height="24" width="24"></rect>
                                                                </g>
                                                                <g>
                                                                    <g>
                                                                        <path d="M10,10h4c0.8,0,1.34-0.94,0.76-1.63c-0.87-1.04-0.26-2-0.26-2.37c0-0.41-0.24-0.77-0.62-0.92 c-0.29-0.12-0.55-0.31-0.75-0.54C12.96,4.33,12.58,4,12,4s-0.96,0.33-1.13,0.53c-0.2,0.24-0.46,0.42-0.75,0.54 C9.74,5.23,9.5,5.59,9.5,6c0,0.37,0.61,1.33-0.26,2.37C8.66,9.06,9.2,10,10,10z" opacity=".8" fill="#fff"></path>
                                                                        <path d="M17.48,16.34C16.29,15.73,14.37,15,12,15c-2.37,0-4.29,0.73-5.48,1.34C6.2,16.5,6,16.84,6,17.22V18h12 v-0.78C18,16.84,17.8,16.5,17.48,16.34z" opacity=".8" fill="#fff"></path>
                                                                        <path d="M18.39,14.56C16.71,13.7,14.53,13,12,13c-2.53,0-4.71,0.7-6.39,1.56C4.61,15.07,4,16.1,4,17.22V20h16v-2.78 C20,16.1,19.39,15.07,18.39,14.56z M18,18H6v-0.78c0-0.38,0.2-0.72,0.52-0.88C7.71,15.73,9.63,15,12,15 c2.37,0,4.29,0.73,5.48,1.34C17.8,16.5,18,16.84,18,17.22V18z"></path>
                                                                        <path d="M10,12c0.17,0,3.83,0,4,0c1.66,0,3-1.34,3-3c0-0.73-0.27-1.4-0.71-1.92C16.42,6.75,16.5,6.38,16.5,6 c0-1.25-0.77-2.32-1.86-2.77C14,2.48,13.06,2,12,2s-2,0.48-2.64,1.23C8.27,3.68,7.5,4.75,7.5,6c0,0.38,0.08,0.75,0.21,1.08 C7.27,7.6,7,8.27,7,9C7,10.66,8.34,12,10,12z M9.24,8.37C10.11,7.33,9.5,6.37,9.5,6c0-0.41,0.24-0.77,0.62-0.92 c0.29-0.12,0.55-0.31,0.75-0.54C11.04,4.33,11.42,4,12,4s0.96,0.33,1.13,0.53c0.2,0.24,0.46,0.42,0.75,0.54 C14.26,5.23,14.5,5.59,14.5,6c0,0.37-0.61,1.33,0.26,2.37C15.34,9.06,14.8,10,14,10h-4C9.2,10,8.66,9.06,9.24,8.37z"></path>
                                                                    </g>
                                                                </g>
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-4">
                                <div class="card custom-card">
                                    <div class="card-header justify-content-between">
                                        <div class="card-title"> Sales History </div>
                                        <a href="javascript:void(0);" class="fs-12 text-muted fw-medium d-inline-flex align-items-center"> View
                                            All<i class="ti ti-arrow-narrow-right ms-1"></i> </a>
                                    </div>
                                    <div class="card-body p-0">
                                        <div class="table-responsive">
                                            <table class="table text-nowrap">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <div class="d-flex align-items-start gap-2">
                                                                <div> <span class="avatar avatar-md avatar-rounded bg-primary-transparent">
                                                                        <img :src="`/backend/assets/images/ecommerce/jpg/11.jpg`" alt="">
                                                                    </span> </div>
                                                                <div> <span class="d-block fw-semibold mb-0">Rolled
                                                                        Signature Scent</span>
                                                                    <span class="d-block fs-13 text-muted">United States
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="text-end">
                                                            <div> <span class="d-block fw-semibold mb-1 fs-14">$1,234.78</span>
                                                                <span class="d-block fs-12 text-muted">15 Min Ago</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <div class="d-flex align-items-start gap-2">
                                                                <div> <span class="avatar avatar-md avatar-rounded bg-secondary-transparent">
                                                                        <img :src="`/backend/assets/images/ecommerce/jpg/2.jpg`" alt="">
                                                                    </span> </div>
                                                                <div> <span class="d-block fw-semibold mb-0">Little Pro
                                                                        Kids Backpack
                                                                    </span> <span class="d-block fs-13 text-muted">Japan</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="text-end">
                                                            <div> <span class="d-block fw-semibold mb-1  fs-14">$623.99</span>
                                                                <span class="d-block fs-12 text-muted">Today</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <div class="d-flex align-items-start gap-2">
                                                                <div> <span class="avatar avatar-md avatar-rounded bg-danger-transparent">
                                                                        <img :src="`/backend/assets/images/ecommerce/jpg/3.jpg`" alt="">
                                                                    </span> </div>
                                                                <div> <span class="d-block fw-semibold mb-0">Galaxy X9
                                                                        Ultra Camera</span> <span class="d-block fs-13 text-muted">Canada</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="text-end">
                                                            <div> <span class="d-block fw-semibold mb-1  fs-14">$1,324</span>
                                                                <span class="d-block fs-12 text-muted">2 Days Ago</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <div class="d-flex align-items-start gap-2">
                                                                <div> <span class="avatar avatar-md avatar-rounded bg-warning-transparent">
                                                                        <img :src="`/backend/assets/images/ecommerce/jpg/4.jpg`" alt="">
                                                                    </span>
                                                                </div>
                                                                <div> <span class="d-block fw-semibold mb-0">HP 120Ram
                                                                        Laptop</span> <span class="d-block fs-13 text-muted">United
                                                                        Kingdom</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="text-end">
                                                            <div> <span class="d-block fw-semibold mb-1  fs-14">$1,123.49</span>
                                                                <span class="d-block fs-12 text-muted">5 Months
                                                                    Ago</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <div class="d-flex align-items-start gap-2">
                                                                <div> <span class="avatar avatar-md avatar-rounded bg-info-transparent">
                                                                        <img :src="`/backend/assets/images/ecommerce/jpg/5.jpg`" alt="">
                                                                    </span> </div>
                                                                <div> <span class="d-block fw-semibold mb-0">Black
                                                                        Oxford Sofa Set</span>
                                                                    <span class="d-block fs-13 text-muted">Australia</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="text-end">
                                                            <div> <span class="d-block fw-semibold mb-1  fs-14">$1,234.78</span>
                                                                <span class="d-block fs-12 text-muted">1 year Ago</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="border-bottom-0 rounded">
                                                            <div class="d-flex align-items-start gap-2">
                                                                <div> <span class="avatar avatar-md avatar-rounded bg-info-transparent">
                                                                        <img :src="`/backend/assets/images/ecommerce/jpg/6.jpg`" alt="">
                                                                    </span> </div>
                                                                <div> <span class="d-block fw-semibold mb-0">Jordan
                                                                        Money Plant</span>
                                                                    <span class="d-block fs-13 text-muted">India</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="text-end border-bottom-0 rounded">
                                                            <div> <span class="d-block fw-semibold mb-1  fs-14">$1,234.78</span>
                                                                <span class="d-block fs-12 text-muted">1 year Ago</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-8">
                                <div class="card custom-card">
                                    <div class="card-header justify-content-between">
                                        <div class="card-title"> Monthly Income </div>
                                        <div class="d-flex align-items-center flex-wrap gap-2">
                                            <div class="dropdown">
                                                <a href="javascript:void(0);" class="btn btn-primary-light btn-sm btn-wave waves-effect waves-light" data-bs-toggle="dropdown" aria-expanded="false"> Sort By<i class="ri-arrow-down-s-line align-middle ms-1 d-inline-block"></i>
                                                </a>
                                                <ul class="dropdown-menu" role="menu">
                                                    <li><a class="dropdown-item" href="javascript:void(0);">New</a></li>
                                                    <li><a class="dropdown-item" href="javascript:void(0);">Popular</a>
                                                    </li>
                                                    <li><a class="dropdown-item" href="javascript:void(0);">Relevant</a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div> <button class="btn btn-light border btn-sm">Export<i class="ri-share-forward-line ms-1"></i></button> </div>
                                        </div>
                                    </div>
                                    <div class="card-body pb-0">
                                        <div id="revenue-overview"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xxl-4">
                        <div class="card custom-card">
                            <div class="card-header justify-content-between">
                                <div class="card-title">Premier Product Selections</div>
                                <a href="javascript:void(0);" class="fs-12 text-muted fw-medium d-inline-flex align-items-center"> View All<i class="ti ti-arrow-narrow-right ms-1"></i> </a>
                            </div>
                            <div class="card-body">
                                <div class="swiper swiper-basic">
                                    <div class="swiper-wrapper">
                                        <div class="swiper-slide">
                                            <div class="row gx-3 gy-2">
                                                <div class="col-sm-4">
                                                    <div class="border border-primary border-opacity-10 p-3 rounded-2 align-items-center d-block gap-2 text-center bg-primary-transparent posotion-relative overflow-hidden">
                                                        <div class="d-flex align-items-center justify-content-center">
                                                            <img :src="`/backend/assets/images/ecommerce/png/14.png`" alt="" class="img-fluid avatar avatar-xxl mb-4">
                                                        </div>
                                                        <div class="text-center ms-auto">
                                                            <span>20% OFF</span>
                                                            <p class="fw-medium mb-1 text-default">Ladies Hand Bag</p>
                                                            <div class="ratings mb-3">
                                                                <span class="text-warning fs-10 lh-1 custom-star"><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-half-fill"></i></span><br>
                                                                <span class="text-muted fs-12">(22 reviews)</span>
                                                            </div>
                                                            <a class="btn btn-primary btn-sm">View Product</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-4">
                                                    <div class="border border-secondary border-opacity-10 p-3 rounded-2 align-items-center d-block gap-2 text-center bg-secondary-transparent ">
                                                        <div class="d-flex align-items-center justify-content-center">
                                                            <img :src="`/backend/assets/images/ecommerce/png/15.png`" alt="" class="img-fluid avatar avatar-xxl mb-4">
                                                        </div>
                                                        <div class="text-center ms-auto">
                                                            <span>21% OFF</span>
                                                            <p class="fw-medium mb-1 text-default">Jublex Men Watch</p>
                                                            <div class="ratings mb-3">
                                                                <span class="text-warning fs-10 lh-1 custom-star"><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-half-fill"></i></span><br>
                                                                <span class="text-muted fs-12">(75 reviews)</span>
                                                            </div>
                                                            <a class="btn btn-secondary btn-sm" href="javascript:void(0);">View Product</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-4">
                                                    <div class="border border-danger border-opacity-10 p-3 rounded-2 align-items-center d-block gap-2 text-center bg-danger-transparent">
                                                        <div class="d-flex align-items-center justify-content-center">
                                                            <img :src="`/backend/assets/images/ecommerce/png/12.png`" alt="" class="img-fluid avatar avatar-xxl mb-4">
                                                        </div>
                                                        <div class="text-center ms-auto">
                                                            <span>30% OFF</span>
                                                            <p class="fw-medium mb-1 text-default">Leather Handbag</p>
                                                            <div class="ratings mb-3">
                                                                <span class="text-warning fs-10 lh-1 custom-star"><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-half-fill"></i></span><br>
                                                                <span class="text-muted fs-12">(66 reviews)</span>
                                                            </div>
                                                            <a class="btn btn-danger btn-sm">View Product</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="swiper-slide">
                                            <div class="row gx-3 gy-2">
                                                <div class="col-sm-4">
                                                    <div class="border border-secondary border-opacity-10 p-3 rounded-2 align-items-center d-block gap-2 text-center bg-secondary-transparent">
                                                        <div class="d-flex align-items-center justify-content-center">
                                                            <img :src="`/backend/assets/images/ecommerce/png/15.png`" alt="" class="img-fluid avatar avatar-xxl mb-4">
                                                        </div>
                                                        <div class="text-center ms-auto">
                                                            <span>20% OFF</span>
                                                            <p class="fw-medium mb-1 text-default">Adidas Men shoe</p>
                                                            <div class="ratings mb-3">
                                                                <span class="text-warning fs-10 lh-1 custom-star"><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-half-fill"></i></span><br>
                                                                <span class="text-muted fs-12">(111 reviews)</span>
                                                            </div>
                                                            <a class="btn btn-secondary btn-sm">View Product</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-4">
                                                    <div class="border border-warning border-opacity-10 p-3 rounded-2 align-items-center d-block gap-2 text-center bg-warning-transparent">
                                                        <div class="d-flex align-items-center justify-content-center">
                                                            <img :src="`/backend/assets/images/ecommerce/png/16.png`" alt="" class="img-fluid avatar avatar-xxl mb-4">
                                                        </div>
                                                        <div class="text-center ms-auto">
                                                            <span>10% OFF</span>
                                                            <p class="fw-medium mb-1 text-default">Samsong Headset</p>
                                                            <div class="ratings mb-3">
                                                                <span class="text-warning fs-10 lh-1 custom-star"><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-half-fill"></i></span><br>
                                                                <span class="text-muted fs-12">(23 reviews)</span>
                                                            </div>
                                                            <a class="btn btn-warning btn-sm">View Product</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-4">
                                                    <div class="border border-info border-opacity-10 p-3 rounded-2 align-items-center d-block gap-2 text-center bg-info-transparent">
                                                        <div class="d-flex align-items-center justify-content-center">
                                                            <img :src="`/backend/assets/images/ecommerce/png/25.png`" alt="" class="img-fluid avatar avatar-xxl mb-4">
                                                        </div>
                                                        <div class="text-center ms-auto">
                                                            <span>15% OFF</span>
                                                            <p class="fw-medium mb-1 text-default">10Lens Camera</p>
                                                            <div class="ratings mb-3">
                                                                <span class="text-warning fs-10 lh-1 custom-star"><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-half-fill"></i></span><br>
                                                                <span class="text-muted fs-12">(43 reviews)</span>
                                                            </div>
                                                            <a class="btn btn-info btn-sm">View Product</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="swiper-slide">
                                            <div class="row gx-3 gy-2">
                                                <div class="col-sm-4">
                                                    <div class="border border-danger border-opacity-10 p-3 rounded-2 align-items-center d-block gap-2 text-center bg-danger-transparent">
                                                        <div class="d-flex align-items-center justify-content-center">
                                                            <img :src="`/backend/assets/images/ecommerce/png/12.png`" alt="" class="img-fluid avatar avatar-xxl mb-4">
                                                        </div>
                                                        <div class="text-center ms-auto">
                                                            <span>20% OFF</span>
                                                            <p class="fw-medium mb-1 text-default">Ladies Hand Bag</p>
                                                            <div class="ratings mb-3">
                                                                <span class="text-warning fs-10 lh-1 custom-star"><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-half-fill"></i></span><br>
                                                                <span class="text-muted fs-12">(111 reviews)</span>
                                                            </div>
                                                            <a class="btn btn-danger btn-sm">View Product</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-4">
                                                    <div class="border border-primary border-opacity-10 p-3 rounded-2 align-items-center d-block gap-2 text-center bg-primary-transparent">
                                                        <div class="d-flex align-items-center justify-content-center">
                                                            <img :src="`/backend/assets/images/ecommerce/png/20.png`" alt="" class="img-fluid avatar avatar-xxl mb-4">
                                                        </div>
                                                        <div class="text-center ms-auto">
                                                            <span>10% OFF</span>
                                                            <p class="fw-medium mb-1 text-default">Ladies Tshirt</p>
                                                            <div class="ratings mb-3">
                                                                <span class="text-warning fs-10 lh-1 custom-star"><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-half-fill"></i></span><br>
                                                                <span class="text-muted fs-12">(23 reviews)</span>
                                                            </div>
                                                            <a class="btn btn-primary btn-sm">View Product</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-4">
                                                    <div class="border border-orange border-opacity-10 p-3 rounded-2 align-items-center d-block gap-2 text-center bg-orange-transparent">
                                                        <div class="d-flex align-items-center justify-content-center">
                                                            <img :src="`/backend/assets/images/ecommerce/png/19.png`" alt="" class="img-fluid avatar avatar-xxl mb-4">
                                                        </div>
                                                        <div class="text-center ms-auto">
                                                            <span>15% OFF</span>
                                                            <p class="fw-medium mb-1 text-default">Pink Ladiesbag</p>
                                                            <div class="ratings mb-3">
                                                                <span class="text-warning fs-10 lh-1 custom-star"><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-half-fill"></i></span><br>
                                                                <span class="text-muted fs-12">(43 reviews)</span>
                                                            </div>
                                                            <a class="btn btn-orange btn-sm">View Product</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card custom-card">
                            <div class="card-header justify-content-between pb-2">
                                <div class="card-title">
                                    Top Sellers
                                </div>
                                <a href="javascript:void(0);" class="text-primary text-decoration-underline link-offset-1">
                                    View All
                                </a>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table text-nowrap">
                                        <tbody>
                                            <tr>
                                                <th>
                                                    <div class="d-flex align-items-top justify-content-start flex-grow-1">
                                                        <div class="avatar avatar-md avatar-rounded bg-secondary me-2">
                                                            <img :src="`/backend/assets/images/faces/6.jpg`" alt="Natalie Brown">
                                                        </div>
                                                        <div>
                                                            <p class="mb-0 fw-semibold">Emily Johnson <i class="ri-checkbox-circle-line text-primary fw-normal fs-14 lh-1 fw-medium"></i>
                                                            </p>
                                                            <p class="mb-0 text-muted fs-12"><i class="ri ri-map-pin-line me-1 lh-1 align-end d-inline-block"></i>San
                                                                Francisco</p>
                                                        </div>
                                                    </div>
                                                </th>
                                                <td>Bags & Wallet</td>
                                                <td>
                                                    <span class="mb-0">8547</span>
                                                </td>
                                                <td>
                                                    <span>32%<span><i class="ri-bar-chart-fill text-secondary ms-1 fs-14"></i></span></span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>
                                                    <div class="d-flex align-items-top justify-content-start flex-grow-1">
                                                        <div class="avatar avatar-md avatar-rounded bg-secondary me-2">
                                                            <img :src="`/backend/assets/images/faces/3.jpg`" alt="Natalie Brown">
                                                        </div>
                                                        <div>
                                                            <p class="mb-0 fw-semibold">Sophie Davis <i class="ri-checkbox-circle-line text-primary fw-normal fs-14 lh-1 fw-medium"></i>
                                                            </p>
                                                            <p class="mb-0 text-muted fs-12"><i class="ri ri-map-pin-line me-1 lh-1 align-end d-inline-block"></i>San
                                                                Francisco</p>
                                                        </div>
                                                    </div>
                                                </th>
                                                <td>Home Appliances</td>
                                                <td>
                                                    <span class="mb-0">1254</span>
                                                </td>
                                                <td>
                                                    <span>26%<span><i class="ri-bar-chart-fill text-secondary ms-1 fs-14"></i></span></span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>
                                                    <div class="d-flex align-items-top justify-content-start flex-grow-1">
                                                        <div class="avatar avatar-md avatar-rounded bg-secondary me-2">
                                                            <img :src="`/backend/assets/images/faces/5.jpg`" alt="Natalie Brown">
                                                        </div>
                                                        <div>
                                                            <p class="mb-0 fw-semibold">Olivia White <i class="ri-checkbox-circle-line text-primary fw-normal fs-14 lh-1 fw-medium"></i>
                                                            </p>
                                                            <p class="mb-0 text-muted fs-12"><i class="ri ri-map-pin-line me-1 lh-1 align-end d-inline-block"></i>San
                                                                Francisco</p>
                                                        </div>
                                                    </div>
                                                </th>
                                                <td>Electronics</td>
                                                <td>
                                                    <span class="mb-0">986</span>
                                                </td>
                                                <td>
                                                    <span>65%<span><i class="ri-bar-chart-fill text-secondary ms-1 fs-14"></i></span></span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>
                                                    <div class="d-flex align-items-top justify-content-start flex-grow-1">
                                                        <div class="avatar avatar-md avatar-rounded bg-secondary me-2">
                                                            <img :src="`/backend/assets/images/faces/7.jpg`" alt="Natalie Brown">
                                                        </div>
                                                        <div>
                                                            <p class="mb-0 fw-semibold">Mia Taylor <i class="ri-checkbox-circle-line text-primary fw-normal fs-14 lh-1 fw-medium"></i>
                                                            </p>
                                                            <p class="mb-0 text-muted fs-12"><i class="ri ri-map-pin-line me-1 lh-1 align-end d-inline-block"></i>San
                                                                Francisco</p>
                                                        </div>
                                                    </div>
                                                </th>
                                                <td>Beauty & Care</td>
                                                <td>
                                                    <span class="mb-0">3422</span>
                                                </td>
                                                <td>
                                                    <span>76%<span><i class="ri-bar-chart-fill text-secondary ms-1 fs-14"></i></span></span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th class="border-bottom-0 rounded">
                                                    <div class="d-flex align-items-top justify-content-start flex-grow-1">
                                                        <div class="avatar avatar-md avatar-rounded bg-secondary me-2">
                                                            <img :src="`/backend/assets/images/faces/2.jpg`" alt="Natalie Brown">
                                                        </div>
                                                        <div>
                                                            <p class="mb-0 fw-semibold">Chloe Anderson <i class="ri-checkbox-circle-line text-primary fw-normal fs-14 lh-1 fw-medium"></i>
                                                            </p>
                                                            <p class="mb-0 text-muted fs-12"><i class="ri ri-map-pin-line me-1 lh-1 align-end d-inline-block"></i>San
                                                                Francisco</p>
                                                        </div>
                                                    </div>
                                                </th>
                                                <td class="border-bottom-0">Kitchenware</td>
                                                <td class="border-bottom-0">
                                                    <span class="mb-0">8935</span>
                                                </td>
                                                <td class="border-bottom-0 rounded">
                                                    <span>52%<span><i class="ri-bar-chart-fill text-secondary ms-1 fs-14"></i></span></span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- End:: row-1 -->

                <!-- Start:: row-2 -->
                <div class="row">
                    <div class="col-xxl-3">
                        <div class="card custom-card">
                            <div class="card-header justify-content-between pb-2">
                                <div class="card-title">
                                    Track Order
                                </div>
                                <div class="dropdown">
                                    <a aria-label="anchor" href="javascript:void(0);" class="btn btn-icon btn-sm btn-light" data-bs-toggle="dropdown">
                                        <i class="fe fe-more-vertical"></i>
                                    </a>
                                    <ul class="dropdown-menu dropdown-menu-end">
                                        <li><a class="dropdown-item" href="javascript:void(0);">Action</a></li>
                                        <li><a class="dropdown-item" href="javascript:void(0);">Another action</a></li>
                                        <li><a class="dropdown-item" href="javascript:void(0);">Something else here</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="d-flex gap-3 border-bottom pb-3">
                                    <span class="avatar avatar-lg bg-light">
                                        <img :src="`/backend/assets/images/ecommerce/png/3.png`">
                                    </span>
                                    <div>
                                        <p class="mb-0 fs-15 fw-semibold">Wired Headset With Mic(Black)</p>
                                        <span class="fs-14 text-primary fw-semibold">$12,756<span class="text-muted fs-13 ms-2">(Qty:02)</span></span>
                                    </div>
                                </div>
                                <ul class="list-unstyled mb-0 track-order pt-3">
                                    <li class="d-flex">
                                        <div class="avatar-md p-1 bg-primary-transparent avatar avatar-rounded flex-shrink-0 me-3">
                                            <span class="avatar-sm avatar avatar-rounded bg-primary">
                                                <i class="ti ti-user fs-18"></i>
                                            </span>
                                        </div>
                                        <div class="flex-grow-1">
                                            <div class="d-flex flex-wrap gap-1">
                                                <div class="flex-grow-1">
                                                    <p class="mb-1 fs-14 fw-medium">Order Placed</p>
                                                    <p class="text-muted fs-13 mb-0">We Have Recieved Your Order</p>
                                                </div>
                                                <div class="ms-auto text-end flex-shrink-0">
                                                    <p class="fs-12 mb-0">10 mins ago</p>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="d-flex">
                                        <div class="avatar-md p-1 bg-secondary-transparent avatar avatar-rounded flex-shrink-0 me-3">
                                            <span class="avatar-sm avatar avatar-rounded bg-secondary">
                                                <i class="ti ti-file-invoice fs-18"></i>
                                            </span>
                                        </div>
                                        <div class="flex-grow-1">
                                            <div class="d-flex flex-wrap gap-1">
                                                <div class="flex-grow-1">
                                                    <p class="mb-1 fs-14 fw-medium">Order Packed</p>
                                                    <p class="text-muted fs-13 mb-0">Your Product Packed</p>
                                                </div>
                                                <div class="ms-auto text-end flex-shrink-0">
                                                    <p class="fs-12 mb-0">30 mins ago</p>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="d-flex">
                                        <div class="avatar-md p-1 bg-danger-transparent avatar avatar-rounded flex-shrink-0 me-3">
                                            <span class="avatar-sm avatar avatar-rounded bg-danger">
                                                <i class="ti ti-message fs-18"></i>
                                            </span>
                                        </div>
                                        <div class="flex-grow-1">
                                            <div class="d-flex flex-wrap gap-1">
                                                <div class="flex-grow-1">
                                                    <p class="mb-1 fs-14 fw-medium">Order Shipped</p>
                                                    <p class="text-muted fs-13 mb-0">Your Order Is Shipped</p>
                                                </div>
                                                <div class="ms-auto text-end flex-shrink-0">
                                                    <p class="fs-12 mb-0">1 hour ago</p>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="d-flex">
                                        <div class="avatar-md p-1 bg-light avatar avatar-rounded flex-shrink-0 me-3">
                                            <span class="avatar-sm avatar avatar-rounded bg-gray-400 text-dark border">
                                                <i class="ti ti-shopping-cart fs-18"></i>
                                            </span>
                                        </div>
                                        <div class="flex-grow-1">
                                            <div class="d-flex flex-wrap gap-1">
                                                <div class="flex-grow-1">
                                                    <p class="mb-1 fs-14 fw-medium">On The Way</p>
                                                    <p class="text-muted fs-13 mb-0">Your Order Is Ready To Deliver.</p>
                                                </div>
                                                <div class="ms-auto text-end flex-shrink-0">
                                                    <p class="fs-12 mb-0">2 hours ago</p>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="d-flex mb-0">
                                        <div class="avatar-md p-1 bg-light avatar avatar-rounded flex-shrink-0 me-3">
                                            <span class="avatar-sm avatar avatar-rounded bg-gray-400 text-dark border">
                                                <i class="ti ti-check fs-18"></i>
                                            </span>
                                        </div>
                                        <div class="flex-grow-1">
                                            <div class="d-flex flex-wrap gap-1">
                                                <div class="flex-grow-1">
                                                    <p class="mb-1 fs-14 fw-medium">Product Deliverd</p>
                                                    <p class="text-muted fs-13 mb-0">Order successfully Deliverd.</p>
                                                </div>
                                                <div class="ms-auto text-end flex-shrink-0">
                                                    <p class="fs-12 mb-0"> 3 hours ago</p>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-xxl-6">
                        <div class="card custom-card">
                            <div class="card-header justify-content-between d-flex gap-2 flex-wrap">
                                <div class="card-title">
                                    Top Selling Products
                                </div>
                                <div class="dropdown">
                                    <a href="javascript:void(0);" class="btn btn-light btn-sm btn-wave waves-effect waves-light" data-bs-toggle="dropdown" aria-expanded="false"> Sort By<i class="ri-arrow-down-s-line align-middle ms-1 d-inline-block"></i>
                                    </a>
                                    <ul class="dropdown-menu" role="menu">
                                        <li><a class="dropdown-item" href="javascript:void(0);">New</a></li>
                                        <li><a class="dropdown-item" href="javascript:void(0);">Popular</a>
                                        </li>
                                        <li><a class="dropdown-item" href="javascript:void(0);">Relevant</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table text-nowrap mb-0">
                                        <thead>
                                            <tr>
                                                <th scope="col" class="text-center">Id.no</th>
                                                <th scope="col">Product Name</th>
                                                <th scope="col">Date</th>
                                                <th scope="col">Category</th>
                                                <th scope="col">Stock</th>
                                                <th scope="col">Total Sales</th>
                                            </tr>
                                        </thead>
                                        <tbody class="top-selling">
                                            <tr>
                                                <td class="text-center lh-1">
                                                    #31265
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <span class="avatar avatar-sm me-2 my-1">
                                                            <img :src="`/backend/assets/images/ecommerce/jpg/3.jpg`" class="rounded-pill bg-light" alt="">
                                                        </span>Galaxy X9 Ultra Camera
                                                    </div>
                                                </td>
                                                <td>19/02/2024</td>
                                                <td>Electronics</td>
                                                <td><span class="badge bg-primary-transparent text-primary">In
                                                        Stock</span></td>
                                                <td>
                                                    <span class="fw-semibold">7,892</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-center lh-1">
                                                    #37535
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <span class="avatar avatar-sm me-2 my-1">
                                                            <img :src="`/backend/assets/images/ecommerce/jpg/6.jpg`" class="rounded-pill bg-light" alt="">
                                                        </span>
                                                        Elegant Red Flower Pot
                                                    </div>
                                                </td>
                                                <td>15/05/2024</td>
                                                <td>Home Decoration</td>
                                                <td><span class="badge bg-primary-transparent text-primary">In
                                                        Stock</span></td>
                                                <td>
                                                    <span class="fw-semibold">3,578</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-center lh-1">
                                                    #35482
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <span class="avatar avatar-sm me-2 my-1">
                                                            <img :src="`/backend/assets/images/ecommerce/jpg/7.jpg`" class="rounded-pill bg-light" alt="">
                                                        </span>
                                                        Altra Pro Max Camera
                                                    </div>
                                                </td>
                                                <td>22/07/2024</td>
                                                <td>Electronics</td>
                                                <td><span class="badge bg-danger-transparent text-danger">Out Of
                                                        Stock</span></td>
                                                <td>
                                                    <span class="fw-semibold">2,934</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-center lh-1">
                                                    #46535
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <span class="avatar avatar-sm me-2 my-1">
                                                            <img :src="`/backend/assets/images/ecommerce/jpg/8.jpg`" class="rounded-pill bg-light" alt="">
                                                        </span>
                                                        Elegant Smell Candles
                                                    </div>
                                                </td>
                                                <td>12/11/2024</td>
                                                <td>Home Decoration</td>
                                                <td><span class="badge bg-danger-transparent text-danger">Out Of
                                                        Stock</span></td>
                                                <td>
                                                    <span class="fw-semibold">4,589</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-center lh-1">
                                                    #46535
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <span class="avatar avatar-sm me-2 my-1">
                                                            <img :src="`/backend/assets/images/ecommerce/jpg/3.jpg`" class="rounded-pill bg-light" alt="">
                                                        </span>
                                                        Altra Pro max Camera
                                                    </div>
                                                </td>
                                                <td>12/11/2024</td>
                                                <td>Electronics</td>
                                                <td><span class="badge bg-danger-transparent text-danger">Out Of
                                                        Stock</span></td>
                                                <td>
                                                    <span class="fw-semibold">4,589</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-center lh-1 border-bottom-0 rounded">
                                                    #35653
                                                </td>
                                                <td class="border-bottom-0">
                                                    <div class="d-flex align-items-center">
                                                        <span class="avatar avatar-sm me-2 my-1">
                                                            <img :src="`/backend/assets/images/ecommerce/jpg/2.jpg`" class="rounded-pill bg-light" alt="">
                                                        </span>
                                                        Little Pro Kids Backpack
                                                    </div>
                                                </td>
                                                <td>31/08/2024</td>
                                                <td class="border-bottom-0">Kids' Fashion</td>
                                                <td class="border-bottom-0"><span class="badge bg-primary-transparent text-primary">In
                                                        Stock</span></td>
                                                <td class="border-bottom-0 rounded">
                                                    <span class="fw-semibold">4,589</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xxl-3">
                        <div class="card custom-card">
                            <div class="card-header justify-content-between">
                                <div class="card-title">
                                    Top Selling Categories
                                </div>
                                <div class="dropdown">
                                    <a href="javascript:void(0);" class="btn btn-light btn-sm btn-wave waves-effect waves-light" data-bs-toggle="dropdown" aria-expanded="false"> Sort By<i class="ri-arrow-down-s-line align-middle ms-1 d-inline-block"></i>
                                    </a>
                                    <ul class="dropdown-menu" role="menu">
                                        <li><a class="dropdown-item" href="javascript:void(0);">New</a></li>
                                        <li><a class="dropdown-item" href="javascript:void(0);">Popular</a>
                                        </li>
                                        <li><a class="dropdown-item" href="javascript:void(0);">Relevant</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="card-body p-0">
                                <div id="top-categories"></div>
                                <div class="table-responsive border-top">
                                    <table class="table text-nowrap">
                                        <tbody>
                                            <tr>
                                                <th>
                                                    <div class="d-flex gap-2 align-items-center">
                                                        <span class="avatar avatar-sm bg-primary-transparent">
                                                            <i class="ri-macbook-line fs-18"></i>
                                                        </span>
                                                        <span class="d-block fw-semibold">Electronics</span>
                                                    </div>
                                                </th>
                                                <td class="text-center"><span class="text-primary fw-medium ms-1 d-inline-flex align-items-center"><i class="ti ti-arrow-narrow-up"></i>0.78%</span></td>
                                                <td class="text-center">
                                                    <div class="fs-14 mb-0 fw-semibold"> 18,235 </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>
                                                    <div class="d-flex gap-2 align-items-center">
                                                        <span class="avatar avatar-sm bg-secondary-transparent">
                                                            <i class="ri-t-shirt-line fs-18"></i>
                                                        </span>
                                                        <span class="d-block fw-semibold">Fashion Trends</span>
                                                    </div>
                                                </th>
                                                <td class="text-center"><span class="text-danger fw-medium ms-1 d-inline-flex"><i class="ti ti-arrow-narrow-down"></i>1.57%</span>
                                                </td>
                                                <td class="text-center">
                                                    <div class="fs-14 mb-0 fw-semibold"> 12,743 </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>
                                                    <div class="d-flex gap-2 align-items-center">
                                                        <span class="avatar avatar-sm bg-danger-transparent">
                                                            <i class="ri-discord-line fs-18"></i>
                                                        </span>
                                                        <span class="d-block fw-semibold">Entertainment</span>
                                                    </div>
                                                </th>
                                                <td class="text-center"><span class="text-primary fw-medium ms-1 d-inline-flex align-items-center"><i class="ti ti-arrow-narrow-up"></i>0.32%</span></td>
                                                <td class="text-center">
                                                    <div class="fs-14 mb-0 fw-semibold"> 8,369 </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th class="border-bottom-0 rounded">
                                                    <div class="d-flex gap-2 align-items-center">
                                                        <span class="avatar avatar-sm bg-warning-transparent">
                                                            <i class="ri-home-3-line fs-18"></i>
                                                        </span>
                                                        <span class="d-block fw-semibold">Home Decoration</span>
                                                    </div>
                                                </th>
                                                <td class="text-center border-bottom-0 rounded"><span class="text-primary fw-medium ms-1 d-inline-flex align-items-center"><i class="ti ti-arrow-narrow-up"></i>19.45%</span></td>
                                                <td class="text-center border-bottom-0 rounded">
                                                    <div class="fs-14 mb-0 fw-semibold"> 16,458 </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- End:: row-2 -->

                <!-- Start:: row-3 -->
                <div class="row">
                    <div class="col-xl-12">
                        <div class="card custom-card">
                            <div class="card-header justify-content-between border-bottom-0">
                                <div class="card-title">
                                    Recent Orders
                                </div>
                                <div class="d-flex flex-wrap ms-auto gap-2">
                                    <div class="me-1">
                                        <input class="form-control form-control-sm" type="text" placeholder="Search" aria-label=".form-control-sm example">
                                    </div>
                                    <div class="dropdown">
                                        <a href="javascript:void(0);" class="btn btn-primary btn-sm btn-wave waves-effect waves-light" data-bs-toggle="dropdown" aria-expanded="false">
                                            Sort By<i class="ri-arrow-down-s-line align-middle ms-1 d-inline-block"></i>
                                        </a>
                                        <ul class="dropdown-menu dropdown-menu-end" role="menu">
                                            <li><a class="dropdown-item" href="javascript:void(0);">New</a></li>
                                            <li><a class="dropdown-item" href="javascript:void(0);">Popular</a></li>
                                            <li><a class="dropdown-item" href="javascript:void(0);">Relevant</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body pt-0">
                                <div class="table-responsive">
                                    <table class="table text-nowrap table-bordered custom-orders">
                                        <thead>
                                            <tr>
                                                <th scope="col">Order Id</th>
                                                <th scope="col">Product Title</th>
                                                <th scope="col">Category</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Price</th>
                                                <th scope="col">Ordered Date</th>
                                                <th scope="col">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <span class="fw-medium">#42A5689</span>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <div class="me-2 lh-1">
                                                            <span class="avatar avatar-sm">
                                                                <img :src="`/backend/assets/images/ecommerce/jpg/6.jpg`" alt="">
                                                            </span>
                                                        </div>
                                                        <div class="fs-14">Wood Handled Flower Pot</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span class="fw-medium">Home Decoration</span>
                                                </td>
                                                <td>
                                                    <span class="badge bg-primary-transparent">Delivered</span>
                                                </td>
                                                <td class="fw-medium">
                                                    $999.00
                                                </td>
                                                <td>
                                                    <span class="">24th Jul,24</span>
                                                </td>
                                                <td>
                                                    <div class="btn-list">
                                                        <button class="btn btn-sm btn-icon btn-primary-light" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit"><i class="ri-pencil-line lh-1 align-middle"></i></button>
                                                        <button class="btn btn-sm btn-icon btn-danger-light" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete"><i class="ri-delete-bin-line lh-1 align-middle"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span class="fw-medium">#875J789</span>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <div class="me-2 lh-1">
                                                            <span class="avatar avatar-sm">
                                                                <img :src="`/backend/assets/images/ecommerce/jpg/1.jpg`" alt="">
                                                            </span>
                                                        </div>
                                                        <div class="fs-14">Samsung Galaxy Headset</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span class="fw-medium">Electronics</span>
                                                </td>
                                                <td>
                                                    <span class="badge bg-info-transparent">Shipped</span>
                                                </td>
                                                <td class="fw-medium">
                                                    $897.69
                                                </td>
                                                <td>
                                                    <span class="">08th Aug,24</span>
                                                </td>
                                                <td>
                                                    <div class="btn-list">
                                                        <button class="btn btn-sm btn-icon btn-primary-light" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit"><i class="ri-pencil-line lh-1 align-middle"></i></button>
                                                        <button class="btn btn-sm btn-icon btn-danger-light" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete"><i class="ri-delete-bin-line lh-1 align-middle"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span class="fw-medium">#37T8746L</span>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <div class="me-2 lh-1">
                                                            <span class="avatar avatar-sm">
                                                                <img :src="`/backend/assets/images/ecommerce/jpg/2.jpg`" alt="">
                                                            </span>
                                                        </div>
                                                        <div class="fs-14">Little Pro Kids Backpack</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span class="fw-medium">Kids' Fashion</span>
                                                </td>
                                                <td>
                                                    <span class="badge bg-danger-transparent">Cancelled</span>
                                                </td>
                                                <td class="fw-medium">
                                                    $688.00
                                                </td>
                                                <td>
                                                    <span class="">19th May,24</span>
                                                </td>
                                                <td>
                                                    <div class="btn-list">
                                                        <button class="btn btn-sm btn-icon btn-primary-light" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit"><i class="ri-pencil-line lh-1 align-middle"></i></button>
                                                        <button class="btn btn-sm btn-icon btn-danger-light" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete"><i class="ri-delete-bin-line lh-1 align-middle"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span class="fw-medium">#589Y324</span>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <div class="me-2 lh-1">
                                                            <span class="avatar avatar-sm">
                                                                <img :src="`/backend/assets/images/ecommerce/jpg/3.jpg`" alt="">
                                                            </span>
                                                        </div>
                                                        <div class="fs-14">Altra Pro max Camera</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span class="fw-medium">Electronics</span>
                                                </td>
                                                <td>
                                                    <span class="badge bg-warning-transparent">Pending</span>
                                                </td>
                                                <td class="fw-medium">
                                                    $599.09
                                                </td>
                                                <td>
                                                    <span class=""> 02th Aug,24</span>
                                                </td>
                                                <td>
                                                    <div class="btn-list">
                                                        <button class="btn btn-sm btn-icon btn-primary-light" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit"><i class="ri-pencil-line lh-1 align-middle"></i></button>
                                                        <button class="btn btn-sm btn-icon btn-danger-light" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete"><i class="ri-delete-bin-line lh-1 align-middle"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span class="fw-medium">#66T7845</span>
                                                </td>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <div class="me-2 lh-1">
                                                            <span class="avatar avatar-sm">
                                                                <img :src="`/backend/assets/images/ecommerce/jpg/4.jpg`" alt="">
                                                            </span>
                                                        </div>
                                                        <div class="fs-14">Stunning 120ram Laptop</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span class="fw-medium">Electronics</span>
                                                </td>
                                                <td>
                                                    <span class="badge bg-primary-transparent">Returned</span>
                                                </td>
                                                <td class="fw-medium">
                                                    $245.99
                                                </td>
                                                <td>
                                                    <span class="">05th Sep,24</span>
                                                </td>
                                                <td>
                                                    <div class="btn-list">
                                                        <button class="btn btn-sm btn-icon btn-primary-light" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit"><i class="ri-pencil-line lh-1 align-middle"></i></button>
                                                        <button class="btn btn-sm btn-icon btn-danger-light" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete"><i class="ri-delete-bin-line lh-1 align-middle"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="card-footer border-top-0">
                                <div class="d-flex align-items-center">
                                    <div>
                                        Showing 5 Entries <i class="bi bi-arrow-right ms-2 fw-semibold"></i>
                                    </div>
                                    <div class="ms-auto">
                                        <nav aria-label="Page navigation" class="pagination-style-4">
                                            <ul class="pagination mb-0">
                                                <li class="page-item disabled">
                                                    <a class="page-link" href="javascript:void(0);">
                                                        Prev
                                                    </a>
                                                </li>
                                                <li class="page-item active"><a class="page-link" href="javascript:void(0);">1</a></li>
                                                <li class="page-item"><a class="page-link" href="javascript:void(0);">2</a></li>
                                                <li class="page-item">
                                                    <a class="page-link text-primary" href="javascript:void(0);">
                                                        next
                                                    </a>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- End:: row-3 -->
    </div>
</template>

