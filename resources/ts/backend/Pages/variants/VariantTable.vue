<script setup lang="ts">
import { CatalogService } from '../../Services/catalog/CatalogService';
import GenericTable from '../../Components/GenericTable.vue';
import { Helpers } from '../../Utils/Helper';

const props = defineProps<{ variants: any; isLoading: boolean; getVariants: (page?: number, perPage?: number) => void; currentFilters: Record<string, unknown>; }>();

const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'product', label: 'Product' },
    { key: 'sku', label: 'SKU' },
    { key: 'price', label: 'Price' },
    { key: 'status', label: 'Status' },
    { key: 'created_at', label: 'Created At' },
];

const actions = [
    { label: 'View', icon: 'eye', action: 'view', class: 'info' },
    { label: 'Edit', icon: 'edit', action: 'edit', class: 'primary' },
    { label: 'Delete', icon: 'trash', action: 'delete', class: 'danger' },
];

const handleAction = async ({ action, row }: { action: string; row?: any }) => {
    if (!row?.uuid && action !== 'sort') return;
    if (action === 'view') Helpers.router().push({ name: 'show-variant', params: { uuid: row.uuid } });
    if (action === 'edit') Helpers.router().push({ name: 'edit-variant', params: { uuid: row.uuid } });
    if (action === 'delete') {
        await CatalogService.deleteVariant(row.uuid);
        props.getVariants();
    }
};
</script>

<template>
    <GenericTable :columns="columns" :isLoading="isLoading" :fetchData="getVariants" :rows="variants" :actions="actions" :filters="currentFilters" @action="handleAction">
        <template #id="{ row }"><span class="text-default-400">#VR{{ row.id }}</span></template>
        <template #name="{ row }">
            <div>
                <h5 class="hover:text-primary">{{ row.name }}</h5>
                <p class="text-default-400 text-xs">{{ row.slug }}</p>
            </div>
        </template>
        <template #product="{ row }">
            <span>{{ row.product?.name || 'N/A' }}</span>
        </template>
        <template #status="{ row }">
            <span class="badge text-2xs font-semibold" :class="row.status === 'active' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'">
                {{ row.status || 'inactive' }}
            </span>
        </template>
    </GenericTable>
</template>
