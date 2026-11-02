<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BillingService, { type InvoicePayload } from '../../Services/Billing/BillingService';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const error = ref('');
const data = ref<InvoicePayload | null>(null);

const invoice = computed(() => data.value?.invoice ?? null);
const workspace = computed(() => data.value?.workspace ?? null);
const plan = computed(() => data.value?.plan ?? null);

function money(amount: number, currency = 'USD'): string {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount);
}

function formatDate(value?: string | null): string {
    if (!value) return '—';
    return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}

function printInvoice() {
    window.print();
}

async function load() {
    loading.value = true;
    error.value = '';

    try {
        const response = await BillingService.invoice(String(route.params.id));
        data.value = response.data.result;
    } catch (requestError: any) {
        error.value = requestError?.response?.data?.message ?? 'We could not load this invoice.';
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    void load();
});
</script>

<template>
    <div>
        <header class="lk-page-head no-print">
            <div>
                <h1 class="lk-page-title">Invoice</h1>
                <p class="lk-page-subtitle">A printable record of this charge.</p>
            </div>
            <div class="lk-page-actions">
                <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" @click="router.back()">Back</button>
                <button v-if="invoice" type="button" class="lk-btn lk-btn--primary lk-btn--sm" @click="printInvoice">
                    Print / save as PDF
                </button>
            </div>
        </header>

        <div v-if="loading" class="lk-card">
            <div class="lk-card__body">
                <span class="lk-skeleton" style="display: block; width: 40%; height: 14px"></span>
                <span class="lk-skeleton" style="display: block; width: 65%; height: 14px; margin-top: 12px"></span>
            </div>
        </div>

        <div v-else-if="error" class="lk-card">
            <div class="lk-state lk-state--error">
                <p class="lk-state__title">Invoice unavailable</p>
                <p class="lk-state__text">{{ error }}</p>
            </div>
        </div>

        <article v-else-if="invoice && workspace" class="lk-invoice" aria-label="Invoice">
            <div class="lk-invoice__head">
                <div>
                    <p class="lk-invoice__brand">{{ workspace.name }}</p>
                    <p class="lk-invoice__muted">{{ workspace.owner?.email }}</p>
                </div>
                <div class="lk-invoice__meta">
                    <p class="lk-invoice__number">{{ invoice.number }}</p>
                    <span class="lk-badge" :class="invoice.status === 'paid' ? 'lk-badge--success' : 'lk-badge--warning'">
                        {{ invoice.status }}
                    </span>
                </div>
            </div>

            <div class="lk-invoice__grid">
                <div>
                    <p class="lk-invoice__label">Billed to</p>
                    <p class="lk-invoice__value">{{ workspace.name }}</p>
                    <p class="lk-invoice__muted">{{ workspace.owner?.name }}</p>
                    <p class="lk-invoice__muted">{{ workspace.owner?.email }}</p>
                </div>
                <div>
                    <p class="lk-invoice__label">Issued</p>
                    <p class="lk-invoice__value">{{ formatDate(invoice.issued_at) }}</p>
                </div>
                <div>
                    <p class="lk-invoice__label">Due</p>
                    <p class="lk-invoice__value">{{ formatDate(invoice.due_at ?? invoice.issued_at) }}</p>
                </div>
                <div>
                    <p class="lk-invoice__label">Paid</p>
                    <p class="lk-invoice__value">{{ formatDate(invoice.paid_at) }}</p>
                </div>
            </div>

            <table class="lk-table lk-invoice__table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Billing cycle</th>
                        <th class="lk-invoice__amount">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <strong>{{ plan?.name ?? 'Subscription' }} plan</strong>
                            <p class="lk-invoice__muted" style="margin: 2px 0 0">{{ invoice.description }}</p>
                        </td>
                        <td style="text-transform: capitalize">{{ invoice.meta?.cycle ?? 'monthly' }}</td>
                        <td class="lk-invoice__amount">{{ money(invoice.amount, invoice.currency) }}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="2" class="lk-invoice__total-label">Total paid</td>
                        <td class="lk-invoice__amount lk-invoice__total">{{ money(invoice.amount, invoice.currency) }}</td>
                    </tr>
                </tfoot>
            </table>

            <p class="lk-invoice__footer">
                Thank you for subscribing to {{ workspace.name }}. Questions? Reply to this invoice email.
            </p>
        </article>
    </div>
</template>

<style scoped>
.lk-invoice {
    max-width: 820px;
    background: var(--lk-card);
    border: 1px solid var(--lk-border);
    border-radius: var(--lk-radius-card);
    box-shadow: var(--lk-shadow-card);
    padding: 28px;
}

.lk-invoice__head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    padding-bottom: 18px;
    border-bottom: 1px solid var(--lk-border);
}

.lk-invoice__brand {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: var(--lk-text);
}

.lk-invoice__meta {
    text-align: right;
}

.lk-invoice__number {
    margin: 0 0 6px;
    font-size: 14px;
    font-weight: 700;
    color: var(--lk-text);
}

.lk-invoice__muted {
    margin: 2px 0 0;
    font-size: 12px;
    color: var(--lk-text-muted);
}

.lk-invoice__grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    padding: 18px 0;
}

.lk-invoice__label {
    margin: 0 0 4px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--lk-text-muted);
}

.lk-invoice__value {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: var(--lk-text);
}

.lk-invoice__table {
    margin-top: 4px;
}

.lk-invoice__amount {
    text-align: right;
    white-space: nowrap;
}

.lk-invoice__total-label {
    text-align: right;
    font-weight: 600;
}

.lk-invoice__total {
    font-weight: 700;
    color: var(--lk-text);
}

.lk-invoice__footer {
    margin: 22px 0 0;
    font-size: 12px;
    color: var(--lk-text-muted);
}

@media (max-width: 760px) {
    .lk-invoice__grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media print {
    .no-print {
        display: none !important;
    }

    .lk-invoice {
        border: 0;
        box-shadow: none;
        max-width: none;
        padding: 0;
    }
}
</style>
