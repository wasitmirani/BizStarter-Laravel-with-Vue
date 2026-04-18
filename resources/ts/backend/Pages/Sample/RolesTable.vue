<script setup lang="ts">
import RoleService from '../../Services/Role/RoleService';
import GenericTable from '../../Components/GenericTable.vue';
import { Helpers } from '../../Utils/Helper';
import { hasUuid } from '../../Utils/Common';
import Avatar from '../../Components/Avatar.vue';

const props = defineProps<{
    roles: any;
    isLoading: boolean;
    getRoles: (page?: number, perPage?: number) => void;
    currentFilters: Record<string, unknown>;
}>();

const emit = defineEmits<{
    (e: 'role-deleted'): void;
}>();

const selectedItems = Helpers.useDynamicRef<(string | number)[]>([]);
const toast = Helpers.useDynamicInject<{ showToast: (status: number, title: string, message: string) => void }>('toast', {
    showToast: () => {},
});

const deleteRole = (item: any) => {
    if (item.name.toLowerCase() === 'super-admin') {
        toast.value.showToast(403, 'Error', 'Cannot delete super-admin role');
        return;
    }

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
            RoleService.delete(item.id).then((res: any) => {
                Helpers.Swal().fire({
                    title: "Deleted!",
                    text: "Role has been deleted.",
                    icon: "success"
                });
                props.getRoles();
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
                RoleService.delete(item).catch((err: any) => {
                    console.error("Error deleting role:", err);
                });
            });
            props.getRoles();
        }
    });
}

const columns = [
    { key: "id", label: "Ref-ID" },
    { key: "name", label: "Name" },
    { key: "users_count", label: "Users" },
    { key: 'permissions_count', label: 'Permissions' },
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
            toast.value.showToast(400, 'Error', 'Role uuid not found')
            return
        }
    }
    switch (action) {
        case 'view':
            Helpers.router().push({ name: 'show-role', params: { id: row?.uuid } });
            break;
        case 'edit':
            Helpers.router().push({ name: 'edit-role', params: { id: row?.uuid } });
            break;
        case 'delete':
            deleteRole(row);
            break;
        case 'bulk-delete':
            if (!selected || selected.length === 0) {
                toast.value.showToast(400, 'Error', 'No roles selected');
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
        :fetchData="getRoles"
        :rows="roles"
        :actions="actions"
        :bulkActions="bulkActions"
        :enableBulkActions="true"
        :filters="currentFilters"
        @action="handleAction"
        @update:selectedItems="selectedItems = $event"
    >
        <template #id="{ row }">
                <span class="text-default-400">#RL00{{ row.id }}</span>
        </template>
        <template #name="{ row }">
                <Avatar :name="row.name" />
        </template>
        <template #users_count="{ row }">
            <span class="badge size-4 rounded-full bg-light text-dark">{{ row.users_count }}</span>
        </template>
        <template #permissions_count="{ row }">
            <span class="badge size-4 rounded-full bg-light text-dark">{{ row.permissions_count }}</span>
        </template>
    </GenericTable>
</template>
