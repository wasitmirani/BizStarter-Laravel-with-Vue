<script setup lang="ts">
import { useCreateUser } from './Composables/useCreateUser';
import { Helpers } from '../../Utils/Helper';

const { user, loading } = useCreateUser();

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

    <div v-else class="container-fluid">
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-base">
            <!-- Profile Card -->
            <div class="card">
                <div class="card-body">
                    <div class="mb-7.5 flex items-center justify-between">
                        <div class="flex items-center gap-base">
                            <div class="relative">
                                <img :src="userData?.thumbnail || '/backend/images/users/user-1.jpg'"
                                     alt="avatar"
                                     class="size-18 rounded-full object-cover" />
                            </div>
                            <div>
                                <h5 class="flex items-center">
                                    <span class="hover:text-primary">
                                        {{ userData?.name || [userData?.first_name, userData?.last_name].filter(Boolean).join(' ') || '-' }}
                                    </span>
                                </h5>
                                <p class="text-default-400 mb-3">
                                    {{ userData?.designation || '-' }}
                                </p>
                                <span class="badge badge-label bg-light text-dark">
                                    {{ userData?.role || (userData?.roles && userData.roles.length ? userData.roles[0].name : '-') }}
                                </span>
                            </div>
                        </div>
                        <div class="hs-dropdown relative inline-flex [--placement:bottom-right]">
                            <button type="button"
                                class="hs-dropdown-toggle btn btn-icon hover:bg-default-100 focus:bg-default-100"
                                aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                                <i class="iconify tabler--dots-vertical text-default-400 text-xl"></i>
                            </button>
                            <div class="hs-dropdown-menu" role="menu" aria-orientation="vertical" >
                                <router-link class="dropdown-item" :to="{ name: 'edit-user', params: { uuid: userData?.uuid } }">Edit Profile</router-link>

                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col gap-y-3">
                        <!-- <div class="flex items-center gap-3">
                            <div>
                                <div class="btn btn-icon bg-light size-8!">
                                    <i class="iconify tabler--school text-secondary text-lg"></i>
                                </div>
                            </div>
                            <!-- <p class="text-sm">
                                Studied at
                                <span class="text-dark font-semibold">{{ userData?.education || '-' }}</span>
                            </p>
                        </div> -->
                        <div class="flex items-center gap-3">
                            <div>
                                <div class="btn btn-icon bg-light size-8!">
                                    <i class="iconify tabler--map-pin text-secondary text-lg"></i>
                                </div>
                            </div>
                            <p class="text-sm">
                                Lives in
                                <span class="text-dark font-semibold">
                                    {{ [userData?.city, userData?.country].filter(Boolean).join(', ') || '-' }}
                                </span>
                            </p>
                        </div>
                        <div class="flex items-center gap-3">
                            <div>
                                <div class="btn btn-icon bg-light size-8!">
                                    <i class="iconify tabler--users text-secondary text-lg"></i>
                                </div>
                            </div>
                            <p class="text-sm">
                                Works in
                                <span class="text-dark font-semibold">{{ userData?.department || '-' }}</span>
                            </p>
                        </div>
                        <div class="flex items-center gap-3">
                            <div>
                                <div class="btn btn-icon bg-light size-8!">
                                    <i class="iconify tabler--mail text-secondary text-lg"></i>
                                </div>
                            </div>
                            <p class="text-sm">
                                Email
                                <a v-if="userData?.email" :href="`mailto:${userData.email}`" class="text-primary font-semibold">{{ userData.email }}</a>
                                <span v-else>-</span>
                            </p>
                        </div>
                        <div class="flex items-center gap-3">
                            <div>
                                <div class="btn btn-icon bg-light size-8!">
                                    <i class="iconify tabler--link text-secondary text-lg"></i>
                                </div>
                            </div>
                            <p class="text-sm">
                                User ID <span class="text-default-400 text-xs">({{ 'UR00' + userData.id }})</span>
                            </p>
                        </div>
                        <div class="flex items-center gap-3">
                            <div>
                                <div class="btn btn-icon bg-light size-8!">
                                    <i class="iconify tabler--world text-secondary text-lg"></i>
                                </div>
                            </div>
                            <p class="text-sm">
                                Languages
                                <span class="text-dark font-semibold">
                                    {{ (userData?.languages && userData.languages.length) ? userData.languages.join(', ') : '-' }}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Details Section -->
            <div class="xl:col-span-2 space-y-6">
                <!-- About Card -->
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">About User</h4>
                    </div>
                    <div class="card-body">
                        <p>
                            <strong>{{ userData?.name || [userData?.first_name, userData?.last_name].filter(Boolean).join(' ') }}</strong>
                            <span v-if="userData?.about">&nbsp;{{ userData.about }}</span>
                            <span v-else>
                                is a passionate professional with experience in
                                <span class="text-primary font-semibold">{{ userData?.designation || '-' }}</span>.
                            </span>
                        </p>
                        <p class="mt-5" v-if="userData?.profile_summary">
                            {{ userData.profile_summary }}
                        </p>
                    </div>
                </div>
                <!-- Basic Information Card -->
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">Basic Information</h4>
                    </div>
                    <div class="card-body">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-x-base gap-y-5">
                            <div>
                                <p class="text-default-400 mb-1.25 font-medium">Phone</p>
                                <p>{{ userData?.phone || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-default-400 mb-1.25 font-medium">Email</p>
                                <p>{{ userData?.email || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-default-400 mb-1.25 font-medium">Gender</p>
                                <p>{{ userData?.gender || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-default-400 mb-1.25 font-medium">Birthday</p>
                                <p>{{ userData?.dob || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-default-400 mb-1.25 font-medium">Address</p>
                                <p>{{ userData?.address || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-default-400 mb-1.25 font-medium">Nationality</p>
                                <p>{{ userData?.nationality || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-default-400 mb-1.25 font-medium">Blood Group</p>
                                <p>{{ userData?.blood_group || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-default-400 mb-1.25 font-medium">Shift</p>
                                <p>{{ userData?.shift || '-' }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Emergency Contact Card -->
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">Emergency Contact Details</h4>
                    </div>
                    <div class="card-body">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-x-base gap-y-5">
                            <div>
                                <p class="text-default-400 mb-1.25 font-medium">Contact Name</p>
                                <p>{{ userData?.emergency_contact_name || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-default-400 mb-1.25 font-medium">Relationship</p>
                                <p>{{ userData?.emergency_relationship || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-default-400 mb-1.25 font-medium">Phone</p>
                                <p>{{ userData?.emergency_phone || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-default-400 mb-1.25 font-medium">Alternate Phone</p>
                                <p>{{ userData?.emergency_alt_phone || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-default-400 mb-1.25 font-medium">Email</p>
                                <p>{{ userData?.emergency_email || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-default-400 mb-1.25 font-medium">Address</p>
                                <p>{{ userData?.emergency_address || '-' }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Financial Details Card -->
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">Financial Details</h4>
                    </div>
                    <div class="card-body">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-x-base gap-y-5">
                            <div>
                                <p class="text-default-400 mb-1.25 font-medium">Bank Name</p>
                                <p>{{ userData?.bank_name || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-default-400 mb-1.25 font-medium">Account Number</p>
                                <p>{{ userData?.bank_account_number || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-default-400 mb-1.25 font-medium">IFSC / SWIFT Code</p>
                                <p>{{ userData?.ifsc || userData?.swift || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-default-400 mb-1.25 font-medium">Branch</p>
                                <p>{{ userData?.bank_branch || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-default-400 mb-1.25 font-medium">PAN / Tax ID</p>
                                <p>{{ userData?.tax_id || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-default-400 mb-1.25 font-medium">Salary (Monthly)</p>
                                <p>{{ userData?.salary ? (`USD $${userData.salary}`) : '-' }}</p>
                            </div>
                            <div>
                                <p class="text-default-400 mb-1.25 font-medium">Payment Mode</p>
                                <p>{{ userData?.payment_mode || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-default-400 mb-1.25 font-medium">PF Number</p>
                                <p>{{ userData?.pf_number || '-' }}</p>
                            </div>
                            <div>
                                <p class="text-default-400 mb-1.25 font-medium">ESI Number</p>
                                <p>{{ userData?.esi_number || '-' }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
