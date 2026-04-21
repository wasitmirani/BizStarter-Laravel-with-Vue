<script setup lang="ts">
import PermissionService from '../../Services/Permission/PermissionService';
import GenericTable from '../../Components/GenericTable.vue';
import { Helpers } from '../../Utils/Helper';
import { hasUuid } from '../../Utils/Common';
import Avatar from '../../Components/Avatar.vue';

const props = defineProps<{
    permissions: any;
    isLoading: boolean;
    getPermissions: (page?: number, perPage?: number) => void;
    currentFilters: Record<string, unknown>;
}>();

const emit = defineEmits<{
    (e: 'permission-deleted'): void;
}>();

const selectedItems = Helpers.useDynamicRef<(string | number)[]>([]);
const toast = Helpers.useDynamicInject<{ showToast: (status: number, title: string, message: string) => void }>('toast', {
    showToast: () => {},
});

const deletePermission = (item: any) => {


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
            PermissionService.delete(item.id).then((res: any) => {
                Helpers.Swal().fire({
                    title: "Deleted!",
                    text: "Permission has been deleted.",
                    icon: "success"
                });
                props.getPermissions();
            }).catch((err: any) => {
                toast.value.showToast(err.response.status, 'Error: ' + err.response.status, err.response.data?.message ?? err.message);
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
            // Could implement bulk delete by looping through items
            items.forEach((item: any) => {
                PermissionService.delete(item).catch((err: any) => {
                    console.error("Error deleting permission:", err);
                });
            });
            props.getPermissions();
        }
    });
}

const columns = [
    { key: "id", label: "Ref-ID" },
    { key: "name", label: "Name" },
    { key: "users_count", label: "Users" },
    { key: 'roles_count', label: 'Roles' },
    { key: "created_at", label: "Created At" },
];

const actions = [
    { label: "View", icon: "eye", action: "view", class: "info" },
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
            toast.value.showToast(400, 'Error', 'Permission uuid not found')
            return
        }
    }
    switch (action) {
        case 'view':
            Helpers.router().push({ name: 'show-permission', params: { id: row?.uuid } });
            break;
        case 'edit':
            Helpers.router().push({ name: 'edit-permission', params: { id: row?.uuid } });
            break;
        case 'delete':
            deletePermission(row);
            break;
        case 'bulk-delete':
            if (!selected || selected.length === 0) {
                toast.value.showToast(400, 'Error', 'No permission selected');
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
        :fetchData="getPermissions"
        :rows="permissions"
        :actions="actions"
        :bulkActions="bulkActions"
        :enableBulkActions="true"
        :filters="currentFilters"
        @action="handleAction"
        @update:selectedItems="selectedItems = $event"
    >
        <template #id="{ row }">
                <span class="text-default-400">#PR00{{ row.id }}</span>
        </template>
        <template #name="{ row }">
                <Avatar :name="row.name" />
        </template>
        <template #users_count="{ row }">
            <span class="badge size-4 rounded-full bg-light text-dark">{{ row.users_count }}</span>
        </template>
        <template #roles_count="{ row }">
            <span class="badge size-4 rounded-full bg-light text-dark">{{ row.roles_count }}</span>
        </template>
    </GenericTable>
</template>
