<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import RoleService from '../../Services/Role/RoleService';
import PageHeader from '../Admissions/Components/PageHeader.vue';
import MetricCard from '../Admissions/Components/MetricCard.vue';
import EmptyState from '../Admissions/Components/EmptyState.vue';
import Pagination from '../Admissions/Components/Pagination.vue';
import ConfirmDialog from '../Admissions/Components/ConfirmDialog.vue';
import { useGlobal } from '../../../shared/composables/useGlobal';

const { hasPermission } = useGlobal();

const roles = ref<any>({ data: [], current_page: 1, last_page: 1, total: 0, per_page: 10 });
const stats = ref<any>({});
const loading = ref(true);
const error = ref('');
const notice = ref('');
const pendingDelete = ref<any>(null);
const deleting = ref(false);
const page = ref(1);

const filters = reactive({
    search: '',
    scope: '',
    sort_dir: 'asc',
    per_page: '10',
});

let searchTimer: number | undefined;

const meta = computed(() => ({
    current_page: roles.value.current_page ?? 1,
    last_page: roles.value.last_page ?? 1,
    total: roles.value.total ?? 0,
    per_page: roles.value.per_page ?? Number(filters.per_page) ?? 10,
}));

const activeFilterCount = computed(() => [filters.search, filters.scope].filter((value) => value !== '').length);
const totalLabel = computed(() => `${meta.value.total} ${meta.value.total === 1 ? 'role' : 'roles'}`);

const load = async (targetPage = page.value) => {
    loading.value = true;
    error.value = '';

    try {
        const response = await RoleService.roles({
            page: targetPage,
            per_page: filters.per_page,
            search: filters.search.trim(),
            scope: filters.scope,
            sort_dir: filters.sort_dir,
        });

        const result = response.data.result;
        roles.value = result.roles ?? roles.value;
        stats.value = result.stats ?? {};
        page.value = roles.value.current_page ?? targetPage;
    } catch (exception: any) {
        error.value = exception?.response?.data?.message ?? exception?.message ?? 'Unable to load roles.';
    } finally {
        loading.value = false;
    }
};

const applyFilters = () => {
    page.value = 1;
    load(1);
};

const resetFilters = () => {
    filters.search = '';
    filters.scope = '';
    filters.sort_dir = 'asc';
    applyFilters();
};

const scheduleSearch = () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(applyFilters, 350);
};

watch(
    () => [filters.scope, filters.sort_dir, filters.per_page],
    () => applyFilters(),
);

const changePage = (target: number) => {
    page.value = target;
    load(target);
};

const formatDate = (value?: string | null) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
};

const isProtected = (role: any) => role?.scope === 'system' || ['admin', 'super-admin'].includes(role?.name?.toLowerCase());

const confirmDelete = async () => {
    if (!pendingDelete.value || deleting.value) return;

    deleting.value = true;
    try {
        await RoleService.delete(pendingDelete.value.id);
        notice.value = `${pendingDelete.value.name} role has been deleted.`;
        pendingDelete.value = null;
        await load(Math.min(page.value, roles.value.last_page ?? 1));
    } catch (exception: any) {
        error.value = exception?.response?.data?.message ?? 'Unable to delete this role.';
    } finally {
        deleting.value = false;
    }
};

onMounted(() => load(1));
onBeforeUnmount(() => window.clearTimeout(searchTimer));
</script>

<template>
    <div>
        <PageHeader title="Roles" subtitle="Define what each team member can see and do across the workspace.">
            <template #actions>
                <button type="button" class="btn btn-sm btn-light" :disabled="loading" @click="load()">
                    <AppIcon name="refresh" class="me-1" />Refresh
                </button>
                <router-link v-if="hasPermission('create-role')" :to="{ name: 'create-role' }" class="btn btn-sm btn-primary">
                    <AppIcon name="plus" class="me-1" />Add role
                </router-link>
            </template>
        </PageHeader>

        <div v-if="error" class="alert alert-danger py-2 d-flex align-items-start gap-2">
            <AppIcon name="alert-triangle" class="mt-1" />
            <span class="flex-grow-1">{{ error }}</span>
            <button type="button" class="btn-close" aria-label="Dismiss" @click="error = ''"></button>
        </div>
        <div v-if="notice" class="alert alert-success py-2 d-flex align-items-start gap-2">
            <AppIcon name="circle-check" class="mt-1" />
            <span class="flex-grow-1">{{ notice }}</span>
            <button type="button" class="btn-close" aria-label="Dismiss" @click="notice = ''"></button>
        </div>

        <div class="row g-4 mb-4">
            <div class="col-sm-6 col-xl-3">
                <MetricCard label="Total roles" :value="stats.total ?? meta.total" hint="Workspace access profiles" icon="shield" tone="primary" />
            </div>
            <div class="col-sm-6 col-xl-3">
                <MetricCard label="Built-in roles" :value="stats.system ?? 0" hint="Managed by the platform" icon="lock" tone="warning" />
            </div>
            <div class="col-sm-6 col-xl-3">
                <MetricCard label="Custom roles" :value="stats.custom ?? 0" hint="Created for this workspace" icon="sparkles" tone="info" />
            </div>
            <div class="col-sm-6 col-xl-3">
                <MetricCard
                    label="Permissions"
                    :value="stats.permissions ?? 0"
                    :hint="`${stats.assigned_users ?? 0} ${(stats.assigned_users ?? 0) === 1 ? 'user' : 'users'} with a role`"
                    icon="key"
                    tone="success"
                />
            </div>
        </div>

        <div class="card">
            <div class="card-header align-items-start gap-3">
                <div class="d-flex flex-wrap align-items-center gap-2 flex-grow-1">
                    <div class="position-relative" style="min-width: 240px; flex: 1 1 240px; max-width: 340px">
                        <AppIcon name="search" class="position-absolute text-muted" style="left: 12px; top: 50%; transform: translateY(-50%)" :size="16" />
                        <input
                            v-model="filters.search"
                            type="search"
                            class="form-control ps-10"
                            placeholder="Search roles…"
                            aria-label="Search roles"
                            @input="scheduleSearch"
                        />
                    </div>

                    <select v-model="filters.scope" class="form-select w-auto" aria-label="Filter by role type">
                        <option value="">All role types</option>
                        <option value="system">Built-in</option>
                        <option value="custom">Custom</option>
                    </select>

                    <select v-model="filters.sort_dir" class="form-select w-auto" aria-label="Sort roles">
                        <option value="asc">Name A–Z</option>
                        <option value="desc">Name Z–A</option>
                    </select>

                    <button v-if="activeFilterCount" type="button" class="btn btn-sm btn-light" @click="resetFilters">
                        <AppIcon name="x" class="me-1" />Clear filters ({{ activeFilterCount }})
                    </button>
                </div>

                <div class="d-flex align-items-center gap-2 ms-auto">
                    <span class="text-muted fs-14 text-nowrap">{{ totalLabel }}</span>
                    <select v-model="filters.per_page" class="form-select form-select-sm w-auto" aria-label="Rows per page">
                        <option value="10">10 / page</option>
                        <option value="20">20 / page</option>
                        <option value="50">50 / page</option>
                    </select>
                </div>
            </div>

            <div v-if="loading" class="card-body py-4">
                <div v-for="index in 4" :key="index" class="d-flex align-items-center gap-3 py-3 border-bottom">
                    <span class="placeholder-glow d-inline-block rounded" style="width: 38px; height: 38px">
                        <span class="placeholder col-12 h-100"></span>
                    </span>
                    <span class="placeholder-glow flex-grow-1">
                        <span class="placeholder col-4 d-block mb-2"></span>
                        <span class="placeholder col-2 d-block"></span>
                    </span>
                    <span class="placeholder-glow d-none d-md-block" style="width: 100px">
                        <span class="placeholder col-12"></span>
                    </span>
                </div>
            </div>

            <div v-else-if="!roles.data?.length" class="card-body">
                <EmptyState icon="shield" title="No roles found" message="Try a different search term or role type.">
                    <button v-if="activeFilterCount" type="button" class="btn btn-sm btn-primary" @click="resetFilters">Reset filters</button>
                </EmptyState>
            </div>

            <div v-else class="table-responsive">
                <table class="table align-middle mb-0">
                    <thead>
                        <tr>
                            <th class="text-muted fw-medium">Role</th>
                            <th class="text-muted fw-medium">Type</th>
                            <th class="text-muted fw-medium">Users</th>
                            <th class="text-muted fw-medium">Permissions</th>
                            <th class="text-muted fw-medium d-none d-md-table-cell">Created</th>
                            <th class="text-muted fw-medium text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="role in roles.data" :key="role.id">
                            <td>
                                <div class="d-flex align-items-center gap-3">
                                    <span class="avatar rounded bg-primary-subtle text-primary flex-shrink-0" style="width: 38px; height: 38px">
                                        <AppIcon name="shield-check" :size="18" />
                                    </span>
                                    <div class="min-w-0">
                                        <router-link :to="{ name: 'show-role', params: { id: role.uuid } }" class="fw-semibold text-body d-block text-truncate">
                                            {{ role.name }}
                                        </router-link>
                                        <span class="text-muted fs-14 d-block text-truncate">{{ role.guard_name }} guard</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="badge border" :class="role.scope === 'system' ? 'bg-warning-subtle text-warning border-warning-subtle' : 'bg-info-subtle text-info border-info-subtle'">
                                    <AppIcon :name="role.scope === 'system' ? 'lock' : 'sparkles'" :size="12" class="me-1" />
                                    {{ role.scope === 'system' ? 'Built-in' : 'Custom' }}
                                </span>
                            </td>
                            <td>
                                <span class="chip"><AppIcon name="users" :size="12" />{{ role.users_count ?? 0 }} {{ (role.users_count ?? 0) === 1 ? 'user' : 'users' }}</span>
                            </td>
                            <td>
                                <span class="chip"><AppIcon name="key" :size="12" />{{ role.permissions_count ?? 0 }} {{ (role.permissions_count ?? 0) === 1 ? 'permission' : 'permissions' }}</span>
                            </td>
                            <td class="text-muted fs-14 d-none d-md-table-cell">{{ formatDate(role.created_at) }}</td>
                            <td>
                                <div class="d-flex justify-content-end gap-1">
                                    <router-link
                                        :to="{ name: 'show-role', params: { id: role.uuid } }"
                                        class="btn btn-sm btn-light btn-icon"
                                        title="View role"
                                        aria-label="View role"
                                    >
                                        <AppIcon name="eye" :size="15" />
                                    </router-link>
                                    <router-link
                                        v-if="hasPermission('edit-role')"
                                        :to="{ name: 'edit-role', params: { id: role.uuid } }"
                                        class="btn btn-sm btn-light btn-icon"
                                        title="Edit role"
                                        aria-label="Edit role"
                                    >
                                        <AppIcon name="edit" :size="15" />
                                    </router-link>
                                    <button
                                        v-if="hasPermission('delete-role')"
                                        type="button"
                                        class="btn btn-sm btn-light btn-icon"
                                        :class="isProtected(role) ? 'text-muted' : 'text-danger'"
                                        :disabled="isProtected(role)"
                                        :title="isProtected(role) ? 'Built-in roles cannot be deleted' : 'Delete role'"
                                        :aria-label="isProtected(role) ? 'Built-in roles cannot be deleted' : 'Delete role'"
                                        @click="pendingDelete = role"
                                    >
                                        <AppIcon :name="isProtected(role) ? 'lock' : 'trash'" :size="15" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="!loading && roles.data?.length" class="card-body pt-0">
                <Pagination :meta="meta" @change="changePage" />
            </div>
        </div>

        <ConfirmDialog
            :show="!!pendingDelete"
            title="Delete this role?"
            :message="pendingDelete ? `The ${pendingDelete.name} role will be removed. Users keep their accounts but lose these permissions.` : ''"
            :busy="deleting"
            confirm-label="Delete role"
            @cancel="pendingDelete = null"
            @confirm="confirmDelete"
        />
    </div>
</template>
