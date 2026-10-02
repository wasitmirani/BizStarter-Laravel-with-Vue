<script setup lang="ts">
import TenantService from '../../Services/Tenant/TenantService';
import { Helpers } from '../../Utils/Helper';

const props = defineProps<{
    tenants: any;
    isLoading: boolean;
    getTenants: (page?: number, perPage?: number) => void;
    currentFilters: Record<string, unknown>;
}>();

const toast = Helpers.useDynamicInject<{ showToast: (status: number, title: string, message: string) => void }>(
    'toast',
    { showToast: () => {} }
);

const rows = Helpers.useDynamicComputed(() => {
    const value = props.tenants;
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return value.data ?? [];
});

const meta = Helpers.useDynamicComputed(() => {
    const value = props.tenants;
    if (!value || Array.isArray(value)) {
        return { from: 0, to: 0, total: rows.value.length, current_page: 1, last_page: 1 };
    }
    return value;
});

const primaryDomain = (row: any) => row?.domains?.[0]?.domain || '-';

const statusValue = (row: any) =>
    typeof row.status === 'object' ? row.status?.value ?? row.status : row.status;

const deleteTenant = (item: any) => {
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
            TenantService.delete(item.id)
                .then(() => {
                    Helpers.Swal().fire({ title: 'Deleted!', text: 'Tenant has been deleted.', icon: 'success' });
                    props.getTenants();
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

const toggleStatus = (item: any) => {
    const next = statusValue(item) === 'active' ? 'suspended' : 'active';
    TenantService.updateStatus(item.id, next)
        .then(() => {
            toast.value.showToast(200, 'Success', `Tenant ${next}`);
            props.getTenants();
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
    <div class="card-body">
        <div class="table-card table-responsive custom-scroll">
            <table class="table mb-0 text-nowrap align-middle">
                <thead>
                    <tr class="border-bottom">
                        <th class="text-muted fw-medium">Name</th>
                        <th class="text-muted fw-medium">Domain</th>
                        <th class="text-muted fw-medium">Timezone</th>
                        <th class="text-muted fw-medium">Created Date</th>
                        <th class="text-muted fw-medium">Status</th>
                        <th class="text-muted fw-medium text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="isLoading">
                        <td colspan="6" class="text-center py-5 text-muted">Loading tenants...</td>
                    </tr>
                    <tr v-else-if="!rows.length">
                        <td colspan="6" class="text-center py-5">
                            <p class="text-muted mb-3">No tenants found. Create your first tenant to get started.</p>
                            <router-link :to="{ name: 'create-tenant' }" class="btn btn-primary btn-sm">
                                <i class="mgc_add_line me-1"></i> Add New Tenant
                            </router-link>
                        </td>
                    </tr>
                    <tr v-for="row in rows" :key="row.id" v-else>
                        <td>
                            <div class="d-flex align-items-center gap-3">
                                <div
                                    class="rounded-circle size-11 d-flex align-items-center justify-content-center text-white fw-semibold"
                                    :style="{ backgroundColor: row.primary_color || '#4f46e5' }"
                                >
                                    {{ (row.name || 'T').charAt(0).toUpperCase() }}
                                </div>
                                <div>
                                    <h6 class="mb-0 fs-16">
                                        <router-link
                                            :to="{ name: 'show-tenant', params: { id: row.id } }"
                                            class="link text-body"
                                        >
                                            {{ row.name }}
                                        </router-link>
                                    </h6>
                                    <p class="text-muted fs-15 mb-0">{{ row.email }}</p>
                                </div>
                            </div>
                        </td>
                        <td>{{ primaryDomain(row) }}</td>
                        <td>{{ row.timezone || 'UTC' }}</td>
                        <td>
                            <template v-if="row.created_at">
                                {{ $filters.DateTimeFormat(row.created_at) }}
                            </template>
                            <template v-else>-</template>
                        </td>
                        <td>
                            <span
                                class="badge border"
                                :class="
                                    statusValue(row) === 'active'
                                        ? 'bg-success-subtle text-success-emphasis border-success-subtle'
                                        : 'bg-danger-subtle text-danger-emphasis border-danger-subtle'
                                "
                            >
                                {{ statusValue(row) === 'active' ? 'Active' : 'Suspended' }}
                            </span>
                        </td>
                        <td>
                            <div class="d-flex gap-2 justify-content-center">
                                <button
                                    type="button"
                                    class="btn btn-outline-light btn-icon size-7-5"
                                    aria-label="Preview"
                                    @click="Helpers.router().push({ name: 'show-tenant', params: { id: row.id } })"
                                >
                                    <i class="mgc_eye_line"></i>
                                </button>
                                <button
                                    type="button"
                                    class="btn btn-outline-light btn-icon size-7-5"
                                    aria-label="Edit"
                                    @click="Helpers.router().push({ name: 'edit-tenant', params: { id: row.id } })"
                                >
                                    <i class="mgc_pencil_2_ai_line"></i>
                                </button>
                                <button
                                    type="button"
                                    class="btn btn-outline-light btn-icon size-7-5"
                                    aria-label="Toggle status"
                                    @click="toggleStatus(row)"
                                >
                                    <i class="mgc_pause_circle_line"></i>
                                </button>
                                <button
                                    type="button"
                                    class="btn btn-outline-light btn-icon size-7-5 text-danger"
                                    aria-label="Delete"
                                    @click="deleteTenant(row)"
                                >
                                    <i class="mgc_delete_2_line"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="d-flex align-items-center justify-content-between flex-wrap gap-3 mt-4" v-if="meta.total">
            <p class="text-muted mb-0">
                Showing <strong>{{ meta.from || 0 }}-{{ meta.to || 0 }}</strong>
                of <strong>{{ meta.total || 0 }}</strong> Results
            </p>
            <nav v-if="meta.last_page > 1">
                <ul class="pagination mb-0">
                    <li class="page-item" :class="{ disabled: meta.current_page <= 1 }">
                        <a
                            class="page-link"
                            href="#!"
                            @click.prevent="meta.current_page > 1 && getTenants(meta.current_page - 1)"
                        >
                            Previous
                        </a>
                    </li>
                    <li
                        v-for="page in meta.last_page"
                        :key="page"
                        class="page-item"
                        :class="{ active: page === meta.current_page }"
                    >
                        <a class="page-link" href="#!" @click.prevent="getTenants(page)">{{ page }}</a>
                    </li>
                    <li class="page-item" :class="{ disabled: meta.current_page >= meta.last_page }">
                        <a
                            class="page-link"
                            href="#!"
                            @click.prevent="meta.current_page < meta.last_page && getTenants(meta.current_page + 1)"
                        >
                            Next
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>
