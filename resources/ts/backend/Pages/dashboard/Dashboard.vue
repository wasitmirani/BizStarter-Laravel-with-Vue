<template>
    <div class="page-title-head">
        <h4 class="page-main-title">eCommerce</h4>

        <div class="hidden items-center gap-1.25 text-sm md:flex">
            <a href="#" class="text-sm">Paces</a>

            <i class="iconify tabler--chevron-right text-sm rtl:rotate-180"></i>

            <a href="#" class="text-sm">Dashboard</a>

            <i class="iconify tabler--chevron-right text-sm rtl:rotate-180"></i>

            <a href="#" class="text-default-400 text-sm" aria-current="page">eCommerce</a>
        </div>
    </div>
    <div class="container-fluid">
        <div class="grid xl:grid-cols-12 grid-cols-1 gap-base mb-base">
            <div class="xl:col-span-5">
                <div class="grid md:grid-cols-2 grid-cols-1 gap-base h-full">
                    <div class="card h-full overflow-hidden">
                        <div class="card-body pb-0">
                            <div class="flex justify-between items-center">
                                <div class="overflow-hidden">
                                    <h3 class="font-normal text-xl mb-2">
                                        <span class="text-default-400 text-sm uppercase font-medium">Good
                                            Day,</span>
                                        <br>
                                        <b>David Dev!</b>
                                    </h3>
                                </div>
                                <div class="text-end">
                                    <img class="xl:block hidden" :src="`/backend/backend/images/svg/email-campaign.svg`"
                                        width="110" alt="Generic placeholder image">
                                </div>
                            </div>
                        </div>

                        <div class="card-body p-2.5 flex items-center bg-light/50 overflow-hidden">
                            <p class="flex items-center justify-between w-full">
                                <span class="flex items-center gap-1.25">
                                    <i class="iconify tabler--calendar align-middle text-md"></i>
                                    <span class="ms-1 font-semibold">
                                        22
                                    </span>
                                </span>

                                <span class="flex items-center gap-1.25">
                                    <i class="iconify tabler--clock align-middle text-md"></i>
                                    <span class="font-semibold" id="clock-widget">9:44:22 AM</span>
                                </span>
                            </p>
                        </div>
                    </div>

                    <div class="card h-full">
                        <div class="card-body">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h5 class="text-default-400 text-sm uppercase mb-2 font-medium"
                                        title="Number of Orders">Orders</h5>
                                    <h3 class="my-5 py-1.25 font-semibold text-xl"><span
                                            data-target="9,754">9,754</span></h3>
                                    <p class="text-default-400 text-sm flex items-center gap-3.25">
                                        <span class="text-danger flex items-center gap-1"><i
                                                class="iconify tabler--arrow-down"></i> 1.89%</span>
                                        <span>Since last month</span>
                                    </p>
                                </div>

                                <div>
                                    <div
                                        class="size-9 bg-primary/15 text-primary rounded-full flex justify-center items-center">
                                        <i class="iconify tabler--shopping-cart size-5.5"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card h-full">
                        <div class="card-body">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h5 class="text-default-400 text-sm uppercase mb-2 font-medium"
                                        title="Average Revenue">Revenue</h5>
                                    <h3 class="my-5 py-1.25 font-semibold text-xl">$<span
                                            data-target="75.21">75.21</span>k</h3>
                                    <p class="text-default-400 text-sm flex items-center gap-3.25">
                                        <span class="text-danger flex items-center gap-1"><i
                                                class="iconify tabler--arrow-down"></i>5.23%</span>
                                        <span>Since last month</span>
                                    </p>
                                </div>

                                <div>
                                    <div
                                        class="size-9 bg-primary/15 text-primary rounded-full flex justify-center items-center">
                                        <i class="iconify tabler--pig-money size-5.5"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card h-full">
                        <div class="card-body">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h5 class="text-default-400 text-sm uppercase mb-2 font-medium" title="Growth">
                                        Growth</h5>
                                    <h3 class="my-5 py-1.25 font-semibold text-xl">+ <span
                                            data-target="25.08">25.08</span>%</h3>
                                    <p class="text-default-400 text-sm flex items-center gap-3.25">
                                        <span class="text-success flex items-center gap-1"><i
                                                class="iconify tabler--arrow-up"></i>4.87%</span>
                                        <span>Since last month</span>
                                    </p>
                                </div>

                                <div>
                                    <div
                                        class="size-9 bg-primary/15 text-primary rounded-full flex justify-center items-center">
                                        <i class="iconify tabler--trending-up size-5.5"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="xl:col-span-7">
                <div class="grid md:grid-cols-2 grid-cols-1 gap-base h-full">
                    <div class="card h-full">
                        <div class="card-header">
                            <h4 class="card-title">Store Performance Analytics</h4>
                            <div>
                                <a href="#"
                                    class="btn btn-sm border-default-300 hover:border-default-400 text-default-800 font-semibold">
                                    <i class="iconify tabler--refresh"></i> Refresh </a>
                            </div>
                        </div>

                        <div class="card-body">
                            <div>
                                <div id="total-sales-chart" class="apex-charts"></div>
                            </div>

                            <div class="text-center mb-1.25">
                                <span
                                    class="badge border border-default-300 text-dark p-1.25 px-2.5 rounded-full text-xs">
                                    <i class="iconify tabler--star-filled text-danger me-1"></i> POOR SALES
                                </span>
                            </div>
                        </div>
                        <!-- end card-body-->
                    </div>

                    <div class="card h-full">
                        <div class="card-header">
                            <h4 class="card-title">Weekly Performance Insights</h4>

                            <div class="hs-dropdown [--placement:bottom-right] ms-auto">
                                <a href="#"
                                    class="hs-dropdown-toggle btn btn-sm btn-icon border-default-300 hover:text-primary">
                                    <i class="iconify tabler--dots-vertical text-base"></i>
                                </a>

                                <ul class="hs-dropdown-menu">
                                    <li>
                                        <a class="dropdown-item" href="#"> <i class="iconify tabler--refresh"></i>
                                            Refresh Data </a>
                                    </li>

                                    <li>
                                        <a class="dropdown-item" href="#"> <i class="iconify tabler--download"></i>
                                            Download Report </a>
                                    </li>

                                    <li>
                                        <a class="dropdown-item" href="#"> <i class="iconify tabler--share"></i> Share
                                            Insights </a>
                                    </li>

                                    <li>
                                        <hr class="dropdown-divider">
                                    </li>

                                    <li>
                                        <a class="dropdown-item text-danger" href="#"> <i
                                                class="iconify tabler--archive"></i> Archive Widget </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="card-body">
                            <div>
                                <div id="weekly-performance-chart" class="apex-charts"></div>
                            </div>
                        </div>
                        <!-- end card-body-->
                    </div>
                </div>
            </div>
        </div>

        <div class="grid xl:grid-cols-2 grid-cols-1 gap-base mb-base">
            <div class="card h-full">
                <div class="card-header md:py-0 pt-6 pb-0">
                    <h4 class="card-title">Sales Report<span class="text-default-400 text-sm font-normal ms-1">(25822
                            Orders)</span></h4>

                    <div>
                        <nav class="flex gap-x-1" aria-label="Tabs" role="tablist" aria-orientation="horizontal">
                            <button type="button"
                                class="hs-tab-active:font-semibold hs-tab-active:border-primary hs-tab-active:text-primary md:py-4.25 py-3 px-4 inline-flex items-center border-b border-transparent text-sm whitespace-nowrap hover:text-primary focus:outline-hidden focus:text-primary disabled:opacity-50 disabled:pointer-events-none"
                                id="today" aria-selected="true" data-hs-tab="#today-tab" aria-controls="today-tab"
                                role="tab">
                                Today
                            </button>

                            <button type="button"
                                class="hs-tab-active:font-semibold hs-tab-active:border-primary hs-tab-active:text-primary md:py-4.25 py-3 px-4 inline-flex items-center border-b border-transparent text-sm whitespace-nowrap hover:text-primary focus:outline-hidden focus:text-primary disabled:opacity-50 disabled:pointer-events-none active"
                                id="monthly" aria-selected="false" data-hs-tab="#monthly-tab"
                                aria-controls="monthly-tab" role="tab">
                                Monthly
                            </button>

                            <button type="button"
                                class="hs-tab-active:font-semibold hs-tab-active:border-primary hs-tab-active:text-primary md:py-4.25 py-3 px-4 inline-flex items-center border-b border-transparent text-sm whitespace-nowrap hover:text-primary focus:outline-hidden focus:text-primary disabled:opacity-50 disabled:pointer-events-none"
                                id="annual" aria-selected="false" data-hs-tab="#annual-atb" aria-controls="annual-atb"
                                role="tab">
                                Annual
                            </button>
                        </nav>
                    </div>
                </div>

                <div>
                    <div class="bg-light/25 border-b border-default-300 border-dashed">
                        <div class="grid md:grid-cols-3 grid-cols-2 md:gap-base text-center">
                            <div>
                                <p class="text-default-400 mt-5 mb-1.25">Revenue</p>
                                <h4 class="flex justify-center items-center mb-4 text-lg font-semibold">
                                    <i class="iconify tabler--wallet text-success me-2"></i>
                                    <span>$<span data-target="78,224.68">78,224.68</span></span>
                                </h4>
                            </div>

                            <div>
                                <p class="text-default-400 mt-5 mb-1.25">Orders</p>
                                <h4 class="flex justify-center items-center mb-4 text-lg font-semibold">
                                    <i class="iconify tabler--basket text-success me-2"></i>
                                    <span><span data-target="8541">8,541</span></span>
                                </h4>
                            </div>

                            <div>
                                <p class="text-default-400 mt-5 mb-1.25">Growth Rate</p>
                                <h4 class="flex justify-center items-center mb-4 text-lg font-semibold">
                                    <i class="iconify tabler--trending-up text-success me-2"></i>
                                    <span><span data-target="25.3">25.30</span>%</span>
                                </h4>
                            </div>
                        </div>
                    </div>

                    <div class="p-5 pt-1.25 relative">
                        <div class="absolute text-start start-2/25 p-5 z-10 max-w-87.5 hidden md:block">
                            <h5 class="text-sm mb-2">Today's Earning: $8,975.30</h5>
                            <p class="text-default-400 mt-2">Property PS007 is not receiving hits. Either
                                your site is not receiving any sessions.</p>
                        </div>
                        <div>
                            <div id="sales-report-chart" class="apex-charts"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div data-table="" data-table-rows-per-page="6" class="card h-full">
                <div class="card-header">
                    <h4 class="card-title">Top Selling Products</h4>

                    <div>
                        <a href="#" class="btn btn-sm border-default-300 hover:border-default-400 font-semibold"> <i
                                class="iconify tabler--cloud-upload"></i> Export </a>

                        <a href="#" class="btn btn-sm bg-light hover:text-primary font-semibold"><i
                                class="iconify tabler--download"></i> Import</a>
                    </div>
                </div>

                <div class="card-body p-0">
                    <div class="table-responsive overflow-x-auto">
                        <table class="table table-hover whitespace-nowrap w-full">
                            <tbody class="text-nowrap">
                                <!-- Record 1 -->
                                <tr>
                                    <td style="width: 60px">
                                        <img :src="`/backend/backend/images/products/1.png`" alt="product-pic"
                                            class="h-9 max-w-fit">
                                    </td>
                                    <td>
                                        <h5>Modern Fabric Sofa Set</h5>
                                        <span class="text-default-400 text-xs">By: Homeluxe</span>
                                    </td>
                                    <td>
                                        <h5>$499.00</h5>
                                        <span class="text-default-400 text-xs">Price</span>
                                    </td>
                                    <td>
                                        <h5>34</h5>
                                        <span class="text-default-400 text-xs">Quantity</span>
                                    </td>
                                    <td>
                                        <h5>$16,966.00</h5>
                                        <span class="text-default-400 text-xs">Amount</span>
                                    </td>
                                    <td>
                                        <span
                                            class="badge bg-warning/15 text-warning px-2.5 py-1.25 rounded-full text-xs">
                                            Low Stock </span>
                                    </td>
                                </tr>

                                <!-- Record 2 -->
                                <tr>
                                    <td style="width: 60px">
                                        <img :src="`/backend/backend/images/products/2.png`" alt="product-pic"
                                            class="h-9 max-w-fit">
                                    </td>
                                    <td>
                                        <h5>L-Shaped Sectional Sofa</h5>
                                        <span class="text-default-400 text-xs">By: ComfortHub</span>
                                    </td>
                                    <td>
                                        <h5>$899.00</h5>
                                        <span class="text-default-400 text-xs">Price</span>
                                    </td>
                                    <td>
                                        <h5>21</h5>
                                        <span class="text-default-400 text-xs">Quantity</span>
                                    </td>
                                    <td>
                                        <h5>$18,879.00</h5>
                                        <span class="text-default-400 text-xs">Amount</span>
                                    </td>
                                    <td>
                                        <span
                                            class="badge bg-success/15 text-success px-2.5 py-1.25 rounded-full text-xs">
                                            In Stock </span>
                                    </td>
                                </tr>

                                <!-- Record 3 -->
                                <tr>
                                    <td style="width: 60px">
                                        <img :src="`/backend/backend/images/products/3.png`" alt="product-pic"
                                            class="h-9 max-w-fit">
                                    </td>
                                    <td>
                                        <h5>Velvet Recliner Chair</h5>
                                        <span class="text-default-400 text-xs">By: SoftEase</span>
                                    </td>
                                    <td>
                                        <h5>$379.00</h5>
                                        <span class="text-default-400 text-xs">Price</span>
                                    </td>
                                    <td>
                                        <h5>47</h5>
                                        <span class="text-default-400 text-xs">Quantity</span>
                                    </td>
                                    <td>
                                        <h5>$17,813.00</h5>
                                        <span class="text-default-400 text-xs">Amount</span>
                                    </td>
                                    <td>
                                        <span
                                            class="badge bg-success/15 text-success px-2.5 py-1.25 rounded-full text-xs">
                                            In Stock </span>
                                    </td>
                                </tr>

                                <!-- Record 4 -->
                                <tr>
                                    <td style="width: 60px">
                                        <img :src="`/backend/backend/images/products/4.png`" alt="product-pic"
                                            class="h-9 max-w-fit">
                                    </td>
                                    <td>
                                        <h5>Classic Wooden Coffee Table</h5>
                                        <span class="text-default-400 text-xs">By: OakCraft</span>
                                    </td>
                                    <td>
                                        <h5>$259.00</h5>
                                        <span class="text-default-400 text-xs">Price</span>
                                    </td>
                                    <td>
                                        <h5>58</h5>
                                        <span class="text-default-400 text-xs">Quantity</span>
                                    </td>
                                    <td>
                                        <h5>$15,022.00</h5>
                                        <span class="text-default-400 text-xs">Amount</span>
                                    </td>
                                    <td>
                                        <span
                                            class="badge bg-danger/15 text-danger px-2.5 py-1.25 rounded-full text-xs">
                                            Out of Stock </span>
                                    </td>
                                </tr>

                                <!-- Record 5 -->
                                <tr>
                                    <td style="width: 60px">
                                        <img :src="`/backend/backend/images/products/5.png`" alt="product-pic"
                                            class="h-9 max-w-fit">
                                    </td>
                                    <td>
                                        <h5>Minimalist TV Stand</h5>
                                        <span class="text-default-400 text-xs">By: FurniPro</span>
                                    </td>
                                    <td>
                                        <h5>$315.00</h5>
                                        <span class="text-default-400 text-xs">Price</span>
                                    </td>
                                    <td>
                                        <h5>64</h5>
                                        <span class="text-default-400 text-xs">Quantity</span>
                                    </td>
                                    <td>
                                        <h5>$20,160.00</h5>
                                        <span class="text-default-400 text-xs">Amount</span>
                                    </td>
                                    <td>
                                        <span
                                            class="badge bg-success/15 text-success px-2.5 py-1.25 rounded-full text-xs">
                                            In Stock </span>
                                    </td>
                                </tr>

                                <!-- Record 6 -->
                                <tr>
                                    <td style="width: 60px">
                                        <img :src="`/backend/backend/images/products/6.png`" alt="product-pic"
                                            class="h-9 max-w-fit">
                                    </td>
                                    <td>
                                        <h5>Leather Lounge Chair</h5>
                                        <span class="text-default-400 text-xs">By: UrbanStyle</span>
                                    </td>
                                    <td>
                                        <h5>$425.00</h5>
                                        <span class="text-default-400 text-xs">Price</span>
                                    </td>
                                    <td>
                                        <h5>39</h5>
                                        <span class="text-default-400 text-xs">Quantity</span>
                                    </td>
                                    <td>
                                        <h5>$16,575.00</h5>
                                        <span class="text-default-400 text-xs">Amount</span>
                                    </td>
                                    <td>
                                        <span
                                            class="badge bg-warning/15 text-warning px-2.5 py-1.25 rounded-full text-xs">
                                            Low Stock </span>
                                    </td>
                                </tr>

                                <!-- Record 7 -->
                                <tr>
                                    <td style="width: 60px">
                                        <img :src="`/backend/backend/images/products/7.png`" alt="product-pic"
                                            class="h-9 max-w-fit">
                                    </td>
                                    <td>
                                        <h5>Glass Center Table</h5>
                                        <span class="text-default-400 text-xs">By: CrystalCasa</span>
                                    </td>
                                    <td>
                                        <h5>$289.00</h5>
                                        <span class="text-default-400 text-xs">Price</span>
                                    </td>
                                    <td>
                                        <h5>52</h5>
                                        <span class="text-default-400 text-xs">Quantity</span>
                                    </td>
                                    <td>
                                        <h5>$15,028.00</h5>
                                        <span class="text-default-400 text-xs">Amount</span>
                                    </td>
                                    <td>
                                        <span
                                            class="badge bg-success/15 text-success px-2.5 py-1.25 rounded-full text-xs">
                                            In Stock </span>
                                    </td>
                                </tr>

                                <!-- Record 8 -->
                                <tr>
                                    <td style="width: 60px">
                                        <img :src="`/backend/backend/images/products/8.png`" alt="product-pic"
                                            class="h-9 max-w-fit">
                                    </td>
                                    <td>
                                        <h5>Wooden Bookshelf Unit</h5>
                                        <span class="text-default-400 text-xs">By: TimberWorks</span>
                                    </td>
                                    <td>
                                        <h5>$349.00</h5>
                                        <span class="text-default-400 text-xs">Price</span>
                                    </td>
                                    <td>
                                        <h5>28</h5>
                                        <span class="text-default-400 text-xs">Quantity</span>
                                    </td>
                                    <td>
                                        <h5>$9,772.00</h5>
                                        <span class="text-default-400 text-xs">Amount</span>
                                    </td>
                                    <td>
                                        <span
                                            class="badge bg-warning/15 text-warning px-2.5 py-1.25 rounded-full text-xs">
                                            Low Stock </span>
                                    </td>
                                </tr>

                                <!-- Record 9 -->
                                <tr>
                                    <td style="width: 60px">
                                        <img :src="`/backend/backend/images/products/9.png`" alt="product-pic"
                                            class="h-9 max-w-fit">
                                    </td>
                                    <td>
                                        <h5>Luxury King Bed Frame</h5>
                                        <span class="text-default-400 text-xs">By: DreamRest</span>
                                    </td>
                                    <td>
                                        <h5>$1,099.00</h5>
                                        <span class="text-default-400 text-xs">Price</span>
                                    </td>
                                    <td>
                                        <h5>15</h5>
                                        <span class="text-default-400 text-xs">Quantity</span>
                                    </td>
                                    <td>
                                        <h5>$16,485.00</h5>
                                        <span class="text-default-400 text-xs">Amount</span>
                                    </td>
                                    <td>
                                        <span
                                            class="badge bg-danger/15 text-danger px-2.5 py-1.25 rounded-full text-xs">
                                            Out of Stock </span>
                                    </td>
                                </tr>

                                <!-- Record 10 -->
                                <tr>
                                    <td style="width: 60px">
                                        <img :src="`/backend/backend/images/products/10.png`" alt="product-pic"
                                            class="h-9 max-w-fit">
                                    </td>
                                    <td>
                                        <h5>Round Dining Table Set</h5>
                                        <span class="text-default-400 text-xs">By: CasaDine</span>
                                    </td>
                                    <td>
                                        <h5>$725.00</h5>
                                        <span class="text-default-400 text-xs">Price</span>
                                    </td>
                                    <td>
                                        <h5>25</h5>
                                        <span class="text-default-400 text-xs">Quantity</span>
                                    </td>
                                    <td>
                                        <h5>$18,125.00</h5>
                                        <span class="text-default-400 text-xs">Amount</span>
                                    </td>
                                    <td>
                                        <span
                                            class="badge bg-success/15 text-success px-2.5 py-1.25 rounded-full text-xs">
                                            In Stock </span>
                                    </td>
                                </tr>

                                <!-- Record 11 -->
                                <tr>
                                    <td style="width: 60px">
                                        <img :src="`/backend/backend/images/products/2.png`" alt="product-pic"
                                            class="h-9 max-w-fit">
                                    </td>
                                    <td>
                                        <h5>Ergonomic Office Chair</h5>
                                        <span class="text-default-400 text-xs">By: WorkEase</span>
                                    </td>
                                    <td>
                                        <h5>$269.00</h5>
                                        <span class="text-default-400 text-xs">Price</span>
                                    </td>
                                    <td>
                                        <h5>44</h5>
                                        <span class="text-default-400 text-xs">Quantity</span>
                                    </td>
                                    <td>
                                        <h5>$11,836.00</h5>
                                        <span class="text-default-400 text-xs">Amount</span>
                                    </td>
                                    <td>
                                        <span
                                            class="badge bg-success/15 text-success px-2.5 py-1.25 rounded-full text-xs">
                                            In Stock </span>
                                    </td>
                                </tr>

                                <!-- Record 12 -->
                                <tr>
                                    <td style="width: 60px">
                                        <img :src="`/backend/backend/images/products/5.png`" alt="product-pic"
                                            class="h-9 max-w-fit">
                                    </td>
                                    <td>
                                        <h5>Nightstand with Drawers</h5>
                                        <span class="text-default-400 text-xs">By: CozyHome</span>
                                    </td>
                                    <td>
                                        <h5>$189.00</h5>
                                        <span class="text-default-400 text-xs">Price</span>
                                    </td>
                                    <td>
                                        <h5>53</h5>
                                        <span class="text-default-400 text-xs">Quantity</span>
                                    </td>
                                    <td>
                                        <h5>$10,017.00</h5>
                                        <span class="text-default-400 text-xs">Amount</span>
                                    </td>
                                    <td>
                                        <span
                                            class="badge bg-warning/15 text-warning px-2.5 py-1.25 rounded-full text-xs">
                                            Low Stock </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- end table-respo.-->
                </div>
                <!-- end card-body-->

                <div class="card-footer">
                    <div data-table-pagination-info="products"></div>
                    <div data-table-pagination=""></div>
                </div>
            </div>
        </div>

        <div class="grid xl:grid-cols-12 grid-cols-1 gap-base">
            <div class="xl:col-span-5">
                <div data-table="" data-table-rows-per-page="5" class="card h-full">
                    <div class="card-header">
                        <h4 class="card-title">Recent Orders <span
                                class="text-default-400 text-sm font-normal ms-1">(186.25k
                                Transactions)</span></h4>
                        <div>
                            <a href="#" class="btn btn-sm border-default-300 hover:border-default-400 font-semibold">
                                <i class="iconify tabler--cloud-upload"></i> Export </a>

                            <a href="#" class="btn btn-sm bg-light hover:text-primary font-semibold"> <i
                                    class="iconify tabler--download"></i> Import </a>
                        </div>
                    </div>

                    <div class="card-body p-0">
                        <div class="table-responsive overflow-x-auto">
                            <table class="table table-hover whitespace-nowrap w-full">
                                <thead class="bg-light/25 thead-sm text-2xs">
                                    <tr class="uppercase text-2xs">
                                        <th data-table-sort="">#ID</th>
                                        <th data-table-sort="">Customer</th>
                                        <th data-table-sort="">Date</th>
                                        <th data-table-sort="">Amount</th>
                                        <th data-table-sort="">Payment</th>
                                        <th data-table-sort="">Status</th>
                                    </tr>
                                </thead>

                                <tbody class="text-nowrap">
                                    <!-- Order 1 -->
                                    <tr>
                                        <td>#ORD-1023</td>
                                        <td>
                                            <h5 class="font-semibold">John Carter</h5>
                                            <span class="text-default-400 text-xs">john@example.com</span>
                                        </td>
                                        <td>12 Nov 2025</td>
                                        <td>$249.00</td>
                                        <td>Credit Card</td>
                                        <td>
                                            <span class="badge bg-success/15 text-success"> Completed
                                            </span>
                                        </td>
                                    </tr>

                                    <!-- Order 2 -->
                                    <tr>
                                        <td>#ORD-1022</td>
                                        <td>
                                            <h5 class="font-semibold">Emma Wilson</h5>
                                            <span class="text-default-400 text-xs">emma@example.com</span>
                                        </td>
                                        <td>12 Nov 2025</td>
                                        <td>$179.00</td>
                                        <td>UPI</td>
                                        <td>
                                            <span class="badge bg-warning/15 text-warning"> Pending </span>
                                        </td>
                                    </tr>

                                    <!-- Order 3 -->
                                    <tr>
                                        <td>#ORD-1021</td>
                                        <td>
                                            <h5 class="font-semibold">Michael Harris</h5>
                                            <span class="text-default-400 text-xs">michael@example.com</span>
                                        </td>
                                        <td>11 Nov 2025</td>
                                        <td>$329.00</td>
                                        <td>PayPal</td>
                                        <td>
                                            <span class="badge bg-success/15 text-success"> Completed
                                            </span>
                                        </td>
                                    </tr>

                                    <!-- Order 4 -->
                                    <tr>
                                        <td>#ORD-1020</td>
                                        <td>
                                            <h5 class="font-semibold">Sophia Turner</h5>
                                            <span class="text-default-400 text-xs">sophia@example.com</span>
                                        </td>
                                        <td>11 Nov 2025</td>
                                        <td>$125.00</td>
                                        <td>Debit Card</td>
                                        <td>
                                            <span class="badge bg-danger/15 text-danger"> Cancelled </span>
                                        </td>
                                    </tr>

                                    <!-- Order 5 -->
                                    <tr>
                                        <td>#ORD-1019</td>
                                        <td>
                                            <h5 class="font-semibold">Chris Evans</h5>
                                            <span class="text-default-400 text-xs">chris@example.com</span>
                                        </td>
                                        <td>10 Nov 2025</td>
                                        <td>$560.00</td>
                                        <td>Credit Card</td>
                                        <td>
                                            <span class="badge bg-success/15 text-success"> Completed
                                            </span>
                                        </td>
                                    </tr>

                                    <!-- Order 6 -->
                                    <tr>
                                        <td>#ORD-1018</td>
                                        <td>
                                            <h5 class="font-semibold">Ava Mitchell</h5>
                                            <span class="text-default-400 text-xs">ava@example.com</span>
                                        </td>
                                        <td>10 Nov 2025</td>
                                        <td>$98.00</td>
                                        <td>Cash</td>
                                        <td>
                                            <span class="badge bg-warning/15 text-warning"> Pending </span>
                                        </td>
                                    </tr>

                                    <!-- Order 7 -->
                                    <tr>
                                        <td>#ORD-1017</td>
                                        <td>
                                            <h5 class="font-semibold">Liam Parker</h5>
                                            <span class="text-default-400 text-xs">liam@example.com</span>
                                        </td>
                                        <td>09 Nov 2025</td>
                                        <td>$412.00</td>
                                        <td>Net Banking</td>
                                        <td>
                                            <span class="badge bg-success/15 text-success"> Completed
                                            </span>
                                        </td>
                                    </tr>

                                    <!-- Order 8 -->
                                    <tr>
                                        <td>#ORD-1016</td>
                                        <td>
                                            <h5 class="font-semibold">Isabella Rose</h5>
                                            <span class="text-default-400 text-xs">isabella@example.com</span>
                                        </td>
                                        <td>09 Nov 2025</td>
                                        <td>$255.00</td>
                                        <td>Credit Card</td>
                                        <td>
                                            <span class="badge bg-danger/15 text-danger"> Failed </span>
                                        </td>
                                    </tr>

                                    <!-- Order 9 -->
                                    <tr>
                                        <td>#ORD-1015</td>
                                        <td>
                                            <h5 class="font-semibold">Oliver Brown</h5>
                                            <span class="text-default-400 text-xs">oliver@example.com</span>
                                        </td>
                                        <td>08 Nov 2025</td>
                                        <td>$720.00</td>
                                        <td>UPI</td>
                                        <td>
                                            <span class="badge bg-success/15 text-success"> Completed
                                            </span>
                                        </td>
                                    </tr>

                                    <!-- Order 10 -->
                                    <tr>
                                        <td>#ORD-1014</td>
                                        <td>
                                            <h5 class="font-semibold">Charlotte Green</h5>
                                            <span class="text-default-400 text-xs">charlotte@example.com</span>
                                        </td>
                                        <td>08 Nov 2025</td>
                                        <td>$138.00</td>
                                        <td>PayPal</td>
                                        <td>
                                            <span class="badge bg-warning/15 text-warning"> Pending </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="card-footer">
                        <div data-table-pagination-info="orders"></div>
                        <div data-table-pagination=""></div>
                    </div>
                </div>
            </div>

            <div class="xl:col-span-7">
                <div class="grid xl:grid-cols-2 grid-cols-1 gap-base h-full">
                    <div class="card h-full">
                        <div class="card-header">
                            <h4 class="card-title">Revenue By Locations</h4>
                            <div class="hs-dropdown [--placement:bottom-right] ms-auto">
                                <a href="#!"
                                    class="hs-dropdown-toggle btn btn-sm btn-icon border-default-300 hover:text-primary">
                                    <i class="iconify tabler--dots-vertical text-base"></i>
                                </a>

                                <ul class="hs-dropdown-menu">
                                    <li>
                                        <a class="dropdown-item" href="#"> <i class="iconify tabler--map"></i>View Full
                                            Map</a>
                                    </li>

                                    <li>
                                        <a class="dropdown-item" href="#"> <i class="iconify tabler--download"></i>
                                            Export Revenue Data
                                        </a>
                                    </li>

                                    <li>
                                        <a class="dropdown-item" href="#"> <i class="iconify tabler--filter-2"></i>
                                            Filter By Region </a>
                                    </li>

                                    <li>
                                        <hr class="dropdown-divider">
                                    </li>

                                    <li>
                                        <a class="dropdown-item text-danger" href="#"> <i
                                                class="iconify tabler--trash"></i> Remove Widget </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="card-body pt-1.25">
                            <div id="revenue-by-location" style="height: 206px" width="418"></div>

                            <div class="mt-5">
                                <div class="p-2.5 mb-base border border-dashed border-default-300 rounded">
                                    <div class="md:flex items-center md:justify-between gap-2.5">
                                        <div class="flex items-center gap-2.5">
                                            <div>
                                                <div
                                                    class="size-12 flex justify-center items-center rounded-full bg-warning/15 text-warning">
                                                    <i class="iconify tabler--medal size-7"></i>
                                                </div>
                                            </div>

                                            <div>
                                                <h5 class="text-md font-semibold">Congratulations !...</h5>
                                                <p class="text-sm text-default-400">You've just hit a new
                                                    record..</p>
                                            </div>
                                        </div>

                                        <div class="ms-auto">
                                            <h4 class="mt-1.25 font-semibold text-end text-base">25.9k</h4>
                                            <span class="text-default-400 font-semibold text-xs uppercase">Order</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex items-center mb-2.5 gap-2.5">
                                    <i class="iconify tabler--circle text-info text-md"></i>
                                    <div>United States</div>
                                    <p class="ms-auto"><span class="font-semibold">$48.6k</span> <span
                                            class="text-default-400">Revenue</span></p>
                                </div>

                                <div class="flex items-center mb-2.5 gap-2.5">
                                    <i class="iconify tabler--circle text-primary text-md"></i>
                                    <div>United Kingdom</div>
                                    <p class="ms-auto"><span class="font-semibold">$26.4k</span> <span
                                            class="text-default-400">Revenue</span></p>
                                </div>

                                <div class="flex items-center gap-2.5">
                                    <i class="iconify tabler--circle text-secondary text-md"></i>
                                    <div>Australia</div>
                                    <p class="ms-auto"><span class="font-semibold">$18.9k</span> <span
                                            class="text-default-400">Revenue</span></p>
                                </div>
                            </div>
                        </div>
                        <!-- end card-body-->
                    </div>

                    <div class="card h-full">
                        <div class="card-header">
                            <h4 class="card-title">Recent Activity</h4>
                            <div class="hs-dropdown [--placement:bottom-right] ms-auto">
                                <a href="#!"
                                    class="hs-dropdown-toggle btn btn-sm btn-icon border-default-300 hover:text-primary">
                                    <i class="iconify tabler--dots-vertical text-base"></i>
                                </a>

                                <ul class="hs-dropdown-menu">
                                    <li>
                                        <a class="dropdown-item" href="#"> <i class="iconify tabler--activity"></i>View
                                            Activity Log</a>
                                    </li>
                                    <li>
                                        <a class="dropdown-item" href="#"> <i
                                                class="iconify tabler--filter-2"></i>Filter Activities</a>
                                    </li>
                                    <li>
                                        <a class="dropdown-item" href="#"> <i
                                                class="iconify tabler--download"></i>Export Logs</a>
                                    </li>
                                    <li>
                                        <hr class="dropdown-divider">
                                    </li>
                                    <li>
                                        <a class="dropdown-item text-danger" href="#"> <i
                                                class="iconify tabler--trash"></i> Clear Activity</a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="card-body" data-simplebar="" style="max-height: 426px">
                            <div>
                                <!-- Item -->
                                <div class="flex gap-x-5">
                                    <div
                                        class="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-0 after:border-s after:border-dashed after:border-default-300 after:-translate-x-[0.5px]">
                                        <div class="relative z-10">
                                            <div
                                                class="flex justify-center items-center bg-primary rounded-full size-7.5">
                                                <i class="iconify tabler--shopping-cart text-base text-white"></i>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="grow pb-7.5">
                                        <h5 class="text-md mb-1.25 font-semibold">New Orders Synced from
                                            Storefront</h5>

                                        <p class="mb-1.25 text-default-400">1,250 new customer orders were
                                            successfully imported from the online store.</p>

                                        <span class="text-primary font-semibold">By Olivia Green</span>
                                    </div>
                                </div>
                                <!-- End Item -->

                                <!-- Item -->
                                <div class="flex gap-x-5">
                                    <div
                                        class="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-0 after:border-s after:border-dashed after:border-default-300 after:-translate-x-[0.5px]">
                                        <div class="relative z-10">
                                            <div
                                                class="flex justify-center items-center bg-success rounded-full size-7.5">
                                                <i class="iconify tabler--credit-card text-base text-white"></i>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="grow pb-7.5">
                                        <h5 class="text-md mb-1.25 font-semibold">Payment Gateway
                                            Integration Updated</h5>

                                        <p class="mb-1.25 text-default-400">Stripe API upgraded to support
                                            faster settlements and improved security tokens.</p>

                                        <span class="text-primary font-semibold">By James Parker</span>
                                    </div>
                                </div>
                                <!-- End Item -->

                                <!-- Item -->
                                <div class="flex gap-x-5">
                                    <div
                                        class="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-0 after:border-s after:border-dashed after:border-default-300 after:-translate-x-[0.5px]">
                                        <div class="relative z-10">
                                            <div
                                                class="flex justify-center items-center bg-warning rounded-full size-7.5">
                                                <i class="iconify tabler--package text-base text-white"></i>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="grow pb-7.5">
                                        <h5 class="text-md mb-1.25 font-semibold">Inventory Levels
                                            Auto-Synced</h5>

                                        <p class="mb-1.25 text-default-400">All product quantities were
                                            updated based on the latest warehouse data.</p>

                                        <span class="text-primary font-semibold">By Sophia Lee</span>
                                    </div>
                                </div>
                                <!-- End Item -->

                                <!-- Item -->
                                <div class="flex gap-x-5">
                                    <div
                                        class="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-0 after:border-s after:border-dashed after:border-default-300 after:-translate-x-[0.5px]">
                                        <div class="relative z-10">
                                            <div class="flex justify-center items-center bg-info rounded-full size-7.5">
                                                <i class="iconify tabler--user text-base text-white"></i>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="grow pb-7.5">
                                        <h5 class="text-md mb-1.25 font-semibold">New Vendor Accounts
                                            Approved</h5>

                                        <p class="mb-1.25 text-default-400">Five new seller accounts were
                                            verified and added to the marketplace.</p>

                                        <span class="text-primary font-semibold">By Liam Johnson</span>
                                    </div>
                                </div>
                                <!-- End Item -->

                                <!-- Item -->
                                <div class="flex gap-x-5">
                                    <div
                                        class="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-0 after:border-s after:border-dashed after:border-default-300 after:-translate-x-[0.5px]">
                                        <div class="relative z-10">
                                            <div
                                                class="flex justify-center items-center bg-danger rounded-full size-7.5">
                                                <i class="iconify tabler--alert-circle text-base text-white"></i>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="grow pb-7.5">
                                        <h5 class="text-md mb-1.25 font-semibold">Refund Requests Reviewed
                                        </h5>

                                        <p class="mb-1.25 text-default-400">27 refund claims were processed
                                            successfully with zero pending disputes.</p>

                                        <span class="text-primary font-semibold">By Ethan Miller</span>
                                    </div>
                                </div>
                                <!-- End Item -->

                                <!-- Item -->
                                <div class="flex gap-x-5">
                                    <div class="relative z-10">
                                        <div
                                            class="flex justify-center items-center bg-secondary rounded-full size-7.5">
                                            <i class="iconify tabler--speakerphone text-base text-white"></i>
                                        </div>
                                    </div>

                                    <div class="grow">
                                        <h5 class="text-md mb-1.25 font-semibold">Summer Campaign Launched
                                        </h5>

                                        <p class="mb-1.25 text-default-400">The “Summer Deals 2025” campaign
                                            is now live across all marketing channels.</p>

                                        <span class="text-primary font-semibold">By Ava Mitchell</span>
                                    </div>
                                </div>
                                <!-- End Item -->
                            </div>
                        </div>
                        <!-- end slimscroll -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
