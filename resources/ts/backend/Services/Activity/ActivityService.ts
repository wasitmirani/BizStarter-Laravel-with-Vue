import { AxiosService } from '../../Utils/AxiosService';

function query(params: Record<string, string | number | null | undefined>): string {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            search.append(key, String(value));
        }
    });
    const value = search.toString();
    return value ? `?${value}` : '';
}

export type ActivityFilters = {
    page?: number;
    per_page?: number;
    search?: string;
    event?: string;
    from?: string;
    to?: string;
};

class ActivityService {
    list(filters: ActivityFilters = {}) {
        return AxiosService.get(`/activity${query(filters)}`);
    }
}

export default new ActivityService();
