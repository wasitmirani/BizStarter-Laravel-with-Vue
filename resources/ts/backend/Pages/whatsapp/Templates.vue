<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref, type Ref } from 'vue';
import CrmService, { type CrmTemplate } from '../../Services/Crm/CrmService';

const toast = inject<Ref<any>>('toast', ref(null));

const loading = ref(true);
const error = ref('');
const templates = ref<CrmTemplate[]>([]);
const categories = ref<string[]>(['marketing', 'utility', 'authentication']);
const statuses = ref<string[]>(['draft', 'pending', 'approved', 'rejected', 'paused']);
const syncing = ref(false);

const categoryFilter = ref('');
const statusFilter = ref('');

const modalOpen = ref(false);
const saving = ref(false);
const editing = ref<CrmTemplate | null>(null);

const form = reactive({
    name: '',
    category: 'marketing' as CrmTemplate['category'],
    language: 'en_US',
    header_type: '',
    header_text: '',
    body: 'Hi {{1}}, ',
    footer: '',
    status: 'draft' as CrmTemplate['status'],
});

const filtered = computed(() =>
    templates.value.filter(
        (template) =>
            (!categoryFilter.value || template.category === categoryFilter.value) &&
            (!statusFilter.value || template.status === statusFilter.value)
    )
);

const counts = computed(() => ({
    total: templates.value.length,
    approved: templates.value.filter((template) => template.status === 'approved').length,
    drafts: templates.value.filter((template) => template.status === 'draft').length,
}));

const variableHint = 'Use {{1}}, {{2}} … for variables filled per contact.';

async function load() {
    loading.value = true;
    error.value = '';

    try {
        const response = await CrmService.templates();
        templates.value = response.data.result.templates;
        categories.value = response.data.result.categories;
        statuses.value = response.data.result.statuses;
    } catch (requestError: any) {
        error.value = requestError?.response?.data?.message ?? 'We could not load templates.';
    } finally {
        loading.value = false;
    }
}

function openCreate() {
    editing.value = null;
    Object.assign(form, {
        name: '',
        category: 'marketing',
        language: 'en_US',
        header_type: '',
        header_text: '',
        body: 'Hi {{1}}, ',
        footer: '',
        status: 'draft',
    });
    modalOpen.value = true;
}

function openEdit(template: CrmTemplate) {
    editing.value = template;
    Object.assign(form, {
        name: template.name,
        category: template.category,
        language: template.language,
        header_type: template.header_type ?? '',
        header_text: template.header_text ?? '',
        body: template.body,
        footer: template.footer ?? '',
        status: template.status,
    });
    modalOpen.value = true;
}

async function save() {
    if (!form.name.trim() || !form.body.trim()) return;
    saving.value = true;

    const payload = {
        name: form.name.trim(),
        category: form.category,
        language: form.language,
        header_type: form.header_type || null,
        header_text: form.header_text.trim() || null,
        body: form.body,
        footer: form.footer.trim() || null,
        status: form.status,
    };

    try {
        if (editing.value) {
            await CrmService.updateTemplate(editing.value.id, payload);
            toast.value?.showToast(200, 'Template updated');
        } else {
            await CrmService.createTemplate(payload);
            toast.value?.showToast(201, 'Template created');
        }

        modalOpen.value = false;
        await load();
    } catch (requestError: any) {
        toast.value?.showToast(requestError?.response?.status ?? 500, 'Could not save template', {
            message: requestError?.response?.data?.message ?? 'Use lowercase letters, numbers and underscores for the name.',
        });
    } finally {
        saving.value = false;
    }
}

async function remove(template: CrmTemplate) {
    if (!window.confirm(`Delete the "${template.name}" template?`)) return;

    try {
        await CrmService.deleteTemplate(template.id);
        toast.value?.showToast(200, 'Template deleted');
        await load();
    } catch {
        toast.value?.showToast(500, 'Could not delete template');
    }
}

async function sync() {
    syncing.value = true;

    try {
        const response = await CrmService.syncTemplates();
        const result = response.data.result;
        toast.value?.showToast(200, 'Templates synced', {
            message: `${result.created} new, ${result.updated} updated from WhatsApp.`,
        });
        await load();
    } catch (requestError: any) {
        toast.value?.showToast(requestError?.response?.status ?? 500, 'Sync failed', {
            message: requestError?.response?.data?.result?.error ?? 'Connect WhatsApp and add a business account ID first.',
        });
    } finally {
        syncing.value = false;
    }
}

function badgeClass(status: string): string {
    return status === 'approved'
        ? 'lk-badge--success'
        : status === 'rejected'
          ? 'lk-badge--error'
          : status === 'pending'
            ? 'lk-badge--warning'
            : 'lk-badge--neutral';
}

function preview(text?: string | null): string {
    return (text ?? '').replace(/{{\s*(\d+)\s*}}/g, '•••');
}

onMounted(() => void load());
</script>

<template>
    <div>
        <header class="lk-page-head">
            <div>
                <h1 class="lk-page-title">Message templates</h1>
                <p class="lk-page-subtitle">
                    {{ counts.total }} templates · {{ counts.approved }} approved · {{ counts.drafts }} drafts
                </p>
            </div>
            <div class="lk-page-actions">
                <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" :disabled="syncing" @click="sync">
                    {{ syncing ? 'Syncing…' : 'Sync from WhatsApp' }}
                </button>
                <button type="button" class="lk-btn lk-btn--primary lk-btn--sm" @click="openCreate">New template</button>
            </div>
        </header>

        <div class="lk-templates__filters">
            <select v-model="categoryFilter" class="lk-select lk-select--sm">
                <option value="">All categories</option>
                <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
            </select>
            <select v-model="statusFilter" class="lk-select lk-select--sm">
                <option value="">All statuses</option>
                <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
            </select>
        </div>

        <div v-if="loading" class="lk-card">
            <div class="lk-card__body">
                <span class="lk-skeleton" style="display: block; height: 12px; width: 50%"></span>
                <span class="lk-skeleton" style="display: block; height: 12px; width: 70%; margin-top: 10px"></span>
            </div>
        </div>

        <div v-else-if="error" class="lk-card">
            <div class="lk-state lk-state--error">
                <p class="lk-state__title">Templates unavailable</p>
                <p class="lk-state__text">{{ error }}</p>
                <button type="button" class="lk-btn lk-btn--secondary lk-btn--sm" @click="load">Try again</button>
            </div>
        </div>

        <div v-else-if="!filtered.length" class="lk-card">
            <div class="lk-state">
                <p class="lk-state__title">No templates</p>
                <p class="lk-state__text">Create a template to send structured messages and run campaigns.</p>
                <button type="button" class="lk-btn lk-btn--primary lk-btn--sm" @click="openCreate">Create template</button>
            </div>
        </div>

        <div v-else class="lk-templates__grid">
            <article v-for="template in filtered" :key="template.id" class="lk-template">
                <header class="lk-template__head">
                    <div>
                        <h2 class="lk-template__name">{{ template.name }}</h2>
                        <p class="lk-muted">{{ template.category }} · {{ template.language }}</p>
                    </div>
                    <span class="lk-badge" :class="badgeClass(template.status)">{{ template.status }}</span>
                </header>

                <div class="lk-template__bubble">
                    <p v-if="template.header_text" class="lk-template__header">{{ template.header_text }}</p>
                    <p class="lk-template__body">{{ preview(template.body) }}</p>
                    <p v-if="template.footer" class="lk-template__footer">{{ template.footer }}</p>
                </div>

                <footer class="lk-template__foot">
                    <span class="lk-muted">
                        {{ template.variable_count }} variable{{ template.variable_count === 1 ? '' : 's' }}
                        <template v-if="template.last_synced_at"> · synced</template>
                    </span>
                    <div>
                        <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" @click="openEdit(template)">Edit</button>
                        <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" @click="remove(template)">Delete</button>
                    </div>
                </footer>
            </article>
        </div>

        <div v-if="modalOpen" class="lk-modal" role="dialog" aria-modal="true">
            <div class="lk-modal__backdrop" @click="modalOpen = false"></div>
            <div class="lk-modal__panel">
                <header class="lk-modal__head">
                    <h2 class="lk-card__title">{{ editing ? 'Edit template' : 'New template' }}</h2>
                    <button type="button" class="lk-modal__close" aria-label="Close" @click="modalOpen = false">×</button>
                </header>

                <form class="lk-modal__body" @submit.prevent="save">
                    <div class="lk-form-grid">
                        <label class="lk-field">
                            <span class="lk-label">Template name</span>
                            <input v-model="form.name" class="lk-input" required maxlength="120" placeholder="order_update" />
                        </label>
                        <label class="lk-field">
                            <span class="lk-label">Category</span>
                            <select v-model="form.category" class="lk-select">
                                <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
                            </select>
                        </label>
                        <label class="lk-field">
                            <span class="lk-label">Language</span>
                            <input v-model="form.language" class="lk-input" required maxlength="16" placeholder="en_US" />
                        </label>
                        <label class="lk-field">
                            <span class="lk-label">Status</span>
                            <select v-model="form.status" class="lk-select">
                                <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
                            </select>
                        </label>
                        <label class="lk-field">
                            <span class="lk-label">Header (optional)</span>
                            <input v-model="form.header_text" class="lk-input" maxlength="255" />
                        </label>
                        <label class="lk-field">
                            <span class="lk-label">Footer (optional)</span>
                            <input v-model="form.footer" class="lk-input" maxlength="255" />
                        </label>
                    </div>

                    <label class="lk-field" style="margin-top: 12px">
                        <span class="lk-label">Body</span>
                        <textarea v-model="form.body" class="lk-input" rows="5" required maxlength="1024"></textarea>
                        <span class="lk-hint">{{ variableHint }}</span>
                    </label>

                    <footer class="lk-modal__footer">
                        <button type="button" class="lk-btn lk-btn--ghost" @click="modalOpen = false">Cancel</button>
                        <button type="submit" class="lk-btn lk-btn--primary" :disabled="saving">
                            {{ saving ? 'Saving…' : editing ? 'Save template' : 'Create template' }}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.lk-templates__filters {
    display: flex;
    gap: 10px;
    margin-bottom: 14px;
}

.lk-templates__filters .lk-select {
    width: 180px;
}

.lk-templates__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 14px;
}

.lk-template {
    display: flex;
    flex-direction: column;
    background: var(--lk-card);
    border: 1px solid var(--lk-border);
    border-radius: var(--lk-radius-card);
    box-shadow: var(--lk-shadow-card);
    padding: 16px;
}

.lk-template__head {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: flex-start;
}

.lk-template__name {
    margin: 0 0 2px;
    font-size: 14px;
    font-weight: 700;
    color: var(--lk-text);
    word-break: break-word;
}

.lk-template__bubble {
    margin: 14px 0;
    padding: 12px;
    border-radius: 10px;
    background: var(--lk-surface);
    border: 1px solid var(--lk-border);
}

.lk-template__header {
    margin: 0 0 6px;
    font-size: 12.5px;
    font-weight: 700;
    color: var(--lk-text);
}

.lk-template__body {
    margin: 0;
    font-size: 12.5px;
    line-height: 1.55;
    color: var(--lk-text-secondary);
    white-space: pre-wrap;
}

.lk-template__footer {
    margin: 8px 0 0;
    font-size: 11px;
    color: var(--lk-text-muted);
}

.lk-template__foot {
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid var(--lk-border);
}

.lk-muted {
    color: var(--lk-text-muted);
    font-size: 11.5px;
    margin: 0;
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
    width: min(640px, 100%);
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
