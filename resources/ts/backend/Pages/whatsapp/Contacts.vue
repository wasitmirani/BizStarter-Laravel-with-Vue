<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref, type Ref } from 'vue';
import CrmService, { type CrmContact, type CrmTag } from '../../Services/Crm/CrmService';

const toast = inject<Ref<any>>('toast', ref(null));

const loading = ref(true);
const error = ref('');
const contacts = ref<CrmContact[]>([]);
const tags = ref<CrmTag[]>([]);
const meta = ref({ current_page: 1, last_page: 1, per_page: 15, total: 0 });

const search = ref('');
const statusFilter = ref('');
const tagFilter = ref('');
const importing = ref(false);
const exporting = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const modalOpen = ref(false);
const saving = ref(false);
const editing = ref<CrmContact | null>(null);
const tagDraft = reactive({ name: '', color: '#059669' });
const savingTag = ref(false);

const form = reactive({
    name: '',
    phone: '',
    email: '',
    company: '',
    status: 'lead' as CrmContact['status'],
    notes: '',
    opt_in: true,
    tags: [] as number[],
});

const statusOptions = [
    { value: '', label: 'All statuses' },
    { value: 'lead', label: 'Lead' },
    { value: 'customer', label: 'Customer' },
    { value: 'blocked', label: 'Blocked' },
];

const modalTitle = computed(() => (editing.value ? 'Edit contact' : 'New contact'));

function formatDate(value?: string | null): string {
    if (!value) return 'Never';
    return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}

function initials(name: string): string {
    return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('');
}

async function load(page = 1) {
    loading.value = true;
    error.value = '';

    try {
        const response = await CrmService.contacts({
            page,
            search: search.value || undefined,
            status: statusFilter.value || undefined,
            tag: tagFilter.value || undefined,
        });
        contacts.value = response.data.result.contacts;
        meta.value = response.data.result.meta;
        tags.value = response.data.result.tags;
    } catch (requestError: any) {
        error.value = requestError?.response?.data?.message ?? 'We could not load contacts.';
    } finally {
        loading.value = false;
    }
}

function openCreate() {
    editing.value = null;
    Object.assign(form, {
        name: '',
        phone: '',
        email: '',
        company: '',
        status: 'lead',
        notes: '',
        opt_in: true,
        tags: [],
    });
    modalOpen.value = true;
}

function openEdit(contact: CrmContact) {
    editing.value = contact;
    Object.assign(form, {
        name: contact.name,
        phone: contact.phone,
        email: contact.email ?? '',
        company: contact.company ?? '',
        status: contact.status,
        notes: contact.notes ?? '',
        opt_in: contact.opt_in,
        tags: contact.tags.map((tag) => tag.id),
    });
    modalOpen.value = true;
}

async function save() {
    if (!form.name.trim() || !form.phone.trim()) return;
    saving.value = true;

    const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        company: form.company.trim() || null,
        status: form.status,
        notes: form.notes.trim() || null,
        opt_in: form.opt_in,
        tags: form.tags,
    };

    try {
        if (editing.value) {
            await CrmService.updateContact(editing.value.id, payload);
            toast.value?.showToast(200, 'Contact updated');
        } else {
            await CrmService.createContact(payload);
            toast.value?.showToast(201, 'Contact created');
        }

        modalOpen.value = false;
        await load(meta.value.current_page);
    } catch (requestError: any) {
        toast.value?.showToast(requestError?.response?.status ?? 500, 'Could not save contact', {
            message: requestError?.response?.data?.message ?? 'Check the fields and try again.',
        });
    } finally {
        saving.value = false;
    }
}

async function remove(contact: CrmContact) {
    if (!window.confirm(`Delete ${contact.name}? Their conversations stay in the audit trail only if kept.`)) return;

    try {
        await CrmService.deleteContact(contact.id);
        toast.value?.showToast(200, 'Contact deleted');
        await load(meta.value.current_page);
    } catch {
        toast.value?.showToast(500, 'Could not delete contact');
    }
}

async function createTag() {
    if (!tagDraft.name.trim() || savingTag.value) return;
    savingTag.value = true;

    try {
        const response = await CrmService.createTag({ name: tagDraft.name.trim(), color: tagDraft.color });
        tags.value.push({ ...response.data.result.tag, contacts_count: 0 });
        tagDraft.name = '';
        toast.value?.showToast(201, 'Tag created');
    } catch (requestError: any) {
        toast.value?.showToast(requestError?.response?.status ?? 500, 'Could not create tag', {
            message: requestError?.response?.data?.message ?? 'That tag may already exist.',
        });
    } finally {
        savingTag.value = false;
    }
}

async function removeTag(tag: CrmTag) {
    if (!window.confirm(`Delete the tag "${tag.name}"? Contacts are kept.`)) return;

    try {
        await CrmService.deleteTag(tag.id);
        tags.value = tags.value.filter((entry) => entry.id !== tag.id);
        toast.value?.showToast(200, 'Tag deleted');
        await load(meta.value.current_page);
    } catch {
        toast.value?.showToast(500, 'Could not delete tag');
    }
}

async function onImport(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    importing.value = true;

    try {
        const response = await CrmService.importContacts(file);
        const result = response.data.result;
        toast.value?.showToast(200, 'Import complete', {
            message: `${result.created} created, ${result.updated} updated, ${result.skipped} skipped.`,
        });
        await load(1);
    } catch (requestError: any) {
        toast.value?.showToast(requestError?.response?.status ?? 500, 'Import failed', {
            message: requestError?.response?.data?.message ?? 'Use a CSV with name, phone and email columns.',
        });
    } finally {
        importing.value = false;
        if (fileInput.value) fileInput.value.value = '';
    }
}

async function exportContacts() {
    exporting.value = true;

    try {
        await CrmService.exportContacts();
    } catch {
        toast.value?.showToast(500, 'Export failed');
    } finally {
        exporting.value = false;
    }
}

function toggleTag(id: number) {
    form.tags = form.tags.includes(id) ? form.tags.filter((tag) => tag !== id) : [...form.tags, id];
}

let searchTimer: ReturnType<typeof setTimeout> | null = null;
function onSearch() {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => void load(1), 350);
}

onMounted(() => void load());
</script>

<template>
    <div>
        <header class="lk-page-head">
            <div>
                <h1 class="lk-page-title">Contacts</h1>
                <p class="lk-page-subtitle">{{ meta.total }} people in your WhatsApp CRM.</p>
            </div>
            <div class="lk-page-actions">
                <input ref="fileInput" type="file" accept=".csv,text/csv" hidden @change="onImport" />
                <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" :disabled="importing" @click="fileInput?.click()">
                    {{ importing ? 'Importing…' : 'Import CSV' }}
                </button>
                <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" :disabled="exporting" @click="exportContacts">
                    {{ exporting ? 'Exporting…' : 'Export' }}
                </button>
                <button type="button" class="lk-btn lk-btn--primary lk-btn--sm" @click="openCreate">New contact</button>
            </div>
        </header>

        <div class="lk-contacts">
            <section class="lk-card">
                <div class="lk-card__body lk-contacts__filters">
                    <input
                        v-model="search"
                        type="search"
                        class="lk-input"
                        placeholder="Search name, phone, email or company…"
                        @input="onSearch"
                    />
                    <select v-model="statusFilter" class="lk-select" @change="load(1)">
                        <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </option>
                    </select>
                    <select v-model="tagFilter" class="lk-select" @change="load(1)">
                        <option value="">All tags</option>
                        <option v-for="tag in tags" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
                    </select>
                </div>

                <div class="lk-card__body lk-card__body--flush">
                    <div v-if="loading" class="lk-card__body">
                        <span class="lk-skeleton" style="display: block; height: 12px; width: 55%"></span>
                        <span class="lk-skeleton" style="display: block; height: 12px; width: 75%; margin-top: 10px"></span>
                    </div>

                    <div v-else-if="error" class="lk-state lk-state--error">
                        <p class="lk-state__title">Contacts unavailable</p>
                        <p class="lk-state__text">{{ error }}</p>
                        <button type="button" class="lk-btn lk-btn--secondary lk-btn--sm" @click="load()">Try again</button>
                    </div>

                    <div v-else-if="!contacts.length" class="lk-state">
                        <p class="lk-state__title">No contacts yet</p>
                        <p class="lk-state__text">Add your first contact or import a CSV to get started.</p>
                    </div>

                    <div v-else class="lk-table-wrap">
                        <table class="lk-table">
                            <thead>
                                <tr>
                                    <th>Contact</th>
                                    <th>Status</th>
                                    <th>Tags</th>
                                    <th>Last message</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="contact in contacts" :key="contact.id">
                                    <td>
                                        <div class="lk-contact-cell">
                                            <span class="lk-avatar lk-avatar--sm">{{ initials(contact.name) }}</span>
                                            <div>
                                                <strong>{{ contact.name }}</strong>
                                                <p class="lk-muted">{{ contact.display_phone }}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="lk-badge" :class="contact.status === 'customer' ? 'lk-badge--success' : contact.status === 'blocked' ? 'lk-badge--error' : 'lk-badge--neutral'">
                                            {{ contact.status }}
                                        </span>
                                    </td>
                                    <td>
                                        <div v-if="contact.tags.length" class="lk-chip-row">
                                            <span
                                                v-for="tag in contact.tags"
                                                :key="tag.id"
                                                class="lk-chip"
                                                :style="{ '--chip-color': tag.color }"
                                            >
                                                {{ tag.name }}
                                            </span>
                                        </div>
                                        <span v-else class="lk-muted">—</span>
                                    </td>
                                    <td class="lk-muted">{{ formatDate(contact.last_message_at) }}</td>
                                    <td class="lk-contact-actions">
                                        <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" @click="openEdit(contact)">Edit</button>
                                        <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" @click="remove(contact)">Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div v-if="meta.last_page > 1" class="lk-card__body lk-pagination">
                    <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" :disabled="meta.current_page <= 1" @click="load(meta.current_page - 1)">
                        Previous
                    </button>
                    <span class="lk-muted">Page {{ meta.current_page }} of {{ meta.last_page }}</span>
                    <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" :disabled="meta.current_page >= meta.last_page" @click="load(meta.current_page + 1)">
                        Next
                    </button>
                </div>
            </section>

            <aside class="lk-card lk-tags-panel">
                <div class="lk-card__head">
                    <div>
                        <h2 class="lk-card__title">Tags</h2>
                        <p class="lk-card__meta">Segment contacts for campaigns</p>
                    </div>
                </div>
                <div class="lk-card__body">
                    <div class="lk-tag-list">
                        <div v-for="tag in tags" :key="tag.id" class="lk-tag-row">
                            <span class="lk-chip" :style="{ '--chip-color': tag.color }">{{ tag.name }}</span>
                            <span class="lk-muted">{{ tag.contacts_count ?? 0 }}</span>
                            <button type="button" class="lk-tag-remove" :aria-label="`Delete ${tag.name}`" @click="removeTag(tag)">×</button>
                        </div>
                        <p v-if="!tags.length" class="lk-muted">No tags yet.</p>
                    </div>

                    <form class="lk-tag-form" @submit.prevent="createTag">
                        <input v-model="tagDraft.name" class="lk-input" placeholder="New tag name" maxlength="60" />
                        <input v-model="tagDraft.color" type="color" class="lk-color-input" aria-label="Tag color" />
                        <button type="submit" class="lk-btn lk-btn--secondary lk-btn--sm" :disabled="savingTag || !tagDraft.name.trim()">
                            Add
                        </button>
                    </form>
                </div>
            </aside>
        </div>

        <div v-if="modalOpen" class="lk-modal" role="dialog" aria-modal="true" :aria-label="modalTitle">
            <div class="lk-modal__backdrop" @click="modalOpen = false"></div>
            <div class="lk-modal__panel">
                <header class="lk-modal__head">
                    <h2 class="lk-card__title">{{ modalTitle }}</h2>
                    <button type="button" class="lk-modal__close" aria-label="Close" @click="modalOpen = false">×</button>
                </header>

                <form class="lk-modal__body" @submit.prevent="save">
                    <div class="lk-form-grid">
                        <label class="lk-field">
                            <span class="lk-label">Name</span>
                            <input v-model="form.name" class="lk-input" required maxlength="120" />
                        </label>
                        <label class="lk-field">
                            <span class="lk-label">WhatsApp number</span>
                            <input v-model="form.phone" class="lk-input" required placeholder="14155550123" maxlength="32" />
                        </label>
                        <label class="lk-field">
                            <span class="lk-label">Email</span>
                            <input v-model="form.email" type="email" class="lk-input" maxlength="190" />
                        </label>
                        <label class="lk-field">
                            <span class="lk-label">Company</span>
                            <input v-model="form.company" class="lk-input" maxlength="120" />
                        </label>
                        <label class="lk-field">
                            <span class="lk-label">Status</span>
                            <select v-model="form.status" class="lk-select">
                                <option value="lead">Lead</option>
                                <option value="customer">Customer</option>
                                <option value="blocked">Blocked</option>
                            </select>
                        </label>
                        <label class="lk-field lk-field--inline">
                            <input v-model="form.opt_in" type="checkbox" />
                            <span>Opted in to marketing</span>
                        </label>
                    </div>

                    <label class="lk-field" style="margin-top: 12px">
                        <span class="lk-label">Notes</span>
                        <textarea v-model="form.notes" class="lk-input" rows="3" maxlength="2000"></textarea>
                    </label>

                    <div class="lk-field" style="margin-top: 12px">
                        <span class="lk-label">Tags</span>
                        <div class="lk-chip-row">
                            <button
                                v-for="tag in tags"
                                :key="tag.id"
                                type="button"
                                class="lk-chip lk-chip--button"
                                :class="{ 'is-selected': form.tags.includes(tag.id) }"
                                :style="{ '--chip-color': tag.color }"
                                @click="toggleTag(tag.id)"
                            >
                                {{ tag.name }}
                            </button>
                            <span v-if="!tags.length" class="lk-muted">Create a tag on the right first.</span>
                        </div>
                    </div>

                    <footer class="lk-modal__footer">
                        <button type="button" class="lk-btn lk-btn--ghost" @click="modalOpen = false">Cancel</button>
                        <button type="submit" class="lk-btn lk-btn--primary" :disabled="saving">
                            {{ saving ? 'Saving…' : editing ? 'Save contact' : 'Create contact' }}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.lk-contacts {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(240px, 280px);
    gap: 16px;
    align-items: start;
}

.lk-contacts__filters {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 160px 160px;
    gap: 10px;
    border-bottom: 1px solid var(--lk-border);
}

.lk-contact-cell {
    display: flex;
    align-items: center;
    gap: 9px;
}

.lk-contact-cell p {
    margin: 1px 0 0;
    font-size: 11.5px;
}

.lk-contact-actions {
    text-align: right;
    white-space: nowrap;
}

.lk-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: var(--lk-primary-subtle);
    color: var(--lk-primary-active);
    font-weight: 700;
    font-size: 11px;
    flex: 0 0 auto;
}

.lk-avatar--sm {
    width: 32px;
    height: 32px;
}

.lk-chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
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
    white-space: nowrap;
}

.lk-chip--button {
    border: 1px solid transparent;
    cursor: pointer;
    opacity: 0.55;
}

.lk-chip--button.is-selected {
    border-color: color-mix(in srgb, var(--chip-color, #059669) 55%, transparent);
    opacity: 1;
}

.lk-tags-panel {
    position: sticky;
    top: 16px;
}

.lk-tag-list {
    display: grid;
    gap: 8px;
}

.lk-tag-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.lk-tag-row .lk-muted {
    margin-left: auto;
    font-size: 11.5px;
}

.lk-tag-remove {
    border: 0;
    background: transparent;
    color: var(--lk-text-muted);
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
    padding: 0 2px;
}

.lk-tag-remove:hover {
    color: #dc2626;
}

.lk-tag-form {
    display: flex;
    gap: 6px;
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid var(--lk-border);
}

.lk-color-input {
    width: 34px;
    height: 34px;
    padding: 2px;
    border: 1px solid var(--lk-border);
    border-radius: 8px;
    background: var(--lk-card);
}

.lk-pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    border-top: 1px solid var(--lk-border);
}

.lk-muted {
    color: var(--lk-text-muted);
    font-size: 12px;
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

.lk-field--inline {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    color: var(--lk-text-secondary);
    align-self: end;
    padding-bottom: 7px;
}

@media (max-width: 1100px) {
    .lk-contacts {
        grid-template-columns: minmax(0, 1fr);
    }

    .lk-tags-panel {
        position: static;
    }
}

@media (max-width: 720px) {
    .lk-contacts__filters {
        grid-template-columns: minmax(0, 1fr);
    }
}
</style>
