<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Helpers } from '../../Utils/Helper';
import { usePermissionsStore } from '../../../shared/stores/permissionsStore';
import { useAuthStore } from '../../../shared/stores/authStore';
import SearchService from '../../Services/Search/SearchService';
import ActivityService from '../../Services/Activity/ActivityService';

defineProps<{
    collapsed: boolean;
}>();

const emit = defineEmits<{
    (e: 'toggle-sidebar'): void;
}>();

const route = useRoute();
const router = useRouter();
const permissions = usePermissionsStore();
permissions.initFromWindow();

const authStore = useAuthStore();
authStore.initFromWindow();

const auth = computed(() => authStore.user);
const canSearch = computed(
    () => permissions.has('users-list') || permissions.has('roles-list') || permissions.has('permissions-list'),
);

const root = ref<HTMLElement | null>(null);
const searchInput = ref<HTMLInputElement | null>(null);
const searchOpen = ref(false);
const searchTerm = ref('');
const searchLoading = ref(false);
const searchGroups = ref<any[]>([]);
const searchError = ref('');
const selectedIndex = ref(-1);

const profileOpen = ref(false);
const activityOpen = ref(false);
const activityLoading = ref(false);
const activityItems = ref<any[]>([]);
const activityError = ref('');

let debounce: number | null = null;

const pageTitles: Record<string, { section: string; title: string }> = {
    dashboard: { section: 'Overview', title: 'Dashboard' },
    users: { section: 'Access control', title: 'Users' },
    'create-user': { section: 'Access control', title: 'Create user' },
    'edit-user': { section: 'Access control', title: 'Edit user' },
    'show-user': { section: 'Access control', title: 'User details' },
    roles: { section: 'Access control', title: 'Roles' },
    'create-role': { section: 'Access control', title: 'Create role' },
    'edit-role': { section: 'Access control', title: 'Edit role' },
    'show-role': { section: 'Access control', title: 'Role details' },
    permissions: { section: 'Access control', title: 'Permissions' },
    'create-permission': { section: 'Access control', title: 'Create permission' },
    'edit-permission': { section: 'Access control', title: 'Edit permission' },
    'show-permission': { section: 'Access control', title: 'Permission details' },
    activity: { section: 'Operations', title: 'Activity log' },
    reports: { section: 'Operations', title: 'Reports' },
    'user-account': { section: 'Workspace', title: 'My profile' },
    'app-config': { section: 'Workspace', title: 'App config' },
    '401': { section: 'Error', title: 'Not authorised' },
    '404': { section: 'Error', title: 'Not found' },
};

const currentPage = computed(
    () =>
        pageTitles[String(route.name)] ?? {
            section: 'Workspace',
            title: window.__APP_CONTEXT__?.config.appName ?? 'Portal',
        },
);
const initials = computed(() =>
    (auth.value?.name ?? '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join(''),
);
const primaryRole = computed(() => auth.value?.roles?.[0]?.name ?? 'Member');

const flatResults = computed(() =>
    searchGroups.value.flatMap((group: any) => group.items.map((item: any) => ({ group: group.key, item }))),
);

function focusSearch() {
    searchOpen.value = true;
    nextTick(() => searchInput.value?.focus());
}

function onSearchInput() {
    searchError.value = '';
    selectedIndex.value = -1;
    if (debounce) window.clearTimeout(debounce);
    const term = searchTerm.value.trim();

    if (term.length < 2) {
        searchGroups.value = [];
        searchLoading.value = false;
        return;
    }

    searchLoading.value = true;
    debounce = window.setTimeout(async () => {
        try {
            const response = await SearchService.query(term);
            searchGroups.value = response.data?.result?.groups ?? [];
        } catch (error: any) {
            searchGroups.value = [];
            searchError.value = error?.response?.data?.message ?? 'Search is unavailable right now.';
        } finally {
            searchLoading.value = false;
        }
    }, 250);
}

function closeSearch() {
    searchOpen.value = false;
    selectedIndex.value = -1;
}

function selectResult(entry: { group: string; item: any }) {
    closeSearch();
    searchTerm.value = '';

    if (entry.group === 'users') {
        const name = permissions.has('show-user') ? 'show-user' : 'users';
        if (name === 'show-user' && entry.item.id) {
            router.push({ name: 'show-user', params: { uuid: entry.item.id } });
            return;
        }
    }

    const routes: Record<string, string> = {
        users: 'users',
        roles: 'roles',
        permissions: 'permissions',
    };

    router.push({ name: routes[entry.group] ?? 'dashboard' });
}

function onSearchKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
        closeSearch();
        return;
    }

    if (!flatResults.value.length) return;

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        selectedIndex.value = Math.min(selectedIndex.value + 1, flatResults.value.length - 1);
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
    } else if (event.key === 'Enter' && selectedIndex.value >= 0) {
        event.preventDefault();
        selectResult(flatResults.value[selectedIndex.value]);
    }
}

async function loadActivity() {
    if (!permissions.has('activity-list') || activityLoading.value) return;
    activityOpen.value = true;
    activityLoading.value = true;
    activityError.value = '';
    try {
        const response = await ActivityService.list({ per_page: 6 });
        activityItems.value = response.data?.result?.activities?.data ?? [];
    } catch (error: any) {
        activityError.value = error?.response?.data?.message ?? 'Could not load activity.';
    } finally {
        activityLoading.value = false;
    }
}

function onDocumentClick(event: MouseEvent) {
    if (root.value && !root.value.contains(event.target as Node)) {
        profileOpen.value = false;
        activityOpen.value = false;
        closeSearch();
    }
}

function onShortcut(event: KeyboardEvent) {
    const target = event.target as HTMLElement | null;
    const typing = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        focusSearch();
    } else if (event.key === '/' && !typing) {
        event.preventDefault();
        focusSearch();
    }
}

function formatTime(value: string): string {
    return Helpers.HourFormat(value);
}

function doLogout() {
    const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
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

watch(
    () => route.fullPath,
    () => {
        profileOpen.value = false;
        activityOpen.value = false;
        closeSearch();
    },
);

onMounted(() => {
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onShortcut);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keydown', onShortcut);
    if (debounce) window.clearTimeout(debounce);
});
</script>

<template>
    <header ref="root" class="lk-topbar">
        <button type="button" class="lk-topbar__icon-btn" aria-label="Toggle navigation" @click="emit('toggle-sidebar')">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>

        <nav class="lk-breadcrumb" aria-label="Breadcrumb">
            <router-link to="/app/dashboard">Home</router-link>
            <span aria-hidden="true">/</span>
            <span>{{ currentPage.section }}</span>
            <template v-if="currentPage.section !== currentPage.title">
                <span aria-hidden="true">/</span>
                <span class="lk-breadcrumb__current" aria-current="page">{{ currentPage.title }}</span>
            </template>
        </nav>

        <div class="lk-topbar__spacer"></div>

        <div v-if="canSearch" class="lk-topbar__search" @keydown="onSearchKeydown">
            <svg class="lk-search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
                ref="searchInput"
                v-model="searchTerm"
                type="search"
                class="lk-search-input"
                placeholder="Search users, roles, permissions…"
                aria-label="Global search"
                autocomplete="off"
                @focus="searchOpen = true"
                @input="onSearchInput"
            />
            <span class="lk-search-kbd">⌘K</span>

            <div v-if="searchOpen" class="lk-search-panel" role="listbox" aria-label="Search results">
                <div v-if="searchLoading" class="lk-state">
                    <span class="lk-skeleton" style="width: 70%; height: 12px"></span>
                    <span class="lk-skeleton" style="width: 50%; height: 12px"></span>
                </div>

                <div v-else-if="searchError" class="lk-state lk-state--error">
                    <p class="lk-state__text">{{ searchError }}</p>
                </div>

                <div v-else-if="searchTerm.trim().length < 2" class="lk-state">
                    <p class="lk-state__text">Type at least two characters to search.</p>
                </div>

                <div v-else-if="!searchGroups.length" class="lk-state">
                    <p class="lk-state__title">No results</p>
                    <p class="lk-state__text">Nothing matches “{{ searchTerm.trim() }}”.</p>
                </div>

                <template v-else>
                    <div v-for="group in searchGroups" :key="group.key" class="lk-search-group">
                        <p class="lk-search-group__title">{{ group.label }}</p>
                        <button
                            v-for="(item, index) in group.items"
                            :key="group.key + item.id"
                            type="button"
                            class="lk-search-result"
                            :class="{ 'is-selected': flatResults.findIndex((entry: any) => entry.item.id === item.id && entry.group === group.key) === selectedIndex }"
                            role="option"
                            @click="selectResult({ group: group.key, item })"
                        >
                            <img v-if="item.thumbnail" :src="item.thumbnail" alt="" class="lk-avatar lk-avatar--sm" />
                            <span v-else class="lk-avatar lk-avatar--sm lk-avatar--initials">{{ item.title?.charAt(0)?.toUpperCase() }}</span>
                            <span>
                                <span class="lk-search-result__title">{{ item.title }}</span>
                                <span class="lk-search-result__meta">{{ item.subtitle }}</span>
                            </span>
                        </button>
                    </div>
                </template>
            </div>
        </div>

        <div v-if="permissions.has('activity-list')" class="lk-dropdown">
            <button type="button" class="lk-topbar__icon-btn" aria-label="Recent activity" :aria-expanded="activityOpen" @click.stop="activityOpen ? (activityOpen = false) : loadActivity()">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </button>
            <div v-if="activityOpen" class="lk-menu lk-menu--wide" role="menu">
                <div class="lk-menu__header">
                    <p class="lk-menu__title">Recent activity</p>
                    <p class="lk-menu__meta">Latest actions recorded by the portal</p>
                </div>
                <div v-if="activityLoading" class="lk-state">
                    <span class="lk-skeleton" style="width: 80%; height: 12px"></span>
                </div>
                <div v-else-if="activityError" class="lk-state lk-state--error">
                    <p class="lk-state__text">{{ activityError }}</p>
                </div>
                <div v-else-if="!activityItems.length" class="lk-state">
                    <p class="lk-state__text">No activity has been recorded yet.</p>
                </div>
                <template v-else>
                    <div v-for="item in activityItems" :key="item.id" class="lk-menu__item" style="cursor: default">
                        <span class="lk-activity-item__dot" style="margin-top: 5px"></span>
                        <span>
                            <span class="lk-search-result__title">{{ item.description }}</span>
                            <span class="lk-search-result__meta">{{ item.causer?.name ?? 'System' }} · {{ formatTime(item.created_at) }}</span>
                        </span>
                    </div>
                </template>
                <div class="lk-menu__separator"></div>
                <router-link to="/app/activity" class="lk-menu__item" @click="activityOpen = false">View full activity log</router-link>
            </div>
        </div>

        <div class="lk-dropdown">
            <button type="button" class="lk-topbar__user" :aria-expanded="profileOpen" @click.stop="profileOpen = !profileOpen">
                <img v-if="auth?.thumbnail" :src="auth.thumbnail" alt="" class="lk-avatar" />
                <span v-else class="lk-avatar lk-avatar--initials">{{ initials }}</span>
                <span class="lk-topbar__user-text">
                    <span class="lk-topbar__user-name">{{ auth?.name ?? 'Account' }}</span>
                    <span class="lk-topbar__user-role">{{ primaryRole }}</span>
                </span>
            </button>
            <div v-if="profileOpen" class="lk-menu" role="menu">
                <div class="lk-menu__header">
                    <p class="lk-menu__title">{{ auth?.name ?? 'Account' }}</p>
                    <p class="lk-menu__meta">{{ auth?.email ?? '' }}</p>
                </div>
                <router-link to="/app/settings/user-account" class="lk-menu__item" @click="profileOpen = false">My profile</router-link>
                <router-link to="/app/settings/user-account" class="lk-menu__item" @click="profileOpen = false">Account settings</router-link>
                <router-link to="/app/settings/user-account?tab=security" class="lk-menu__item" @click="profileOpen = false">Change password</router-link>
                <div class="lk-menu__separator"></div>
                <button type="button" class="lk-menu__item lk-menu__item--danger" @click="doLogout">Sign out</button>
            </div>
        </div>
    </header>
</template>
