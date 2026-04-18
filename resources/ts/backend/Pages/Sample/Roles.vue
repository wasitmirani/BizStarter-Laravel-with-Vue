<script setup lang="ts">
import { useRoles } from "./Composables/useRole"
import RolesTable from './RolesTable.vue'
import RoleFilterForm from './RoleFilterForm.vue'
import OffCanvas from "../../Components/OffCanvas.vue"
import RoleCard from '../../Components/RoleCard.vue'
import { perPageOptions, dateRanges } from './Composables/useRoleFilter';
import ActiveFilters from '../../Components/ActiveFilters.vue'

import { Helpers } from '../../Utils/Helper'

const {
    users,
    roles,
    currentPage,
    isLoading,
    filters,
    sortableFilterOptions,
    fetchRoles,
    handleFilterChange,
    handleSearchChange,
    handleSearchQuery,
    setLoading,
    filterData,
    init
} = useRoles()

Helpers.useDynamicOnMounted(() => {
    init()
})



</script>

<template>
    <div>
        <!-- Breadcrumb  -->
        <BreadcrumbComponent :current="'Roles'" :links="[{ name: 'Dashboard', route: 'dashboard' }]" />

        <div class="container-fluid">
            <div class="mb-base grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-base">
                <RoleCard v-if="roles?.length > 0"></RoleCard>
            </div>

            <div data-table="" data-table-rows-per-page="8" class="card">
                <div class="card-header">
                    <!-- Search -->
                    <div class="flex flex-wrap gap-2.5">
                        <!-- Search Input -->
                        <SearchInput label="Search Roles" :apiPath="`/role`" @loading="setLoading"
                            @filterData="filterData" @query="handleSearchQuery"></SearchInput>
                        <div class="flex gap-1">
                            <router-link :to="{ name: 'create-role' }"
                                class="btn bg-primary text-white hover:bg-primary-hover" aria-haspopup="dialog"
                                aria-expanded="false" aria-controls="incomeModal" data-hs-overlay="#incomeModal"> <i
                                    class="iconify tabler--plus"></i> Add Role </router-link>
                        </div>
                        <!-- Delete Selected -->
                        <button data-table-delete-selected=""
                            class="btn bg-danger text-white hover:bg-danger-hover hidden">Delete</button>
                    </div>

                    <div class="flex flex-wrap items-center gap-3">
                        <div class="items-center gap-3 md:flex">
                            <span class="me-3 font-semibold text-nowrap">Filter By:</span>
                            <!-- Role Type Filter -->
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

                            <!-- Role Type Filter -->
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
                        <ActiveFilters routeName="roles" @filterChange="handleFilterChange($event)" />
                    </div>
                    <div>
                        <nav class="flex items-center gap-x-1">
                            <a role="button" @click="fetchRoles()"
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
                                    <RoleFilterForm :initialFilters="filters" @filterChange="handleFilterChange" />
                                </template>
                            </OffCanvas>
                        </nav>
                    </div>
                </div>
                <RolesTable :roles="roles" :getRoles="fetchRoles" :isLoading="isLoading" :currentFilters="filters" />
            </div>
        </div>
    </div>
</template>
