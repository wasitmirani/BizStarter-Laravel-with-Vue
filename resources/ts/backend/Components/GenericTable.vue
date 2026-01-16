<script lang="ts" setup>


const props = defineProps({
    columns: {
        type: Array,
        required: true,
    },
    rows: {
        type: Array,
        required: true,
    },
    isLoading: {
        type: Boolean,
        default: false,
    },
    actions: {
        type: Array,
        default: () => [],
    },
    fetchData: {
        type: Function,
        required: true,
    }
});

const emits = defineEmits(["action", "update:selectedItems"]);

const selectedItems = Helpers.useDynamicRef([]);

const toggleSelectAll = (event:any) => {
    if (event.target.checked) {
        selectedItems.value = props.rows.data.map(row => row.id);
    } else {
        selectedItems.value = [];
    }
    emits('update:selectedItems', selectedItems.value);
};

const toggleSelectItem = (id:string) => {
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


const paginationRange =  Helpers.useDynamicComputed(() => {
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
</script>

<template>


    <div class="table-wrapper">
                                <table class="table-custom table-select table table-hover">
                                    <thead class="thead-sm">
               <tr class="bg-light/25 text-2xs uppercase">
                                            <th class="w-[1%]">

                              <input data-table-select-all="" class="form-checkbox form-checkbox-light size-4.5"   :checked="isAllSelected" @change="toggleSelectAll"  type="checkbox">
                    </th>
                    <th v-for="column in columns" :key="column.key" data-table-sort="{{ column.key }}" data-column="{{ column.key }}">{{ column.label }}</th>
                    <th v-if="actions.length > 0">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="isLoading">
                    <td :colspan="columns.length + (actions.length > 0 ? 2 : 1)">
                        <LoadingBox />
                    </td>
                </tr>
                <tr v-else v-for="row in rows.data" :key="row.id">
                    <td class="text-center" v-if="actions.length > 0">

                               <input class="form-checkbox form-checkbox-light size-4.5"  :value="row.id" type="checkbox" :checked="selectedItems.includes(row.id)" @change="toggleSelectItem(row.id)">
                    </td>
                    <td v-for="column in columns" :key="column.key" >
                        <slot :name="column.key" :row="row" v-if="column.key === 'created_at'">
                            {{ $filters.DateTimeFormat(row[column.key]) }}
                        </slot>
                        <slot :name="column.key" :row="row" v-else>
                            {{ row[column.key] }}
                        </slot>
                    </td>
                    <td v-if="actions.length > 0">
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
                    <td :colspan="columns.length + (actions.length > 0 ? 2 : 1)" class="text-center">

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

    <div class="d-flex justify-content-between align-items-center mt-4  flex-wrap" v-if="!isLoading">
        <nav aria-label="Page navigation" class="pagination-style-4 mt-2 me-3 me-md-5">
            <ul class="pagination mb-0 flex-wrap">
                <li class="page-item" :class="{ disabled: rows.current_page === 1 }">
                    <a class="page-link" href="javascript:void(0);" @click="fetchData(rows.current_page - 1)" aria-disabled="rows.current_page === 1">
                        Prev
                    </a>
                </li>
                <li
                    v-for="page in paginationRange"
                    :key="page"
                    class="page-item"
                    :class="{ active: page === rows.current_page, disabled: page === '...' }">
                    <button
                        v-if="page !== '...'"
                        class="page-link"
                        @click="fetchData(page)">
                        {{ page }}
                    </button>
                    <span v-else class="page-link">...</span>
                </li>
                <li class="page-item" :class="{ disabled: rows.current_page === rows.last_page }">
                    <a class="page-link" href="javascript:void(0);" @click="fetchData(rows.current_page + 1)" aria-disabled="rows.current_page === rows.last_page">
                        Next
                    </a>
                </li>
            </ul>
        </nav>
        <div class="me-3 me-md-5">
            <label for="perPageSelect" class="form-label">Items per page:</label>
            <select id="perPageSelect" class="form-select" @change="event => fetchData(1, event.target.value ?? 10)">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="500">500</option>
                <option value="1000">1000</option>
            </select>
        </div>
    </div>
</template>

<style scoped>
/* Ensure no rules are hiding the component */
</style>
