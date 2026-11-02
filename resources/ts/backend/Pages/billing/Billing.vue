<script setup lang="ts">
import { computed, inject, onMounted, ref, type Ref } from 'vue';
import BillingService, { type BillingInvoice, type BillingPayload, type BillingPlan } from '../../Services/Billing/BillingService';
import { useAuthStore } from '../../../shared/stores/authStore';

const toast = inject<Ref<any>>('toast', ref(null));
const authStore = useAuthStore();
authStore.initFromWindow();

const loading = ref(true);
const error = ref('');
const data = ref<BillingPayload | null>(null);
const cycle = ref<'monthly' | 'yearly'>('monthly');
const busyPlan = ref<number | null>(null);
const busy = ref(false);

const plans = computed<BillingPlan[]>(() => data.value?.plans ?? []);
const invoices = computed<BillingInvoice[]>(() => data.value?.invoices ?? []);
const subscription = computed(() => data.value?.subscription ?? null);
const currentPlan = computed(() => data.value?.plan ?? null);
const seatUsage = computed(() => data.value?.usage?.members ?? { used: 0, limit: 0, unlimited: false, percent: 0 });

const canManage = computed(() => {
    const me = authStore.user;
    if (!me) return false;
    const globalRoles = (me.roles ?? []).map((role) => role.name);
    return globalRoles.includes('super-admin') || globalRoles.includes('admin') || data.value?.workspace?.owner?.id === me.id;
});

const statusLabel = computed(() => {
    if (!subscription.value) return 'No plan';
    if (subscription.value.is_trialing) return `Trial · ${subscription.value.trial_days_left} days left`;
    return String(subscription.value.status ?? '').replace('_', ' ');
});

const statusTone = computed(() => {
    const status = subscription.value?.status;
    if (status === 'active') return 'lk-badge--success';
    if (status === 'trialing') return 'lk-badge--info';
    if (status === 'past_due' || status === 'expired') return 'lk-badge--error';
    return 'lk-badge--neutral';
});

function money(amount: number, currency = 'USD'): string {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount);
}

function price(plan: BillingPlan): string {
    const value = cycle.value === 'yearly' ? plan.price_yearly : plan.price_monthly;
    if (value === 0) return 'Free';
    return money(value, plan.currency);
}

function cadence(plan: BillingPlan): string {
    if (plan.price_monthly === 0 && plan.price_yearly === 0) return 'forever';
    return cycle.value === 'yearly' ? '/ year' : '/ month';
}

function formatDate(value?: string | null): string {
    if (!value) return '—';
    return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}

function apply(next: BillingPayload) {
    data.value = next;
}

async function load() {
    loading.value = true;
    error.value = '';

    try {
        const response = await BillingService.index();
        apply(response.data.result);
    } catch (requestError: any) {
        error.value = requestError?.response?.data?.message ?? 'We could not load billing right now.';
    } finally {
        loading.value = false;
    }
}

async function choosePlan(plan: BillingPlan) {
    if (!canManage.value) {
        toast.value?.showToast(403, 'Admin access required', { message: 'Ask a workspace admin to change the plan.' });
        return;
    }

    if (plan.id === currentPlan.value?.id && subscription.value?.billing_cycle === cycle.value) return;

    busyPlan.value = plan.id;

    try {
        const response = await BillingService.subscribe(plan.id, cycle.value);
        apply(response.data.result);
        toast.value?.showToast(200, 'Plan updated', { message: `You are now on the ${plan.name} plan.` });
    } catch (requestError: any) {
        toast.value?.showToast(requestError?.response?.status ?? 500, 'Plan not changed', {
            message: requestError?.response?.data?.message ?? 'Try again in a moment.',
        });
    } finally {
        busyPlan.value = null;
    }
}

async function cancel() {
    if (!window.confirm('Cancel at the end of the current period? You keep access until then.')) return;
    busy.value = true;

    try {
        const response = await BillingService.cancel();
        apply(response.data.result);
        toast.value?.showToast(200, 'Cancellation scheduled');
    } catch (requestError: any) {
        toast.value?.showToast(500, 'Could not cancel', {
            message: requestError?.response?.data?.message ?? 'Try again.',
        });
    } finally {
        busy.value = false;
    }
}

async function resume() {
    busy.value = true;

    try {
        const response = await BillingService.resume();
        apply(response.data.result);
        toast.value?.showToast(200, 'Subscription resumed');
    } catch (requestError: any) {
        toast.value?.showToast(500, 'Could not resume', {
            message: requestError?.response?.data?.message ?? 'Try again.',
        });
    } finally {
        busy.value = false;
    }
}

onMounted(() => {
    void load();
});
</script>

<template>
    <div>
        <header class="lk-page-head">
            <div>
                <h1 class="lk-page-title">Billing &amp; plans</h1>
                <p class="lk-page-subtitle">Your subscription, seat usage and invoice history.</p>
            </div>
            <div class="lk-page-actions">
                <div class="lk-segmented" role="group" aria-label="Billing cycle">
                    <button type="button" :class="{ 'is-active': cycle === 'monthly' }" @click="cycle = 'monthly'">Monthly</button>
                    <button type="button" :class="{ 'is-active': cycle === 'yearly' }" @click="cycle = 'yearly'">
                        Yearly <span class="lk-badge lk-badge--success" style="margin-left: 4px">−2 months</span>
                    </button>
                </div>
            </div>
        </header>

        <div v-if="loading" class="lk-kpi-grid" aria-busy="true">
            <div v-for="index in 3" :key="index" class="lk-kpi">
                <span class="lk-skeleton" style="display: block; width: 55%; height: 12px"></span>
                <span class="lk-skeleton" style="display: block; width: 45%; height: 28px; margin-top: 14px"></span>
            </div>
        </div>

        <div v-else-if="error" class="lk-card">
            <div class="lk-state lk-state--error">
                <p class="lk-state__title">Billing unavailable</p>
                <p class="lk-state__text">{{ error }}</p>
                <button type="button" class="lk-btn lk-btn--secondary lk-btn--sm" style="margin-top: 8px" @click="load">
                    Try again
                </button>
            </div>
        </div>

        <template v-else-if="data">
            <div class="lk-billing-overview">
                <section class="lk-card lk-plan-current">
                    <div class="lk-card__head">
                        <div>
                            <h2 class="lk-card__title">Current plan</h2>
                            <p class="lk-card__meta">{{ data.workspace.name }}</p>
                        </div>
                        <span class="lk-badge" :class="statusTone">{{ statusLabel }}</span>
                    </div>
                    <div class="lk-card__body">
                        <div class="lk-plan-current__row">
                            <div>
                                <p class="lk-plan-current__name">{{ currentPlan?.name ?? 'No plan selected' }}</p>
                                <p class="lk-plan-current__price">
                                    {{ currentPlan ? price(currentPlan) : '—' }}
                                    <span v-if="currentPlan">{{ cadence(currentPlan) }}</span>
                                </p>
                            </div>
                            <div class="lk-plan-current__meta">
                                <p v-if="subscription?.current_period_end">
                                    {{ subscription.cancel_at_period_end ? 'Ends' : 'Renews' }}
                                    {{ formatDate(subscription.current_period_end) }}
                                </p>
                                <p v-else>No renewal date</p>
                                <p class="lk-muted">{{ subscription?.billing_cycle === 'yearly' ? 'Yearly billing' : 'Monthly billing' }}</p>
                            </div>
                        </div>

                        <div class="lk-usage">
                            <div class="lk-usage__head">
                                <span>Seats</span>
                                <span>{{ seatUsage.used }} / {{ seatUsage.unlimited ? '∞' : seatUsage.limit }}</span>
                            </div>
                            <div class="lk-usage__bar">
                                <span :style="{ width: `${seatUsage.percent}%` }"></span>
                            </div>
                        </div>

                        <div class="lk-plan-current__actions">
                            <button
                                v-if="canManage && subscription && !subscription.cancel_at_period_end"
                                type="button"
                                class="lk-btn lk-btn--ghost lk-btn--sm"
                                :disabled="busy"
                                @click="cancel"
                            >
                                Cancel subscription
                            </button>
                            <button
                                v-if="canManage && subscription?.cancel_at_period_end"
                                type="button"
                                class="lk-btn lk-btn--secondary lk-btn--sm"
                                :disabled="busy"
                                @click="resume"
                            >
                                Resume subscription
                            </button>
                        </div>
                    </div>
                </section>

                <section class="lk-card">
                    <div class="lk-card__head">
                        <div>
                            <h2 class="lk-card__title">Billing details</h2>
                            <p class="lk-card__meta">Used on every invoice</p>
                        </div>
                    </div>
                    <div class="lk-card__body">
                        <dl class="lk-billing-details">
                            <div><dt>Workspace</dt><dd>{{ data.workspace.name }}</dd></div>
                            <div><dt>Billing email</dt><dd>{{ data.workspace.owner?.email }}</dd></div>
                            <div><dt>Currency</dt><dd>{{ data.workspace.currency }}</dd></div>
                            <div><dt>Invoices</dt><dd>{{ data.stats.open_invoices }} open</dd></div>
                        </dl>
                    </div>
                </section>
            </div>

            <section aria-label="Available plans" style="margin-top: 20px">
                <div class="lk-section-head">
                    <div>
                        <h2 class="lk-card__title">Plans</h2>
                        <p class="lk-card__meta">Upgrade or downgrade at any time. Seat limits apply immediately.</p>
                    </div>
                </div>

                <div class="lk-plans">
                    <article
                        v-for="plan in plans"
                        :key="plan.id"
                        class="lk-plan"
                        :class="{ 'is-current': plan.id === currentPlan?.id }"
                    >
                        <div class="lk-plan__head">
                            <h3 class="lk-plan__name">{{ plan.name }}</h3>
                            <span v-if="plan.id === currentPlan?.id" class="lk-badge lk-badge--success">Current</span>
                        </div>
                        <p class="lk-plan__description">{{ plan.description }}</p>
                        <p class="lk-plan__price">{{ price(plan) }} <span>{{ cadence(plan) }}</span></p>
                        <ul class="lk-plan__features">
                            <li v-for="feature in plan.features" :key="feature">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m20 6-11 11-5-5" /></svg>
                                {{ feature }}
                            </li>
                        </ul>
                        <button
                            type="button"
                            class="lk-btn"
                            :class="plan.id === currentPlan?.id ? 'lk-btn--secondary' : 'lk-btn--primary'"
                            style="width: 100%; margin-top: auto"
                            :disabled="busyPlan === plan.id || (plan.id === currentPlan?.id && subscription?.billing_cycle === cycle)"
                            @click="choosePlan(plan)"
                        >
                            {{
                                plan.id === currentPlan?.id
                                    ? 'Current plan'
                                    : busyPlan === plan.id
                                      ? 'Switching…'
                                      : plan.is_free
                                        ? 'Downgrade'
                                        : 'Choose plan'
                            }}
                        </button>
                    </article>
                </div>
            </section>

            <section class="lk-card" style="margin-top: 20px">
                <div class="lk-card__head">
                    <div>
                        <h2 class="lk-card__title">Invoices</h2>
                        <p class="lk-card__meta">Every charge recorded for this workspace</p>
                    </div>
                </div>
                <div class="lk-card__body lk-card__body--flush">
                    <div v-if="!invoices.length" class="lk-state">
                        <p class="lk-state__title">No invoices yet</p>
                        <p class="lk-state__text">Invoices will appear after your first paid subscription.</p>
                    </div>
                    <div v-else class="lk-table-wrap">
                        <table class="lk-table">
                            <thead>
                                <tr>
                                    <th>Invoice</th>
                                    <th>Description</th>
                                    <th>Issued</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="invoice in invoices" :key="invoice.id">
                                    <td>
                                        <router-link :to="{ name: 'billing-invoice', params: { id: invoice.id } }">
                                            <strong>{{ invoice.number }}</strong>
                                        </router-link>
                                    </td>
                                    <td class="lk-muted">{{ invoice.description }}</td>
                                    <td class="lk-muted">{{ formatDate(invoice.issued_at) }}</td>
                                    <td>{{ money(invoice.amount, invoice.currency) }}</td>
                                    <td>
                                        <span class="lk-badge" :class="invoice.status === 'paid' ? 'lk-badge--success' : 'lk-badge--warning'">
                                            {{ invoice.status }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </template>
    </div>
</template>

<style scoped>
.lk-billing-overview {
    display: grid;
    grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
    gap: 16px;
    align-items: start;
}

.lk-plan-current__row {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
}

.lk-plan-current__name {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    color: var(--lk-text);
}

.lk-plan-current__price {
    margin: 4px 0 0;
    font-size: 15px;
    font-weight: 600;
    color: var(--lk-primary-active);
}

.lk-plan-current__price span {
    font-size: 12px;
    font-weight: 500;
    color: var(--lk-text-muted);
}

.lk-plan-current__meta {
    text-align: right;
    font-size: 12px;
    color: var(--lk-text-secondary);
}

.lk-plan-current__meta p {
    margin: 0 0 2px;
}

.lk-plan-current__actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 14px;
}

.lk-muted {
    color: var(--lk-text-muted);
    font-size: 12px;
}

.lk-usage {
    margin-top: 16px;
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

.lk-billing-details {
    margin: 0;
    display: grid;
    gap: 0;
}

.lk-billing-details div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 9px 0;
    border-bottom: 1px solid var(--lk-border);
    font-size: 12.5px;
}

.lk-billing-details div:last-child {
    border-bottom: 0;
    padding-bottom: 0;
}

.lk-billing-details dt {
    color: var(--lk-text-muted);
}

.lk-billing-details dd {
    margin: 0;
    font-weight: 600;
    color: var(--lk-text);
    text-align: right;
    word-break: break-word;
}

.lk-section-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 12px;
}

.lk-plans {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 14px;
}

.lk-plan {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 18px;
    border: 1px solid var(--lk-border);
    border-radius: var(--lk-radius-card);
    background: var(--lk-card);
    box-shadow: var(--lk-shadow-card);
}

.lk-plan.is-current {
    border-color: var(--lk-primary);
    box-shadow: 0 0 0 1px var(--lk-primary), 0 8px 24px rgba(5, 150, 105, 0.12);
}

.lk-plan__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
}

.lk-plan__name {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: var(--lk-text);
}

.lk-plan__description {
    margin: 0;
    font-size: 12px;
    color: var(--lk-text-muted);
    min-height: 32px;
}

.lk-plan__price {
    margin: 0;
    font-size: 26px;
    font-weight: 700;
    color: var(--lk-text);
    letter-spacing: -0.02em;
}

.lk-plan__price span {
    font-size: 12px;
    font-weight: 500;
    color: var(--lk-text-muted);
    letter-spacing: 0;
}

.lk-plan__features {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 7px;
    margin-bottom: 8px;
}

.lk-plan__features li {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12.5px;
    color: var(--lk-text-secondary);
}

.lk-plan__features svg {
    color: var(--lk-primary);
    flex-shrink: 0;
}

@media (max-width: 1023.98px) {
    .lk-billing-overview {
        grid-template-columns: minmax(0, 1fr);
    }
}
</style>
