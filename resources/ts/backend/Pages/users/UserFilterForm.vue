<script setup lang="ts">
import { Helpers } from '../../Utils/Helper';

interface Props {
    initialFilters?: {
        search: string;
        role: string;
        status: string;
        date_from: string;
        date_to: string;
        sort_by: string;
        sort_dir: string;
        per_page: string;
    };
}

const props = withDefaults(defineProps<Props>(), {
    initialFilters: () => ({
        search: '',
        role: '',
        status: '',
        date_from: '',
        date_to: '',
        sort_by: 'id',
        sort_dir: 'desc',
        per_page: '10',
    })
});

const emit = defineEmits<{
    filterChange: [filters: any]
}>();

const filters = Helpers.useDynamicReactive({
    search: props.initialFilters.search || '',
    role: props.initialFilters.role || '',
    status: props.initialFilters.status || '',
    date_from: props.initialFilters.date_from || '',
    date_to: props.initialFilters.date_to || '',
    sort_by: props.initialFilters.sort_by || 'id',
    sort_dir: props.initialFilters.sort_dir || 'desc',
    per_page: props.initialFilters.per_page || '10',
});

const roles = [
    { value: '', label: 'All Roles' },
    { value: 'Security Officer', label: 'Security Officer' },
    { value: 'Project Manager', label: 'Project Manager' },
    { value: 'Developer', label: 'Developer' },
    { value: 'Support Lead', label: 'Support Lead' },
];

const statuses = [
    { value: '', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Suspended', label: 'Suspended' },
];

const sortOptions = [
    { value: 'id', label: 'ID' },
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'created_at', label: 'Date Created' },
    { value: 'updated_at', label: 'Last Updated' },
];

const sort_dirOptions = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
];

const perPageOptions = [
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '15', label: '15' },
    { value: '20', label: '20' },
    { value: '50', label: '50' },
];

const onSubmit = () => {
    console.log('Filters Applied:', filters);
    emit('filterChange', { ...filters });
};

const resetFilters = () => {
    filters.search = '';
    filters.role = '';
    filters.status = '';
    filters.date_from = '';
    filters.date_to = '';
    filters.sort_by = 'id';
    filters.sort_dir = 'asc';
    filters.per_page = '10';
    emit('filterChange', { ...filters });
};

</script>
<template>
    <form @submit.prevent="onSubmit" class="space-y-4">
        <!-- Search Input -->
        <div>
            <label for="filterSearch" class="form-label text-sm font-medium">Search</label>
            <input
                type="text"
                id="filterSearch"
                v-model="filters.search"
                class="form-input w-full"
                placeholder="Search by name or email..."
            >
        </div>

        <!-- Role Filter -->
        <div>
            <label for="filterRole" class="form-label text-sm font-medium">Role</label>
            <select
                id="filterRole"
                v-model="filters.role"
                class="form-select w-full"
            >
                <option
                    v-for="role in roles"
                    :key="role.value"
                    :value="role.value"
                >
                    {{ role.label }}
                </option>
            </select>
        </div>

        <!-- Status Filter -->
        <div>
            <label for="filterStatus" class="form-label text-sm font-medium">Status</label>
            <select
                id="filterStatus"
                v-model="filters.status"
                class="form-select w-full"
            >
                <option
                    v-for="status in statuses"
                    :key="status.value"
                    :value="status.value"
                >
                    {{ status.label }}
                </option>
            </select>
        </div>

        <!-- Date Range -->
        <div class="grid grid-cols-2 gap-3">
            <div>
                <label for="filterDateFrom" class="form-label text-sm font-medium">From Date</label>
                <input
                    type="date"
                    id="filterDateFrom"
                    v-model="filters.date_from"
                    class="form-input w-full"
                >
            </div>
            <div>
                <label for="filterDateTo" class="form-label text-sm font-medium">To Date</label>
                <input
                    type="date"
                    id="filterDateTo"
                    v-model="filters.date_to"
                    class="form-input w-full"
                >
            </div>
        </div>

        <!-- Sort Options -->
        <div class="grid grid-cols-2 gap-3">
            <div>
                <label for="filterSortBy" class="form-label text-sm font-medium">Sort By</label>
                <select
                    id="filterSortBy"
                    v-model="filters.sort_by"
                    class="form-select w-full"
                >
                    <option
                        v-for="option in sortOptions"
                        :key="option.value"
                        :value="option.value"
                    >
                        {{ option.label }}
                    </option>
                </select>
            </div>
            <div>
                <label for="filtersort_dir" class="form-label text-sm font-medium">sort_dir</label>
                <select
                    id="filtersort_dir"
                    v-model="filters.sort_dir"
                    class="form-select w-full"
                >
                    <option
                        v-for="option in sort_dirOptions"
                        :key="option.value"
                        :value="option.value"
                    >
                        {{ option.label }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Per Page -->
        <div>
            <label for="filterPerPage" class="form-label text-sm font-medium">Items Per Page</label>
            <select
                id="filterPerPage"
                v-model="filters.per_page"
                class="form-select w-full"
            >
                <option
                    v-for="option in perPageOptions"
                    :key="option.value"
                    :value="option.value"
                >
                    {{ option.label }}
                </option>
            </select>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2 pt-4 bsort_dir-t bsort_dir-default-200">
            <button
                type="submit"
                class="btn bsort_dir-primary text-primary hover:bg-primary hover:text-white"
            >
                <i class="iconify tabler--filter me-2"></i>
                Apply Filters
            </button>
            <button
                type="button"
                @click="resetFilters"
                class="btn bsort_dir-danger text-danger hover:bg-danger hover:text-white"
            >
                <i class="iconify tabler--refresh me-2"></i>
                Reset
            </button>
        </div>
    </form>

</template>
