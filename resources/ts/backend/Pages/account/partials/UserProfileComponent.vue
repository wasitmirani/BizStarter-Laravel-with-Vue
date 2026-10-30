<script lang="ts" setup>
import { computed, inject, onMounted, reactive, ref, type Ref } from 'vue';
import ProfileService from '../../../Services/Profile/ProfileService';
import { Helpers } from '../../../Utils/Helper';
import { useAuthStore } from '../../../../shared/stores/authStore';

const toast = inject<Ref<any>>('toast', ref(null));
const authStore = useAuthStore();
authStore.initFromWindow();

const loading = ref(true);
const saving = ref(false);
const error = ref('');
const success = ref('');
const fieldErrors = ref<Record<string, string[]>>({});

const profile = ref<any>(null);

const form = reactive({
    name: '',
    email: '',
    phone: '',
});

const initials = computed(() =>
    (form.name || authStore.user?.name || '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join(''),
);

const roleName = computed(() => profile.value?.roles?.[0]?.name ?? authStore.user?.roles?.[0]?.name ?? 'Member');
const joined = computed(() => (profile.value?.created_at ? Helpers.DateTimeFormat(profile.value.created_at) : '—'));

function applyProfile(user: any) {
    profile.value = user;
    form.name = user?.name ?? '';
    form.email = user?.email ?? '';
    form.phone = user?.phone ?? '';
}

async function load() {
    loading.value = true;
    error.value = '';

    try {
        const response = await ProfileService.show();
        applyProfile(response.data?.result?.user ?? null);
    } catch (requestError: any) {
        error.value = requestError?.response?.data?.message ?? 'Could not load your profile.';
    } finally {
        loading.value = false;
    }
}

async function save() {
    saving.value = true;
    error.value = '';
    success.value = '';
    fieldErrors.value = {};

    try {
        const response = await ProfileService.update({
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim() || null,
        });

        const user = response.data?.result?.user ?? null;
        applyProfile(user);

        if (user) {
            authStore.setUser({
                id: user.id,
                name: user.name,
                email: user.email,
                thumbnail: user.thumbnail,
                token: window.__APP_CONTEXT__?.auth.token ?? null,
                roles: user.roles ?? [],
            });
        }

        success.value = 'Your profile has been updated.';
        toast.value?.showToast(200, 'Profile updated', { message: 'Your account details are now up to date.' });
    } catch (requestError: any) {
        const response = requestError?.response;
        if (response?.status === 422 && response.data?.errors) {
            fieldErrors.value = response.data.errors;
            error.value = response.data.message ?? 'Please fix the highlighted fields.';
        } else {
            error.value = response?.data?.message ?? 'Your profile could not be saved.';
        }
    } finally {
        saving.value = false;
    }
}

onMounted(() => {
    void load();
});
</script>

<template>
    <div class="lk-grid-2 lk-grid-2--even" style="margin-top: 0">
        <section class="lk-card" aria-label="Profile summary">
            <div class="lk-card__body">
                <div v-if="loading" class="lk-state" aria-busy="true">
                    <span class="lk-skeleton" style="width: 72px; height: 72px; border-radius: 50%"></span>
                    <span class="lk-skeleton" style="width: 55%; height: 14px; margin-top: 12px"></span>
                    <span class="lk-skeleton" style="width: 35%; height: 11px; margin-top: 8px"></span>
                </div>

                <div v-else class="lk-profile-summary">
                    <img v-if="profile?.thumbnail" :src="profile.thumbnail" alt="" class="lk-profile-summary__avatar" />
                    <span v-else class="lk-profile-summary__avatar lk-avatar--initials">{{ initials }}</span>

                    <h2 class="lk-profile-summary__name">{{ profile?.name ?? 'Your account' }}</h2>
                    <p class="lk-profile-summary__email">{{ profile?.email }}</p>
                    <span class="lk-badge lk-badge--success">{{ roleName }}</span>

                    <dl class="lk-profile-facts">
                        <div>
                            <dt>Member since</dt>
                            <dd>{{ joined }}</dd>
                        </div>
                        <div>
                            <dt>Email status</dt>
                            <dd>{{ profile?.email_verified_at ? 'Verified' : 'Not verified' }}</dd>
                        </div>
                        <div>
                            <dt>Phone</dt>
                            <dd>{{ profile?.phone || 'Not set' }}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </section>

        <section class="lk-card" aria-label="Edit profile">
            <div class="lk-card__head">
                <div>
                    <h2 class="lk-card__title">Account details</h2>
                    <p class="lk-card__meta">Used across the portal, audit log and notifications</p>
                </div>
            </div>
            <div class="lk-card__body">
                <div v-if="loading" class="lk-state" aria-busy="true">
                    <span class="lk-skeleton" style="width: 100%; height: 38px"></span>
                    <span class="lk-skeleton" style="width: 100%; height: 38px; margin-top: 10px"></span>
                    <span class="lk-skeleton" style="width: 100%; height: 38px; margin-top: 10px"></span>
                </div>

                <form v-else novalidate @submit.prevent="save">
                    <div v-if="error" class="lk-inline-note lk-inline-note--error" role="alert">
                        {{ error }}
                    </div>
                    <div v-if="success" class="lk-inline-note lk-inline-note--success" role="status" style="margin-top: 10px">
                        {{ success }}
                    </div>

                    <div class="lk-form-grid" style="margin-top: 14px">
                        <label class="lk-field lk-field--full">
                            <span class="lk-label">Full name</span>
                            <input v-model="form.name" type="text" class="lk-input" autocomplete="name" required />
                            <span v-if="fieldErrors.name" class="lk-form-error">{{ fieldErrors.name[0] }}</span>
                        </label>

                        <label class="lk-field">
                            <span class="lk-label">Email address</span>
                            <input v-model="form.email" type="email" class="lk-input" autocomplete="email" required />
                            <span v-if="fieldErrors.email" class="lk-form-error">{{ fieldErrors.email[0] }}</span>
                        </label>

                        <label class="lk-field">
                            <span class="lk-label">Phone</span>
                            <input v-model="form.phone" type="tel" class="lk-input" autocomplete="tel" />
                            <span v-if="fieldErrors.phone" class="lk-form-error">{{ fieldErrors.phone[0] }}</span>
                        </label>
                    </div>

                    <p class="lk-hint">Changing your email address takes effect immediately for sign-in.</p>

                    <div class="lk-form-actions">
                        <button type="button" class="lk-btn lk-btn--ghost" :disabled="saving" @click="load">Reset</button>
                        <button type="submit" class="lk-btn lk-btn--primary" :disabled="saving">
                            <span v-if="saving" class="lk-btn__spinner" aria-hidden="true"></span>
                            {{ saving ? 'Saving…' : 'Save changes' }}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    </div>
</template>

<style scoped>
.lk-profile-summary {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 8px 4px;
}

.lk-profile-summary__avatar {
    width: 76px;
    height: 76px;
    border-radius: 50%;
    object-fit: cover;
    background: var(--lk-primary-subtle);
    color: var(--lk-primary-active);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 700;
}

.lk-profile-summary__name {
    margin: 12px 0 2px;
    font-size: 18px;
    font-weight: 700;
}

.lk-profile-summary__email {
    margin: 0 0 10px;
    font-size: 13px;
    color: var(--lk-text-muted);
}

.lk-profile-facts {
    display: grid;
    gap: 8px;
    width: 100%;
    margin: 18px 0 0;
    padding-top: 14px;
    border-top: 1px solid var(--lk-border);
    text-align: left;
}

.lk-profile-facts div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 12.5px;
}

.lk-profile-facts dt {
    color: var(--lk-text-muted);
}

.lk-profile-facts dd {
    margin: 0;
    color: var(--lk-text);
    font-weight: 500;
    text-align: right;
}

@media (max-width: 767.98px) {
    .lk-grid-2,
    .lk-grid-2--even {
        grid-template-columns: minmax(0, 1fr);
    }
}
</style>
