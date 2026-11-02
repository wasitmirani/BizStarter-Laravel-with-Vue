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
const crm = computed<any>(() => payload.value?.crm ?? null);
const recentConversations = computed<any[]>(() => crm.value?.recent_conversations ?? []);

const firstName = computed(() => {
    const name = String(auth?.name ?? '').trim();
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
    { value: 7 as Range, label: '7 days' },
    { value: 30 as Range, label: '30 days' },
    { value: 90 as Range, label: '90 days' },
];

function formatNumber(value: number | null | undefined): string {
    return new Intl.NumberFormat().format(Number(value ?? 0));
}

function formatDate(value?: string | null): string {
    if (!value) return '—';
    return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}

function formatRelative(value?: string | null): string {
    if (!value) return '';
    return Helpers.HourFormat(value);
}

function changeLabel(change: number | null | undefined): string {
    if (change === null || change === undefined) return 'No prior baseline';
    const sign = change > 0 ? '+' : '';
    return `${sign}${change}% vs previous period`;
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
        <header class="lk-greeting">
            <div>
                <p class="lk-greeting__date">{{ today }}</p>
                <h1 class="lk-page-title">{{ greeting }}, {{ firstName }}</h1>
                <p class="lk-page-subtitle">
                    Here is what is happening across your workspace{{ stats ? ` over the last ${stats.range.days} days` : '' }}.
                </p>
            </div>
            <div class="lk-page-actions">
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
                <router-link v-if="quickActions?.view_reports" :to="{ name: 'reports' }" class="lk-btn lk-btn--secondary">
                    View reports
                </router-link>
            </div>
        </header>

        <div v-if="loading" class="lk-kpi-grid" aria-busy="true" aria-label="Loading dashboard metrics">
            <div v-for="index in 4" :key="index" class="lk-kpi">
                <span class="lk-skeleton" style="display: block; width: 45%; height: 12px"></span>
                <span class="lk-skeleton" style="display: block; width: 60%; height: 30px; margin-top: 14px"></span>
                <span class="lk-skeleton" style="display: block; width: 75%; height: 10px; margin-top: 14px"></span>
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
            <section v-if="workspace" class="lk-card lk-sub-strip" aria-label="Your subscription">
                <div class="lk-card__body lk-sub-strip__body">
                    <div class="lk-sub-strip__plan">
                        <p class="lk-label" style="margin-bottom: 4px">Current plan</p>
                        <p class="lk-sub-strip__name">
                            {{ workspace.plan?.name ?? 'No plan' }}
                            <span
                                class="lk-badge"
                                :class="subscription?.is_trialing ? 'lk-badge--info' : 'lk-badge--success'"
                            >
                                {{ subscription?.is_trialing ? `Trial · ${subscription.trial_days_left}d left` : (subscription?.status ?? 'inactive') }}
                            </span>
                        </p>
                        <p class="lk-hint">
                            {{ workspace.stats.pending_invitations }} pending invite(s) ·
                            {{ workspace.stats.open_invoices }} open invoice(s)
                        </p>
                    </div>
                    <div v-if="seat" class="lk-sub-strip__usage">
                        <div class="lk-usage__head">
                            <span>Seats</span>
                            <span>{{ seat.used }} / {{ seat.unlimited ? '∞' : seat.limit }}</span>
                        </div>
                        <div class="lk-usage__bar">
                            <span :style="{ width: `${seat.percent}%` }"></span>
                        </div>
                    </div>
                    <div class="lk-sub-strip__actions">
                        <router-link :to="{ name: 'billing' }" class="lk-btn lk-btn--secondary lk-btn--sm">
                            Manage billing
                        </router-link>
                        <router-link :to="{ name: 'team' }" class="lk-btn lk-btn--ghost lk-btn--sm">
                            Invite team
                        </router-link>
                    </div>
                </div>
            </section>

            <section v-if="crm" class="lk-card lk-crm-strip" aria-label="WhatsApp CRM overview">
                <div class="lk-card__head">
                    <div>
                        <h2 class="lk-card__title">WhatsApp CRM</h2>
                        <p class="lk-card__meta">Your shared inbox at a glance</p>
                    </div>
                    <div class="lk-page-actions">
                        <router-link :to="{ name: 'crm-inbox' }" class="lk-btn lk-btn--secondary lk-btn--sm">
                            Open inbox
                        </router-link>
                        <router-link :to="{ name: 'crm-contacts' }" class="lk-btn lk-btn--ghost lk-btn--sm">
                            Contacts
                        </router-link>
                    </div>
                </div>
                <div class="lk-card__body lk-crm-strip__body">
                    <div class="lk-crm-strip__stats">
                        <div class="lk-crm-stat">
                            <span class="lk-crm-stat__value">{{ formatNumber(crm.contacts) }}</span>
                            <span class="lk-crm-stat__label">Contacts</span>
                        </div>
                        <div class="lk-crm-stat">
                            <span class="lk-crm-stat__value">{{ formatNumber(crm.open_conversations) }}</span>
                            <span class="lk-crm-stat__label">Open chats</span>
                        </div>
                        <div class="lk-crm-stat">
                            <span class="lk-crm-stat__value">{{ formatNumber(crm.unread_messages) }}</span>
                            <span class="lk-crm-stat__label">Unread</span>
                        </div>
                        <div class="lk-crm-stat">
                            <span class="lk-crm-stat__value">{{ formatNumber(crm.messages_today) }}</span>
                            <span class="lk-crm-stat__label">Messages today</span>
                        </div>
                        <div class="lk-crm-stat">
                            <span class="lk-crm-stat__value">{{ formatNumber(crm.campaigns_sent) }} / {{ formatNumber(crm.campaigns) }}</span>
                            <span class="lk-crm-stat__label">Campaigns sent</span>
                        </div>
                    </div>

                    <div class="lk-crm-strip__recent">
                        <p class="lk-label">Recent conversations</p>
                        <ul v-if="recentConversations.length" class="lk-crm-recent">
                            <li v-for="conversation in recentConversations" :key="conversation.id">
                                <router-link :to="{ name: 'crm-inbox' }" class="lk-crm-recent__row">
                                    <span class="lk-crm-recent__dot" :class="`is-${conversation.status}`" aria-hidden="true"></span>
                                    <span class="lk-crm-recent__main">
                                        <span class="lk-crm-recent__name">
                                            {{ conversation.contact?.name ?? 'Unknown contact' }}
                                            <span v-if="conversation.unread_count" class="lk-crm-recent__unread">{{ conversation.unread_count }}</span>
                                        </span>
                                        <span class="lk-crm-recent__preview">{{ conversation.preview ?? 'No messages yet' }}</span>
                                    </span>
                                    <span class="lk-crm-recent__time">{{ formatRelative(conversation.last_message_at) }}</span>
                                </router-link>
                            </li>
                        </ul>
                        <p v-else class="lk-state__text">No conversations yet. New WhatsApp messages will appear here.</p>
                    </div>
                </div>
            </section>

            <section class="lk-kpi-grid" aria-label="Key metrics">
                <article class="lk-kpi">
                    <div class="lk-kpi__top">
                        <span class="lk-kpi__label">Total users</span>
                        <span class="lk-kpi__icon" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                        </span>
                    </div>
                    <p class="lk-kpi__value">{{ formatNumber(stats.users.total) }}</p>
                    <div class="lk-kpi__footer">
                        <span class="lk-badge lk-badge--success">{{ formatNumber(stats.users.active) }} active</span>
                        <span class="lk-badge lk-badge--neutral">{{ formatNumber(stats.users.inactive) }} inactive</span>
                    </div>
                </article>

                <article class="lk-kpi">
                    <div class="lk-kpi__top">
                        <span class="lk-kpi__label">New users · {{ stats.range.days }}d</span>
                        <span class="lk-kpi__icon" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></svg>
                        </span>
                    </div>
                    <p class="lk-kpi__value">{{ formatNumber(stats.users.new_in_period) }}</p>
                    <div class="lk-kpi__footer">
                        <span class="lk-trend" :class="changeClass(stats.users.change_pct)">
                            {{ changeLabel(stats.users.change_pct) }}
                        </span>
                    </div>
                </article>

                <article class="lk-kpi">
                    <div class="lk-kpi__top">
                        <span class="lk-kpi__label">Sign-ins · {{ stats.range.days }}d</span>
                        <span class="lk-kpi__icon" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><path d="m10 17 5-5-5-5" /><path d="M15 12H3" /></svg>
                        </span>
                    </div>
                    <p class="lk-kpi__value">{{ formatNumber(stats.logins.in_period) }}</p>
                    <div class="lk-kpi__footer">
                        <span class="lk-trend" :class="changeClass(stats.logins.change_pct)">
                            {{ changeLabel(stats.logins.change_pct) }}
                        </span>
                        <span>· {{ formatNumber(stats.logins.today) }} today</span>
                    </div>
                </article>

                <article class="lk-kpi">
                    <div class="lk-kpi__top">
                        <span class="lk-kpi__label">Audit events · {{ stats.range.days }}d</span>
                        <span class="lk-kpi__icon" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                        </span>
                    </div>
                    <p class="lk-kpi__value">{{ formatNumber(stats.activity.in_period) }}</p>
                    <div class="lk-kpi__footer">
                        <span class="lk-badge lk-badge--neutral">{{ formatNumber(stats.roles.total) }} roles</span>
                        <span class="lk-badge lk-badge--neutral">{{ formatNumber(stats.permissions.total) }} permissions</span>
                    </div>
                </article>
            </section>

            <div class="lk-grid-2">
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

            <div class="lk-grid-2">
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

                <div class="lk-dashboard__side">
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
                                        v-if="quickActions?.view_user"
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
.lk-sub-strip {
    margin-bottom: 16px;
}

.lk-sub-strip__body {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(180px, 1fr) auto;
    align-items: center;
    gap: 22px;
}

.lk-sub-strip__name {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 3px;
    font-size: 18px;
    font-weight: 700;
    color: var(--lk-text);
}

.lk-sub-strip__actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
}

.lk-usage__head {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--lk-text-secondary);
    margin-bottom: 6px;
}

.lk-usage__bar {
    height: 7px;
    border-radius: 999px;
    background: var(--lk-surface);
    overflow: hidden;
}

.lk-usage__bar span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, var(--lk-primary), #34d399);
}

@media (max-width: 900px) {
    .lk-sub-strip__body {
        grid-template-columns: minmax(0, 1fr);
        align-items: start;
    }

    .lk-sub-strip__actions {
        justify-content: flex-start;
    }
}

.lk-crm-strip {
    margin-bottom: 16px;
}

.lk-crm-strip__body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(280px, 1fr);
    gap: 22px;
    align-items: start;
}

.lk-crm-strip__stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
    gap: 14px;
}

.lk-crm-stat {
    display: grid;
    gap: 2px;
    padding: 10px 12px;
    border: 1px solid var(--lk-border);
    border-radius: 10px;
    background: var(--lk-surface);
}

.lk-crm-stat__value {
    font-size: 20px;
    font-weight: 700;
    color: var(--lk-text);
    line-height: 1.2;
}

.lk-crm-stat__label {
    font-size: 11px;
    color: var(--lk-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.lk-crm-recent {
    list-style: none;
    margin: 6px 0 0;
    padding: 0;
    display: grid;
    gap: 2px;
}

.lk-crm-recent__row {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 7px 8px;
    border-radius: 8px;
    text-decoration: none;
    color: inherit;
}

.lk-crm-recent__row:hover {
    background: var(--lk-surface);
}

.lk-crm-recent__dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex: 0 0 auto;
    background: #94a3b8;
}

.lk-crm-recent__dot.is-open {
    background: #059669;
}

.lk-crm-recent__dot.is-pending {
    background: #f59e0b;
}

.lk-crm-recent__main {
    min-width: 0;
    flex: 1;
    display: grid;
    gap: 1px;
}

.lk-crm-recent__name {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12.5px;
    font-weight: 600;
    color: var(--lk-text);
}

.lk-crm-recent__unread {
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    border-radius: 999px;
    background: var(--lk-primary);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.lk-crm-recent__preview {
    font-size: 11.5px;
    color: var(--lk-text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.lk-crm-recent__time {
    font-size: 10.5px;
    color: var(--lk-text-muted);
    white-space: nowrap;
}

@media (max-width: 900px) {
    .lk-crm-strip__body {
        grid-template-columns: minmax(0, 1fr);
    }
}

.lk-dashboard__side {
    display: grid;
    gap: 16px;
    align-content: start;
}

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

@media (max-width: 767.98px) {
    .lk-greeting {
        align-items: flex-start;
    }
}
</style>
