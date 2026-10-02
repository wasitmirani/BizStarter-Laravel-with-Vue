<script setup lang="ts">
import { useTenants } from './Composables/useTenant';
import TenantTable from './TenantTable.vue';
import TenantCard from '../../Components/TenantCard.vue';
import { Helpers } from '../../Utils/Helper';

const {
    tenants,
    isLoading,
    filters,
    fetchTenants,
    handleFilterChange,
    handleSearchQuery,
    init,
} = useTenants();

const searchTerm = Helpers.useDynamicRef('');

const tenantRows = Helpers.useDynamicComputed(() => {
    const value = tenants.value as any;
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return value.data ?? [];
});

const onSearchSubmit = () => {
    handleSearchQuery(searchTerm.value);
};

Helpers.useDynamicOnMounted(() => {
    init();
    searchTerm.value = filters.search || '';
});
</script>

<template>
    <div>
        <BreadcrumbComponent :current="'Tenants'" :links="[{ name: 'Dashboard', route: 'dashboard' }]" />

        <div class="row g-4 mb-4">
            <div class="col-md-9 col-xxl-6">
                <h5 class="mb-1 fs-17">Tenants List</h5>
                <p class="text-muted mb-0">
                    Manage and organize tenants with domains, branding, and access status.
                </p>
            </div>
            <div class="col-md-3 col-xxl-6">
                <div class="d-flex justify-content-end">
                    <router-link :to="{ name: 'create-tenant' }" class="btn btn-primary avatar flex-shrink-0">
                        <i class="mgc_add_line me-1 fs-sm"></i> Add New Tenant
                    </router-link>
                </div>
            </div>
        </div>

        <!-- Cards only when tenants exist -->
        <div v-if="tenantRows.length" class="row gx-5 mb-5">
            <div
                v-for="(tenant, index) in tenantRows"
                :key="tenant.id"
                class="col-md-6 col-lg-4 col-xxl-3 mb-4"
            >
                <TenantCard :tenant="tenant" :index="index" :onRefresh="fetchTenants" />
            </div>
        </div>

        <div class="card">
            <div class="card-header d-flex align-items-center justify-content-between flex-wrap gap-3">
                <h5 class="card-title mb-0">All Tenants</h5>
                <div class="d-flex flex-wrap gap-3 align-items-center">
                    <div>
                        <label for="searchTenantInput" class="form-label d-none">Search</label>
                        <div class="position-relative">
                            <input
                                type="text"
                                class="form-control bg-light-subtle border-0 pe-9"
                                id="searchTenantInput"
                                placeholder="Search for Tenants..."
                                v-model="searchTerm"
                                @keyup.enter="onSearchSubmit"
                            />
                            <a href="#!" @click.prevent="onSearchSubmit">
                                <i class="mgc_search_ai_line position-absolute top-50 end-0 me-3 translate-middle-y text-muted"></i>
                            </a>
                        </div>
                    </div>

                    <select
                        class="form-select bg-body-secondary border text-muted w-auto"
                        v-model="filters.status"
                        @change="handleFilterChange(filters)"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                    </select>

                    <a
                        href="#!"
                        class="btn bg-body-secondary border text-muted btn-icon"
                        aria-label="Refresh"
                        @click.prevent="fetchTenants()"
                    >
                        <i class="mgc_refresh_2_line"></i>
                    </a>
                </div>
            </div>

            <TenantTable
                :tenants="tenants"
                :getTenants="fetchTenants"
                :isLoading="isLoading"
                :currentFilters="filters"
            />
        </div>
    </div>
</template>
