import { AxiosService } from '../../Utils/AxiosService';
import { BaseService } from '../BaseService';
import axios from 'axios';

class TenantService extends BaseService {
    constructor() {
        super('tenant');
    }

    tenants = (params: Record<string, any> = {}) => {
        const query = this.buildQuery(params);
        return AxiosService.get(`/tenant${query ? `?${query}` : ''}`);
    };

    tenant = (id: string) => {
        return AxiosService.get(`/tenant/${id}`);
    };

    store = (payload: any) => {
        return AxiosService.post('/tenant', payload);
    };

    update = (id: string, payload: any) => {
        return AxiosService.put(`/tenant/${id}`, payload);
    };

    delete = (id: string) => {
        return AxiosService.delete(`/tenant/${id}`);
    };

    updateStatus = (id: string, status: string) => {
        const token = (window as any).user?.token;
        return axios.patch(
            `/api/app/tenant/${id}/status`,
            { status },
            {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined,
                    Accept: 'application/json',
                },
            }
        );
    };

    addDomain = (id: string, domain: string) => {
        return AxiosService.post(`/tenant/${id}/domains`, { domain });
    };

    removeDomain = (id: string, domainId: number | string) => {
        return AxiosService.delete(`/tenant/${id}/domains/${domainId}`);
    };
}

export default new TenantService();
