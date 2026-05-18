<script setup lang="ts">
import { useDrivers } from "./Composables/useDriver";
import DriversTable from "./DriversTable.vue";
import OffCanvas from "../../Components/OffCanvas.vue";
import ActiveFilters from "../../Components/ActiveFilters.vue";
import { perPageOptions, statuses, types, dateRanges } from "./Composables/useDriverFilter";
import { Helpers } from "../../Utils/Helper";

const {
    drivers,
    isLoading,
    filters,
    warehouseFilterOptions,
    fetchDrivers,
    handleFilterChange,
    handleSearchQuery,
    setLoading,
    filterData,
    init,
} = useDrivers();

Helpers.useDynamicOnMounted(() => {
    init();
});
</script>

<template>
    <div>
        <BreadcrumbComponent :current="'Drivers'" :links="[{ name: 'Dashboard', route: 'dashboard' }]" />

        <div class="container-fluid">
            <div data-table="" data-table-rows-per-page="8" class="card">
                <div class="card-header">
                    <div class="flex flex-wrap gap-2.5">
                        <SearchInput label="Search Drivers" :apiPath="`/driver`" @loading="setLoading" @filterData="filterData" @query="handleSearchQuery" />
                        <div class="flex gap-1">
                            <router-link :to="{ name: 'create-driver' }" class="btn bg-primary text-white hover:bg-primary-hover">
                                <i class="iconify tabler--plus"></i> Add Driver
                            </router-link>
                        </div>
                    </div>

                    <div class="flex flex-wrap items-center gap-3">
                        <div class="items-center gap-3 md:flex">
                            <span class="me-3 font-semibold text-nowrap">Filter By:</span>

                            <div class="input-icon-group">
                                <i class="iconify tabler--user input-icon"></i>
                                <select class="form-select" v-model="filters.type" @change="handleFilterChange(filters)">
                                    <option v-for="item in types" :key="item.value" :value="item.value">{{ item.label }}</option>
                                </select>
                            </div>

                            <div class="input-icon-group">
                                <i class="iconify tabler--progress-check input-icon"></i>
                                <select class="form-select" v-model="filters.status" @change="handleFilterChange(filters)">
                                    <option v-for="item in statuses" :key="item.value" :value="item.value">{{ item.label }}</option>
                                </select>
                            </div>

                            <div class="input-icon-group">
                                <i class="iconify tabler--calendar input-icon"></i>
                                <select class="form-select" @change="handleFilterChange(filters)" v-model="filters.date_range">
                                    <option v-for="item in dateRanges" :key="item.value" :value="item.value">{{ item.label }}</option>
                                </select>
                            </div>

                            <div class="input-icon-group">
                                <i class="iconify tabler--list-details input-icon"></i>
                                <select @change="handleFilterChange(filters)" v-model="filters.per_page" class="form-select w-full">
                                    <option v-for="option in perPageOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                                </select>
                            </div>
                        </div>

                        <ActiveFilters routeName="drivers" @filterChange="handleFilterChange($event)" />
                    </div>

                    <div>
                        <nav class="flex items-center gap-x-1">
                            <a role="button" @click="fetchDrivers()" class="btn bg-primary/15 text-primary btn-icon hover:bg-primary hover:text-white">
                                <i class="iconify tabler--refresh text-lg"></i>
                            </a>

                            <OffCanvas id="offcanvasDriverFilter" title="Advance Filters" buttonClass="btn bg-primary btn-icon text-white hover:bg-primary-hover" buttonLabel="Filter">
                                <template #button-icon>
                                    <i class="iconify tabler--filter text-lg"></i>
                                </template>
                                <template #body>
                                    <div class="space-y-3">
                                        <div>
                                            <label class="form-label">Warehouse</label>
                                            <select v-model="filters.warehouse_id" class="form-select">
                                                <option v-for="item in warehouseFilterOptions" :key="item.value" :value="item.value">
                                                    {{ item.label }}
                                                </option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="form-label">City</label>
                                            <input v-model="filters.city" type="text" class="form-input" placeholder="Filter by city" @keyup.enter="handleFilterChange(filters)" />
                                        </div>
                                        <button type="button" class="btn bg-primary text-white w-full" @click="handleFilterChange(filters)">Apply Filters</button>
                                    </div>
                                </template>
                            </OffCanvas>
                        </nav>
                    </div>
                </div>

                <DriversTable :drivers="drivers" :getDrivers="fetchDrivers" :isLoading="isLoading" :currentFilters="filters" />
            </div>
        </div>
    </div>
</template>
