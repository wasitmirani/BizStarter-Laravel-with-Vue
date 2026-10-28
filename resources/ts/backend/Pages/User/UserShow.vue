<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import UserService from '../../Services/User/UserService';
import PageHeader from '../Admissions/Components/PageHeader.vue';
import { useGlobal } from '../../../shared/composables/useGlobal';

const route = useRoute();
const { hasPermission } = useGlobal();

const user = ref<any>(null);
const loading = ref(true);
const error = ref('');

const load = async () => {
    loading.value = true;
    error.value = '';

    try {
        const response = await UserService.user(String(route.params.uuid));
        const result = response.data.result?.user ?? null;

        if (!result) {
            error.value = 'This user could not be found. They may have been deleted.';
            return;
        }

        user.value = result;
    } catch (exception: any) {
        error.value = exception?.response?.data?.message ?? 'Unable to load this user.';
    } finally {
        loading.value = false;
    }
};

const initials = computed(() => {
    const source = user.value?.name || user.value?.email || '?';
    return source
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part: string) => part.charAt(0).toUpperCase())
        .join('');
});

const roleNames = computed(() => (user.value?.roles ?? []).map((role: any) => role.name));

const fullName = computed(() => {
    if (!user.value) return '';
    return user.value.name || [user.value.first_name, user.value.last_name].filter(Boolean).join(' ') || 'User';
});

const location = computed(() => [user.value?.city, user.value?.state, user.value?.zip_code].filter(Boolean).join(', ') || '—');

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

onMounted(load);
</script>

<template>
    <div>
        <PageHeader :title="user ? fullName : 'User details'" subtitle="Account overview and contact information.">
            <template #actions>
                <router-link :to="{ name: 'users' }" class="btn btn-sm btn-light">
                    <AppIcon name="arrow-left" class="me-1" />Back to users
                </router-link>
                <router-link
                    v-if="user && hasPermission('edit-user')"
                    :to="{ name: 'edit-user', params: { uuid: user.uuid } }"
                    class="btn btn-sm btn-primary"
                >
                    <AppIcon name="edit" class="me-1" />Edit user
                </router-link>
            </template>
        </PageHeader>

        <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

        <div v-if="loading" class="card">
            <div class="card-body text-center py-10">
                <span class="spinner-border text-primary" role="status"></span>
                <p class="text-muted fs-15 mt-3 mb-0">Loading user…</p>
            </div>
        </div>

        <div v-else-if="user" class="row g-4">
            <div class="col-lg-4">
                <div class="card">
                    <div class="card-body text-center">
                        <img :src="user.thumbnail" :alt="fullName" class="rounded-circle object-fit-cover mb-3" style="width: 88px; height: 88px" />
                        <h5 class="mb-1">{{ fullName }}</h5>
                        <p class="text-muted fs-14 mb-3">{{ user.email }}</p>

                        <div class="d-flex flex-wrap justify-content-center gap-1 mb-3">
                            <span v-for="role in roleNames" :key="role" class="chip">
                                <AppIcon name="shield" :size="12" />{{ role }}
                            </span>
                            <span v-if="!roleNames.length" class="chip">No role</span>
                        </div>

                        <span class="badge border" :class="user.is_active ? 'bg-success-subtle text-success border-success-subtle' : 'bg-secondary-subtle text-secondary border-secondary-subtle'">
                            <AppIcon :name="user.is_active ? 'circle-check' : 'circle-x'" :size="12" class="me-1" />
                            {{ user.is_active ? 'Active account' : 'Inactive account' }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="col-lg-8">
                <div class="card mb-4">
                    <div class="card-header"><h5 class="card-title mb-0">Contact & identity</h5></div>
                    <div class="card-body">
                        <div class="row g-4">
                            <div class="col-sm-6">
                                <p class="text-muted fs-14 mb-1">Email</p>
                                <p class="mb-1">{{ user.email }}</p>
                                <span class="chip" :class="user.email_verified_at ? 'chip-success' : 'chip-warning'">
                                    <AppIcon :name="user.email_verified_at ? 'circle-check' : 'alert-triangle'" :size="12" />
                                    {{ user.email_verified_at ? 'Verified' : 'Unverified' }}
                                </span>
                            </div>
                            <div class="col-sm-6">
                                <p class="text-muted fs-14 mb-1">Phone</p>
                                <p class="mb-0">{{ user.phone || '—' }}</p>
                            </div>
                            <div class="col-sm-6">
                                <p class="text-muted fs-14 mb-1">Username</p>
                                <p class="mb-0">{{ user.user_name || '—' }}</p>
                            </div>
                            <div class="col-sm-6">
                                <p class="text-muted fs-14 mb-1">Location</p>
                                <p class="mb-0">{{ location }}</p>
                            </div>
                            <div class="col-sm-6">
                                <p class="text-muted fs-14 mb-1">Date of birth</p>
                                <p class="mb-0">{{ user.dob ? formatDate(user.dob) : '—' }}</p>
                            </div>
                            <div class="col-sm-6">
                                <p class="text-muted fs-14 mb-1">Gender</p>
                                <p class="mb-0 text-capitalize">{{ user.gender || '—' }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header"><h5 class="card-title mb-0">Access & activity</h5></div>
                    <div class="card-body">
                        <div class="row g-4">
                            <div class="col-sm-6">
                                <p class="text-muted fs-14 mb-1">Roles</p>
                                <div class="d-flex flex-wrap gap-1">
                                    <span v-for="role in roleNames" :key="role" class="chip">{{ role }}</span>
                                    <span v-if="!roleNames.length" class="text-muted">—</span>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <p class="text-muted fs-14 mb-1">Last sign-in</p>
                                <p class="mb-0">{{ user.last_login ? formatDate(user.last_login, true) : 'Never' }}</p>
                            </div>
                            <div class="col-sm-6">
                                <p class="text-muted fs-14 mb-1">Joined</p>
                                <p class="mb-0">{{ formatDate(user.created_at, true) }}</p>
                            </div>
                            <div class="col-sm-6">
                                <p class="text-muted fs-14 mb-1">Last updated</p>
                                <p class="mb-0">{{ formatDate(user.updated_at, true) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
