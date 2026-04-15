<script setup lang="ts">
import { useRoleForm } from './Composables/useRoleForm';
import { Helpers } from '../../Utils/Helper';

const props = defineProps(['isEditMode', 'roleData']);

const isLoadingForm = Helpers.useDynamicRef(true);
const role = Helpers.useDynamicRef<any>({
    id: null,
    name: '',
    permissions: [],
    users: [],
});
const errors = Helpers.useDynamicRef<any>({});
const isLoading = Helpers.useDynamicRef(false);
const usersDropdownItems = Helpers.useDynamicRef<any>([]);
const permissionsDropdownItems = Helpers.useDynamicRef<any>([]);
const toast = Helpers.useDynamicInject<any>('toast', null);
let onSubmit: any = null;

// Initialize form data on mount
Helpers.useDynamicOnMounted(async () => {
    try {
        const formData = await useRoleForm(props?.roleData, props?.isEditMode);
        role.value = formData.role;
        errors.value = formData.errors;
        // isLoading.value = formData.isLoading;
        usersDropdownItems.value = formData.usersDropdownItems || [];
        permissionsDropdownItems.value = formData.permissionsDropdownItems || [];
        onSubmit = formData.onSubmit;

        console.log("Form initialized successfully");
        console.log("Users dropdown items:", usersDropdownItems.value);
        console.log("Permissions dropdown items:", permissionsDropdownItems.value);
    } catch (error) {
        console.error('Error loading form:', error);
        toast.value?.showToast?.(500, 'Error', 'Failed to load form data');
    } finally {
        isLoadingForm.value = false;
    }
});

// Fallback submit handler
const handleSubmit = () => {
    if (onSubmit && typeof onSubmit === 'function') {
        onSubmit();
    }
};
</script>

<template>
    <div v-if="!isLoadingForm">
        <div class="w-full flex flex-col card pointer-events-auto">
            <div class="flex justify-between items-center card-body border-b border-default-300">
                <h3 id="addCustomerModalLabel" class="font-bold flex items-center">
                    {{ isEditMode ? 'Update Role Details' : 'Create Role Details' }}
                </h3>
            </div>
            <form @submit.prevent="handleSubmit">
                <div class="card-body">
                    <div class="grid lg:grid-cols-3 grid-cols-2 gap-base">
                        <!-- Role Name -->
                        <FormInput 
                            v-model="role.name" 
                            label="Role Name" 
                            name="name" 
                            placeholder="Enter role name"
                            type="text" 
                            :errors="errors" 
                            autofocus 
                        />

                        <!-- Users Selection -->
                        <MultiSelect 
                            v-model="role.users" 
                            :options="usersDropdownItems" 
                            label="Assign Users" 
                            name="users"
                            placeholder="Select Users" 
                            track-by="value" 
                            label-by="label"
                            :errors="errors" 
                            multiple 
                        />

                        <!-- Permissions Selection -->
                        <MultiSelect 
                            v-model="role.permissions" 
                            :options="permissionsDropdownItems" 
                            label="Assign Permissions" 
                            name="permissions"
                            placeholder="Select Permissions" 
                            track-by="value" 
                            label-by="label"
                            :errors="errors" 
                            multiple 
                        />
                    </div>
                </div>

                <div class="flex justify-end items-center gap-2 p-5 border-t border-default-300">
                    <router-link :to="{ name: 'roles' }" class="btn bg-light hover:text-primary">
                        <i class="iconify tabler--arrow-back-up"></i> Discard
                    </router-link>

                    <button 
                        :class="isEditMode ? 'btn bg-success hover:bg-success-hover text-white' : 'btn bg-primary hover:bg-primary-hover text-white'" 
                        v-if="!isLoading"
                        type="submit"
                    >
                        {{ isEditMode ? 'Update Role' : 'Save Role' }} <i class="iconify tabler--device-floppy"></i>
                    </button>

                    <button 
                        class="btn bg-primary hover:bg-success-hover text-white" 
                        type="button" 
                        disabled
                        v-if="isLoading"
                    >
                        <span class="spinner-border spinner-border-sm align-middle" role="status" aria-hidden="true"></span>
                        Loading...
                    </button>
                </div>
            </form>
        </div>
    </div>
    <div v-else class="flex justify-center items-center py-12">
        <div class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span class="sr-only">Loading form data...</span>
        </div>
    </div>
</template>
           