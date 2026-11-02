import { AxiosService } from '../../Utils/AxiosService';
import type { BillingPlan } from './BillingService';

export type PlanInput = {
    name: string;
    description?: string | null;
    price_monthly: number;
    price_yearly: number;
    currency?: string;
    trial_days?: number;
    features: string[];
    limits: {
        seats: number;
        storage_mb: number;
        api_calls: number;
    };
    is_active: boolean;
    is_public: boolean;
    sort_order?: number;
};

class PlanService {
    list() {
        return AxiosService.get<{ result: { plans: BillingPlan[] } }>('/plans');
    }

    create(payload: PlanInput) {
        return AxiosService.post<{ result: { plan: BillingPlan } }>('/plans', payload);
    }

    update(id: number, payload: PlanInput) {
        return AxiosService.put<{ result: { plan: BillingPlan } }>(`/plans/${id}`, payload);
    }

    destroy(id: number) {
        return AxiosService.delete(`/plans/${id}`);
    }
}

export default new PlanService();
