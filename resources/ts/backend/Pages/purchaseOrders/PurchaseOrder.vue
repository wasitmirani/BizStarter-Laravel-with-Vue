<script setup lang="ts">
// @ts-ignore - Vue SFC default export is resolved at runtime
import PurchaseOrderForm from './PurchaseOrderForm.vue';
import { Helpers } from '../../Utils/Helper';
import { useCreatePurchaseOrder } from './Composables/useCreatePurchaseOrder';

const { purchaseOrder, editmode, loading } = useCreatePurchaseOrder();

const isEditMode = Helpers.useDynamicComputed(() => editmode.value);
const isLoading = Helpers.useDynamicComputed(() => loading.value);
</script>

<template>
    <BreadcrumbComponent :current="isEditMode ? 'Update Purchase Order' : 'Create Purchase Order'" :links="[{ name: 'Dashboard', route: 'dashboard' }, { name: 'Purchase Orders', route: 'purchase-orders' }]" />
    <div v-if="isLoading" class="flex justify-center items-center py-12">
        <LoadingBox :showText="true" text="Loading purchase order..." />
    </div>
    <div v-else class="container-fluid">
        <PurchaseOrderForm :isEditMode="isEditMode" :purchaseOrderData="purchaseOrder" />
    </div>
</template>
