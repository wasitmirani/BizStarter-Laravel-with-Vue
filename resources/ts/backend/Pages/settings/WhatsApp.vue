<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref, type Ref } from 'vue';
import CrmService, { type WhatsAppAccount } from '../../Services/Crm/CrmService';

const toast = inject<Ref<any>>('toast', ref(null));

const loading = ref(true);
const error = ref('');
const saving = ref(false);
const testing = ref(false);

const account = ref<WhatsAppAccount | null>(null);
const webhookUrl = ref('');
const configured = ref(false);

const form = reactive({
    name: '',
    phone_number: '',
    phone_number_id: '',
    business_account_id: '',
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

function apply(next: WhatsAppAccount) {
    account.value = next;
    configured.value = next.configured;
    Object.assign(form, {
        name: next.name ?? '',
        phone_number: next.phone_number ?? '',
        phone_number_id: next.phone_number_id ?? '',
        business_account_id: next.business_account_id ?? '',
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
        const response = await CrmService.whatsapp();
        apply(response.data.result.account);
        webhookUrl.value = response.data.result.webhook_url;
    } catch (requestError: any) {
        error.value = requestError?.response?.data?.message ?? 'We could not load WhatsApp settings.';
    } finally {
        loading.value = false;
    }
}

async function save() {
    saving.value = true;

    try {
        const response = await CrmService.saveWhatsApp({
            name: form.name || null,
            phone_number: form.phone_number || null,
            phone_number_id: form.phone_number_id || null,
            business_account_id: form.business_account_id || null,
            access_token: form.access_token || null,
            verify_token: form.verify_token || null,
            api_version: form.api_version || null,
            is_active: form.is_active,
        });
        apply(response.data.result.account);
        toast.value?.showToast(200, 'WhatsApp settings saved', { message: 'Credentials are stored encrypted.' });
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
        const response = await CrmService.testWhatsApp();
        apply(response.data.result.account);
        toast.value?.showToast(200, 'Connection successful', { message: 'Meta accepted the credentials.' });
    } catch (requestError: any) {
        toast.value?.showToast(requestError?.response?.status ?? 500, 'Connection failed', {
            message: requestError?.response?.data?.result?.error ?? 'Check the phone number ID and access token.',
        });
    } finally {
        testing.value = false;
    }
}

async function rotate() {
    if (!window.confirm('Rotate the verify token? Update it in the Meta dashboard afterwards.')) return;

    try {
        const response = await CrmService.rotateVerifyToken();
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
                <h1 class="lk-page-title">WhatsApp</h1>
                <p class="lk-page-subtitle">Connect the official WhatsApp Business Cloud API to your workspace.</p>
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
                <p class="lk-state__title">WhatsApp settings unavailable</p>
                <p class="lk-state__text">{{ error }}</p>
                <button type="button" class="lk-btn lk-btn--secondary lk-btn--sm" @click="load">Try again</button>
            </div>
        </div>

        <div v-else class="lk-wa">
            <section class="lk-card">
                <div class="lk-card__head">
                    <div>
                        <h2 class="lk-card__title">Meta credentials</h2>
                        <p class="lk-card__meta">Stored encrypted per workspace</p>
                    </div>
                    <span v-if="account?.has_token" class="lk-badge lk-badge--neutral">{{ account.token_preview }}</span>
                </div>

                <form class="lk-card__body" @submit.prevent="save">
                    <div class="lk-form-grid">
                        <label class="lk-field">
                            <span class="lk-label">Account label</span>
                            <input v-model="form.name" class="lk-input" maxlength="80" placeholder="Support line" />
                        </label>
                        <label class="lk-field">
                            <span class="lk-label">Display phone number</span>
                            <input v-model="form.phone_number" class="lk-input" maxlength="32" placeholder="14155550123" />
                        </label>
                        <label class="lk-field">
                            <span class="lk-label">Phone number ID</span>
                            <input v-model="form.phone_number_id" class="lk-input" maxlength="64" placeholder="109876543210987" />
                        </label>
                        <label class="lk-field">
                            <span class="lk-label">WhatsApp Business account ID</span>
                            <input v-model="form.business_account_id" class="lk-input" maxlength="64" placeholder="102290129340398" />
                        </label>
                        <label class="lk-field">
                            <span class="lk-label">API version</span>
                            <input v-model="form.api_version" class="lk-input" maxlength="16" placeholder="v21.0" />
                        </label>
                        <label class="lk-field lk-field--inline">
                            <input v-model="form.is_active" type="checkbox" />
                            <span>Account is active</span>
                        </label>
                    </div>

                    <label class="lk-field" style="margin-top: 12px">
                        <span class="lk-label">Permanent access token</span>
                        <input
                            v-model="form.access_token"
                            type="password"
                            class="lk-input"
                            autocomplete="new-password"
                            :placeholder="account?.has_token ? 'Leave blank to keep the current token' : 'EAAG…'"
                        />
                        <span class="lk-hint">Create a System User token with whatsapp_business_messaging and whatsapp_business_management.</span>
                    </label>

                    <div class="lk-wa__submit">
                        <button type="submit" class="lk-btn lk-btn--primary" :disabled="saving">
                            {{ saving ? 'Saving…' : 'Save credentials' }}
                        </button>
                    </div>
                </form>
            </section>

            <div class="lk-wa__side">
                <section class="lk-card">
                    <div class="lk-card__head">
                        <div>
                            <h2 class="lk-card__title">Webhook</h2>
                            <p class="lk-card__meta">Paste this into the Meta app dashboard</p>
                        </div>
                    </div>
                    <div class="lk-card__body">
                        <p class="lk-label">Callback URL</p>
                        <div class="lk-wa__copy">
                            <code>{{ webhookUrl }}</code>
                            <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" @click="copy(webhookUrl, 'Webhook URL')">Copy</button>
                        </div>

                        <p class="lk-label" style="margin-top: 12px">Verify token</p>
                        <div class="lk-wa__copy">
                            <code>{{ form.verify_token }}</code>
                            <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" @click="copy(form.verify_token, 'Verify token')">Copy</button>
                        </div>

                        <div class="lk-wa__row">
                            <input v-model="form.verify_token" class="lk-input" maxlength="80" />
                            <button
                                type="button"
                                class="lk-btn lk-btn--ghost lk-btn--sm"
                                :disabled="saving"
                                @click="save"
                            >
                                Save
                            </button>
                        </div>

                        <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" style="margin-top: 10px" @click="rotate">
                            Rotate verify token
                        </button>

                        <p class="lk-hint" style="margin-top: 10px">
                            Subscribe to the <strong>messages</strong> field. Delivery and read receipts are applied automatically.
                        </p>
                    </div>
                </section>

                <section v-if="account?.last_error" class="lk-card">
                    <div class="lk-card__body">
                        <p class="lk-label">Last error</p>
                        <p class="lk-wa__error">{{ account.last_error }}</p>
                    </div>
                </section>

                <section class="lk-card">
                    <div class="lk-card__head">
                        <h2 class="lk-card__title">Setup checklist</h2>
                    </div>
                    <div class="lk-card__body">
                        <ol class="lk-wa__steps">
                            <li>Create a Meta app with the WhatsApp product.</li>
                            <li>Add a phone number and copy its <em>phone number ID</em>.</li>
                            <li>Create a System User with a permanent token.</li>
                            <li>Paste the webhook URL above and subscribe to messages.</li>
                            <li>Send a test message, then open the Inbox.</li>
                        </ol>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<style scoped>
.lk-wa {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(300px, 1fr);
    gap: 16px;
    align-items: start;
}

.lk-wa__side {
    display: grid;
    gap: 16px;
}

.lk-wa__submit {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid var(--lk-border);
}

.lk-wa__copy {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--lk-surface);
    border: 1px solid var(--lk-border);
    border-radius: 8px;
    padding: 6px 8px 6px 10px;
    margin-top: 4px;
}

.lk-wa__copy code {
    flex: 1;
    font-size: 11px;
    color: var(--lk-text-secondary);
    word-break: break-all;
}

.lk-wa__row {
    display: flex;
    gap: 6px;
    margin-top: 8px;
}

.lk-wa__error {
    margin: 4px 0 0;
    font-size: 12px;
    color: #dc2626;
    word-break: break-word;
}

.lk-wa__steps {
    margin: 0;
    padding-left: 18px;
    font-size: 12.5px;
    line-height: 1.7;
    color: var(--lk-text-secondary);
}

.lk-field--inline {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    color: var(--lk-text-secondary);
    align-self: end;
    padding-bottom: 7px;
}

@media (max-width: 1023.98px) {
    .lk-wa {
        grid-template-columns: minmax(0, 1fr);
    }
}
</style>
