<script setup lang="ts">
import { PurchasesService } from '../../Services/purchases/PurchasesService';
// @ts-ignore - Vue SFC default export is resolved at runtime
import GenericTable from '../../Components/GenericTable.vue';
import { Helpers } from '../../Utils/Helper';

const props = defineProps<{
    purchaseOrders: any;
    isLoading: boolean;
    fetchPurchaseOrders: (page?: number, perPage?: number) => void;
    filters: Record<string, unknown>;
}>();

const columns = [
    { key: 'po_number', label: 'PO Number' },
    { key: 'supplier_name', label: 'Supplier' },
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
        props.fetchPurchaseOrders();
    }
};
</script>

<template>
    <GenericTable :columns="columns" :rows="purchaseOrders" :isLoading="isLoading" :fetchData="fetchPurchaseOrders" :actions="actions" :filters="filters" @action="handleAction">
        <template #supplier_name="{ row }">
            {{ row.supplier?.name || `#${row.supplier_id || '-'}` }}
        </template>
        <template #order_date="{ row }">
            {{ row.order_date ? Helpers.DateTimeFormat(row.order_date) : '-' }}
        </template>
        <template #expected_date="{ row }">
            {{ row.expected_date ? Helpers.DateTimeFormat(row.expected_date) : '-' }}
        </template>
        <template #created_at="{ row }">
            {{ row.created_at ? Helpers.DateTimeFormat(row.created_at) : '-' }}
        </template>
        <template #total="{ row }">
            {{ Number(row.total || 0).toFixed(2) }}
        </template>
    </GenericTable>
</template>
