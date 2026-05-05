<script setup lang="ts">
import SupplierService from "../../Services/Supplier/SupplierService";
import GenericTable from "../../Components/GenericTable.vue";
import { Helpers } from "../../Utils/Helper";
import { hasUuid } from "../../Utils/Common";
import Avatar from "../../Components/Avatar.vue";

const props = defineProps<{
    suppliers: any;
    isLoading: boolean;
    getSuppliers: (page?: number, perPage?: number) => void;
    currentFilters: Record<string, unknown>;
}>();

const selectedItems = Helpers.useDynamicRef<(string | number)[]>([]);
const toast = Helpers.useDynamicInject<{ showToast: (status: number, title: string, message: string) => void }>("toast", {
    showToast: () => {},
});

const deleteSupplier = (item: any) => {
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
            SupplierService.delete(item.id)
                .then(() => {
                    Helpers.Swal().fire({
                        title: "Deleted!",
                        text: "Supplier has been deleted.",
                        icon: "success",
                    });
                    props.getSuppliers();
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
    { key: "phone", label: "Phone" },
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
        toast.value.showToast(400, "Error", "Supplier uuid not found");
        return;
    }

    switch (action) {
        case "view":
            Helpers.router().push({ name: "show-supplier", params: { id: row?.uuid } });
            break;
        case "edit":
            Helpers.router().push({ name: "edit-supplier", params: { id: row?.uuid } });
            break;
        case "delete":
            deleteSupplier(row);
            break;
        case "bulk-delete":
            if (!selected || selected.length === 0) {
                toast.value.showToast(400, "Error", "No supplier selected");
                return;
            }
            selected.forEach((id) => SupplierService.delete(Number(id)));
            props.getSuppliers();
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
        :fetchData="getSuppliers"
        :rows="suppliers"
        :actions="actions"
        :bulkActions="bulkActions"
        :enableBulkActions="true"
        :filters="currentFilters"
        @action="handleAction"
        @update:selectedItems="selectedItems = $event"
    >
        <template #id="{ row }">
            <span class="text-default-400">#SUP{{ row.id }}</span>
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
