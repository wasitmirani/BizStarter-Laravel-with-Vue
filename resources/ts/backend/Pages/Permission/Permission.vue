<script setup lang="ts">
import RoleForm from './RoleForm.vue';
import { useCreateRole } from './Composables/useCreatePermission';
import { Helpers } from '../../Utils/Helper';

const { role, editmode, handleSubmitForm, loading } = useCreateRole();

// Create computed properties to unwrap the reactive values
const roleData = Helpers.useDynamicComputed(() => role.value);
const isEditMode = Helpers.useDynamicComputed(() => editmode.value);
const isLoading = Helpers.useDynamicComputed(() => loading?.value || false);
</script>

<template>
    <BreadcrumbComponent :current="isEditMode ? 'Update Role' : 'Create Role'" :links="[{ name: 'Dashboard', route: 'dashboard' }, { name: 'Roles', route: 'roles' }]"/>

    <!-- Loader -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
        <LoadingBox :showText="true" text="Loading role data..." />
    </div>

    <!-- Role Form -->
    <RoleForm
        v-else
        class="mt-4"
        :roleData="roleData"
        :isEditMode="isEditMode"
        @submit="handleSubmitForm"
    />
</template>
