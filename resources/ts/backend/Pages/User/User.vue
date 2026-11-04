<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import UserService from '../../Services/user/UserService';
import DropDownService from '../../Services/DropDown/DropDownService';

type RoleOption = { id: number; name: string };

const route = useRoute();
const router = useRouter();
const toast = inject<Ref<any>>('toast', ref(null));

const userKey = computed(() => (route.params.uuid ? String(route.params.uuid) : ''));
const isEditMode = computed(() => Boolean(userKey.value));

const loading = ref(isEditMode.value);
const saving = ref(false);
const loadError = ref('');
const errors = ref<Record<string, string[]>>({});
const roleOptions = ref<RoleOption[]>([]);

const form = reactive({
    id: null as number | null,
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: '' as string | number,
    password: '',
    password_confirmation: '',
    is_active: true,
});

function fieldError(field: string): string {
    return errors.value?.[field]?.[0] ?? '';
}

function fullName(): string {
    return [form.first_name, form.last_name].filter(Boolean).join(' ').trim();
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

async function loadUser() {
    if (!isEditMode.value) return;

    loading.value = true;
    loadError.value = '';

    try {
        const response = await UserService.user(userKey.value);
        const user = response?.data?.result?.user ?? response?.data?.data?.user;

        if (!user) {
            loadError.value = 'User not found.';
            return;
        }

        const nameParts = String(user.name ?? '').split(' ').filter(Boolean);

        form.id = user.id ?? null;
        form.first_name = user.first_name || nameParts.slice(0, 1).join(' ');
        form.last_name = user.last_name || nameParts.slice(1).join(' ');
        form.email = user.email ?? '';
        form.phone = user.phone ?? '';
        form.role = user.roles?.[0]?.id ?? user.role ?? '';
        form.is_active = user.is_active !== false;
    } catch (requestError: any) {
        loadError.value = requestError?.response?.data?.message ?? 'We could not load this user.';
    } finally {
        loading.value = false;
    }
}

function validate(): boolean {
    errors.value = {};

    if (!form.first_name.trim()) {
        errors.value.first_name = ['Enter a first name.'];
    }

    if (!form.email.trim()) {
        errors.value.email = ['Enter an email address.'];
    }

    if (!form.role) {
        errors.value.role = ['Choose a role.'];
    }

    if (!isEditMode.value && form.password.length < 8) {
        errors.value.password = ['Use at least 8 characters.'];
    }

    if (form.password && form.password !== form.password_confirmation) {
        errors.value.password_confirmation = ['The passwords do not match.'];
    }

    return Object.keys(errors.value).length === 0;
}

async function save() {
    if (!validate()) return;

    saving.value = true;

    const payload: Record<string, unknown> = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        name: fullName(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        role: form.role,
        is_active: form.is_active,
    };

    if (form.password) {
        payload.password = form.password;
        payload.password_confirmation = form.password_confirmation;
    }

    try {
        if (isEditMode.value && form.id) {
            await UserService.update({ ...payload, id: form.id });
            toast.value?.showToast(200, 'User updated', { message: `${fullName()} has been saved.` });
        } else {
            await UserService.store(payload);
            toast.value?.showToast(201, 'User created', { message: `${fullName()} can now sign in.` });
        }

        router.push({ name: 'users' });
    } catch (requestError: any) {
        errors.value = requestError?.response?.data?.errors ?? {};
        toast.value?.showToast(
            requestError?.response?.status ?? 500,
            'Could not save user',
            requestError?.response?.data,
        );
    } finally {
        saving.value = false;
    }
}

onMounted(async () => {
    await Promise.all([loadRoles(), loadUser()]);
});
</script>

<template>
    <div>
        <header class="lk-page-head">
            <div>
                <h1 class="lk-page-title">{{ isEditMode ? 'Edit user' : 'Create user' }}</h1>
                <p class="lk-page-subtitle">
                    {{
                        isEditMode
                            ? 'Update account details, contact information or the role this person holds.'
                            : 'Add a teammate and choose the role that controls their access.'
                    }}
                </p>
            </div>
            <div class="lk-page-actions">
                <router-link :to="{ name: 'users' }" class="lk-btn lk-btn--ghost lk-btn--sm">Back to users</router-link>
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
                <p class="lk-state__title">User unavailable</p>
                <p class="lk-state__text">{{ loadError }}</p>
                <router-link :to="{ name: 'users' }" class="lk-btn lk-btn--secondary lk-btn--sm" style="margin-top: 8px">
                    Back to users
                </router-link>
            </div>
        </div>

        <form v-else class="lk-card" novalidate @submit.prevent="save">
            <div class="lk-card__body">
                <div class="lk-form-grid">
                    <label class="lk-field">
                        <span class="lk-label">First name</span>
                        <input v-model="form.first_name" class="lk-input" autocomplete="given-name" maxlength="255" required />
                        <span v-if="fieldError('first_name')" class="lk-form-error">{{ fieldError('first_name') }}</span>
                    </label>

                    <label class="lk-field">
                        <span class="lk-label">Last name</span>
                        <input v-model="form.last_name" class="lk-input" autocomplete="family-name" maxlength="255" />
                        <span v-if="fieldError('last_name')" class="lk-form-error">{{ fieldError('last_name') }}</span>
                    </label>

                    <label class="lk-field">
                        <span class="lk-label">Email address</span>
                        <input v-model="form.email" type="email" class="lk-input" autocomplete="email" maxlength="255" required />
                        <span v-if="fieldError('email')" class="lk-form-error">{{ fieldError('email') }}</span>
                    </label>

                    <label class="lk-field">
                        <span class="lk-label">Phone number</span>
                        <input v-model="form.phone" type="tel" class="lk-input" autocomplete="tel" maxlength="50" />
                        <span v-if="fieldError('phone')" class="lk-form-error">{{ fieldError('phone') }}</span>
                    </label>

                    <label class="lk-field">
                        <span class="lk-label">Role</span>
                        <select v-model="form.role" class="lk-select" required>
                            <option value="" disabled>Choose a role</option>
                            <option v-for="role in roleOptions" :key="role.id" :value="role.id">{{ role.name }}</option>
                        </select>
                        <span v-if="fieldError('role')" class="lk-form-error">{{ fieldError('role') }}</span>
                        <span v-else class="lk-hint">Roles decide which screens and actions this user can reach.</span>
                    </label>

                    <label class="lk-field">
                        <span class="lk-label">Account status</span>
                        <select v-model="form.is_active" class="lk-select">
                            <option :value="true">Active</option>
                            <option :value="false">Inactive</option>
                        </select>
                        <span v-if="fieldError('is_active')" class="lk-form-error">{{ fieldError('is_active') }}</span>
                    </label>

                    <label class="lk-field">
                        <span class="lk-label">{{ isEditMode ? 'New password' : 'Password' }}</span>
                        <input
                            v-model="form.password"
                            type="password"
                            class="lk-input"
                            :placeholder="isEditMode ? 'Leave blank to keep the current password' : 'At least 8 characters'"
                            autocomplete="new-password"
                            :required="!isEditMode"
                        />
                        <span v-if="fieldError('password')" class="lk-form-error">{{ fieldError('password') }}</span>
                    </label>

                    <label class="lk-field">
                        <span class="lk-label">Confirm password</span>
                        <input
                            v-model="form.password_confirmation"
                            type="password"
                            class="lk-input"
                            autocomplete="new-password"
                            :required="!isEditMode"
                        />
                        <span v-if="fieldError('password_confirmation')" class="lk-form-error">
                            {{ fieldError('password_confirmation') }}
                        </span>
                    </label>
                </div>

                <div class="lk-inline-note" style="margin-top: 14px">
                    <span>
                        {{ isEditMode
                            ? 'Leave the password fields empty to keep the current password.'
                            : 'The new user will receive this password directly. Ask them to change it after signing in.' }}
                    </span>
                </div>
            </div>

            <div class="lk-card__body user-form-actions">
                <router-link :to="{ name: 'users' }" class="lk-btn lk-btn--ghost">Cancel</router-link>
                <button type="submit" class="lk-btn lk-btn--primary" :disabled="saving">
                    {{ saving ? 'Saving…' : isEditMode ? 'Save changes' : 'Create user' }}
                </button>
            </div>
        </form>
    </div>
</template>

<style scoped>
.user-form-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
    border-top: 1px solid var(--lk-border);
    flex-wrap: wrap;
}
</style>
