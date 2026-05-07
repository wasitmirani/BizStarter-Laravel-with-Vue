<script setup lang="ts">
import SupplierForm from "./SupplierForm.vue";
import { useCreateSupplier } from "./Composables/useCreateSupplier";
import { Helpers } from "../../Utils/Helper";

const { supplier, editmode, loading } = useCreateSupplier();

const supplierData = Helpers.useDynamicComputed(() => supplier.value);
const isEditMode = Helpers.useDynamicComputed(() => editmode.value);
const isLoading = Helpers.useDynamicComputed(() => loading?.value || false);
</script>

<template>
    <BreadcrumbComponent :current="isEditMode ? 'Update Supplier' : 'Create Supplier'" :links="[{ name: 'Dashboard', route: 'dashboard' }, { name: 'Suppliers', route: 'suppliers' }]" />

    <div v-if="isLoading" class="flex justify-center items-center py-12">
        <LoadingBox :showText="true" text="Loading supplier data..." />
    </div>

    <SupplierForm v-else class="mt-4" :supplierData="supplierData" :isEditMode="isEditMode" />
</template>
