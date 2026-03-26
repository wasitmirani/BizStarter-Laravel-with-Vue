<script setup lang="ts">
import { UserService } from '../../Services/user/UserService';
import GenericTable from '../../Components/GenericTable.vue';
import { Helpers } from '../../Utils/Helper';


const props = defineProps<{
    users: any;
    isLoading: boolean;
    getUsers: (page?: number, perPage?: number) => void;
    currentFilters: Record<string, unknown>;
}>();

const emit = defineEmits<{
    (e: 'user-deleted'): void;
}>();

const selectedItems = Helpers.useDynamicRef<(string | number)[]>([]);
const toast = Helpers.useDynamicInject<{ showToast: (status: number, title: string, message: string) => void }>('toast', {
    showToast: () => {},
});



function getUserRole(user: any) {
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
                props.getUsers();
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
                props.getUsers();
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
    { key: "phone", label: "Phone" },
    { key: "user_name", label: "User Name" },
    { key: "status", label: "Status" },
    { key: "last_login", label: "Last Login" },
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
    switch (action) {
        case 'view':
            break;
        case 'edit':
            if (!row?.uuid){
                return toast.value.showToast(400, 'Error', 'User uuid not found');
            }


            Helpers.router().push({ name: 'edit-user', params: { uuid: row.uuid, slug: row.slug } });
            break;
        case 'delete':
            if (!row?.uuid) {
                toast.value.showToast(400, 'Error', 'User uuid not found');
                return;
            }
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
        :fetchData="getUsers"
        :rows="users"
        :actions="actions"
        :bulkActions="bulkActions"
        :enableBulkActions="true"
        :filters="currentFilters"
        @action="handleAction"
        @update:selectedItems="selectedItems = $event"
    >
        <template #id="{ row }">
            <td>
                <span class="text-default-400">#UR00{{ row.id }}</span>
            </td>
        </template>
        <template #name="{ row }">
            <td>
                <div class="flex items-center gap-3">
                    <div>
                        <img :src="row.thumbnail" alt="" class="size-8 rounded-full">
                    </div>
                    <div>
                        <h5>
                            <a data-sort="user" href="#!" class="hover:text-primary">{{ row.name }}</a>
                        </h5>
                        <p class="text-default-400 text-xs">{{ row.email }}</p>
                    </div>
                </div>
            </td>
        </template>

        <template #status="{ row }">
            <span :class="Helpers.setStatusBadge('success')">Active</span>
        </template>
        <template #last_login="{ row }">
            <span v-if="row.last_login">{{ $filters.DateTimeFormat(row.last_login) }}</span>

            <span v-else class="badge bg-danger/15 text-danger">Never</span>
        </template>
    </GenericTable>

</template>
