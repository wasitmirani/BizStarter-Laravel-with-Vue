<script setup lang="ts">
import PermissionForm from './PermissionForm.vue';
import { useCreatePermission } from './Composables/useCreatePermission';
import { Helpers } from '../../Utils/Helper';

const { permission, editmode, handleSubmitForm, loading } = useCreatePermission();

// Create computed properties to unwrap the reactive values
const permissionData = Helpers.useDynamicComputed(() => permission.value);
const isEditMode = Helpers.useDynamicComputed(() => editmode.value);
const isLoading = Helpers.useDynamicComputed(() => loading?.value || false);
</script>

<template>
    <BreadcrumbComponent :current="isEditMode ? 'Update Permission' : 'Create Permission'" :links="[{ name: 'Dashboard', route: 'dashboard' }, { name: 'Permissions', route: 'permissions' }]"/>

    <!-- Loader -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
        <LoadingBox :showText="true" text="Loading permission data..." />
    </div>

    <!-- Permission Form -->
    <PermissionForm
        v-else
        class="mt-4"
        :permissionData="permissionData"
        :isEditMode="isEditMode"
        @submit="handleSubmitForm"
    />
</template>
