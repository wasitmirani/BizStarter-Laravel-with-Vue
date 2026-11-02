<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref, type Ref } from 'vue';
import PlanService, { type PlanInput } from '../../Services/Billing/PlanService';
import type { BillingPlan } from '../../Services/Billing/BillingService';

const toast = inject<Ref<any>>('toast', ref(null));

const loading = ref(true);
const saving = ref(false);
const error = ref('');
const plans = ref<BillingPlan[]>([]);
const editingId = ref<number | null>(null);
const featuresText = ref('');

const form = reactive({
    name: '',
    description: '',
    price_monthly: 0,
    price_yearly: 0,
    currency: 'USD',
    trial_days: 14,
    seats: 5,
    storage_mb: 5120,
    api_calls: 25000,
    is_active: true,
    is_public: true,
    sort_order: 0,
});

const editing = computed(() => plans.value.find((plan) => plan.id === editingId.value) ?? null);
const canSubmit = computed(() => form.name.trim().length > 0 && !saving.value);

function money(amount: number, currency = 'USD'): string {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount);
}

function limitLabel(value: number): string {
    return value < 0 ? 'Unlimited' : String(value);
}

function resetForm() {
    editingId.value = null;
    form.name = '';
    form.description = '';
    form.price_monthly = 0;
    form.price_yearly = 0;
    form.currency = 'USD';
    form.trial_days = 14;
    form.seats = 5;
    form.storage_mb = 5120;
    form.api_calls = 25000;
    form.is_active = true;
    form.is_public = true;
    form.sort_order = plans.value.length + 1;
    featuresText.value = '';
}

function edit(plan: BillingPlan) {
    editingId.value = plan.id;
    form.name = plan.name;
    form.description = plan.description ?? '';
    form.price_monthly = Number(plan.price_monthly);
    form.price_yearly = Number(plan.price_yearly);
    form.currency = plan.currency;
    form.trial_days = plan.trial_days;
    form.seats = Number(plan.limits?.seats ?? 5);
    form.storage_mb = Number(plan.limits?.storage_mb ?? 5120);
    form.api_calls = Number(plan.limits?.api_calls ?? 25000);
    form.is_active = plan.is_active;
    form.is_public = plan.is_public;
    form.sort_order = plan.sort_order ?? 0;
    featuresText.value = (plan.features ?? []).join('\n');
}

async function load() {
    loading.value = true;
    error.value = '';

    try {
        const response = await PlanService.list();
        plans.value = response.data.result.plans;
        if (editingId.value === null) {
            form.sort_order = plans.value.length + 1;
        }
    } catch (requestError: any) {
        error.value = requestError?.response?.data?.message ?? 'We could not load the plan catalog.';
    } finally {
        loading.value = false;
    }
}

function payload(): PlanInput {
    return {
        name: form.name.trim(),
        description: form.description.trim() || null,
        price_monthly: Number(form.price_monthly) || 0,
        price_yearly: Number(form.price_yearly) || 0,
        currency: form.currency,
        trial_days: Number(form.trial_days) || 0,
        features: featuresText.value
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean),
        limits: {
            seats: Number(form.seats),
            storage_mb: Number(form.storage_mb),
            api_calls: Number(form.api_calls),
        },
        is_active: form.is_active,
        is_public: form.is_public,
        sort_order: Number(form.sort_order) || 0,
    };
}

async function save() {
    if (!canSubmit.value) return;
    saving.value = true;

    try {
        if (editingId.value) {
            await PlanService.update(editingId.value, payload());
            toast.value?.showToast(200, 'Plan updated', { message: `${form.name} is saved.` });
        } else {
            await PlanService.create(payload());
            toast.value?.showToast(201, 'Plan created', { message: `${form.name} is now available.` });
        }
        resetForm();
        await load();
    } catch (requestError: any) {
        toast.value?.showToast(requestError?.response?.status ?? 500, 'Could not save plan', {
            message: requestError?.response?.data?.message ?? 'Check the fields and try again.',
        });
    } finally {
        saving.value = false;
    }
}

async function remove(plan: BillingPlan) {
    if (!window.confirm(`Delete the ${plan.name} plan? This cannot be undone.`)) return;

    try {
        await PlanService.destroy(plan.id);
        toast.value?.showToast(200, 'Plan deleted');
        if (editingId.value === plan.id) resetForm();
        await load();
    } catch (requestError: any) {
        toast.value?.showToast(requestError?.response?.status ?? 500, 'Could not delete plan', {
            message: requestError?.response?.data?.message ?? 'Move active subscribers first.',
        });
    }
}

onMounted(() => {
    resetForm();
    void load();
});
</script>

<template>
    <div>
        <header class="lk-page-head">
            <div>
                <h1 class="lk-page-title">Plans</h1>
                <p class="lk-page-subtitle">Platform pricing, limits and availability. Changes apply immediately.</p>
            </div>
        </header>

        <div v-if="loading" class="lk-card">
            <div class="lk-card__body">
                <span class="lk-skeleton" style="display: block; width: 45%; height: 12px"></span>
                <span class="lk-skeleton" style="display: block; width: 70%; height: 12px; margin-top: 10px"></span>
            </div>
        </div>

        <div v-else-if="error" class="lk-card">
            <div class="lk-state lk-state--error">
                <p class="lk-state__title">Catalog unavailable</p>
                <p class="lk-state__text">{{ error }}</p>
                <button type="button" class="lk-btn lk-btn--secondary lk-btn--sm" style="margin-top: 8px" @click="load">
                    Try again
                </button>
            </div>
        </div>

        <div v-else class="lk-plans-admin">
            <section class="lk-card">
                <div class="lk-card__head">
                    <div>
                        <h2 class="lk-card__title">Plan catalog</h2>
                        <p class="lk-card__meta">{{ plans.length }} plans</p>
                    </div>
                    <button type="button" class="lk-btn lk-btn--secondary lk-btn--sm" @click="resetForm">New plan</button>
                </div>
                <div class="lk-card__body lk-card__body--flush">
                    <div v-if="!plans.length" class="lk-state">
                        <p class="lk-state__title">No plans yet</p>
                        <p class="lk-state__text">Create your first plan to start onboarding customers.</p>
                    </div>
                    <div v-else class="lk-table-wrap">
                        <table class="lk-table">
                            <thead>
                                <tr>
                                    <th>Plan</th>
                                    <th>Monthly</th>
                                    <th>Yearly</th>
                                    <th>Seats</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="plan in plans" :key="plan.id">
                                    <td class="lk-plan-cell">
                                        <strong>{{ plan.name }}</strong>
                                    </td>
                                    <td class="lk-nowrap">{{ money(plan.price_monthly, plan.currency) }}</td>
                                    <td class="lk-nowrap">{{ money(plan.price_yearly, plan.currency) }}</td>
                                    <td class="lk-nowrap">{{ limitLabel(Number(plan.limits?.seats ?? 0)) }}</td>
                                    <td>
                                        <span class="lk-badge" :class="plan.is_active ? 'lk-badge--success' : 'lk-badge--neutral'">
                                            {{ plan.is_active ? 'Active' : 'Hidden' }}
                                        </span>
                                    </td>
                                    <td class="lk-plans-admin__actions">
                                        <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" @click="edit(plan)">Edit</button>
                                        <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" @click="remove(plan)">Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <section class="lk-card">
                <div class="lk-card__head">
                    <div>
                        <h2 class="lk-card__title">{{ editing ? `Edit ${editing.name}` : 'Create a plan' }}</h2>
                        <p class="lk-card__meta">Pricing, trial and feature limits</p>
                    </div>
                </div>
                <div class="lk-card__body">
                    <form novalidate @submit.prevent="save">
                        <label class="lk-field">
                            <span class="lk-label">Name</span>
                            <input v-model="form.name" class="lk-input" placeholder="Growth" maxlength="80" required />
                        </label>
                        <label class="lk-field" style="margin-top: 10px">
                            <span class="lk-label">Description</span>
                            <input v-model="form.description" class="lk-input" placeholder="For teams that need more room" maxlength="500" />
                        </label>
                        <div class="lk-form-grid" style="margin-top: 10px">
                            <label class="lk-field">
                                <span class="lk-label">Monthly price</span>
                                <input v-model.number="form.price_monthly" type="number" min="0" step="0.01" class="lk-input" />
                            </label>
                            <label class="lk-field">
                                <span class="lk-label">Yearly price</span>
                                <input v-model.number="form.price_yearly" type="number" min="0" step="0.01" class="lk-input" />
                            </label>
                            <label class="lk-field">
                                <span class="lk-label">Currency</span>
                                <select v-model="form.currency" class="lk-select">
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="AED">AED</option>
                                    <option value="PKR">PKR</option>
                                    <option value="INR">INR</option>
                                </select>
                            </label>
                            <label class="lk-field">
                                <span class="lk-label">Trial days</span>
                                <input v-model.number="form.trial_days" type="number" min="0" max="365" class="lk-input" />
                            </label>
                            <label class="lk-field">
                                <span class="lk-label">Seats (-1 unlimited)</span>
                                <input v-model.number="form.seats" type="number" min="-1" class="lk-input" />
                            </label>
                            <label class="lk-field">
                                <span class="lk-label">Storage MB (-1 unlimited)</span>
                                <input v-model.number="form.storage_mb" type="number" min="-1" class="lk-input" />
                            </label>
                            <label class="lk-field">
                                <span class="lk-label">API calls / month (-1 unlimited)</span>
                                <input v-model.number="form.api_calls" type="number" min="-1" class="lk-input" />
                            </label>
                            <label class="lk-field">
                                <span class="lk-label">Sort order</span>
                                <input v-model.number="form.sort_order" type="number" min="0" class="lk-input" />
                            </label>
                        </div>
                        <label class="lk-field" style="margin-top: 10px">
                            <span class="lk-label">Features (one per line)</span>
                            <textarea v-model="featuresText" class="lk-input" rows="4" placeholder="Up to 20 seats&#10;25 GB storage&#10;Priority support"></textarea>
                        </label>
                        <div class="lk-plans-admin__toggles">
                            <label class="lk-check">
                                <input v-model="form.is_active" type="checkbox" />
                                <span>Active</span>
                            </label>
                            <label class="lk-check">
                                <input v-model="form.is_public" type="checkbox" />
                                <span>Visible on billing page</span>
                            </label>
                        </div>
                        <div class="lk-plans-admin__submit">
                            <button v-if="editing" type="button" class="lk-btn lk-btn--ghost" @click="resetForm">Cancel</button>
                            <button type="submit" class="lk-btn lk-btn--primary" :disabled="!canSubmit">
                                {{ saving ? 'Saving…' : editing ? 'Save plan' : 'Create plan' }}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    </div>
</template>

<style scoped>
.lk-plans-admin {
    display: grid;
    grid-template-columns: minmax(0, 1.55fr) minmax(360px, 1fr);
    gap: 16px;
    align-items: start;
}

.lk-plan-cell {
    max-width: 240px;
}

.lk-plan-cell__desc {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 2px 0 0;
}

.lk-nowrap {
    white-space: nowrap;
}

.lk-plans-admin__actions {
    text-align: right;
    white-space: nowrap;
}

.lk-plans-admin__toggles {
    display: flex;
    gap: 18px;
    margin-top: 14px;
    font-size: 12.5px;
    color: var(--lk-text-secondary);
}

.lk-check {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    cursor: pointer;
}

.lk-plans-admin__submit {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 16px;
}

.lk-muted {
    color: var(--lk-text-muted);
    font-size: 12px;
}

@media (max-width: 1023.98px) {
    .lk-plans-admin {
        grid-template-columns: minmax(0, 1fr);
    }
}
</style>
