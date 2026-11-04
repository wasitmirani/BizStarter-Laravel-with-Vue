<script setup lang="ts">
import { computed, inject, onMounted, ref, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import UserService from '../../Services/user/UserService';

type UserRole = { id: number; name: string };

type UserDetail = {
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
    updated_at?: string | null;
    last_login?: string | null;
    roles?: UserRole[];
};

const route = useRoute();
const router = useRouter();
const toast = inject<Ref<any>>('toast', ref(null));

const loading = ref(true);
const error = ref('');
const user = ref<UserDetail | null>(null);
const avatarBroken = ref(false);

const userKey = computed(() => (route.params.uuid ? String(route.params.uuid) : ''));
const roles = computed(() => user.value?.roles ?? []);
const displayName = computed(() => {
    if (!user.value) return 'User details';
    return user.value.name || [user.value.first_name, user.value.last_name].filter(Boolean).join(' ') || 'User details';
});

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
    return new Intl.DateTimeFormat(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
}

function formatDateTime(value?: string | null): string {
    if (!value) return 'Never';
    return new Intl.DateTimeFormat(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
}

async function load() {
    loading.value = true;
    error.value = '';

    try {
        const response = await UserService.user(userKey.value);
        user.value = response?.data?.result?.user ?? response?.data?.data?.user ?? null;

        if (!user.value) {
            error.value = 'User not found.';
        }
    } catch (requestError: any) {
        error.value = requestError?.response?.data?.message ?? 'We could not load this user.';
    } finally {
        loading.value = false;
    }
}

async function remove() {
    if (!user.value) return;

    const confirmed = window.confirm(`Delete ${displayName.value}? This removes their account and cannot be undone.`);
    if (!confirmed) return;

    try {
        await UserService.delete(user.value.uuid || (user.value.id as any));
        toast.value?.showToast(200, 'User deleted', { message: `${displayName.value} no longer has access.` });
        router.push({ name: 'users' });
    } catch (requestError: any) {
        toast.value?.showToast(
            requestError?.response?.status ?? 500,
            'Could not delete user',
            requestError?.response?.data,
        );
    }
}

onMounted(() => void load());
</script>

<template>
    <div>
        <header class="lk-page-head">
            <div>
                <h1 class="lk-page-title">{{ displayName }}</h1>
                <p class="lk-page-subtitle">Profile, contact information and access level for this account.</p>
            </div>
            <div class="lk-page-actions">
                <router-link :to="{ name: 'users' }" class="lk-btn lk-btn--ghost lk-btn--sm">Back to users</router-link>
                <router-link
                    v-if="user"
                    :to="{ name: 'edit-user', params: { uuid: user.uuid || user.id } }"
                    class="lk-btn lk-btn--secondary lk-btn--sm"
                >
                    Edit profile
                </router-link>
                <button v-if="user" type="button" class="lk-btn lk-btn--ghost lk-btn--sm user-danger" @click="remove">
                    Delete
                </button>
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
                <p class="lk-state__title">User unavailable</p>
                <p class="lk-state__text">{{ error }}</p>
                <button type="button" class="lk-btn lk-btn--secondary lk-btn--sm" style="margin-top: 8px" @click="load">
                    Try again
                </button>
            </div>
        </div>

        <template v-else-if="user">
            <section class="lk-kpi-grid lk-kpi-grid--three" aria-label="User summary">
                <article class="lk-kpi">
                    <div class="lk-kpi__top"><span class="lk-kpi__label">Role</span></div>
                    <p class="lk-kpi__value user-kpi-text">{{ roles[0]?.name ?? 'No role' }}</p>
                    <div class="lk-kpi__footer">
                        <span
                            v-for="role in roles"
                            :key="role.id"
                            class="lk-badge lk-badge--info"
                        >
                            {{ role.name }}
                        </span>
                    </div>
                </article>
                <article class="lk-kpi">
                    <div class="lk-kpi__top"><span class="lk-kpi__label">Status</span></div>
                    <p class="lk-kpi__value user-kpi-text">{{ user.is_active === false ? 'Inactive' : 'Active' }}</p>
                    <div class="lk-kpi__footer">
                        <span class="lk-badge" :class="user.is_active === false ? 'lk-badge--neutral' : 'lk-badge--success'">
                            {{ user.is_active === false ? 'Sign-in disabled' : 'Can sign in' }}
                        </span>
                    </div>
                </article>
                <article class="lk-kpi">
                    <div class="lk-kpi__top"><span class="lk-kpi__label">Last login</span></div>
                    <p class="lk-kpi__value user-kpi-text">{{ formatDate(user.last_login) }}</p>
                    <div class="lk-kpi__footer">
                        <span class="lk-badge lk-badge--neutral">Joined {{ formatDate(user.created_at) }}</span>
                    </div>
                </article>
            </section>

            <div class="user-detail-grid">
                <section class="lk-card">
                    <div class="lk-card__head">
                        <div>
                            <h2 class="lk-card__title">Profile</h2>
                            <p class="lk-card__meta">Who this account belongs to</p>
                        </div>
                    </div>
                    <div class="lk-card__body">
                        <div class="user-profile">
                            <img
                                v-if="user.thumbnail && !avatarBroken"
                                :src="user.thumbnail"
                                alt=""
                                class="lk-avatar lk-avatar--lg"
                                @error="avatarBroken = true"
                            />
                            <span v-else class="lk-avatar lk-avatar--lg lk-avatar--initials">
                                {{ initials(displayName) }}
                            </span>
                            <div>
                                <p class="user-profile__name">{{ displayName }}</p>
                                <p class="user-profile__email">{{ user.email }}</p>
                            </div>
                        </div>

                        <dl class="user-facts">
                            <div>
                                <dt>Email</dt>
                                <dd><a :href="`mailto:${user.email}`">{{ user.email }}</a></dd>
                            </div>
                            <div>
                                <dt>Phone</dt>
                                <dd>{{ user.phone || '—' }}</dd>
                            </div>
                            <div>
                                <dt>Roles</dt>
                                <dd>
                                    <span v-for="role in roles" :key="role.id" class="lk-badge lk-badge--info" style="margin-right: 4px">
                                        {{ role.name }}
                                    </span>
                                    <span v-if="!roles.length" class="user-muted">No role assigned</span>
                                </dd>
                            </div>
                            <div>
                                <dt>Status</dt>
                                <dd>{{ user.is_active === false ? 'Inactive' : 'Active' }}</dd>
                            </div>
                        </dl>
                    </div>
                </section>

                <section class="lk-card">
                    <div class="lk-card__head">
                        <div>
                            <h2 class="lk-card__title">Account</h2>
                            <p class="lk-card__meta">Identifiers and timestamps</p>
                        </div>
                    </div>
                    <div class="lk-card__body">
                        <dl class="user-facts">
                            <div>
                                <dt>User ID</dt>
                                <dd>UR00{{ user.id }}</dd>
                            </div>
                            <div>
                                <dt>UUID</dt>
                                <dd class="user-code">{{ user.uuid || '—' }}</dd>
                            </div>
                            <div>
                                <dt>Created</dt>
                                <dd>{{ formatDateTime(user.created_at) }}</dd>
                            </div>
                            <div>
                                <dt>Last updated</dt>
                                <dd>{{ formatDateTime(user.updated_at) }}</dd>
                            </div>
                        </dl>
                    </div>
                </section>
            </div>
        </template>
    </div>
</template>

<style scoped>
.user-kpi-text {
    font-size: 20px;
    text-transform: capitalize;
}

.user-detail-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin-top: 16px;
}

.user-profile {
    display: flex;
    align-items: center;
    gap: 14px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--lk-border);
    margin-bottom: 14px;
}

.user-profile__name {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--lk-text);
}

.user-profile__email {
    margin: 2px 0 0;
    font-size: 12.5px;
    color: var(--lk-text-muted);
}

.user-facts {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 0;
}

.user-facts > div {
    display: grid;
    grid-template-columns: 120px minmax(0, 1fr);
    gap: 10px;
    align-items: start;
}

.user-facts dt {
    font-size: 12px;
    font-weight: 600;
    color: var(--lk-text-muted);
}

.user-facts dd {
    margin: 0;
    font-size: 13px;
    color: var(--lk-text);
    overflow-wrap: anywhere;
}

.user-facts a {
    color: var(--lk-primary);
    text-decoration: none;
}

.user-facts a:hover {
    text-decoration: underline;
}

.user-code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 11.5px !important;
}

.user-muted {
    color: var(--lk-text-muted);
}

.user-danger {
    color: var(--lk-error);
}

@media (max-width: 960px) {
    .user-detail-grid {
        grid-template-columns: minmax(0, 1fr);
    }
}
</style>
