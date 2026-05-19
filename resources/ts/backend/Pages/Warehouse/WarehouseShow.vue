<script setup lang="ts">
import WarehouseService from "../../Services/Warehouse/WarehouseService";
import { Helpers } from "../../Utils/Helper";

const WarehouseAreasTab = Helpers.useDynamicDefineAsyncComponent(() => import("@/Backend/Pages/Warehouse/Tabs/WarehouseAreasTab.vue"));
const WarehouseZonesTab = Helpers.useDynamicDefineAsyncComponent(() => import("@/Backend/Pages/Warehouse/Tabs/WarehouseZonesTab.vue"));
const WarehouseLocationsTab = Helpers.useDynamicDefineAsyncComponent(() => import("@/Backend/Pages/Warehouse/Tabs/WarehouseLocationsTab.vue"));
const WarehouseContainersTab = Helpers.useDynamicDefineAsyncComponent(() => import("@/Backend/Pages/Warehouse/Tabs/WarehouseContainersTab.vue"));

const warehouse = Helpers.useDynamicRef<any>(null);
const isLoading = Helpers.useDynamicRef<boolean>(false);

const tabs_list = [
    { name: "general", icon: "ri-information-line", label: "General" },
    { name: "areas", icon: "ri-layout-masonry-line", label: "Areas" },
    { name: "zones", icon: "ri-grid-line", label: "Zones" },
    { name: "locations", icon: "ri-map-pin-line", label: "Locations" },
    { name: "containers", icon: "ri-inbox-archive-line", label: "Containers" },
] as const;

const activeTab = Helpers.useDynamicRef<(typeof tabs_list)[number]["name"]>("general");

const getComponent = (name: string) => {
    switch (name) {
        case "areas":
            return WarehouseAreasTab;
        case "zones":
            return WarehouseZonesTab;
        case "locations":
            return WarehouseLocationsTab;
        case "containers":
            return WarehouseContainersTab;
        default:
            return null;
    }
};

const fetchWarehouse = async () => {
    isLoading.value = true;
    try {
        const id = Helpers.route().params.id?.toString();
        if (id) {
            const res = await WarehouseService.warehouse(id);
            warehouse.value = res.data.result?.warehouse || null;
        }
    } finally {
        isLoading.value = false;
    }
};

Helpers.useDynamicOnMounted(() => fetchWarehouse());
</script>

<template>
    <div>
        <BreadcrumbComponent :current="'Warehouse Details'" :links="[{ name: 'Dashboard', route: 'dashboard' }, { name: 'Warehouses', route: 'warehouses' }]" />

        <LoadingBox v-if="isLoading" :showText="true" text="Loading warehouse..." />

        <div v-else-if="warehouse" class="mt-4">
            <div class="border-b border-default-200">
                <nav class="-mb-px flex gap-2 overflow-x-auto" aria-label="Tabs">
                    <button
                        v-for="item in tabs_list"
                        :key="item.name"
                        type="button"
                        @click="activeTab = item.name"
                        :class="[
                            'inline-flex items-center gap-2 whitespace-nowrap px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                            activeTab === item.name
                                ? 'border-primary text-primary'
                                : 'border-transparent text-default-500 hover:text-default-900 hover:border-default-300'
                        ]"
                        :aria-current="activeTab === item.name ? 'page' : undefined"
                    >
                        <i :class="item.icon"></i>
                        <span>{{ item.label }}</span>
                    </button>
                </nav>
            </div>

            <div class="mt-4">
                <div v-if="activeTab === 'general'" class="card">
                    <div class="card-body">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><strong>Name:</strong> {{ warehouse.name }}</div>
                            <div><strong>Label:</strong> {{ warehouse.label || "-" }}</div>
                            <div><strong>Email:</strong> {{ warehouse.email || "-" }}</div>
                            <div><strong>Phone:</strong> {{ warehouse.phone || "-" }}</div>
                            <div><strong>Status:</strong> {{ warehouse.status }}</div>
                            <div><strong>City:</strong> {{ warehouse.city || "-" }}</div>
                            <div class="md:col-span-2"><strong>Address:</strong> {{ warehouse.address || "-" }}</div>
                        </div>
                    </div>
                </div>

                <component
                    v-else
                    :is="getComponent(activeTab)"
                    :warehouseId="warehouse.id"
                />
            </div>
        </div>
    </div>
</template>
