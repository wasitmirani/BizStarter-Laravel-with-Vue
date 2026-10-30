import { AxiosService } from '../../Utils/AxiosService';

function query(params: Record<string, string | number | boolean | null | undefined>): string {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            search.append(key, String(value));
        }
    });
    const value = search.toString();
    return value ? `?${value}` : '';
}

class SearchService {
    query(term: string) {
        return AxiosService.get(`/search${query({ q: term })}`);
    }
}

export default new SearchService();
