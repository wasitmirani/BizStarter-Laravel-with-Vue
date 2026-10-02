
import {AxiosService} from '../Utils/AxiosService';

export class BaseService {
    protected endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    protected buildQuery(params: Record<string, any> = {}) {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value.toString());
            }
        });

        return queryParams.toString();
    }

    list(params: Record<string, any> = {}) {
        const query = this.buildQuery(params);
        return AxiosService.get(`/${this.endpoint}${query ? `?${query}` : ''}`);
    }

    get(id: string | number) {
        return AxiosService.get(`/${this.endpoint}/${id}`);
    }

    create(data: any) {
        return AxiosService.post(`/${this.endpoint}`, data);
    }

    update(id: string | number, data: any) {
        return AxiosService.put(`/${this.endpoint}/${id}`, data);
    }

    delete(id: string | number) {
        return AxiosService.delete(`/${this.endpoint}/${id}`);
    }
}
