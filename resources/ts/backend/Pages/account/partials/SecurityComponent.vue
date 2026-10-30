<script lang="ts" setup>
import { inject, reactive, ref, type Ref } from 'vue';
import ProfileService from '../../../Services/Profile/ProfileService';

const toast = inject<Ref<any>>('toast', ref(null));

const saving = ref(false);
const error = ref('');
const success = ref('');
const fieldErrors = ref<Record<string, string[]>>({});
const show = reactive({ current: false, next: false, confirm: false });

const form = reactive({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
});

const rules = [
    'At least 8 characters',
    'Mix letters and numbers where possible',
    'Do not reuse a password from another service',
];

function reset() {
    form.current_password = '';
    form.new_password = '';
    form.new_password_confirmation = '';
    error.value = '';
    success.value = '';
    fieldErrors.value = {};
}

async function submit() {
    saving.value = true;
    error.value = '';
    success.value = '';
    fieldErrors.value = {};

    try {
        await ProfileService.updatePassword({
            current_password: form.current_password,
            new_password: form.new_password,
            new_password_confirmation: form.new_password_confirmation,
        });

        reset();
        success.value = 'Your password has been changed. Use it the next time you sign in.';
        toast.value?.showToast(200, 'Password updated', {
            message: 'Your account is secured with the new password.',
        });
    } catch (requestError: any) {
        const response = requestError?.response;

        if (response?.status === 422) {
            fieldErrors.value = response.data?.errors ?? {};
            error.value = response.data?.message ?? 'Please fix the highlighted fields.';
        } else {
            error.value = response?.data?.message ?? 'Your password could not be changed.';
        }

        toast.value?.showToast(response?.status ?? 500, 'Password not changed', {
            message: error.value,
        });
    } finally {
        saving.value = false;
    }
}
</script>

<template>
    <div class="lk-grid-2 lk-grid-2--even" style="margin-top: 0">
        <section class="lk-card" aria-label="Change password">
            <div class="lk-card__head">
                <div>
                    <h2 class="lk-card__title">Change password</h2>
                    <p class="lk-card__meta">Confirm your current password before choosing a new one</p>
                </div>
            </div>
            <div class="lk-card__body">
                <form novalidate @submit.prevent="submit">
                    <div v-if="error" class="lk-inline-note lk-inline-note--error" role="alert">
                        {{ error }}
                    </div>
                    <div v-if="success" class="lk-inline-note lk-inline-note--success" role="status" style="margin-top: 10px">
                        {{ success }}
                    </div>

                    <div class="lk-form-grid" style="grid-template-columns: minmax(0, 1fr); margin-top: 14px">
                        <label class="lk-field">
                            <span class="lk-label">Current password</span>
                            <span class="lk-password">
                                <input
                                    v-model="form.current_password"
                                    :type="show.current ? 'text' : 'password'"
                                    class="lk-input"
                                    autocomplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    class="lk-password__toggle"
                                    :aria-label="show.current ? 'Hide current password' : 'Show current password'"
                                    @click="show.current = !show.current"
                                >
                                    {{ show.current ? 'Hide' : 'Show' }}
                                </button>
                            </span>
                            <span v-if="fieldErrors.current_password" class="lk-form-error">{{ fieldErrors.current_password[0] }}</span>
                        </label>

                        <label class="lk-field">
                            <span class="lk-label">New password</span>
                            <span class="lk-password">
                                <input
                                    v-model="form.new_password"
                                    :type="show.next ? 'text' : 'password'"
                                    class="lk-input"
                                    autocomplete="new-password"
                                    required
                                />
                                <button
                                    type="button"
                                    class="lk-password__toggle"
                                    :aria-label="show.next ? 'Hide new password' : 'Show new password'"
                                    @click="show.next = !show.next"
                                >
                                    {{ show.next ? 'Hide' : 'Show' }}
                                </button>
                            </span>
                            <span v-if="fieldErrors.new_password" class="lk-form-error">{{ fieldErrors.new_password[0] }}</span>
                        </label>

                        <label class="lk-field">
                            <span class="lk-label">Confirm new password</span>
                            <span class="lk-password">
                                <input
                                    v-model="form.new_password_confirmation"
                                    :type="show.confirm ? 'text' : 'password'"
                                    class="lk-input"
                                    autocomplete="new-password"
                                    required
                                />
                                <button
                                    type="button"
                                    class="lk-password__toggle"
                                    :aria-label="show.confirm ? 'Hide confirmation' : 'Show confirmation'"
                                    @click="show.confirm = !show.confirm"
                                >
                                    {{ show.confirm ? 'Hide' : 'Show' }}
                                </button>
                            </span>
                        </label>
                    </div>

                    <div class="lk-form-actions">
                        <button type="button" class="lk-btn lk-btn--ghost" :disabled="saving" @click="reset">Clear</button>
                        <button type="submit" class="lk-btn lk-btn--primary" :disabled="saving">
                            <span v-if="saving" class="lk-btn__spinner" aria-hidden="true"></span>
                            {{ saving ? 'Updating…' : 'Update password' }}
                        </button>
                    </div>
                </form>
            </div>
        </section>

        <section class="lk-card" aria-label="Password guidance">
            <div class="lk-card__head">
                <div>
                    <h2 class="lk-card__title">Security checklist</h2>
                    <p class="lk-card__meta">Keep your admin account protected</p>
                </div>
            </div>
            <div class="lk-card__body">
                <ul class="lk-checklist">
                    <li v-for="rule in rules" :key="rule">
                        <span class="lk-checklist__mark" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                        </span>
                        {{ rule }}
                    </li>
                </ul>

                <div class="lk-inline-note">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex-shrink: 0; margin-top: 1px"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4m0-4h.01" /></svg>
                    <span>Two-factor authentication is not enabled in this deployment. Password changes revoke nothing else, so sign out of shared devices manually.</span>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.lk-password {
    position: relative;
    display: block;
}

.lk-password .lk-input {
    padding-right: 58px;
}

.lk-password__toggle {
    position: absolute;
    top: 50%;
    right: 6px;
    transform: translateY(-50%);
    border: 0;
    background: transparent;
    color: var(--lk-primary);
    font-size: 11.5px;
    font-weight: 600;
    cursor: pointer;
    padding: 4px 6px;
    border-radius: 5px;
}

.lk-password__toggle:hover {
    background: var(--lk-primary-subtle);
}

.lk-checklist {
    list-style: none;
    margin: 0 0 16px;
    padding: 0;
    display: grid;
    gap: 9px;
}

.lk-checklist li {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    font-size: 13px;
    color: var(--lk-text-secondary);
}

.lk-checklist__mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--lk-success-bg);
    color: var(--lk-success);
    flex-shrink: 0;
}

@media (max-width: 767.98px) {
    .lk-grid-2,
    .lk-grid-2--even {
        grid-template-columns: minmax(0, 1fr);
    }
}
</style>
