<template>

    <!-- <input class="form-control form-control-sm" type="text" placeholder="Search Here" aria-label=".form-control-sm example"> -->
    <div class="input-icon-group">
        <i class="iconify tabler--search input-icon"></i>
        <input data-table-search="" type="search" title="Search characters should be greater than two."
            class="form-input w-auto ps-10" :placeholder="label ?? 'Search...'" v-model="query">
    </div>
</template>

<script setup lang="ts">
import { Helpers } from '../Utils/Helper';
import axios from 'axios';
import loadsh from 'lodash';

const props = defineProps<{
    label: string;
    apiPath: string;
}>();

const emit = defineEmits(['loading', 'filterData', 'query', 'reload']);

const query = Helpers.useDynamicRef<string>('');
const apiPath = Helpers.useDynamicRef<string>(props.apiPath ?? ''); // Replace with actual URL

// Debounced search function
const searchQuery = loadsh.debounce(() => {
    setTimeout(() => {
        search();
    }, 500);
}, 500);

async function search() {
    if (query.value.length > 2) {
        emit('loading', true);
        try {
            const response = await axios.get(`${apiPath.value}?query=${query.value}`);

            emit('filterData', response.data);
            emit('query', query.value);
            setTimeout(() => {
                emit('loading', false);
            }, 700);
        } catch (error) {
            emit('loading', false);
            // Handle error if needed
            console.error(error);
        }
    }
}

// Watcher for query changes
Helpers.useDynamicWatch(query, (newQuery) => {
    if (newQuery === '') {
        emit('query', '');
        emit('reload');
    } else {
        searchQuery();
    }
});

Helpers.useDynamicOnMounted(() => {
    // Additional setup if needed
});
</script>

<style scoped>
.margin-lf {
    margin-left: 5px;
}
</style>
