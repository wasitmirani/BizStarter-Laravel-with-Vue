<script setup lang="ts">
import {
    useUserFilter,
    roles, statuses, sortOptions, sortDirOptions, perPageOptions,
    defaultFilters,
    type UserFilters,
} from './Composables/useUserFilter';

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    initialFilters?: UserFilters;
}

const props = withDefaults(defineProps<Props>(), {
    initialFilters: () => ({ ...defaultFilters }),
});

// ─── Emits ────────────────────────────────────────────────────────────────────

const emit = defineEmits<{
    filterChange: [filters: UserFilters]
}>();

// ─── Composable (all logic lives in useUserFilter.ts) ─────────────────────────

const { filters, onSubmit, resetFilters } = useUserFilter(props.initialFilters, emit);
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
                        v-for="option in sortDirOptions"
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
