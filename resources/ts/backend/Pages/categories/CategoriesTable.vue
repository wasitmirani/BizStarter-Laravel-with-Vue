<script setup lang="ts">
import { CatalogService } from '../../Services/catalog/CatalogService';
import GenericTable from '../../Components/GenericTable.vue';
import { Helpers } from '../../Utils/Helper';
import { hasUuid } from '../../Utils/Common';


const props = defineProps<{
    categories: any;
    isLoading: boolean;
    getCategories: (page?: number, perPage?: number) => void;
    currentFilters: Record<string, unknown>;
}>();

const emit = defineEmits<{
    (e: 'category-deleted'): void;
}>();

const selectedItems = Helpers.useDynamicRef<(string | number)[]>([]);
const toast = Helpers.useDynamicInject<{ showToast: (status: number, title: string, message: string) => void }>('toast', {
    showToast: () => {},
});
const deleteCategory = (item: any) => {
    Helpers.Swal().fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result: any) => {
        if (result.isConfirmed) {
            CatalogService.deleteCategory(item.uuid).then(() => {
                Helpers.Swal().fire({
                    title: "Deleted!",
                    text: "Category has been deleted.",
                    icon: "success"
                });
                props.getCategories();
            }).catch((err: any) => {
                toast.value.showToast(err.response.status, 'Error: ' + err.response.status, err.message ?? err.response.message);
            })

        }
    });
}
const bulkDelete = (items: any) => {
    Helpers.Swal().fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result: any) => {
        if (result.isConfirmed) {
            CatalogService.deleteCategory(items.uuid).then(() => {
                Helpers.Swal().fire({
                    title: "Deleted!",
                    text: "Category has been deleted.",
                    icon: "success"
                });
                props.getCategories();
            }).catch((err: any) => {
                toast.value.showToast(err.response.status, 'Error: ' + err.response.status, err.message ?? err.response.message);
            })

        }
    });
}
const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "slug", label: "Slug" },
    { key: "sort_order", label: "Sort" },
    { key: "created_at", label: "Created At" },
];

const actions = [
    { label: "View", icon: "eye", action: "view", class: "info", },
    { label: "Edit", icon: "edit", action: "edit", class: "primary" },
    { label: "Delete", icon: "trash", action: "delete", class: "danger" },
];

const bulkActions = [
    { label: 'Delete selected', action: 'bulk-delete' },
];



function handleAction({ action, row, selected }: { action: string; row?: any; selected?: (string | number)[] }) {
        // Centralized validation for actions that require a row UUID
    const actionsRequiringUuid = ['edit', 'delete','view']
    if (actionsRequiringUuid.includes(action)) {
        if (!hasUuid(row?.uuid)) {
            toast.value.showToast(400, 'Error', 'Category uuid not found')
            return
        }
    }
    switch (action) {
        case 'view':
             Helpers.router().push({ name: 'show-category', params: { uuid: row?.uuid} });
            break;
        case 'edit':
            Helpers.router().push({ name: 'edit-category', params: { uuid: row.uuid, slug: row.slug } });
            break;
        case 'delete':
            deleteCategory(row);
            break;
        case 'bulk-delete':
            if (!selected || selected.length === 0) {
                toast.value.showToast(400, 'Error', 'No categories selected');
                return;
            }
           bulkDelete(selected);
            break;
        default:
            console.log('Unknown action:', action);
    }
}
</script>
<template>

    <GenericTable
        :columns="columns"
        :isLoading="isLoading"
        :fetchData="getCategories"
        :rows="categories"
        :actions="actions"
        :bulkActions="bulkActions"
        :enableBulkActions="true"
        :filters="currentFilters"
        @action="handleAction"
        @update:selectedItems="selectedItems = $event"
    >
        <template #id="{ row }">
            <td>
                <span class="text-default-400">#CT{{ row.id }}</span>
            </td>
        </template>
        <template #name="{ row }">
            <td>
                <h5><a data-sort="category" href="#!" class="hover:text-primary">{{ row.name }}</a></h5>
                <p class="text-default-400 text-xs">{{ row.description }}</p>
            </td>
        </template>
    </GenericTable>

</template>
