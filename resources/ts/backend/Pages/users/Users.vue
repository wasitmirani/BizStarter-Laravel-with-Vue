<script setup lang="ts">
import { useUsers } from "./Composables/useUser"
import UserTable from './UserTable.vue'
import UserFilterForm from './UserFilterForm.vue'
import OffCanvas from "../../Components/OffCanvas.vue"
import RoleCard from '../../Components/RoleCard.vue'
import { Helpers } from '../../Utils/Helper'

const {
    users,
    roles,
    currentPage,
    isLoading,
    filters,
    sortableFilterOptions,
    fetchUsers,
    handleFilterChange,
    handleSearchChange,
    handleSearchQuery,
    setLoading,
    filterData,
    init
} = useUsers()

Helpers.useDynamicOnMounted(() => {
    init()
})


</script>

<template>
    <div>
        <!-- Breadcrumb  -->
        <BreadcrumbComponent :current="'Users'" :links="[{ name: 'Dashboard', route: 'dashboard' }]" />

        <div class="container-fluid">
            <div class="mb-base grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-base">
                <!-- <RoleCard :items="roles" v-if="roles?.length > 0"></RoleCard> -->
            </div>

            <div data-table="" data-table-rows-per-page="8" class="card">
                <div class="card-header">
                    <!-- Search -->
                    <div class="flex flex-wrap gap-2.5">
                        <!-- Search Input -->
                        <SearchInput
                            label="Search Users"
                            :apiPath="`/user`"
                            @loading="loadingStart"
                            @filterData="filterData"
                            @query="handleSearchQuery"></SearchInput>

                        <div class="flex gap-1">
                              <router-link
                                :to="{ name: 'create-user' }"

                           class="btn bg-primary text-white hover:bg-primary-hover"
                                aria-haspopup="dialog" aria-expanded="false" aria-controls="incomeModal"
                                data-hs-overlay="#incomeModal"> <i class="iconify tabler--plus"></i> Add User </router-link>
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
                                <select data-table-filter="roles"  class="form-select" v-model="filters.role" @change="handleFilterChange(filters)">
                                    <option value="">All Roles</option>
                                    <option :value="role.value" v-for="role in roles">{{ role.label.charAt(0).toUpperCase() + role.label.slice(1) }}</option>

                                </select>
                            </div>
                        </div>

                        <!-- Status Filter -->
                        <!-- <div class="input-icon-group">
                            <i class="iconify tabler--user-check input-icon"></i>
                            <select
                                data-table-filter="status"
                                class="form-select"
                                v-model="filters.status"
                                @change="handleFilterChange(filters)"
                            >
                                <option value="">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </div> -->
                    </div>

                    <div>
                        <nav class="flex items-center gap-x-1">
                    <a role="button" @click="fetchUsers()"
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
                                    <UserFilterForm
                                        :initialFilters="filters"
                                        @filterChange="handleFilterChange"
                                    />
                                </template>
                            </OffCanvas>
                        </nav>
                    </div>
                </div>
                <UserTable
                    :users="users"
                    :getUsers="fetchUsers"
                    :isLoading="isLoading"
                    :currentFilters="filters"
                />
            </div>

            <!--End::row-1 -->

        </div>
    </div>
</template>
