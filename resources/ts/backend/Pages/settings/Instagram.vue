<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref, type Ref } from 'vue';
import CrmService, { type InstagramAccount } from '../../Services/Crm/CrmService';

const toast = inject<Ref<any>>('toast', ref(null));

const loading = ref(true);
const error = ref('');
const saving = ref(false);
const testing = ref(false);

const account = ref<InstagramAccount | null>(null);
const webhookUrl = ref('');
const configured = ref(false);

const form = reactive({
    name: '',
    instagram_user_id: '',
    instagram_username: '',
    page_id: '',
    access_token: '',
    verify_token: '',
    api_version: 'v21.0',
    is_active: true,
});

const statusLabel = computed(() => {
    if (!account.value) return 'Not configured';
    if (!configured.value) return 'Awaiting credentials';
    return account.value.connected_at ? 'Connected' : 'Configured';
});

function apply(next: InstagramAccount) {
    account.value = next;
    configured.value = next.configured;
    Object.assign(form, {
        name: next.name ?? '',
        instagram_user_id: next.instagram_user_id ?? '',
        instagram_username: next.instagram_username ?? '',
        page_id: next.page_id ?? '',
        access_token: '',
        verify_token: next.verify_token ?? '',
        api_version: next.api_version ?? 'v21.0',
        is_active: next.is_active,
    });
}

async function load() {
    loading.value = true;
    error.value = '';

    try {
        const response = await CrmService.instagram();
        apply(response.data.result.account);
        webhookUrl.value = response.data.result.webhook_url;
    } catch (requestError: any) {
        error.value = requestError?.response?.data?.message ?? 'We could not load Instagram settings.';
    } finally {
        loading.value = false;
    }
}

async function save() {
    saving.value = true;

    try {
        const response = await CrmService.saveInstagram({
            name: form.name || null,
            instagram_user_id: form.instagram_user_id || null,
            instagram_username: form.instagram_username || null,
            page_id: form.page_id || null,
            access_token: form.access_token || null,
            verify_token: form.verify_token || null,
            api_version: form.api_version || null,
            is_active: form.is_active,
        });
        apply(response.data.result.account);
        toast.value?.showToast(200, 'Instagram settings saved', { message: 'Credentials are stored encrypted.' });
    } catch (requestError: any) {
        toast.value?.showToast(requestError?.response?.status ?? 500, 'Could not save settings', {
            message: requestError?.response?.data?.message ?? 'Check the fields and try again.',
        });
    } finally {
        saving.value = false;
    }
}

async function test() {
    testing.value = true;

    try {
        const response = await CrmService.testInstagram();
        apply(response.data.result.account);
        toast.value?.showToast(200, 'Connection successful', { message: 'Meta accepted the Instagram credentials.' });
    } catch (requestError: any) {
        toast.value?.showToast(requestError?.response?.status ?? 500, 'Connection failed', {
            message: requestError?.response?.data?.error ?? 'Check the Instagram account ID and access token.',
        });
    } finally {
        testing.value = false;
    }
}

async function rotate() {
    if (!window.confirm('Rotate the verify token? Update it in the Meta dashboard afterwards.')) return;

    try {
        const response = await CrmService.rotateInstagramVerifyToken();
        apply(response.data.result.account);
        toast.value?.showToast(200, 'Verify token rotated');
    } catch {
        toast.value?.showToast(500, 'Could not rotate token');
    }
}

async function copy(value: string, label: string) {
    try {
        await navigator.clipboard.writeText(value);
        toast.value?.showToast(200, `${label} copied`);
    } catch {
        toast.value?.showToast(500, 'Copy failed', { message: value });
    }
}

onMounted(() => void load());
</script>

<template>
    <div>
        <header class="lk-page-head">
            <div>
                <h1 class="lk-page-title">Instagram</h1>
                <p class="lk-page-subtitle">Add Instagram direct messages to the same shared team inbox.</p>
            </div>
            <div class="lk-page-actions">
                <span class="lk-badge" :class="configured ? 'lk-badge--success' : 'lk-badge--warning'">{{ statusLabel }}</span>
                <button type="button" class="lk-btn lk-btn--secondary lk-btn--sm" :disabled="testing || !configured" @click="test">
                    {{ testing ? 'Testing…' : 'Test connection' }}
                </button>
            </div>
        </header>

        <div v-if="loading" class="lk-card">
            <div class="lk-card__body">
                <span class="lk-skeleton" style="display: block; height: 12px; width: 45%"></span>
                <span class="lk-skeleton" style="display: block; height: 12px; width: 65%; margin-top: 10px"></span>
            </div>
        </div>

        <div v-else-if="error" class="lk-card">
            <div class="lk-state lk-state--error">
                <p class="lk-state__title">Instagram settings unavailable</p>
                <p class="lk-state__text">{{ error }}</p>
                <button type="button" class="lk-btn lk-btn--secondary lk-btn--sm" @click="load">Try again</button>
            </div>
        </div>

        <div v-else class="lk-ig">
            <section class="lk-card">
                <div class="lk-card__head">
                    <div>
                        <h2 class="lk-card__title">Meta credentials</h2>
                        <p class="lk-card__meta">Instagram professional account linked to a Facebook Page</p>
                    </div>
                    <span v-if="account?.has_token" class="lk-badge lk-badge--neutral">{{ account.token_preview }}</span>
                </div>

                <form class="lk-card__body" @submit.prevent="save">
                    <div class="lk-form-grid">
                        <label class="lk-field">
                            <span class="lk-label">Account label</span>
                            <input v-model="form.name" class="lk-input" maxlength="80" placeholder="Instagram support" />
                        </label>
                        <label class="lk-field">
                            <span class="lk-label">Instagram username</span>
                            <input v-model="form.instagram_username" class="lk-input" maxlength="80" placeholder="yourbrand" />
                        </label>
                        <label class="lk-field">
                            <span class="lk-label">Instagram account ID</span>
                            <input v-model="form.instagram_user_id" class="lk-input" maxlength="64" placeholder="17841400000000000" />
                            <span class="lk-hint">The Instagram professional account ID from the Graph API.</span>
                        </label>
                        <label class="lk-field">
                            <span class="lk-label">Facebook Page ID</span>
                            <input v-model="form.page_id" class="lk-input" maxlength="64" placeholder="102290129340398" />
                            <span class="lk-hint">The Page that owns this Instagram account.</span>
                        </label>
                        <label class="lk-field">
                            <span class="lk-label">API version</span>
                            <input v-model="form.api_version" class="lk-input" maxlength="16" placeholder="v21.0" />
                        </label>
                    </div>

                    <label class="lk-field" style="margin-top: 12px">
                        <span class="lk-label">Page access token</span>
                        <input
                            v-model="form.access_token"
                            type="password"
                            class="lk-input"
                            autocomplete="new-password"
                            :placeholder="account?.has_token ? 'Leave blank to keep the current token' : 'EAAG…'"
                        />
                        <span class="lk-hint">
                            Use a long-lived Page token with instagram_basic, instagram_manage_messages and pages_manage_metadata.
                        </span>
                    </label>

                    <label class="lk-field lk-field--inline" style="margin-top: 12px">
                        <input v-model="form.is_active" type="checkbox" />
                        <span>Account is active</span>
                    </label>

                    <div class="lk-ig__submit">
                        <button type="submit" class="lk-btn lk-btn--primary" :disabled="saving">
                            {{ saving ? 'Saving…' : 'Save credentials' }}
                        </button>
                    </div>
                </form>
            </section>

            <div class="lk-ig__side">
                <section class="lk-card">
                    <div class="lk-card__head">
                        <div>
                            <h2 class="lk-card__title">Webhook</h2>
                            <p class="lk-card__meta">Paste this into the Meta app dashboard</p>
                        </div>
                    </div>
                    <div class="lk-card__body">
                        <p class="lk-label">Callback URL</p>
                        <div class="lk-ig__copy">
                            <code>{{ webhookUrl }}</code>
                            <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" @click="copy(webhookUrl, 'Webhook URL')">Copy</button>
                        </div>

                        <p class="lk-label" style="margin-top: 12px">Verify token</p>
                        <div class="lk-ig__copy">
                            <code>{{ form.verify_token }}</code>
                            <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" @click="copy(form.verify_token, 'Verify token')">Copy</button>
                        </div>

                        <div class="lk-ig__row">
                            <input v-model="form.verify_token" class="lk-input" maxlength="80" />
                            <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" :disabled="saving" @click="save">Save</button>
                        </div>

                        <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" style="margin-top: 10px" @click="rotate">
                            Rotate verify token
                        </button>

                        <p class="lk-hint" style="margin-top: 10px">
                            Subscribe to the <strong>messages</strong> field. Inbound media is proxied to the Team Inbox.
                        </p>
                    </div>
                </section>

                <section v-if="account?.last_error" class="lk-card">
                    <div class="lk-card__body">
                        <p class="lk-label">Last error</p>
                        <p class="lk-ig__error">{{ account.last_error }}</p>
                    </div>
                </section>

                <section class="lk-card">
                    <div class="lk-card__head">
                        <h2 class="lk-card__title">Setup checklist</h2>
                    </div>
                    <div class="lk-card__body">
                        <ol class="lk-ig__steps">
                            <li>Convert the Instagram account to a professional account.</li>
                            <li>Link it to a Facebook Page you manage.</li>
                            <li>Add the Instagram product to your Meta app.</li>
                            <li>Generate a Page token with messaging permissions.</li>
                            <li>Paste the webhook URL and subscribe to <em>messages</em>.</li>
                            <li>Send a DM to the account, then open the Inbox.</li>
                        </ol>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<style scoped>
.lk-ig {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(300px, 1fr);
    gap: 16px;
    align-items: start;
}

.lk-ig__side {
    display: grid;
    gap: 16px;
}

.lk-ig__submit {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid var(--lk-border);
}

.lk-ig__copy {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--lk-surface);
    border: 1px solid var(--lk-border);
    border-radius: 8px;
    padding: 6px 8px 6px 10px;
    margin-top: 4px;
}

.lk-ig__copy code {
    flex: 1;
    font-size: 11px;
    color: var(--lk-text-secondary);
    word-break: break-all;
}

.lk-ig__row {
    display: flex;
    gap: 6px;
    margin-top: 8px;
}

.lk-ig__error {
    margin: 4px 0 0;
    font-size: 12px;
    color: #dc2626;
    word-break: break-word;
}

.lk-ig__steps {
    margin: 0;
    padding-left: 18px;
    font-size: 12.5px;
    line-height: 1.7;
    color: var(--lk-text-secondary);
}

.lk-field--inline {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    font-size: 12.5px;
    color: var(--lk-text-secondary);
    align-self: auto;
    padding-bottom: 0;
}

@media (max-width: 1023.98px) {
    .lk-ig {
        grid-template-columns: minmax(0, 1fr);
    }
}
</style>
