<script setup lang="ts">
import {
    useTenantFilter,
    statuses,
    sortOptions,
    sortDirOptions,
    perPageOptions,
    defaultFilters,
    type TenantFilters,
} from './Composables/useTenantFilter';

interface Props {
    initialFilters?: TenantFilters;
}

const props = withDefaults(defineProps<Props>(), {
    initialFilters: () => ({ ...defaultFilters }),
});

const emit = defineEmits<{
    filterChange: [filters: TenantFilters];
}>();

const { filters, onSubmit, resetFilters } = useTenantFilter(props.initialFilters, emit);
</script>

<template>
    <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
            <label for="filterSearch" class="form-label text-sm font-medium">Search</label>
            <input
                type="text"
                id="filterSearch"
                v-model="filters.search"
                class="form-input w-full"
                placeholder="Search by name, email or domain..."
            />
        </div>

        <div>
            <label for="filterStatus" class="form-label text-sm font-medium">Status</label>
            <select id="filterStatus" v-model="filters.status" class="form-select w-full">
                <option v-for="status in statuses" :key="status.value" :value="status.value">
                    {{ status.label }}
                </option>
            </select>
        </div>

        <div>
            <label for="filterSortBy" class="form-label text-sm font-medium">Sort By</label>
            <select id="filterSortBy" v-model="filters.sort_by" class="form-select w-full">
                <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                </option>
            </select>
        </div>

        <div>
            <label for="filterSortDir" class="form-label text-sm font-medium">Sort Direction</label>
            <select id="filterSortDir" v-model="filters.sort_dir" class="form-select w-full">
                <option v-for="option in sortDirOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                </option>
            </select>
        </div>

        <div>
            <label for="filterPerPage" class="form-label text-sm font-medium">Per Page</label>
            <select id="filterPerPage" v-model="filters.per_page" class="form-select w-full">
                <option v-for="option in perPageOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                </option>
            </select>
        </div>

        <div class="flex gap-2 pt-2">
            <button type="submit" class="btn bg-primary text-white hover:bg-primary-hover flex-1">Apply</button>
            <button type="button" class="btn bg-default-100 hover:bg-default-200 flex-1" @click="resetFilters">
                Reset
            </button>
        </div>
    </form>
</template>
