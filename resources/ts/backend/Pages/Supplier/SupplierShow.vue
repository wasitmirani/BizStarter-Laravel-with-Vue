<script setup lang="ts">
import SupplierService from "../../Services/Supplier/SupplierService";
import { Helpers } from "../../Utils/Helper";

const supplier = Helpers.useDynamicRef<any>(null);
const isLoading = Helpers.useDynamicRef<boolean>(false);

const fetchSupplier = async () => {
    isLoading.value = true;
    try {
        const id = Helpers.route().params.id?.toString();
        if (id) {
            const res = await SupplierService.supplier(id);
            supplier.value = res.data.result?.supplier || null;
        }
    } finally {
        isLoading.value = false;
    }
};

Helpers.useDynamicOnMounted(() => fetchSupplier());
</script>

<template>
    <div>
        <BreadcrumbComponent :current="'Supplier Details'" :links="[{ name: 'Dashboard', route: 'dashboard' }, { name: 'Suppliers', route: 'suppliers' }]" />

        <div class="card mt-4">
            <div class="card-body">
                <LoadingBox v-if="isLoading" :showText="true" text="Loading supplier..." />
                <div v-else-if="supplier" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><strong>Name:</strong> {{ supplier.name }}</div>
                    <div><strong>Email:</strong> {{ supplier.email || "-" }}</div>
                    <div><strong>Phone:</strong> {{ supplier.phone || "-" }}</div>
                    <div><strong>Status:</strong> {{ supplier.status }}</div>
                    <div><strong>City:</strong> {{ supplier.city || "-" }}</div>
                    <div><strong>Contact Name:</strong> {{ [supplier.contact_first_name, supplier.contact_last_name].filter(Boolean).join(" ") || "-" }}</div>
                    <div class="md:col-span-2"><strong>Address:</strong> {{ supplier.address || "-" }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
