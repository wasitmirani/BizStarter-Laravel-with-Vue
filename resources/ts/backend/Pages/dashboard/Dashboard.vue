<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import DashboardService from '../../Services/Dashboard/DashboardService';
import WorkspaceService, { type WorkspacePayload } from '../../Services/Workspace/WorkspaceService';
import { Helpers } from '../../Utils/Helper';
import { chartTheme, loadApexCharts } from '../../Utils/apex';
import { useAuthStore } from '../../../shared/stores/authStore';

type Range = 7 | 30 | 90;

const authStore = useAuthStore();
authStore.initFromWindow();
const auth = computed(() => authStore.user);

const range = ref<Range>(30);
const loading = ref(true);
const error = ref('');
const payload = ref<any>(null);

const trendChart = ref<HTMLElement | null>(null);
const roleChart = ref<HTMLElement | null>(null);
let trendInstance: { destroy: () => void } | null = null;
let roleInstance: { destroy: () => void } | null = null;

const stats = computed(() => payload.value?.stats ?? null);
const quickActions = computed(() => payload.value?.quick_actions ?? {});
const workspace = ref<WorkspacePayload | null>(null);
const seat = computed(() => workspace.value?.usage?.members ?? null);
const subscription = computed(() => workspace.value?.subscription ?? null);
const recentActivity = computed<any[]>(() => payload.value?.recent_activity ?? []);
const recentUsers = computed<any[]>(() => payload.value?.recent_users ?? []);
const roleDistribution = computed<any[]>(() => payload.value?.role_distribution ?? []);
const hasActivity = computed(() => recentActivity.value.length > 0);

const crm = computed<any>(() => ({
    contacts: 0,
    open_conversations: 0,
    unread_messages: 0,
    messages_today: 0,
    campaigns: 0,
    campaigns_sent: 0,
    campaigns_scheduled: 0,
    campaigns_draft: 0,
    whatsapp_conversations: 0,
    instagram_conversations: 0,
    messages_by_day: [],
    recent_conversations: [],
    ...(payload.value?.crm ?? {}),
}));

const recentConversations = computed<any[]>(() => crm.value.recent_conversations ?? []);

const onboarding = computed<any>(() => payload.value?.onboarding ?? null);
const onboardingDismissed = ref(false);
const showOnboarding = computed(
    () => Boolean(onboarding.value) && !onboarding.value.is_complete && !onboardingDismissed.value,
);

watch(
    onboarding,
    (value) => {
        if (!value?.workspace_id) return;
        onboardingDismissed.value = localStorage.getItem(`lk-onboarding:${value.workspace_id}`) === '1';
    },
    { immediate: true },
);

function dismissOnboarding() {
    onboardingDismissed.value = true;

    if (onboarding.value?.workspace_id) {
        localStorage.setItem(`lk-onboarding:${onboarding.value.workspace_id}`, '1');
    }
}

const firstName = computed(() => {
    const name = String(auth.value?.name ?? '').trim();
    return name ? name.split(' ')[0] : 'there';
});

const greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
});

const today = computed(() =>
    new Intl.DateTimeFormat(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(
        new Date(),
    ),
);

const ranges = [
    { value: 7 as Range, label: '7d' },
    { value: 30 as Range, label: '30d' },
    { value: 90 as Range, label: '90d' },
];

const campaignRate = computed(() => {
    const total = Number(crm.value.campaigns ?? 0);
    if (!total) return 0;
    return Math.min(100, Math.round((Number(crm.value.campaigns_sent ?? 0) / total) * 100));
});

const channelTotal = computed(
    () => Number(crm.value.whatsapp_conversations ?? 0) + Number(crm.value.instagram_conversations ?? 0),
);

const whatsappShare = computed(() => {
    if (!channelTotal.value) return 0;
    return Math.round((Number(crm.value.whatsapp_conversations ?? 0) / channelTotal.value) * 100);
});

const instagramShare = computed(() => (channelTotal.value ? 100 - whatsappShare.value : 0));

const messageTrend = computed(() => fillSeries(crm.value.messages_by_day ?? [], 14));

const sparkPoints = computed(() => {
    const values = messageTrend.value.values;
    const max = Math.max(1, ...values);
    const step = 100 / Math.max(1, values.length - 1);

    return values
        .map((value, index) => `${(index * step).toFixed(1)},${(30 - (value / max) * 26).toFixed(1)}`)
        .join(' ');
});

const sparkArea = computed(() => `0,34 ${sparkPoints.value} 100,34`);

function formatNumber(value: number | null | undefined): string {
    return new Intl.NumberFormat().format(Number(value ?? 0));
}

function formatRelative(value?: string | null): string {
    if (!value) return '';
    return Helpers.HourFormat(value);
}

function initials(name?: string | null): string {
    return (name ?? '?')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
}

function statusLabel(status?: string | null): string {
    return status === 'open' ? 'Open' : status === 'pending' ? 'Pending' : 'Closed';
}

function changeLabel(change: number | null | undefined): string {
    if (change === null || change === undefined) return 'New baseline';
    if (change === 0) return 'No change';
    const sign = change > 0 ? '+' : '';
    return `${sign}${change}%`;
}

function changeClass(change: number | null | undefined): string {
    if (change === null || change === undefined || change === 0) return 'lk-trend--flat';
    return change > 0 ? 'lk-trend--up' : 'lk-trend--down';
}

function fillSeries(rows: any[], days: number) {
    const map = new Map<string, number>();
    rows.forEach((row: any) => {
        const key = String(row.date).slice(0, 10);
        map.set(key, Number(row.total ?? 0));
    });

    const categories: string[] = [];
    const values: number[] = [];
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (days - 1));

    for (let index = 0; index < days; index++) {
        const day = new Date(start);
        day.setDate(start.getDate() + index);
        const key = day.toISOString().slice(0, 10);
        categories.push(
            new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' }).format(day),
        );
        values.push(map.get(key) ?? 0);
    }

    return { categories, values };
}

async function renderCharts() {
    await nextTick();

    const theme = chartTheme();

    try {
        const ApexCharts = await loadApexCharts();

        if (trendChart.value) {
            trendInstance?.destroy();
            const { categories, values } = fillSeries(payload.value?.users_by_day ?? [], range.value);
            trendInstance = new ApexCharts(trendChart.value, {
                chart: {
                    type: 'area',
                    height: 280,
                    toolbar: { show: false },
                    fontFamily: 'Inter, sans-serif',
                    animations: { enabled: !window.matchMedia('(prefers-reduced-motion: reduce)').matches },
                },
                series: [{ name: 'New users', data: values }],
                xaxis: {
                    categories,
                    labels: { style: { colors: theme.text, fontSize: '11px' }, tickAmount: 6 },
                    axisBorder: { show: false },
                    axisTicks: { show: false },
                },
                yaxis: {
                    labels: { style: { colors: theme.text, fontSize: '11px' }, formatter: (value: number) => String(Math.round(value)) },
                },
                grid: { borderColor: theme.grid, strokeDashArray: 4 },
                stroke: { curve: 'smooth', width: 2.5 },
                colors: [theme.primary],
                fill: {
                    type: 'gradient',
                    gradient: { shadeIntensity: 1, opacityFrom: 0.28, opacityTo: 0.02, stops: [0, 100] },
                },
                dataLabels: { enabled: false },
                tooltip: { theme: 'light', y: { formatter: (value: number) => `${value} new user${value === 1 ? '' : 's'}` } },
                noData: { text: 'No signups in this period', style: { color: theme.text } },
            });
        }

        if (roleChart.value && roleDistribution.value.length) {
            roleInstance?.destroy();
            roleInstance = new ApexCharts(roleChart.value, {
                chart: {
                    type: 'donut',
                    height: 250,
                    fontFamily: 'Inter, sans-serif',
                    animations: { enabled: !window.matchMedia('(prefers-reduced-motion: reduce)').matches },
                },
                labels: roleDistribution.value.map((role: any) => role.name),
                series: roleDistribution.value.map((role: any) => Number(role.users_count ?? 0)),
                colors: ['#059669', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#14b8a6'],
                legend: {
                    position: 'bottom',
                    fontSize: '12px',
                    labels: { colors: theme.text },
                    markers: { size: 5 },
                },
                dataLabels: { enabled: false },
                stroke: { width: 2, colors: [theme.surface] },
                plotOptions: {
                    pie: {
                        donut: {
                            size: '68%',
                            labels: {
                                show: true,
                                total: {
                                    show: true,
                                    label: 'Users',
                                    fontSize: '11px',
                                    color: theme.text,
                                    formatter: () => `${stats.value?.users?.total ?? 0}`,
                                },
                                value: { fontSize: '20px', fontWeight: 700, color: theme.text },
                            },
                        },
                    },
                },
                tooltip: { theme: 'light' },
            });
        }
    } catch (chartError) {
        // Charts are progressive enhancement: the tables and KPIs remain usable.
        console.warn('[Dashboard] Charts unavailable', chartError);
    }
}

async function load() {
    loading.value = true;
    error.value = '';

    try {
        const response = await DashboardService.getStats(range.value);
        payload.value = response.data?.result ?? null;
    } catch (requestError: any) {
        error.value = requestError?.response?.data?.message ?? 'We could not load the dashboard right now.';
        payload.value = null;
    } finally {
        loading.value = false;
    }

    if (!error.value && payload.value) {
        await renderCharts();
    }
}

function setRange(value: Range) {
    if (range.value === value) return;
    range.value = value;
}

watch(range, () => {
    void load();
});

async function loadWorkspace() {
    try {
        workspace.value = (await WorkspaceService.show()).data.result;
    } catch {
        workspace.value = null;
    }
}

onMounted(() => {
    void load();
    void loadWorkspace();
});

onBeforeUnmount(() => {
    trendInstance?.destroy();
    roleInstance?.destroy();
});

const actions = computed(() => [
    {
        show: Boolean(quickActions.value?.create_user),
        label: 'Create user',
        hint: 'Invite a teammate',
        icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM19 8v6M22 11h-6',
        route: { name: 'create-user' },
    },
    {
        show: Boolean(quickActions.value?.manage_roles),
        label: 'Manage roles',
        hint: 'Review access levels',
        icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
        route: { name: 'roles' },
    },
    {
        show: Boolean(quickActions.value?.manage_permissions),
        label: 'Permissions',
        hint: 'Audit capabilities',
        icon: 'm21 2-2 2m-7.6 7.6a5.5 5.5 0 1 1-7.8 7.8 5.5 5.5 0 0 1 7.8-7.8zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4',
        route: { name: 'permissions' },
    },
    {
        show: Boolean(quickActions.value?.view_reports),
        label: 'Open reports',
        hint: 'Export user data',
        icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
        route: { name: 'reports' },
    },
]);
</script>

<template>
    <div class="lk-dashboard">
        <header class="lk-dash-hero">
            <div class="lk-dash-hero__main">
                <p class="lk-dash-hero__eyebrow">{{ today }}</p>
                <h1 class="lk-dash-hero__title">{{ greeting }}, {{ firstName }}</h1>
                <p class="lk-dash-hero__sub">
                    {{ stats ? `Here is what is happening across your workspace over the last ${stats.range.days} days.` : 'Here is what is happening across your workspace.' }}
                </p>
                <div class="lk-dash-hero__meta">
                    <span v-if="workspace" class="lk-dash-pill">
                        <span class="lk-dash-pill__dot"></span>
                        {{ workspace.workspace.name }}
                    </span>
                    <span v-if="workspace?.plan" class="lk-dash-pill">{{ workspace.plan.name }} plan</span>
                    <span class="lk-dash-pill">{{ formatNumber(crm.open_conversations) }} open conversations</span>
                    <span v-if="crm.unread_messages" class="lk-dash-pill lk-dash-pill--accent">
                        {{ formatNumber(crm.unread_messages) }} unread
                    </span>
                </div>
            </div>

            <div class="lk-dash-hero__actions">
                <div class="lk-segmented" role="group" aria-label="Dashboard reporting range">
                    <button
                        v-for="option in ranges"
                        :key="option.value"
                        type="button"
                        :class="{ 'is-active': range === option.value }"
                        :aria-pressed="range === option.value"
                        @click="setRange(option.value)"
                    >
                        {{ option.label }}
                    </button>
                </div>
                <router-link :to="{ name: 'crm-inbox' }" class="lk-btn lk-btn--primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    Open inbox
                </router-link>
                <router-link v-if="quickActions?.view_reports" :to="{ name: 'reports' }" class="lk-btn lk-btn--ghost">
                    Reports
                </router-link>
            </div>
        </header>

        <div v-if="loading" class="lk-dash-kpis" aria-busy="true" aria-label="Loading dashboard metrics">
            <div v-for="index in 4" :key="index" class="lk-dash-kpi">
                <span class="lk-skeleton" style="display: block; width: 38%; height: 12px"></span>
                <span class="lk-skeleton" style="display: block; width: 55%; height: 32px; margin-top: 14px"></span>
                <span class="lk-skeleton" style="display: block; width: 72%; height: 10px; margin-top: 14px"></span>
            </div>
        </div>

        <div v-else-if="error" class="lk-card">
            <div class="lk-state lk-state--error">
                <span class="lk-state__icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></svg>
                </span>
                <p class="lk-state__title">Dashboard unavailable</p>
                <p class="lk-state__text">{{ error }}</p>
                <button type="button" class="lk-btn lk-btn--secondary lk-btn--sm" style="margin-top: 8px" @click="load">
                    Try again
                </button>
            </div>
        </div>

        <template v-else-if="stats">
            <section v-if="showOnboarding" class="lk-card lk-onboarding" aria-label="Workspace setup checklist">
                <div class="lk-card__head lk-onboarding__head">
                    <div class="lk-onboarding__intro">
                        <span class="lk-badge lk-badge--info">Getting started</span>
                        <h2 class="lk-card__title">Finish setting up your workspace</h2>
                        <p class="lk-card__meta">
                            {{ onboarding.completed }} of {{ onboarding.total }} steps complete — a few minutes to a fully working shared inbox.
                        </p>
                    </div>
                    <div class="lk-onboarding__progress">
                        <span>{{ onboarding.percent }}%</span>
                        <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" @click="dismissOnboarding">
                            Hide
                        </button>
                    </div>
                </div>
                <div class="lk-card__body">
                    <div class="lk-onboarding__bar" role="progressbar" :aria-valuenow="onboarding.percent" aria-valuemin="0" aria-valuemax="100">
                        <span :style="{ width: `${onboarding.percent}%` }"></span>
                    </div>
                    <ul class="lk-onboarding__list">
                        <li
                            v-for="step in onboarding.steps"
                            :key="step.key"
                            class="lk-onboarding__item"
                            :class="{ 'is-done': step.done }"
                        >
                            <span class="lk-onboarding__check" aria-hidden="true">
                                <svg v-if="step.done" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                            </span>
                            <span class="lk-onboarding__main">
                                <span class="lk-onboarding__label">{{ step.label }}</span>
                                <span class="lk-onboarding__desc">{{ step.description }}</span>
                            </span>
                            <span v-if="step.done" class="lk-badge lk-badge--success">Done</span>
                            <router-link v-else :to="{ name: step.route }" class="lk-btn lk-btn--secondary lk-btn--sm">
                                {{ step.cta }}
                            </router-link>
                        </li>
                    </ul>
                </div>
            </section>

            <section class="lk-dash-kpis" aria-label="Inbox performance">
                <article class="lk-dash-kpi is-green">
                    <div class="lk-dash-kpi__top">
                        <span class="lk-dash-kpi__icon" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                        </span>
                        <span v-if="crm.unread_messages" class="lk-dash-kpi__flag">{{ formatNumber(crm.unread_messages) }} unread</span>
                    </div>
                    <p class="lk-dash-kpi__label">Open conversations</p>
                    <p class="lk-dash-kpi__value">{{ formatNumber(crm.open_conversations) }}</p>
                    <p class="lk-dash-kpi__sub">Across WhatsApp and Instagram</p>
                </article>

                <article class="lk-dash-kpi is-blue">
                    <div class="lk-dash-kpi__top">
                        <span class="lk-dash-kpi__icon" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                        </span>
                        <span class="lk-dash-kpi__trend">Last 14 days</span>
                    </div>
                    <p class="lk-dash-kpi__label">Messages today</p>
                    <p class="lk-dash-kpi__value">{{ formatNumber(crm.messages_today) }}</p>
                    <div class="lk-dash-kpi__spark" aria-hidden="true">
                        <svg viewBox="0 0 100 34" preserveAspectRatio="none">
                            <polygon :points="sparkArea" class="lk-dash-spark__area" />
                            <polyline :points="sparkPoints" class="lk-dash-spark__line" />
                        </svg>
                    </div>
                </article>

                <article class="lk-dash-kpi is-violet">
                    <div class="lk-dash-kpi__top">
                        <span class="lk-dash-kpi__icon" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                        </span>
                        <span class="lk-dash-kpi__trend">{{ formatNumber(stats.users.new_in_period) }} new · {{ stats.range.days }}d</span>
                    </div>
                    <p class="lk-dash-kpi__label">Contacts</p>
                    <p class="lk-dash-kpi__value">{{ formatNumber(crm.contacts) }}</p>
                    <p class="lk-dash-kpi__sub">{{ formatNumber(stats.users.total) }} people in your workspace</p>
                </article>

                <article class="lk-dash-kpi is-amber">
                    <div class="lk-dash-kpi__top">
                        <span class="lk-dash-kpi__icon" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-8-8 18-2-8Z" /></svg>
                        </span>
                        <span class="lk-dash-kpi__trend">{{ campaignRate }}% sent</span>
                    </div>
                    <p class="lk-dash-kpi__label">Campaigns sent</p>
                    <p class="lk-dash-kpi__value">{{ formatNumber(crm.campaigns_sent) }}</p>
                    <div class="lk-dash-kpi__meter">
                        <span :style="{ width: `${campaignRate}%` }"></span>
                    </div>
                    <p class="lk-dash-kpi__sub">
                        {{ formatNumber(crm.campaigns) }} total · {{ formatNumber(crm.campaigns_scheduled) }} scheduled
                    </p>
                </article>
            </section>

            <div class="lk-dash-columns lk-dash-columns--main">
                <section class="lk-card lk-dash-panel">
                    <div class="lk-card__head">
                        <div>
                            <h2 class="lk-card__title">Recent conversations</h2>
                            <p class="lk-card__meta">The latest activity in your shared inbox</p>
                        </div>
                        <router-link :to="{ name: 'crm-inbox' }" class="lk-btn lk-btn--ghost lk-btn--sm">
                            View all
                        </router-link>
                    </div>

                    <ul v-if="recentConversations.length" class="lk-dash-convos">
                        <li v-for="conversation in recentConversations" :key="conversation.id">
                            <router-link
                                :to="{ name: 'crm-inbox', query: { conversation: conversation.id } }"
                                class="lk-dash-convo"
                            >
                                <span class="lk-dash-convo__avatar" :class="`is-${conversation.channel}`">
                                    {{ initials(conversation.contact?.name) }}
                                    <span class="lk-dash-convo__channel-dot" aria-hidden="true"></span>
                                </span>
                                <span class="lk-dash-convo__main">
                                    <span class="lk-dash-convo__top">
                                        <strong>{{ conversation.contact?.name ?? 'Unknown contact' }}</strong>
                                        <small>{{ formatRelative(conversation.last_message_at) }}</small>
                                    </span>
                                    <span class="lk-dash-convo__preview">{{ conversation.preview ?? 'No messages yet' }}</span>
                                </span>
                                <span class="lk-dash-convo__meta">
                                    <span class="lk-badge" :class="conversation.status === 'open' ? 'lk-badge--success' : conversation.status === 'pending' ? 'lk-badge--warning' : 'lk-badge--neutral'">
                                        {{ statusLabel(conversation.status) }}
                                    </span>
                                    <span class="lk-dash-convo__channel" :class="`is-${conversation.channel}`">{{ conversation.channel }}</span>
                                    <span v-if="conversation.unread_count" class="lk-dash-convo__unread">{{ conversation.unread_count }}</span>
                                </span>
                            </router-link>
                        </li>
                    </ul>

                    <div v-else class="lk-dash-empty">
                        <span class="lk-dash-empty__icon" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                        </span>
                        <p class="lk-state__title">No conversations yet</p>
                        <p class="lk-state__text">Connect a channel and your first messages will show up here.</p>
                        <div class="lk-dash-empty__actions">
                            <router-link :to="{ name: 'whatsapp-settings' }" class="lk-btn lk-btn--secondary lk-btn--sm">Connect WhatsApp</router-link>
                            <router-link :to="{ name: 'crm-contacts' }" class="lk-btn lk-btn--ghost lk-btn--sm">Add contact</router-link>
                        </div>
                    </div>
                </section>

                <div class="lk-dash-stack">
                    <section v-if="workspace" class="lk-card">
                        <div class="lk-card__head">
                            <div>
                                <h2 class="lk-card__title">Plan &amp; usage</h2>
                                <p class="lk-card__meta">{{ workspace.plan?.name ?? 'No plan' }}</p>
                            </div>
                            <span
                                class="lk-badge"
                                :class="subscription?.is_trialing ? 'lk-badge--info' : 'lk-badge--success'"
                            >
                                {{ subscription?.is_trialing ? `Trial · ${subscription.trial_days_left}d` : (subscription?.status ?? 'inactive') }}
                            </span>
                        </div>
                        <div class="lk-card__body lk-dash-plan">
                            <template v-if="seat">
                                <div class="lk-dash-plan__row">
                                    <span>Team seats</span>
                                    <strong>{{ seat.used }} / {{ seat.unlimited ? '∞' : seat.limit }}</strong>
                                </div>
                                <div class="lk-dash-meter"><span :style="{ width: `${seat.percent}%` }"></span></div>
                            </template>
                            <ul class="lk-dash-plan__facts">
                                <li>
                                    <span>Pending invites</span>
                                    <strong>{{ formatNumber(workspace.stats.pending_invitations) }}</strong>
                                </li>
                                <li>
                                    <span>Open invoices</span>
                                    <strong>{{ formatNumber(workspace.stats.open_invoices) }}</strong>
                                </li>
                            </ul>
                            <div class="lk-dash-plan__actions">
                                <router-link :to="{ name: 'billing' }" class="lk-btn lk-btn--secondary lk-btn--sm">Billing</router-link>
                                <router-link :to="{ name: 'team' }" class="lk-btn lk-btn--ghost lk-btn--sm">Invite team</router-link>
                            </div>
                        </div>
                    </section>

                    <section class="lk-card">
                        <div class="lk-card__head">
                            <div>
                                <h2 class="lk-card__title">Channel mix</h2>
                                <p class="lk-card__meta">Conversations by source</p>
                            </div>
                        </div>
                        <div class="lk-card__body lk-dash-channels">
                            <div class="lk-dash-channels__total">
                                <strong>{{ formatNumber(channelTotal) }}</strong>
                                <span>total conversations</span>
                            </div>
                            <div v-if="channelTotal" class="lk-dash-mix" aria-hidden="true">
                                <span class="is-whatsapp" :style="{ width: `${whatsappShare}%` }"></span>
                                <span class="is-instagram" :style="{ width: `${instagramShare}%` }"></span>
                            </div>
                            <ul class="lk-dash-legend">
                                <li>
                                    <span class="lk-dash-legend__dot is-whatsapp"></span>
                                    WhatsApp
                                    <strong>{{ formatNumber(crm.whatsapp_conversations) }}</strong>
                                </li>
                                <li>
                                    <span class="lk-dash-legend__dot is-instagram"></span>
                                    Instagram
                                    <strong>{{ formatNumber(crm.instagram_conversations) }}</strong>
                                </li>
                            </ul>
                            <p v-if="!channelTotal" class="lk-state__text">No conversations yet.</p>
                        </div>
                    </section>
                </div>
            </div>

            <section class="lk-dash-team" aria-label="Team overview">
                <div class="lk-dash-team__item">
                    <span class="lk-dash-team__label">Total users</span>
                    <strong>{{ formatNumber(stats.users.total) }}</strong>
                </div>
                <div class="lk-dash-team__item">
                    <span class="lk-dash-team__label">Active</span>
                    <strong>{{ formatNumber(stats.users.active) }}</strong>
                </div>
                <div class="lk-dash-team__item">
                    <span class="lk-dash-team__label">New · {{ stats.range.days }}d</span>
                    <strong>{{ formatNumber(stats.users.new_in_period) }}</strong>
                    <span class="lk-trend" :class="changeClass(stats.users.change_pct)">{{ changeLabel(stats.users.change_pct) }}</span>
                </div>
                <div class="lk-dash-team__item">
                    <span class="lk-dash-team__label">Sign-ins · {{ stats.range.days }}d</span>
                    <strong>{{ formatNumber(stats.logins.in_period) }}</strong>
                    <span class="lk-trend" :class="changeClass(stats.logins.change_pct)">{{ changeLabel(stats.logins.change_pct) }}</span>
                </div>
                <div class="lk-dash-team__item">
                    <span class="lk-dash-team__label">Audit events</span>
                    <strong>{{ formatNumber(stats.activity.in_period) }}</strong>
                </div>
                <div class="lk-dash-team__item">
                    <span class="lk-dash-team__label">Roles · permissions</span>
                    <strong>{{ formatNumber(stats.roles.total) }} <span class="lk-dash-team__muted">/ {{ formatNumber(stats.permissions.total) }}</span></strong>
                </div>
            </section>

            <div class="lk-dash-columns lk-dash-columns--charts">
                <section class="lk-card">
                    <div class="lk-card__head">
                        <div>
                            <h2 class="lk-card__title">User growth</h2>
                            <p class="lk-card__meta">New accounts created per day, {{ stats.range.from }} → {{ stats.range.to }}</p>
                        </div>
                    </div>
                    <div class="lk-card__body">
                        <div v-if="stats.users.new_in_period === 0" class="lk-state">
                            <p class="lk-state__title">No new accounts yet</p>
                            <p class="lk-state__text">No users were created during this period. Try a wider range.</p>
                        </div>
                        <div v-show="stats.users.new_in_period > 0" ref="trendChart" class="lk-chart"></div>
                    </div>
                </section>

                <section class="lk-card">
                    <div class="lk-card__head">
                        <div>
                            <h2 class="lk-card__title">Role distribution</h2>
                            <p class="lk-card__meta">Users assigned to each role</p>
                        </div>
                    </div>
                    <div class="lk-card__body">
                        <div v-if="!roleDistribution.length" class="lk-state">
                            <p class="lk-state__title">No roles assigned</p>
                            <p class="lk-state__text">Create roles and assign them to users to see the distribution.</p>
                        </div>
                        <div v-show="roleDistribution.length" ref="roleChart" class="lk-chart"></div>
                    </div>
                </section>
            </div>

            <div class="lk-dash-columns lk-dash-columns--bottom">
                <section class="lk-card">
                    <div class="lk-card__head">
                        <div>
                            <h2 class="lk-card__title">Recent activity</h2>
                            <p class="lk-card__meta">Actions recorded by the audit log</p>
                        </div>
                        <router-link v-if="quickActions?.view_activity" :to="{ name: 'activity' }" class="lk-btn lk-btn--ghost lk-btn--sm">
                            View all
                        </router-link>
                    </div>
                    <ul v-if="hasActivity" class="lk-activity-list">
                        <li v-for="item in recentActivity" :key="item.id" class="lk-activity-item">
                            <span class="lk-activity-item__dot" aria-hidden="true"></span>
                            <div>
                                <p class="lk-activity-item__text">{{ item.description }}</p>
                                <p class="lk-activity-item__meta">
                                    {{ item.causer?.name ?? 'System' }} · {{ formatRelative(item.created_at) }}
                                </p>
                            </div>
                        </li>
                    </ul>
                    <div v-else class="lk-state">
                        <p class="lk-state__title">No activity yet</p>
                        <p class="lk-state__text">Audit events will appear here as soon as people start working.</p>
                    </div>
                </section>

                <div class="lk-dash-stack">
                    <section class="lk-card">
                        <div class="lk-card__head">
                            <div>
                                <h2 class="lk-card__title">Quick actions</h2>
                                <p class="lk-card__meta">Available for your role</p>
                            </div>
                        </div>
                        <div class="lk-card__body">
                            <div v-if="actions.some((action) => action.show)" class="lk-quick-actions">
                                <router-link
                                    v-for="action in actions.filter((entry) => entry.show)"
                                    :key="action.label"
                                    :to="action.route"
                                    class="lk-quick-action"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="action.icon" /></svg>
                                    <span>
                                        <span class="lk-quick-action__label">{{ action.label }}</span>
                                        <span class="lk-quick-action__hint">{{ action.hint }}</span>
                                    </span>
                                </router-link>
                            </div>
                            <p v-else class="lk-state__text">Your role does not include management actions.</p>
                        </div>
                    </section>

                    <section class="lk-card">
                        <div class="lk-card__head">
                            <div>
                                <h2 class="lk-card__title">Newest members</h2>
                                <p class="lk-card__meta">Recently created accounts</p>
                            </div>
                        </div>
                        <ul v-if="recentUsers.length" class="lk-list">
                            <li v-for="user in recentUsers" :key="user.id" class="lk-list__row">
                                <img v-if="user.thumbnail" :src="user.thumbnail" alt="" class="lk-avatar lk-avatar--sm" />
                                <span v-else class="lk-avatar lk-avatar--sm lk-avatar--initials">
                                    {{ user.name?.charAt(0)?.toUpperCase() ?? '?' }}
                                </span>
                                <span class="lk-list__main">
                                    <router-link
                                        v-if="quickActions?.view_user && user.uuid"
                                        :to="{ name: 'show-user', params: { uuid: user.uuid } }"
                                        class="lk-list__title"
                                    >
                                        {{ user.name }}
                                    </router-link>
                                    <span v-else class="lk-list__title">{{ user.name }}</span>
                                    <span class="lk-list__meta">{{ user.email }}</span>
                                </span>
                                <span class="lk-badge" :class="user.is_active ? 'lk-badge--success' : 'lk-badge--neutral'">
                                    {{ user.is_active ? 'Active' : 'Inactive' }}
                                </span>
                            </li>
                        </ul>
                        <div v-else class="lk-state">
                            <p class="lk-state__text">No users have been created yet.</p>
                        </div>
                    </section>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
/* ---------- Hero ---------- */

.lk-dash-hero {
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
    padding: 22px 24px;
    margin-bottom: 16px;
    border: 1px solid color-mix(in srgb, var(--lk-primary) 18%, var(--lk-border));
    border-radius: 18px;
    overflow: hidden;
    background:
        radial-gradient(circle at 92% -30%, color-mix(in srgb, var(--lk-primary) 22%, transparent), transparent 55%),
        radial-gradient(circle at 2% 120%, color-mix(in srgb, #3b82f6 14%, transparent), transparent 48%),
        linear-gradient(135deg, var(--lk-card), color-mix(in srgb, var(--lk-primary) 5%, var(--lk-card)));
    box-shadow: var(--lk-shadow-card);
}

.lk-dash-hero::after {
    content: '';
    position: absolute;
    right: 18%;
    top: -60px;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    border: 1px solid color-mix(in srgb, var(--lk-primary) 16%, transparent);
    pointer-events: none;
}

.lk-dash-hero__main {
    min-width: 0;
}

.lk-dash-hero__eyebrow {
    margin: 0 0 4px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--lk-primary-active);
}

.lk-dash-hero__title {
    margin: 0;
    font-size: 27px;
    line-height: 1.15;
    letter-spacing: -0.035em;
    font-weight: 800;
    color: var(--lk-text);
}

.lk-dash-hero__sub {
    margin: 6px 0 0;
    font-size: 13px;
    color: var(--lk-text-secondary);
}

.lk-dash-hero__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 14px;
}

.lk-dash-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border: 1px solid var(--lk-border);
    border-radius: 999px;
    background: color-mix(in srgb, var(--lk-card) 70%, transparent);
    backdrop-filter: blur(4px);
    font-size: 11px;
    font-weight: 600;
    color: var(--lk-text-secondary);
}

.lk-dash-pill__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--lk-primary);
}

.lk-dash-pill--accent {
    border-color: color-mix(in srgb, #f59e0b 35%, var(--lk-border));
    background: color-mix(in srgb, #f59e0b 10%, transparent);
    color: #b45309;
}

.lk-dash-hero__actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.lk-dash-hero__actions .lk-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.lk-dash-hero__actions .lk-btn--primary {
    box-shadow: 0 8px 20px color-mix(in srgb, var(--lk-primary) 24%, transparent);
}

/* ---------- KPI cards ---------- */

.lk-dash-kpis {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 16px;
}

.lk-dash-kpi {
    --dash-accent: var(--lk-primary);
    position: relative;
    min-width: 0;
    padding: 16px;
    border: 1px solid var(--lk-border);
    border-radius: 14px;
    background: var(--lk-card);
    box-shadow: var(--lk-shadow-card);
    transition: transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease;
    overflow: hidden;
}

.lk-dash-kpi:hover {
    transform: translateY(-1px);
    border-color: color-mix(in srgb, var(--dash-accent) 28%, var(--lk-border));
    box-shadow: 0 12px 26px rgba(15, 23, 42, 0.08);
}

.lk-dash-kpi.is-green {
    --dash-accent: #059669;
}

.lk-dash-kpi.is-blue {
    --dash-accent: #2563eb;
}

.lk-dash-kpi.is-violet {
    --dash-accent: #7c3aed;
}

.lk-dash-kpi.is-amber {
    --dash-accent: #d97706;
}

.lk-dash-kpi__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 12px;
}

.lk-dash-kpi__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: color-mix(in srgb, var(--dash-accent) 12%, transparent);
    color: var(--dash-accent);
}

.lk-dash-kpi__flag {
    padding: 2px 7px;
    border-radius: 999px;
    background: color-mix(in srgb, #f59e0b 14%, transparent);
    color: #b45309;
    font-size: 10px;
    font-weight: 700;
}

.lk-dash-kpi__trend {
    font-size: 10.5px;
    font-weight: 600;
    color: var(--lk-text-muted);
    text-align: right;
}

.lk-dash-kpi__label {
    margin: 0;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--lk-text-muted);
}

.lk-dash-kpi__value {
    margin: 4px 0 0;
    font-size: 30px;
    line-height: 1.05;
    font-weight: 800;
    letter-spacing: -0.04em;
    color: var(--lk-text);
}

.lk-dash-kpi__sub {
    margin: 6px 0 0;
    font-size: 11.5px;
    color: var(--lk-text-muted);
}

.lk-dash-kpi__spark {
    margin-top: 4px;
    height: 34px;
}

.lk-dash-kpi__spark svg {
    width: 100%;
    height: 100%;
    overflow: visible;
}

.lk-dash-spark__area {
    fill: color-mix(in srgb, var(--dash-accent) 12%, transparent);
}

.lk-dash-spark__line {
    fill: none;
    stroke: var(--dash-accent);
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
}

.lk-dash-kpi__meter {
    height: 5px;
    margin-top: 8px;
    border-radius: 999px;
    background: var(--lk-surface);
    overflow: hidden;
}

.lk-dash-kpi__meter span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, var(--dash-accent), color-mix(in srgb, var(--dash-accent) 55%, #fbbf24));
}

/* ---------- Panels ---------- */

.lk-dash-columns {
    display: grid;
    gap: 16px;
    margin-top: 16px;
}

.lk-dash-columns--main,
.lk-dash-columns--bottom {
    grid-template-columns: minmax(0, 1.7fr) minmax(280px, 1fr);
}

.lk-dash-columns--charts {
    grid-template-columns: minmax(0, 1.6fr) minmax(280px, 1fr);
}

.lk-dash-panel {
    overflow: hidden;
}

.lk-dash-convos {
    list-style: none;
    margin: 0;
    padding: 0;
}

.lk-dash-convos li + li {
    border-top: 1px solid var(--lk-border);
}

.lk-dash-convo {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 11px 18px;
    text-decoration: none;
    color: inherit;
    transition: background 120ms ease;
}

.lk-dash-convo:hover {
    background: var(--lk-surface);
}

.lk-dash-convo__avatar {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--lk-primary-subtle);
    color: var(--lk-primary-active);
    font-size: 12px;
    font-weight: 700;
    flex: 0 0 auto;
}

.lk-dash-convo__avatar.is-instagram {
    background: color-mix(in srgb, #d946ef 13%, transparent);
    color: #a21caf;
}

.lk-dash-convo__channel-dot {
    position: absolute;
    right: -1px;
    bottom: -1px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid var(--lk-card);
    background: #25d366;
}

.lk-dash-convo__avatar.is-instagram .lk-dash-convo__channel-dot {
    background: linear-gradient(135deg, #f58529, #dd2a7b 55%, #8134af);
}

.lk-dash-convo__main {
    min-width: 0;
    flex: 1;
    display: grid;
    gap: 2px;
}

.lk-dash-convo__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.lk-dash-convo__top strong {
    font-size: 12.5px;
    color: var(--lk-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.lk-dash-convo__top small {
    font-size: 10.5px;
    color: var(--lk-text-muted);
    white-space: nowrap;
}

.lk-dash-convo__preview {
    font-size: 11.5px;
    color: var(--lk-text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.lk-dash-convo__meta {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 0 0 auto;
}

.lk-dash-convo__channel {
    padding: 1px 6px;
    border-radius: 999px;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.03em;
    text-transform: capitalize;
    background: color-mix(in srgb, #25d366 14%, transparent);
    color: #128c4b;
}

.lk-dash-convo__channel.is-instagram {
    background: color-mix(in srgb, #d946ef 14%, transparent);
    color: #a21caf;
}

.lk-dash-convo__unread {
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 999px;
    background: var(--lk-primary);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.lk-dash-empty {
    display: grid;
    justify-items: center;
    gap: 5px;
    padding: 30px 20px;
    text-align: center;
}

.lk-dash-empty__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: var(--lk-surface);
    color: var(--lk-text-muted);
    margin-bottom: 3px;
}

.lk-dash-empty__actions {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 6px;
}

.lk-dash-stack {
    display: grid;
    gap: 16px;
    align-content: start;
}

/* ---------- Plan and channels ---------- */

.lk-dash-plan {
    display: grid;
    gap: 10px;
}

.lk-dash-plan__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    color: var(--lk-text-secondary);
}

.lk-dash-plan__row strong {
    font-size: 12.5px;
    color: var(--lk-text);
}

.lk-dash-meter {
    height: 7px;
    border-radius: 999px;
    background: var(--lk-surface);
    overflow: hidden;
}

.lk-dash-meter span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, var(--lk-primary), #34d399);
    transition: width 240ms ease;
}

.lk-dash-plan__facts {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin: 2px 0 0;
    padding: 0;
    list-style: none;
}

.lk-dash-plan__facts li {
    padding: 9px 10px;
    border: 1px solid var(--lk-border);
    border-radius: 9px;
    background: var(--lk-surface);
    display: grid;
    gap: 2px;
}

.lk-dash-plan__facts span {
    font-size: 10.5px;
    color: var(--lk-text-muted);
}

.lk-dash-plan__facts strong {
    font-size: 15px;
    color: var(--lk-text);
}

.lk-dash-plan__actions {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-top: 2px;
}

.lk-dash-channels {
    display: grid;
    gap: 10px;
}

.lk-dash-channels__total {
    display: flex;
    align-items: baseline;
    gap: 7px;
}

.lk-dash-channels__total strong {
    font-size: 26px;
    line-height: 1;
    letter-spacing: -0.03em;
    color: var(--lk-text);
}

.lk-dash-channels__total span {
    font-size: 11.5px;
    color: var(--lk-text-muted);
}

.lk-dash-mix {
    display: flex;
    height: 8px;
    border-radius: 999px;
    overflow: hidden;
    background: var(--lk-surface);
}

.lk-dash-mix .is-whatsapp {
    background: #22c55e;
}

.lk-dash-mix .is-instagram {
    background: linear-gradient(90deg, #f58529, #d946ef);
}

.lk-dash-legend {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
    list-style: none;
}

.lk-dash-legend li {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    color: var(--lk-text-secondary);
}

.lk-dash-legend strong {
    color: var(--lk-text);
    font-size: 12px;
}

.lk-dash-legend__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.lk-dash-legend__dot.is-whatsapp {
    background: #22c55e;
}

.lk-dash-legend__dot.is-instagram {
    background: linear-gradient(135deg, #f58529, #d946ef);
}

/* ---------- Team snapshot ---------- */

.lk-dash-team {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 0;
    margin-top: 16px;
    border: 1px solid var(--lk-border);
    border-radius: 14px;
    background: var(--lk-card);
    box-shadow: var(--lk-shadow-card);
    overflow: hidden;
}

.lk-dash-team__item {
    display: grid;
    gap: 3px;
    padding: 14px 16px;
    min-width: 0;
}

.lk-dash-team__item + .lk-dash-team__item {
    border-left: 1px solid var(--lk-border);
}

.lk-dash-team__label {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--lk-text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.lk-dash-team__item strong {
    font-size: 21px;
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: var(--lk-text);
}

.lk-dash-team__item .lk-trend {
    font-size: 10.5px;
}

.lk-dash-team__muted {
    font-size: 13px;
    font-weight: 600;
    color: var(--lk-text-muted);
}

/* ---------- Onboarding ---------- */

.lk-onboarding {
    margin-bottom: 16px;
    border-color: color-mix(in srgb, var(--lk-info) 28%, var(--lk-border));
    background:
        radial-gradient(circle at 100% 0, color-mix(in srgb, var(--lk-info) 10%, transparent), transparent 45%),
        var(--lk-card);
}

.lk-onboarding__head {
    align-items: flex-start;
    gap: 12px;
}

.lk-onboarding__intro .lk-card__title {
    margin-top: 8px;
}

.lk-onboarding__progress {
    display: flex;
    align-items: center;
    gap: 8px;
}

.lk-onboarding__progress span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    height: 32px;
    padding: 0 10px;
    border-radius: 999px;
    background: var(--lk-primary-subtle);
    color: var(--lk-primary-active);
    font-size: 12px;
    font-weight: 800;
}

.lk-onboarding__bar {
    height: 7px;
    border-radius: 999px;
    background: var(--lk-surface);
    overflow: hidden;
    margin-bottom: 14px;
}

.lk-onboarding__bar span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, var(--lk-primary), #34d399);
    transition: width 240ms ease;
}

.lk-onboarding__list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.lk-onboarding__item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border: 1px solid var(--lk-border);
    border-radius: 10px;
    background: var(--lk-surface);
}

.lk-onboarding__item.is-done {
    opacity: 0.72;
}

.lk-onboarding__check {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 1.5px dashed var(--lk-border);
    color: #fff;
    flex-shrink: 0;
}

.lk-onboarding__item.is-done .lk-onboarding__check {
    border-style: solid;
    border-color: var(--lk-success);
    background: var(--lk-success);
}

.lk-onboarding__main {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
}

.lk-onboarding__label {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--lk-text);
}

.lk-onboarding__desc {
    font-size: 11px;
    color: var(--lk-text-muted);
    line-height: 1.35;
}

/* ---------- Existing helpers ---------- */

.lk-quick-action__label {
    display: block;
    color: inherit;
    line-height: 1.2;
}

.lk-quick-action__hint {
    display: block;
    margin-top: 2px;
    font-size: 11.5px;
    font-weight: 500;
    color: var(--lk-text-muted);
    line-height: 1.2;
}

/* ---------- Responsive ---------- */

@media (max-width: 1200px) {
    .lk-dash-kpis {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .lk-dash-team {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .lk-dash-team__item:nth-child(4) {
        border-left: 0;
    }

    .lk-dash-team__item:nth-child(n + 4) {
        border-top: 1px solid var(--lk-border);
    }
}

@media (max-width: 1000px) {
    .lk-dash-columns--main,
    .lk-dash-columns--charts,
    .lk-dash-columns--bottom {
        grid-template-columns: minmax(0, 1fr);
    }
}

@media (max-width: 900px) {
    .lk-onboarding__list {
        grid-template-columns: minmax(0, 1fr);
    }

    .lk-dash-hero {
        align-items: flex-start;
    }

    .lk-dash-hero__actions {
        width: 100%;
    }
}

@media (max-width: 640px) {
    .lk-dash-kpis {
        grid-template-columns: minmax(0, 1fr);
    }

    .lk-dash-team {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .lk-dash-team__item {
        border-left: 0 !important;
        border-top: 1px solid var(--lk-border);
    }

    .lk-dash-team__item:first-child,
    .lk-dash-team__item:nth-child(2) {
        border-top: 0;
    }

    .lk-dash-hero {
        padding: 18px;
    }

    .lk-dash-hero__title {
        font-size: 23px;
    }

    .lk-dash-convo__meta .lk-badge,
    .lk-dash-convo__channel {
        display: none;
    }
}
</style>
