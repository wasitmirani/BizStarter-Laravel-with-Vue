<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { UserService } from '../../Services/user/UserService';
import UserTable from './UserTable.vue';
import UserFilterForm from './UserFilterForm.vue';
import OffCanvas from "../../Components/OffCanvas.vue";
import { DropdownOptions } from '../../Utils/DropdownOptions';
import RoleCard from '../../Components/RoleCard.vue';
import { Helpers } from '../../Utils/Helper';
import { testmethod } from './user';

const route = useRoute();
const router = useRouter();


const users = Helpers.useDynamicRef([]);
let roles = Helpers.useDynamicReactive([]);
const current_page = Helpers.useDynamicRef(1);
const toast = Helpers.useDynamicInject('toast');
const isLoading = Helpers.useDynamicRef(false);
const sortableFilterOptions = DropdownOptions.sortableFilterOptions();

// Reactive filter state
const filters = Helpers.useDynamicReactive({
    search: '',
    role: '',
    status: '',
    page: 1,
    per_page: 20,
    sort_by: 'id',
    paginated:true,
    sort_dir: 'desc',
    date_from: '',
    date_to: '',
});

// Function to update URL with all query parameters
const updateUrlWithFilters = () => {
    const query = { ...route.query };

    // Update query parameters
    Object.keys(filters).forEach(key => {
        const value = filters[key];
        if (value && value !== '' && !(key === 'page' && value === 1)) {
            query[key] = value.toString();
        } else {
            delete query[key];
        }
    });

    router.replace({ query });
};

// Function to load filters from URL query parameters
const loadFiltersFromUrl = () => {
    const query = route.query;

    filters.search = query.search?.toString() || '';
    filters.role = query.role?.toString() || '';
    filters.status = query.status?.toString() || '';
    filters.page = parseInt(query.page?.toString() || '1');
    filters.per_page = parseInt(query.per_page?.toString() || '10');
    filters.sort_by = query.sort_by?.toString() || 'id';
    filters.sort_dir = query.sort_dir?.toString() || 'desc';
    filters.date_from = query.date_from?.toString() || '';
    filters.date_to = query.date_to?.toString() || '';
    filters.paginated=query.paginated === 'false' ? false : true;

    current_page.value = filters.page;
};

const getUsers = async (page?: number, per_page?: number) => {
    // Update filters if parameters provided
    if (page !== undefined) filters.page = page;
    if (per_page !== undefined) filters.per_page = per_page;

    current_page.value = filters.page;
    isLoading.value = true;

    // Build query parameters for API call
    const params = {
        page: filters.page.toString(),
        per_page: filters.per_page.toString(),
        search: filters.search || undefined,
        role: filters.role || undefined,
        status: filters.status || undefined,
        sort_by: filters.sort_by || undefined,
        sort_dir: filters.sort_dir || undefined,
        date_from: filters.date_from || undefined,
        date_to: filters.date_to || undefined,

        paginated: filters.paginated,
    };

    // Remove undefined values
    Object.keys(params).forEach(key => {
        if (params[key] === undefined) delete params[key];
    });

    await UserService.users(params).then((res) => {
        users.value = res.data.result.users;
        roles = res.data.result.roles;
        console.log("res:", roles);
                    // toast.value.showToast(res.status, 'User Data', res.data);
    }).catch((err: any) => {
        console.log("err:", err.response.data.message);
        toast.value.showToast(err.status, 'Error: ' + err.status, err.response.data.message);
    });

    setTimeout(() => {
        isLoading.value = false;
    }, 1000);
};

// Function to handle filter changes from UserFilterForm
const handleFilterChange = (newFilters: any) => {
    Object.assign(filters, newFilters);
    filters.page = 1; // Reset to first page when filters change
    updateUrlWithFilters();
    getUsers();
};

// Function to handle search input changes
const handleSearchChange = (searchTerm: string) => {
    filters.search = searchTerm;
    filters.page = 1; // Reset to first page when search changes
    updateUrlWithFilters();
    getUsers();
};

// Function to handle SearchInput query event
const handleSearchQuery = (query: string) => {
    handleSearchChange(query);
};

function loadingStart(value: any) {
    isLoading.value = value;
}

function filterData(data: any) {
    users.value = data.result.users;
}

Helpers.useDynamicOnMounted(() => {
    loadFiltersFromUrl();
    getUsers();
});


</script>

<template>
    <div>
        <!-- Breadcrumb  -->
        <BreadcrumbComponent :current="'Users'" :links="[{ name: 'Dashboard', route: 'dashboard' }]" />

        <div class="container-fluid">
            <div class="mb-base grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-base">
                <RoleCard :items="roles" v-if="roles?.length > 0"></RoleCard>
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
                                <select
                                    data-table-filter="roles"
                                    class="form-select"
                                    v-model="filters.role"
                                    @change="handleFilterChange(filters)"
                                >
                                    <option value="">All Roles</option>
                                    <option value="Security Officer">Security Officer</option>
                                    <option value="Project Manager">Project Manager</option>
                                    <option value="Developer">Developer</option>
                                    <option value="Support Lead">Support Lead</option>
                                </select>
                            </div>
                        </div>

                        <!-- Status Filter -->
                        <div class="input-icon-group">
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
                        </div>
                    </div>

                    <div>
                        <nav class="flex items-center gap-x-1">
                            <a role="button" @click="getUsers()"
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
                    :getUsers="getUsers"
                    :isLoading="isLoading"
                    :currentFilters="filters"
                />
            </div>

            <!--End::row-1 -->

        </div>
    </div>
</template>
