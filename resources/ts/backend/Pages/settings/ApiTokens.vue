<script setup lang="ts">
import { inject, onMounted, reactive, ref, type Ref } from 'vue';
import TokenService, { type ApiToken } from '../../Services/Security/TokenService';

const toast = inject<Ref<any>>('toast', ref(null));

const loading = ref(true);
const creating = ref(false);
const error = ref('');
const tokens = ref<ApiToken[]>([]);
const revealed = ref<string | null>(null);
const form = reactive({ name: '', abilities: ['*'] as string[], expires_in_days: 90 });

function formatDate(value?: string | null): string {
    if (!value) return 'Never';
    return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}

async function load() {
    loading.value = true;
    error.value = '';

    try {
        const response = await TokenService.list();
        tokens.value = response.data.result.tokens;
    } catch (requestError: any) {
        error.value = requestError?.response?.data?.message ?? 'We could not load your API tokens.';
    } finally {
        loading.value = false;
    }
}

async function create() {
    if (!form.name.trim()) return;
    creating.value = true;
    revealed.value = null;

    try {
        const response = await TokenService.create({
            name: form.name.trim(),
            abilities: form.abilities,
            expires_in_days: Number(form.expires_in_days) || null,
        });
        revealed.value = response.data.result.token;
        form.name = '';
        toast.value?.showToast(201, 'Token created', { message: 'Copy it now — it is only shown once.' });
        await load();
    } catch (requestError: any) {
        toast.value?.showToast(requestError?.response?.status ?? 500, 'Could not create token', {
            message: requestError?.response?.data?.message ?? 'Try a different name.',
        });
    } finally {
        creating.value = false;
    }
}

async function copyToken() {
    if (!revealed.value) return;

    try {
        await navigator.clipboard.writeText(revealed.value);
        toast.value?.showToast(200, 'Copied', { message: 'Token copied to your clipboard.' });
    } catch {
        toast.value?.showToast(500, 'Copy failed', { message: 'Select the token and copy it manually.' });
    }
}

async function revoke(token: ApiToken) {
    if (!window.confirm(`Revoke “${token.name}”? Applications using it will stop working.`)) return;

    try {
        await TokenService.revoke(token.id);
        toast.value?.showToast(200, 'Token revoked');
        await load();
    } catch (requestError: any) {
        toast.value?.showToast(500, 'Could not revoke token', {
            message: requestError?.response?.data?.message ?? 'Try again.',
        });
    }
}

onMounted(() => {
    void load();
});
</script>

<template>
    <div>
        <header class="lk-page-head">
            <div>
                <h1 class="lk-page-title">API tokens</h1>
                <p class="lk-page-subtitle">Personal access tokens for the LaraKit API. Treat them like passwords.</p>
            </div>
        </header>

        <div class="lk-token-grid">
            <section class="lk-card">
                <div class="lk-card__head">
                    <div>
                        <h2 class="lk-card__title">Create a token</h2>
                        <p class="lk-card__meta">Scoped access for scripts and integrations</p>
                    </div>
                </div>
                <div class="lk-card__body">
                    <form novalidate @submit.prevent="create">
                        <label class="lk-field">
                            <span class="lk-label">Token name</span>
                            <input v-model="form.name" class="lk-input" placeholder="Deploy bot" maxlength="80" required />
                        </label>
                        <div class="lk-form-grid" style="margin-top: 10px">
                            <label class="lk-field">
                                <span class="lk-label">Permission</span>
                                <select v-model="form.abilities" class="lk-select">
                                    <option :value="['*']">Full access</option>
                                    <option :value="['read']">Read only</option>
                                    <option :value="['read', 'write']">Read &amp; write</option>
                                </select>
                            </label>
                            <label class="lk-field">
                                <span class="lk-label">Expires in (days)</span>
                                <input v-model.number="form.expires_in_days" type="number" min="0" max="3650" class="lk-input" />
                            </label>
                        </div>
                        <button type="submit" class="lk-btn lk-btn--primary" style="margin-top: 12px" :disabled="creating">
                            {{ creating ? 'Creating…' : 'Create token' }}
                        </button>
                    </form>

                    <div v-if="revealed" class="lk-token-reveal" role="status">
                        <p class="lk-label">Your new token — copy it now</p>
                        <div class="lk-token-reveal__row">
                            <input class="lk-input" :value="revealed" readonly />
                            <button type="button" class="lk-btn lk-btn--secondary lk-btn--sm" @click="copyToken">Copy</button>
                        </div>
                    </div>
                </div>
            </section>

            <section class="lk-card">
                <div class="lk-card__head">
                    <div>
                        <h2 class="lk-card__title">Active tokens</h2>
                        <p class="lk-card__meta">Revoke anything you no longer use</p>
                    </div>
                    <span class="lk-badge lk-badge--neutral">{{ tokens.length }}</span>
                </div>
                <div class="lk-card__body lk-card__body--flush">
                    <div v-if="loading" class="lk-card__body">
                        <span class="lk-skeleton" style="display: block; width: 70%; height: 12px"></span>
                        <span class="lk-skeleton" style="display: block; width: 45%; height: 12px; margin-top: 10px"></span>
                    </div>
                    <div v-else-if="error" class="lk-state lk-state--error">
                        <p class="lk-state__text">{{ error }}</p>
                    </div>
                    <div v-else-if="!tokens.length" class="lk-state">
                        <p class="lk-state__title">No tokens yet</p>
                        <p class="lk-state__text">Create one when you need machine access to the API.</p>
                    </div>
                    <ul v-else class="lk-list">
                        <li v-for="token in tokens" :key="token.id" class="lk-list__row">
                            <span class="lk-list__main">
                                <span class="lk-list__title">{{ token.name }}</span>
                                <span class="lk-list__meta">
                                    {{ token.abilities.includes('*') ? 'Full access' : token.abilities.join(', ') }}
                                    · Created {{ formatDate(token.created_at) }}
                                    · Last used {{ formatDate(token.last_used_at) }}
                                </span>
                            </span>
                            <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" @click="revoke(token)">Revoke</button>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    </div>
</template>

<style scoped>
.lk-token-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr);
    gap: 16px;
    align-items: start;
}

.lk-token-reveal {
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid var(--lk-border);
}

.lk-token-reveal__row {
    display: flex;
    gap: 6px;
    margin-top: 6px;
}

.lk-token-reveal__row .lk-input {
    flex: 1;
    min-width: 0;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11.5px;
}

@media (max-width: 900px) {
    .lk-token-grid {
        grid-template-columns: minmax(0, 1fr);
    }
}
</style>
