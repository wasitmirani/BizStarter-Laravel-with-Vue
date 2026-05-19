<script setup lang="ts">
import DriverService from "../../Services/Driver/DriverService";
import { Helpers } from "../../Utils/Helper";

const driver = Helpers.useDynamicRef<any>(null);
const isLoading = Helpers.useDynamicRef<boolean>(false);

const typeLabel = (type: string) => (type === "clearing-agent" ? "Clearing Agent" : "Driver");

const statusLabel = (status: string) => {
    if (status === "on-leave") return "On Leave";
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : "-";
};

const fetchDriver = async () => {
    isLoading.value = true;
    try {
        const id = Helpers.route().params.id?.toString();
        if (id) {
            const res = await DriverService.driver(id);
            driver.value = res.data.result?.driver || null;
        }
    } finally {
        isLoading.value = false;
    }
};

Helpers.useDynamicOnMounted(() => fetchDriver());
</script>

<template>
    <div>
        <BreadcrumbComponent :current="'Driver Details'" :links="[{ name: 'Dashboard', route: 'dashboard' }, { name: 'Drivers', route: 'drivers' }]" />

        <div class="card mt-4">
            <div class="card-body">
                <LoadingBox v-if="isLoading" :showText="true" text="Loading driver..." />
                <div v-else-if="driver" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="md:col-span-2 flex items-center gap-4">
                        <img v-if="driver.profile_image" :src="driver.profile_image" alt="" class="size-24 rounded-xl object-cover border" />
                        <div>
                            <h4 class="text-lg font-semibold">{{ driver.full_name }}</h4>
                            <p class="text-default-500">{{ driver.driver_code }}</p>
                            <span class="badge mt-2 bg-primary/10 text-primary">{{ typeLabel(driver.type) }}</span>
                        </div>
                    </div>
                    <div><strong>Email:</strong> {{ driver.email || "-" }}</div>
                    <div><strong>Phone:</strong> {{ driver.phone || "-" }}</div>
                    <div><strong>CNIC / National ID:</strong> {{ driver.cnic || "-" }}</div>
                    <div><strong>License Number:</strong> {{ driver.license_number || "-" }}</div>
                    <div><strong>License Expiry:</strong> {{ driver.license_expiry_date || "-" }}</div>
                    <div><strong>Joining Date:</strong> {{ driver.joining_date || "-" }}</div>
                    <div><strong>City:</strong> {{ driver.city || "-" }}</div>
                    <div class="md:col-span-2">
                        <strong>Assigned Warehouses:</strong>
                        <div v-if="driver.warehouses?.length" class="flex flex-wrap gap-2 mt-2">
                            <span v-for="warehouse in driver.warehouses" :key="warehouse.id" class="badge bg-primary/10 text-primary">
                                {{ warehouse.name }}{{ warehouse.label ? ` (${warehouse.label})` : "" }}
                            </span>
                        </div>
                        <span v-else class="text-default-500">-</span>
                    </div>
                    <div>
                        <strong>Status:</strong>
                        <span class="badge ms-2" :class="driver.status === 'active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'">
                            {{ statusLabel(driver.status) }}
                        </span>
                    </div>
                    <div class="md:col-span-2"><strong>Address:</strong> {{ driver.address || "-" }}</div>
                </div>
                <div v-else class="text-center text-default-500 py-8">Driver not found.</div>
            </div>
        </div>
    </div>
</template>
