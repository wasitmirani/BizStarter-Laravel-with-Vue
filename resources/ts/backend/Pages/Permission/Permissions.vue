<script setup lang="ts">
import { usePermissions } from "./Composables/usePermission";
import PermissionsTable from './PermissionsTable.vue'
import PermissionFilterForm from './PermissionFilterForm.vue'
import OffCanvas from "../../Components/OffCanvas.vue"
import { perPageOptions, dateRanges } from './Composables/usePermissionFilter';
import ActiveFilters from '../../Components/ActiveFilters.vue'

import { Helpers } from '../../Utils/Helper'

const {
    users,
    permissions,
    currentPage,
    isLoading,
    filters,
    sortableFilterOptions,
    fetchPermissions,
    handleFilterChange,
    handleSearchChange,
    handleSearchQuery,
    setLoading,
    filterData,
    init
} = usePermissions()

Helpers.useDynamicOnMounted(() => {
    init()
})



</script>

<template>
    <div>
        <!-- Breadcrumb  -->
        <BreadcrumbComponent :current="'Permissions'" :links="[{ name: 'Dashboard', route: 'dashboard' }]" />

        <div class="container-fluid">


            <div data-table="" data-table-rows-per-page="8" class="card">
                <div class="card-header">
                    <!-- Search -->
                    <div class="flex flex-wrap gap-2.5">
                        <!-- Search Input -->
                        <SearchInput label="Search Permissions" :apiPath="`/permission`" @loading="setLoading"
                            @filterData="filterData" @query="handleSearchQuery"></SearchInput>
                        <div class="flex gap-1">
                            <router-link :to="{ name: 'create-permission' }"
                                class="btn bg-primary text-white hover:bg-primary-hover" aria-haspopup="dialog"
                                aria-expanded="false" aria-controls="incomeModal" data-hs-overlay="#incomeModal"> <i
                                    class="iconify tabler--plus"></i> Add Permission </router-link>
                        </div>
                        <!-- Delete Selected -->
                        <button data-table-delete-selected=""
                            class="btn bg-danger text-white hover:bg-danger-hover hidden">Delete</button>
                    </div>

                    <div class="flex flex-wrap items-center gap-3">
                        <div class="items-center gap-3 md:flex">
                            <span class="me-3 font-semibold text-nowrap">Filter By:</span>
                            <!-- Permission Type Filter -->
                            <div class="input-icon-group">
                                <i class="iconify tabler--user-hexagon input-icon"></i>

                            </div>
                            <div class="input-icon-group">
                                            <i class="iconify tabler--calendar input-icon"></i>
                                            <select data-table-range-filter="date" class="form-select"  @change="handleFilterChange(filters)" v-model="filters.date_range">
                                                <option value="" >Date Range</option>

                                                <option v-for="item in dateRanges" :key="item.value" :value="item.value">
                                        {{ item.label }}
                                    </option>

                                            </select>
                                        </div>

                            <!-- Permission Type Filter -->
                            <div class="input-icon-group">
                                <i class="iconify tabler--list-details input-icon"></i>

                                <select id="filterPerPage" @change="handleFilterChange(filters)"
                                    v-model="filters.per_page" class="form-select w-full">
                                    <option v-for="option in perPageOptions" :key="option.value" :value="option.value">
                                        {{ option.label }}
                                    </option>
                                </select>
                            </div>


                        </div>
                        <!-- Active Filters -->
                        <ActiveFilters routeName="permissions" @filterChange="handleFilterChange($event)" />
                    </div>
                    <div>
                        <nav class="flex items-center gap-x-1">
                            <a role="button" @click="fetchPermissions()"
                                class="btn bg-primary/15 text-primary btn-icon hover:bg-primary hover:text-white">
                                <i class="iconify tabler--refresh text-lg"></i>
                            </a>

                            <OffCanvas id="offcanvasRight" title="Advance Filters"
                                buttonClass="btn bg-primary btn-icon text-white hover:bg-primary-hover"
                                buttonLabel="Filter">
                                <template #button-icon>
                                    <i class="iconify tabler--filter text-lg"></i>
                                </template>
                                <template #body>
                                    <PermissionFilterForm :initialFilters="filters" @filterChange="handleFilterChange" />
                                </template>
                            </OffCanvas>
                        </nav>
                    </div>
                </div>
                <PermissionsTable :permissions="permissions" :getPermissions="fetchPermissions" :isLoading="isLoading" :currentFilters="filters" />
            </div>
        </div>
    </div>
</template>
