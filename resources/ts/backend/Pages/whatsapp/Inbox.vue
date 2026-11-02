<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import CrmService, { type CrmConversation, type CrmMessage } from '../../Services/Crm/CrmService';

const toast = inject<Ref<any>>('toast', ref(null));
const router = useRouter();

const loading = ref(true);
const error = ref('');
const conversations = ref<CrmConversation[]>([]);
const counts = ref({ open: 0, pending: 0, closed: 0, unread: 0 });
const assignables = ref<Array<{ id: number; name: string; email: string }>>([]);

const activeStatus = ref<'open' | 'pending' | 'closed' | 'all'>('open');
const search = ref('');
const unreadOnly = ref(false);

const activeId = ref<number | null>(null);
const conversation = ref<CrmConversation | null>(null);
const messages = ref<CrmMessage[]>([]);
const threadLoading = ref(false);
const sending = ref(false);
const replyBody = ref('');
const connected = ref(true);
const phoneNumber = ref<string | null>(null);
const scroller = ref<HTMLElement | null>(null);
const hasMore = ref(false);

let pollTimer: ReturnType<typeof setInterval> | null = null;

const filtered = computed(() => conversations.value);
const activeContact = computed(() => conversation.value?.contact ?? null);
const tabs = computed(() => [
    { key: 'open', label: 'Open', count: counts.value.open },
    { key: 'pending', label: 'Pending', count: counts.value.pending },
    { key: 'closed', label: 'Closed', count: counts.value.closed },
    { key: 'all', label: 'All', count: -1 },
]);

function setTab(key: string) {
    activeStatus.value = key as typeof activeStatus.value;
}

function relative(value?: string | null): string {
    if (!value) return '';
    const date = new Date(value);
    const diff = Date.now() - date.getTime();
    const minutes = Math.round(diff / 60000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (minutes < 1440) return `${Math.round(minutes / 60)}h`;
    if (minutes < 10080) return `${Math.round(minutes / 1440)}d`;

    return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' }).format(date);
}

function clock(value?: string | null): string {
    if (!value) return '';
    return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}

function dayLabel(value?: string | null): string {
    if (!value) return '';
    const date = new Date(value);
    const today = new Date();
    const yesterday = new Date(Date.now() - 86400000);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

function initials(name?: string | null): string {
    return (name ?? '?')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
}

function statusClass(status: string): string {
    return status === 'open' ? 'is-open' : status === 'pending' ? 'is-pending' : 'is-closed';
}

function messageGroups(): Array<{ day: string; messages: CrmMessage[] }> {
    const groups: Array<{ day: string; messages: CrmMessage[] }> = [];

    for (const message of messages.value) {
        const day = dayLabel(message.created_at);

        if (!groups.length || groups[groups.length - 1].day !== day) {
            groups.push({ day, messages: [message] });
        } else {
            groups[groups.length - 1].messages.push(message);
        }
    }

    return groups;
}

async function scrollToBottom() {
    await nextTick();
    const element = scroller.value;

    if (element) {
        element.scrollTop = element.scrollHeight;
    }
}

async function loadList(silent = false) {
    if (!silent) {
        loading.value = true;
        error.value = '';
    }

    try {
        const response = await CrmService.conversations({
            status: activeStatus.value,
            search: search.value || undefined,
            unread: unreadOnly.value ? 1 : undefined,
            per_page: 50,
        });

        conversations.value = response.data.result.conversations;
        counts.value = response.data.result.counts;
        assignables.value = response.data.result.assignables;

        if (!silent && !activeId.value && conversations.value.length) {
            await selectConversation(conversations.value[0].id);
        }
    } catch (requestError: any) {
        if (!silent) {
            error.value = requestError?.response?.data?.message ?? 'We could not load conversations.';
        }
    } finally {
        loading.value = false;
    }
}

async function selectConversation(id: number) {
    activeId.value = id;
    threadLoading.value = true;

    try {
        const response = await CrmService.conversation(id);
        conversation.value = response.data.result.conversation;
        messages.value = response.data.result.messages;
        assignables.value = response.data.result.assignables;
        connected.value = response.data.result.account.connected;
        phoneNumber.value = response.data.result.account.phone_number;
        hasMore.value = messages.value.length === 60;

        await scrollToBottom();
        await CrmService.markRead(id);

        const item = conversations.value.find((entry) => entry.id === id);

        if (item) {
            counts.value.unread = Math.max(0, counts.value.unread - item.unread_count);
            item.unread_count = 0;
        }
    } catch (requestError: any) {
        toast.value?.showToast(requestError?.response?.status ?? 500, 'Could not open conversation', {
            message: requestError?.response?.data?.message ?? 'Try again in a moment.',
        });
    } finally {
        threadLoading.value = false;
    }
}

async function refreshThread(silent = true) {
    if (!activeId.value) return;

    try {
        const response = await CrmService.conversation(activeId.value);
        const incoming = response.data.result.messages;

        if (incoming.length !== messages.value.length) {
            messages.value = incoming;
            conversation.value = response.data.result.conversation;
            await scrollToBottom();
            await CrmService.markRead(activeId.value);
        }
    } catch {
        // Polling failures stay silent.
    }

    if (silent) {
        await loadList(true);
    }
}

async function loadOlder() {
    if (!activeId.value || !messages.value.length) return;

    const first = messages.value[0];
    const response = await CrmService.olderMessages(activeId.value, first.id);
    messages.value = [...response.data.result.messages, ...messages.value];
    hasMore.value = response.data.result.has_more;

    await nextTick();
    if (scroller.value) scroller.value.scrollTop = 120;
}

async function send() {
    const body = replyBody.value.trim();

    if (!body || !activeId.value || sending.value) return;

    sending.value = true;

    try {
        const response = await CrmService.reply(activeId.value, body);
        messages.value.push(response.data.result.message);
        replyBody.value = '';
        await scrollToBottom();
        await loadList(true);
    } catch (requestError: any) {
        toast.value?.showToast(requestError?.response?.status ?? 500, 'Message not sent', {
            message: requestError?.response?.data?.message ?? 'Check your WhatsApp connection.',
        });
    } finally {
        sending.value = false;
    }
}

async function setStatus(status: string) {
    if (!conversation.value) return;

    try {
        const response = await CrmService.updateConversation(conversation.value.id, { status });
        conversation.value = response.data.result.conversation;
        toast.value?.showToast(200, `Conversation ${status}`);
        await loadList(true);
    } catch {
        toast.value?.showToast(500, 'Could not update conversation');
    }
}

async function setAssignee(event: Event) {
    if (!conversation.value) return;
    const value = (event.target as HTMLSelectElement).value;

    try {
        const response = await CrmService.updateConversation(conversation.value.id, {
            assigned_to: value ? Number(value) : null,
        });
        conversation.value = response.data.result.conversation;
        toast.value?.showToast(200, value ? 'Conversation assigned' : 'Conversation unassigned');
    } catch {
        toast.value?.showToast(500, 'Could not assign conversation');
    }
}

function onComposerKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        void send();
    }
}

watch(activeStatus, () => {
    activeId.value = null;
    conversation.value = null;
    messages.value = [];
    void loadList();
});

let searchTimer: ReturnType<typeof setTimeout> | null = null;
watch(search, () => {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => void loadList(), 350);
});

watch(unreadOnly, () => void loadList());

onMounted(async () => {
    await loadList();
    pollTimer = setInterval(() => void refreshThread(true), 12000);
});

onBeforeUnmount(() => {
    if (pollTimer) clearInterval(pollTimer);
    if (searchTimer) clearTimeout(searchTimer);
});
</script>

<template>
    <div class="lk-inbox">
        <header class="lk-page-head">
            <div>
                <h1 class="lk-page-title">Inbox</h1>
                <p class="lk-page-subtitle">Every WhatsApp conversation in one shared team inbox.</p>
            </div>
            <div class="lk-page-actions">
                <span class="lk-badge" :class="connected ? 'lk-badge--success' : 'lk-badge--warning'">
                    {{ connected ? 'Connected' : 'Not connected' }}
                </span>
                <router-link :to="{ name: 'whatsapp-settings' }" class="lk-btn lk-btn--secondary lk-btn--sm">
                    WhatsApp settings
                </router-link>
            </div>
        </header>

        <div v-if="!connected" class="lk-inline-note lk-inline-note--warning" role="status">
            WhatsApp is not connected yet. Messages you send are still recorded, but nothing leaves the app.
            <router-link :to="{ name: 'whatsapp-settings' }" class="lk-inline-note__link">Connect a number</router-link>
        </div>

        <section class="lk-inbox__shell">
            <aside class="lk-inbox__list">
                <div class="lk-inbox__list-head">
                    <div class="lk-inbox__tabs" role="tablist" aria-label="Conversation status">
                        <button
                            v-for="tab in tabs"
                            :key="tab.key"
                            type="button"
                            role="tab"
                            :aria-selected="activeStatus === tab.key"
                            :class="{ 'is-active': activeStatus === tab.key }"
                            @click="setTab(tab.key)"
                        >
                            {{ tab.label }}
                            <span v-if="tab.count >= 0" class="lk-inbox__tab-count">{{ tab.count }}</span>
                        </button>
                    </div>

                    <input v-model="search" type="search" class="lk-input lk-input--sm" placeholder="Search name or number…" />

                    <label class="lk-inbox__filter">
                        <input v-model="unreadOnly" type="checkbox" />
                        <span>Unread only ({{ counts.unread }})</span>
                    </label>
                </div>

                <div v-if="loading" class="lk-inbox__skeletons">
                    <span v-for="n in 5" :key="n" class="lk-skeleton" style="height: 58px; margin: 10px 12px"></span>
                </div>

                <div v-else-if="error" class="lk-state lk-state--error">
                    <p class="lk-state__title">Inbox unavailable</p>
                    <p class="lk-state__text">{{ error }}</p>
                </div>

                <div v-else-if="!filtered.length" class="lk-state">
                    <p class="lk-state__title">No conversations</p>
                    <p class="lk-state__text">New WhatsApp messages will appear here automatically.</p>
                </div>

                <ul v-else class="lk-inbox__items">
                    <li v-for="item in filtered" :key="item.id">
                        <button
                            type="button"
                            class="lk-inbox__item"
                            :class="{ 'is-active': activeId === item.id }"
                            @click="selectConversation(item.id)"
                        >
                            <span class="lk-avatar lk-avatar--sm">{{ initials(item.contact?.name) }}</span>
                            <span class="lk-inbox__item-main">
                                <span class="lk-inbox__item-top">
                                    <strong>{{ item.contact?.name ?? item.contact?.display_phone }}</strong>
                                    <small>{{ relative(item.last_message_at) }}</small>
                                </span>
                                <span class="lk-inbox__item-bottom">
                                    <span class="lk-inbox__preview">{{ item.last_message_preview ?? 'No messages yet' }}</span>
                                    <span v-if="item.unread_count" class="lk-inbox__unread">{{ item.unread_count }}</span>
                                </span>
                                <span class="lk-inbox__item-meta">
                                    <span class="lk-dot" :class="statusClass(item.status)"></span>
                                    {{ item.status }}
                                    <template v-if="item.assignee"> · {{ item.assignee.name }}</template>
                                </span>
                            </span>
                        </button>
                    </li>
                </ul>
            </aside>

            <main class="lk-inbox__thread">
                <template v-if="conversation">
                    <header class="lk-inbox__thread-head">
                        <div class="lk-inbox__thread-who">
                            <span class="lk-avatar">{{ initials(activeContact?.name) }}</span>
                            <div>
                                <strong>{{ activeContact?.name }}</strong>
                                <p class="lk-muted">
                                    {{ activeContact?.display_phone }}
                                    <template v-if="activeContact?.company"> · {{ activeContact.company }}</template>
                                </p>
                            </div>
                        </div>
                        <div class="lk-inbox__thread-actions">
                            <select class="lk-select lk-select--sm" :value="conversation.assigned_to ?? ''" @change="setAssignee">
                                <option value="">Unassigned</option>
                                <option v-for="person in assignables" :key="person.id" :value="person.id">
                                    {{ person.name }}
                                </option>
                            </select>
                            <button
                                v-if="conversation.status !== 'closed'"
                                type="button"
                                class="lk-btn lk-btn--ghost lk-btn--sm"
                                @click="setStatus('closed')"
                            >
                                Close
                            </button>
                            <button
                                v-else
                                type="button"
                                class="lk-btn lk-btn--secondary lk-btn--sm"
                                @click="setStatus('open')"
                            >
                                Reopen
                            </button>
                        </div>
                    </header>

                    <div ref="scroller" class="lk-inbox__messages">
                        <div v-if="hasMore" class="lk-inbox__more">
                            <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" @click="loadOlder">
                                Load earlier messages
                            </button>
                        </div>

                        <div v-for="group in messageGroups()" :key="group.day" class="lk-inbox__group">
                            <p class="lk-inbox__day">{{ group.day }}</p>

                            <div
                                v-for="message in group.messages"
                                :key="message.id"
                                class="lk-bubble"
                                :class="message.direction === 'in' ? 'lk-bubble--in' : 'lk-bubble--out'"
                            >
                                <p class="lk-bubble__body">{{ message.body }}</p>
                                <p class="lk-bubble__meta">
                                    <span v-if="message.agent">{{ message.agent.name }} · </span>
                                    <span v-if="message.template_name" class="lk-badge lk-badge--neutral">template</span>
                                    {{ clock(message.created_at) }}
                                    <span v-if="message.direction === 'out'" class="lk-bubble__status">
                                        {{ message.status === 'failed' ? 'failed' : message.status }}
                                    </span>
                                </p>
                                <p v-if="message.error" class="lk-bubble__error">{{ message.error }}</p>
                            </div>
                        </div>

                        <p v-if="!messages.length" class="lk-inbox__empty">No messages in this conversation yet.</p>
                    </div>

                    <footer class="lk-inbox__composer">
                        <textarea
                            v-model="replyBody"
                            class="lk-input lk-inbox__textarea"
                            rows="2"
                            placeholder="Write a reply…  (Enter to send, Shift+Enter for a new line)"
                            @keydown="onComposerKeydown"
                        ></textarea>
                        <button type="button" class="lk-btn lk-btn--primary" :disabled="sending || !replyBody.trim()" @click="send">
                            {{ sending ? 'Sending…' : 'Send' }}
                        </button>
                    </footer>
                </template>

                <div v-else-if="threadLoading" class="lk-inbox__placeholder">
                    <span class="lk-skeleton" style="height: 14px; width: 45%"></span>
                    <span class="lk-skeleton" style="height: 14px; width: 65%; margin-top: 10px"></span>
                </div>

                <div v-else class="lk-state lk-inbox__placeholder">
                    <p class="lk-state__title">Pick a conversation</p>
                    <p class="lk-state__text">Select a chat on the left to read and reply.</p>
                </div>
            </main>

            <aside class="lk-inbox__contact">
                <template v-if="activeContact">
                    <div class="lk-inbox__contact-head">
                        <span class="lk-avatar lk-avatar--lg">{{ initials(activeContact.name) }}</span>
                        <strong>{{ activeContact.name }}</strong>
                        <p class="lk-muted">{{ activeContact.display_phone }}</p>
                        <span class="lk-badge" :class="activeContact.status === 'customer' ? 'lk-badge--success' : 'lk-badge--neutral'">
                            {{ activeContact.status }}
                        </span>
                    </div>

                    <dl class="lk-inbox__facts">
                        <div>
                            <dt>Email</dt>
                            <dd>{{ activeContact.email ?? '—' }}</dd>
                        </div>
                        <div>
                            <dt>Company</dt>
                            <dd>{{ activeContact.company ?? '—' }}</dd>
                        </div>
                        <div>
                            <dt>Source</dt>
                            <dd style="text-transform: capitalize">{{ activeContact.source }}</dd>
                        </div>
                        <div v-if="phoneNumber">
                            <dt>Business number</dt>
                            <dd>+{{ phoneNumber }}</dd>
                        </div>
                    </dl>

                    <div class="lk-inbox__tags">
                        <p class="lk-label">Tags</p>
                        <div v-if="activeContact.tags.length" class="lk-chip-row">
                            <span
                                v-for="tag in activeContact.tags"
                                :key="tag.id"
                                class="lk-chip"
                                :style="{ '--chip-color': tag.color }"
                            >
                                {{ tag.name }}
                            </span>
                        </div>
                        <p v-else class="lk-muted">No tags yet.</p>
                    </div>

                    <p v-if="activeContact.notes" class="lk-inbox__notes">{{ activeContact.notes }}</p>

                    <router-link :to="{ name: 'crm-contacts' }" class="lk-btn lk-btn--secondary lk-btn--sm" style="margin-top: 14px">
                        Open contact
                    </router-link>
                </template>

                <p v-else class="lk-muted">Contact details appear here.</p>
            </aside>
        </section>
    </div>
</template>

<style scoped>
.lk-inbox__shell {
    display: grid;
    grid-template-columns: minmax(280px, 340px) minmax(0, 1fr) minmax(220px, 280px);
    gap: 0;
    height: calc(100vh - 210px);
    min-height: 520px;
    border: 1px solid var(--lk-border);
    border-radius: var(--lk-radius-card);
    background: var(--lk-card);
    overflow: hidden;
}

.lk-inbox__list {
    border-right: 1px solid var(--lk-border);
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.lk-inbox__list-head {
    padding: 12px;
    border-bottom: 1px solid var(--lk-border);
    display: grid;
    gap: 8px;
}

.lk-inbox__tabs {
    display: flex;
    gap: 2px;
    background: var(--lk-surface);
    border: 1px solid var(--lk-border);
    border-radius: 9px;
    padding: 3px;
}

.lk-inbox__tabs button {
    flex: 1;
    border: 0;
    background: transparent;
    border-radius: 7px;
    padding: 5px 4px;
    font-size: 11.5px;
    font-weight: 600;
    color: var(--lk-text-secondary);
    cursor: pointer;
}

.lk-inbox__tabs button.is-active {
    background: var(--lk-card);
    color: var(--lk-text);
    box-shadow: var(--lk-shadow-card);
}

.lk-inbox__tab-count {
    font-weight: 500;
    color: var(--lk-text-muted);
}

.lk-inbox__filter {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    color: var(--lk-text-secondary);
}

.lk-inbox__items {
    list-style: none;
    margin: 0;
    padding: 6px;
    overflow-y: auto;
    flex: 1;
}

.lk-inbox__item {
    width: 100%;
    display: flex;
    gap: 10px;
    text-align: left;
    padding: 10px;
    border: 0;
    background: transparent;
    border-radius: 10px;
    cursor: pointer;
}

.lk-inbox__item:hover {
    background: var(--lk-surface);
}

.lk-inbox__item.is-active {
    background: var(--lk-primary-subtle);
}

.lk-inbox__item-main {
    min-width: 0;
    flex: 1;
}

.lk-inbox__item-top,
.lk-inbox__item-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.lk-inbox__item-top strong {
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.lk-inbox__item-top small {
    color: var(--lk-text-muted);
    font-size: 10.5px;
    white-space: nowrap;
}

.lk-inbox__preview {
    font-size: 12px;
    color: var(--lk-text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.lk-inbox__unread {
    min-width: 18px;
    height: 18px;
    border-radius: 999px;
    background: var(--lk-primary);
    color: #fff;
    font-size: 10.5px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px;
}

.lk-inbox__item-meta {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 10.5px;
    color: var(--lk-text-muted);
    text-transform: capitalize;
}

.lk-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--lk-border-strong, #cbd5e1);
}

.lk-dot.is-open {
    background: #059669;
}

.lk-dot.is-pending {
    background: #f59e0b;
}

.lk-dot.is-closed {
    background: #94a3b8;
}

.lk-inbox__thread {
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.lk-inbox__thread-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--lk-border);
    flex-wrap: wrap;
}

.lk-inbox__thread-who {
    display: flex;
    align-items: center;
    gap: 10px;
}

.lk-inbox__thread-who strong {
    font-size: 14px;
}

.lk-inbox__thread-who p {
    margin: 0;
    font-size: 12px;
}

.lk-inbox__thread-actions {
    display: flex;
    gap: 8px;
    align-items: center;
}

.lk-inbox__messages {
    flex: 1;
    overflow-y: auto;
    padding: 18px 20px;
    background:
        radial-gradient(circle at 15% 20%, rgba(5, 150, 105, 0.05), transparent 40%),
        radial-gradient(circle at 85% 70%, rgba(14, 165, 233, 0.05), transparent 45%);
}

.lk-inbox__group + .lk-inbox__group {
    margin-top: 10px;
}

.lk-inbox__day {
    text-align: center;
    font-size: 10.5px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--lk-text-muted);
    margin: 8px 0 12px;
}

.lk-bubble {
    max-width: 72%;
    padding: 9px 12px;
    border-radius: 12px;
    margin-bottom: 8px;
    border: 1px solid transparent;
    width: fit-content;
    word-break: break-word;
}

.lk-bubble--in {
    background: var(--lk-card);
    border-color: var(--lk-border);
    border-bottom-left-radius: 4px;
}

.lk-bubble--out {
    background: var(--lk-primary-subtle);
    border-color: rgba(5, 150, 105, 0.18);
    margin-left: auto;
    border-bottom-right-radius: 4px;
}

.lk-bubble__body {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    color: var(--lk-text);
    white-space: pre-wrap;
}

.lk-bubble__meta {
    display: flex;
    gap: 6px;
    align-items: center;
    margin: 4px 0 0;
    font-size: 10px;
    color: var(--lk-text-muted);
}

.lk-bubble__status {
    text-transform: capitalize;
}

.lk-bubble__error {
    margin: 4px 0 0;
    font-size: 10.5px;
    color: #dc2626;
}

.lk-inbox__more {
    text-align: center;
    margin-bottom: 10px;
}

.lk-inbox__composer {
    display: flex;
    gap: 10px;
    align-items: flex-end;
    padding: 12px 16px;
    border-top: 1px solid var(--lk-border);
}

.lk-inbox__textarea {
    resize: none;
    min-height: 44px;
    max-height: 140px;
}

.lk-inbox__placeholder {
    margin: auto;
    padding: 30px;
}

.lk-inbox__contact {
    border-left: 1px solid var(--lk-border);
    padding: 18px 16px;
    overflow-y: auto;
}

.lk-inbox__contact-head {
    display: grid;
    justify-items: center;
    gap: 4px;
    text-align: center;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--lk-border);
}

.lk-inbox__contact-head p {
    margin: 0;
    font-size: 12px;
}

.lk-inbox__facts {
    display: grid;
    gap: 10px;
    margin: 16px 0;
}

.lk-inbox__facts dt {
    font-size: 10.5px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--lk-text-muted);
}

.lk-inbox__facts dd {
    margin: 2px 0 0;
    font-size: 12.5px;
    color: var(--lk-text);
    word-break: break-word;
}

.lk-inbox__tags {
    border-top: 1px solid var(--lk-border);
    padding-top: 14px;
}

.lk-chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 6px;
}

.lk-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 9px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    color: var(--chip-color, #059669);
    background: color-mix(in srgb, var(--chip-color, #059669) 12%, transparent);
}

.lk-inbox__notes {
    margin: 14px 0 0;
    font-size: 12px;
    color: var(--lk-text-secondary);
    background: var(--lk-surface);
    border-radius: 8px;
    padding: 10px;
}

.lk-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--lk-primary-subtle);
    color: var(--lk-primary-active);
    font-weight: 700;
    font-size: 13px;
    flex: 0 0 auto;
}

.lk-avatar--sm {
    width: 32px;
    height: 32px;
    font-size: 11px;
}

.lk-avatar--lg {
    width: 54px;
    height: 54px;
    font-size: 18px;
}

.lk-input--sm {
    height: 32px;
    font-size: 12px;
}

@media (max-width: 1180px) {
    .lk-inbox__shell {
        grid-template-columns: minmax(260px, 320px) minmax(0, 1fr);
    }

    .lk-inbox__contact {
        display: none;
    }
}

@media (max-width: 820px) {
    .lk-inbox__shell {
        grid-template-columns: minmax(0, 1fr);
        height: auto;
    }

    .lk-inbox__thread {
        min-height: 460px;
    }
}
</style>
