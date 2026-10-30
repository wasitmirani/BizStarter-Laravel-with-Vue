import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Reactive view of the authenticated user bootstrapped by Blade.
 * Kept in a store so profile edits update the topbar and sidebar without a reload.
 */
export const useAuthStore = defineStore('auth', () => {
    const user = ref<AppContextUser>(null);

    function initFromWindow(): void {
        user.value = window.__APP_CONTEXT__?.auth.user ?? window.user ?? null;
    }

    function setUser(next: AppContextUser): void {
        user.value = next;
    }

    return { user, initFromWindow, setUser };
});
