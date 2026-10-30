<script setup lang="ts">
import RoleForm from './RoleForm.vue';
import { useCreateRole } from './Composables/useCreateRole';
import { Helpers } from '../../Utils/Helper';

const { role, editmode, handleSubmitForm, loading } = useCreateRole();

// Create computed properties to unwrap the reactive values
const roleData = Helpers.useDynamicComputed(() => role.value);
const isEditMode = Helpers.useDynamicComputed(() => editmode.value);
const isLoading = Helpers.useDynamicComputed(() => loading?.value || false);
</script>

<template>
    <header class="lk-page-head">
        <div>
            <h1 class="lk-page-title">{{ isEditMode ? 'Update role' : 'Create role' }}</h1>
            <p class="lk-page-subtitle">
                {{ isEditMode ? 'Adjust the role name and the permissions it grants.' : 'Name a role and choose the capabilities it should grant.' }}
            </p>
        </div>
    </header>

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
