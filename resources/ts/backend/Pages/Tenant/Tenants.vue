<script setup lang="ts">
import { onMounted, ref } from "vue";
import TenantService from "../../Services/tenant/TenantService";

const search = ref("");
const loading = ref(false);
const tenants = ref<any>({
    data: [],
    current_page: 1,
    from: 0,
    to: 0,
    total: 0,
    last_page: 1,
});

const fetchTenants = async (page = 1) => {
    loading.value = true;
    try {
        const response = await TenantService.tenants({ page: String(page), search: search.value, per_page: "10" });
        tenants.value = response?.data?.result?.tenants ?? tenants.value;
    } finally {
        loading.value = false;
    }
};

const deleteTenant = async (id: number) => {
    if (!window.confirm("Delete this tenant?")) {
        return;
    }

    await TenantService.delete(id);
    await fetchTenants(tenants.value.current_page || 1);
};

onMounted(() => {
    fetchTenants();
});
</script>

<template>
    <BreadcrumbComponent :current="'Tenants'" :links="[{ name: 'Dashboard', route: 'dashboard' }]" />

    <div class="container-fluid">
        <div class="rounded-xl border border-default-200 bg-white shadow-sm overflow-hidden">
            <div class="px-5 py-4 border-b border-default-200 flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-2">
                    <input
                        v-model="search"
                        type="text"
                        class="w-72 rounded-lg border border-default-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        placeholder="Search tenants..."
                        @keyup.enter="fetchTenants()"
                    />
                    <button class="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover" @click="fetchTenants()">Search</button>
                </div>
                <router-link :to="{ name: 'create-tenant' }" class="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">Create Tenant</router-link>
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full text-sm">
                    <thead class="bg-default-100 text-default-700 uppercase text-xs">
                        <tr class="text-left">
                            <th class="px-5 py-3">Name</th>
                            <th class="px-5 py-3">Slug</th>
                            <th class="px-5 py-3">Domain</th>
                            <th class="px-5 py-3">Status</th>
                            <th class="px-5 py-3">Contact</th>
                            <th class="px-5 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading">
                            <td colspan="6" class="text-center py-6 text-default-500">Loading...</td>
                        </tr>
                        <tr v-else-if="!tenants.data?.length">
                            <td colspan="6" class="text-center py-6 text-default-500">No tenants found.</td>
                        </tr>
                        <tr v-else v-for="tenant in tenants.data" :key="tenant.id" class="border-t border-default-200">
                            <td class="px-5 py-3 font-medium text-default-800">{{ tenant.name }}</td>
                            <td class="px-5 py-3 text-default-600">{{ tenant.slug }}</td>
                            <td class="px-5 py-3 text-default-600">{{ tenant.domain || "-" }}</td>
                            <td class="px-5 py-3">
                                <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                                    :class="tenant.status === 'active' ? 'bg-success/15 text-success' : tenant.status === 'suspended' ? 'bg-danger/15 text-danger' : 'bg-warning/15 text-warning'">
                                    {{ tenant.status }}
                                </span>
                            </td>
                            <td class="px-5 py-3 text-default-600">{{ tenant.contact_email || "-" }}</td>
                            <td class="px-5 py-3 text-right">
                                <div class="flex justify-end gap-2">
                                    <router-link :to="{ name: 'tenant-settings' }" class="inline-flex rounded-md border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success hover:bg-success/20">Settings</router-link>
                                    <router-link :to="{ name: 'edit-tenant', params: { id: tenant.id } }" class="inline-flex rounded-md border border-default-300 bg-white px-3 py-1.5 text-xs font-medium text-default-700 hover:bg-default-100">Edit</router-link>
                                    <button class="inline-flex rounded-md border border-danger/30 bg-danger/10 px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger/20" @click="deleteTenant(tenant.id)">Delete</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="px-5 py-4 border-t border-default-200 flex flex-wrap items-center justify-between gap-3 text-sm text-default-600">
                <div>Showing {{ tenants.from || 0 }}-{{ tenants.to || 0 }} of {{ tenants.total || 0 }}</div>
                <div class="flex items-center gap-2">
                    <button class="rounded-md border border-default-300 bg-white px-3 py-1.5 text-xs font-medium disabled:opacity-50" :disabled="tenants.current_page <= 1" @click="fetchTenants(tenants.current_page - 1)">Prev</button>
                    <span>Page {{ tenants.current_page }} / {{ tenants.last_page }}</span>
                    <button class="rounded-md border border-default-300 bg-white px-3 py-1.5 text-xs font-medium disabled:opacity-50" :disabled="tenants.current_page >= tenants.last_page" @click="fetchTenants(tenants.current_page + 1)">Next</button>
                </div>
            </div>
        </div>
    </div>
</template>
