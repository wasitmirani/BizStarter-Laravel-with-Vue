<script setup lang="ts">
import  UserService  from '../../Services/user/UserService';
import GenericTable from '../../Components/GenericTable.vue';
import { Helpers } from '../../Utils/Helper';
import { hasUuid } from '../../Utils/Common';
import axios from 'axios';


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



function getRole(user: any) {
    if (user.roles.length > 0) {
        return user.roles[0].name;
    }
    return "No Role";
}
const deleteUser = (item: any) => {
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
            UserService.delete(item.uuid).then((res: any) => {
                Helpers.Swal().fire({
                    title: "Deleted!",
                    text: "User has been deleted.",
                    icon: "success"
                });
                props.getRoles();
            }).catch((err: any) => {
                console.log("err:", err.response.status);
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
            UserService.delete(items.uuid).then((res: any) => {
                Helpers.Swal().fire({
                    title: "Deleted!",
                    text: "User has been deleted.",
                    icon: "success"
                });
                props.getRoles();
            }).catch((err: any) => {
                console.log("err:", err.response.status);
                toast.value.showToast(err.response.status, 'Error: ' + err.response.status, err.message ?? err.response.message);
            })

        }
    });
}
const editUser = (item: any) => {
    Helpers.router().push({ name: "update-user", params: { uuid: item.uuid } });
}


const columns = [
    { key: "id", label: "Ref-ID" },
    { key: "name", label: "Name" },
    { key: "users_count", label: "Users" },
    {key:'permissions_count', label:'Permissions'},
    { key: "created_at", label: "Created At" },
    //   { key: "updated_at", label: "Updated At" },

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
    const actionsRequiringUuid = ['edit', 'delete','view', 'impersonate']
    if (actionsRequiringUuid.includes(action)) {
        if (!hasUuid(row?.uuid)) {
            toast.value.showToast(400, 'Error', 'User uuid not found')
            return
        }
    }
    switch (action) {
        case 'view':
             Helpers.router().push({ name: 'show-user', params: { uuid: row?.uuid} });
            break;
        case 'edit':
            Helpers.router().push({ name: 'edit-user', params: { uuid: row.uuid, slug: row.slug } });
            break;
        case 'delete':

            deleteUser(row);
            break;

        case 'bulk-delete':
            if (!selected || selected.length === 0) {
                toast.value.showToast(400, 'Error', 'No users selected');
                return;
            }
            // For now just log; can be wired to an API endpoint for bulk delete
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
            <td>
                <span class="text-default-400">#RL00{{ row.id }}</span>
            </td>
        </template>
        <template #name="{ row }">
            <td>
                <Avatar :name="row.name"  />
            </td>
        </template>
        <template #users_count="{row}">
            <span class="badge size-4 rounded-full bg-light text-dark">{{ row.users_count }}</span>
        </template>
        <template #permissions_count="{row}">
            <span class="badge size-4 rounded-full bg-light text-dark">{{ row.permissions_count }}</span>
        </template>


    </GenericTable>

</template>
