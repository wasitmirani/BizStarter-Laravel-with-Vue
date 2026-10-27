<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import AdmissionsService from '../../Services/Admissions/AdmissionsService';
import { errorMessage } from '../../Services/Admissions/api';

const router = useRouter();

const authUser = ((window as any).user ?? {}) as any;
const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';

const displayName = computed(() => authUser?.name || 'Applicant');
const displayEmail = computed(() => authUser?.email || '');
const roles = computed<string[]>(() => (authUser?.roles ?? []).map((role: any) => role?.name).filter(Boolean));
const initials = computed(() =>
    String(displayName.value)
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join(''),
);
const avatarFailed = ref(false);
const avatar = computed(() => {
    const thumbnail = authUser?.thumbnail;
    if (!thumbnail || thumbnail === 'default.png') {
        return '';
    }

    return thumbnail;
});

/* ------------------------------------------------------------------ */
/* Logout                                                              */
/* ------------------------------------------------------------------ */
const loggingOut = ref(false);

function logOut(event: Event) {
    event.preventDefault();
    if (loggingOut.value) return;
    loggingOut.value = true;

    const existing = Array.from(document.forms).find((form) => {
        try {
            return new URL(form.action, window.location.href).pathname === '/logout' && form.method.toLowerCase() === 'post';
        } catch {
            return false;
        }
    }) as HTMLFormElement | undefined;

    if (existing) {
        const tokenInput = existing.querySelector('input[name="_token"]') as HTMLInputElement | null;
        if (tokenInput) tokenInput.value = csrf;
        existing.submit();
        return;
    }

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/logout';
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = '_token';
    input.value = csrf;
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
}

/* ------------------------------------------------------------------ */
/* Global search                                                       */
/* ------------------------------------------------------------------ */
const query = ref('');
const searchOpen = ref(false);
const searching = ref(false);
const searchError = ref('');
const universities = ref<any[]>([]);
const programs = ref<any[]>([]);
const searchInput = ref<HTMLInputElement | null>(null);
const searchWrap = ref<HTMLElement | null>(null);
const mobileSearch = ref(false);

let debounce: number | undefined;
let requestId = 0;

const hasResults = computed(() => universities.value.length + programs.value.length > 0);
const searchPending = computed(() => query.value.trim().length >= 2);

watch(query, (value) => {
    window.clearTimeout(debounce);
    const term = value.trim();

    if (term.length < 2) {
        universities.value = [];
        programs.value = [];
        searching.value = false;
        searchError.value = '';
        return;
    }

    searchOpen.value = true;
    searching.value = true;
    debounce = window.setTimeout(() => runSearch(term), 260);
});

async function runSearch(term: string) {
    const id = ++requestId;
    searchError.value = '';

    try {
        const [universityResult, programResult] = await Promise.all([
            AdmissionsService.universities({ search: term, per_page: 4 }),
            AdmissionsService.programs({ search: term, per_page: 4 }),
        ]);

        if (id !== requestId) return;

        universities.value = universityResult.universities ?? [];
        programs.value = programResult.programs ?? [];
    } catch (exception: any) {
        if (id !== requestId) return;
        universities.value = [];
        programs.value = [];
        searchError.value = errorMessage(exception);
    } finally {
        if (id === requestId) searching.value = false;
    }
}

function resetSearch(close = true) {
    query.value = '';
    universities.value = [];
    programs.value = [];
    searchError.value = '';
    searching.value = false;
    if (close) {
        searchOpen.value = false;
        mobileSearch.value = false;
    }
}

function goUniversity(university: any) {
    resetSearch();
    router.push({ name: 'universities', query: { university: university.id } });
}

function goProgram(program: any) {
    resetSearch();
    router.push({ name: 'programs', query: { program: program.id } });
}

function goToPrograms() {
    const term = query.value.trim();
    resetSearch();
    router.push({ name: 'programs', query: term ? { search: term } : {} });
}

function onGlobalKeydown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInput.value?.focus();
        searchOpen.value = true;
        return;
    }

    if (event.key === 'Escape') {
        searchOpen.value = false;
        mobileSearch.value = false;
        searchInput.value?.blur();
    }
}

function onDocumentClick(event: MouseEvent) {
    if (!searchOpen.value) return;
    if (searchWrap.value && !searchWrap.value.contains(event.target as Node)) {
        searchOpen.value = false;
    }
}

/* ------------------------------------------------------------------ */
/* Quick actions                                                       */
/* ------------------------------------------------------------------ */
const quickActions = [
    { label: 'Track an application', description: 'Add a program you are applying to', icon: 'files', name: 'applications', query: { new: 1 } },
    { label: 'Add a task', description: 'Keep deadlines and documents on track', icon: 'list-plus', name: 'tasks', query: { new: 1 } },
    { label: 'Upload a document', description: 'Transcripts, CV, language certificates', icon: 'file-upload', name: 'documents', query: { new: 1 } },
    { label: 'Complete your profile', description: 'Better data means sharper matches', icon: 'user-check', name: 'profile' },
];

/* ------------------------------------------------------------------ */
/* Notification deliveries                                             */
/* ------------------------------------------------------------------ */
const deliveries = ref<any[]>([]);
const deliveriesLoaded = ref(false);
const deliveriesLoading = ref(false);

const unread = computed(() => deliveries.value.filter((delivery) => delivery.status !== 'sent' && delivery.status !== 'failed').length);

async function loadNotifications() {
    if (deliveriesLoading.value) return;
    deliveriesLoading.value = true;

    try {
        const result = await AdmissionsService.notifications();
        deliveries.value = result.deliveries ?? [];
    } catch {
        deliveries.value = [];
    } finally {
        deliveriesLoaded.value = true;
        deliveriesLoading.value = false;
    }
}

function deliveryTone(status: string) {
    if (status === 'sent') return 'success';
    if (status === 'failed') return 'danger';
    return 'warning';
}

function shortDate(value?: string | null) {
    if (!value) return '';
    const date = new Date(value.replace(' ', 'T'));
    if (Number.isNaN(date.getTime())) return '';

    return date.toLocaleString(undefined, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

const programsLabel = (count: number) => `${count} ${Number(count) === 1 ? 'program' : 'programs'}`;

/* ------------------------------------------------------------------ */
/* Theme                                                               */
/* ------------------------------------------------------------------ */
const isDark = ref(false);

function applyTheme() {
    document.documentElement.setAttribute('data-bs-theme', isDark.value ? 'dark' : 'light');
    sessionStorage.setItem('data-bs-theme', isDark.value ? 'dark' : 'light');
}

function toggleTheme() {
    isDark.value = !isDark.value;
    applyTheme();
}

onMounted(() => {
    isDark.value = (sessionStorage.getItem('data-bs-theme') ?? document.documentElement.getAttribute('data-bs-theme')) === 'dark';
    window.addEventListener('keydown', onGlobalKeydown);
    document.addEventListener('click', onDocumentClick);
    loadNotifications();
});

onBeforeUnmount(() => {
    window.clearTimeout(debounce);
    window.removeEventListener('keydown', onGlobalKeydown);
    document.removeEventListener('click', onDocumentClick);
});
</script>

<template>
    <div>
        <form id="logout-form" method="POST" action="/logout" class="d-none">
            <input type="hidden" name="_token" :value="csrf" />
        </form>

        <header class="main-topbar" id="main-topbar">
            <div class="navbar-brand">
                <button type="button" id="toggleSidebar" class="sidebar-toggle btn p-0" aria-label="Toggle navigation">
                    <AppIcon name="panel-left-open" :size="20" />
                </button>
                <RouterLink :to="{ name: 'dashboard' }" class="d-lg-none d-inline-flex align-items-center gap-2 ms-2 text-decoration-none" aria-label="UniPilot dashboard">
                    <span class="uni-mark"><AppIcon name="school" :size="15" /></span>
                    <span class="fw-bold text-body">UniPilot</span>
                </RouterLink>
            </div>

            <div ref="searchWrap" class="topbar-search position-relative flex-grow-1 d-none d-md-block" style="max-width: 480px">
                <form role="search" @submit.prevent="goToPrograms">
                    <AppIcon name="search" :size="17" class="search-leading" />
                    <input
                        ref="searchInput"
                        v-model="query"
                        type="search"
                        class="form-control border-0 shadow-none rounded-pill"
                        style="width: 100%; padding-inline-start: 40px; padding-inline-end: 46px"
                        placeholder="Search universities, programs, cities…"
                        autocomplete="off"
                        aria-label="Search the catalog"
                        @focus="searchOpen = true"
                    />
                    <kbd class="search-kbd d-none d-xl-block">Ctrl K</kbd>
                </form>

                <div v-if="searchOpen && searchPending" class="dropdown-menu show catalog-search-panel shadow-lg">
                    <div v-if="searching" class="d-flex align-items-center gap-2 px-4 py-3 text-muted">
                        <span class="spinner-border spinner-border-sm text-primary"></span>
                        Searching the catalog…
                    </div>

                    <div v-else-if="searchError" class="alert alert-danger mx-3 my-2 py-2 fs-15 mb-0">{{ searchError }}</div>

                    <template v-else>
                        <div v-if="!hasResults" class="px-4 py-4 text-center">
                            <AppIcon name="search" :size="22" class="text-muted mb-2" />
                            <p class="mb-1 fw-medium">No matches for “{{ query }}”</p>
                            <p class="text-muted fs-15 mb-0">Try a university, city, subject or degree name.</p>
                        </div>

                        <template v-else>
                            <div v-if="universities.length" class="search-group">
                                <p class="search-group-title">Universities</p>
                                <button
                                    v-for="university in universities"
                                    :key="`u-${university.id}`"
                                    type="button"
                                    class="search-result"
                                    @click="goUniversity(university)"
                                >
                                    <span class="search-result-mark">{{ university.initials || 'UN' }}</span>
                                    <span class="min-w-0 flex-grow-1">
                                        <span class="d-block fw-medium text-truncate">{{ university.name }}</span>
                                        <span class="d-block text-muted fs-14 text-truncate">
                                            {{ [university.city, university.region].filter(Boolean).join(' · ') || 'Italy' }}
                                            <template v-if="university.programs_count"> · {{ programsLabel(university.programs_count) }}</template>
                                        </span>
                                    </span>
                                    <AppIcon name="chevron-right" :size="16" class="text-muted" />
                                </button>
                            </div>

                            <div v-if="programs.length" class="search-group">
                                <p class="search-group-title">Programs</p>
                                <button
                                    v-for="program in programs"
                                    :key="`p-${program.id}`"
                                    type="button"
                                    class="search-result"
                                    @click="goProgram(program)"
                                >
                                    <span class="search-result-mark bg-primary-subtle text-primary"><AppIcon name="school" :size="16" /></span>
                                    <span class="min-w-0 flex-grow-1">
                                        <span class="d-block fw-medium text-truncate">{{ program.title }}</span>
                                        <span class="d-block text-muted fs-14 text-truncate">
                                            {{ program.university?.name }}
                                            <template v-if="program.degree_type"> · {{ program.degree_type }}</template>
                                        </span>
                                    </span>
                                    <AppIcon name="chevron-right" :size="16" class="text-muted" />
                                </button>
                            </div>
                        </template>

                        <button type="button" class="search-footer" @click="goToPrograms">
                            See all programs matching “{{ query.trim() }}”
                            <AppIcon name="arrow-right" :size="15" />
                        </button>
                    </template>
                </div>
            </div>

            <div class="d-flex align-items-center gap-1 gap-md-2 ms-auto">
                <button type="button" class="btn topbar-link d-md-none" aria-label="Search" @click="mobileSearch = !mobileSearch">
                    <span class="topbar-icon"><AppIcon name="search" :size="19" /></span>
                </button>

                <!-- Quick actions -->
                <div class="dropdown">
                    <button
                        type="button"
                        class="btn topbar-link"
                        data-bs-toggle="dropdown"
                        data-bs-auto-close="true"
                        aria-expanded="false"
                        aria-label="Quick actions"
                    >
                        <span class="topbar-icon"><AppIcon name="plus" :size="19" /></span>
                    </button>
                    <div class="dropdown-menu dropdown-menu-end p-2 quick-actions-menu">
                        <p class="quick-actions-title">Quick actions</p>
                        <RouterLink
                            v-for="action in quickActions"
                            :key="action.label"
                            :to="{ name: action.name, query: action.query }"
                            class="dropdown-item d-flex align-items-start gap-3 rounded px-3 py-2"
                        >
                            <span class="avatar rounded bg-primary-subtle text-primary flex-shrink-0" style="width: 34px; height: 34px">
                                <AppIcon :name="action.icon" :size="17" />
                            </span>
                            <span class="min-w-0">
                                <span class="d-block fw-medium">{{ action.label }}</span>
                                <span class="d-block text-muted fs-13 lh-sm">{{ action.description }}</span>
                            </span>
                        </RouterLink>
                    </div>
                </div>

                <!-- Notification deliveries -->
                <div class="dropdown">
                    <button
                        type="button"
                        class="btn topbar-link position-relative"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        aria-label="Notification deliveries"
                        @click="loadNotifications"
                    >
                        <span class="topbar-icon"><AppIcon name="bell" :size="19" /></span>
                        <span v-if="unread" class="notification-count">{{ unread > 9 ? '9+' : unread }}</span>
                    </button>
                    <div class="dropdown-menu dropdown-menu-end p-0 notifications-menu">
                        <div class="d-flex align-items-center justify-content-between px-4 py-3 border-bottom">
                            <p class="mb-0 fw-semibold">Notifications</p>
                            <RouterLink :to="{ name: 'preferences' }" class="fs-14 text-primary">Settings</RouterLink>
                        </div>
                        <div v-if="deliveriesLoading" class="px-4 py-4 text-center text-muted">
                            <span class="spinner-border spinner-border-sm text-primary me-2"></span>Loading…
                        </div>
                        <div v-else-if="deliveriesLoaded && !deliveries.length" class="px-4 py-5 text-center">
                            <span class="avatar rounded-circle bg-success-subtle text-success mb-2" style="width: 42px; height: 42px">
                                <AppIcon name="check-check" :size="20" />
                            </span>
                            <p class="mb-1 fw-medium">You are all caught up</p>
                            <p class="text-muted fs-14 mb-0">
                                Digest emails and Slack messages will appear here once they are queued.
                            </p>
                        </div>
                        <div v-else class="notifications-list">
                            <div v-for="delivery in deliveries" :key="delivery.id" class="notification-row">
                                <span class="avatar rounded bg-primary-subtle text-primary flex-shrink-0" style="width: 34px; height: 34px">
                                    <AppIcon :name="delivery.channel === 'slack' ? 'send' : 'mail'" :size="16" />
                                </span>
                                <div class="min-w-0 flex-grow-1">
                                    <p class="mb-1 fw-medium text-truncate">{{ delivery.subject }}</p>
                                    <div class="d-flex align-items-center gap-2 flex-wrap fs-13 text-muted">
                                        <span class="badge" :class="`bg-${deliveryTone(delivery.status)}-subtle text-${deliveryTone(delivery.status)}`">
                                            {{ delivery.status }}
                                        </span>
                                        <span class="text-capitalize">{{ delivery.channel }}</span>
                                        <span v-if="shortDate(delivery.sent_at || delivery.created_at)">· {{ shortDate(delivery.sent_at || delivery.created_at) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="border-top px-4 py-2 text-center">
                            <RouterLink :to="{ name: 'preferences' }" class="fs-14 text-body fw-medium">
                                Manage digest preferences
                            </RouterLink>
                        </div>
                    </div>
                </div>

                <!-- Theme -->
                <button
                    type="button"
                    class="btn topbar-link d-none d-sm-flex"
                    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
                    @click="toggleTheme"
                >
                    <span class="topbar-icon">
                        <AppIcon :name="isDark ? 'sun' : 'moon'" :size="19" />
                    </span>
                </button>

                <!-- Account -->
                <div class="dropdown profile-dropdown">
                    <button class="btn topbar-link bg-transparent w-auto gap-2 ms-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <span class="d-flex align-items-center gap-2">
                            <span class="text-end fs-sm d-none d-xl-block">
                                <span class="fw-medium d-block lh-sm admin-name">{{ displayName }}</span>
                                <span class="d-inline-block admin-designation text-truncate" style="max-width: 180px">{{ displayEmail || 'Applicant' }}</span>
                            </span>
                            <span class="position-relative ms-6">
                                <img
                                    v-if="avatar && !avatarFailed"
                                    :src="avatar"
                                    loading="lazy"
                                    :alt="displayName"
                                    class="object-fit-cover rounded-circle size-9"
                                    @error="avatarFailed = true"
                                />
                                <span v-else class="avatar rounded-circle bg-primary text-white size-9 fw-semibold">{{ initials }}</span>
                                <span class="size-2-5 bg-success rounded-circle d-block position-absolute bottom-0 end-0 border profile-border-color border-2"></span>
                            </span>
                        </span>
                    </button>
                    <div class="dropdown-menu p-0 profile-dropdown-menu dropdown-menu-end">
                        <div class="px-4 pt-4 pb-3 border-bottom">
                            <p class="text-muted mb-1 fs-14">Signed in as</p>
                            <p class="mb-0 fw-semibold text-truncate">{{ displayName }}</p>
                            <p class="text-muted fs-14 mb-0 text-truncate">{{ displayEmail }}</p>
                            <div v-if="roles.length" class="d-flex flex-wrap gap-1 mt-2">
                                <span v-for="role in roles" :key="role" class="badge bg-primary-subtle text-primary text-capitalize">{{ role }}</span>
                            </div>
                        </div>
                        <ul class="list-unstyled mb-0 p-2 border-bottom">
                            <li>
                                <RouterLink :to="{ name: 'profile' }" class="dropdown-item d-flex align-items-center gap-2 px-3 rounded">
                                    <AppIcon name="user" :size="16" /> My profile
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink :to="{ name: 'preferences' }" class="dropdown-item d-flex align-items-center gap-2 px-3 rounded">
                                    <AppIcon name="adjustments" :size="16" /> Study preferences
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink :to="{ name: 'reports' }" class="dropdown-item d-flex align-items-center gap-2 px-3 rounded">
                                    <AppIcon name="report" :size="16" /> My reports
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink :to="{ name: 'user-account' }" class="dropdown-item d-flex align-items-center gap-2 px-3 rounded">
                                    <AppIcon name="settings" :size="16" /> Account settings
                                </RouterLink>
                            </li>
                            <li>
                                <button type="button" class="dropdown-item d-flex align-items-center gap-2 px-3 rounded" @click="toggleTheme">
                                    <AppIcon :name="isDark ? 'sun' : 'moon'" :size="16" />
                                    {{ isDark ? 'Switch to light mode' : 'Switch to dark mode' }}
                                </button>
                            </li>
                        </ul>
                        <div class="p-2">
                            <button
                                type="button"
                                class="dropdown-item d-flex align-items-center gap-2 px-3 py-2 rounded text-danger"
                                :disabled="loggingOut"
                                @click="logOut"
                            >
                                <span v-if="loggingOut" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                <AppIcon v-else name="log-out" :size="16" />
                                {{ loggingOut ? 'Signing out…' : 'Log out' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="mobileSearch" class="mobile-catalog-search d-md-none">
                <form role="search" class="position-relative" @submit.prevent="goToPrograms">
                    <AppIcon name="search" :size="17" class="search-leading" />
                    <input
                        v-model="query"
                        type="search"
                        class="form-control rounded-pill"
                        style="padding-inline-start: 40px; padding-inline-end: 46px"
                        placeholder="Search universities, programs, cities…"
                        autocomplete="off"
                        autofocus
                    />
                    <button type="button" class="btn btn-sm btn-light position-absolute end-0 top-50 translate-middle-y me-1" @click="resetSearch">
                        <AppIcon name="x" :size="15" />
                    </button>
                </form>
            </div>
        </header>
    </div>
</template>

<style scoped>
.topbar-search .form-control {
    height: 42px;
    border-radius: 999px;
    background-color: var(--dx-topbar-icon-bg-color, rgba(15, 23, 42, 0.05));
    color: var(--dx-topbar-color, inherit);
}

.topbar-search .form-control::placeholder {
    color: var(--dx-topbar-color, inherit);
    opacity: 0.7;
}

.topbar-search .form-control:focus {
    background-color: var(--dx-topbar-icon-bg-color, rgba(15, 23, 42, 0.05));
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
}

.topbar-search .search-leading {
    color: var(--dx-topbar-color, currentColor);
    opacity: 0.6;
}

.uni-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 7px;
    background: linear-gradient(135deg, #2563eb, #0ea5e9);
    color: #fff;
}

.search-leading {
    position: absolute;
    top: 50%;
    left: 14px;
    transform: translateY(-50%);
    color: var(--dx-body-color, #6b7280);
    opacity: 0.65;
    pointer-events: none;
}

.search-kbd {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    font-size: 11px;
    line-height: 1;
    padding: 4px 6px;
    border-radius: 6px;
    border: 1px solid var(--dx-border-color, #e5e7eb);
    color: var(--dx-body-color, #6b7280);
    background: var(--dx-tertiary-bg, #f6f6f6);
}

.catalog-search-panel {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    right: 0;
    z-index: 1055;
    padding: 0;
    max-height: min(460px, 70vh);
    overflow-y: auto;
    border-radius: 14px;
}

.search-group {
    padding: 6px;
}

.search-group + .search-group {
    border-top: 1px solid var(--dx-border-color, #eef0f3);
}

.search-group-title {
    margin: 0;
    padding: 8px 12px 4px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--dx-body-color, #6b7280);
    opacity: 0.75;
}

.search-result {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    border: 0;
    background: transparent;
    border-radius: 10px;
    padding: 9px 12px;
    text-align: left;
}

.search-result:hover,
.search-result:focus-visible {
    background: var(--dx-tertiary-bg, #f4f6f8);
    outline: none;
}

.search-result-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border-radius: 10px;
    background: var(--dx-primary-bg-subtle, #e8f0fb);
    color: var(--dx-primary, #2563eb);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.03em;
}

[data-bs-theme="dark"] .search-result-mark {
    background: rgba(59, 130, 246, 0.22);
    color: #93c5fd;
}

[data-bs-theme="dark"] .search-result:hover,
[data-bs-theme="dark"] .search-result:focus-visible {
    background: rgba(148, 163, 184, 0.14);
}

.search-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    border: 0;
    border-top: 1px solid var(--dx-border-color, #eef0f3);
    background: var(--dx-tertiary-bg, #f8f9fb);
    padding: 11px 16px;
    font-size: 13px;
    font-weight: 600;
    color: var(--dx-primary, #2563eb);
}

.quick-actions-menu {
    min-width: 290px;
}

.quick-actions-title {
    margin: 0;
    padding: 8px 12px 4px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--dx-body-color, #6b7280);
    opacity: 0.75;
}

.notifications-menu {
    width: 350px;
    max-width: calc(100vw - 24px);
}

.notifications-list {
    max-height: 340px;
    overflow-y: auto;
}

.notification-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--dx-border-color, #eef0f3);
}

.notification-row:last-child {
    border-bottom: 0;
}

.notification-count {
    position: absolute;
    top: 2px;
    right: 2px;
    min-width: 17px;
    height: 17px;
    padding: 0 4px;
    border-radius: 999px;
    background: #ef4444;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    line-height: 17px;
    text-align: center;
}

.mobile-catalog-search {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    padding: 10px 12px;
    background: var(--dx-topbar-bg, #fff);
    border-bottom: 1px solid var(--dx-border-color, #eef0f3);
    box-shadow: 0 12px 24px -18px rgba(15, 23, 42, 0.5);
    z-index: 1040;
}
</style>
