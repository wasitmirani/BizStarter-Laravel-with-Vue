<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const permissions = computed<string[]>(() => (window as any).permissions ?? []);

const has = (permission?: string | null) => !permission || permissions.value.includes(permission);

type NavItem = { name: string; label: string; icon: string; permission?: string | null };

const workspace: NavItem[] = [
    { name: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
    { name: 'matches', label: 'My matches', icon: 'target-arrow' },
    { name: 'programs', label: 'Programs', icon: 'school' },
    { name: 'universities', label: 'Universities', icon: 'building' },
    { name: 'scholarships', label: 'Scholarships', icon: 'award' },
];

const tracking: NavItem[] = [
    { name: 'applications', label: 'Applications', icon: 'files' },
    { name: 'tasks', label: 'Tasks', icon: 'checks' },
    { name: 'documents', label: 'Documents', icon: 'paperclip' },
    { name: 'reports', label: 'Reports', icon: 'report' },
];

const account: NavItem[] = [
    { name: 'profile', label: 'My profile', icon: 'user' },
    { name: 'preferences', label: 'Preferences', icon: 'adjustments' },
    { name: 'onboarding', label: 'Onboarding', icon: 'list-check' },
];

const administration: NavItem[] = [
    { name: 'users', label: 'Users', icon: 'users', permission: 'users-list' },
    { name: 'roles', label: 'Roles', icon: 'shield', permission: 'roles-list' },
    { name: 'permissions', label: 'Permissions', icon: 'lock', permission: 'permissions-list' },
    { name: 'user-account', label: 'Account settings', icon: 'settings', permission: null },
];

const visible = (items: NavItem[]) => items.filter((item) => has(item.permission));

const isActive = (item: NavItem) => route.name === item.name;
</script>

<template>
    <div>
        <!-- Start::app-sidebar -->
        <div id="main-sidebar" class="main-sidebar">
            <div class="sidebar-wrapper">
                <RouterLink :to="{ name: 'dashboard' }" class="navbar-brand uni-brand" aria-label="UniPilot dashboard">
                    <span class="uni-brand-mark"><AppIcon name="school" :size="19" /></span>
                    <span class="uni-brand-text">
                        <span class="uni-brand-name">UniPilot</span>
                        <span class="uni-brand-sub">Europe</span>
                    </span>
                </RouterLink>

                <div class="navbar-menu px-5" id="navbar-menu-list" data-simplebar>
                    <ul class="list-unstyled p-0 navbar-nav-menu">
                        <li class="nav-menu-title">Admissions</li>
                        <li v-for="item in visible(workspace)" :key="item.name" class="nav-item">
                            <RouterLink :to="{ name: item.name }" class="nav-link" :class="{ active: isActive(item) }">
                                <span class="icons"><AppIcon :name="item.icon" :size="18" /></span>
                                <span class="content">{{ item.label }}</span>
                            </RouterLink>
                        </li>

                        <li class="nav-menu-title mt-3">My workspace</li>
                        <li v-for="item in visible(tracking)" :key="item.name" class="nav-item">
                            <RouterLink :to="{ name: item.name }" class="nav-link" :class="{ active: isActive(item) }">
                                <span class="icons"><AppIcon :name="item.icon" :size="18" /></span>
                                <span class="content">{{ item.label }}</span>
                            </RouterLink>
                        </li>

                        <li class="nav-menu-title mt-3">Account</li>
                        <li v-for="item in visible(account)" :key="item.name" class="nav-item">
                            <RouterLink :to="{ name: item.name }" class="nav-link" :class="{ active: isActive(item) }">
                                <span class="icons"><AppIcon :name="item.icon" :size="18" /></span>
                                <span class="content">{{ item.label }}</span>
                            </RouterLink>
                        </li>

                        <template v-if="visible(administration).length">
                            <li class="nav-menu-title mt-3">Administration</li>
                            <li v-for="item in visible(administration)" :key="item.name" class="nav-item">
                                <RouterLink :to="{ name: item.name }" class="nav-link" :class="{ active: isActive(item) }">
                                    <span class="icons"><AppIcon :name="item.icon" :size="18" /></span>
                                    <span class="content">{{ item.label }}</span>
                                </RouterLink>
                            </li>
                        </template>
                    </ul>
                </div>
            </div>
        </div>
        <!-- End::app-sidebar -->
    </div>
</template>

<style scoped>
.uni-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
}

.uni-brand-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    border-radius: 10px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: #fff;
    box-shadow: 0 10px 20px -12px rgba(99, 102, 241, 0.95);
}

.uni-brand-text {
    display: flex;
    flex-direction: column;
    line-height: 1.05;
}

.uni-brand-name {
    color: var(--dx-sidebar-color, #fff);
    font-size: 17px;
    font-weight: 800;
    letter-spacing: -0.02em;
}

.uni-brand-sub {
    margin-top: 3px;
    color: var(--dx-sidebar-color, #fff);
    opacity: 0.5;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
}

/* Alloce collapses the rail to icons between 992px and 1199px; the wordmark
   would otherwise be clipped by the 75px rail. */
@media (min-width: 992px) and (max-width: 1199.98px) {
    .uni-brand {
        justify-content: center;
        width: 100%;
    }

    .uni-brand-text {
        display: none;
    }
}

[data-sidebar="small"] .uni-brand-text {
    display: none;
}
</style>
