<script setup lang="ts">
import { Helpers } from '../../Utils/Helper';
import { PurchasesService } from '../../Services/purchases/PurchasesService';

const purchaseOrder = Helpers.useDynamicRef<any>({});
const isLoading = Helpers.useDynamicRef(false);

const loadPurchaseOrder = async () => {
    const uuid = Helpers.route().params.uuid?.toString();
    if (!uuid) return;
    isLoading.value = true;
    try {
        const res = await PurchasesService.purchaseOrder(uuid);
        purchaseOrder.value = res?.data?.result?.purchase_order ?? {};
    } finally {
        isLoading.value = false;
    }
};

Helpers.useDynamicOnMounted(loadPurchaseOrder);
const data = Helpers.useDynamicComputed(() => purchaseOrder.value);
</script>

<template>
    <BreadcrumbComponent :current="'Purchase Order Details'" :links="[{ name: 'Dashboard', route: 'dashboard' }, { name: 'Purchase Orders', route: 'purchase-orders' }]" />
    <div v-if="isLoading" class="flex justify-center items-center py-12">
        <LoadingBox :showText="true" text="Loading purchase order..." />
    </div>
    <div v-else class="container-fluid">
        <div class="card p-5 mb-4">
            <div class="flex justify-between items-center">
                <div>
                    <h4 class="font-semibold mb-1">{{ data.po_number }}</h4>
                    <p class="text-default-400 mb-0">Supplier ID: {{ data.supplier_id || '-' }}</p>
                </div>
                <router-link :to="{ name: 'edit-purchase-order', params: { uuid: data.uuid } }" class="btn bg-primary text-white">Edit</router-link>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-base">
            <div class="card p-5">
                <h5 class="mb-3">Purchase Order Info</h5>
                <p><b>Order Date:</b> {{ data.order_date || '-' }}</p>
                <p><b>Expected Date:</b> {{ data.expected_date || '-' }}</p>
                <p><b>Warehouse ID:</b> {{ data.warehouse_id || '-' }}</p>
                <p><b>Payment Term:</b> {{ data.payment_term || '-' }}</p>
                <p><b>Payment Type:</b> {{ data.payment_type || '-' }}</p>
                <p><b>Supplier Reference ID:</b> {{ data.supplier_reference_id || '-' }}</p>
            </div>
            <div class="card p-5">
                <h5 class="mb-3">Invoice Summary</h5>
                <p><b>Sub Total:</b> {{ Number(data.sub_total || 0).toFixed(2) }}</p>
                <p><b>Taxes:</b> {{ Number(data.taxes || 0).toFixed(2) }}</p>
                <p><b>Shipping Charges:</b> {{ Number(data.shipping_charges || 0).toFixed(2) }}</p>
                <p><b>Total:</b> {{ Number(data.total || 0).toFixed(2) }}</p>
            </div>
        </div>

        <div class="card mt-4">
            <div class="card-header"><h5 class="mb-0">Line Items</h5></div>
            <div class="card-body p-0 overflow-x-auto">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Variant</th>
                            <th>SKU</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Line Tax</th>
                            <th>Line Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in (data.items || [])" :key="item.id">
                            <td>{{ item.name || item.variant?.name || '-' }}</td>
                            <td>{{ item.sku || '-' }}</td>
                            <td>{{ Number(item.quantity || 0).toFixed(2) }}</td>
                            <td>{{ Number(item.unit_price || 0).toFixed(2) }}</td>
                            <td>{{ Number(item.line_tax || 0).toFixed(2) }}</td>
                            <td>{{ Number(item.line_total || 0).toFixed(2) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="card mt-4 p-5">
            <h5 class="mb-2">Supplier Notes</h5>
            <p class="mb-0">{{ data.supplier_notes || 'N/A' }}</p>
        </div>
    </div>
</template>
