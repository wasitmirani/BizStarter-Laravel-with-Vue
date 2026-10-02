<script setup lang="ts">
import TenantService from '../Services/Tenant/TenantService';
import { Helpers } from '../Utils/Helper';

const props = defineProps<{
    tenant: any;
    index?: number;
    onRefresh?: () => void;
}>();

const toast = Helpers.useDynamicInject<{ showToast: (status: number, title: string, message: string) => void }>(
    'toast',
    { showToast: () => {} }
);

const gradientClasses = [
    'bg-gradient-t-primary text-primary',
    'bg-gradient-t-success text-success',
    'bg-gradient-t-danger text-danger',
    'bg-gradient-t-warning text-warning',
    'bg-gradient-t-info text-info',
    'bg-gradient-t-secondary text-secondary',
];

const iconClass = Helpers.useDynamicComputed(
    () => gradientClasses[(props.index ?? 0) % gradientClasses.length]
);

const statusValue = Helpers.useDynamicComputed(() => {
    const status = props.tenant?.status;
    return typeof status === 'object' ? status?.value ?? status : status;
});

const primaryDomain = Helpers.useDynamicComputed(
    () => props.tenant?.domains?.[0]?.domain || 'No domain'
);

const domainCount = Helpers.useDynamicComputed(() => props.tenant?.domains?.length || 0);

const previewDomains = Helpers.useDynamicComputed(() => (props.tenant?.domains || []).slice(0, 4));

const moreDomains = Helpers.useDynamicComputed(() => Math.max(0, domainCount.value - 4));

const dropdownId = Helpers.useDynamicComputed(
    () => `tenantDropdown${String(props.tenant?.id || props.index || 0).replace(/[^a-zA-Z0-9]/g, '')}`
);

const deleteTenant = () => {
    Helpers.Swal()
        .fire({
            title: 'Are you sure you want to delete?',
            text: 'This action cannot be undone. The selected tenant will be permanently removed.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'No, Keep',
        })
        .then((result: any) => {
            if (!result.isConfirmed) return;
            TenantService.delete(props.tenant.id)
                .then(() => {
                    Helpers.Swal().fire({ title: 'Deleted!', text: 'Tenant has been deleted.', icon: 'success' });
                    props.onRefresh?.();
                })
                .catch((err: any) => {
                    toast.value.showToast(
                        err.response?.status || 500,
                        'Error',
                        err.response?.data?.message || err.message
                    );
                });
        });
};

const toggleStatus = () => {
    const next = statusValue.value === 'active' ? 'suspended' : 'active';
    TenantService.updateStatus(props.tenant.id, next)
        .then(() => {
            toast.value.showToast(200, 'Success', `Tenant ${next}`);
            props.onRefresh?.();
        })
        .catch((err: any) => {
            toast.value.showToast(
                err.response?.status || 500,
                'Error',
                err.response?.data?.message || 'Unable to update status'
            );
        });
};
</script>

<template>
    <div class="card">
        <div class="card-body">
            <div class="dropdown float-end">
                <a
                    href="#!"
                    class="link link-custom-primary"
                    :aria-label="dropdownId"
                    :id="dropdownId"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    @click.prevent
                >
                    <i class="mgc_more_2_fill fs-lg lh-lg"></i>
                </a>
                <ul class="dropdown-menu dropdown-menu-end" :aria-labelledby="dropdownId">
                    <li>
                        <router-link class="dropdown-item" :to="{ name: 'show-tenant', params: { id: tenant.id } }">
                            <i class="mgc_eye_line me-1"></i> View
                        </router-link>
                    </li>
                    <li>
                        <router-link class="dropdown-item" :to="{ name: 'edit-tenant', params: { id: tenant.id } }">
                            <i class="mgc_settings_3_line me-1"></i> Manage
                        </router-link>
                    </li>
                    <li>
                        <a class="dropdown-item" href="#!" @click.prevent="toggleStatus">
                            <i class="mgc_pause_circle_line me-1"></i>
                            {{ statusValue === 'active' ? 'Suspend' : 'Activate' }}
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item text-danger" href="#!" @click.prevent="deleteTenant">
                            <i class="mgc_delete_2_line me-1"></i> Delete
                        </a>
                    </li>
                </ul>
            </div>

            <div class="d-flex gap-4 align-items-center mb-6">
                <div class="avatar size-10 rounded role-icon d-flex align-items-center justify-content-center" :class="iconClass">
                    <i class="iconify tabler--building size-5"></i>
                </div>
                <div>
                    <h6 class="mb-0 fs-17">
                        <router-link :to="{ name: 'show-tenant', params: { id: tenant.id } }" class="link text-body">
                            {{ tenant.name }}
                        </router-link>
                    </h6>
                    <p class="text-muted mb-0">Total {{ domainCount }} Domain{{ domainCount === 1 ? '' : 's' }}</p>
                </div>
            </div>

            <div class="d-flex gap-2 align-items-center mb-5">
                <div class="avatar-group">
                    <a
                        v-for="(domain, idx) in previewDomains"
                        :key="domain.id || idx"
                        href="#!"
                        class="avatar-group-item"
                        :title="domain.domain"
                        @click.prevent
                    >
                        <div
                            class="size-8 rounded-circle d-flex align-items-center justify-content-center fw-semibold fs-sm text-white"
                            :style="{ backgroundColor: tenant.primary_color || '#4f46e5' }"
                        >
                            {{ (domain.domain || 'D').charAt(0).toUpperCase() }}
                        </div>
                    </a>
                    <a
                        v-if="previewDomains.length === 0"
                        href="#!"
                        class="avatar-group-item"
                        @click.prevent
                    >
                        <div
                            class="size-8 rounded-circle d-flex align-items-center justify-content-center fw-semibold fs-sm text-white"
                            :style="{ backgroundColor: tenant.primary_color || '#4f46e5' }"
                        >
                            {{ (tenant.name || 'T').charAt(0).toUpperCase() }}
                        </div>
                    </a>
                </div>
                <span v-if="moreDomains > 0" class="text-muted">+{{ moreDomains }} More</span>
                <span v-else class="text-muted">{{ primaryDomain }}</span>
            </div>

            <router-link
                :to="{ name: 'edit-tenant', params: { id: tenant.id } }"
                class="btn btn-outline-light w-100"
            >
                <i class="iconify tabler--pencil size-4 me-2"></i>Edit Tenant
            </router-link>
        </div>
    </div>
</template>
