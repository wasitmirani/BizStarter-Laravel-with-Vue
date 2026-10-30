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

export type UserReportFilters = {
    search?: string;
    role?: string;
    status?: string;
    from?: string;
    to?: string;
};

class ReportService {
    summary() {
        return AxiosService.get('/reports/summary');
    }

    exportUsers(filters: UserReportFilters = {}) {
        return AxiosService.download(`/reports/users${query(filters)}`);
    }
}

export default new ReportService();
