<script setup lang="ts">
import { usePurchaseOrders } from './Composables/usePurchaseOrders';
import { PurchasesService } from '../../Services/purchases/PurchasesService';
// @ts-ignore - Vue SFC default export is resolved at runtime
import GenericTable from '../../Components/GenericTable.vue';
import { Helpers } from '../../Utils/Helper';

const { purchaseOrders, isLoading, filters, fetchPurchaseOrders, handleSearchQuery, init } = usePurchaseOrders();
Helpers.useDynamicOnMounted(init);

const columns = [
    { key: 'po_number', label: 'PO Number' },
    { key: 'supplier_id', label: 'Supplier ID' },
    { key: 'order_date', label: 'Order Date' },
    { key: 'expected_date', label: 'Expected Date' },
    { key: 'total', label: 'Total' },
    { key: 'created_at', label: 'Created At' },
];

const actions = [
    { label: 'View', icon: 'eye', action: 'view' },
    { label: 'Edit', icon: 'edit', action: 'edit' },
    { label: 'Delete', icon: 'trash', action: 'delete' },
];

const handleAction = async ({ action, row }: { action: string; row?: any }) => {
    if (!row?.uuid) return;
    if (action === 'view') Helpers.router().push({ name: 'show-purchase-order', params: { uuid: row.uuid } });
    if (action === 'edit') Helpers.router().push({ name: 'edit-purchase-order', params: { uuid: row.uuid } });
    if (action === 'delete') {
        await PurchasesService.deletePurchaseOrder(row.uuid);
        fetchPurchaseOrders();
    }
};
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
                <GenericTable :columns="columns" :rows="purchaseOrders" :isLoading="isLoading" :fetchData="fetchPurchaseOrders" :actions="actions" :filters="filters" @action="handleAction">
                    <template #total="{ row }">
                        {{ Number(row.total || 0).toFixed(2) }}
                    </template>
                </GenericTable>
            </div>
        </div>
    </div>
</template>
