<script setup lang="ts">
import { usePurchaseOrders } from './Composables/usePurchaseOrders';
import PurchaseOrdersTable from './PurchaseOrdersTable.vue';
import OffCanvas from '../../Components/OffCanvas.vue';
import ActiveFilters from '../../Components/ActiveFilters.vue';
import { perPageOptions, dateRanges } from './Composables/usePurchaseOrderFilter';
import { Helpers } from '../../Utils/Helper';

const {
    purchaseOrders,
    suppliers,
    warehouses,
    isLoading,
    filters,
    fetchPurchaseOrders,
    handleFilterChange,
    handleSearchQuery,
    setLoading,
    filterData,
    init,
} = usePurchaseOrders();
Helpers.useDynamicOnMounted(init);
</script>

<template>
    <div>
        <BreadcrumbComponent :current="'Purchase Orders'" :links="[{ name: 'Dashboard', route: 'dashboard' }]" />
        <div class="container-fluid">
            <div data-table="" data-table-rows-per-page="8" class="card">
                <div class="card-header">
                    <div class="flex flex-wrap gap-2.5">
                        <SearchInput label="Search Purchase Orders" :apiPath="`/purchase-order`" @loading="setLoading" @filterData="filterData" @query="handleSearchQuery" />
                        <div class="flex gap-1">
                            <router-link :to="{ name: 'create-purchase-order' }" class="btn bg-primary text-white hover:bg-primary-hover"><i class="iconify tabler--plus"></i> Add Purchase Order</router-link>
                        </div>
                    </div>

                    <div class="flex flex-wrap items-center gap-3">
                        <div class="items-center gap-3 md:flex">
                            <span class="me-3 font-semibold text-nowrap">Filter By:</span>

                            <div class="input-icon-group">
                                <i class="iconify tabler--calendar input-icon"></i>
                                <select class="form-select" @change="handleFilterChange(filters)" v-model="filters.date_range">
                                    <option v-for="item in dateRanges" :key="item.value" :value="item.value">{{ item.label }}</option>
                                </select>
                            </div>

                            <div class="input-icon-group">
                                <i class="iconify tabler--users input-icon"></i>
                                <select class="form-select" @change="handleFilterChange(filters)" v-model="filters.supplier_id">
                                    <option value="">All Suppliers</option>
                                    <option v-for="item in suppliers" :key="item.id" :value="item.id">{{ item.name }}</option>
                                </select>
                            </div>

                            <div class="input-icon-group">
                                <i class="iconify tabler--building-warehouse input-icon"></i>
                                <select class="form-select" @change="handleFilterChange(filters)" v-model="filters.warehouse_id">
                                    <option value="">All Warehouses</option>
                                    <option v-for="item in warehouses" :key="item.id" :value="item.id">{{ item.name }}</option>
                                </select>
                            </div>

                            <div class="input-icon-group">
                                <i class="iconify tabler--list-details input-icon"></i>
                                <select @change="handleFilterChange(filters)" v-model="filters.per_page" class="form-select w-full">
                                    <option v-for="option in perPageOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                                </select>
                            </div>
                        </div>

                        <ActiveFilters routeName="purchase-orders" @filterChange="handleFilterChange($event)" />
                    </div>

                    <div>
                        <nav class="flex items-center gap-x-1">
                            <a role="button" @click="fetchPurchaseOrders()" class="btn bg-primary/15 text-primary btn-icon hover:bg-primary hover:text-white">
                                <i class="iconify tabler--refresh text-lg"></i>
                            </a>

                            <OffCanvas id="offcanvasPurchaseOrderFilter" title="Advance Filters" buttonClass="btn bg-primary btn-icon text-white hover:bg-primary-hover" buttonLabel="Filter">
                                <template #button-icon>
                                    <i class="iconify tabler--filter text-lg"></i>
                                </template>
                                <template #body>
                                    <div class="text-default-500 text-sm">Use search, supplier, warehouse and date range filters.</div>
                                </template>
                            </OffCanvas>
                        </nav>
                    </div>
                </div>
                <PurchaseOrdersTable :purchaseOrders="purchaseOrders" :isLoading="isLoading" :fetchPurchaseOrders="fetchPurchaseOrders" :filters="filters" />
            </div>
        </div>
    </div>
</template>
