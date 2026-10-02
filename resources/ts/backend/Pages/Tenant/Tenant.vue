<script setup lang="ts">
import TenantForm from './TenantForm.vue';
import { useCreateTenant } from './Composables/useCreateTenant';
import { Helpers } from '../../Utils/Helper';

const { tenant, editmode, loading } = useCreateTenant();

const tenantData = Helpers.useDynamicComputed(() => tenant.value);
const isEditMode = Helpers.useDynamicComputed(() => editmode.value);
const isLoading = Helpers.useDynamicComputed(() => loading?.value || false);
</script>

<template>
    <BreadcrumbComponent
        :current="isEditMode ? 'Update Tenant' : 'Create Tenant'"
        :links="[
            { name: 'Dashboard', route: 'dashboard' },
            { name: 'Tenants', route: 'tenants' },
        ]"
    />

    <div v-if="isLoading" class="flex justify-center items-center py-12">
        <LoadingBox :showText="true" text="Loading tenant data..." />
    </div>

    <TenantForm v-else class="mt-4" :tenantData="tenantData" :isEditMode="isEditMode" />
</template>
