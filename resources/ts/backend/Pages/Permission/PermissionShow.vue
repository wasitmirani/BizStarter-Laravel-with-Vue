<script setup lang="ts">
import { useCreateRole } from './Composables/useCreatePermission';
import { Helpers } from '../../Utils/Helper';
import RoleCard from '../../Components/RoleCard.vue'

const { role, editmode, handleSubmitForm, loading } = useCreateRole();

// Create computed properties to unwrap the reactive values
const roleData = Helpers.useDynamicComputed(() => role.value);
const isEditMode = Helpers.useDynamicComputed(() => editmode.value);
const isLoading = Helpers.useDynamicComputed(() => loading?.value || false);
</script>

<template>
    <BreadcrumbComponent current="Show Role" :links="[{ name: 'Dashboard', route: 'dashboard' }, { name: 'Roles', route: 'roles' }]"/>

    <!-- Loader -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
        <LoadingBox :showText="true" text="Loading role data..." />
    </div>

    <RoleCard v-if="roleData?.users?.length > 0" :items="roleData" />
    <div v-else class="flex justify-center items-center py-12">
        <p class="text-default-400 text-sm">No users found</p>
    </div>
</template>
