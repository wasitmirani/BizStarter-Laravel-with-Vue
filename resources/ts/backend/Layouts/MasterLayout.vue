<script lang="ts" setup>
import { onBeforeUnmount, onMounted, provide, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Footer from './partials/Footer.vue';
import AppSidebar from './partials/AppSidebar.vue';
import AppTopbar from './partials/AppTopbar.vue';
import ToastHost from '../Components/ToastHost.vue';
import { loadAlloceScripts, refreshAlloceIcons } from '../Utils/alloce/loadAlloceScripts';

const COLLAPSE_KEY = 'lk.sidebar.collapsed';

const toast = ref<InstanceType<typeof ToastHost> | null>(null);
provide('toast', toast);

const router = useRouter();
const route = useRoute();

const collapsed = ref(localStorage.getItem(COLLAPSE_KEY) === 'true');
const mobileOpen = ref(false);

// Progress bar state
const isLoading = ref(false);
const progress = ref(0);
let progressInterval: number | null = null;

// PWA install prompt state
const installPromptEvent = ref<any | null>(null);
const showInstallBanner = ref(false);

const handleBeforeInstallPrompt = (event: Event) => {
    installPromptEvent.value = (event as any).detail ?? event;
    showInstallBanner.value = true;
};

const requestInstall = async () => {
    if (!installPromptEvent.value) return;

    try {
        const promptEvent = installPromptEvent.value;
        const result = await promptEvent.prompt();
        const choice = result?.outcome ?? promptEvent.userChoice?.outcome;
        if (choice === 'accepted') {
            showInstallBanner.value = false;
            installPromptEvent.value = null;
        }
    } catch (error) {
        console.error('[PWA] Install prompt failed', error);
    }
};

function isMobileViewport() {
    return window.matchMedia('(max-width: 1023.98px)').matches;
}

function toggleSidebar() {
    if (isMobileViewport()) {
        mobileOpen.value = !mobileOpen.value;
        return;
    }

    collapsed.value = !collapsed.value;
    localStorage.setItem(COLLAPSE_KEY, String(collapsed.value));
}

function toggleCollapse() {
    collapsed.value = !collapsed.value;
    localStorage.setItem(COLLAPSE_KEY, String(collapsed.value));
}

function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && mobileOpen.value) {
        mobileOpen.value = false;
    }
}

function onViewportChange() {
    if (!isMobileViewport()) {
        mobileOpen.value = false;
    }
}

let alloceFrame: number | null = null;
let iconsFrame: number | null = null;

onMounted(() => {
    if (window.__pwaInstallPrompt) {
        installPromptEvent.value = window.__pwaInstallPrompt;
        showInstallBanner.value = true;
    }

    window.addEventListener('pwa:beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('keydown', onKeydown);
    window.matchMedia('(max-width: 1023.98px)').addEventListener('change', onViewportChange);

    // Bootstrap-powered widgets on legacy module screens still rely on the Alloce bundle.
    alloceFrame = requestAnimationFrame(() => {
        void loadAlloceScripts();
    });

    router.beforeEach(() => {
        startProgress();
    });

    router.afterEach(() => {
        completeProgress();
    });
});

onBeforeUnmount(() => {
    window.removeEventListener('pwa:beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.removeEventListener('keydown', onKeydown);
    window.matchMedia('(max-width: 1023.98px)').removeEventListener('change', onViewportChange);
    if (progressInterval) clearInterval(progressInterval);
    if (alloceFrame !== null) cancelAnimationFrame(alloceFrame);
    if (iconsFrame !== null) cancelAnimationFrame(iconsFrame);
});

watch(
    () => route.path,
    () => {
        mobileOpen.value = false;
        if (iconsFrame !== null) cancelAnimationFrame(iconsFrame);
        iconsFrame = requestAnimationFrame(() => {
            void refreshAlloceIcons();
        });
    },
);

const startProgress = () => {
    isLoading.value = true;
    progress.value = 0;

    if (progressInterval) clearInterval(progressInterval);

    progressInterval = setInterval(() => {
        if (progress.value < 90) {
            progress.value += Math.random() * 10;
        }
    }, 200) as unknown as number;
};

const completeProgress = () => {
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }

    progress.value = 100;

    window.setTimeout(() => {
        isLoading.value = false;
        progress.value = 0;
    }, 300);
};
</script>

<template>
    <div class="lk-app" :class="{ 'is-collapsed': collapsed, 'is-mobile-open': mobileOpen }">
        <Transition name="progress-fade">
            <div v-if="isLoading" class="router-progress-bar" aria-hidden="true">
                <div class="router-progress-bar-inner" :style="{ width: progress + '%' }"></div>
            </div>
        </Transition>

        <a class="lk-skip-link" href="#main-content">Skip to content</a>

        <AppSidebar
            :collapsed="collapsed"
            :mobile-open="mobileOpen"
            @close-mobile="mobileOpen = false"
            @toggle-collapse="toggleCollapse"
        />

        <div
            v-if="mobileOpen"
            class="lk-backdrop"
            role="presentation"
            @click="mobileOpen = false"
        ></div>

        <div class="lk-main">
            <AppTopbar :collapsed="collapsed" @toggle-sidebar="toggleSidebar" />

            <main id="main-content" class="lk-content" tabindex="-1">
                <router-view />
            </main>

            <Footer />
        </div>

        <ToastHost ref="toast" />

        <Transition name="slide-fade">
            <div
                v-if="showInstallBanner"
                class="lk-install-banner"
                role="dialog"
                aria-label="Install the admin portal"
            >
                <div class="lk-install-banner__icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></svg>
                </div>
                <div class="lk-install-banner__body">
                    <p class="lk-install-banner__title">Install admin as an app</p>
                    <p class="lk-install-banner__text">
                        Add {{ $appConfig?.appName ?? 'the portal' }} to your home screen for faster, full-screen access.
                    </p>
                    <div class="lk-install-banner__actions">
                        <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" @click="showInstallBanner = false">
                            Not now
                        </button>
                        <button type="button" class="lk-btn lk-btn--primary lk-btn--sm" @click="requestInstall">
                            Install app
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.lk-skip-link {
    position: absolute;
    top: -60px;
    left: 12px;
    z-index: 3000;
    padding: 8px 14px;
    border-radius: 8px;
    background: var(--lk-primary);
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
}

.lk-skip-link:focus {
    top: 12px;
}

.lk-install-banner {
    position: fixed;
    right: 16px;
    bottom: 16px;
    z-index: 1500;
    display: flex;
    gap: 12px;
    max-width: 340px;
    padding: 14px;
    background: var(--lk-card);
    border: 1px solid var(--lk-border);
    border-radius: 12px;
    box-shadow: var(--lk-shadow-pop);
}

.lk-install-banner__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: var(--lk-primary-subtle);
    color: var(--lk-primary-active);
    flex-shrink: 0;
}

.lk-install-banner__body {
    min-width: 0;
}

.lk-install-banner__title {
    margin: 0 0 2px;
    font-size: 13px;
    font-weight: 600;
    color: var(--lk-text);
}

.lk-install-banner__text {
    margin: 0 0 10px;
    font-size: 12px;
    color: var(--lk-text-muted);
}

.lk-install-banner__actions {
    display: flex;
    justify-content: flex-end;
    gap: 6px;
}

.router-progress-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    z-index: 2000;
    background-color: rgba(15, 23, 42, 0.08);
}

.router-progress-bar-inner {
    height: 100%;
    background: linear-gradient(90deg, var(--lk-primary), #34d399);
    transition: width 0.2s ease;
}

.progress-fade-enter-active,
.progress-fade-leave-active {
    transition: opacity 0.3s ease;
}

.progress-fade-enter-from,
.progress-fade-leave-to {
    opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(10px);
    opacity: 0;
}
</style>
