<script setup lang="ts">
import DriverForm from "./DriverForm.vue";
import { useCreateDriver } from "./Composables/useCreateDriver";
import { Helpers } from "../../Utils/Helper";

const { driver, editmode, loading } = useCreateDriver();

const driverData = Helpers.useDynamicComputed(() => driver.value);
const isEditMode = Helpers.useDynamicComputed(() => editmode.value);
const isLoading = Helpers.useDynamicComputed(() => loading?.value || false);
</script>

<template>
    <BreadcrumbComponent :current="isEditMode ? 'Update Driver' : 'Create Driver'" :links="[{ name: 'Dashboard', route: 'dashboard' }, { name: 'Drivers', route: 'drivers' }]" />

    <div v-if="isLoading" class="flex justify-center items-center py-12">
        <LoadingBox :showText="true" text="Loading driver data..." />
    </div>

    <DriverForm v-else class="mt-4" :driverData="driverData" :isEditMode="isEditMode" />
</template>
