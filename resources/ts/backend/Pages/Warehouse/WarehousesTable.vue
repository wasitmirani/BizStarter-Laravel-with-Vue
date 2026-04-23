<script setup lang="ts">
import WarehouseService from "../../Services/Warehouse/WarehouseService";
import GenericTable from "../../Components/GenericTable.vue";
import { Helpers } from "../../Utils/Helper";
import { hasUuid } from "../../Utils/Common";
import Avatar from "../../Components/Avatar.vue";

const props = defineProps<{
    warehouses: any;
    isLoading: boolean;
    getWarehouses: (page?: number, perPage?: number) => void;
    currentFilters: Record<string, unknown>;
}>();

const selectedItems = Helpers.useDynamicRef<(string | number)[]>([]);
const toast = Helpers.useDynamicInject<{ showToast: (status: number, title: string, message: string) => void }>("toast", {
    showToast: () => {},
});

const deleteWarehouse = (item: any) => {
    Helpers.Swal().fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
    }).then((result: any) => {
        if (result.isConfirmed) {
            WarehouseService.delete(item.id)
                .then(() => {
                    Helpers.Swal().fire({
                        title: "Deleted!",
                        text: "Warehouse has been deleted.",
                        icon: "success",
                    });
                    props.getWarehouses();
                })
                .catch((err: any) => {
                    toast.value.showToast(err.response?.status || 500, "Error", err.response?.data?.message ?? err.message);
                });
        }
    });
};

const columns = [
    { key: "id", label: "Ref-ID" },
    { key: "name", label: "Name" },
    { key: "city", label: "City" },
    { key: "status", label: "Status" },
    { key: "created_at", label: "Created At" },
];

const actions = [
    { label: "View", icon: "eye", action: "view", class: "info" },
    { label: "Edit", icon: "edit", action: "edit", class: "primary" },
    { label: "Delete", icon: "trash", action: "delete", class: "danger" },
];

const bulkActions = [{ label: "Delete selected", action: "bulk-delete" }];

function handleAction({ action, row, selected }: { action: string; row?: any; selected?: (string | number)[] }) {
    const actionsRequiringUuid = ["edit", "delete", "view"];
    if (actionsRequiringUuid.includes(action) && !hasUuid(row?.uuid)) {
        toast.value.showToast(400, "Error", "Warehouse uuid not found");
        return;
    }

    switch (action) {
        case "view":
            Helpers.router().push({ name: "show-warehouse", params: { id: row?.uuid } });
            break;
        case "edit":
            Helpers.router().push({ name: "edit-warehouse", params: { id: row?.uuid } });
            break;
        case "delete":
            deleteWarehouse(row);
            break;
        case "bulk-delete":
            if (!selected || selected.length === 0) {
                toast.value.showToast(400, "Error", "No warehouse selected");
                return;
            }
            selected.forEach((id) => WarehouseService.delete(Number(id)));
            props.getWarehouses();
            break;
        default:
            break;
    }
}
</script>

<template>
    <GenericTable
        :columns="columns"
        :isLoading="isLoading"
        :fetchData="getWarehouses"
        :rows="warehouses"
        :actions="actions"
        :bulkActions="bulkActions"
        :enableBulkActions="true"
        :filters="currentFilters"
        @action="handleAction"
        @update:selectedItems="selectedItems = $event"
    >
        <template #id="{ row }">
            <span class="text-default-400">#WH00{{ row.id }}</span>
        </template>
        <template #name="{ row }">
            <Avatar :name="row.name" />
        </template>
        <template #status="{ row }">
            <span class="badge" :class="row.status === 'active' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'">
                {{ row.status }}
            </span>
        </template>
    </GenericTable>
</template>
