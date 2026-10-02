<script lang="ts" setup>
import { ref, provide, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Footer from "./partials/Footer.vue";
import Head from "./partials/Head.vue";
import SideBarMenu from "./partials/SideBarMenu.vue";
import Switcher from "./partials/Switcher.vue";
import { Helpers } from '../Utils/Helper';
import { loadAlloceScripts, refreshAlloceIcons } from '../Utils/alloce/loadAlloceScripts';

const toast = Helpers.useDynamicRef(null);
provide('toast', toast);

// Progress bar state
const isLoading = ref(false);
const progress = ref(0);
let progressInterval: number | null = null;

// PWA install prompt state
const installPromptEvent = ref<any | null>(null);
const showInstallBanner = ref(false);

const router = useRouter();
const route = useRoute();

const handleBeforeInstallPrompt = (event: Event) => {
    installPromptEvent.value = (event as any).detail ?? event;
    showInstallBanner.value = true;
};

const requestInstall = async () => {
    if (!installPromptEvent.value) return;

    try {
        const promptEvent = installPromptEvent.value;
        const result = await promptEvent.prompt();

        // Some browsers resolve with userChoice, some expose it as a property
        const choice = result?.outcome ?? promptEvent.userChoice?.outcome;
        if (choice === 'accepted') {
            showInstallBanner.value = false;
            installPromptEvent.value = null;
        }
    } catch (error) {
        console.error('[PWA] Install prompt failed', error);
    }
};

let alloceFrame: number | null = null;
let iconsFrame: number | null = null;

onMounted(() => {
    if (window.__pwaInstallPrompt) {
        installPromptEvent.value = window.__pwaInstallPrompt;
        showInstallBanner.value = true;
    }

    window.addEventListener('pwa:beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    // Defer Alloce main.js until after mount so #toggleSidebar /
    // #darkModeButton / #settingsModal exist (same as React Starter Kit).
    alloceFrame = requestAnimationFrame(() => {
        void loadAlloceScripts().then(() => {
            document.body.classList.remove('sidebar-hidden');
            const html = document.documentElement;
            if (!html.getAttribute('data-sidebar') || html.getAttribute('data-sidebar') === 'small') {
                html.setAttribute('data-sidebar', 'large');
                sessionStorage.setItem('data-sidebar', 'large');
            }
            void refreshAlloceIcons();
        });
    });

    // Start progress on route change
    router.beforeEach((to, from, next) => {
        startProgress();
        next();
    });

    // Complete progress when route is loaded
    router.afterEach(() => {
        completeProgress();
    });
});

onBeforeUnmount(() => {
    window.removeEventListener('pwa:beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    if (alloceFrame !== null) cancelAnimationFrame(alloceFrame);
    if (iconsFrame !== null) cancelAnimationFrame(iconsFrame);
});

watch(
    () => route.path,
    () => {
        if (iconsFrame !== null) cancelAnimationFrame(iconsFrame);
        iconsFrame = requestAnimationFrame(() => {
            void refreshAlloceIcons();
        });
    },
);

const startProgress = () => {
    isLoading.value = true;
    progress.value = 0;

    // Simulate progress
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

    setTimeout(() => {
        isLoading.value = false;
        progress.value = 0;
    }, 300);
};
</script>

<template>
    <div>
        <!-- Progress Bar -->
        <Transition name="progress-fade">
            <div v-if="isLoading" class="router-progress-bar">
                <div
                    class="router-progress-bar-inner"
                    :style="{ width: progress + '%' }"
                ></div>
            </div>
        </Transition>

        <div class="body-effect-img"></div>
        <div class="body-top-line"></div>
        <div class="body-bottom-line"></div>

        <Head />
        <Switcher />
        <SideBarMenu />

        <div id="sidebar-backdrop" class="sidebar-backdrop"></div>
        <div class="min-vh-100 position-relative">
            <div class="page-wrapper">
                <div class="container-fluid">
                    <router-view />
                    <FlashMessage ref="toast" />
                </div>
            </div>
            <Footer />
        </div>

        <!-- PWA install banner -->
        <transition name="slide-fade">
            <div
                v-if="showInstallBanner"
                class="fixed bottom-4 right-4 z-[10000] max-w-xs rounded-xl border border-slate-700 bg-slate-900/95 px-4 py-3 shadow-2xl text-sm text-slate-100"
            >
                <div class="flex items-start gap-3">
                    <div class="mt-0.5">
                        <span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                            <i class="iconify tabler--device-mobile"></i>
                        </span>
                    </div>
                    <div class="flex-1">
                        <p class="font-semibold mb-1">Install admin as an app</p>
                        <p class="text-xs text-slate-300 mb-2">
                            Add LarabaseKit admin to your home screen for a faster, full-screen experience.
                        </p>
                        <div class="flex items-center justify-end gap-2">
                            <button
                                type="button"
                                class="text-xs text-slate-400 hover:text-slate-200"
                                @click="showInstallBanner = false"
                            >
                                Not now
                            </button>
                            <button
                                type="button"
                                class="btn bg-primary text-white hover:bg-primary-hover btn-xs"
                                @click="requestInstall"
                            >
                                Install app
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
/* Progress Bar Styles */
.router-progress-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.1);
}

.router-progress-bar-inner {
    height: 100%;
    background: linear-gradient(90deg, #15dd80, #8b5cf6, #ec4899);
    transition: width 0.2s ease;
    box-shadow: 0 0 10px rgba(10, 202, 170, 0.5);
}

.progress-fade-enter-active,
.progress-fade-leave-active {
    transition: opacity 0.3s ease;
}

.progress-fade-enter-from,
.progress-fade-leave-to {
    opacity: 0;
}

/* Existing transition styles */
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: transform 0.6s ease-in-out, opacity 0.6s ease-in-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(16px);
    opacity: 0;
}

.slide-fade-enter-to,
.slide-fade-leave-from {
    transform: translateX(0);
    opacity: 1;
}
</style>
