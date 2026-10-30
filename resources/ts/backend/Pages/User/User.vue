<script setup lang="ts">
import UserForm from './UserForm.vue';
import { useCreateUser } from './Composables/useCreateUser';
import { Helpers } from '../../Utils/Helper';

const { user, editmode, handleSubmitForm, loading } = useCreateUser();

// Create computed properties to unwrap the reactive values
const userData = Helpers.useDynamicComputed(() => user.value);
const isEditMode = Helpers.useDynamicComputed(() => editmode.value);
const isLoading = Helpers.useDynamicComputed(() => loading?.value || false);
</script>

<template>
    <header class="lk-page-head">
        <div>
            <h1 class="lk-page-title">{{ isEditMode ? 'Update user' : 'Create user' }}</h1>
            <p class="lk-page-subtitle">
                {{ isEditMode ? 'Change profile details, contact information and role assignment.' : 'Add a teammate and assign the role that controls their access.' }}
            </p>
        </div>
    </header>

    <!-- Loader -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
        <LoadingBox :showText="true" text="Loading user data..." />
    </div>

    <!-- User Form -->
    <UserForm
        v-else
        class="mt-4"
        :userData="userData"
        :isEditMode="isEditMode"
        @submit="handleSubmitForm"
    />
</template>
