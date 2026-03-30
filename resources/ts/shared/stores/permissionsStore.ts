import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

/** Permissions hydrated from Blade (`window.permissions`) or `/api/app/permissions`. */
export function readBootstrapPermissions(): string[] {
    if (typeof window === 'undefined') return [];
    const raw = (window as Window & { permissions?: unknown }).permissions;
    if (!Array.isArray(raw)) return [];
    return raw.map(String);
}

export const usePermissionsStore = defineStore('permissions', () => {
    const names = ref<string[]>([]);

    function initFromWindow(): void {
        names.value = readBootstrapPermissions();
    }

    function setPermissions(list: string[]): void {
        names.value = Array.isArray(list) ? [...list] : [];
    }

    function has(permission: string | undefined): boolean {
        if (!permission) return true;
        return names.value.includes(permission);
    }

    /** Re-fetch from the server (e.g. after role change) without relying on localStorage. */
    async function refreshFromApi(): Promise<void> {
        const { data } = await axios.get<{ permissions: string[] }>('/api/app/permissions', {
            withCredentials: true,
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
        });
        if (data?.permissions && Array.isArray(data.permissions)) {
            setPermissions(data.permissions);
        }
    }

    return { names, has, setPermissions, initFromWindow, refreshFromApi };
});
