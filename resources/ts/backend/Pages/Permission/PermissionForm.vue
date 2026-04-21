<script setup lang="ts">
import { usePermissionForm } from './Composables/usePermissionForm';
import { Helpers } from '../../Utils/Helper';

const props = defineProps(['isEditMode', 'permissionData']);

const {
    permission,
    errors,
    isLoading,
    onSubmit,
    usersDropdownItems,
    rolesDropdownItems,
} =  usePermissionForm(props?.permissionData, props?.isEditMode);

const usersModel  = Helpers.useMultiSelectModel(permission, 'users', usersDropdownItems);
const rolesModel = Helpers.useMultiSelectModel(permission, 'permissions', rolesDropdownItems);
</script>

<template>


        <div class="card pointer-events-auto flex w-full flex-col">
            <div class="card-header p-5">
                <h3 id="addPermissionModalLabel" class="text-sm"> {{ isEditMode ? 'Update Permission Details' : 'Create Permission Details' }}</h3>

            </div>
        <form @submit.prevent="onSubmit">

            <div class="card-body ">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>

                        <FormInput v-model="permission.name" label="Permission Name" name="name"
                            placeholder="e.g. Developer, Project Manager" type="text" :errors="errors" autofocus />

                    </div>

                    <div>

                        <FormInput v-model="permission.description" label="Description" name="description"
                            placeholder="Brief description" type="text" :errors="errors" autofocus />
                    </div>



                    <div>
                        <label for="permissionUsers" class="form-label">Assign Users </label>
                        <MultiSelect v-model="usersModel" :options="usersDropdownItems" label="Assign Users"
                            placeholder="Select Users" trackBy="value" optionLabel="label" :errors="errors" multiple />
                        <small class="text-default-400 text-xs"> Select users you want to assign to this permission
                        </small>
                    </div>
                    <div>
                        <label for="roleUsers" class="form-label">Assign Roles</label>
                        <!-- Permissions Selection -->
                        <MultiSelect v-model="rolesModel" :options="rolesDropdownItems"
                            label="Assign Permissions" placeholder="Select Roles" trackBy="value"
                            optionLabel="label" :errors="errors" multiple />
                        <small class="text-default-400 text-xs"> Select Roles you want to assign to this role
                        </small>
                    </div>
                       <div class="md:col-span-2">


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
</template>
