<script setup lang="ts">
import { computed, inject, onMounted, ref, type Ref } from 'vue';
import RoleService from '../../Services/Role/RoleService';

type RoleRow = {
    id: number;
    uuid: string | null;
    name: string;
    guard_name: string;
    scope?: string | null;
    users_count?: number;
    permissions_count?: number;
    created_at: string | null;
};

const toast = inject<Ref<any>>('toast', ref(null));

const loading = ref(true);
const error = ref('');
const roles = ref<RoleRow[]>([]);
const meta = ref({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: null as number | null,
    to: null as number | null,
});

const search = ref('');
const perPage = ref(10);
const sortDir = ref<'asc' | 'desc'>('asc');

const pageWindow = computed(() => {
    const last = meta.value.last_page;
    const current = meta.value.current_page;
    const start = Math.max(1, Math.min(current - 2, last - 4));
    const end = Math.min(last, start + 4);

    return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);
});

const showingFrom = computed(() => (meta.value.total === 0 ? 0 : (meta.value.from ?? 0)));
const showingTo = computed(() => (meta.value.total === 0 ? 0 : (meta.value.to ?? 0)));

function identifier(role: RoleRow): string {
    return role.uuid || String(role.id);
}

async function load(page = 1) {
    loading.value = true;
    error.value = '';

    try {
        const response = await RoleService.roles({
            page: String(page),
            per_page: String(perPage.value),
            search: search.value.trim() || undefined,
            sort_dir: sortDir.value,
        });

        const payload = response?.data?.result?.roles ?? response?.data?.roles;
        roles.value = payload?.data ?? [];
        meta.value = {
            current_page: payload?.current_page ?? 1,
            last_page: payload?.last_page ?? 1,
            per_page: payload?.per_page ?? perPage.value,
            total: payload?.total ?? 0,
            from: payload?.from ?? null,
            to: payload?.to ?? null,
        };
    } catch (requestError: any) {
        error.value = requestError?.response?.data?.message ?? 'We could not load roles.';
    } finally {
        loading.value = false;
    }
}

async function remove(role: RoleRow) {
    if (role.name.toLowerCase() === 'super-admin') {
        toast.value?.showToast(403, 'Reserved role', { message: 'The super-admin role cannot be deleted.' });
        return;
    }

    const confirmed = window.confirm(
        `Delete the "${role.name}" role? Users keep their accounts but lose the permissions this role grants.`,
    );
    if (!confirmed) return;

    try {
        await RoleService.delete(role.id);
        toast.value?.showToast(200, 'Role deleted', { message: `"${role.name}" is no longer available.` });
        await load(meta.value.current_page);
    } catch (requestError: any) {
        toast.value?.showToast(requestError?.response?.status ?? 500, 'Could not delete role', requestError?.response?.data);
    }
}

let searchTimer: ReturnType<typeof setTimeout> | null = null;
function onSearch() {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => void load(1), 320);
}

function changePerPage() {
    void load(1);
}

function changeSort() {
    void load(1);
}

function formatDate(value?: string | null): string {
    if (!value) return '—';
    return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(
        new Date(value),
    );
}

onMounted(() => void load());
</script>

<template>
    <div>
        <header class="lk-page-head">
            <div>
                <h1 class="lk-page-title">Roles</h1>
                <p class="lk-page-subtitle">Group permissions into roles and control who holds each one.</p>
            </div>
            <div class="lk-page-actions">
                <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" :disabled="loading" @click="load(meta.current_page)">
                    Refresh
                </button>
                <router-link :to="{ name: 'create-role' }" class="lk-btn lk-btn--primary lk-btn--sm">
                    New role
                </router-link>
            </div>
        </header>

        <section class="lk-card">
            <div class="lk-card__body access-toolbar">
                <input
                    v-model="search"
                    type="search"
                    class="lk-input"
                    placeholder="Search roles by name…"
                    aria-label="Search roles"
                    @input="onSearch"
                />
                <select v-model="sortDir" class="lk-select" aria-label="Sort direction" @change="changeSort">
                    <option value="asc">Name A–Z</option>
                    <option value="desc">Name Z–A</option>
                </select>
                <select v-model.number="perPage" class="lk-select" aria-label="Rows per page" @change="changePerPage">
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
                    <p class="lk-state__title">Roles unavailable</p>
                    <p class="lk-state__text">{{ error }}</p>
                    <button type="button" class="lk-btn lk-btn--secondary lk-btn--sm" style="margin-top: 8px" @click="load()">
                        Try again
                    </button>
                </div>

                <div v-else-if="!roles.length" class="lk-state">
                    <p class="lk-state__title">No roles found</p>
                    <p class="lk-state__text">
                        {{ search ? 'No role matches that search.' : 'Create a role to start grouping permissions.' }}
                    </p>
                </div>

                <div v-else class="lk-table-wrap">
                    <table class="lk-table">
                        <thead>
                            <tr>
                                <th>Role</th>
                                <th>Guard</th>
                                <th>Permissions</th>
                                <th>Users</th>
                                <th>Created</th>
                                <th aria-label="Actions"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="role in roles" :key="role.id">
                                <td>
                                    <div class="access-cell">
                                        <span class="lk-avatar lk-avatar--sm lk-avatar--initials">
                                            {{ role.name.slice(0, 2).toUpperCase() }}
                                        </span>
                                        <div>
                                            <router-link
                                                :to="{ name: 'show-role', params: { id: identifier(role) } }"
                                                class="access-cell__title"
                                            >
                                                {{ role.name }}
                                            </router-link>
                                            <p class="access-cell__meta">{{ role.scope || 'system' }} role</p>
                                        </div>
                                    </div>
                                </td>
                                <td><span class="lk-badge lk-badge--neutral">{{ role.guard_name }}</span></td>
                                <td>
                                    <span class="lk-badge" :class="(role.permissions_count ?? 0) ? 'lk-badge--info' : 'lk-badge--neutral'">
                                        {{ role.permissions_count ?? 0 }}
                                    </span>
                                </td>
                                <td>
                                    <span class="lk-badge" :class="(role.users_count ?? 0) ? 'lk-badge--success' : 'lk-badge--neutral'">
                                        {{ role.users_count ?? 0 }}
                                    </span>
                                </td>
                                <td class="access-muted">{{ formatDate(role.created_at) }}</td>
                                <td>
                                    <div class="access-actions">
                                        <router-link
                                            :to="{ name: 'show-role', params: { id: identifier(role) } }"
                                            class="lk-btn lk-btn--ghost lk-btn--sm"
                                        >
                                            View
                                        </router-link>
                                        <router-link
                                            :to="{ name: 'edit-role', params: { id: identifier(role) } }"
                                            class="lk-btn lk-btn--ghost lk-btn--sm"
                                        >
                                            Edit
                                        </router-link>
                                        <button
                                            type="button"
                                            class="lk-btn lk-btn--ghost lk-btn--sm access-danger"
                                            :disabled="role.name.toLowerCase() === 'super-admin'"
                                            @click="remove(role)"
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
                    Showing {{ showingFrom }}–{{ showingTo }} of {{ meta.total }} roles
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
    flex: 1 1 240px;
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
    text-transform: capitalize;
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

.access-danger:disabled {
    opacity: 0.4;
}
</style>
