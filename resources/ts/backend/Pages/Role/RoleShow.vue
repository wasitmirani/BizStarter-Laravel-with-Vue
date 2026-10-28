<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import RoleService from '../../Services/Role/RoleService';
import PageHeader from '../Admissions/Components/PageHeader.vue';
import MetricCard from '../Admissions/Components/MetricCard.vue';
import EmptyState from '../Admissions/Components/EmptyState.vue';
import { useGlobal } from '../../../shared/composables/useGlobal';

const route = useRoute();
const { hasPermission } = useGlobal();

const role = ref<any>(null);
const loading = ref(true);
const error = ref('');

const load = async () => {
    loading.value = true;
    error.value = '';

    try {
        const response = await RoleService.role(String(route.params.id));
        const result = response.data.result?.role ?? null;

        if (!result) {
            error.value = 'This role could not be found. It may have been deleted.';
            return;
        }

        role.value = result;
    } catch (exception: any) {
        error.value = exception?.response?.data?.message ?? 'Unable to load this role.';
    } finally {
        loading.value = false;
    }
};

const permissionGroups = computed(() => {
    const groups: Record<string, any[]> = {};

    for (const permission of role.value?.permissions ?? []) {
        const prefix = String(permission.name).split('-')[0] || 'general';
        groups[prefix] = groups[prefix] ?? [];
        groups[prefix].push(permission);
    }

    return Object.entries(groups)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([prefix, permissions]) => ({ prefix, permissions: permissions.sort((a, b) => a.name.localeCompare(b.name)) }));
});

const formatDate = (value?: string | null) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
};

const friendlyPermission = (name: string) =>
    name
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

onMounted(load);
</script>

<template>
    <div>
        <PageHeader :title="role?.name ? `${role.name} role` : 'Role details'" subtitle="Review the users and permissions attached to this role.">
            <template #actions>
                <router-link :to="{ name: 'roles' }" class="btn btn-sm btn-light">
                    <AppIcon name="arrow-left" class="me-1" />Back to roles
                </router-link>
                <router-link
                    v-if="role && hasPermission('edit-role')"
                    :to="{ name: 'edit-role', params: { id: role.uuid } }"
                    class="btn btn-sm btn-primary"
                >
                    <AppIcon name="edit" class="me-1" />Edit role
                </router-link>
            </template>
        </PageHeader>

        <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

        <div v-if="loading" class="card">
            <div class="card-body text-center py-10">
                <span class="spinner-border text-primary" role="status"></span>
                <p class="text-muted fs-15 mt-3 mb-0">Loading role…</p>
            </div>
        </div>

        <template v-else-if="role">
            <div class="row g-4 mb-4">
                <div class="col-sm-6 col-xl-3">
                    <MetricCard label="Users" :value="role.users_count ?? role.users?.length ?? 0" hint="Assigned to this role" icon="users" tone="primary" />
                </div>
                <div class="col-sm-6 col-xl-3">
                    <MetricCard label="Permissions" :value="role.permissions_count ?? role.permissions?.length ?? 0" hint="Granted capabilities" icon="key" tone="success" />
                </div>
                <div class="col-sm-6 col-xl-3">
                    <MetricCard label="Role type" :value="role.scope === 'system' ? 'Built-in' : 'Custom'" hint="Deletion policy" icon="shield" tone="warning" />
                </div>
                <div class="col-sm-6 col-xl-3">
                    <MetricCard label="Created" :value="formatDate(role.created_at)" :hint="`Guard: ${role.guard_name}`" icon="calendar" tone="info" />
                </div>
            </div>

            <div class="row g-4">
                <div class="col-xl-8">
                    <div class="card h-100">
                        <div class="card-header d-flex align-items-center justify-content-between">
                            <h5 class="card-title mb-0">Permissions</h5>
                            <span class="chip"><AppIcon name="key" :size="12" />{{ role.permissions_count ?? role.permissions?.length ?? 0 }}</span>
                        </div>
                        <div class="card-body">
                            <EmptyState v-if="!permissionGroups.length" icon="key" title="No permissions assigned" message="Edit the role to grant capabilities." />

                            <div v-else class="d-flex flex-column gap-4">
                                <div v-for="group in permissionGroups" :key="group.prefix">
                                    <p class="text-muted fs-13 fw-semibold text-uppercase mb-2">{{ group.prefix }}</p>
                                    <div class="d-flex flex-wrap gap-2">
                                        <span v-for="permission in group.permissions" :key="permission.id" class="chip">
                                            <AppIcon name="check" :size="12" />{{ friendlyPermission(permission.name) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xl-4">
                    <div class="card mb-4">
                        <div class="card-header"><h5 class="card-title mb-0">Role details</h5></div>
                        <div class="card-body">
                            <dl class="fact-list">
                                <dt>Name</dt>
                                <dd>{{ role.name }}</dd>
                                <dt>Slug</dt>
                                <dd>{{ role.slug ?? '—' }}</dd>
                                <dt>Guard</dt>
                                <dd>{{ role.guard_name }}</dd>
                                <dt>Type</dt>
                                <dd>{{ role.scope === 'system' ? 'Built-in system role' : 'Custom workspace role' }}</dd>
                                <dt>Created</dt>
                                <dd>{{ formatDate(role.created_at) }}</dd>
                                <dt>Last updated</dt>
                                <dd>{{ formatDate(role.updated_at) }}</dd>
                            </dl>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header d-flex align-items-center justify-content-between">
                            <h5 class="card-title mb-0">Users</h5>
                            <span class="chip"><AppIcon name="users" :size="12" />{{ role.users_count ?? role.users?.length ?? 0 }}</span>
                        </div>
                        <div class="card-body">
                            <EmptyState v-if="!role.users?.length" icon="users" title="No users yet" message="Assign this role from the user editor." />

                            <div v-else class="d-flex flex-column gap-3">
                                <router-link
                                    v-for="user in role.users"
                                    :key="user.id"
                                    :to="{ name: 'show-user', params: { uuid: user.uuid } }"
                                    class="d-flex align-items-center gap-3 text-body text-decoration-none"
                                >
                                    <span class="avatar rounded-circle bg-primary-subtle text-primary fw-semibold flex-shrink-0" style="width: 34px; height: 34px">
                                        {{ user.name?.charAt(0)?.toUpperCase() ?? '?' }}
                                    </span>
                                    <span class="min-w-0">
                                        <span class="d-block fw-medium text-truncate">{{ user.name }}</span>
                                        <span class="d-block text-muted fs-14 text-truncate">{{ user.email ?? '—' }}</span>
                                    </span>
                                    <AppIcon name="chevron-right" :size="15" class="ms-auto text-muted" />
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
