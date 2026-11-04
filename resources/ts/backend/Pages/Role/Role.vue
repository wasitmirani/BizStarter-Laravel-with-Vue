<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RoleService from '../../Services/Role/RoleService';
import DropDownService from '../../Services/DropDown/DropDownService';
import AccessChecklist from '../../Components/AccessChecklist.vue';

type ChecklistItem = { id: number; name: string; hint?: string | null };

const route = useRoute();
const router = useRouter();
const toast = inject<Ref<any>>('toast', ref(null));

const roleKey = computed(() => (route.params.id ? String(route.params.id) : ''));
const isEditMode = computed(() => Boolean(roleKey.value));

const loading = ref(isEditMode.value);
const saving = ref(false);
const loadError = ref('');
const errors = ref<Record<string, string[]>>({});

const permissions = ref<ChecklistItem[]>([]);
const users = ref<ChecklistItem[]>([]);

const form = reactive({
    id: null as number | null,
    name: '',
    permissions: [] as number[],
    users: [] as number[],
});

function fieldError(field: string): string {
    return errors.value?.[field]?.[0] ?? '';
}

function extractErrors(requestError: any): void {
    errors.value = requestError?.response?.data?.errors ?? {};
}

async function loadOptions() {
    const [permissionResponse, userResponse] = await Promise.allSettled([
        DropDownService.getPermissions({ sort_by: 'name', sort_dir: 'asc' }),
        DropDownService.getUsers({ sort_by: 'name', sort_dir: 'asc' }),
    ]);

    if (permissionResponse.status === 'fulfilled') {
        const payload =
            permissionResponse.value?.data?.result?.permissions ?? permissionResponse.value?.data?.permissions ?? [];
        permissions.value = payload.map((item: any) => ({ id: item.id, name: item.name }));
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

async function loadRole() {
    if (!isEditMode.value) return;

    loading.value = true;
    loadError.value = '';

    try {
        const response = await RoleService.role(roleKey.value);
        const role = response?.data?.result?.role ?? response?.data?.data?.role;

        if (!role) {
            loadError.value = 'Role not found.';
            return;
        }

        form.id = role.id ?? null;
        form.name = role.name ?? '';
        form.permissions = (role.permissions ?? []).map((permission: any) => permission.id);
        form.users = (role.users ?? []).map((user: any) => user.id);
    } catch (requestError: any) {
        loadError.value = requestError?.response?.data?.message ?? 'We could not load this role.';
    } finally {
        loading.value = false;
    }
}

async function save() {
    errors.value = {};

    if (!form.name.trim()) {
        errors.value = { name: ['Enter a role name.'] };
        return;
    }

    saving.value = true;

    const payload = {
        name: form.name.trim(),
        permissions: form.permissions,
        users: form.users,
    };

    try {
        if (isEditMode.value && form.id) {
            await RoleService.update({ ...payload, id: form.id });
            toast.value?.showToast(200, 'Role updated', { message: `"${payload.name}" has been saved.` });
        } else {
            await RoleService.store(payload);
            toast.value?.showToast(201, 'Role created', { message: `"${payload.name}" is ready to use.` });
        }

        router.push({ name: 'roles' });
    } catch (requestError: any) {
        extractErrors(requestError);
        toast.value?.showToast(
            requestError?.response?.status ?? 500,
            'Could not save role',
            requestError?.response?.data,
        );
    } finally {
        saving.value = false;
    }
}

onMounted(async () => {
    await Promise.all([loadOptions(), loadRole()]);
});
</script>

<template>
    <div>
        <header class="lk-page-head">
            <div>
                <h1 class="lk-page-title">{{ isEditMode ? 'Edit role' : 'Create role' }}</h1>
                <p class="lk-page-subtitle">
                    {{
                        isEditMode
                            ? 'Rename the role and adjust the permissions or members it applies to.'
                            : 'Name a role, then choose the permissions it should grant.'
                    }}
                </p>
            </div>
            <div class="lk-page-actions">
                <router-link :to="{ name: 'roles' }" class="lk-btn lk-btn--ghost lk-btn--sm">Back to roles</router-link>
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
                <p class="lk-state__title">Role unavailable</p>
                <p class="lk-state__text">{{ loadError }}</p>
                <router-link :to="{ name: 'roles' }" class="lk-btn lk-btn--secondary lk-btn--sm" style="margin-top: 8px">
                    Back to roles
                </router-link>
            </div>
        </div>

        <form v-else class="lk-card" novalidate @submit.prevent="save">
            <div class="lk-card__body">
                <div class="lk-form-grid">
                    <label class="lk-field lk-field--full">
                        <span class="lk-label">Role name</span>
                        <input
                            v-model="form.name"
                            class="lk-input"
                            placeholder="e.g. Support agent"
                            maxlength="255"
                            autocomplete="off"
                            required
                        />
                        <span v-if="fieldError('name')" class="lk-form-error">{{ fieldError('name') }}</span>
                        <span v-else class="lk-hint">A short, human-friendly name such as "Support agent" or "Billing".</span>
                    </label>
                </div>

                <div class="role-form-sections">
                    <AccessChecklist
                        v-model="form.permissions"
                        :items="permissions"
                        title="Permissions"
                        description="Capabilities granted to every member with this role."
                        search-placeholder="Search permissions…"
                        empty-text="No permissions are available yet."
                    />

                    <AccessChecklist
                        v-model="form.users"
                        :items="users"
                        title="Members"
                        description="Users who should receive this role."
                        search-placeholder="Search people…"
                        empty-text="No users are available yet."
                    />
                </div>
            </div>

            <div class="lk-card__body role-form-actions">
                <router-link :to="{ name: 'roles' }" class="lk-btn lk-btn--ghost">Cancel</router-link>
                <button type="submit" class="lk-btn lk-btn--primary" :disabled="saving">
                    {{ saving ? 'Saving…' : isEditMode ? 'Save changes' : 'Create role' }}
                </button>
            </div>
        </form>
    </div>
</template>

<style scoped>
.role-form-sections {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
    margin-top: 16px;
}

.role-form-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
    border-top: 1px solid var(--lk-border);
    flex-wrap: wrap;
}
</style>
