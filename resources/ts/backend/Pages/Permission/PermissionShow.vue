<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import PermissionService from '../../Services/Permission/PermissionService';

type PermissionUser = {
    id: number;
    uuid?: string | null;
    name: string;
    email?: string | null;
    thumbnail?: string | null;
};

type PermissionRole = {
    id: number;
    name: string;
};

type PermissionDetail = {
    id: number;
    uuid: string | null;
    name: string;
    guard_name: string;
    slug?: string | null;
    scope?: string | null;
    created_at?: string | null;
    roles?: PermissionRole[];
    users?: PermissionUser[];
};

const route = useRoute();

const loading = ref(true);
const error = ref('');
const permission = ref<PermissionDetail | null>(null);
const brokenAvatars = ref<Record<number, boolean>>({});

const permissionKey = computed(() => (route.params.id ? String(route.params.id) : ''));
const roles = computed(() => permission.value?.roles ?? []);
const users = computed(() => permission.value?.users ?? []);

async function load() {
    loading.value = true;
    error.value = '';

    try {
        const response = await PermissionService.permission(permissionKey.value);
        permission.value = response?.data?.result?.permission ?? response?.data?.data?.permission ?? null;

        if (!permission.value) {
            error.value = 'Permission not found.';
        }
    } catch (requestError: any) {
        error.value = requestError?.response?.data?.message ?? 'We could not load this permission.';
    } finally {
        loading.value = false;
    }
}

function initials(name?: string | null): string {
    return (name ?? '?')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
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
                <h1 class="lk-page-title">{{ permission?.name ?? 'Permission details' }}</h1>
                <p class="lk-page-subtitle">Roles and users that currently include this capability.</p>
            </div>
            <div class="lk-page-actions">
                <router-link :to="{ name: 'permissions' }" class="lk-btn lk-btn--ghost lk-btn--sm">
                    Back to permissions
                </router-link>
                <router-link
                    v-if="permission"
                    :to="{ name: 'edit-permission', params: { id: permission.uuid || permission.id } }"
                    class="lk-btn lk-btn--primary lk-btn--sm"
                >
                    Edit permission
                </router-link>
            </div>
        </header>

        <div v-if="loading" class="lk-kpi-grid lk-kpi-grid--three" aria-busy="true">
            <div v-for="index in 3" :key="index" class="lk-kpi">
                <span class="lk-skeleton" style="display: block; width: 50%; height: 12px"></span>
                <span class="lk-skeleton" style="display: block; width: 40%; height: 26px; margin-top: 14px"></span>
            </div>
        </div>

        <div v-else-if="error" class="lk-card">
            <div class="lk-state lk-state--error">
                <p class="lk-state__title">Permission unavailable</p>
                <p class="lk-state__text">{{ error }}</p>
                <button type="button" class="lk-btn lk-btn--secondary lk-btn--sm" style="margin-top: 8px" @click="load">
                    Try again
                </button>
            </div>
        </div>

        <template v-else-if="permission">
            <section class="lk-kpi-grid lk-kpi-grid--three" aria-label="Permission summary">
                <article class="lk-kpi">
                    <div class="lk-kpi__top"><span class="lk-kpi__label">Roles</span></div>
                    <p class="lk-kpi__value">{{ roles.length }}</p>
                    <div class="lk-kpi__footer"><span class="lk-badge lk-badge--info">Include this capability</span></div>
                </article>
                <article class="lk-kpi">
                    <div class="lk-kpi__top"><span class="lk-kpi__label">Direct users</span></div>
                    <p class="lk-kpi__value">{{ users.length }}</p>
                    <div class="lk-kpi__footer"><span class="lk-badge lk-badge--success">Granted individually</span></div>
                </article>
                <article class="lk-kpi">
                    <div class="lk-kpi__top"><span class="lk-kpi__label">Guard</span></div>
                    <p class="lk-kpi__value permission-guard">{{ permission.guard_name }}</p>
                    <div class="lk-kpi__footer">
                        <span class="lk-badge lk-badge--neutral">Created {{ formatDate(permission.created_at) }}</span>
                    </div>
                </article>
            </section>

            <section class="lk-card permission-section">
                <div class="lk-card__head">
                    <div>
                        <h2 class="lk-card__title">Roles</h2>
                        <p class="lk-card__meta">Roles that grant this permission</p>
                    </div>
                    <span class="lk-badge lk-badge--neutral">{{ roles.length }} total</span>
                </div>
                <div class="lk-card__body">
                    <div v-if="roles.length" class="permission-chip-row">
                        <router-link
                            v-for="role in roles"
                            :key="role.id"
                            :to="{ name: 'show-role', params: { id: role.id } }"
                            class="lk-badge lk-badge--info permission-chip"
                        >
                            {{ role.name }}
                        </router-link>
                    </div>
                    <p v-else class="permission-empty">No role currently includes this permission.</p>
                </div>
            </section>

            <section class="lk-card permission-section">
                <div class="lk-card__head">
                    <div>
                        <h2 class="lk-card__title">Direct users</h2>
                        <p class="lk-card__meta">Users granted this permission outside of a role</p>
                    </div>
                    <span class="lk-badge lk-badge--neutral">{{ users.length }} total</span>
                </div>

                <div v-if="!users.length" class="lk-state">
                    <p class="lk-state__title">No direct users</p>
                    <p class="lk-state__text">Every user receives this capability through their roles.</p>
                </div>

                <div v-else class="lk-card__body lk-card__body--flush">
                    <div class="lk-table-wrap">
                        <table class="lk-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="user in users" :key="user.id">
                                    <td>
                                        <div class="permission-member">
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
                                            <span class="permission-member__name">{{ user.name }}</span>
                                        </div>
                                    </td>
                                    <td class="permission-muted">{{ user.email || '—' }}</td>
                                    <td>
                                        <router-link
                                            :to="{ name: 'show-user', params: { uuid: user.uuid || user.id } }"
                                            class="lk-btn lk-btn--ghost lk-btn--sm"
                                        >
                                            View profile
                                        </router-link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </template>
    </div>
</template>

<style scoped>
.permission-section {
    margin-top: 16px;
}

.permission-guard {
    font-size: 20px;
    text-transform: capitalize;
}

.permission-chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.permission-chip {
    text-decoration: none;
}

.permission-chip:hover {
    opacity: 0.85;
}

.permission-empty {
    margin: 0;
    font-size: 12.5px;
    color: var(--lk-text-muted);
}

.permission-member {
    display: flex;
    align-items: center;
    gap: 10px;
}

.permission-member__name {
    font-weight: 600;
    color: var(--lk-text);
}

.permission-muted {
    color: var(--lk-text-muted);
}
</style>
