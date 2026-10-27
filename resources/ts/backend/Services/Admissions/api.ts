import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const client: AxiosInstance = axios.create({
    baseURL: '/api/v1',
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

client.interceptors.request.use((config) => {
    const token = window.token ?? (window.user as any)?.token ?? null;

    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export interface ApiResponse<T = any> {
    message: string;
    status: boolean;
    result: T;
}

export function unwrap<T = any>(response: { data: ApiResponse<T> }): T {
    return response.data.result;
}

export function errorMessage(error: any): string {
    return (
        error?.response?.data?.message ??
        error?.response?.data?.errors?.[Object.keys(error?.response?.data?.errors ?? {})[0]]?.[0] ??
        error?.message ??
        'Something went wrong.'
    );
}

export function validationErrors(error: any): Record<string, string[]> {
    return error?.response?.data?.errors ?? {};
}

export default client;
