import { AxiosService } from '../../Utils/AxiosService';

export type BillingPlan = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price_monthly: number;
    price_yearly: number;
    currency: string;
    trial_days: number;
    features: string[];
    limits: Record<string, number>;
    is_free: boolean;
    is_active: boolean;
    is_public: boolean;
    sort_order: number;
    subscribers_count?: number | null;
};

export type BillingInvoice = {
    id: number;
    number: string;
    amount: number;
    currency: string;
    status: string;
    description: string | null;
    issued_at: string | null;
    paid_at: string | null;
};

export type BillingPayload = {
    workspace: any;
    plan: BillingPlan | null;
    subscription: any;
    usage: any;
    stats: any;
    plans: BillingPlan[];
    invoices: BillingInvoice[];
};

export type InvoicePayload = {
    invoice: BillingInvoice & {
        due_at: string | null;
        meta: Record<string, any> | null;
    };
    plan: BillingPlan | null;
    workspace: {
        id: number;
        name: string;
        slug: string;
        currency: string;
        owner: { id: number; name: string; email: string } | null;
    };
};

class BillingService {
    index() {
        return AxiosService.get<{ result: BillingPayload }>('/billing');
    }

    subscribe(planId: number, billingCycle: 'monthly' | 'yearly') {
        return AxiosService.post<{ result: BillingPayload }>('/billing/subscribe', {
            plan_id: planId,
            billing_cycle: billingCycle,
        });
    }

    cancel() {
        return AxiosService.post<{ result: BillingPayload }>('/billing/cancel', {});
    }

    resume() {
        return AxiosService.post<{ result: BillingPayload }>('/billing/resume', {});
    }

    invoice(id: number | string) {
        return AxiosService.get<{ result: InvoicePayload }>(`/billing/invoices/${id}`);
    }
}

export default new BillingService();
