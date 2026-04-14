<script setup lang="ts">
import {useRoleForm}  from './Composables/useRoleForm';

const props = defineProps(['isEditMode', 'roleData']);

const {role,errors,isLoading,onSubmit} = useRoleForm(props?.roleData, props?.isEditMode);

</script>

<template>
    <div>
        <div class="w-full flex flex-col card pointer-events-auto">
            <div class="flex justify-between items-center card-body border-b border-default-300">
                <h3 id="addCustomerModalLabel" class="font-bold flex items-center">{{ isEditMode ? 'Update Role Details'  : 'Create Role Details' }}  </h3>

            </div>
            <form @submit.prevent="onSubmit">
                <div class="card-body">
                    <div class="grid lg:grid-cols-3 grid-cols-2 gap-base">
                        <!-- Full Name -->
                        <FormInput v-model="role?.name" label="Role Name" name="name" placeholder="Role Name`"
                            type="text" :errors="errors" autofocus />

                        <MultiSelect v-model="role.users" :options="[]" label="Users" name="users"
                            placeholder="Select Users" track-by="id" :errors="errors" multiple />
                        <MultiSelect v-model="role.permissions" :options="[]" label="Permissions" name="permissions"
                            placeholder="Select Permissions" track-by="id" :errors="errors" multiple />
                        
                        <div>

                        </div>
                    </div>
                </div>
                <div class="flex justify-end items-center gap-2 p-5 border-t border-default-300">


                    <router-link :to="{ name: 'roles' }" class="btn bg-light hover:text-primary">
                        <i class="iconify tabler--arrow-back-up"></i> Discard
                    </router-link>
                    <button class="btn bg-secondary hover:bg-secondary-hover text-white ">
                        Draft Role <i class="iconify tabler--folder-open"></i>
                    </button>
                    <button :class="isEditMode ? 'btn bg-success hover:bg-success-hover text-white' : 'btn bg-primary hover:bg-primary-hover text-white'" v-if="!isLoading">
                        {{ isEditMode ? 'Update Role' : 'Save Role' }} <i class="iconify tabler--device-floppy"></i>
                    </button>
                    <button class="btn bg-primary hover:bg-success-hover text-white" type="button" disabled
                        v-if="isLoading">
                        <span class="spinner-border spinner-border-sm align-middle" role="status"
                            aria-hidden="true"></span>
                        Loading...
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
