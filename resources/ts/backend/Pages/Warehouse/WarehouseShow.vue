<script setup lang="ts">
import WarehouseService from "../../Services/Warehouse/WarehouseService";
import { Helpers } from "../../Utils/Helper";

const warehouse = Helpers.useDynamicRef<any>(null);
const isLoading = Helpers.useDynamicRef<boolean>(false);

const fetchWarehouse = async () => {
    isLoading.value = true;
    try {
        const id = Helpers.route().params.id?.toString();
        if (id) {
            const res = await WarehouseService.warehouse(id);
            warehouse.value = res.data.result?.warehouse || null;
        }
    } finally {
        isLoading.value = false;
    }
};

Helpers.useDynamicOnMounted(() => fetchWarehouse());
</script>

<template>
    <div>
        <BreadcrumbComponent :current="'Warehouse Details'" :links="[{ name: 'Dashboard', route: 'dashboard' }, { name: 'Warehouses', route: 'warehouses' }]" />

        <div class="card mt-4">
            <div class="card-body">
                <LoadingBox v-if="isLoading" :showText="true" text="Loading warehouse..." />
                <div v-else-if="warehouse" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><strong>Name:</strong> {{ warehouse.name }}</div>
                    <div><strong>Label:</strong> {{ warehouse.label || "-" }}</div>
                    <div><strong>Email:</strong> {{ warehouse.email || "-" }}</div>
                    <div><strong>Phone:</strong> {{ warehouse.phone || "-" }}</div>
                    <div><strong>Status:</strong> {{ warehouse.status }}</div>
                    <div><strong>City:</strong> {{ warehouse.city || "-" }}</div>
                    <div class="md:col-span-2"><strong>Address:</strong> {{ warehouse.address || "-" }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
