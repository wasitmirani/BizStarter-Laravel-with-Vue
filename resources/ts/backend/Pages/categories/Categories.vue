<script setup lang="ts">
import { useCategories } from "./Composables/useCategory"
import CategoriesTable from './CategoriesTable.vue' 
import OffCanvas from "../../Components/OffCanvas.vue"
import CategoriesFilterForm from './CategoriesFilterForm.vue'
import { perPageOptions } from './Composables/useCategoryFilter';
import ActiveFilters from '../../Components/ActiveFilters.vue'
import { Helpers } from '../../Utils/Helper'

const {
    categories,
    isLoading,
    filters,
    fetchCategories,
    handleFilterChange,
    handleSearchQuery,
    setLoading,
    filterData,
    init
} = useCategories()

Helpers.useDynamicOnMounted(() => {
    init()
})



</script>

<template>
    <div>
        <BreadcrumbComponent :current="'Categories'" :links="[{ name: 'Dashboard', route: 'dashboard' }]" />

        <div class="container-fluid">
            <div data-table="" data-table-rows-per-page="8" class="card">
                <div class="card-header">
                    <div class="flex flex-wrap gap-2.5">
                        <SearchInput label="Search Categories" :apiPath="`/category`" @loading="setLoading"
                            @filterData="filterData" @query="handleSearchQuery"></SearchInput>
                        <div class="flex gap-1">
                            <router-link :to="{ name: 'create-category' }"
                                class="btn bg-primary text-white hover:bg-primary-hover" aria-haspopup="dialog"
                                aria-expanded="false" aria-controls="incomeModal" data-hs-overlay="#incomeModal">
                                <i class="iconify tabler--plus"></i> Add Category
                            </router-link>
                        </div>
                    </div>

                    <div class="flex flex-wrap items-center gap-3">
                        <div class="items-center gap-3 md:flex">
                            <span class="me-3 font-semibold text-nowrap">Filter By:</span>
                            <div class="input-icon-group">
                                <i class="iconify tabler--list-details input-icon"></i>

                                <select id="filterPerPage" @change="handleFilterChange(filters)"
                                    v-model="filters.per_page" class="form-select w-full">
                                    <option v-for="option in perPageOptions" :key="option.value" :value="option.value">
                                        {{ option.label }}
                                    </option>
                                </select>
                            </div>


                        </div>
                        <ActiveFilters routeName="categories" @filterChange="handleFilterChange($event)" />
                    </div>
                    <div>
                        <nav class="flex items-center gap-x-1">
                            <a role="button" @click="fetchCategories()"
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
                                    <CategoriesFilterForm :initialFilters="filters" @filterChange="handleFilterChange" />
                                </template>
                            </OffCanvas>
                        </nav>
                    </div>
                </div>
                <CategoriesTable :categories="categories" :getCategories="fetchCategories" :isLoading="isLoading" :currentFilters="filters" />
            </div>
        </div>
    </div>
</template>
