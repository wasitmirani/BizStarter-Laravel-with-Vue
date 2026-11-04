<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PermissionService from '../../Services/Permission/PermissionService';
import DropDownService from '../../Services/DropDown/DropDownService';
import AccessChecklist from '../../Components/AccessChecklist.vue';

type ChecklistItem = { id: number; name: string; hint?: string | null };

const route = useRoute();
const router = useRouter();
const toast = inject<Ref<any>>('toast', ref(null));

const permissionKey = computed(() => (route.params.id ? String(route.params.id) : ''));
const isEditMode = computed(() => Boolean(permissionKey.value));

const loading = ref(isEditMode.value);
const saving = ref(false);
const loadError = ref('');
const errors = ref<Record<string, string[]>>({});

const roles = ref<ChecklistItem[]>([]);
const users = ref<ChecklistItem[]>([]);

const form = reactive({
    id: null as number | null,
    name: '',
    roles: [] as number[],
    users: [] as number[],
});

function fieldError(field: string): string {
    return errors.value?.[field]?.[0] ?? '';
}

async function loadOptions() {
    const [roleResponse, userResponse] = await Promise.allSettled([
        DropDownService.getRoles({ sort_by: 'name', sort_dir: 'asc' }),
        DropDownService.getUsers({ sort_by: 'name', sort_dir: 'asc' }),
    ]);

    if (roleResponse.status === 'fulfilled') {
        const payload = roleResponse.value?.data?.roles ?? roleResponse.value?.data?.result?.roles ?? [];
        roles.value = payload.map((item: any) => ({ id: item.id, name: item.name }));
    }

    if (userResponse.status === 'fulfilled') {
        const payload = userResponse.value?.data?.result?.users ?? userResponse.value?.data?.users ?? [];
        users.value = payload.map((item: any) => ({
            id: item.id,
            name: item.name,
            hint: item.email ?? item.roles?.[0]?.name ?? null,
        }));
    }
}

async function loadPermission() {
    if (!isEditMode.value) return;

    loading.value = true;
    loadError.value = '';

    try {
        const response = await PermissionService.permission(permissionKey.value);
        const permission = response?.data?.result?.permission ?? response?.data?.data?.permission;

        if (!permission) {
            loadError.value = 'Permission not found.';
            return;
        }

        form.id = permission.id ?? null;
        form.name = permission.name ?? '';
        form.roles = (permission.roles ?? []).map((role: any) => role.id);
        form.users = (permission.users ?? []).map((user: any) => user.id);
    } catch (requestError: any) {
        loadError.value = requestError?.response?.data?.message ?? 'We could not load this permission.';
    } finally {
        loading.value = false;
    }
}

async function save() {
    errors.value = {};

    if (!form.name.trim()) {
        errors.value = { name: ['Enter a permission name.'] };
        return;
    }

    saving.value = true;

    const payload = {
        name: form.name.trim(),
        roles: form.roles,
        users: form.users,
    };

    try {
        if (isEditMode.value && form.id) {
            await PermissionService.update({ ...payload, id: form.id });
            toast.value?.showToast(200, 'Permission updated', { message: `"${payload.name}" has been saved.` });
        } else {
            await PermissionService.store(payload);
            toast.value?.showToast(201, 'Permission created', { message: `"${payload.name}" is ready to use.` });
        }

        router.push({ name: 'permissions' });
    } catch (requestError: any) {
        errors.value = requestError?.response?.data?.errors ?? {};
        toast.value?.showToast(
            requestError?.response?.status ?? 500,
            'Could not save permission',
            requestError?.response?.data,
        );
    } finally {
        saving.value = false;
    }
}

onMounted(async () => {
    await Promise.all([loadOptions(), loadPermission()]);
});
</script>

<template>
    <div>
        <header class="lk-page-head">
            <div>
                <h1 class="lk-page-title">{{ isEditMode ? 'Edit permission' : 'Create permission' }}</h1>
                <p class="lk-page-subtitle">
                    {{
                        isEditMode
                            ? 'Rename the capability and manage the roles and users it is attached to.'
                            : 'Define a capability, then decide which roles and users receive it.'
                    }}
                </p>
            </div>
            <div class="lk-page-actions">
                <router-link :to="{ name: 'permissions' }" class="lk-btn lk-btn--ghost lk-btn--sm">
                    Back to permissions
                </router-link>
            </div>
        </header>

        <div v-if="loading" class="lk-card">
            <div class="lk-card__body" aria-busy="true">
                <span class="lk-skeleton" style="display: block; height: 12px; width: 40%"></span>
                <span class="lk-skeleton" style="display: block; height: 12px; width: 65%; margin-top: 12px"></span>
            </div>
        </div>

        <div v-else-if="loadError" class="lk-card">
            <div class="lk-state lk-state--error">
                <p class="lk-state__title">Permission unavailable</p>
                <p class="lk-state__text">{{ loadError }}</p>
                <router-link :to="{ name: 'permissions' }" class="lk-btn lk-btn--secondary lk-btn--sm" style="margin-top: 8px">
                    Back to permissions
                </router-link>
            </div>
        </div>

        <form v-else class="lk-card" novalidate @submit.prevent="save">
            <div class="lk-card__body">
                <label class="lk-field">
                    <span class="lk-label">Permission name</span>
                    <input
                        v-model="form.name"
                        class="lk-input"
                        placeholder="e.g. refund-orders"
                        maxlength="255"
                        autocomplete="off"
                        required
                    />
                    <span v-if="fieldError('name')" class="lk-form-error">{{ fieldError('name') }}</span>
                    <span v-else class="lk-hint">
                        Use a lowercase, hyphenated capability name. Names must be unique for the web guard.
                    </span>
                </label>

                <div class="permission-form-sections">
                    <AccessChecklist
                        v-model="form.roles"
                        :items="roles"
                        title="Roles"
                        description="Roles that receive this capability."
                        search-placeholder="Search roles…"
                        empty-text="No roles are available yet."
                    />

                    <AccessChecklist
                        v-model="form.users"
                        :items="users"
                        title="Direct users"
                        description="Users granted this capability outside of a role."
                        search-placeholder="Search people…"
                        empty-text="No users are available yet."
                    />
                </div>
            </div>

            <div class="lk-card__body permission-form-actions">
                <router-link :to="{ name: 'permissions' }" class="lk-btn lk-btn--ghost">Cancel</router-link>
                <button type="submit" class="lk-btn lk-btn--primary" :disabled="saving">
                    {{ saving ? 'Saving…' : isEditMode ? 'Save changes' : 'Create permission' }}
                </button>
            </div>
        </form>
    </div>
</template>

<style scoped>
.permission-form-sections {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
    margin-top: 16px;
}

.permission-form-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
    border-top: 1px solid var(--lk-border);
    flex-wrap: wrap;
}
</style>
