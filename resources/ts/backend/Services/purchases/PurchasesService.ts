import { AxiosService } from '../../Utils/Service';

type QueryParams = Record<string, string | number | boolean | null | undefined>;

const toQueryString = (params: QueryParams = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, String(value));
        }
    });
    return queryParams.toString();
};

class Purchases {
    purchaseOrders(params: QueryParams = {}) {
        const query = toQueryString(params);
        return AxiosService.get(`/purchase-order${query ? `?${query}` : ''}`);
    }

    purchaseOrder(uuid: string) {
        return AxiosService.get(`/purchase-order/${uuid}`);
    }

    storePurchaseOrder(payload: any) {
        return AxiosService.post('/purchase-order', payload);
    }

    updatePurchaseOrder(uuid: string, payload: any) {
        return AxiosService.put(`/purchase-order/${uuid}`, payload);
    }

    deletePurchaseOrder(uuid: string) {
        return AxiosService.delete(`/purchase-order/${uuid}`);
    }
}

export const PurchasesService = new Purchases();
