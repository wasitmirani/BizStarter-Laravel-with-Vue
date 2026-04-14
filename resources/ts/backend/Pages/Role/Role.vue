<script setup lang="ts">
import UserForm from './UserForm.vue';
import { useCreateRole } from './Composables/useCreateRole';
import { Helpers } from '../../Utils/Helper';

const { user, editmode, handleSubmitForm, loading } = useCreateRole();

// Create computed properties to unwrap the reactive values
const userData = Helpers.useDynamicComputed(() => user.value);
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
        :userData="userData"
        :isEditMode="isEditMode"
        @submit="handleSubmitForm"
    />
</template>
