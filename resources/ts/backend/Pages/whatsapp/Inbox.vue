<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import CrmService, { type CrmConversation, type CrmMessage } from '../../Services/Crm/CrmService';

const toast = inject<Ref<any>>('toast', ref(null));
const route = useRoute();

const loading = ref(true);
const error = ref('');
const conversations = ref<CrmConversation[]>([]);
const counts = ref({ open: 0, pending: 0, closed: 0, unread: 0, whatsapp: 0, instagram: 0 });
const assignables = ref<Array<{ id: number; name: string; email: string }>>([]);

const activeStatus = ref<'open' | 'pending' | 'closed' | 'all'>('open');
const activeChannel = ref<'all' | 'whatsapp' | 'instagram'>('all');
const assigneeFilter = ref('all');
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
const composer = ref<HTMLTextAreaElement | null>(null);
const searchInput = ref<HTMLInputElement | null>(null);
const hasMore = ref(false);
const loadingOlder = ref(false);
const atBottom = ref(true);

const chatOpen = ref(false);
const detailsOpen = ref(false);

const mediaUrls = ref<Record<number, string>>({});
const mediaLoading = ref<Record<number, boolean>>({});
const mediaErrors = ref<Record<number, string>>({});

let pollTimer: ReturnType<typeof setInterval> | null = null;
let searchTimer: ReturnType<typeof setTimeout> | null = null;

const filtered = computed(() => conversations.value);

const activeContact = computed(() => conversation.value?.contact ?? null);
const activeChannelLabel = computed(() => (conversation.value?.channel === 'instagram' ? 'Instagram' : 'WhatsApp'));
const settingsRoute = computed(() =>
    conversation.value?.channel === 'instagram' ? { name: 'instagram-settings' } : { name: 'whatsapp-settings' },
);

const hasFilters = computed(
    () =>
        Boolean(search.value) ||
        unreadOnly.value ||
        assigneeFilter.value !== 'all' ||
        activeChannel.value !== 'all' ||
        activeStatus.value !== 'open',
);

const channelTabs = computed(() => [
    { key: 'all', label: 'All', count: counts.value.whatsapp + counts.value.instagram },
    { key: 'whatsapp', label: 'WhatsApp', count: counts.value.whatsapp },
    { key: 'instagram', label: 'Instagram', count: counts.value.instagram },
]);

const tabs = computed(() => [
    { key: 'open', label: 'Open', count: counts.value.open },
    { key: 'pending', label: 'Pending', count: counts.value.pending },
    { key: 'closed', label: 'Closed', count: counts.value.closed },
    { key: 'all', label: 'All', count: -1 },
]);

const statusOptions = [
    { key: 'open', label: 'Open' },
    { key: 'pending', label: 'Pending' },
    { key: 'closed', label: 'Closed' },
] as const;

function isNarrowScreen(): boolean {
    return typeof window !== 'undefined' && window.matchMedia('(max-width: 820px)').matches;
}

function setTab(key: string) {
    activeStatus.value = key as typeof activeStatus.value;
}

function setChannel(key: string) {
    activeChannel.value = key as typeof activeChannel.value;
}

function clearFilters() {
    search.value = '';
    unreadOnly.value = false;
    assigneeFilter.value = 'all';
    activeChannel.value = 'all';
    activeStatus.value = 'open';
}

function mediaKind(message: CrmMessage): string {
    const type = (message.media?.type ?? '').toLowerCase();

    if (type === 'sticker') return 'image';
    if (type) return type;

    const mime = message.media?.mime_type ?? '';

    if (mime.startsWith('image/')) return 'image';
    if (mime.startsWith('audio/')) return 'audio';
    if (mime.startsWith('video/')) return 'video';

    return 'document';
}

function isImageMedia(message: CrmMessage): boolean {
    if (!message.media) return false;

    return mediaKind(message) === 'image' || (message.media.mime_type ?? '').startsWith('image/');
}

function mediaFileName(message: CrmMessage): string {
    return message.media?.filename ?? `attachment-${message.id}`;
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

function statusLabel(status: string): string {
    return status === 'open' ? 'Open' : status === 'pending' ? 'Pending' : 'Closed';
}

function priorityLabel(priority?: string | null): string {
    return priority === 'urgent' ? 'Urgent' : priority === 'high' ? 'High' : priority === 'low' ? 'Low' : 'Normal';
}

function shouldShowPriority(priority?: string | null): boolean {
    return priority === 'urgent' || priority === 'high';
}

function mediaCaption(message: CrmMessage): string {
    const body = (message.body ?? '').trim();

    if (!message.media) return body;

    const placeholder = `[${message.media.type.charAt(0).toUpperCase()}${message.media.type.slice(1)}]`;

    return body === placeholder ? '' : body;
}

function clearMedia() {
    Object.values(mediaUrls.value).forEach((url) => URL.revokeObjectURL(url));
    mediaUrls.value = {};
    mediaLoading.value = {};
    mediaErrors.value = {};
}

async function loadMedia(message: CrmMessage) {
    if (!message.media || mediaUrls.value[message.id] || mediaLoading.value[message.id]) return;

    if (message.media.direct_url) {
        mediaUrls.value = { ...mediaUrls.value, [message.id]: message.media.direct_url };
        return;
    }

    mediaLoading.value = { ...mediaLoading.value, [message.id]: true };
    mediaErrors.value = { ...mediaErrors.value, [message.id]: '' };

    try {
        const response = await CrmService.messageMedia(message.id);
        mediaUrls.value = { ...mediaUrls.value, [message.id]: URL.createObjectURL(response.data) };
    } catch {
        mediaErrors.value = { ...mediaErrors.value, [message.id]: 'Could not load this attachment.' };
    } finally {
        const next = { ...mediaLoading.value };
        delete next[message.id];
        mediaLoading.value = next;
    }
}

async function downloadMedia(message: CrmMessage) {
    await loadMedia(message);

    const url = mediaUrls.value[message.id];

    if (!url) return;

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = mediaFileName(message);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
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

async function scrollToBottom(smooth = false) {
    await nextTick();
    const element = scroller.value;

    if (element) {
        element.scrollTo({ top: element.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
        atBottom.value = true;
    }
}

function onScrollerScroll() {
    const element = scroller.value;

    if (!element) return;

    atBottom.value = element.scrollHeight - element.scrollTop - element.clientHeight < 90;
}

function resizeComposer() {
    const element = composer.value;

    if (!element) return;

    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, 148)}px`;
}

async function loadList(silent = false) {
    if (!silent) {
        loading.value = true;
        error.value = '';
    }

    try {
        const response = await CrmService.conversations({
            status: activeStatus.value,
            channel: activeChannel.value === 'all' ? undefined : activeChannel.value,
            assignee: assigneeFilter.value === 'all' ? undefined : assigneeFilter.value,
            search: search.value || undefined,
            unread: unreadOnly.value ? 1 : undefined,
            per_page: 50,
        });

        conversations.value = response.data.result.conversations;
        counts.value = response.data.result.counts;
        assignables.value = response.data.result.assignables;

        if (!silent && !activeId.value && conversations.value.length && !isNarrowScreen()) {
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
    conversation.value = null;
    messages.value = [];
    clearMedia();
    chatOpen.value = true;
    detailsOpen.value = false;

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
            if (item.unread_count) {
                counts.value.unread = Math.max(0, counts.value.unread - item.unread_count);
            }
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

    const element = scroller.value;
    const wasAtBottom = !element || element.scrollHeight - element.scrollTop - element.clientHeight < 90;

    try {
        const response = await CrmService.conversation(activeId.value);
        const incoming = response.data.result.messages;

        conversation.value = response.data.result.conversation;

        if (incoming.length !== messages.value.length) {
            messages.value = incoming;

            if (wasAtBottom) {
                await scrollToBottom();
            }

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
    if (!activeId.value || !messages.value.length || loadingOlder.value) return;

    const element = scroller.value;
    const previousHeight = element?.scrollHeight ?? 0;
    const previousTop = element?.scrollTop ?? 0;

    loadingOlder.value = true;

    try {
        const first = messages.value[0];
        const response = await CrmService.olderMessages(activeId.value, first.id);
        messages.value = [...response.data.result.messages, ...messages.value];
        hasMore.value = response.data.result.has_more;

        await nextTick();

        if (element) {
            element.scrollTop = element.scrollHeight - previousHeight + previousTop;
        }
    } catch {
        toast.value?.showToast(500, 'Could not load earlier messages');
    } finally {
        loadingOlder.value = false;
    }
}

async function send() {
    const body = replyBody.value.trim();

    if (!body || !activeId.value || sending.value) return;

    sending.value = true;

    try {
        const response = await CrmService.reply(activeId.value, body);
        const message = response.data.result.message;

        messages.value.push(message);
        replyBody.value = '';
        await nextTick();
        resizeComposer();
        await scrollToBottom(true);

        if (message.status === 'failed') {
            toast.value?.showToast(500, 'Message saved but not delivered', {
                message: message.error ?? 'Check the channel connection and try again.',
            });
        }

        await loadList(true);
    } catch (requestError: any) {
        toast.value?.showToast(requestError?.response?.status ?? 500, 'Message not sent', {
            message: requestError?.response?.data?.message ?? 'Check your channel connection.',
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
        toast.value?.showToast(200, `Conversation marked ${status}`);
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

async function setPriority(event: Event) {
    if (!conversation.value) return;
    const value = (event.target as HTMLSelectElement).value;

    try {
        const response = await CrmService.updateConversation(conversation.value.id, { priority: value });
        conversation.value = response.data.result.conversation;
        await loadList(true);
    } catch {
        toast.value?.showToast(500, 'Could not update priority');
    }
}

async function togglePin() {
    if (!conversation.value) return;

    try {
        const response = await CrmService.updateConversation(conversation.value.id, {
            is_pinned: !conversation.value.is_pinned,
        });
        conversation.value = response.data.result.conversation;
        toast.value?.showToast(200, conversation.value.is_pinned ? 'Conversation pinned' : 'Conversation unpinned');
        await loadList(true);
    } catch {
        toast.value?.showToast(500, 'Could not pin conversation');
    }
}

function onComposerKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        void send();
    }
}

function closeChat() {
    chatOpen.value = false;
    detailsOpen.value = false;
}

function onGlobalKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement | null;
    const typing =
        !!target &&
        (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable);

    if (event.key === '/' && !typing) {
        event.preventDefault();
        searchInput.value?.focus();
        return;
    }

    if (event.key === 'Escape') {
        if (detailsOpen.value) {
            detailsOpen.value = false;
        } else if (search.value) {
            search.value = '';
        }
    }
}

watch(activeStatus, () => {
    activeId.value = null;
    conversation.value = null;
    messages.value = [];
    chatOpen.value = false;
    void loadList();
});

watch(activeChannel, () => {
    activeId.value = null;
    conversation.value = null;
    messages.value = [];
    chatOpen.value = false;
    void loadList();
});

watch(assigneeFilter, () => void loadList());

watch(search, () => {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => void loadList(), 350);
});

watch(unreadOnly, () => void loadList());

onMounted(async () => {
    await loadList();

    const requested = Number(route.query.conversation);

    if (Number.isFinite(requested) && requested > 0) {
        await selectConversation(requested);
    }

    pollTimer = setInterval(() => void refreshThread(true), 12000);
    window.addEventListener('keydown', onGlobalKeydown);
});

watch(
    () => route.query.conversation,
    (value) => {
        const id = Number(value);

        if (Number.isFinite(id) && id > 0 && id !== activeId.value) {
            void selectConversation(id);
        }
    },
);

onBeforeUnmount(() => {
    if (pollTimer) clearInterval(pollTimer);
    if (searchTimer) clearTimeout(searchTimer);
    window.removeEventListener('keydown', onGlobalKeydown);
    clearMedia();
});
</script>

<template>
    <div class="lk-inbox" :class="{ 'lk-inbox--chat': chatOpen, 'lk-inbox--details': detailsOpen }">
        <header class="lk-inbox-hero">
            <div class="lk-inbox-hero__main">
                <p class="lk-inbox-hero__eyebrow">Shared inbox</p>
                <h1 class="lk-inbox-hero__title">Inbox</h1>
                <p class="lk-inbox-hero__sub">Every WhatsApp and Instagram conversation, handled by your whole team.</p>
                <div class="lk-inbox-hero__stats">
                    <span class="lk-inbox-hero__stat"><strong>{{ counts.open }}</strong> open</span>
                    <span class="lk-inbox-hero__stat" :class="{ 'is-alert': counts.unread > 0 }">
                        <strong>{{ counts.unread }}</strong> unread
                    </span>
                    <span class="lk-inbox-hero__stat">
                        <span class="lk-inbox-hero__dot is-whatsapp"></span>
                        <strong>{{ counts.whatsapp }}</strong> WhatsApp
                    </span>
                    <span class="lk-inbox-hero__stat">
                        <span class="lk-inbox-hero__dot is-instagram"></span>
                        <strong>{{ counts.instagram }}</strong> Instagram
                    </span>
                </div>
            </div>

            <div class="lk-inbox-hero__actions">
                <span
                    v-if="conversation"
                    class="lk-inbox-hero__connection"
                    :class="connected ? 'is-online' : 'is-offline'"
                >
                    <span class="lk-inbox-hero__dot"></span>
                    {{ activeChannelLabel }} {{ connected ? 'connected' : 'not connected' }}
                </span>
                <router-link :to="{ name: 'whatsapp-settings' }" class="lk-btn lk-btn--secondary lk-btn--sm">
                    WhatsApp settings
                </router-link>
                <router-link :to="{ name: 'instagram-settings' }" class="lk-btn lk-btn--ghost lk-btn--sm">
                    Instagram settings
                </router-link>
            </div>
        </header>

        <div v-if="conversation && !connected" class="lk-inbox__notice" role="status">
            <span class="lk-inbox__notice-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
            </span>
            <span class="lk-inbox__notice-text">
                {{ activeChannelLabel }} is not connected. Replies are saved locally but will not be delivered.
            </span>
            <router-link :to="settingsRoute" class="lk-inbox__notice-link">Connect {{ activeChannelLabel }}</router-link>
        </div>

        <section class="lk-inbox__shell">
            <aside class="lk-inbox__list">
                <div class="lk-inbox__list-head">
                    <div class="lk-inbox__channels" role="tablist" aria-label="Channel">
                        <button
                            v-for="tab in channelTabs"
                            :key="tab.key"
                            type="button"
                            role="tab"
                            :aria-selected="activeChannel === tab.key"
                            :class="[`is-${tab.key}`, { 'is-active': activeChannel === tab.key }]"
                            @click="setChannel(tab.key)"
                        >
                            <span class="lk-inbox__channel-icon" aria-hidden="true">
                                <svg v-if="tab.key === 'whatsapp'" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                                <svg v-else-if="tab.key === 'instagram'" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                            </span>
                            <span class="lk-inbox__channel-label">{{ tab.label }}</span>
                            <span class="lk-inbox__tab-count">{{ tab.count }}</span>
                        </button>
                    </div>

                    <div class="lk-inbox__search">
                        <svg class="lk-inbox__search-icon" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
                        <input
                            ref="searchInput"
                            v-model="search"
                            type="search"
                            class="lk-input lk-input--sm lk-inbox__search-input"
                            placeholder="Search name or number…"
                        />
                        <kbd v-if="!search" class="lk-inbox__search-kbd">/</kbd>
                        <button v-if="search" type="button" class="lk-inbox__search-clear" aria-label="Clear search" @click="search = ''">×</button>
                    </div>

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

                    <div class="lk-inbox__list-tools">
                        <label class="lk-inbox__assignee">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            <select v-model="assigneeFilter" aria-label="Filter by assignee">
                                <option value="all">Everyone</option>
                                <option value="me">Assigned to me</option>
                                <option value="unassigned">Unassigned</option>
                                <option v-for="person in assignables" :key="person.id" :value="String(person.id)">
                                    {{ person.name }}
                                </option>
                            </select>
                        </label>
                        <button
                            type="button"
                            class="lk-inbox__unread-toggle"
                            :class="{ 'is-active': unreadOnly }"
                            :aria-pressed="unreadOnly"
                            @click="unreadOnly = !unreadOnly"
                        >
                            <span class="lk-inbox__unread-dot" aria-hidden="true"></span>
                            Unread
                        </button>
                    </div>
                </div>

                <div v-if="loading" class="lk-inbox__skeletons">
                    <span v-for="n in 5" :key="n" class="lk-skeleton" style="height: 64px; margin: 10px 12px"></span>
                </div>

                <div v-else-if="error" class="lk-state lk-state--error">
                    <p class="lk-state__title">Inbox unavailable</p>
                    <p class="lk-state__text">{{ error }}</p>
                    <button type="button" class="lk-btn lk-btn--secondary lk-btn--sm" @click="loadList()">Try again</button>
                </div>

                <div v-else-if="!filtered.length" class="lk-inbox__empty-state">
                    <span class="lk-inbox__empty-icon" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </span>
                    <p class="lk-state__title">{{ hasFilters ? 'No conversations match' : 'No conversations yet' }}</p>
                    <p class="lk-state__text">
                        {{ hasFilters ? 'Try another channel, status or search term.' : 'New WhatsApp or Instagram messages will appear here automatically.' }}
                    </p>
                    <button v-if="hasFilters" type="button" class="lk-btn lk-btn--secondary lk-btn--sm" @click="clearFilters">
                        Clear filters
                    </button>
                </div>

                <ul v-else class="lk-inbox__items">
                    <li v-for="item in filtered" :key="item.id">
                        <button
                            type="button"
                            class="lk-inbox__item"
                            :class="{ 'is-active': activeId === item.id, 'is-unread': item.unread_count > 0 }"
                            @click="selectConversation(item.id)"
                        >
                            <span class="lk-inbox__avatar" :class="`is-${item.channel}`">
                                <span class="lk-avatar lk-avatar--sm">{{ initials(item.contact?.name) }}</span>
                                <span class="lk-inbox__avatar-channel" aria-hidden="true"></span>
                            </span>
                            <span class="lk-inbox__item-main">
                                <span class="lk-inbox__item-top">
                                    <strong>{{ item.contact?.name ?? item.contact?.display_phone ?? 'Unknown contact' }}</strong>
                                    <small>{{ relative(item.last_message_at) }}</small>
                                </span>
                                <span class="lk-inbox__item-bottom">
                                    <span class="lk-inbox__preview">{{ item.last_message_preview ?? 'No messages yet' }}</span>
                                    <span v-if="item.unread_count" class="lk-inbox__unread">{{ item.unread_count }}</span>
                                </span>
                                <span class="lk-inbox__item-meta">
                                    <span class="lk-dot" :class="statusClass(item.status)"></span>
                                    {{ statusLabel(item.status) }}
                                    <span class="lk-inbox__channel-tag" :class="`is-${item.channel}`">{{ item.channel }}</span>
                                    <span v-if="item.is_pinned" class="lk-inbox__pin" title="Pinned">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1z"/></svg>
                                    </span>
                                    <span v-if="shouldShowPriority(item.priority)" class="lk-inbox__priority">{{ priorityLabel(item.priority) }}</span>
                                    <span v-if="item.assignee" class="lk-inbox__item-assignee">{{ item.assignee.name }}</span>
                                </span>
                            </span>
                        </button>
                    </li>
                </ul>
            </aside>

            <main class="lk-inbox__thread">
                <template v-if="conversation">
                    <header class="lk-inbox__thread-head">
                        <button type="button" class="lk-inbox__back" aria-label="Back to conversations" @click="closeChat">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        </button>

                        <div class="lk-inbox__thread-who">
                            <span class="lk-avatar" :class="`is-${conversation.channel}`">{{ initials(activeContact?.name) }}</span>
                            <div class="lk-inbox__thread-identity">
                                <strong>{{ activeContact?.name ?? 'Unknown contact' }}</strong>
                                <p class="lk-muted">
                                    {{ activeContact?.display_phone || 'Instagram direct message' }}
                                    <template v-if="activeContact?.company"> · {{ activeContact.company }}</template>
                                </p>
                            </div>
                            <span class="lk-inbox__channel-pill" :class="`is-${conversation.channel}`">
                                {{ activeChannelLabel }}
                            </span>
                        </div>

                        <div class="lk-inbox__thread-actions">
                            <label class="lk-inbox__action-select" :title="conversation.assignee ? `Assigned to ${conversation.assignee.name}` : 'Unassigned'">
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                <select
                                    class="lk-inbox__assignee-select"
                                    :value="conversation.assigned_to ?? ''"
                                    aria-label="Assign conversation"
                                    @change="setAssignee"
                                >
                                    <option value="">Unassigned</option>
                                    <option v-for="person in assignables" :key="person.id" :value="person.id">
                                        {{ person.name }}
                                    </option>
                                </select>
                            </label>

                            <label class="lk-inbox__action-select lk-inbox__priority-select" title="Priority">
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/></svg>
                                <select
                                    :value="conversation.priority"
                                    aria-label="Conversation priority"
                                    @change="setPriority"
                                >
                                    <option value="low">Low</option>
                                    <option value="normal">Normal</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </label>

                            <div class="lk-inbox__status-switch" role="group" aria-label="Conversation status">
                                <button
                                    v-for="option in statusOptions"
                                    :key="option.key"
                                    type="button"
                                    :class="{ 'is-active': conversation.status === option.key }"
                                    @click="conversation.status !== option.key && setStatus(option.key)"
                                >
                                    {{ option.label }}
                                </button>
                            </div>

                            <button
                                type="button"
                                class="lk-icon-btn"
                                :class="{ 'is-active': conversation.is_pinned }"
                                :title="conversation.is_pinned ? 'Unpin conversation' : 'Pin conversation'"
                                :aria-label="conversation.is_pinned ? 'Unpin conversation' : 'Pin conversation'"
                                @click="togglePin"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1z"/></svg>
                            </button>

                            <button
                                type="button"
                                class="lk-icon-btn lk-inbox__details-toggle"
                                :class="{ 'is-active': detailsOpen }"
                                title="Contact details"
                                aria-label="Contact details"
                                @click="detailsOpen = !detailsOpen"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>
                            </button>
                        </div>
                    </header>

                    <div ref="scroller" class="lk-inbox__messages" @scroll.passive="onScrollerScroll">
                        <div v-if="hasMore" class="lk-inbox__more">
                            <button
                                type="button"
                                class="lk-btn lk-btn--ghost lk-btn--sm"
                                :disabled="loadingOlder"
                                @click="loadOlder"
                            >
                                {{ loadingOlder ? 'Loading…' : 'Load earlier messages' }}
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
                                <div v-if="message.media" class="lk-bubble__media">
                                    <template v-if="isImageMedia(message)">
                                        <img
                                            v-if="mediaUrls[message.id]"
                                            :src="mediaUrls[message.id]"
                                            :alt="message.media.filename ?? 'Attachment'"
                                            class="lk-bubble__image"
                                        />
                                        <button
                                            v-else
                                            type="button"
                                            class="lk-bubble__media-action"
                                            :disabled="mediaLoading[message.id]"
                                            @click="loadMedia(message)"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>
                                            {{ mediaLoading[message.id] ? 'Loading image…' : 'View image' }}
                                        </button>
                                    </template>

                                    <template v-else-if="mediaKind(message) === 'audio'">
                                        <audio
                                            v-if="mediaUrls[message.id]"
                                            :src="mediaUrls[message.id]"
                                            controls
                                            preload="metadata"
                                            class="lk-bubble__audio"
                                        ></audio>
                                        <button
                                            v-else
                                            type="button"
                                            class="lk-bubble__media-action"
                                            :disabled="mediaLoading[message.id]"
                                            @click="loadMedia(message)"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                                            {{ mediaLoading[message.id] ? 'Loading audio…' : 'Play audio message' }}
                                        </button>
                                    </template>

                                    <template v-else-if="mediaKind(message) === 'video'">
                                        <video
                                            v-if="mediaUrls[message.id]"
                                            :src="mediaUrls[message.id]"
                                            controls
                                            preload="metadata"
                                            class="lk-bubble__video"
                                        ></video>
                                        <button
                                            v-else
                                            type="button"
                                            class="lk-bubble__media-action"
                                            :disabled="mediaLoading[message.id]"
                                            @click="loadMedia(message)"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>
                                            {{ mediaLoading[message.id] ? 'Loading video…' : 'Play video' }}
                                        </button>
                                    </template>

                                    <template v-else>
                                        <div class="lk-bubble__file">
                                            <span class="lk-bubble__file-icon" aria-hidden="true">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                                            </span>
                                            <span class="lk-bubble__file-meta">
                                                <strong>{{ mediaFileName(message) }}</strong>
                                                <small>{{ message.media.type }}</small>
                                            </span>
                                            <button
                                                type="button"
                                                class="lk-btn lk-btn--secondary lk-btn--sm"
                                                :disabled="mediaLoading[message.id]"
                                                @click="downloadMedia(message)"
                                            >
                                                {{ mediaLoading[message.id] ? 'Loading…' : 'Download' }}
                                            </button>
                                        </div>
                                    </template>

                                    <p v-if="mediaErrors[message.id]" class="lk-bubble__error">{{ mediaErrors[message.id] }}</p>
                                </div>

                                <p v-if="mediaCaption(message)" class="lk-bubble__body">{{ mediaCaption(message) }}</p>

                                <p class="lk-bubble__meta">
                                    <span v-if="message.agent">{{ message.agent.name }} · </span>
                                    <span v-if="message.template_name" class="lk-badge lk-badge--neutral">template</span>
                                    {{ clock(message.created_at) }}
                                    <span
                                        v-if="message.direction === 'out'"
                                        class="lk-bubble__status"
                                        :class="{
                                            'is-read': message.status === 'read',
                                            'is-failed': message.status === 'failed',
                                        }"
                                        :title="`Delivery: ${message.status}`"
                                    >
                                        <template v-if="message.status === 'failed'">Not delivered</template>
                                        <template v-else-if="message.status === 'read'">✓✓ Read</template>
                                        <template v-else-if="message.status === 'delivered'">✓✓ Delivered</template>
                                        <template v-else-if="message.status === 'sent'">✓ Sent</template>
                                        <template v-else>{{ message.status }}</template>
                                    </span>
                                </p>

                                <p v-if="message.error" class="lk-bubble__error">{{ message.error }}</p>
                            </div>
                        </div>

                        <p v-if="!messages.length" class="lk-inbox__empty">No messages in this conversation yet.</p>
                    </div>

                    <button
                        v-if="!atBottom"
                        type="button"
                        class="lk-inbox__jump"
                        aria-label="Jump to latest messages"
                        @click="scrollToBottom()"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
                        Latest
                    </button>

                    <footer class="lk-inbox__composer">
                        <div class="lk-inbox__composer-box">
                            <textarea
                                ref="composer"
                                v-model="replyBody"
                                class="lk-input lk-inbox__textarea"
                                rows="1"
                                maxlength="4096"
                                :placeholder="`Reply on ${activeChannelLabel}…`"
                                @input="resizeComposer"
                                @keydown="onComposerKeydown"
                            ></textarea>
                            <div class="lk-inbox__composer-bar">
                                <span class="lk-inbox__composer-hint">
                                    <kbd>Enter</kbd> send
                                    <span class="lk-inbox__composer-sep">·</span>
                                    <kbd>Shift</kbd>+<kbd>Enter</kbd> new line
                                </span>
                                <div class="lk-inbox__composer-actions">
                                    <span class="lk-inbox__composer-count">{{ replyBody.length }}/4096</span>
                                    <button
                                        type="button"
                                        class="lk-inbox__send"
                                        :disabled="sending || !replyBody.trim()"
                                        @click="send"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                                        {{ sending ? 'Sending…' : 'Send' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </footer>
                </template>

                <div v-else-if="threadLoading" class="lk-inbox__placeholder">
                    <span class="lk-skeleton" style="height: 14px; width: 45%"></span>
                    <span class="lk-skeleton" style="height: 14px; width: 65%; margin-top: 10px"></span>
                </div>

                <div v-else class="lk-inbox__welcome">
                    <span class="lk-inbox__welcome-icon" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </span>
                    <p class="lk-state__title">Pick a conversation</p>
                    <p class="lk-state__text">Select a chat on the left to read and reply.</p>
                    <dl class="lk-inbox__shortcuts">
                        <div><dt>/</dt><dd>Search conversations</dd></div>
                        <div><dt>Enter</dt><dd>Send a reply</dd></div>
                        <div><dt>Shift + Enter</dt><dd>New line</dd></div>
                    </dl>
                </div>
            </main>

            <div class="lk-inbox__contact-backdrop" @click="detailsOpen = false"></div>

            <aside class="lk-inbox__contact">
                <template v-if="activeContact">
                    <div class="lk-inbox__contact-head">
                        <span class="lk-inbox__contact-cover" aria-hidden="true"></span>
                        <button type="button" class="lk-inbox__contact-close" aria-label="Close details" @click="detailsOpen = false">×</button>
                        <span class="lk-avatar lk-avatar--lg" :class="`is-${conversation?.channel}`">{{ initials(activeContact.name) }}</span>
                        <strong>{{ activeContact.name }}</strong>
                        <p class="lk-muted">{{ activeContact.display_phone }}</p>
                        <div class="lk-inbox__contact-badges">
                            <span class="lk-badge" :class="activeContact.status === 'customer' ? 'lk-badge--success' : 'lk-badge--neutral'">
                                {{ activeContact.status }}
                            </span>
                            <span class="lk-inbox__channel-pill" :class="`is-${conversation?.channel}`">
                                {{ conversation?.channel_label }}
                            </span>
                        </div>
                    </div>

                    <dl class="lk-inbox__facts">
                        <div v-if="activeContact.username">
                            <dt>Instagram</dt>
                            <dd>{{ activeContact.handle }}</dd>
                        </div>
                        <div v-if="activeContact.phone">
                            <dt>Phone</dt>
                            <dd>+{{ activeContact.phone }}</dd>
                        </div>
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
                        <div>
                            <dt>Assigned to</dt>
                            <dd>{{ conversation?.assignee?.name ?? 'Unassigned' }}</dd>
                        </div>
                        <div>
                            <dt>Priority</dt>
                            <dd>{{ priorityLabel(conversation?.priority) }}</dd>
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

                    <router-link
                        :to="{ name: 'crm-contacts' }"
                        class="lk-btn lk-btn--secondary lk-btn--sm lk-inbox__contact-link"
                    >
                        Open contact
                    </router-link>
                </template>

                <p v-else class="lk-muted">Contact details appear here.</p>
            </aside>
        </section>
    </div>
</template>

<style scoped>
.lk-inbox__page-head {
    margin-bottom: 12px;
}

.lk-inbox__shell {
    display: grid;
    grid-template-columns: minmax(280px, 350px) minmax(0, 1fr) minmax(230px, 290px);
    gap: 0;
    height: calc(100vh - 210px);
    min-height: 540px;
    border: 1px solid var(--lk-border);
    border-radius: var(--lk-radius-card);
    background: var(--lk-card);
    overflow: hidden;
    position: relative;
}

/* ---------- Conversation list ---------- */

.lk-inbox__list {
    border-right: 1px solid var(--lk-border);
    display: flex;
    flex-direction: column;
    min-height: 0;
    background: var(--lk-card);
}

.lk-inbox__list-head {
    padding: 12px;
    border-bottom: 1px solid var(--lk-border);
    display: grid;
    gap: 8px;
    background: var(--lk-surface);
}

.lk-inbox__channels {
    display: flex;
    gap: 4px;
}

.lk-inbox__channels button {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    border: 1px solid var(--lk-border);
    background: var(--lk-card);
    border-radius: 8px;
    padding: 6px;
    font-size: 11.5px;
    font-weight: 600;
    color: var(--lk-text-secondary);
    cursor: pointer;
    transition: border-color 120ms ease, background 120ms ease, color 120ms ease;
}

.lk-inbox__channels button:hover {
    border-color: var(--lk-primary);
}

.lk-inbox__channels button.is-active {
    border-color: var(--lk-primary);
    background: var(--lk-primary-subtle);
    color: var(--lk-primary-active);
}

.lk-inbox__channels button.is-instagram.is-active {
    border-color: #d946ef;
    background: color-mix(in srgb, #d946ef 10%, transparent);
    color: #a21caf;
}

.lk-inbox__channel-icon {
    display: inline-flex;
    align-items: center;
}

.lk-inbox__tabs {
    display: flex;
    gap: 2px;
    background: var(--lk-card);
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
    background: var(--lk-surface);
    color: var(--lk-text);
    box-shadow: var(--lk-shadow-card);
}

.lk-inbox__tab-count {
    font-weight: 500;
    color: var(--lk-text-muted);
}

.lk-inbox__search {
    position: relative;
    display: flex;
    align-items: center;
}

.lk-inbox__search-icon {
    position: absolute;
    left: 9px;
    color: var(--lk-text-muted);
    pointer-events: none;
}

.lk-inbox__search-input {
    padding-left: 29px;
    padding-right: 26px;
}

.lk-inbox__search-clear {
    position: absolute;
    right: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--lk-text-muted);
    font-size: 16px;
    line-height: 1;
    cursor: pointer;
}

.lk-inbox__search-clear:hover {
    background: var(--lk-surface);
    color: var(--lk-text);
}

.lk-inbox__list-tools {
    display: flex;
    align-items: center;
    gap: 8px;
}

.lk-inbox__list-tools .lk-select {
    flex: 1;
    min-width: 0;
}

.lk-inbox__filter {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    color: var(--lk-text-secondary);
    white-space: nowrap;
    cursor: pointer;
}

.lk-inbox__skeletons {
    padding: 4px 0;
}

.lk-inbox__empty-state {
    margin: auto;
    padding: 28px 20px;
    text-align: center;
    display: grid;
    justify-items: center;
    gap: 6px;
}

.lk-inbox__empty-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: var(--lk-surface);
    color: var(--lk-text-muted);
    margin-bottom: 4px;
}

.lk-inbox__items {
    list-style: none;
    margin: 0;
    padding: 6px;
    overflow-y: auto;
    flex: 1;
}

.lk-inbox__item {
    position: relative;
    width: 100%;
    display: flex;
    gap: 10px;
    text-align: left;
    padding: 10px;
    border: 0;
    background: transparent;
    border-radius: 10px;
    cursor: pointer;
    transition: background 120ms ease;
}

.lk-inbox__item:hover {
    background: var(--lk-surface);
}

.lk-inbox__item.is-active {
    background: var(--lk-primary-subtle);
}

.lk-inbox__item.is-unread::before {
    content: '';
    position: absolute;
    left: 2px;
    top: 14px;
    bottom: 14px;
    width: 3px;
    border-radius: 999px;
    background: var(--lk-primary);
}

.lk-inbox__avatar {
    position: relative;
    flex: 0 0 auto;
}

.lk-inbox__avatar-channel {
    position: absolute;
    right: -1px;
    bottom: -1px;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    border: 2px solid var(--lk-card);
    background: #25d366;
}

.lk-inbox__avatar.is-instagram .lk-inbox__avatar-channel {
    background: linear-gradient(135deg, #f58529, #dd2a7b 55%, #8134af);
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

.lk-inbox__item.is-unread .lk-inbox__item-top strong {
    font-weight: 800;
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

.lk-inbox__item.is-unread .lk-inbox__preview {
    color: var(--lk-text);
    font-weight: 600;
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
    flex: none;
}

.lk-inbox__item-meta {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 10.5px;
    color: var(--lk-text-muted);
    margin-top: 3px;
    overflow: hidden;
    white-space: nowrap;
}

.lk-inbox__item-assignee {
    overflow: hidden;
    text-overflow: ellipsis;
}

.lk-inbox__channel-tag {
    padding: 1px 6px;
    border-radius: 999px;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.03em;
    text-transform: capitalize;
    background: color-mix(in srgb, #25d366 14%, transparent);
    color: #128c4b;
}

.lk-inbox__channel-tag.is-instagram {
    background: color-mix(in srgb, #d946ef 14%, transparent);
    color: #a21caf;
}

.lk-inbox__pin {
    display: inline-flex;
    color: var(--lk-text-muted);
}

.lk-inbox__priority {
    padding: 1px 6px;
    border-radius: 999px;
    font-size: 9.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    background: color-mix(in srgb, #f59e0b 16%, transparent);
    color: #b45309;
}

.lk-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--lk-border-strong, #cbd5e1);
    flex: none;
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

/* ---------- Thread ---------- */

.lk-inbox__thread {
    display: flex;
    flex-direction: column;
    min-height: 0;
    position: relative;
    background: var(--lk-card);
}

.lk-inbox__thread-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    padding: 11px 14px;
    border-bottom: 1px solid var(--lk-border);
    flex-wrap: wrap;
    background: var(--lk-card);
}

.lk-inbox__back {
    display: none;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: 1px solid var(--lk-border);
    border-radius: 8px;
    background: var(--lk-card);
    color: var(--lk-text-secondary);
    cursor: pointer;
}

.lk-inbox__thread-who {
    display: flex;
    align-items: center;
    gap: 9px;
    min-width: 0;
}

.lk-inbox__thread-identity {
    min-width: 0;
}

.lk-inbox__thread-who strong {
    display: block;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.lk-inbox__thread-who p {
    margin: 0;
    font-size: 11.5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.lk-inbox__channel-pill {
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    background: color-mix(in srgb, #25d366 14%, transparent);
    color: #128c4b;
    flex: none;
}

.lk-inbox__channel-pill.is-instagram {
    background: color-mix(in srgb, #d946ef 14%, transparent);
    color: #a21caf;
}

.lk-inbox__thread-actions {
    display: flex;
    gap: 6px;
    align-items: center;
    flex-wrap: wrap;
}

.lk-inbox__assignee-select {
    width: 136px;
}

.lk-inbox__priority-select {
    width: 100px;
}

.lk-inbox__status-switch {
    display: inline-flex;
    border: 1px solid var(--lk-border);
    border-radius: 8px;
    background: var(--lk-surface);
    padding: 2px;
    gap: 2px;
}

.lk-inbox__status-switch button {
    border: 0;
    background: transparent;
    border-radius: 6px;
    padding: 4px 8px;
    font-size: 11px;
    font-weight: 600;
    color: var(--lk-text-secondary);
    cursor: pointer;
}

.lk-inbox__status-switch button:hover {
    color: var(--lk-text);
}

.lk-inbox__status-switch button.is-active {
    background: var(--lk-card);
    color: var(--lk-text);
    box-shadow: var(--lk-shadow-card);
}

.lk-icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: 1px solid var(--lk-border);
    border-radius: 7px;
    background: var(--lk-card);
    color: var(--lk-text-secondary);
    cursor: pointer;
}

.lk-icon-btn:hover,
.lk-icon-btn.is-active {
    border-color: var(--lk-primary);
    color: var(--lk-primary);
    background: var(--lk-primary-subtle);
}

.lk-inbox__details-toggle {
    display: none;
}

.lk-inbox__messages {
    flex: 1;
    overflow-y: auto;
    padding: 18px 20px 12px;
    background:
        radial-gradient(circle at 8% 12%, rgba(5, 150, 105, 0.045), transparent 38%),
        radial-gradient(circle at 94% 82%, rgba(14, 165, 233, 0.045), transparent 42%);
    scroll-behavior: auto;
}

.lk-inbox__group + .lk-inbox__group {
    margin-top: 10px;
}

.lk-inbox__day {
    text-align: center;
    font-size: 10px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--lk-text-muted);
    margin: 8px 0 12px;
}

.lk-bubble {
    max-width: 72%;
    padding: 9px 12px;
    border-radius: 13px;
    margin-bottom: 8px;
    border: 1px solid transparent;
    width: fit-content;
    word-break: break-word;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
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

.lk-bubble__media {
    margin-bottom: 6px;
}

.lk-bubble__image {
    display: block;
    max-width: 260px;
    max-height: 260px;
    border-radius: 10px;
    object-fit: cover;
}

.lk-bubble__audio {
    width: min(280px, 100%);
    height: 36px;
}

.lk-bubble__video {
    display: block;
    max-width: 280px;
    max-height: 260px;
    border-radius: 10px;
}

.lk-bubble__media-action {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 11px;
    border: 1px solid var(--lk-border);
    border-radius: 9px;
    background: var(--lk-surface);
    color: var(--lk-text-secondary);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
}

.lk-bubble__media-action:hover {
    border-color: var(--lk-primary);
    color: var(--lk-primary);
}

.lk-bubble__file {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 8px;
    border: 1px solid var(--lk-border);
    border-radius: 9px;
    background: var(--lk-surface);
}

.lk-bubble__file-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 7px;
    background: var(--lk-card);
    color: var(--lk-text-secondary);
    flex: none;
}

.lk-bubble__file-meta {
    display: grid;
    min-width: 0;
    flex: 1;
}

.lk-bubble__file-meta strong {
    font-size: 11.5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.lk-bubble__file-meta small {
    font-size: 10px;
    color: var(--lk-text-muted);
    text-transform: capitalize;
}

.lk-bubble__meta {
    display: flex;
    gap: 6px;
    align-items: center;
    margin: 4px 0 0;
    font-size: 10px;
    color: var(--lk-text-muted);
    flex-wrap: wrap;
}

.lk-bubble__status {
    text-transform: capitalize;
}

.lk-bubble__status.is-read {
    color: #0284c7;
    font-weight: 600;
}

.lk-bubble__status.is-failed {
    color: #dc2626;
    font-weight: 600;
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

.lk-inbox__jump {
    position: absolute;
    right: 18px;
    bottom: 88px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 11px;
    border: 1px solid var(--lk-border);
    border-radius: 999px;
    background: var(--lk-card);
    color: var(--lk-text-secondary);
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.12);
    z-index: 2;
}

.lk-inbox__jump:hover {
    color: var(--lk-primary);
    border-color: var(--lk-primary);
}

.lk-inbox__composer {
    padding: 10px 14px 12px;
    border-top: 1px solid var(--lk-border);
    background: var(--lk-card);
}

.lk-inbox__composer-box {
    border: 1px solid var(--lk-border);
    border-radius: 11px;
    background: var(--lk-card);
    padding: 7px 8px 6px;
    transition: border-color 120ms ease, box-shadow 120ms ease;
}

.lk-inbox__composer-box:focus-within {
    border-color: var(--lk-primary);
    box-shadow: 0 0 0 3px var(--lk-primary-subtle);
}

.lk-inbox__textarea {
    border: 0;
    box-shadow: none;
    padding: 4px 5px;
    resize: none;
    min-height: 32px;
    max-height: 148px;
    line-height: 1.5;
    background: transparent;
}

.lk-inbox__textarea:focus {
    outline: none;
    box-shadow: none;
}

.lk-inbox__composer-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 4px 4px 0;
}

.lk-inbox__composer-hint {
    font-size: 10px;
    color: var(--lk-text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.lk-inbox__composer-bar .lk-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    flex: none;
}

.lk-inbox__placeholder {
    margin: auto;
    padding: 30px;
}

.lk-inbox__welcome {
    margin: auto;
    padding: 34px 24px;
    text-align: center;
    display: grid;
    justify-items: center;
    gap: 6px;
}

.lk-inbox__welcome-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 54px;
    height: 54px;
    border-radius: 50%;
    background: var(--lk-primary-subtle);
    color: var(--lk-primary);
    margin-bottom: 4px;
}

.lk-inbox__shortcuts {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 14px;
    margin: 16px 0 0;
}

.lk-inbox__shortcuts div {
    display: grid;
    justify-items: center;
    gap: 2px;
}

.lk-inbox__shortcuts dt {
    font-size: 10.5px;
    font-weight: 700;
    color: var(--lk-text-secondary);
    border: 1px solid var(--lk-border);
    border-radius: 5px;
    padding: 2px 7px;
    background: var(--lk-surface);
}

.lk-inbox__shortcuts dd {
    margin: 0;
    font-size: 10.5px;
    color: var(--lk-text-muted);
}

/* ---------- Contact panel ---------- */

.lk-inbox__contact {
    border-left: 1px solid var(--lk-border);
    padding: 18px 16px;
    overflow-y: auto;
    background: var(--lk-card);
}

.lk-inbox__contact-head {
    position: relative;
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

.lk-inbox__contact-badges {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 5px;
    margin-top: 4px;
}

.lk-inbox__contact-close {
    display: none;
    position: absolute;
    top: -4px;
    right: -4px;
    width: 26px;
    height: 26px;
    border: 1px solid var(--lk-border);
    border-radius: 50%;
    background: var(--lk-card);
    color: var(--lk-text-muted);
    font-size: 16px;
    line-height: 1;
    cursor: pointer;
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

.lk-inbox__contact-link {
    margin-top: 14px;
}

.lk-inbox__contact-backdrop {
    display: none;
}

/* ---------- Shared bits ---------- */

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

.lk-avatar.is-instagram {
    background: color-mix(in srgb, #d946ef 14%, transparent);
    color: #a21caf;
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

/* ---------- Responsive ---------- */

@media (max-width: 1420px) {
    .lk-inbox__shell {
        grid-template-columns: minmax(270px, 330px) minmax(0, 1fr);
    }

    .lk-inbox__details-toggle {
        display: inline-flex;
    }

    .lk-inbox__contact {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: min(340px, 92%);
        z-index: 30;
        display: none;
        box-shadow: -14px 0 34px rgba(15, 23, 42, 0.16);
    }

    .lk-inbox--details .lk-inbox__contact {
        display: block;
    }

    .lk-inbox__contact-close {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .lk-inbox__contact-backdrop {
        display: none;
        position: absolute;
        inset: 0;
        z-index: 29;
        background: rgba(15, 23, 42, 0.34);
    }

    .lk-inbox--details .lk-inbox__contact-backdrop {
        display: block;
    }
}

@media (max-width: 1320px) {
    .lk-inbox__priority-select {
        display: none;
    }
}

@media (max-width: 1180px) {
    .lk-inbox__shell {
        grid-template-columns: minmax(260px, 320px) minmax(0, 1fr);
    }
}

@media (max-width: 820px) {
    .lk-inbox__shell {
        grid-template-columns: minmax(0, 1fr);
        height: calc(100dvh - 200px);
        min-height: 480px;
    }

    .lk-inbox__list {
        display: flex;
    }

    .lk-inbox__thread {
        display: none;
    }

    .lk-inbox--chat .lk-inbox__list {
        display: none;
    }

    .lk-inbox--chat .lk-inbox__thread {
        display: flex;
    }

    .lk-inbox__back {
        display: inline-flex;
    }

    .lk-inbox__thread-head {
        align-items: flex-start;
    }

    .lk-inbox__thread-actions {
        width: 100%;
        justify-content: flex-start;
    }

    .lk-inbox__assignee-select {
        flex: 1;
        width: auto;
    }

    .lk-inbox__status-switch {
        margin-left: auto;
    }

    .lk-bubble {
        max-width: 88%;
    }

    .lk-inbox__composer-hint {
        display: none;
    }
}

@media (max-width: 560px) {
    .lk-inbox__page-head .lk-page-actions {
        width: 100%;
        flex-wrap: wrap;
    }

    .lk-inbox__channels button {
        font-size: 11px;
    }

    .lk-inbox__thread-who .lk-avatar {
        display: none;
    }
}
/* ==========================================================================
   Modern inbox refresh
   ========================================================================== */

.lk-inbox-hero {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 18px;
    flex-wrap: wrap;
    padding: 18px 20px;
    margin-bottom: 12px;
    border: 1px solid color-mix(in srgb, var(--lk-primary) 16%, var(--lk-border));
    border-radius: 16px;
    background:
        radial-gradient(circle at 94% -30%, color-mix(in srgb, var(--lk-primary) 20%, transparent), transparent 55%),
        linear-gradient(135deg, var(--lk-card), color-mix(in srgb, var(--lk-primary) 4%, var(--lk-card)));
    box-shadow: var(--lk-shadow-card);
}

.lk-inbox-hero__main {
    min-width: 0;
}

.lk-inbox-hero__eyebrow {
    margin: 0 0 3px;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--lk-primary-active);
}

.lk-inbox-hero__title {
    margin: 0;
    font-size: 24px;
    line-height: 1.1;
    font-weight: 800;
    letter-spacing: -0.035em;
    color: var(--lk-text);
}

.lk-inbox-hero__sub {
    margin: 4px 0 0;
    font-size: 12.5px;
    color: var(--lk-text-secondary);
}

.lk-inbox-hero__stats {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 11px;
}

.lk-inbox-hero__stat {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 9px;
    border: 1px solid var(--lk-border);
    border-radius: 999px;
    background: color-mix(in srgb, var(--lk-card) 72%, transparent);
    font-size: 10.5px;
    font-weight: 600;
    color: var(--lk-text-secondary);
}

.lk-inbox-hero__stat strong {
    font-size: 11.5px;
    font-weight: 800;
    color: var(--lk-text);
}

.lk-inbox-hero__stat.is-alert {
    border-color: color-mix(in srgb, #f59e0b 35%, var(--lk-border));
    background: color-mix(in srgb, #f59e0b 9%, transparent);
    color: #b45309;
}

.lk-inbox-hero__stat.is-alert strong {
    color: #92400e;
}

.lk-inbox-hero__dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #94a3b8;
    flex: none;
}

.lk-inbox-hero__dot.is-whatsapp {
    background: #25d366;
}

.lk-inbox-hero__dot.is-instagram {
    background: linear-gradient(135deg, #f58529, #dd2a7b 55%, #8134af);
}

.lk-inbox-hero__actions {
    display: flex;
    align-items: center;
    gap: 7px;
    flex-wrap: wrap;
}

.lk-inbox-hero__connection {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    border-radius: 999px;
    font-size: 10.5px;
    font-weight: 700;
}

.lk-inbox-hero__connection.is-online {
    border: 1px solid color-mix(in srgb, #059669 28%, var(--lk-border));
    background: color-mix(in srgb, #059669 9%, transparent);
    color: #047857;
}

.lk-inbox-hero__connection.is-online .lk-inbox-hero__dot {
    background: #059669;
}

.lk-inbox-hero__connection.is-offline {
    border: 1px solid color-mix(in srgb, #f59e0b 34%, var(--lk-border));
    background: color-mix(in srgb, #f59e0b 10%, transparent);
    color: #b45309;
}

.lk-inbox-hero__connection.is-offline .lk-inbox-hero__dot {
    background: #f59e0b;
}

.lk-inbox__notice {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 12px;
    padding: 9px 13px;
    border: 1px solid color-mix(in srgb, #f59e0b 36%, var(--lk-border));
    border-radius: 11px;
    background: color-mix(in srgb, #f59e0b 8%, var(--lk-card));
    font-size: 11.5px;
    color: #92400e;
}

.lk-inbox__notice-icon {
    display: inline-flex;
    color: #b45309;
}

.lk-inbox__notice-text {
    min-width: 0;
    flex: 1;
}

.lk-inbox__notice-link {
    font-weight: 700;
    color: #92400e;
    text-decoration: underline;
    text-underline-offset: 2px;
    white-space: nowrap;
}

/* Shell */

.lk-inbox__shell {
    height: calc(100vh - 232px);
    min-height: 520px;
    border-radius: 16px;
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.05);
}

.lk-inbox__list {
    background: var(--lk-card);
}

.lk-inbox__list-head {
    padding: 12px;
    gap: 9px;
    background: var(--lk-card);
    border-bottom: 1px solid var(--lk-border);
}

/* Channel segmented control */

.lk-inbox__channels {
    gap: 2px;
    padding: 3px;
    border: 1px solid var(--lk-border);
    border-radius: 10px;
    background: var(--lk-surface);
}

.lk-inbox__channels button {
    gap: 4px;
    padding: 6px 4px;
    border: 0;
    border-radius: 7px;
    background: transparent;
    font-size: 11px;
    color: var(--lk-text-muted);
}

.lk-inbox__channels button:hover {
    color: var(--lk-text);
}

.lk-inbox__channels button.is-active,
.lk-inbox__channels button.is-instagram.is-active {
    border: 0;
    background: var(--lk-card);
    color: var(--lk-text);
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.1);
}

.lk-inbox__channels button.is-whatsapp.is-active .lk-inbox__channel-icon {
    color: #16a34a;
}

.lk-inbox__channels button.is-instagram.is-active .lk-inbox__channel-icon {
    color: #c026d3;
}

.lk-inbox__channels button.is-all.is-active .lk-inbox__channel-icon {
    color: var(--lk-primary);
}

.lk-inbox__channel-icon {
    opacity: 0.85;
}

.lk-inbox__channel-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Search */

.lk-inbox__search-input {
    height: 36px;
    padding-left: 32px;
    padding-right: 34px;
    border: 1px solid transparent;
    border-radius: 9px;
    background: var(--lk-surface);
    font-size: 12.5px;
    transition: border-color 120ms ease, background 120ms ease, box-shadow 120ms ease;
}

.lk-inbox__search-input:focus {
    border-color: var(--lk-primary);
    background: var(--lk-card);
    box-shadow: 0 0 0 3px var(--lk-primary-subtle);
}

.lk-inbox__search-icon {
    left: 11px;
}

.lk-inbox__search-kbd {
    position: absolute;
    right: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 4px;
    border: 1px solid var(--lk-border);
    border-radius: 5px;
    background: var(--lk-card);
    color: var(--lk-text-muted);
    font-family: inherit;
    font-size: 10px;
    font-weight: 600;
    pointer-events: none;
}

/* Status pills */

.lk-inbox__tabs {
    gap: 4px;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
}

.lk-inbox__tabs button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    min-width: 0;
    padding: 6px 5px;
    border-radius: 8px;
    font-size: 11px;
    color: var(--lk-text-muted);
    transition: background 120ms ease, color 120ms ease;
}

.lk-inbox__tabs button:hover {
    background: var(--lk-surface);
    color: var(--lk-text);
}

.lk-inbox__tabs button.is-active {
    background: var(--lk-primary-subtle);
    color: var(--lk-primary-active);
    box-shadow: none;
    font-weight: 700;
}

.lk-inbox__tab-count {
    min-width: 15px;
    padding: 0 4px;
    border-radius: 999px;
    background: var(--lk-surface);
    color: var(--lk-text-muted);
    font-size: 9.5px;
    font-weight: 700;
    line-height: 15px;
    text-align: center;
}

.lk-inbox__tabs button.is-active .lk-inbox__tab-count {
    background: color-mix(in srgb, var(--lk-primary) 14%, transparent);
    color: var(--lk-primary-active);
}

/* Filter row */

.lk-inbox__list-tools {
    gap: 6px;
}

.lk-inbox__assignee {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    min-width: 0;
    height: 32px;
    padding: 0 9px;
    border: 1px solid var(--lk-border);
    border-radius: 8px;
    background: var(--lk-card);
    color: var(--lk-text-muted);
}

.lk-inbox__assignee select {
    flex: 1;
    min-width: 0;
    height: 100%;
    border: 0;
    background: transparent;
    color: var(--lk-text-secondary);
    font-size: 11.5px;
    font-weight: 600;
    cursor: pointer;
    outline: none;
}

.lk-inbox__unread-toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 32px;
    padding: 0 10px;
    border: 1px solid var(--lk-border);
    border-radius: 8px;
    background: var(--lk-card);
    color: var(--lk-text-secondary);
    font-size: 11.5px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    transition: border-color 120ms ease, background 120ms ease, color 120ms ease;
}

.lk-inbox__unread-toggle:hover {
    border-color: color-mix(in srgb, var(--lk-primary) 40%, var(--lk-border));
}

.lk-inbox__unread-toggle.is-active {
    border-color: color-mix(in srgb, var(--lk-primary) 45%, var(--lk-border));
    background: var(--lk-primary-subtle);
    color: var(--lk-primary-active);
}

.lk-inbox__unread-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--lk-primary);
    opacity: 0.45;
}

.lk-inbox__unread-toggle.is-active .lk-inbox__unread-dot {
    opacity: 1;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--lk-primary) 14%, transparent);
}

/* Conversation rows */

.lk-inbox__items {
    padding: 6px;
}

.lk-inbox__item {
    gap: 11px;
    padding: 11px 10px;
    margin-bottom: 2px;
    border: 1px solid transparent;
    border-radius: 12px;
}

.lk-inbox__item:hover {
    background: var(--lk-surface);
}

.lk-inbox__item.is-active {
    border-color: color-mix(in srgb, var(--lk-primary) 24%, var(--lk-border));
    background: var(--lk-card);
    box-shadow: 0 5px 16px rgba(15, 23, 42, 0.07);
}

.lk-inbox__item.is-active::after {
    content: '';
    position: absolute;
    left: 0;
    top: 13px;
    bottom: 13px;
    width: 3px;
    border-radius: 999px;
    background: var(--lk-primary);
}

.lk-inbox__item.is-unread::before {
    display: none;
}

.lk-inbox__item .lk-avatar {
    width: 40px;
    height: 40px;
    font-size: 12.5px;
    background: linear-gradient(145deg, color-mix(in srgb, var(--lk-primary) 18%, #fff), var(--lk-primary-subtle));
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--lk-primary) 12%, transparent);
}

.lk-inbox__item .lk-avatar.is-instagram {
    background: linear-gradient(145deg, color-mix(in srgb, #d946ef 16%, #fff), color-mix(in srgb, #d946ef 8%, #fff));
    color: #a21caf;
    box-shadow: inset 0 0 0 1px color-mix(in srgb, #d946ef 14%, transparent);
}

.lk-inbox__avatar-channel {
    width: 12px;
    height: 12px;
    border-width: 2px;
}

.lk-inbox__item-top strong {
    font-size: 12.5px;
    letter-spacing: -0.005em;
}

.lk-inbox__item-top small {
    font-size: 10px;
}

.lk-inbox__item-bottom {
    margin-top: 2px;
}

.lk-inbox__preview {
    font-size: 11.5px;
}

.lk-inbox__item-meta {
    gap: 5px;
    margin-top: 4px;
    font-size: 10px;
}

.lk-inbox__channel-tag {
    padding: 1px 5px;
    font-size: 9px;
}

.lk-inbox__priority {
    font-size: 9px;
}

/* Thread */

.lk-inbox__thread-head {
    padding: 11px 16px;
    border-bottom: 1px solid var(--lk-border);
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
    z-index: 1;
}

.lk-inbox__thread-who .lk-avatar {
    width: 40px;
    height: 40px;
    font-size: 13px;
    background: linear-gradient(145deg, color-mix(in srgb, var(--lk-primary) 18%, #fff), var(--lk-primary-subtle));
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--lk-primary) 12%, transparent);
}

.lk-inbox__thread-who .lk-avatar.is-instagram {
    background: linear-gradient(145deg, color-mix(in srgb, #d946ef 16%, #fff), color-mix(in srgb, #d946ef 8%, #fff));
    color: #a21caf;
}

.lk-inbox__thread-who strong {
    font-size: 14.5px;
    letter-spacing: -0.01em;
}

.lk-inbox__thread-who p {
    font-size: 11px;
    color: var(--lk-text-muted);
}

.lk-inbox__channel-pill {
    padding: 2px 8px;
    font-size: 9px;
}

.lk-inbox__thread-actions {
    gap: 5px;
}

.lk-inbox__action-select {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 30px;
    padding: 0 7px;
    border: 1px solid var(--lk-border);
    border-radius: 8px;
    background: var(--lk-card);
    color: var(--lk-text-muted);
    transition: border-color 120ms ease;
}

.lk-inbox__action-select:hover,
.lk-inbox__action-select:focus-within {
    border-color: color-mix(in srgb, var(--lk-primary) 40%, var(--lk-border));
}

.lk-inbox__action-select select {
    max-width: 118px;
    height: 100%;
    border: 0;
    background: transparent;
    color: var(--lk-text-secondary);
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    outline: none;
}

.lk-inbox__assignee-select,
.lk-inbox__priority-select {
    width: auto;
}

.lk-inbox__status-switch {
    padding: 2px;
    border-radius: 9px;
}

.lk-inbox__status-switch button {
    padding: 5px 9px;
    border-radius: 7px;
    font-size: 10.5px;
}

.lk-icon-btn {
    width: 30px;
    height: 30px;
    border-radius: 8px;
}

/* Messages */

.lk-inbox__messages {
    padding: 20px 22px 14px;
    background:
        radial-gradient(circle at 10% 4%, color-mix(in srgb, var(--lk-primary) 5%, transparent), transparent 40%),
        radial-gradient(circle at 92% 96%, color-mix(in srgb, #0ea5e9 5%, transparent), transparent 44%),
        linear-gradient(180deg, color-mix(in srgb, var(--lk-surface) 55%, var(--lk-card)), var(--lk-card));
}

.lk-inbox__day {
    width: fit-content;
    margin: 6px auto 14px;
    padding: 3px 10px;
    border: 1px solid var(--lk-border);
    border-radius: 999px;
    background: color-mix(in srgb, var(--lk-card) 78%, transparent);
    font-size: 9.5px;
    font-weight: 700;
}

.lk-bubble {
    max-width: 68%;
    padding: 10px 13px;
    margin-bottom: 9px;
    border-radius: 15px;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
}

.lk-bubble--in {
    border-color: var(--lk-border);
    border-bottom-left-radius: 5px;
    background: var(--lk-card);
}

.lk-bubble--out {
    border-color: color-mix(in srgb, var(--lk-primary) 22%, var(--lk-border));
    border-bottom-right-radius: 5px;
    background: linear-gradient(
        135deg,
        color-mix(in srgb, var(--lk-primary) 14%, #fff),
        color-mix(in srgb, var(--lk-primary) 7%, #fff)
    );
}

.lk-bubble__body {
    font-size: 13px;
    line-height: 1.55;
}

.lk-bubble__meta {
    margin-top: 5px;
    font-size: 9.5px;
    opacity: 0.9;
}

.lk-inbox__jump {
    right: 20px;
    bottom: 92px;
    padding: 7px 12px;
    border-radius: 999px;
    background: var(--lk-card);
    font-size: 10.5px;
    box-shadow: 0 8px 22px rgba(15, 23, 42, 0.14);
}

/* Composer */

.lk-inbox__composer {
    padding: 10px 16px 13px;
    background: var(--lk-card);
}

.lk-inbox__composer-box {
    padding: 8px 9px 7px;
    border-radius: 14px;
    background: var(--lk-surface);
}

.lk-inbox__composer-box:focus-within {
    background: var(--lk-card);
    box-shadow: 0 0 0 3px var(--lk-primary-subtle);
}

.lk-inbox__textarea {
    min-height: 36px;
    padding: 5px 6px;
    font-size: 13.5px;
    line-height: 1.55;
}

.lk-inbox__composer-bar {
    gap: 8px;
    padding: 5px 4px 0;
}

.lk-inbox__composer-hint {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 9.5px;
}

.lk-inbox__composer-hint kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 17px;
    padding: 0 5px;
    border: 1px solid var(--lk-border);
    border-radius: 5px;
    background: var(--lk-card);
    color: var(--lk-text-muted);
    font-family: inherit;
    font-size: 9px;
    font-weight: 600;
}

.lk-inbox__composer-sep {
    opacity: 0.5;
    margin: 0 2px;
}

.lk-inbox__composer-actions {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    flex: none;
}

.lk-inbox__composer-count {
    font-size: 9.5px;
    color: var(--lk-text-muted);
    font-variant-numeric: tabular-nums;
}

.lk-inbox__send {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 32px;
    padding: 0 15px;
    border: 0;
    border-radius: 9px;
    background: var(--lk-primary);
    color: #fff;
    font-size: 11.5px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 6px 16px color-mix(in srgb, var(--lk-primary) 26%, transparent);
    transition: background 120ms ease, transform 120ms ease, opacity 120ms ease;
}

.lk-inbox__send:hover:not(:disabled) {
    background: var(--lk-primary-active);
    transform: translateY(-1px);
}

.lk-inbox__send:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
}

/* Welcome / empty */

.lk-inbox__welcome-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(145deg, var(--lk-primary-subtle), color-mix(in srgb, var(--lk-primary) 16%, #fff));
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--lk-primary) 14%, transparent);
}

/* Contact panel */

.lk-inbox__contact {
    padding: 18px 16px;
    background: var(--lk-card);
}

.lk-inbox__contact-head {
    padding: 24px 0 16px;
    overflow: hidden;
}

.lk-inbox__contact-cover {
    position: absolute;
    top: -18px;
    left: -16px;
    right: -16px;
    height: 82px;
    border-bottom: 1px solid var(--lk-border);
    background:
        radial-gradient(circle at 88% -40%, color-mix(in srgb, var(--lk-primary) 28%, transparent), transparent 60%),
        linear-gradient(135deg, color-mix(in srgb, var(--lk-primary) 8%, var(--lk-card)), var(--lk-surface));
}

.lk-inbox__contact-head .lk-avatar {
    position: relative;
    z-index: 1;
    width: 60px;
    height: 60px;
    font-size: 19px;
    margin-top: 10px;
    box-shadow: 0 0 0 3px var(--lk-card), 0 8px 18px rgba(15, 23, 42, 0.1);
    background: linear-gradient(145deg, color-mix(in srgb, var(--lk-primary) 20%, #fff), var(--lk-primary-subtle));
}

.lk-inbox__contact-head .lk-avatar.is-instagram {
    background: linear-gradient(145deg, color-mix(in srgb, #d946ef 18%, #fff), color-mix(in srgb, #d946ef 8%, #fff));
}

.lk-inbox__contact-head strong {
    position: relative;
    z-index: 1;
    font-size: 15px;
    letter-spacing: -0.01em;
}

.lk-inbox__contact-head > p,
.lk-inbox__contact-badges {
    position: relative;
    z-index: 1;
}

.lk-inbox__facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 7px;
    margin: 16px 0;
}

.lk-inbox__facts > div {
    padding: 8px 9px;
    border: 1px solid var(--lk-border);
    border-radius: 9px;
    background: var(--lk-surface);
    min-width: 0;
}

.lk-inbox__facts dt {
    font-size: 9px;
    letter-spacing: 0.05em;
}

.lk-inbox__facts dd {
    margin-top: 2px;
    font-size: 11.5px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.lk-inbox__facts > div:nth-child(3),
.lk-inbox__facts > div:nth-child(4) {
    grid-column: span 1;
}

.lk-inbox__tags {
    padding-top: 14px;
}

.lk-inbox__notes {
    margin-top: 14px;
    padding: 11px;
    border: 1px solid var(--lk-border);
    border-radius: 10px;
    background: var(--lk-surface);
    font-size: 11.5px;
    line-height: 1.5;
}

/* Responsive overrides */

@media (max-width: 1420px) {
    .lk-inbox__details-toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .lk-inbox__contact {
        width: min(340px, 92%);
    }
}

@media (max-width: 1180px) {
    .lk-inbox__shell {
        grid-template-columns: minmax(280px, 320px) minmax(0, 1fr);
    }
}

@media (max-width: 900px) {
    .lk-inbox__hero {
        align-items: flex-start;
    }

    .lk-inbox__hero__actions {
        width: 100%;
    }

    .lk-inbox__action-select.lk-inbox__priority-select {
        display: none;
    }
}

@media (max-width: 820px) {
    .lk-inbox__shell {
        height: calc(100dvh - 210px);
        min-height: 480px;
    }

    .lk-inbox__thread-actions {
        width: 100%;
        justify-content: flex-start;
    }

    .lk-inbox__action-select {
        flex: 1;
        min-width: 0;
    }

    .lk-inbox__action-select select {
        max-width: none;
        width: 100%;
    }

    .lk-inbox__status-switch {
        margin-left: 0;
    }

    .lk-bubble {
        max-width: 86%;
    }
}

@media (max-width: 640px) {
    .lk-inbox-hero {
        padding: 16px;
    }

    .lk-inbox-hero__title {
        font-size: 22px;
    }

    .lk-inbox__composer-hint {
        display: none;
    }

    .lk-inbox__composer-count {
        margin-left: auto;
    }
}

@media (max-width: 560px) {
    .lk-inbox__channel-label {
        display: none;
    }

    .lk-inbox__channels button {
        padding: 7px 4px;
    }

    .lk-inbox__thread-who .lk-avatar {
        display: none;
    }

    .lk-inbox__facts {
        grid-template-columns: minmax(0, 1fr);
    }
}

</style>
