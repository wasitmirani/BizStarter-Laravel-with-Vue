<script setup lang="ts">
import { useTenantForm } from './Composables/useTenantForm';

const props = defineProps(['isEditMode', 'tenantData']);

const {
    tenant,
    errors,
    isLoading,
    showPassword,
    onSubmit,
    togglePassword,
    generatePassword,
    copyPassword,
} = useTenantForm(props?.tenantData, props?.isEditMode);
</script>

<template>
    <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="card-title mb-0">
                {{ isEditMode ? 'Update Tenant' : 'Add New Tenant' }}
            </h5>
        </div>
        <form @submit.prevent="onSubmit">
            <div class="card-body">
                <h6 class="mb-3">Tenant Details</h6>
                <div class="row g-4 mb-4">
                    <div class="col-md-6 col-lg-4">
                        <label class="form-label" for="tenantName">Tenant Name</label>
                        <input
                            id="tenantName"
                            v-model="tenant.name"
                            type="text"
                            class="form-control"
                            placeholder="Acme Corp"
                            :class="{ 'is-invalid': errors?.name }"
                        />
                        <validate-input v-if="errors" :errors="errors" value="name" />
                    </div>
                    <div class="col-md-6 col-lg-4">
                        <label class="form-label" for="tenantEmail">Contact Email</label>
                        <input
                            id="tenantEmail"
                            v-model="tenant.email"
                            type="email"
                            class="form-control"
                            placeholder="admin@acme.test"
                            :class="{ 'is-invalid': errors?.email }"
                        />
                        <validate-input v-if="errors" :errors="errors" value="email" />
                    </div>
                    <div class="col-md-6 col-lg-4">
                        <label class="form-label" for="tenantDomain">Primary Domain</label>
                        <input
                            id="tenantDomain"
                            v-model="tenant.domain"
                            type="text"
                            class="form-control"
                            placeholder="acme.larakit.test"
                            :class="{ 'is-invalid': errors?.domain }"
                        />
                        <validate-input v-if="errors" :errors="errors" value="domain" />
                    </div>
                    <div class="col-md-6 col-lg-4">
                        <label class="form-label" for="tenantStatus">Status</label>
                        <select id="tenantStatus" v-model="tenant.status" class="form-select">
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                        </select>
                        <validate-input v-if="errors" :errors="errors" value="status" />
                    </div>
                    <div class="col-md-6 col-lg-4">
                        <label class="form-label" for="tenantTimezone">Timezone</label>
                        <input
                            id="tenantTimezone"
                            v-model="tenant.timezone"
                            type="text"
                            class="form-control"
                            placeholder="UTC"
                        />
                        <validate-input v-if="errors" :errors="errors" value="timezone" />
                    </div>
                    <div class="col-md-6 col-lg-4">
                        <label class="form-label" for="tenantLocale">Locale</label>
                        <input
                            id="tenantLocale"
                            v-model="tenant.locale"
                            type="text"
                            class="form-control"
                            placeholder="en"
                        />
                        <validate-input v-if="errors" :errors="errors" value="locale" />
                    </div>
                </div>

                <h6 class="mb-3">Branding</h6>
                <div class="row g-4 mb-4">
                    <div class="col-md-6 col-lg-4">
                        <label class="form-label" for="tenantLogo">Logo Path / URL</label>
                        <input
                            id="tenantLogo"
                            v-model="tenant.logo"
                            type="text"
                            class="form-control"
                            placeholder="optional"
                        />
                    </div>
                    <div class="col-md-6 col-lg-4">
                        <label class="form-label" for="tenantColor">Primary Color</label>
                        <div class="input-group">
                            <input v-model="tenant.primary_color" type="color" class="form-control form-control-color" />
                            <input
                                id="tenantColor"
                                v-model="tenant.primary_color"
                                type="text"
                                class="form-control"
                                placeholder="#4f46e5"
                            />
                        </div>
                    </div>
                </div>

                <template v-if="!isEditMode">
                    <h6 class="mb-3">Tenant Admin Account</h6>
                    <div class="row g-4">
                        <div class="col-md-6 col-lg-4">
                            <label class="form-label" for="adminName">Admin Name</label>
                            <input
                                id="adminName"
                                v-model="tenant.admin_name"
                                type="text"
                                class="form-control"
                                placeholder="Jane Admin"
                                :class="{ 'is-invalid': errors?.admin_name }"
                            />
                            <validate-input v-if="errors" :errors="errors" value="admin_name" />
                        </div>
                        <div class="col-md-6 col-lg-4">
                            <label class="form-label" for="adminEmail">Admin Email</label>
                            <input
                                id="adminEmail"
                                v-model="tenant.admin_email"
                                type="email"
                                class="form-control"
                                placeholder="jane@acme.test"
                                :class="{ 'is-invalid': errors?.admin_email }"
                            />
                            <validate-input v-if="errors" :errors="errors" value="admin_email" />
                        </div>
                        <div class="col-md-6 col-lg-4">
                            <label class="form-label" for="adminPassword">Admin Password</label>
                            <div class="input-group">
                                <input
                                    id="adminPassword"
                                    v-model="tenant.admin_password"
                                    :type="showPassword ? 'text' : 'password'"
                                    class="form-control"
                                    placeholder="********"
                                    :class="{ 'is-invalid': errors?.admin_password }"
                                />
                                <button class="btn btn-outline-light" type="button" @click="togglePassword">
                                    <i :class="showPassword ? 'mgc_eye_close_line' : 'mgc_eye_line'"></i>
                                </button>
                                <button class="btn btn-outline-light" type="button" @click="generatePassword">
                                    <i class="mgc_key_2_line"></i>
                                </button>
                                <button class="btn btn-outline-light" type="button" @click="copyPassword">
                                    <i class="mgc_copy_2_line"></i>
                                </button>
                            </div>
                            <validate-input v-if="errors" :errors="errors" value="admin_password" />
                        </div>
                        <div class="col-md-6 col-lg-4">
                            <label class="form-label" for="adminPasswordConfirm">Confirm Password</label>
                            <input
                                id="adminPasswordConfirm"
                                v-model="tenant.admin_password_confirmation"
                                :type="showPassword ? 'text' : 'password'"
                                class="form-control"
                                placeholder="********"
                            />
                            <validate-input v-if="errors" :errors="errors" value="admin_password_confirmation" />
                        </div>
                    </div>
                </template>
            </div>

            <div class="card-footer d-flex justify-content-end gap-2">
                <router-link :to="{ name: 'tenants' }" class="btn btn-outline-light">Cancel</router-link>
                <button type="submit" class="btn btn-primary" :disabled="isLoading">
                    <span v-if="isLoading">Saving...</span>
                    <span v-else>{{ isEditMode ? 'Update Tenant' : 'Create Tenant' }}</span>
                </button>
            </div>
        </form>
    </div>
</template>
