<script setup lang="ts">
import { computed, inject, nextTick, onMounted, reactive, ref, type Ref } from 'vue';
import CrmService, { type CrmTemplate } from '../../Services/Crm/CrmService';

type HeaderType = '' | 'text' | 'image' | 'video' | 'document';
type ButtonType = 'quick_reply' | 'url' | 'phone_number';

type TemplateButton = {
    type: ButtonType;
    text: string;
    url: string;
    phone_number: string;
};

const toast = inject<Ref<any>>('toast', ref(null));

const loading = ref(true);
const error = ref('');
const templates = ref<CrmTemplate[]>([]);
const categories = ref<string[]>(['marketing', 'utility', 'authentication']);
const statuses = ref<string[]>(['draft', 'pending', 'approved', 'rejected', 'paused']);
const syncing = ref(false);

const search = ref('');
const categoryFilter = ref('');
const statusFilter = ref('');
const languageFilter = ref('');
const sortBy = ref<'recent' | 'name' | 'status'>('recent');

const modalOpen = ref(false);
const saving = ref(false);
const editing = ref<CrmTemplate | null>(null);
const bodyInput = ref<HTMLTextAreaElement | null>(null);
const samples = ref<Record<string, string>>({});

const form = reactive({
    name: '',
    category: 'marketing' as CrmTemplate['category'],
    language: 'en_US',
    header_type: '' as HeaderType,
    header_text: '',
    body: 'Hi {{1}}, ',
    footer: '',
    status: 'draft' as CrmTemplate['status'],
    buttons: [] as TemplateButton[],
});

const languages = computed(() => [...new Set(templates.value.map((template) => template.language))].sort());

const filtered = computed(() => {
    const term = search.value.trim().toLowerCase();

    const rows = templates.value.filter((template) => {
        if (categoryFilter.value && template.category !== categoryFilter.value) return false;
        if (statusFilter.value && template.status !== statusFilter.value) return false;
        if (languageFilter.value && template.language !== languageFilter.value) return false;
        if (term && !`${template.name} ${template.body}`.toLowerCase().includes(term)) return false;
        return true;
    });

    if (sortBy.value === 'name') {
        rows.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy.value === 'status') {
        const order = ['approved', 'pending', 'draft', 'paused', 'rejected'];
        rows.sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status));
    }

    return rows;
});

const counts = computed(() => ({
    total: templates.value.length,
    approved: templates.value.filter((template) => template.status === 'approved').length,
    pending: templates.value.filter((template) => template.status === 'pending').length,
    drafts: templates.value.filter((template) => template.status === 'draft').length,
}));

const hasFilters = computed(
    () => Boolean(search.value || categoryFilter.value || statusFilter.value || languageFilter.value),
);

const detectedVariables = computed(() => {
    const found = [...form.body.matchAll(/{{\s*(\d+)\s*}}/g)].map((match) => Number(match[1]));
    return [...new Set(found)].filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
});

const previewBody = computed(() =>
    form.body.replace(/{{\s*(\d+)\s*}}/g, (_match, index) => {
        const value = samples.value[String(index)]?.trim();
        return value || `{{${index}}}`;
    }),
);

const canAddButton = computed(() => form.buttons.length < 3);
const variableHint = 'Insert {{1}}, {{2}} … and fill sample values to preview them.';

const headerLabels: Record<string, string> = {
    text: 'Text header',
    image: 'Image header',
    video: 'Video header',
    document: 'Document header',
};

const buttonTypeLabels: Record<ButtonType, string> = {
    quick_reply: 'Quick reply',
    url: 'Visit website',
    phone_number: 'Call phone number',
};

const languageOptions = [
    'en_US',
    'en_GB',
    'es_ES',
    'fr_FR',
    'de_DE',
    'pt_BR',
    'it_IT',
    'nl_NL',
    'ar',
    'hi',
    'ur',
    'id',
    'tr',
    'ru',
];

function emptyButton(): TemplateButton {
    return { type: 'quick_reply', text: '', url: '', phone_number: '' };
}

async function load() {
    loading.value = true;
    error.value = '';

    try {
        const response = await CrmService.templates();
        templates.value = response.data.result.templates;
        categories.value = response.data.result.categories;
        statuses.value = response.data.result.statuses;

        if (languageFilter.value && !languages.value.includes(languageFilter.value)) {
            languageFilter.value = '';
        }
    } catch (requestError: any) {
        error.value = requestError?.response?.data?.message ?? 'We could not load templates.';
    } finally {
        loading.value = false;
    }
}

function resetForm() {
    Object.assign(form, {
        name: '',
        category: 'marketing',
        language: 'en_US',
        header_type: '',
        header_text: '',
        body: 'Hi {{1}}, ',
        footer: '',
        status: 'draft',
        buttons: [],
    });
    samples.value = {};
}

function openCreate(prefill?: Partial<typeof form>) {
    editing.value = null;
    resetForm();

    if (prefill) {
        Object.assign(form, {
            ...prefill,
            buttons: (prefill.buttons ?? []).map((button) => ({ ...button })),
        });
    }

    modalOpen.value = true;
}

function openEdit(template: CrmTemplate) {
    editing.value = template;
    Object.assign(form, {
        name: template.name,
        category: template.category,
        language: template.language,
        header_type: (template.header_type ?? '') as HeaderType,
        header_text: template.header_text ?? '',
        body: template.body,
        footer: template.footer ?? '',
        status: template.status,
        buttons: (template.buttons ?? []).map((button: any) => ({
            type: (button.type ?? 'quick_reply') as ButtonType,
            text: button.text ?? '',
            url: button.url ?? '',
            phone_number: button.phone_number ?? '',
        })),
    });
    samples.value = {};
    modalOpen.value = true;
}

function copyName(base: string): string {
    let candidate = `${base}_copy`;
    let suffix = 2;

    while (templates.value.some((template) => template.name === candidate)) {
        candidate = `${base}_copy_${suffix}`;
        suffix++;
    }

    return candidate;
}

function duplicate(template: CrmTemplate) {
    openCreate({
        name: copyName(template.name),
        category: template.category,
        language: template.language,
        header_type: (template.header_type ?? '') as HeaderType,
        header_text: template.header_text ?? '',
        body: template.body,
        footer: template.footer ?? '',
        status: 'draft',
        buttons: (template.buttons ?? []).map((button: any) => ({
            type: (button.type ?? 'quick_reply') as ButtonType,
            text: button.text ?? '',
            url: button.url ?? '',
            phone_number: button.phone_number ?? '',
        })),
    });
}

function normalizeName() {
    form.name = form.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9_]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 120);
}

function insertVariable() {
    const next = detectedVariables.value.length ? Math.max(...detectedVariables.value) + 1 : 1;
    const token = `{{${next}}}`;
    const input = bodyInput.value;

    if (!input) {
        form.body += token;
        return;
    }

    const start = input.selectionStart ?? form.body.length;
    const end = input.selectionEnd ?? start;
    form.body = `${form.body.slice(0, start)}${token}${form.body.slice(end)}`;

    nextTick(() => {
        input.focus();
        input.setSelectionRange(start + token.length, start + token.length);
    });
}

function updateHeaderType() {
    if (form.header_type !== 'text') {
        form.header_text = '';
    }
}

function addButton() {
    if (!canAddButton.value) return;
    form.buttons.push(emptyButton());
}

function removeButton(index: number) {
    form.buttons.splice(index, 1);
}

function payloadButtons(): Array<Record<string, string>> {
    return form.buttons
        .filter((button) => button.text.trim())
        .map((button) => {
            const payload: Record<string, string> = {
                type: button.type,
                text: button.text.trim(),
            };

            if (button.type === 'url') payload.url = button.url.trim();
            if (button.type === 'phone_number') payload.phone_number = button.phone_number.trim();

            return payload;
        });
}

async function save() {
    normalizeName();

    if (!form.name || !form.body.trim()) {
        toast.value?.showToast(422, 'Missing details', { message: 'A template needs a name and a body.' });
        return;
    }

    if (form.buttons.some((button) => !button.text.trim())) {
        toast.value?.showToast(422, 'Button label required', { message: 'Every button needs a short label.' });
        return;
    }

    if (form.buttons.some((button) => button.type === 'url' && !button.url.trim())) {
        toast.value?.showToast(422, 'Website URL required', { message: 'Add the destination URL for the website button.' });
        return;
    }

    if (form.buttons.some((button) => button.type === 'phone_number' && !button.phone_number.trim())) {
        toast.value?.showToast(422, 'Phone number required', { message: 'Add the phone number for the call button.' });
        return;
    }

    saving.value = true;

    const payload = {
        name: form.name,
        category: form.category,
        language: form.language.trim(),
        header_type: form.header_type || null,
        header_text: form.header_type === 'text' ? form.header_text.trim() || null : null,
        body: form.body,
        footer: form.footer.trim() || null,
        status: form.status,
        buttons: payloadButtons(),
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
    if (!window.confirm(`Delete the "${template.name}" template? Campaigns using it will keep their copy.`)) return;

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
                : status === 'paused'
                    ? 'lk-badge--info'
                    : 'lk-badge--neutral';
}

function preview(text?: string | null): string {
    return (text ?? '').replace(/{{\s*(\d+)\s*}}/g, '•••');
}

function variableToken(index: number): string {
    return `{{${index}}}`;
}

function plural(count: number, singular: string, pluralForm = `${singular}s`): string {
    return `${count} ${count === 1 ? singular : pluralForm}`;
}

function cardSubtitle(template: CrmTemplate): string {
    if (template.status === 'draft') return `${template.language} · Local draft`;
    if (template.last_synced_at) return `${template.language} · Synced with Meta`;
    return `${template.language} · Meta template`;
}

function formatDate(value?: string | null): string {
    if (!value) return '';
    return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}

function clearFilters() {
    search.value = '';
    categoryFilter.value = '';
    statusFilter.value = '';
    languageFilter.value = '';
}

onMounted(() => void load());
</script>

<template>
    <div>
        <header class="lk-page-head">
            <div>
                <h1 class="lk-page-title">Message templates</h1>
                <p class="lk-page-subtitle">
                    {{ plural(counts.total, 'template') }} · {{ counts.approved }} approved · {{ plural(counts.drafts, 'draft') }}
                </p>
            </div>
            <div class="lk-page-actions">
                <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" :disabled="syncing" @click="sync">
                    {{ syncing ? 'Syncing…' : 'Sync from WhatsApp' }}
                </button>
                <button type="button" class="lk-btn lk-btn--primary lk-btn--sm" @click="openCreate()">New template</button>
            </div>
        </header>

        <section class="lk-template-stats" aria-label="Template stats">
            <span class="lk-badge lk-badge--neutral">{{ counts.total }} total</span>
            <span class="lk-badge lk-badge--success">{{ counts.approved }} approved</span>
            <span class="lk-badge lk-badge--warning">{{ counts.pending }} in review</span>
            <span class="lk-badge lk-badge--neutral">{{ plural(counts.drafts, 'draft') }}</span>
        </section>

        <div class="lk-templates__filters">
            <input
                v-model="search"
                type="search"
                class="lk-input lk-input--sm lk-templates__search"
                placeholder="Search template name or body…"
            />
            <select v-model="categoryFilter" class="lk-select lk-select--sm">
                <option value="">All categories</option>
                <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
            </select>
            <select v-model="statusFilter" class="lk-select lk-select--sm">
                <option value="">All statuses</option>
                <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
            </select>
            <select v-model="languageFilter" class="lk-select lk-select--sm">
                <option value="">All languages</option>
                <option v-for="language in languages" :key="language" :value="language">{{ language }}</option>
            </select>
            <select v-model="sortBy" class="lk-select lk-select--sm">
                <option value="recent">Newest first</option>
                <option value="name">Name A–Z</option>
                <option value="status">Status</option>
            </select>
            <button v-if="hasFilters" type="button" class="lk-btn lk-btn--ghost lk-btn--sm" @click="clearFilters">Clear</button>
        </div>

        <div v-if="loading" class="lk-templates__grid" aria-busy="true">
            <div v-for="index in 3" :key="index" class="lk-template">
                <span class="lk-skeleton" style="display: block; height: 14px; width: 45%"></span>
                <span class="lk-skeleton" style="display: block; height: 70px; margin-top: 16px"></span>
                <span class="lk-skeleton" style="display: block; height: 12px; width: 60%; margin-top: 14px"></span>
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
                <p class="lk-state__title">{{ hasFilters ? 'No templates match your filters' : 'No templates yet' }}</p>
                <p class="lk-state__text">
                    {{ hasFilters ? 'Try a different search or reset the filters.' : 'Create a template to send structured messages and run campaigns.' }}
                </p>
                <button v-if="hasFilters" type="button" class="lk-btn lk-btn--secondary lk-btn--sm" @click="clearFilters">
                    Clear filters
                </button>
                <button v-else type="button" class="lk-btn lk-btn--primary lk-btn--sm" @click="openCreate()">
                    Create template
                </button>
            </div>
        </div>

        <div v-else class="lk-templates__grid">
            <article v-for="template in filtered" :key="template.id" class="lk-template">
                <header class="lk-template__head">
                    <div class="lk-template__identity">
                        <span class="lk-template__category" :class="`is-${template.category}`">{{ template.category }}</span>
                        <h2 class="lk-template__name">{{ template.name }}</h2>
                        <p class="lk-muted">{{ cardSubtitle(template) }}</p>
                    </div>
                    <span class="lk-badge" :class="badgeClass(template.status)">{{ template.status }}</span>
                </header>

                <div class="lk-template__bubble">
                    <template v-if="template.header_type">
                        <p v-if="template.header_type === 'text' && template.header_text" class="lk-template__header">
                            {{ template.header_text }}
                        </p>
                        <div v-else class="lk-template__media">
                            <span>{{ headerLabels[template.header_type] ?? template.header_type }}</span>
                        </div>
                    </template>
                    <p class="lk-template__body">{{ preview(template.body) }}</p>
                    <p v-if="template.footer" class="lk-template__footer">{{ template.footer }}</p>
                    <div v-if="template.buttons?.length" class="lk-template__buttons">
                        <span v-for="(button, index) in template.buttons" :key="index" class="lk-template__button">
                            {{ button.text || 'Button' }}
                        </span>
                    </div>
                </div>

                <p class="lk-template__meta">
                    {{ template.variable_count }} variable{{ template.variable_count === 1 ? '' : 's' }}
                    <template v-if="template.last_synced_at"> · synced {{ formatDate(template.last_synced_at) }}</template>
                    <template v-else> · created {{ formatDate(template.created_at) }}</template>
                </p>

                <footer class="lk-template__foot">
                    <div class="lk-template__actions">
                        <button type="button" class="lk-btn lk-btn--secondary lk-btn--sm" @click="openEdit(template)">Edit</button>
                        <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" @click="duplicate(template)">Duplicate</button>
                    </div>
                    <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" @click="remove(template)">Delete</button>
                </footer>
            </article>
        </div>

        <div v-if="modalOpen" class="lk-modal" role="dialog" aria-modal="true" aria-label="Template editor">
            <div class="lk-modal__backdrop" @click="modalOpen = false"></div>
            <div class="lk-modal__panel lk-template-editor">
                <header class="lk-modal__head">
                    <div>
                        <h2 class="lk-card__title">{{ editing ? 'Edit template' : 'New template' }}</h2>
                        <p class="lk-card__meta">Design the message exactly as customers will receive it.</p>
                    </div>
                    <button type="button" class="lk-modal__close" aria-label="Close" @click="modalOpen = false">×</button>
                </header>

                <div class="lk-template-editor__grid">
                    <form class="lk-modal__body lk-template-editor__form" @submit.prevent="save">
                        <div class="lk-form-grid">
                            <label class="lk-field">
                                <span class="lk-label">Template name</span>
                                <input
                                    v-model="form.name"
                                    class="lk-input"
                                    required
                                    maxlength="120"
                                    placeholder="order_update"
                                    @blur="normalizeName"
                                />
                                <span class="lk-hint">Lowercase letters, numbers and underscores only.</span>
                            </label>
                            <label class="lk-field">
                                <span class="lk-label">Category</span>
                                <select v-model="form.category" class="lk-select">
                                    <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
                                </select>
                            </label>
                            <label class="lk-field">
                                <span class="lk-label">Language</span>
                                <input v-model="form.language" class="lk-input" list="template-languages" required maxlength="16" placeholder="en_US" />
                                <datalist id="template-languages">
                                    <option v-for="language in languageOptions" :key="language" :value="language"></option>
                                </datalist>
                            </label>
                            <label class="lk-field">
                                <span class="lk-label">Status</span>
                                <select v-model="form.status" class="lk-select">
                                    <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
                                </select>
                            </label>
                        </div>

                        <div class="lk-form-grid" style="margin-top: 10px">
                            <label class="lk-field">
                                <span class="lk-label">Header type</span>
                                <select v-model="form.header_type" class="lk-select" @change="updateHeaderType">
                                    <option value="">No header</option>
                                    <option value="text">Text</option>
                                    <option value="image">Image</option>
                                    <option value="video">Video</option>
                                    <option value="document">Document</option>
                                </select>
                            </label>
                            <label v-if="form.header_type === 'text'" class="lk-field">
                                <span class="lk-label">Header text</span>
                                <input v-model="form.header_text" class="lk-input" maxlength="60" placeholder="Order update" />
                            </label>
                            <div v-else-if="form.header_type" class="lk-field">
                                <span class="lk-label">Media header</span>
                                <p class="lk-hint" style="margin: 0">
                                    Upload the {{ form.header_type }} when you send the campaign. WhatsApp does not store it in the template.
                                </p>
                            </div>
                            <label class="lk-field">
                                <span class="lk-label">Footer (optional)</span>
                                <input v-model="form.footer" class="lk-input" maxlength="60" placeholder="Reply STOP to opt out" />
                            </label>
                        </div>

                        <label class="lk-field" style="margin-top: 12px">
                            <span class="lk-label">
                                Body
                                <span class="lk-counter">{{ form.body.length }} / 1024</span>
                            </span>
                            <textarea
                                ref="bodyInput"
                                v-model="form.body"
                                class="lk-input"
                                rows="5"
                                required
                                maxlength="1024"
                            ></textarea>
                            <span class="lk-hint">
                                {{ variableHint }}
                                <button type="button" class="lk-inline-link" @click="insertVariable">Insert next variable</button>
                            </span>
                        </label>

                        <section class="lk-template-editor__buttons">
                            <div class="lk-template-editor__section-head">
                                <div>
                                    <p class="lk-label" style="margin: 0">Buttons</p>
                                    <p class="lk-hint" style="margin: 2px 0 0">Up to 3 quick replies, links or call buttons.</p>
                                </div>
                                <button type="button" class="lk-btn lk-btn--secondary lk-btn--sm" :disabled="!canAddButton" @click="addButton">
                                    Add button
                                </button>
                            </div>

                            <p v-if="!form.buttons.length" class="lk-template-editor__empty">No buttons — the message will only contain text.</p>

                            <div v-for="(button, index) in form.buttons" :key="index" class="lk-template-editor__button-row">
                                <select v-model="button.type" class="lk-select lk-select--sm">
                                    <option value="quick_reply">Quick reply</option>
                                    <option value="url">Website</option>
                                    <option value="phone_number">Call</option>
                                </select>
                                <input v-model="button.text" class="lk-input lk-input--sm" maxlength="25" placeholder="Button label" />
                                <input
                                    v-if="button.type === 'url'"
                                    v-model="button.url"
                                    class="lk-input lk-input--sm"
                                    maxlength="2048"
                                    placeholder="https://example.com"
                                />
                                <input
                                    v-else-if="button.type === 'phone_number'"
                                    v-model="button.phone_number"
                                    class="lk-input lk-input--sm"
                                    maxlength="32"
                                    placeholder="+14155550123"
                                />
                                <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" @click="removeButton(index)">Remove</button>
                            </div>
                        </section>

                        <footer class="lk-modal__footer">
                            <button type="button" class="lk-btn lk-btn--ghost" @click="modalOpen = false">Cancel</button>
                            <button type="submit" class="lk-btn lk-btn--primary" :disabled="saving">
                                {{ saving ? 'Saving…' : editing ? 'Save template' : 'Create template' }}
                            </button>
                        </footer>
                    </form>

                    <aside class="lk-template-editor__preview">
                        <p class="lk-label">Live preview</p>
                        <div class="lk-wa-preview">
                            <div class="lk-wa-preview__bubble">
                                <template v-if="form.header_type">
                                    <p v-if="form.header_type === 'text' && form.header_text" class="lk-wa-preview__header">
                                        {{ form.header_text }}
                                    </p>
                                    <div v-else class="lk-wa-preview__media">{{ headerLabels[form.header_type] ?? form.header_type }}</div>
                                </template>

                                <p class="lk-wa-preview__body">{{ previewBody || 'Your message body will appear here.' }}</p>
                                <p v-if="form.footer" class="lk-wa-preview__footer">{{ form.footer }}</p>
                                <p class="lk-wa-preview__time">
                                    {{ new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }} ✓✓
                                </p>

                                <div v-if="form.buttons.length" class="lk-wa-preview__buttons">
                                    <span v-for="(button, index) in form.buttons" :key="index">
                                        {{ button.text || buttonTypeLabels[button.type] }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="lk-template-editor__samples">
                            <p class="lk-label" style="margin: 0 0 2px">Sample variables</p>
                            <p class="lk-hint" style="margin: 0 0 8px">Preview how real values look in the message.</p>
                            <p v-if="!detectedVariables.length" class="lk-template-editor__empty">
                                Add {{ variableToken(1) }} to the body to use variables.
                            </p>
                            <label v-for="variable in detectedVariables" :key="variable" class="lk-field">
                                <span class="lk-label">{{ variableToken(variable) }}</span>
                                <input v-model="samples[String(variable)]" class="lk-input lk-input--sm" :placeholder="`Sample value ${variable}`" />
                            </label>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.lk-template-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
}

.lk-templates__filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    margin-bottom: 14px;
}

.lk-templates__filters .lk-select {
    width: 160px;
}

.lk-templates__search {
    width: min(280px, 100%);
}

.lk-templates__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
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

.lk-template__identity {
    min-width: 0;
}

.lk-template__category {
    display: inline-block;
    margin-bottom: 4px;
    padding: 1px 7px;
    border-radius: 999px;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    background: var(--lk-primary-subtle);
    color: var(--lk-primary-active);
}

.lk-template__category.is-utility {
    background: color-mix(in srgb, #0ea5e9 14%, transparent);
    color: #0369a1;
}

.lk-template__category.is-authentication {
    background: color-mix(in srgb, #f59e0b 16%, transparent);
    color: #b45309;
}

.lk-template__name {
    margin: 0 0 2px;
    font-size: 14px;
    font-weight: 700;
    color: var(--lk-text);
    word-break: break-word;
}

.lk-template__bubble {
    margin: 14px 0 10px;
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

.lk-template__media {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 54px;
    margin-bottom: 8px;
    border-radius: 8px;
    border: 1px dashed var(--lk-border);
    background: var(--lk-card);
    color: var(--lk-text-muted);
    font-size: 11px;
    font-weight: 600;
    text-transform: capitalize;
}

.lk-template__body {
    margin: 0;
    font-size: 12.5px;
    line-height: 1.55;
    color: var(--lk-text-secondary);
    white-space: pre-wrap;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.lk-template__footer {
    margin: 8px 0 0;
    font-size: 11px;
    color: var(--lk-text-muted);
}

.lk-template__buttons {
    display: grid;
    gap: 4px;
    margin-top: 10px;
}

.lk-template__button {
    padding: 6px 8px;
    border-radius: 7px;
    border: 1px solid var(--lk-border);
    background: var(--lk-card);
    color: var(--lk-primary);
    font-size: 11.5px;
    font-weight: 600;
    text-align: center;
}

.lk-template__meta {
    margin: 0 0 10px;
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

.lk-template__actions {
    display: flex;
    gap: 4px;
}

.lk-muted {
    color: var(--lk-text-muted);
    font-size: 11.5px;
    margin: 0;
}

.lk-counter {
    float: right;
    font-weight: 500;
    color: var(--lk-text-muted);
    font-size: 10.5px;
    letter-spacing: 0;
    text-transform: none;
}

.lk-inline-link {
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--lk-primary);
    font: inherit;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
}

.lk-modal {
    position: fixed;
    inset: 0;
    z-index: 1900;
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

.lk-template-editor {
    width: min(960px, 100%);
    max-height: 92vh;
}

.lk-modal__head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 1px solid var(--lk-border);
}

.lk-modal__close {
    border: 0;
    background: transparent;
    font-size: 20px;
    line-height: 1;
    color: var(--lk-text-muted);
    cursor: pointer;
}

.lk-modal__body {
    padding: 18px 20px;
}

.lk-template-editor__grid {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.9fr);
}

.lk-template-editor__preview {
    padding: 18px;
    border-left: 1px solid var(--lk-border);
    background: var(--lk-surface);
    display: grid;
    align-content: start;
    gap: 10px;
}

.lk-template-editor__samples {
    display: grid;
    gap: 8px;
    margin-top: 4px;
}

.lk-template-editor__buttons {
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid var(--lk-border);
}

.lk-template-editor__section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 10px;
}

.lk-template-editor__empty {
    margin: 0;
    font-size: 11.5px;
    color: var(--lk-text-muted);
}

.lk-template-editor__button-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
    margin-bottom: 6px;
}

.lk-template-editor__button-row .lk-select {
    flex: none;
    width: 128px;
}

.lk-template-editor__button-row .lk-input {
    flex: 1 1 180px;
    min-width: 0;
}

.lk-template-editor__button-row .lk-btn {
    flex: none;
    margin-left: auto;
}

.lk-wa-preview {
    border-radius: 12px;
    padding: 14px 12px;
    background:
        radial-gradient(circle at 18% 22%, rgba(5, 150, 105, 0.08) 0 18%, transparent 19%),
        radial-gradient(circle at 78% 72%, rgba(5, 150, 105, 0.07) 0 16%, transparent 17%),
        #e8e2d8;
    border: 1px solid color-mix(in srgb, #25d366 18%, var(--lk-border));
}

.lk-wa-preview__bubble {
    max-width: 100%;
    padding: 9px 11px 6px;
    border-radius: 10px 10px 10px 3px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(15, 23, 42, 0.12);
}

.lk-wa-preview__header {
    margin: 0 0 5px;
    font-size: 12.5px;
    font-weight: 700;
    color: #111827;
}

.lk-wa-preview__media {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    margin-bottom: 6px;
    border-radius: 6px;
    background: #f1f5f9;
    color: #64748b;
    font-size: 11px;
    font-weight: 600;
    text-transform: capitalize;
}

.lk-wa-preview__body {
    margin: 0;
    font-size: 12.5px;
    line-height: 1.5;
    color: #1f2937;
    white-space: pre-wrap;
    word-break: break-word;
}

.lk-wa-preview__footer {
    margin: 6px 0 0;
    font-size: 10.5px;
    color: #6b7280;
}

.lk-wa-preview__time {
    margin: 4px 0 0;
    font-size: 9.5px;
    color: #6b7280;
    text-align: right;
}

.lk-wa-preview__buttons {
    display: grid;
    gap: 4px;
    margin-top: 8px;
    padding-top: 6px;
    border-top: 1px solid #e5e7eb;
}

.lk-wa-preview__buttons span {
    padding: 5px 8px;
    border-radius: 6px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    color: #0f766e;
    font-size: 11.5px;
    font-weight: 600;
    text-align: center;
}

.lk-template-editor__preview .lk-label {
    color: #334155;
}

.lk-template-editor__preview .lk-hint {
    color: #64748b;
}

@media (max-width: 860px) {
    .lk-template-editor__grid {
        grid-template-columns: minmax(0, 1fr);
    }

    .lk-template-editor__preview {
        border-left: 0;
        border-top: 1px solid var(--lk-border);
    }

    .lk-template-editor__button-row {
        grid-template-columns: minmax(0, 1fr);
    }
}

@media (max-width: 560px) {
    .lk-templates__filters .lk-select,
    .lk-templates__search {
        width: 100%;
    }
}
</style>
