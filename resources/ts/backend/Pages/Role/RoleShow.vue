<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import RoleService from '../../Services/Role/RoleService';

type RoleUser = {
    id: number;
    uuid?: string | null;
    name: string;
    email?: string | null;
    thumbnail?: string | null;
};

type RolePermission = {
    id: number;
    name: string;
};

type RoleDetail = {
    id: number;
    uuid: string | null;
    name: string;
    guard_name: string;
    slug?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    users?: RoleUser[];
    permissions?: RolePermission[];
};

const route = useRoute();

const loading = ref(true);
const error = ref('');
const role = ref<RoleDetail | null>(null);
const brokenAvatars = ref<Record<number, boolean>>({});

const roleKey = computed(() => (route.params.id ? String(route.params.id) : ''));
const permissions = computed(() => role.value?.permissions ?? []);
const users = computed(() => role.value?.users ?? []);

async function load() {
    loading.value = true;
    error.value = '';

    try {
        const response = await RoleService.role(roleKey.value);
        role.value = response?.data?.result?.role ?? response?.data?.data?.role ?? null;

        if (!role.value) {
            error.value = 'Role not found.';
        }
    } catch (requestError: any) {
        error.value = requestError?.response?.data?.message ?? 'We could not load this role.';
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
                <h1 class="lk-page-title">{{ role?.name ?? 'Role details' }}</h1>
                <p class="lk-page-subtitle">Permissions granted by this role and the people who currently hold it.</p>
            </div>
            <div class="lk-page-actions">
                <router-link :to="{ name: 'roles' }" class="lk-btn lk-btn--ghost lk-btn--sm">Back to roles</router-link>
                <router-link
                    v-if="role"
                    :to="{ name: 'edit-role', params: { id: role.uuid || role.id } }"
                    class="lk-btn lk-btn--primary lk-btn--sm"
                >
                    Edit role
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
                <p class="lk-state__title">Role unavailable</p>
                <p class="lk-state__text">{{ error }}</p>
                <button type="button" class="lk-btn lk-btn--secondary lk-btn--sm" style="margin-top: 8px" @click="load">
                    Try again
                </button>
            </div>
        </div>

        <template v-else-if="role">
            <section class="lk-kpi-grid lk-kpi-grid--three" aria-label="Role summary">
                <article class="lk-kpi">
                    <div class="lk-kpi__top"><span class="lk-kpi__label">Permissions</span></div>
                    <p class="lk-kpi__value">{{ permissions.length }}</p>
                    <div class="lk-kpi__footer"><span class="lk-badge lk-badge--info">Granted by this role</span></div>
                </article>
                <article class="lk-kpi">
                    <div class="lk-kpi__top"><span class="lk-kpi__label">Members</span></div>
                    <p class="lk-kpi__value">{{ users.length }}</p>
                    <div class="lk-kpi__footer"><span class="lk-badge lk-badge--success">Assigned users</span></div>
                </article>
                <article class="lk-kpi">
                    <div class="lk-kpi__top"><span class="lk-kpi__label">Guard</span></div>
                    <p class="lk-kpi__value role-guard">{{ role.guard_name }}</p>
                    <div class="lk-kpi__footer">
                        <span class="lk-badge lk-badge--neutral">Created {{ formatDate(role.created_at) }}</span>
                    </div>
                </article>
            </section>

            <section class="lk-card role-section">
                <div class="lk-card__head">
                    <div>
                        <h2 class="lk-card__title">Permissions</h2>
                        <p class="lk-card__meta">Everything this role is allowed to do</p>
                    </div>
                    <span class="lk-badge lk-badge--neutral">{{ permissions.length }} total</span>
                </div>
                <div class="lk-card__body">
                    <div v-if="permissions.length" class="role-chip-row">
                        <span v-for="permission in permissions" :key="permission.id" class="lk-badge lk-badge--info">
                            {{ permission.name }}
                        </span>
                    </div>
                    <p v-else class="role-empty">This role does not grant any permissions yet.</p>
                </div>
            </section>

            <section class="lk-card role-section">
                <div class="lk-card__head">
                    <div>
                        <h2 class="lk-card__title">Members</h2>
                        <p class="lk-card__meta">Users who currently hold this role</p>
                    </div>
                    <span class="lk-badge lk-badge--neutral">{{ users.length }} total</span>
                </div>

                <div v-if="!users.length" class="lk-state">
                    <p class="lk-state__title">No members yet</p>
                    <p class="lk-state__text">Assign this role to a user from the edit screen.</p>
                </div>

                <div v-else class="lk-card__body lk-card__body--flush">
                    <div class="lk-table-wrap">
                        <table class="lk-table">
                            <thead>
                                <tr>
                                    <th>Member</th>
                                    <th>Email</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="user in users" :key="user.id">
                                    <td>
                                        <div class="role-member">
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
                                            <span class="role-member__name">{{ user.name }}</span>
                                        </div>
                                    </td>
                                    <td class="role-muted">{{ user.email || '—' }}</td>
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
.role-section {
    margin-top: 16px;
}

.role-guard {
    font-size: 20px;
    text-transform: capitalize;
}

.role-chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.role-empty {
    margin: 0;
    font-size: 12.5px;
    color: var(--lk-text-muted);
}

.role-member {
    display: flex;
    align-items: center;
    gap: 10px;
}

.role-member__name {
    font-weight: 600;
    color: var(--lk-text);
}

.role-muted {
    color: var(--lk-text-muted);
}
</style>
