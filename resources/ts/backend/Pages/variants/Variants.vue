<script setup lang="ts">
import { useVariants } from './Composables/useVariant';
import VariantTable from './VariantTable.vue';
import { perPageOptions } from './Composables/useVariantFilter';
import { Helpers } from '../../Utils/Helper';

const { variants, isLoading, filters, fetchVariants, handleFilterChange, handleSearchQuery, setLoading, filterData, init } = useVariants();
Helpers.useDynamicOnMounted(init);
</script>

<template>
    <div>
        <BreadcrumbComponent :current="'Variants'" :links="[{ name: 'Dashboard', route: 'dashboard' }]" />
        <div class="container-fluid">
            <div class="card">
                <div class="card-header">
                    <div class="flex flex-wrap gap-2.5">
                        <SearchInput label="Search Variants" :apiPath="`/variant`" @loading="setLoading" @filterData="filterData" @query="handleSearchQuery" />
                        <router-link :to="{ name: 'create-variant' }" class="btn bg-primary text-white hover:bg-primary-hover">
                            <i class="iconify tabler--plus"></i> Add Variant
                        </router-link>
                    </div>
                    <div class="mt-3">
                        <select id="filterPerPage" @change="handleFilterChange(filters)" v-model="filters.per_page" class="form-select w-full md:w-40">
                            <option v-for="option in perPageOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                        </select>
                    </div>
                </div>
                <VariantTable :variants="variants" :getVariants="fetchVariants" :isLoading="isLoading" :currentFilters="filters" />
            </div>
        </div>
    </div>
</template>
