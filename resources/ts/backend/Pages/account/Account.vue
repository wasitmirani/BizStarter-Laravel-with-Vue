<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import AdmissionsService from '../../Services/Admissions/AdmissionsService';
import { errorMessage, validationErrors } from '../../Services/Admissions/api';
import PageHeader from '../Admissions/Components/PageHeader.vue';
import ConfirmDialog from '../Admissions/Components/ConfirmDialog.vue';

type Tab = 'account' | 'security' | 'privacy';

const activeTab = ref<Tab>('account');
const user = ref<any>(null);
const completion = ref<any>({ percentage: 0, completed: 0, total: 0, missing: [] });
const loading = ref(true);
const error = ref('');
const notice = ref('');

const accountForm = reactive({ name: '', email: '', phone: '' });
const accountErrors = ref<Record<string, string[]>>({});
const savingAccount = ref(false);

const passwordForm = reactive({ current_password: '', password: '', password_confirmation: '' });
const passwordErrors = ref<Record<string, string[]>>({});
const savingPassword = ref(false);
const showPasswords = ref(false);

const avatarInput = ref<HTMLInputElement | null>(null);
const uploadingAvatar = ref(false);

const exportBusy = ref(false);
const deletePassword = ref('');
const deleteErrors = ref<Record<string, string[]>>({});
const confirmDeleteOpen = ref(false);
const deleting = ref(false);

const tabs: Array<{ key: Tab; label: string; icon: string; hint: string }> = [
    { key: 'account', label: 'Account', icon: 'user', hint: 'Name, email and avatar' },
    { key: 'security', label: 'Security', icon: 'lock', hint: 'Password and sessions' },
    { key: 'privacy', label: 'Data & privacy', icon: 'shield-check', hint: 'Export or delete data' },
];

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

const completionPercent = computed(() => completion.value?.percentage ?? 0);

const load = async () => {
    loading.value = true;
    error.value = '';

    try {
        const result = await AdmissionsService.account();
        user.value = result.user;
        completion.value = result.completion ?? completion.value;
        syncAccountForm();
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        loading.value = false;
    }
};

const syncAccountForm = () => {
    accountForm.name = user.value?.name ?? '';
    accountForm.email = user.value?.email ?? '';
    accountForm.phone = user.value?.phone ?? '';
};

const saveAccount = async () => {
    savingAccount.value = true;
    accountErrors.value = {};
    notice.value = '';
    error.value = '';

    try {
        const result = await AdmissionsService.updateAccount({ ...accountForm, phone: accountForm.phone || null });
        user.value = { ...user.value, ...result.user };
        syncAccountForm();
        notice.value = 'Your account details have been saved.';
    } catch (exception: any) {
        accountErrors.value = validationErrors(exception);
        error.value = errorMessage(exception);
    } finally {
        savingAccount.value = false;
    }
};

const savePassword = async () => {
    savingPassword.value = true;
    passwordErrors.value = {};
    notice.value = '';
    error.value = '';

    try {
        await AdmissionsService.updateAccountPassword({ ...passwordForm });
        passwordForm.current_password = '';
        passwordForm.password = '';
        passwordForm.password_confirmation = '';
        notice.value = 'Your password has been updated. Other sessions were signed out.';
    } catch (exception: any) {
        passwordErrors.value = validationErrors(exception);
        error.value = errorMessage(exception);
    } finally {
        savingPassword.value = false;
    }
};

const pickAvatar = () => avatarInput.value?.click();

const uploadAvatar = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    uploadingAvatar.value = true;
    error.value = '';
    notice.value = '';

    try {
        const form = new FormData();
        form.append('avatar', file);
        const result = await AdmissionsService.uploadAccountAvatar(form);
        user.value = { ...user.value, thumbnail: result.thumbnail };
        notice.value = 'Your avatar has been updated.';
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        uploadingAvatar.value = false;
        input.value = '';
    }
};

const exportData = async () => {
    exportBusy.value = true;
    error.value = '';
    notice.value = '';

    try {
        const data = await AdmissionsService.exportAccount();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `unipilot-account-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        notice.value = 'Your account export has been downloaded.';
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        exportBusy.value = false;
    }
};

const deleteAccount = async () => {
    deleting.value = true;
    deleteErrors.value = {};
    error.value = '';

    try {
        await AdmissionsService.deleteAccount(deletePassword.value);
        window.location.href = '/';
    } catch (exception: any) {
        deleteErrors.value = validationErrors(exception);
        error.value = errorMessage(exception);
        confirmDeleteOpen.value = false;
    } finally {
        deleting.value = false;
    }
};

const fieldError = (errors: Record<string, string[]>, field: string) => errors?.[field]?.[0] ?? '';

onMounted(load);
</script>

<template>
    <div>
        <PageHeader title="Account settings" subtitle="Manage your sign-in details, password and personal data." />

        <div v-if="error" class="alert alert-danger py-2 d-flex align-items-start gap-2">
            <AppIcon name="alert-triangle" class="mt-1" />
            <span class="flex-grow-1">{{ error }}</span>
            <button type="button" class="btn-close" aria-label="Dismiss" @click="error = ''"></button>
        </div>
        <div v-if="notice" class="alert alert-success py-2 d-flex align-items-start gap-2">
            <AppIcon name="circle-check" class="mt-1" />
            <span class="flex-grow-1">{{ notice }}</span>
            <button type="button" class="btn-close" aria-label="Dismiss" @click="notice = ''"></button>
        </div>

        <div v-if="loading" class="card">
            <div class="card-body text-center py-10">
                <span class="spinner-border text-primary" role="status"></span>
                <p class="text-muted fs-15 mt-3 mb-0">Loading your account…</p>
            </div>
        </div>

        <div v-else-if="user" class="row g-4">
            <div class="col-lg-4">
                <div class="card mb-4">
                    <div class="card-body text-center">
                        <div class="position-relative d-inline-block mb-3">
                            <img :src="user.thumbnail" :alt="user.name" class="rounded-circle object-fit-cover" style="width: 88px; height: 88px" />
                            <button
                                type="button"
                                class="btn btn-sm btn-primary btn-icon position-absolute"
                                style="right: -4px; bottom: -4px"
                                title="Change avatar"
                                aria-label="Change avatar"
                                :disabled="uploadingAvatar"
                                @click="pickAvatar"
                            >
                                <span v-if="uploadingAvatar" class="spinner-border spinner-border-sm" role="status"></span>
                                <AppIcon v-else name="edit" :size="13" />
                            </button>
                            <input ref="avatarInput" type="file" accept="image/png,image/jpeg,image/webp" class="d-none" @change="uploadAvatar" />
                        </div>

                        <h5 class="mb-1">{{ user.name }}</h5>
                        <p class="text-muted fs-14 mb-3">{{ user.email }}</p>

                        <div class="d-flex flex-wrap justify-content-center gap-1 mb-3">
                            <span v-for="role in roleNames" :key="role" class="chip">
                                <AppIcon name="shield" :size="12" />{{ role }}
                            </span>
                            <span v-if="!roleNames.length" class="chip">No role</span>
                        </div>

                        <div class="text-start border-top pt-3">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="text-muted fs-14">Application profile</span>
                                <span class="fw-semibold fs-14">{{ completionPercent }}%</span>
                            </div>
                            <div class="progress" style="height: 7px">
                                <div class="progress-bar bg-primary" :style="{ width: `${completionPercent}%` }"></div>
                            </div>
                            <p class="text-muted fs-13 mt-2 mb-0">
                                {{ completion.completed }} of {{ completion.total }} admission checks complete
                            </p>
                            <router-link :to="{ name: 'profile' }" class="link link-custom-primary fs-14 d-inline-flex align-items-center gap-1 mt-2">
                                Open admission profile <AppIcon name="arrow-right" :size="13" />
                            </router-link>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header"><h6 class="card-title mb-0">Workspace</h6></div>
                    <div class="card-body d-flex flex-column gap-3">
                        <router-link :to="{ name: 'preferences' }" class="d-flex align-items-center gap-3 text-body text-decoration-none">
                            <span class="avatar rounded bg-primary-subtle text-primary" style="width: 34px; height: 34px">
                                <AppIcon name="target-arrow" :size="16" />
                            </span>
                            <span class="min-w-0">
                                <span class="d-block fw-medium">Study preferences</span>
                                <span class="d-block text-muted fs-13">Budget, subjects and destinations</span>
                            </span>
                            <AppIcon name="chevron-right" :size="15" class="ms-auto text-muted" />
                        </router-link>
                        <router-link :to="{ name: 'documents' }" class="d-flex align-items-center gap-3 text-body text-decoration-none">
                            <span class="avatar rounded bg-info-subtle text-info" style="width: 34px; height: 34px">
                                <AppIcon name="files" :size="16" />
                            </span>
                            <span class="min-w-0">
                                <span class="d-block fw-medium">Documents</span>
                                <span class="d-block text-muted fs-13">Transcripts, tests and references</span>
                            </span>
                            <AppIcon name="chevron-right" :size="15" class="ms-auto text-muted" />
                        </router-link>
                        <router-link :to="{ name: 'reports' }" class="d-flex align-items-center gap-3 text-body text-decoration-none">
                            <span class="avatar rounded bg-success-subtle text-success" style="width: 34px; height: 34px">
                                <AppIcon name="report" :size="16" />
                            </span>
                            <span class="min-w-0">
                                <span class="d-block fw-medium">Daily reports</span>
                                <span class="d-block text-muted fs-13">Personalised admission briefings</span>
                            </span>
                            <AppIcon name="chevron-right" :size="15" class="ms-auto text-muted" />
                        </router-link>
                    </div>
                </div>
            </div>

            <div class="col-lg-8">
                <div class="card">
                    <div class="card-header pb-0">
                        <ul class="nav nav-pills gap-2" role="tablist">
                            <li v-for="tab in tabs" :key="tab.key" class="nav-item" role="presentation">
                                <button
                                    type="button"
                                    class="nav-link d-flex align-items-center gap-2"
                                    :class="{ active: activeTab === tab.key }"
                                    role="tab"
                                    :aria-selected="activeTab === tab.key"
                                    @click="activeTab = tab.key"
                                >
                                    <AppIcon :name="tab.icon" :size="15" />{{ tab.label }}
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div class="card-body pt-4">
                        <!-- Account -->
                        <form v-if="activeTab === 'account'" @submit.prevent="saveAccount">
                            <div class="d-flex align-items-start justify-content-between gap-3 mb-4">
                                <div>
                                    <h6 class="mb-1">Account details</h6>
                                    <p class="text-muted fs-14 mb-0">Your name and contact details are used across your applications and reports.</p>
                                </div>
                            </div>

                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label for="accountName" class="form-label">Full name</label>
                                    <input id="accountName" v-model="accountForm.name" type="text" class="form-control" :class="{ 'is-invalid': fieldError(accountErrors, 'name') }" required />
                                    <div v-if="fieldError(accountErrors, 'name')" class="invalid-feedback">{{ fieldError(accountErrors, 'name') }}</div>
                                </div>
                                <div class="col-md-6">
                                    <label for="accountEmail" class="form-label">Email address</label>
                                    <input id="accountEmail" v-model="accountForm.email" type="email" class="form-control" :class="{ 'is-invalid': fieldError(accountErrors, 'email') }" required />
                                    <div v-if="fieldError(accountErrors, 'email')" class="invalid-feedback">{{ fieldError(accountErrors, 'email') }}</div>
                                    <p v-if="!user.email_verified_at" class="text-warning fs-13 mb-0 mt-1">This email still needs verification.</p>
                                </div>
                                <div class="col-md-6">
                                    <label for="accountPhone" class="form-label">Phone</label>
                                    <input id="accountPhone" v-model="accountForm.phone" type="tel" class="form-control" :class="{ 'is-invalid': fieldError(accountErrors, 'phone') }" placeholder="+39 …" />
                                    <div v-if="fieldError(accountErrors, 'phone')" class="invalid-feedback">{{ fieldError(accountErrors, 'phone') }}</div>
                                </div>
                                <div class="col-md-6">
                                    <label for="accountUsername" class="form-label">Username</label>
                                    <input id="accountUsername" :value="user.user_name" type="text" class="form-control" disabled />
                                    <p class="text-muted fs-13 mb-0 mt-1">Usernames are generated and cannot be changed.</p>
                                </div>
                            </div>

                            <div class="border-top mt-4 pt-3 d-flex justify-content-end">
                                <button type="submit" class="btn btn-primary" :disabled="savingAccount">
                                    <span v-if="savingAccount" class="spinner-border spinner-border-sm me-1" role="status"></span>
                                    {{ savingAccount ? 'Saving…' : 'Save changes' }}
                                </button>
                            </div>
                        </form>

                        <!-- Security -->
                        <form v-else-if="activeTab === 'security'" @submit.prevent="savePassword">
                            <div class="mb-4">
                                <h6 class="mb-1">Change password</h6>
                                <p class="text-muted fs-14 mb-0">Use at least 8 characters. Signing out other sessions keeps your account safe.</p>
                            </div>

                            <div class="row g-3">
                                <div class="col-12">
                                    <label for="currentPassword" class="form-label">Current password</label>
                                    <div class="input-group">
                                        <input
                                            id="currentPassword"
                                            v-model="passwordForm.current_password"
                                            :type="showPasswords ? 'text' : 'password'"
                                            class="form-control"
                                            :class="{ 'is-invalid': fieldError(passwordErrors, 'current_password') }"
                                            autocomplete="current-password"
                                            required
                                        />
                                        <button type="button" class="btn btn-light" :aria-label="showPasswords ? 'Hide passwords' : 'Show passwords'" @click="showPasswords = !showPasswords">
                                            <AppIcon :name="showPasswords ? 'eye-off' : 'eye'" :size="16" />
                                        </button>
                                    </div>
                                    <div v-if="fieldError(passwordErrors, 'current_password')" class="text-danger fs-13 mt-1">{{ fieldError(passwordErrors, 'current_password') }}</div>
                                </div>
                                <div class="col-md-6">
                                    <label for="newPassword" class="form-label">New password</label>
                                    <input
                                        id="newPassword"
                                        v-model="passwordForm.password"
                                        :type="showPasswords ? 'text' : 'password'"
                                        class="form-control"
                                        :class="{ 'is-invalid': fieldError(passwordErrors, 'password') }"
                                        autocomplete="new-password"
                                        required
                                    />
                                    <div v-if="fieldError(passwordErrors, 'password')" class="invalid-feedback">{{ fieldError(passwordErrors, 'password') }}</div>
                                </div>
                                <div class="col-md-6">
                                    <label for="confirmPassword" class="form-label">Confirm new password</label>
                                    <input
                                        id="confirmPassword"
                                        v-model="passwordForm.password_confirmation"
                                        :type="showPasswords ? 'text' : 'password'"
                                        class="form-control"
                                        autocomplete="new-password"
                                        required
                                    />
                                </div>
                            </div>

                            <div class="border-top mt-4 pt-3 d-flex justify-content-end">
                                <button type="submit" class="btn btn-primary" :disabled="savingPassword">
                                    <span v-if="savingPassword" class="spinner-border spinner-border-sm me-1" role="status"></span>
                                    {{ savingPassword ? 'Updating…' : 'Update password' }}
                                </button>
                            </div>
                        </form>

                        <!-- Privacy -->
                        <div v-else>
                            <div class="mb-4">
                                <h6 class="mb-1">Your data</h6>
                                <p class="text-muted fs-14 mb-0">Download a complete copy of your UniPilot data, or permanently remove your account.</p>
                            </div>

                            <div class="border rounded p-3 d-flex flex-wrap align-items-center gap-3 mb-3">
                                <span class="avatar rounded bg-primary-subtle text-primary" style="width: 40px; height: 40px">
                                    <AppIcon name="download" :size="18" />
                                </span>
                                <div class="flex-grow-1 min-w-0">
                                    <p class="fw-semibold mb-0">Export account data</p>
                                    <p class="text-muted fs-14 mb-0">Profile, education, documents, applications, tasks and reports as JSON.</p>
                                </div>
                                <button type="button" class="btn btn-sm btn-light" :disabled="exportBusy" @click="exportData">
                                    <span v-if="exportBusy" class="spinner-border spinner-border-sm me-1" role="status"></span>
                                    {{ exportBusy ? 'Preparing…' : 'Download' }}
                                </button>
                            </div>

                            <div class="border border-danger-subtle rounded p-3">
                                <div class="d-flex flex-wrap align-items-start gap-3">
                                    <span class="avatar rounded bg-danger-subtle text-danger" style="width: 40px; height: 40px">
                                        <AppIcon name="alert-triangle" :size="18" />
                                    </span>
                                    <div class="flex-grow-1 min-w-0">
                                        <p class="fw-semibold mb-1">Delete account</p>
                                        <p class="text-muted fs-14 mb-3">This erases your profile, applications, tasks, documents and reports. It cannot be undone.</p>

                                        <label for="deletePassword" class="form-label">Confirm your password</label>
                                        <input
                                            id="deletePassword"
                                            v-model="deletePassword"
                                            type="password"
                                            class="form-control"
                                            :class="{ 'is-invalid': fieldError(deleteErrors, 'password') }"
                                            autocomplete="current-password"
                                        />
                                        <div v-if="fieldError(deleteErrors, 'password')" class="invalid-feedback">{{ fieldError(deleteErrors, 'password') }}</div>
                                        <button
                                            type="button"
                                            class="btn btn-danger mt-3"
                                            :disabled="!deletePassword || deleting"
                                            @click="confirmDeleteOpen = true"
                                        >
                                            Delete my account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ConfirmDialog
            :show="confirmDeleteOpen"
            title="Permanently delete your account?"
            message="Your profile, applications, documents and reports will be erased. This cannot be undone."
            confirm-label="Delete account"
            :busy="deleting"
            @cancel="confirmDeleteOpen = false"
            @confirm="deleteAccount"
        />
    </div>
</template>
