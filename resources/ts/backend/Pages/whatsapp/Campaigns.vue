<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref, type Ref } from 'vue';
import CrmService, { type CrmCampaign, type CrmTag, type CrmTemplate } from '../../Services/Crm/CrmService';

const toast = inject<Ref<any>>('toast', ref(null));

const loading = ref(true);
const error = ref('');
const campaigns = ref<CrmCampaign[]>([]);
const templates = ref<CrmTemplate[]>([]);
const tags = ref<CrmTag[]>([]);
const stats = ref({ total: 0, sent: 0, drafts: 0, scheduled: 0, messages_sent: 0 });
const statusFilter = ref('');
const sendingId = ref<number | null>(null);

const modalOpen = ref(false);
const saving = ref(false);
const editing = ref<CrmCampaign | null>(null);
const preview = ref<{ total: number; sample: Array<{ id: number; name: string; phone: string }> } | null>(null);

const form = reactive({
    name: '',
    template_id: '' as number | '',
    message_body: '',
    audience_tag_id: '' as number | '',
    scheduled_at: '',
});

const filtered = computed(() =>
    statusFilter.value ? campaigns.value.filter((campaign) => campaign.status === statusFilter.value) : campaigns.value
);

function formatDate(value?: string | null): string {
    if (!value) return '—';
    return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}

function formatDateTime(value?: string | null): string {
    if (!value) return '—';
    return new Intl.DateTimeFormat(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
}

function toLocalInput(value?: string | null): string {
    if (!value) return '';
    const date = new Date(value);
    const pad = (part: number) => String(part).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const minSchedule = computed(() => toLocalInput(new Date(Date.now() + 60_000).toISOString()));

function badgeClass(status: string): string {
    return status === 'sent'
        ? 'lk-badge--success'
        : status === 'failed'
          ? 'lk-badge--error'
          : status === 'sending' || status === 'scheduled'
            ? 'lk-badge--warning'
            : 'lk-badge--neutral';
}

async function load() {
    loading.value = true;
    error.value = '';

    try {
        const response = await CrmService.campaigns({ status: statusFilter.value || undefined });
        campaigns.value = response.data.result.campaigns;
        templates.value = response.data.result.templates;
        tags.value = response.data.result.tags;
        stats.value = response.data.result.stats;
    } catch (requestError: any) {
        error.value = requestError?.response?.data?.message ?? 'We could not load campaigns.';
    } finally {
        loading.value = false;
    }
}

function openCreate() {
    editing.value = null;
    preview.value = null;
    Object.assign(form, { name: '', template_id: '', message_body: '', audience_tag_id: '', scheduled_at: '' });
    modalOpen.value = true;
}

function openEdit(campaign: CrmCampaign) {
    editing.value = campaign;
    preview.value = { total: campaign.total_recipients, sample: [] };
    Object.assign(form, {
        name: campaign.name,
        template_id: campaign.template?.id ?? '',
        message_body: campaign.message_body ?? '',
        audience_tag_id: campaign.audience_tag?.id ?? '',
        scheduled_at: toLocalInput(campaign.scheduled_at),
    });
    modalOpen.value = true;
}

async function save() {
    if (!form.name.trim()) return;
    saving.value = true;

    const payload = {
        name: form.name.trim(),
        template_id: form.template_id || null,
        message_body: form.message_body.trim() || null,
        audience_tag_id: form.audience_tag_id || null,
        scheduled_at: form.scheduled_at ? new Date(form.scheduled_at).toISOString() : null,
    };

    try {
        if (editing.value) {
            const response = await CrmService.updateCampaign(editing.value.id, payload);
            preview.value = response.data.result.preview;
            toast.value?.showToast(200, 'Campaign updated');
        } else {
            const response = await CrmService.createCampaign(payload);
            preview.value = response.data.result.preview;
            toast.value?.showToast(201, 'Campaign created');
        }

        modalOpen.value = false;
        await load();
    } catch (requestError: any) {
        toast.value?.showToast(requestError?.response?.status ?? 500, 'Could not save campaign', {
            message: requestError?.response?.data?.message ?? 'Check the fields and try again.',
        });
    } finally {
        saving.value = false;
    }
}

async function send(campaign: CrmCampaign) {
    if (!window.confirm(`Send "${campaign.name}" now? This messages every eligible recipient.`)) return;
    sendingId.value = campaign.id;

    try {
        const response = await CrmService.sendCampaign(campaign.id);
        const result = response.data.result.result;
        toast.value?.showToast(result.sent > 0 ? 200 : 422, result.sent > 0 ? 'Campaign sent' : 'Campaign failed', {
            message: `${result.sent} sent, ${result.failed} failed of ${result.total}.`,
        });
        await load();
    } catch (requestError: any) {
        toast.value?.showToast(requestError?.response?.status ?? 500, 'Campaign not sent', {
            message: requestError?.response?.data?.result?.error ?? requestError?.response?.data?.message ?? 'Connect WhatsApp first.',
        });
    } finally {
        sendingId.value = null;
    }
}

async function remove(campaign: CrmCampaign) {
    if (!window.confirm(`Delete "${campaign.name}"?`)) return;

    try {
        await CrmService.deleteCampaign(campaign.id);
        toast.value?.showToast(200, 'Campaign deleted');
        await load();
    } catch {
        toast.value?.showToast(500, 'Could not delete campaign');
    }
}

onMounted(() => void load());
</script>

<template>
    <div>
        <header class="lk-page-head">
            <div>
                <h1 class="lk-page-title">Campaigns</h1>
                <p class="lk-page-subtitle">Send approved templates to tagged contact segments.</p>
            </div>
            <div class="lk-page-actions">
                <select v-model="statusFilter" class="lk-select lk-select--sm" style="width: 160px" @change="load">
                    <option value="">All statuses</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="sent">Sent</option>
                    <option value="failed">Failed</option>
                </select>
                <button type="button" class="lk-btn lk-btn--primary lk-btn--sm" @click="openCreate">New campaign</button>
            </div>
        </header>

        <section class="lk-kpi-grid lk-kpi-grid--five" aria-label="Campaign statistics">
            <article class="lk-kpi">
                <p class="lk-kpi__label">Campaigns</p>
                <p class="lk-kpi__value">{{ stats.total }}</p>
            </article>
            <article class="lk-kpi">
                <p class="lk-kpi__label">Scheduled</p>
                <p class="lk-kpi__value">{{ stats.scheduled }}</p>
            </article>
            <article class="lk-kpi">
                <p class="lk-kpi__label">Sent</p>
                <p class="lk-kpi__value">{{ stats.sent }}</p>
            </article>
            <article class="lk-kpi">
                <p class="lk-kpi__label">Drafts</p>
                <p class="lk-kpi__value">{{ stats.drafts }}</p>
            </article>
            <article class="lk-kpi">
                <p class="lk-kpi__label">Messages sent</p>
                <p class="lk-kpi__value">{{ stats.messages_sent }}</p>
            </article>
        </section>

        <div v-if="loading" class="lk-card">
            <div class="lk-card__body">
                <span class="lk-skeleton" style="display: block; height: 12px; width: 50%"></span>
                <span class="lk-skeleton" style="display: block; height: 12px; width: 70%; margin-top: 10px"></span>
            </div>
        </div>

        <div v-else-if="error" class="lk-card">
            <div class="lk-state lk-state--error">
                <p class="lk-state__title">Campaigns unavailable</p>
                <p class="lk-state__text">{{ error }}</p>
                <button type="button" class="lk-btn lk-btn--secondary lk-btn--sm" @click="load">Try again</button>
            </div>
        </div>

        <div v-else-if="!filtered.length" class="lk-card">
            <div class="lk-state">
                <p class="lk-state__title">No campaigns yet</p>
                <p class="lk-state__text">Create a campaign to broadcast an approved template to a segment.</p>
                <button type="button" class="lk-btn lk-btn--primary lk-btn--sm" @click="openCreate">Create campaign</button>
            </div>
        </div>

        <div v-else class="lk-card">
            <div class="lk-table-wrap">
                <table class="lk-table">
                    <thead>
                        <tr>
                            <th>Campaign</th>
                            <th>Audience</th>
                            <th>Status</th>
                            <th>Recipients</th>
                            <th>Delivery</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="campaign in filtered" :key="campaign.id">
                            <td>
                                <strong>{{ campaign.name }}</strong>
                                <p class="lk-muted">
                                    {{ campaign.template?.name ?? 'Custom message' }}
                                    <template v-if="campaign.sent_at"> · {{ formatDate(campaign.sent_at) }}</template>
                                </p>
                            </td>
                            <td>
                                <span class="lk-chip" v-if="campaign.audience_tag" :style="{ '--chip-color': campaign.audience_tag.color }">
                                    {{ campaign.audience_tag.name }}
                                </span>
                                <span v-else class="lk-muted">All opted-in</span>
                            </td>
                            <td>
                                <span class="lk-badge" :class="badgeClass(campaign.status)">{{ campaign.status }}</span>
                                <p v-if="campaign.status === 'scheduled' && campaign.scheduled_at" class="lk-muted lk-nowrap">
                                    {{ formatDateTime(campaign.scheduled_at) }}
                                </p>
                                <p v-if="campaign.status === 'failed' && campaign.error" class="lk-muted lk-muted--error" :title="campaign.error">
                                    {{ campaign.error }}
                                </p>
                            </td>
                            <td class="lk-nowrap">
                                {{ campaign.sent_count }} / {{ campaign.total_recipients }}
                                <p v-if="campaign.failed_count" class="lk-muted">{{ campaign.failed_count }} failed</p>
                            </td>
                            <td class="lk-nowrap">{{ campaign.delivery_rate }}%</td>
                            <td class="lk-campaign-actions">
                                <button
                                    v-if="['draft', 'failed', 'scheduled'].includes(campaign.status)"
                                    type="button"
                                    class="lk-btn lk-btn--secondary lk-btn--sm"
                                    :disabled="sendingId === campaign.id"
                                    @click="send(campaign)"
                                >
                                    {{ sendingId === campaign.id ? 'Sending…' : campaign.status === 'scheduled' ? 'Send now' : 'Send' }}
                                </button>
                                <button
                                    v-if="['draft', 'failed', 'scheduled'].includes(campaign.status)"
                                    type="button"
                                    class="lk-btn lk-btn--ghost lk-btn--sm"
                                    @click="openEdit(campaign)"
                                >
                                    Edit
                                </button>
                                <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" @click="remove(campaign)">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-if="modalOpen" class="lk-modal" role="dialog" aria-modal="true">
            <div class="lk-modal__backdrop" @click="modalOpen = false"></div>
            <div class="lk-modal__panel">
                <header class="lk-modal__head">
                    <h2 class="lk-card__title">{{ editing ? 'Edit campaign' : 'New campaign' }}</h2>
                    <button type="button" class="lk-modal__close" aria-label="Close" @click="modalOpen = false">×</button>
                </header>

                <form class="lk-modal__body" @submit.prevent="save">
                    <label class="lk-field">
                        <span class="lk-label">Campaign name</span>
                        <input v-model="form.name" class="lk-input" required maxlength="120" placeholder="Spring offer" />
                    </label>

                    <div class="lk-form-grid" style="margin-top: 12px">
                        <label class="lk-field">
                            <span class="lk-label">Template</span>
                            <select v-model="form.template_id" class="lk-select">
                                <option value="">Custom text (no template)</option>
                                <option v-for="template in templates" :key="template.id" :value="template.id">
                                    {{ template.name }} ({{ template.status }})
                                </option>
                            </select>
                        </label>
                        <label class="lk-field">
                            <span class="lk-label">Audience tag</span>
                            <select v-model="form.audience_tag_id" class="lk-select">
                                <option value="">All opted-in contacts</option>
                                <option v-for="tag in tags" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
                            </select>
                        </label>
                    </div>

                    <label v-if="!form.template_id" class="lk-field" style="margin-top: 12px">
                        <span class="lk-label">Message</span>
                        <textarea v-model="form.message_body" class="lk-input" rows="4" maxlength="4096" placeholder="Write the message to send…"></textarea>
                    </label>

                    <label class="lk-field" style="margin-top: 12px">
                        <span class="lk-label">Schedule (optional)</span>
                        <input
                            v-model="form.scheduled_at"
                            type="datetime-local"
                            class="lk-input"
                            :min="minSchedule"
                        />
                        <span class="lk-hint">Leave empty to save a draft. Scheduled campaigns send automatically within a minute of the chosen time.</span>
                    </label>

                    <p v-if="preview" class="lk-inline-note" style="margin-top: 14px">
                        <strong>{{ preview.total }}</strong> contacts match this audience.
                        <template v-if="preview.sample.length">
                            Sample: {{ preview.sample.map((contact) => contact.name).join(', ') }}.
                        </template>
                    </p>

                    <p class="lk-hint" style="margin-top: 8px">
                        Sending uses your connected WhatsApp number. Templates must be approved by Meta.
                    </p>

                    <footer class="lk-modal__footer">
                        <button type="button" class="lk-btn lk-btn--ghost" @click="modalOpen = false">Cancel</button>
                        <button type="submit" class="lk-btn lk-btn--primary" :disabled="saving">
                            {{ saving ? 'Saving…' : editing ? 'Save campaign' : 'Create campaign' }}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.lk-kpi-grid {
    margin-bottom: 16px;
}

.lk-nowrap {
    white-space: nowrap;
}

.lk-campaign-actions {
    text-align: right;
    white-space: nowrap;
}

.lk-muted {
    margin: 2px 0 0;
    color: var(--lk-text-muted);
    font-size: 11.5px;
}

.lk-muted--error {
    max-width: 220px;
    color: var(--lk-error);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.lk-chip {
    display: inline-flex;
    align-items: center;
    padding: 3px 9px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    color: var(--chip-color, #059669);
    background: color-mix(in srgb, var(--chip-color, #059669) 13%, transparent);
}

.lk-modal {
    position: fixed;
    inset: 0;
    z-index: 60;
    display: grid;
    place-items: center;
    padding: 18px;
}

.lk-modal__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(15, 23, 42, 0.45);
}

.lk-modal__panel {
    position: relative;
    width: min(620px, 100%);
    max-height: 90vh;
    overflow-y: auto;
    background: var(--lk-card);
    border-radius: var(--lk-radius-card);
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.25);
}

.lk-modal__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--lk-border);
}

.lk-modal__close {
    border: 0;
    background: transparent;
    font-size: 20px;
    color: var(--lk-text-muted);
    cursor: pointer;
}

.lk-modal__body {
    padding: 18px 20px;
}

.lk-modal__footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 18px;
    padding-top: 14px;
    border-top: 1px solid var(--lk-border);
}
</style>
