<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { Helpers } from '../Utils/Helper';

const route = useRoute();
const router = useRouter();

type TableColumn = {
    key: string;
    label: string;
    sortable?: boolean;
};

type TableAction = {
    label: string;
    icon: string;
    action: string;
    class?: string;
    condition?: (row: any) => boolean;
};

type BulkAction = {
    label: string;
    action: string;
};

type PaginatedRows<T = any> = {
    data: T[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

const props = defineProps<{
    columns: TableColumn[];
    rows: PaginatedRows;
    isLoading?: boolean;
    actions?: TableAction[];
    fetchData: (page?: number, perPage?: number) => void;
    filters?: Record<string, unknown>;
    enableFilterBar?: boolean;
    enableBulkActions?: boolean;
    bulkActions?: BulkAction[];
    preserveStateKey?: string;
}>();

const emits = defineEmits<{
    (e: 'action', payload: any): void;
    (e: 'update:selectedItems', value: (string | number)[]): void;
}>();

const selectedItems = Helpers.useDynamicRef<(string | number)[]>([]);

// Function to update URL with query parameters
const updateUrlWithParams = (page?: number, perPage?: number) => {
    const query = { ...route.query };

    if (page !== undefined) {
        query.page = page.toString();
    }

    if (perPage !== undefined) {
        query.per_page = perPage.toString();
    }

    // Remove page=1 to keep URLs clean
    if (query.page === '1') {
        delete query.page;
    }

    router.replace({ query });
};

// Enhanced fetchData wrapper that updates URL
const fetchDataWithUrlUpdate = (page?: number, perPage?: number) => {
    updateUrlWithParams(page, perPage);
    props.fetchData(page, perPage);
};

const toggleSelectAll = (event: any) => {
    if (event.target.checked) {
        selectedItems.value = props.rows.data.map(row => row.id);
    } else {
        selectedItems.value = [];
    }
    emits('update:selectedItems', selectedItems.value);
};

const toggleSelectItem = (id: string | number) => {
    if (selectedItems.value.includes(id)) {
        selectedItems.value = selectedItems.value.filter(item => item !== id);
    } else {
        selectedItems.value.push(id);
    }
    emits('update:selectedItems', selectedItems.value);
};

const isAllSelected = Helpers.useDynamicComputed(() => {
    return props.rows && props.rows.data && props.rows.data.length > 0 && selectedItems.value.length === props.rows.data.length;
});


const paginationRange = Helpers.useDynamicComputed(() => {
    const current = props.rows.current_page;
    const last = props.rows.last_page;
    const delta = 2; // Range around the current page
    const range = [];

    // Generate range dynamically
    for (let i = Math.max(1, current - delta); i <= Math.min(last, current + delta); i++) {
        range.push(i);
    }
    if (current > delta + 2) range.unshift('...');
    if (current < last - delta - 1) range.push('...');

    return range;
});

const handleBulkAction = (event: Event) => {
    const target = event.target as HTMLSelectElement | null;
    const actionKey = target?.value || '';
    if (!actionKey || selectedItems.value.length === 0) {
        return;
    }
    emits('action', { action: actionKey, rows: props.rows.data, selected: selectedItems.value });
};
const clearSelection = () => {
  // Reset selected items to empty array, not object
  selectedItems.value = [];
};
</script>

<template>

<div
  v-if="enableFilterBar || (selectedItems.length > 0 && enableBulkActions && (bulkActions?.length || 0) > 0)"
  class="flex flex-col md:flex-row md:items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 w-full justify-start"
>
  <!-- Bulk Actions -->
  <div
    v-if="selectedItems.length > 0 && enableBulkActions && (bulkActions?.length || 0) > 0"
    class="flex items-center gap-2"
  >
    <select
      class="form-select form-select-sm min-w-[200px] rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 transition"
      @change="handleBulkAction"
    >
      <option value="">
        Bulk actions ({{ selectedItems.length }})
      </option>
      <option
        v-for="bulk in bulkActions"
        :key="bulk.action"
        :value="bulk.action"
      >
        {{ bulk.label }}
      </option>
    </select>

    <button
      @click="clearSelection"
      class="px-3 py-1 text-sm text-white bg-primary rounded hover:bg-primary-dark transition"
    >
      Clear
    </button>
  </div>

  <!-- Filters -->
  <div v-if="enableFilterBar">
    <slot name="filters" :filters="filters"></slot>
  </div>
</div>

    <div class="table-wrapper">
        <table class="table table-hover">
            <thead class="thead-sm">
                <tr class="bg-light/25 text-2xs uppercase">
                    <th class="w-[1%]" v-if="enableBulkActions">

                        <input data-table-select-all="" class="form-checkbox form-checkbox-light size-4.5"
                            :checked="isAllSelected" @change="toggleSelectAll" type="checkbox">
                    </th>
                    <th v-for="column in columns" :key="column.key" data-column="{{ column.key }}">
                        <div class="flex flex-col gap-1">
                            <span>{{ column.label }}</span>
                            <span v-if="column.sortable" class="inline-flex items-center gap-1 text-[11px] text-default-400">
                                <button
                                    type="button"
                                    class="hover:text-primary"
                                    @click="$emit('action', { action: 'sort', column: column.key, direction: 'asc' })"
                                >
                                    ▲
                                </button>
                                <button
                                    type="button"
                                    class="hover:text-primary"
                                    @click="$emit('action', { action: 'sort', column: column.key, direction: 'desc' })"
                                >
                                    ▼
                                </button>
                            </span>
                        </div>
                    </th>
                    <th v-if="(actions?.length || 0) > 0">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="isLoading">
                    <td :colspan="columns.length + ((actions?.length || 0) > 0 ? 2 : 1)">
                        <LoadingBox :showText="true" text="Please wait..." />

                    </td>
                </tr>
                <tr v-else v-for="row in rows.data" :key="row.id">
                    <td class="text-center" v-if="(actions?.length || 0) > 0">

                        <input class="form-checkbox form-checkbox-light size-4.5" :value="row.id" type="checkbox"
                            :checked="selectedItems.includes(row.id)" @change="toggleSelectItem(row.id)">
                    </td>
                    <td v-for="column in columns" :key="column.key">
                        <slot :name="column.key" :row="row" v-if="column.key === 'created_at'">
                            {{ $filters.DateTimeFormat(row[column.key]) }}
                        </slot>
                        <slot :name="column.key" :row="row" v-else>
                            {{ row[column.key] }}
                        </slot>
                    </td>
                    <td v-if="(actions?.length || 0) > 0">
                        <div class="flex justify-center gap-1.5">
                            <a v-for="action in actions" :key="action.label" href="javascript:void(0)"

                                :class="`btn border-default-300 hover:border-default-400 btn-icon btn-sm text-default-800 size-7.75 rounded border`"
                                @click="$emit('action', { action: action.action, row })" data-bs-toggle="tooltip"
                                data-bs-placement="top" :title="action.label">
                                <i :class="`iconify tabler--${action.icon}  text-base`"></i>
                            </a>
                        </div>
                    </td>
                </tr>
                <tr v-if="!isLoading && (!rows.data || rows.data.length === 0)">
                    <td :colspan="columns.length + ((actions?.length || 0) > 0 ? 2 : 1)" class="text-center">

                        <div class="alert alert-warning  d-flex align-items-center" role="alert">
                            <svg class="flex-shrink-0 me-2 svg-warning " xmlns="http://www.w3.org/2000/svg"
                                height="1.5rem" viewBox="0 0 24 24" width="1.5rem" fill="#000000">
                                <path d="M0 0h24v24H0V0z" fill="none" />
                                <path
                                    d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                            </svg>
                            <div>
                                <span class="text-dark">
                                    No records found.
                                </span>

                            </div>
                        </div>

                    </td>
                </tr>


            </tbody>
        </table>

    </div>
    <div class="card-footer">
        <div data-table-pagination-info="roles" class="text-default-400" style="display: block;">
            Showing <span class="font-semibold">{{ rows.from || 0 }}</span> to <span class="font-semibold">{{ rows.to || 0 }}</span> of <span class="font-semibold">{{ rows.total || 0 }}</span> {{ rows.total === 1 ? 'item' : 'items' }}
        </div>
        <div data-table-pagination="" style="display: block;">
            <ul class="pagination justify-center">
                <li class="page-item" :class="{ disabled: rows.current_page === 1 }">
                    <a href="#" class="page-link" @click.prevent="rows.current_page > 1 && fetchDataWithUrlUpdate(rows.current_page - 1)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M15 6l-6 6l6 6"></path>
                        </svg>
                    </a>
                </li>
                <li v-for="page in paginationRange" :key="page" class="page-item" :class="{ active: page === rows.current_page, disabled: page === '...' }">
                    <a
                        v-if="page !== '...'"
                        href="#"
                        class="page-link"
                        @click.prevent="fetchDataWithUrlUpdate(page as number)"
                    >
                        {{ page }}
                    </a>
                    <span v-else class="page-link">...</span>
                </li>
                <li class="page-item" :class="{ disabled: rows.current_page === rows.last_page }">
                    <a href="#" class="page-link" @click.prevent="rows.current_page < rows.last_page && fetchDataWithUrlUpdate(rows.current_page + 1)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M9 6l6 6l-6 6"></path>
                        </svg>
                    </a>
                </li>
            </ul>
        </div>
    </div>

</template>

<style scoped>
/* Ensure no rules are hiding the component */
</style>
