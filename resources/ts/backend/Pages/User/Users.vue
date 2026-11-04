<script setup lang="ts">
import { computed, inject, onMounted, ref, type Ref } from 'vue';
import UserService from '../../Services/user/UserService';
import DropDownService from '../../Services/DropDown/DropDownService';

type UserRole = { id: number; name: string };

type UserRow = {
    id: number;
    uuid: string | null;
    name: string;
    first_name?: string | null;
    last_name?: string | null;
    email: string;
    phone?: string | null;
    thumbnail?: string | null;
    is_active?: boolean;
    created_at?: string | null;
    roles?: UserRole[];
};

type RoleOption = { id: number; name: string };

const toast = inject<Ref<any>>('toast', ref(null));

const loading = ref(true);
const error = ref('');
const users = ref<UserRow[]>([]);
const roleOptions = ref<RoleOption[]>([]);
const brokenAvatars = ref<Record<number, boolean>>({});
const meta = ref({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: null as number | null,
    to: null as number | null,
});

const search = ref('');
const roleFilter = ref('');
const perPage = ref(10);

const pageWindow = computed(() => {
    const last = meta.value.last_page;
    const current = meta.value.current_page;
    const start = Math.max(1, Math.min(current - 2, last - 4));
    const end = Math.min(last, start + 4);

    return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);
});

const showingFrom = computed(() => (meta.value.total === 0 ? 0 : (meta.value.from ?? 0)));
const showingTo = computed(() => (meta.value.total === 0 ? 0 : (meta.value.to ?? 0)));

function identifier(user: UserRow): string {
    return user.uuid || String(user.id);
}

function initials(name?: string | null): string {
    return (name ?? '?')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
}

function roleNames(user: UserRow): string[] {
    const names = (user.roles ?? []).map((role) => role.name).filter(Boolean);
    return names.length ? names : ['No role'];
}

function formatDate(value?: string | null): string {
    if (!value) return '—';
    return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(
        new Date(value),
    );
}

async function loadRoles() {
    try {
        const response = await DropDownService.getRoles({ sort_by: 'name', sort_dir: 'asc' });
        const payload = response?.data?.roles ?? response?.data?.result?.roles ?? [];
        roleOptions.value = payload.map((role: any) => ({ id: role.id, name: role.name }));
    } catch {
        roleOptions.value = [];
    }
}

async function load(page = 1) {
    loading.value = true;
    error.value = '';

    try {
        const response = await UserService.users({
            page: String(page),
            per_page: String(perPage.value),
            search: search.value.trim() || undefined,
            role: roleFilter.value || undefined,
        });

        const payload = response?.data?.result?.users ?? response?.data?.users;
        users.value = payload?.data ?? [];
        meta.value = {
            current_page: payload?.current_page ?? 1,
            last_page: payload?.last_page ?? 1,
            per_page: payload?.per_page ?? perPage.value,
            total: payload?.total ?? 0,
            from: payload?.from ?? null,
            to: payload?.to ?? null,
        };
    } catch (requestError: any) {
        error.value = requestError?.response?.data?.message ?? 'We could not load users.';
    } finally {
        loading.value = false;
    }
}

async function remove(user: UserRow) {
    const confirmed = window.confirm(`Delete ${user.name}? This removes their account and cannot be undone.`);
    if (!confirmed) return;

    try {
        await UserService.delete(user.uuid || (user.id as any));
        toast.value?.showToast(200, 'User deleted', { message: `${user.name} no longer has access.` });
        await load(meta.value.current_page);
    } catch (requestError: any) {
        toast.value?.showToast(
            requestError?.response?.status ?? 500,
            'Could not delete user',
            requestError?.response?.data,
        );
    }
}

let searchTimer: ReturnType<typeof setTimeout> | null = null;
function onSearch() {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => void load(1), 320);
}

function changeFilters() {
    void load(1);
}

onMounted(async () => {
    await Promise.all([loadRoles(), load()]);
});
</script>

<template>
    <div>
        <header class="lk-page-head">
            <div>
                <h1 class="lk-page-title">Users</h1>
                <p class="lk-page-subtitle">Manage the people who can access this workspace and the roles they hold.</p>
            </div>
            <div class="lk-page-actions">
                <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" :disabled="loading" @click="load(meta.current_page)">
                    Refresh
                </button>
                <router-link :to="{ name: 'create-user' }" class="lk-btn lk-btn--primary lk-btn--sm">
                    New user
                </router-link>
            </div>
        </header>

        <section class="lk-card">
            <div class="lk-card__body access-toolbar">
                <input
                    v-model="search"
                    type="search"
                    class="lk-input"
                    placeholder="Search by name, email or phone…"
                    aria-label="Search users"
                    @input="onSearch"
                />
                <select v-model="roleFilter" class="lk-select" aria-label="Filter by role" @change="changeFilters">
                    <option value="">All roles</option>
                    <option v-for="role in roleOptions" :key="role.id" :value="role.name">{{ role.name }}</option>
                </select>
                <select v-model.number="perPage" class="lk-select" aria-label="Rows per page" @change="changeFilters">
                    <option :value="10">10 per page</option>
                    <option :value="15">15 per page</option>
                    <option :value="25">25 per page</option>
                    <option :value="50">50 per page</option>
                </select>
            </div>

            <div class="lk-card__body lk-card__body--flush">
                <div v-if="loading" class="lk-card__body" aria-busy="true">
                    <span class="lk-skeleton" style="display: block; height: 12px; width: 45%"></span>
                    <span class="lk-skeleton" style="display: block; height: 12px; width: 70%; margin-top: 10px"></span>
                    <span class="lk-skeleton" style="display: block; height: 12px; width: 60%; margin-top: 10px"></span>
                </div>

                <div v-else-if="error" class="lk-state lk-state--error">
                    <p class="lk-state__title">Users unavailable</p>
                    <p class="lk-state__text">{{ error }}</p>
                    <button type="button" class="lk-btn lk-btn--secondary lk-btn--sm" style="margin-top: 8px" @click="load()">
                        Try again
                    </button>
                </div>

                <div v-else-if="!users.length" class="lk-state">
                    <p class="lk-state__title">No users found</p>
                    <p class="lk-state__text">
                        {{ search || roleFilter ? 'No user matches those filters.' : 'Add your first teammate to get started.' }}
                    </p>
                </div>

                <div v-else class="lk-table-wrap">
                    <table class="lk-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Roles</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Joined</th>
                                <th aria-label="Actions"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in users" :key="user.id">
                                <td>
                                    <div class="access-cell">
                                        <img
                                            v-if="user.thumbnail && !brokenAvatars[user.id]"
                                            :src="user.thumbnail"
                                            alt=""
                                            class="lk-avatar lk-avatar--sm"
                                            @error="brokenAvatars[user.id] = true"
                                        />
                                        <span v-else class="lk-avatar lk-avatar--sm lk-avatar--initials">
                                            {{ initials(user.name) }}
                                        </span>
                                        <div>
                                            <router-link
                                                :to="{ name: 'show-user', params: { uuid: identifier(user) } }"
                                                class="access-cell__title"
                                            >
                                                {{ user.name }}
                                            </router-link>
                                            <p class="access-cell__meta">{{ user.email }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="access-chip-row">
                                        <span
                                            v-for="role in roleNames(user)"
                                            :key="`${user.id}-${role}`"
                                            class="lk-badge"
                                            :class="role === 'No role' ? 'lk-badge--neutral' : 'lk-badge--info'"
                                        >
                                            {{ role }}
                                        </span>
                                    </div>
                                </td>
                                <td class="access-muted">{{ user.phone || '—' }}</td>
                                <td>
                                    <span class="lk-badge" :class="user.is_active === false ? 'lk-badge--neutral' : 'lk-badge--success'">
                                        {{ user.is_active === false ? 'Inactive' : 'Active' }}
                                    </span>
                                </td>
                                <td class="access-muted">{{ formatDate(user.created_at) }}</td>
                                <td>
                                    <div class="access-actions">
                                        <router-link
                                            :to="{ name: 'show-user', params: { uuid: identifier(user) } }"
                                            class="lk-btn lk-btn--ghost lk-btn--sm"
                                        >
                                            View
                                        </router-link>
                                        <router-link
                                            :to="{ name: 'edit-user', params: { uuid: identifier(user) } }"
                                            class="lk-btn lk-btn--ghost lk-btn--sm"
                                        >
                                            Edit
                                        </router-link>
                                        <button
                                            type="button"
                                            class="lk-btn lk-btn--ghost lk-btn--sm access-danger"
                                            @click="remove(user)"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-if="!loading && !error && meta.total > 0" class="lk-pagination">
                <p class="lk-pagination__meta">
                    Showing {{ showingFrom }}–{{ showingTo }} of {{ meta.total }} users
                </p>
                <div class="lk-pagination__buttons">
                    <button type="button" :disabled="meta.current_page <= 1" @click="load(meta.current_page - 1)">
                        Previous
                    </button>
                    <button
                        v-for="page in pageWindow"
                        :key="page"
                        type="button"
                        :class="{ 'is-active': page === meta.current_page }"
                        @click="load(page)"
                    >
                        {{ page }}
                    </button>
                    <button type="button" :disabled="meta.current_page >= meta.last_page" @click="load(meta.current_page + 1)">
                        Next
                    </button>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.access-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.access-toolbar .lk-input {
    flex: 1 1 260px;
}

.access-toolbar .lk-select {
    width: auto;
    min-width: 150px;
}

.access-cell {
    display: flex;
    align-items: center;
    gap: 10px;
}

.access-cell__title {
    font-weight: 600;
    color: var(--lk-text);
    text-decoration: none;
}

.access-cell__title:hover {
    color: var(--lk-primary);
}

.access-cell__meta {
    margin: 2px 0 0;
    font-size: 11.5px;
    color: var(--lk-text-muted);
}

.access-chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.access-muted {
    color: var(--lk-text-muted);
}

.access-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    justify-content: flex-end;
    flex-wrap: wrap;
}

.access-danger {
    color: var(--lk-error);
}
</style>
