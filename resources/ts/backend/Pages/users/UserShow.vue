<script setup lang="ts">
import UserForm from './UserForm.vue';
import { useCreateUser } from './Composables/useCreateUser';
import { Helpers } from '../../Utils/Helper';

const { user, editmode, handleSubmitForm, loading } = useCreateUser();

// Create computed properties to unwrap the reactive values
const userData = Helpers.useDynamicComputed(() => user.value);
const isLoading = Helpers.useDynamicComputed(() => loading?.value || false);
</script>

<template>
    <BreadcrumbComponent :current="'User Details'" :links="[{ name: 'Dashboard', route: 'dashboard' }, { name: 'Users', route: 'users' }]"/>

    <!-- Loader -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
        <LoadingBox :showText="true" text="Loading user data..." />
    </div>


</template>
