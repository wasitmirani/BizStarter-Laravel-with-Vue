import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

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
    async get<T>(url: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
        return axios.get<T>(url, {
            ...config,
            headers: { ...headers(), ...(config.headers as Record<string, string>) },
        });
    }

    async post<T>(url: string, body?: any, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
        return axios.post<T>(url, body, {
            ...config,
            headers: { ...headers(), ...(config.headers as Record<string, string>) },
        });
    }

    async put<T>(url: string, body: any, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
        return axios.put<T>(url, body, {
            ...config,
            headers: { ...headers(), ...(config.headers as Record<string, string>) },
        });
    }

    async patch<T>(url: string, body: any, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
        return axios.patch<T>(url, body, {
            ...config,
            headers: { ...headers(), ...(config.headers as Record<string, string>) },
        });
    }

    async delete<T>(url: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
        return axios.delete<T>(url, {
            ...config,
            headers: { ...headers(), ...(config.headers as Record<string, string>) },
        });
    }

    async download(url: string): Promise<AxiosResponse<Blob>> {
        return axios.get<Blob>(url, { headers: headers(), responseType: 'blob' });
    }
}

export const AxiosService = new AxiosClass();
