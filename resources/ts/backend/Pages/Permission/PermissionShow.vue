<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import PermissionService from '../../Services/Permission/PermissionService';
import PageHeader from '../Admissions/Components/PageHeader.vue';
import MetricCard from '../Admissions/Components/MetricCard.vue';
import EmptyState from '../Admissions/Components/EmptyState.vue';
import { useGlobal } from '../../../shared/composables/useGlobal';

const route = useRoute();
const { hasPermission } = useGlobal();

const permission = ref<any>(null);
const loading = ref(true);
const error = ref('');

const load = async () => {
    loading.value = true;
    error.value = '';

    try {
        const response = await PermissionService.permission(String(route.params.id));
        const result = response.data.result?.permission ?? null;

        if (!result) {
            error.value = 'This permission could not be found. It may have been deleted.';
            return;
        }

        permission.value = result;
    } catch (exception: any) {
        error.value = exception?.response?.data?.message ?? 'Unable to load this permission.';
    } finally {
        loading.value = false;
    }
};

const formatDate = (value?: string | null) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
};

const friendlyName = (name?: string) =>
    (name ?? '')
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

onMounted(load);
</script>

<template>
    <div>
        <PageHeader
            :title="permission?.name ? friendlyName(permission.name) : 'Permission details'"
            subtitle="Every role that currently grants this capability."
        >
            <template #actions>
                <router-link :to="{ name: 'permissions' }" class="btn btn-sm btn-light">
                    <AppIcon name="arrow-left" class="me-1" />Back to permissions
                </router-link>
                <router-link
                    v-if="permission && hasPermission('edit-permission')"
                    :to="{ name: 'edit-permission', params: { id: permission.uuid } }"
                    class="btn btn-sm btn-primary"
                >
                    <AppIcon name="edit" class="me-1" />Edit permission
                </router-link>
            </template>
        </PageHeader>

        <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

        <div v-if="loading" class="card">
            <div class="card-body text-center py-10">
                <span class="spinner-border text-primary" role="status"></span>
                <p class="text-muted fs-15 mt-3 mb-0">Loading permission…</p>
            </div>
        </div>

        <template v-else-if="permission">
            <div class="row g-4 mb-4">
                <div class="col-sm-6 col-xl-3">
                    <MetricCard label="Roles" :value="permission.roles_count ?? permission.roles?.length ?? 0" hint="Roles granting access" icon="shield" tone="primary" />
                </div>
                <div class="col-sm-6 col-xl-3">
                    <MetricCard label="Users" :value="permission.users_count ?? 0" hint="Users affected indirectly" icon="users" tone="info" />
                </div>
                <div class="col-sm-6 col-xl-3">
                    <MetricCard label="Permission type" :value="permission.scope === 'system' ? 'Built-in' : 'Custom'" hint="Deletion policy" icon="key" tone="warning" />
                </div>
                <div class="col-sm-6 col-xl-3">
                    <MetricCard label="Created" :value="formatDate(permission.created_at)" :hint="`Guard: ${permission.guard_name}`" icon="calendar" tone="success" />
                </div>
            </div>

            <div class="row g-4">
                <div class="col-xl-7">
                    <div class="card h-100">
                        <div class="card-header d-flex align-items-center justify-content-between">
                            <h5 class="card-title mb-0">Granted to roles</h5>
                            <span class="chip"><AppIcon name="shield" :size="12" />{{ permission.roles_count ?? permission.roles?.length ?? 0 }}</span>
                        </div>
                        <div class="card-body">
                            <EmptyState v-if="!permission.roles?.length" icon="shield" title="No roles grant this" message="Assign it to a role to make it active." />

                            <div v-else class="d-flex flex-column gap-3">
                                <router-link
                                    v-for="role in permission.roles"
                                    :key="role.id"
                                    :to="{ name: 'show-role', params: { id: role.uuid } }"
                                    class="d-flex align-items-center gap-3 text-body text-decoration-none border-bottom pb-3"
                                >
                                    <span class="avatar rounded bg-primary-subtle text-primary flex-shrink-0" style="width: 34px; height: 34px">
                                        <AppIcon name="shield-check" :size="16" />
                                    </span>
                                    <span class="min-w-0">
                                        <span class="d-block fw-medium text-truncate">{{ role.name }}</span>
                                        <span class="d-block text-muted fs-14">{{ role.scope === 'system' ? 'Built-in role' : 'Custom role' }}</span>
                                    </span>
                                    <AppIcon name="chevron-right" :size="15" class="ms-auto text-muted" />
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xl-5">
                    <div class="card h-100">
                        <div class="card-header"><h5 class="card-title mb-0">Permission details</h5></div>
                        <div class="card-body">
                            <dl class="fact-list">
                                <dt>Display name</dt>
                                <dd>{{ friendlyName(permission.name) }}</dd>
                                <dt>Key</dt>
                                <dd><code>{{ permission.name }}</code></dd>
                                <dt>Slug</dt>
                                <dd>{{ permission.slug ?? '—' }}</dd>
                                <dt>Guard</dt>
                                <dd>{{ permission.guard_name }}</dd>
                                <dt>Type</dt>
                                <dd>{{ permission.scope === 'system' ? 'Built-in system permission' : 'Custom workspace permission' }}</dd>
                                <dt>Created</dt>
                                <dd>{{ formatDate(permission.created_at) }}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
