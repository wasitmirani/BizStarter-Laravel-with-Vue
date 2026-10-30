<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import UserProfileComponent from './Partials/UserProfileComponent.vue';
import SecurityComponent from './Partials/SecurityComponent.vue';

type TabName = 'account' | 'security';

const route = useRoute();
const router = useRouter();

const tabs: Array<{ name: TabName; label: string; description: string }> = [
    { name: 'account', label: 'Account', description: 'Profile and contact details' },
    { name: 'security', label: 'Security', description: 'Password and account safety' },
];

function tabFromQuery(): TabName {
    return route.query.tab === 'security' ? 'security' : 'account';
}

const active = ref<TabName>(tabFromQuery());

function select(name: TabName, focus = false) {
    active.value = name;
    void router.replace({
        query: name === 'account' ? {} : { tab: name },
    });

    if (focus) {
        requestAnimationFrame(() => {
            document.getElementById(`tab-${name}`)?.focus();
        });
    }
}

function onTabKeydown(event: KeyboardEvent) {
    const index = tabs.findIndex((tab) => tab.name === active.value);
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        const delta = event.key === 'ArrowRight' ? 1 : -1;
        const next = tabs[(index + delta + tabs.length) % tabs.length];
        select(next.name, true);
    } else if (event.key === 'Home') {
        event.preventDefault();
        select(tabs[0].name, true);
    } else if (event.key === 'End') {
        event.preventDefault();
        select(tabs[tabs.length - 1].name, true);
    }
}

watch(
    () => route.query.tab,
    () => {
        active.value = tabFromQuery();
    },
);
</script>

<template>
    <div>
        <header class="lk-page-head">
            <div>
                <h1 class="lk-page-title">My profile</h1>
                <p class="lk-page-subtitle">Manage the identity attached to your admin actions and audit history.</p>
            </div>
        </header>

        <div class="lk-tabs" role="tablist" aria-label="Account sections" @keydown="onTabKeydown">
            <button
                v-for="tab in tabs"
                :id="`tab-${tab.name}`"
                :key="tab.name"
                type="button"
                role="tab"
                class="lk-tab"
                :class="{ 'is-active': active === tab.name }"
                :aria-selected="active === tab.name"
                :aria-controls="`panel-${tab.name}`"
                :tabindex="active === tab.name ? 0 : -1"
                @click="select(tab.name)"
            >
                <span class="lk-tab__label">{{ tab.label }}</span>
                <span class="lk-tab__description">{{ tab.description }}</span>
            </button>
        </div>

        <div
            id="panel-account"
            role="tabpanel"
            aria-labelledby="tab-account"
            :hidden="active !== 'account'"
            style="margin-top: 16px"
        >
            <UserProfileComponent v-if="active === 'account'" />
        </div>

        <div
            id="panel-security"
            role="tabpanel"
            aria-labelledby="tab-security"
            :hidden="active !== 'security'"
            style="margin-top: 16px"
        >
            <SecurityComponent v-if="active === 'security'" />
        </div>
    </div>
</template>

<style scoped>
.lk-tabs {
    display: flex;
    gap: 6px;
    padding: 5px;
    border: 1px solid var(--lk-border);
    border-radius: 11px;
    background: var(--lk-card);
    box-shadow: var(--lk-shadow-card);
    width: fit-content;
    max-width: 100%;
    overflow-x: auto;
}

.lk-tab {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1px;
    padding: 8px 14px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    cursor: pointer;
    text-align: left;
    white-space: nowrap;
}

.lk-tab:hover {
    background: var(--lk-surface);
}

.lk-tab.is-active {
    background: var(--lk-primary-subtle);
}

.lk-tab__label {
    font-size: 13px;
    font-weight: 600;
    color: var(--lk-text-secondary);
}

.lk-tab.is-active .lk-tab__label {
    color: var(--lk-primary-active);
}

.lk-tab__description {
    font-size: 11px;
    color: var(--lk-text-muted);
}

@media (max-width: 767.98px) {
    .lk-tabs {
        width: 100%;
    }

    .lk-tab {
        flex: 1;
    }
}
</style>
