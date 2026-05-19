<script setup lang="ts">
import { useProducts } from "./Composables/useProduct";
import ProductTable from './ProductTable.vue';
import { perPageOptions } from './Composables/useProductFilter';
import { Helpers } from '../../Utils/Helper';

const { products, isLoading, filters, fetchProducts, handleFilterChange, handleSearchQuery, setLoading, filterData, init } = useProducts();
Helpers.useDynamicOnMounted(init);
</script>

<template>
    <div>
        <BreadcrumbComponent :current="'Products'" :links="[{ name: 'Dashboard', route: 'dashboard' }]" />
        <div class="container-fluid">
            <div class="card">
                <div class="card-header">
                    <div class="flex flex-wrap gap-2.5">
                        <SearchInput label="Search Products" :apiPath="`/product`" @loading="setLoading" @filterData="filterData" @query="handleSearchQuery" />
                        <router-link :to="{ name: 'create-product' }" class="btn bg-primary text-white hover:bg-primary-hover">
                            <i class="iconify tabler--plus"></i> Add Product
                        </router-link>
                    </div>
                    <div class="mt-3">
                        <select id="filterPerPage" @change="handleFilterChange(filters)" v-model="filters.per_page" class="form-select w-full md:w-40">
                            <option v-for="option in perPageOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                        </select>
                    </div>
                </div>
                <ProductTable :products="products" :getProducts="fetchProducts" :isLoading="isLoading" :currentFilters="filters" />
            </div>
        </div>
    </div>
</template>
