<script setup lang="ts">
import { CatalogService } from '../../Services/catalog/CatalogService';
import GenericTable from '../../Components/GenericTable.vue';
import { Helpers } from '../../Utils/Helper';

const props = defineProps<{ products: any; isLoading: boolean; getProducts: (page?: number, perPage?: number) => void; currentFilters: Record<string, unknown>; }>();

const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "sku", label: "SKU" },
    { key: "price", label: "Price" },
    { key: "created_at", label: "Created At" },
];

const actions = [
    { label: "View", icon: "eye", action: "view", class: "info" },
    { label: "Edit", icon: "edit", action: "edit", class: "primary" },
    { label: "Delete", icon: "trash", action: "delete", class: "danger" },
];

const handleAction = async ({ action, row }: { action: string; row?: any }) => {
    if (!row?.uuid && action !== 'sort') return;
    if (action === 'view') Helpers.router().push({ name: 'show-product', params: { uuid: row.uuid } });
    if (action === 'edit') Helpers.router().push({ name: 'edit-product', params: { uuid: row.uuid } });
    if (action === 'delete') {
        await CatalogService.deleteProduct(row.uuid);
        props.getProducts();
    }
};
</script>

<template>
    <GenericTable :columns="columns" :isLoading="isLoading" :fetchData="getProducts" :rows="products" :actions="actions" :filters="currentFilters" @action="handleAction">
        <template #id="{ row }"><span class="text-default-400">#PR{{ row.id }}</span></template>
        <template #name="{ row }">
            <div>
                <h5 class="hover:text-primary">{{ row.name }}</h5>
                <p class="text-default-400 text-xs">{{ row.slug }}</p>
            </div>
        </template>
    </GenericTable>
</template>
