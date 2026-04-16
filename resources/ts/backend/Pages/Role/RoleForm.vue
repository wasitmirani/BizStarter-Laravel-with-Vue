<script setup lang="ts">
import { useRoleForm } from './Composables/useRoleForm';
import { Helpers } from '../../Utils/Helper';

const props = defineProps(['isEditMode', 'roleData']);

const {
    role,
    errors,
    isLoading,
    onSubmit,
    usersDropdownItems,
    permissionsDropdownItems,
} =  useRoleForm(props?.roleData, props?.isEditMode);

</script>

<template>
    <!-- <div v-if="!isLoading"> -->

        <div class="card pointer-events-auto flex w-full flex-col">
            <div class="card-header p-5">
                <h3 id="addRoleModalLabel" class="text-sm"> {{ isEditMode ? 'Update Role Details' : 'Create Role Details' }}</h3>
              
            </div>
                       <form @submit.prevent="onSubmit">

            <div class="card-body ">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>

                        <FormInput v-model="role.name" label="Role Name" name="name"
                            placeholder="e.g. Developer, Project Manager" type="text" :errors="errors" autofocus />

                    </div>

                    <div>

                        <FormInput v-model="role.description" label="Description" name="description"
                            placeholder="Brief description" type="text" :errors="errors" autofocus />
                    </div>

                 

                    <div>
                        <label for="roleUsers" class="form-label">Assign Users</label>
                        <MultiSelect v-model="role.users" :options="usersDropdownItems" label="Assign Users"
                            placeholder="Select Users" trackBy="value" optionLabel="label" :errors="errors" multiple />
                        <small class="text-default-400 text-xs"> Select users you want to assign to this role
                        </small>
                    </div>
                    <div>
                        <label for="roleUsers" class="form-label">Assign Permissions</label>
                        <!-- Permissions Selection -->
                        <MultiSelect v-model="role.permissions" :options="permissionsDropdownItems"
                            label="Assign Permissions" placeholder="Select Permissions" trackBy="value"
                            optionLabel="label" :errors="errors" multiple />
                        <small class="text-default-400 text-xs"> Select permissions you want to assign to this role
                        </small>
                    </div>
                       <div class="md:col-span-2">
            <label for="roleResponsibilities" class="form-label">Key Responsibilities</label>
            
            <textarea 
                class="form-textarea" 
                v-model="role.responsibilities" 
                id="roleResponsibilities"
                rows="4" 
                placeholder="Enter responsibilities (comma-separated or one per line)" 
                >
            </textarea>
            
            <small class="text-default-400 text-xs">
                Add each responsibility separated by a comma or on a new line (e.g., Codebase Maintenance, API Integration, Unit Testing)
            </small>
        </div>
                            <!-- <div>
                                        <label for="roleIcon" class="form-label">Role Icon</label>
                                        <input type="text" class="form-input" id="roleIcon" placeholder="e.g. shield, briefcase">
                                        <small class="text-default-400 text-xs">Use icon class from your icon library</small>
                                    </div> -->
                </div>
            </div>
            <!-- Button Actions -->
            <div class="border-default-300 flex items-center justify-end gap-x-2 border-t p-4">

                <router-link :to="{ name: 'roles' }" class="btn bg-light hover:text-primary">
                    <i class="iconify tabler--arrow-back-up"></i> Discard
                </router-link>

                <button
                    :class="isEditMode ? 'btn bg-success hover:bg-success-hover text-white' : 'btn bg-primary hover:bg-primary-hover text-white'"
                    v-if="!isLoading" type="submit">
                    {{ isEditMode ? 'Update Role' : 'Save Role' }} <i class="iconify tabler--device-floppy"></i>
                </button>

                <button class="btn bg-primary hover:bg-success-hover text-white" type="button" disabled
                    v-if="isLoading">
                    <span class="spinner-border spinner-border-sm align-middle" role="status" aria-hidden="true"></span>
                    Loading...
                </button>
           
            </div>
             </form>
        </div>

    <!-- </div> -->
    <!-- <div v-else class="flex justify-center items-center py-12">
        <div class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span class="sr-only">Loading form data...</span>
        </div>
    </div> -->
</template>
