<script setup lang="ts">
import WarehouseForm from "./WarehouseForm.vue";
import { useCreateWarehouse } from "./Composables/useCreateWarehouse";
import { Helpers } from "../../Utils/Helper";

const { warehouse, editmode, loading } = useCreateWarehouse();

const warehouseData = Helpers.useDynamicComputed(() => warehouse.value);
const isEditMode = Helpers.useDynamicComputed(() => editmode.value);
const isLoading = Helpers.useDynamicComputed(() => loading?.value || false);
</script>

<template>
    <BreadcrumbComponent :current="isEditMode ? 'Update Warehouse' : 'Create Warehouse'" :links="[{ name: 'Dashboard', route: 'dashboard' }, { name: 'Warehouses', route: 'warehouses' }]" />

    <div v-if="isLoading" class="flex justify-center items-center py-12">
        <LoadingBox :showText="true" text="Loading warehouse data..." />
    </div>

    <WarehouseForm v-else class="mt-4" :warehouseData="warehouseData" :isEditMode="isEditMode" />
</template>
