<script setup lang="ts">
import DriverService from "../../Services/Driver/DriverService";
import GenericTable from "../../Components/GenericTable.vue";
import { Helpers } from "../../Utils/Helper";
import { hasUuid } from "../../Utils/Common";

const props = defineProps<{
    drivers: any;
    isLoading: boolean;
    getDrivers: (page?: number, perPage?: number) => void;
    currentFilters: Record<string, unknown>;
}>();

const selectedItems = Helpers.useDynamicRef<(string | number)[]>([]);
const toast = Helpers.useDynamicInject<{ showToast: (status: number, title: string, message: string) => void }>("toast", {
    showToast: () => {},
});

const typeLabel = (type: string) => {
    if (type === "clearing-agent") return "Clearing Agent";
    return "Driver";
};

const deleteDriver = (item: any) => {
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
            DriverService.delete(item.id)
                .then(() => {
                    Helpers.Swal().fire({
                        title: "Deleted!",
                        text: "Driver has been deleted.",
                        icon: "success",
                    });
                    props.getDrivers();
                })
                .catch((err: any) => {
                    toast.value.showToast(err.response?.status || 500, "Error", err.response?.data?.message ?? err.message);
                });
        }
    });
};

const columns = [
    { key: "driver_code", label: "Driver ID" },
    { key: "full_name", label: "Full Name" },
    { key: "type", label: "Type" },
    { key: "phone", label: "Phone" },
    { key: "city", label: "City" },
    { key: "warehouses", label: "Warehouses" },
    { key: "status", label: "Status" },
    { key: "joining_date", label: "Joining Date" },
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
        toast.value.showToast(400, "Error", "Driver uuid not found");
        return;
    }

    switch (action) {
        case "view":
            Helpers.router().push({ name: "show-driver", params: { id: row?.uuid } });
            break;
        case "edit":
            Helpers.router().push({ name: "edit-driver", params: { id: row?.uuid } });
            break;
        case "delete":
            deleteDriver(row);
            break;
        case "bulk-delete":
            if (!selected || selected.length === 0) {
                toast.value.showToast(400, "Error", "No driver selected");
                return;
            }
            Promise.all(selected.map((id) => DriverService.delete(Number(id))))
                .then(() => props.getDrivers())
                .catch((err: any) => {
                    toast.value.showToast(err.response?.status || 500, "Error", err.response?.data?.message ?? err.message);
                });
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
        :fetchData="getDrivers"
        :rows="drivers"
        :actions="actions"
        :bulkActions="bulkActions"
        :enableBulkActions="true"
        :filters="currentFilters"
        @action="handleAction"
        @update:selectedItems="selectedItems = $event"
    >
        <template #driver_code="{ row }">
            <span class="text-default-400 font-medium">{{ row.driver_code }}</span>
        </template>
        <template #full_name="{ row }">
            <div class="flex items-center gap-2">
                <img :src="row.profile_image" :alt="row.full_name" class="size-8 rounded-full object-cover border border-default-200" />
                <span>{{ row.full_name }}</span>
            </div>
        </template>
        <template #warehouses="{ row }">
            <div v-if="row.warehouses?.length" class="flex flex-wrap gap-1">
                <span v-for="warehouse in row.warehouses" :key="warehouse.id" class="badge bg-default-100 text-default-700">
                    {{ warehouse.name }}
                </span>
            </div>
            <span v-else class="text-default-400">-</span>
        </template>
        <template #type="{ row }">
            <span class="badge bg-primary/10 text-primary">{{ typeLabel(row.type) }}</span>
        </template>
        <template #status="{ row }">
            <span
                class="badge"
                :class="{
                    'bg-success/10 text-success': row.status === 'active',
                    'bg-danger/10 text-danger': row.status === 'inactive' || row.status === 'suspended',
                    'bg-warning/10 text-warning': row.status === 'on-leave',
                }"
            >
                {{ row.status === 'on-leave' ? 'On Leave' : row.status }}
            </span>
        </template>
        <template #joining_date="{ row }">
            {{ row.joining_date ? Helpers.DateTimeFormat(row.joining_date) : "-" }}
        </template>
    </GenericTable>
</template>
