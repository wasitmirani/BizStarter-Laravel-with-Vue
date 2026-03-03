<script setup lang="ts">
import UserForm from './UserForm.vue';
import { useCreateUser } from './Composables/useCreateUser';

const { user, editmode, handleSubmitForm } = useCreateUser();

</script>

<template>
    <BreadcrumbComponent
        current="Create User"
        :links="[{ name: 'Dashboard', route: 'dashboard' }, { name: 'Users', route: 'users' }]"
    />

    <UserForm
        class="mt-4"
        :user="user"
        :editmode="editmode"
        @submit="handleSubmitForm"
    />
</template>