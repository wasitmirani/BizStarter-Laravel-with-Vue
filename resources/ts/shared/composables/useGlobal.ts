import { computed, type ComputedRef, type Ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { usePermissionsStore } from '../stores/permissionsStore';

export type UseGlobalReturn = {
    router: ReturnType<typeof useRouter>;
    route: ReturnType<typeof useRoute>;
    /** Authenticated user from Blade (`window.user`), or null. */
    user: ComputedRef<unknown>;
    /** Optional layout/config bag from Blade (`window.config`). */
    appConfig: ComputedRef<Record<string, unknown> | undefined>;
    /** Reactive list of permission names (Spatie). */
    permissionNames: Ref<string[]>;
    /** Check a single permission (same logic as `v-can`). */
    hasPermission: (permission?: string) => boolean;
    /** Reload permissions from `GET /api/app/permissions`. */
    refreshPermissions: () => Promise<void>;
};

/**
 * App-wide composable — call only from `setup()` or other composables used inside components
 * (after Pinia + Vue Router are installed).
 */
export function useGlobal(): UseGlobalReturn {
    const router = useRouter();
    const route = useRoute();
    const permissionsStore = usePermissionsStore();
    const { names: permissionNames } = storeToRefs(permissionsStore);

    const user = computed(() =>
        typeof window !== 'undefined' ? (window.user ?? null) : null
    );

    const appConfig = computed((): Record<string, unknown> | undefined => {
        if (typeof window === 'undefined') return undefined;
        const cfg = (window as Window & { config?: Record<string, unknown> }).config;
        return cfg && typeof cfg === 'object' ? cfg : undefined;
    });

    function hasPermission(permission?: string): boolean {
        return permissionsStore.has(permission);
    }

    return {
        router,
        route,
        user,
        appConfig,
        permissionNames,
        hasPermission,
        refreshPermissions: () => permissionsStore.refreshFromApi(),
    };
}
