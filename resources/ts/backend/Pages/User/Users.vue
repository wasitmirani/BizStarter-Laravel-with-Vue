<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import UserService from '../../Services/User/UserService';
import PageHeader from '../Admissions/Components/PageHeader.vue';
import MetricCard from '../Admissions/Components/MetricCard.vue';
import EmptyState from '../Admissions/Components/EmptyState.vue';
import Pagination from '../Admissions/Components/Pagination.vue';
import ConfirmDialog from '../Admissions/Components/ConfirmDialog.vue';
import { useGlobal } from '../../../shared/composables/useGlobal';

const route = useRoute();
const { hasPermission } = useGlobal();

const users = ref<any>({ data: [], current_page: 1, last_page: 1, total: 0, per_page: 10 });
const roles = ref<any[]>([]);
const stats = ref<any>({});
const loading = ref(true);
const error = ref('');
const notice = ref('');
const impersonating = ref<string | null>(null);
const pendingDelete = ref<any>(null);
const deleting = ref(false);

const filters = reactive({
    search: '',
    role: typeof route.query.role === 'string' ? route.query.role : '',
    is_active: '',
    date_range: '',
    per_page: '10',
    sort: 'newest',
});

const page = ref(1);
let searchTimer: number | undefined;

const meta = computed(() => ({
    current_page: users.value.current_page ?? 1,
    last_page: users.value.last_page ?? 1,
    total: users.value.total ?? 0,
    per_page: users.value.per_page ?? Number(filters.per_page) ?? 10,
}));

const sortParams = computed(() => {
    switch (filters.sort) {
        case 'oldest':
            return { sort_by: 'created_at', sort_dir: 'asc' };
        case 'name':
            return { sort_by: 'name', sort_dir: 'asc' };
        case 'name_desc':
            return { sort_by: 'name', sort_dir: 'desc' };
        case 'login':
            return { sort_by: 'last_login', sort_dir: 'desc' };
        default:
            return { sort_by: 'created_at', sort_dir: 'desc' };
    }
});

const activeFilterCount = computed(
    () => [filters.search, filters.role, filters.is_active, filters.date_range].filter((value) => value !== '').length,
);

const totalLabel = computed(() => {
    const total = meta.value.total;
    return `${total} ${total === 1 ? 'user' : 'users'}`;
});

const load = async (targetPage = page.value) => {
    loading.value = true;
    error.value = '';

    try {
        const response = await UserService.users({
            page: targetPage,
            per_page: filters.per_page,
            search: filters.search.trim(),
            role: filters.role,
            is_active: filters.is_active,
            date_range: filters.date_range,
            ...sortParams.value,
        });

        const result = response.data.result;
        users.value = result.users ?? users.value;
        roles.value = result.roles ?? [];
        stats.value = result.stats ?? {};
        page.value = users.value.current_page ?? targetPage;
    } catch (exception: any) {
        error.value =
            exception?.response?.data?.message ??
            exception?.message ??
            'Unable to load users. Please try again.';
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
    filters.role = '';
    filters.is_active = '';
    filters.date_range = '';
    filters.sort = 'newest';
    applyFilters();
};

const scheduleSearch = () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(applyFilters, 350);
};

watch(
    () => [filters.role, filters.is_active, filters.date_range, filters.per_page, filters.sort],
    () => applyFilters(),
);

const changePage = (target: number) => {
    page.value = target;
    load(target);
};

const initials = (user: any) => {
    const source = user?.name || [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.email || '?';
    return source
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part: string) => part.charAt(0).toUpperCase())
        .join('');
};

const formatDate = (value?: string | null, withTime = false) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    });
};

const roleNames = (user: any) => (Array.isArray(user?.roles) ? user.roles.map((role: any) => role.name) : []);

const confirmDelete = async () => {
    if (!pendingDelete.value || deleting.value) return;

    deleting.value = true;
    try {
        await UserService.delete(pendingDelete.value.uuid);
        notice.value = `${pendingDelete.value.name} has been deleted.`;
        pendingDelete.value = null;
        await load(Math.min(page.value, users.value.last_page ?? 1));
    } catch (exception: any) {
        error.value = exception?.response?.data?.message ?? 'Unable to delete this user.';
    } finally {
        deleting.value = false;
    }
};

const impersonate = async (user: any) => {
    if (impersonating.value) return;

    impersonating.value = user.uuid;
    error.value = '';

    try {
        const response = await UserService.impersonate(user.uuid);
        const payload = response.data.result;

        if (!response.data.status || !payload?.token) {
            throw new Error(response.data.message ?? 'Impersonation failed.');
        }

        window.token = payload.token;
        window.user = payload.user;
        axios.defaults.headers.common.Authorization = `Bearer ${payload.token}`;
        window.location.href = '/app/dashboard';
    } catch (exception: any) {
        error.value = exception?.response?.data?.message ?? exception?.message ?? 'Impersonation failed.';
        impersonating.value = null;
    }
};

onMounted(() => load(1));
onBeforeUnmount(() => window.clearTimeout(searchTimer));
</script>

<template>
    <div>
        <PageHeader
            title="Users"
            subtitle="Manage workspace accounts, access roles and impersonation from one place."
        >
            <template #actions>
                <button type="button" class="btn btn-sm btn-light" :disabled="loading" @click="load()">
                    <AppIcon name="refresh" class="me-1" />Refresh
                </button>
                <router-link v-if="hasPermission('create-user')" :to="{ name: 'create-user' }" class="btn btn-sm btn-primary">
                    <AppIcon name="plus" class="me-1" />Add user
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
                <MetricCard
                    label="Total users"
                    :value="stats.total ?? meta.total"
                    :hint="`${stats.active ?? 0} active · ${stats.inactive ?? 0} inactive`"
                    icon="users"
                    tone="primary"
                />
            </div>
            <div class="col-sm-6 col-xl-3">
                <MetricCard
                    label="Administrators"
                    :value="stats.admins ?? 0"
                    hint="Full workspace access"
                    icon="shield-check"
                    tone="success"
                />
            </div>
            <div class="col-sm-6 col-xl-3">
                <MetricCard
                    label="New in 30 days"
                    :value="stats.new_30_days ?? 0"
                    hint="Recently created accounts"
                    icon="sparkles"
                    tone="info"
                />
            </div>
            <div class="col-sm-6 col-xl-3">
                <MetricCard
                    label="Verified emails"
                    :value="stats.verified ?? 0"
                    hint="Confirmed email addresses"
                    icon="mail"
                    tone="warning"
                />
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-body py-3">
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
                    <div class="d-flex flex-wrap align-items-center gap-2">
                        <span class="text-muted fs-14 fw-medium">Role coverage</span>
                        <router-link
                            v-for="role in roles"
                            :key="role.id"
                            :to="{ name: 'users', query: { role: role.name } }"
                            class="chip text-decoration-none"
                        >
                            <AppIcon name="shield" :size="13" />{{ role.name }}
                            <span class="fw-normal">{{ role.users_count }}</span>
                        </router-link>
                        <span v-if="!roles.length" class="text-muted fs-14">No roles configured yet.</span>
                    </div>
                    <router-link :to="{ name: 'roles' }" class="link link-custom-primary fs-14">
                        Manage roles <AppIcon name="arrow-right" :size="14" />
                    </router-link>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header align-items-start gap-3">
                <div class="d-flex flex-wrap align-items-center gap-2 flex-grow-1">
                    <div class="position-relative" style="min-width: 240px; flex: 1 1 240px; max-width: 360px">
                        <AppIcon name="search" class="position-absolute text-muted" style="left: 12px; top: 50%; transform: translateY(-50%)" :size="16" />
                        <input
                            v-model="filters.search"
                            type="search"
                            class="form-control ps-10"
                            placeholder="Search name, email or ID…"
                            aria-label="Search users"
                            @input="scheduleSearch"
                        />
                    </div>

                    <select v-model="filters.role" class="form-select w-auto" aria-label="Filter by role">
                        <option value="">All roles</option>
                        <option v-for="role in roles" :key="role.id" :value="role.name">{{ role.name }}</option>
                    </select>

                    <select v-model="filters.is_active" class="form-select w-auto" aria-label="Filter by status">
                        <option value="">Any status</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </select>

                    <select v-model="filters.date_range" class="form-select w-auto" aria-label="Filter by joined date">
                        <option value="">Any join date</option>
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 90 days</option>
                    </select>

                    <select v-model="filters.sort" class="form-select w-auto" aria-label="Sort users">
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                        <option value="name">Name A–Z</option>
                        <option value="name_desc">Name Z–A</option>
                        <option value="login">Recently signed in</option>
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
                <div v-for="index in 5" :key="index" class="d-flex align-items-center gap-3 py-3 border-bottom">
                    <span class="placeholder-glow d-inline-block rounded-circle" style="width: 38px; height: 38px">
                        <span class="placeholder col-12 h-100 rounded-circle"></span>
                    </span>
                    <span class="placeholder-glow flex-grow-1">
                        <span class="placeholder col-4 d-block mb-2"></span>
                        <span class="placeholder col-2 d-block"></span>
                    </span>
                    <span class="placeholder-glow d-none d-md-block" style="width: 120px">
                        <span class="placeholder col-12"></span>
                    </span>
                </div>
            </div>

            <div v-else-if="!users.data?.length" class="card-body">
                <EmptyState
                    icon="users"
                    title="No users match these filters"
                    message="Try a different search term, role or status."
                >
                    <button v-if="activeFilterCount" type="button" class="btn btn-sm btn-primary" @click="resetFilters">
                        Reset filters
                    </button>
                </EmptyState>
            </div>

            <div v-else class="table-responsive">
                <table class="table align-middle mb-0">
                    <thead>
                        <tr>
                            <th class="text-muted fw-medium">User</th>
                            <th class="text-muted fw-medium">Role</th>
                            <th class="text-muted fw-medium">Status</th>
                            <th class="text-muted fw-medium d-none d-xxl-table-cell">Phone</th>
                            <th class="text-muted fw-medium d-none d-lg-table-cell text-nowrap">Last sign-in</th>
                            <th class="text-muted fw-medium d-none d-md-table-cell text-nowrap">Joined</th>
                            <th class="text-muted fw-medium text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in users.data" :key="user.id">
                            <td>
                                <div class="d-flex align-items-center gap-3">
                                    <span class="avatar rounded-circle bg-primary-subtle text-primary fw-semibold flex-shrink-0" style="width: 38px; height: 38px">
                                        {{ initials(user) }}
                                    </span>
                                    <div class="min-w-0">
                                        <router-link :to="{ name: 'show-user', params: { uuid: user.uuid } }" class="fw-semibold text-body d-block text-truncate">
                                            {{ user.name }}
                                        </router-link>
                                        <span class="text-muted fs-14 d-block text-truncate">{{ user.email }}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="d-flex flex-wrap gap-1">
                                    <span v-for="role in roleNames(user)" :key="role" class="chip">
                                        <AppIcon name="shield" :size="12" />{{ role }}
                                    </span>
                                    <span v-if="!roleNames(user).length" class="text-muted fs-14">No role</span>
                                </div>
                            </td>
                            <td>
                                <span class="badge border" :class="user.is_active ? 'bg-success-subtle text-success border-success-subtle' : 'bg-secondary-subtle text-secondary border-secondary-subtle'">
                                    <AppIcon :name="user.is_active ? 'circle-check' : 'circle-x'" :size="12" class="me-1" />
                                    {{ user.is_active ? 'Active' : 'Inactive' }}
                                </span>
                            </td>
                            <td class="text-muted fs-14 d-none d-xxl-table-cell">
                                <span v-if="user.phone">{{ user.phone }}</span>
                                <span v-else>—</span>
                            </td>
                            <td class="fs-14 d-none d-lg-table-cell text-nowrap">
                                <span v-if="user.last_login" class="text-body">{{ formatDate(user.last_login, true) }}</span>
                                <span v-else class="chip">Never</span>
                            </td>
                            <td class="text-muted fs-14 d-none d-md-table-cell text-nowrap">{{ formatDate(user.created_at) }}</td>
                            <td>
                                <div class="d-flex justify-content-end gap-1">
                                    <router-link
                                        :to="{ name: 'show-user', params: { uuid: user.uuid } }"
                                        class="btn btn-sm btn-light btn-icon"
                                        title="View user"
                                        aria-label="View user"
                                    >
                                        <AppIcon name="eye" :size="15" />
                                    </router-link>
                                    <router-link
                                        v-if="hasPermission('edit-user')"
                                        :to="{ name: 'edit-user', params: { uuid: user.uuid } }"
                                        class="btn btn-sm btn-light btn-icon"
                                        title="Edit user"
                                        aria-label="Edit user"
                                    >
                                        <AppIcon name="edit" :size="15" />
                                    </router-link>
                                    <button
                                        v-if="user.can_impersonate"
                                        type="button"
                                        class="btn btn-sm btn-light btn-icon"
                                        title="Impersonate user"
                                        aria-label="Impersonate user"
                                        :disabled="impersonating === user.uuid"
                                        @click="impersonate(user)"
                                    >
                                        <span v-if="impersonating === user.uuid" class="spinner-border spinner-border-sm" role="status"></span>
                                        <AppIcon v-else name="user-check" :size="15" />
                                    </button>
                                    <button
                                        v-if="hasPermission('delete-user')"
                                        type="button"
                                        class="btn btn-sm btn-light btn-icon text-danger"
                                        title="Delete user"
                                        aria-label="Delete user"
                                        @click="pendingDelete = user"
                                    >
                                        <AppIcon name="trash" :size="15" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="!loading && users.data?.length" class="card-body pt-0">
                <Pagination :meta="meta" @change="changePage" />
            </div>
        </div>

        <ConfirmDialog
            :show="!!pendingDelete"
            title="Delete this user?"
            :message="pendingDelete ? `${pendingDelete.name} will lose access immediately. This cannot be undone.` : ''"
            :busy="deleting"
            confirm-label="Delete user"
            @cancel="pendingDelete = null"
            @confirm="confirmDelete"
        />
    </div>
</template>
