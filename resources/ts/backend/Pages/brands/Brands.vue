<script setup lang="ts">
import { useBrands } from './Composables/useBrand';
import GenericTable from '../../Components/GenericTable.vue';
import { CatalogService } from '../../Services/catalog/CatalogService';
import { Helpers } from '../../Utils/Helper';

const { brands, isLoading, filters, fetchBrands, handleSearchQuery, init } = useBrands();
Helpers.useDynamicOnMounted(init);

const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "code", label: "Code" },
    { key: "created_at", label: "Created At" },
];

const actions = [
    { label: "Edit", icon: "edit", action: "edit" },
    { label: "Delete", icon: "trash", action: "delete" },
];

const handleAction = async ({ action, row }: { action: string; row?: any }) => {
    if (!row?.uuid) return;
    if (action === 'edit') Helpers.router().push({ name: 'edit-brand', params: { uuid: row.uuid } });
    if (action === 'delete') {
        await CatalogService.deleteBrand(row.uuid);
        fetchBrands();
    }
};
</script>

<template>
    <div>
        <BreadcrumbComponent :current="'Brands'" :links="[{ name: 'Dashboard', route: 'dashboard' }]" />
        <div class="container-fluid">
            <div class="card">
                <div class="card-header flex gap-2">
                    <SearchInput label="Search Brands" :apiPath="`/brand`" @query="handleSearchQuery"></SearchInput>
                    <router-link :to="{ name: 'create-brand' }" class="btn bg-primary text-white hover:bg-primary-hover"><i class="iconify tabler--plus"></i> Add Brand</router-link>
                </div>
                <GenericTable :columns="columns" :rows="brands" :isLoading="isLoading" :fetchData="fetchBrands" :actions="actions" :filters="filters" @action="handleAction" />
            </div>
        </div>
    </div>
</template>
