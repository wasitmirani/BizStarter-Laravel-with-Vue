<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SidebarMenu, { type PortalMenuItem } from '../../Utils/Sidebar';
import { usePermissionsStore } from '../../../shared/stores/permissionsStore';
import { useAuthStore } from '../../../shared/stores/authStore';

const props = defineProps<{
    collapsed: boolean;
    mobileOpen: boolean;
}>();

const emit = defineEmits<{
    (e: 'close-mobile'): void;
    (e: 'toggle-collapse'): void;
}>();

const route = useRoute();
const router = useRouter();
const permissions = usePermissionsStore();
permissions.initFromWindow();

const authStore = useAuthStore();
authStore.initFromWindow();

const auth = computed(() => authStore.user);
const appName = computed(() => window.__APP_CONTEXT__?.config.appName ?? 'LaraKit');
const brandInitial = computed(() => appName.value.charAt(0).toUpperCase());
const menu = new SidebarMenu().getMenuList();
const openGroups = ref<string[]>([]);

const can = (permission?: string | null) => !permission || permissions.has(permission);

const visibleMenu = computed(() =>
    menu
        .map((item) => {
            if (item.type === 'heading') return item;
            if (item.type === 'single') return can(item.can) ? item : null;

            const children = (item.children ?? []).filter((child) => can(child.can));
            return children.length ? { ...item, children } : null;
        })
        .filter(Boolean) as PortalMenuItem[],
);

function isActiveLink(link?: string): boolean {
    if (!link) return false;
    return route.path === link;
}

function isGroupActive(item: PortalMenuItem): boolean {
    return (item.children ?? []).some((child) => isActiveLink(child.link));
}

function toggleGroup(title: string) {
    openGroups.value = openGroups.value.includes(title)
        ? openGroups.value.filter((item) => item !== title)
        : [...openGroups.value, title];
}

function navigate() {
    if (props.mobileOpen) emit('close-mobile');
}

function initials(name?: string | null): string {
    return (name ?? '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
}

watch(
    () => route.path,
    () => {
        visibleMenu.value.forEach((item) => {
            if (item.type === 'group' && isGroupActive(item) && !openGroups.value.includes(item.title)) {
                openGroups.value = [...openGroups.value, item.title];
            }
        });
    },
    { immediate: true },
);

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
</script>

<template>
    <aside class="lk-sidebar" aria-label="Main navigation">
        <router-link to="/app/dashboard" class="lk-sidebar__brand" :aria-label="`${appName} dashboard`">
            <span class="lk-sidebar__logo" aria-hidden="true">{{ brandInitial }}</span>
            <span class="lk-sidebar__brand-text">
                <span class="lk-sidebar__brand-name">{{ appName }}</span>
                <span class="lk-sidebar__brand-meta">Admin portal</span>
            </span>
        </router-link>

        <div class="lk-sidebar__workspace">
            <span class="lk-sidebar__workspace-mark" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/></svg>
            </span>
            <span class="lk-sidebar__workspace-text">
                <span class="lk-sidebar__workspace-name">Workspace</span>
                <span class="lk-sidebar__workspace-meta">Operations &amp; access</span>
            </span>
        </div>

        <button type="button" class="lk-sidebar__collapse" aria-label="Toggle sidebar width" @click="emit('toggle-collapse')">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>

        <nav class="lk-nav" aria-label="Primary">
            <template v-for="(item, index) in visibleMenu" :key="item.title + index">
                <p v-if="item.type === 'heading'" class="lk-nav__heading">{{ item.title }}</p>

                <div v-else-if="item.type === 'single'" class="lk-nav__item">
                    <router-link
                        :to="item.link!"
                        class="lk-nav__link"
                        :class="{ 'is-active': isActiveLink(item.link) }"
                        :aria-current="isActiveLink(item.link) ? 'page' : undefined"
                        @click="navigate"
                    >
                        <i :data-lucide="item.icon" class="lk-nav__icon"></i>
                        <span class="lk-nav__label">{{ item.title }}</span>
                    </router-link>
                </div>

                <div v-else class="lk-nav__item">
                    <button
                        type="button"
                        class="lk-nav__toggle"
                        :class="{ 'is-active': isGroupActive(item) }"
                        :aria-expanded="openGroups.includes(item.title)"
                        @click="toggleGroup(item.title)"
                    >
                        <i :data-lucide="item.icon" class="lk-nav__icon"></i>
                        <span class="lk-nav__label">{{ item.title }}</span>
                        <svg class="lk-nav__chevron" :class="{ 'is-open': openGroups.includes(item.title) }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </button>
                    <div v-show="openGroups.includes(item.title)" class="lk-nav__children">
                        <router-link
                            v-for="child in item.children"
                            :key="child.link"
                            :to="child.link!"
                            class="lk-nav__child"
                            :class="{ 'is-active': isActiveLink(child.link) }"
                            :aria-current="isActiveLink(child.link) ? 'page' : undefined"
                            @click="navigate"
                        >
                            {{ child.title }}
                        </router-link>
                    </div>
                </div>
            </template>
        </nav>

        <div class="lk-sidebar__footer">
            <div class="lk-sidebar__account">
                <router-link to="/app/settings/user-account" class="lk-sidebar__user" @click="navigate">
                    <img v-if="auth?.thumbnail" :src="auth.thumbnail" alt="" class="lk-avatar lk-avatar--sm" />
                    <span v-else class="lk-avatar lk-avatar--sm lk-avatar--initials">{{ initials(auth?.name) }}</span>
                    <span class="lk-sidebar__user-text">
                        <span class="lk-sidebar__user-name">{{ auth?.name ?? 'Account' }}</span>
                        <span class="lk-sidebar__user-role">{{ auth?.roles?.[0]?.name ?? 'Member' }}</span>
                    </span>
                </router-link>
                <button type="button" class="lk-sidebar__logout" aria-label="Sign out" title="Sign out" @click="doLogout">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></svg>
                </button>
            </div>
        </div>
    </aside>
</template>
