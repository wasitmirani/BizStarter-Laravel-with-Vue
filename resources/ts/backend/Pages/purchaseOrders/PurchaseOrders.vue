<script setup lang="ts">
import { usePurchaseOrders } from './Composables/usePurchaseOrders';
import PurchaseOrdersTable from './PurchaseOrdersTable.vue';
import { Helpers } from '../../Utils/Helper';

const { purchaseOrders, isLoading, filters, fetchPurchaseOrders, handleSearchQuery, init } = usePurchaseOrders();
Helpers.useDynamicOnMounted(init);
</script>

<template>
    <div>
        <BreadcrumbComponent :current="'Purchase Orders'" :links="[{ name: 'Dashboard', route: 'dashboard' }]" />
        <div class="container-fluid">
            <div class="card">
                <div class="card-header flex gap-2">
                    <SearchInput label="Search Purchase Orders" :apiPath="`/purchase-order`" @query="handleSearchQuery"></SearchInput>
                    <router-link :to="{ name: 'create-purchase-order' }" class="btn bg-primary text-white hover:bg-primary-hover"><i class="iconify tabler--plus"></i> Add Purchase Order</router-link>
                </div>
                <PurchaseOrdersTable :purchaseOrders="purchaseOrders" :isLoading="isLoading" :fetchPurchaseOrders="fetchPurchaseOrders" :filters="filters" />
            </div>
        </div>
    </div>
</template>
