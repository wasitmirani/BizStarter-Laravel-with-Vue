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
    <header class="lk-page-head">
        <div>
            <h1 class="lk-page-title">{{ isEditMode ? 'Update permission' : 'Create permission' }}</h1>
            <p class="lk-page-subtitle">
                {{ isEditMode ? 'Rename the capability or change how it is described.' : 'Define a capability that roles can be granted.' }}
            </p>
        </div>
    </header>

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
