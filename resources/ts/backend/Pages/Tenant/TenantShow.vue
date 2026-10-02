<script setup lang="ts">
import { useCreateTenant } from './Composables/useCreateTenant';
import { Helpers } from '../../Utils/Helper';
import TenantService from '../../Services/Tenant/TenantService';

const { tenant, loading } = useCreateTenant();
const tenantData = Helpers.useDynamicComputed(() => tenant.value);
const isLoading = Helpers.useDynamicComputed(() => loading?.value || false);
const newDomain = Helpers.useDynamicRef('');
const toast = Helpers.useDynamicInject<{ showToast: (status: number, title: string, message: string) => void }>(
    'toast',
    { showToast: () => {} }
);

const statusValue = Helpers.useDynamicComputed(() => {
    const status = tenantData.value?.status;
    return typeof status === 'object' ? status?.value ?? status : status;
});

const refresh = async () => {
    if (!tenantData.value?.id) return;
    const res = await TenantService.tenant(tenantData.value.id);
    tenant.value = res.data.result.tenant;
};

const addDomain = async () => {
    if (!newDomain.value || !tenantData.value?.id) return;
    try {
        await TenantService.addDomain(tenantData.value.id, newDomain.value);
        newDomain.value = '';
        toast.value.showToast(200, 'Success', 'Domain added');
        await refresh();
    } catch (err: any) {
        toast.value.showToast(err.response?.status || 500, 'Error', err.response?.data?.message || 'Failed');
    }
};

const removeDomain = async (domainId: number) => {
    try {
        await TenantService.removeDomain(tenantData.value.id, domainId);
        toast.value.showToast(200, 'Success', 'Domain removed');
        await refresh();
    } catch (err: any) {
        toast.value.showToast(err.response?.status || 500, 'Error', err.response?.data?.message || 'Failed');
    }
};

const toggleStatus = async () => {
    const next = statusValue.value === 'active' ? 'suspended' : 'active';
    try {
        await TenantService.updateStatus(tenantData.value.id, next);
        toast.value.showToast(200, 'Success', `Tenant ${next}`);
        await refresh();
    } catch (err: any) {
        toast.value.showToast(err.response?.status || 500, 'Error', err.response?.data?.message || 'Failed');
    }
};
</script>

<template>
    <BreadcrumbComponent
        :current="'Tenant Details'"
        :links="[
            { name: 'Dashboard', route: 'dashboard' },
            { name: 'Tenants', route: 'tenants' },
        ]"
    />

    <div v-if="isLoading" class="text-center py-5">
        <LoadingBox :showText="true" text="Loading tenant data..." />
    </div>

    <div v-else class="row g-4">
        <div class="col-xl-4">
            <div class="card">
                <div class="card-body">
                    <div class="d-flex gap-4 align-items-center mb-6">
                        <div
                            class="avatar size-14 rounded role-icon d-flex align-items-center justify-content-center text-white fw-bold fs-4"
                            :style="{ backgroundColor: tenantData?.primary_color || '#4f46e5' }"
                        >
                            {{ (tenantData?.name || 'T').charAt(0).toUpperCase() }}
                        </div>
                        <div>
                            <h6 class="mb-1 fs-17">{{ tenantData?.name || '-' }}</h6>
                            <p class="text-muted mb-2">{{ tenantData?.email || '-' }}</p>
                            <span
                                class="badge border"
                                :class="
                                    statusValue === 'active'
                                        ? 'bg-success-subtle text-success-emphasis border-success-subtle'
                                        : 'bg-danger-subtle text-danger-emphasis border-danger-subtle'
                                "
                            >
                                {{ statusValue === 'active' ? 'Active' : 'Suspended' }}
                            </span>
                        </div>
                    </div>

                    <ul class="list-unstyled mb-4">
                        <li class="d-flex align-items-center gap-3 mb-3">
                            <span class="avatar size-8 rounded bg-light d-flex align-items-center justify-content-center">
                                <i class="mgc_time_line text-muted"></i>
                            </span>
                            <div>
                                <p class="text-muted mb-0 fs-sm">Timezone</p>
                                <h6 class="mb-0 fs-15">{{ tenantData?.timezone || '-' }}</h6>
                            </div>
                        </li>
                        <li class="d-flex align-items-center gap-3 mb-3">
                            <span class="avatar size-8 rounded bg-light d-flex align-items-center justify-content-center">
                                <i class="mgc_translate_2_line text-muted"></i>
                            </span>
                            <div>
                                <p class="text-muted mb-0 fs-sm">Locale</p>
                                <h6 class="mb-0 fs-15">{{ tenantData?.locale || '-' }}</h6>
                            </div>
                        </li>
                        <li class="d-flex align-items-center gap-3">
                            <span class="avatar size-8 rounded bg-light d-flex align-items-center justify-content-center">
                                <i class="mgc_fingerprint_line text-muted"></i>
                            </span>
                            <div>
                                <p class="text-muted mb-0 fs-sm">Tenant ID</p>
                                <h6 class="mb-0 fs-12 font-monospace text-break">{{ tenantData?.id }}</h6>
                            </div>
                        </li>
                    </ul>

                    <div class="d-flex gap-2">
                        <router-link
                            class="btn btn-primary flex-grow-1"
                            :to="{ name: 'edit-tenant', params: { id: tenantData?.id } }"
                        >
                            <i class="mgc_pencil_2_ai_line me-1"></i> Edit Tenant
                        </router-link>
                        <button type="button" class="btn btn-outline-light" @click="toggleStatus">
                            {{ statusValue === 'active' ? 'Suspend' : 'Activate' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xl-8">
            <div class="card">
                <div class="card-header d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <h5 class="card-title mb-0">Domains</h5>
                    <div class="d-flex gap-2 flex-grow-1 justify-content-end" style="max-width: 420px">
                        <input
                            v-model="newDomain"
                            type="text"
                            class="form-control bg-light-subtle border-0"
                            placeholder="Add domain e.g. app.acme.test"
                        />
                        <button type="button" class="btn btn-primary flex-shrink-0" @click="addDomain">
                            <i class="mgc_add_line me-1"></i> Add
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-card table-responsive custom-scroll">
                        <table class="table mb-0 text-nowrap align-middle">
                            <thead>
                                <tr class="border-bottom">
                                    <th class="text-muted fw-medium">Domain</th>
                                    <th class="text-muted fw-medium text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="domain in tenantData?.domains || []" :key="domain.id">
                                    <td>
                                        <span class="badge bg-primary-subtle text-primary-emphasis border border-primary-subtle">
                                            {{ domain.domain }}
                                        </span>
                                    </td>
                                    <td class="text-end">
                                        <button
                                            type="button"
                                            class="btn btn-outline-light btn-icon size-7-5 text-danger"
                                            aria-label="Remove domain"
                                            :disabled="(tenantData?.domains?.length || 0) <= 1"
                                            @click="removeDomain(domain.id)"
                                        >
                                            <i class="mgc_delete_2_line"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="!(tenantData?.domains?.length)">
                                    <td colspan="2" class="text-center text-muted py-4">No domains</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
