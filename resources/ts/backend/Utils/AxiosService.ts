import axios, { AxiosResponse } from 'axios';

axios.defaults.baseURL = '/api/app/';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

function csrfToken(): string {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
}

function authHeaders(): Record<string, string> {
    const token = window.__APP_CONTEXT__?.auth.token ?? window.user?.token;
    return token ? { Authorization: `Bearer ${token}` } : {};
}

function headers(extra: Record<string, string> = {}) {
    return {
        ...authHeaders(),
        'X-CSRF-TOKEN': csrfToken(),
        ...extra,
    };
}

class AxiosClass {
    async get<T>(url: string): Promise<AxiosResponse<T>> {
        return axios.get<T>(url, { headers: headers() });
    }

    async post<T>(url: string, body?: any): Promise<AxiosResponse<T>> {
        return axios.post<T>(url, body, { headers: headers() });
    }

    async put<T>(url: string, body: any): Promise<AxiosResponse<T>> {
        return axios.put<T>(url, body, { headers: headers() });
    }

    async patch<T>(url: string, body: any): Promise<AxiosResponse<T>> {
        return axios.patch<T>(url, body, { headers: headers() });
    }

    async delete<T>(url: string): Promise<AxiosResponse<T>> {
        return axios.delete<T>(url, { headers: headers() });
    }

    async download(url: string): Promise<AxiosResponse<Blob>> {
        return axios.get<Blob>(url, { headers: headers(), responseType: 'blob' });
    }
}

export const AxiosService = new AxiosClass();
