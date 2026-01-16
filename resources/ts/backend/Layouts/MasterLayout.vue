<script lang="ts" setup>
import { ref, provide, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Footer from "./partials/Footer.vue";
import Head from "./partials/Head.vue";
import SideBarMenu from "./partials/SideBarMenu.vue";
import { Helpers } from '../Utils/Helper';

const toast = Helpers.useDynamicRef(null);
provide('toast', toast);

// Progress bar state
const isLoading = ref(false);
const progress = ref(0);
let progressInterval: number | null = null;

const router = useRouter();

onMounted(() => {
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

        <Head />
        <!-- END HEADER -->
        <!-- SIDEBAR -->
        <SideBarMenu />
        <!-- END SIDEBAR -->
        <!-- MAIN-CONTENT -->
        <!-- Start::app-content -->
        <div class="page-content">
            <main>
                <router-view v-slot="{ Component }">
                    <Transition name="slide-fade">
                        <component :is="Component" />
                    </Transition>
                    <!-- Start::row-1 -->
                </router-view>
                <FlashMessage ref="toast" />
            </main>

            <Footer />
        </div>
        <!-- End::app-content -->
        <!-- END MAIN-CONTENT -->
        <!-- FOOTER -->

        <!-- Start::main-footer -->
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
.slide-fade-enter-active {
    transition: transform 0.6s ease-in-out, opacity 0.6s ease-in-out;
}

.slide-fade-leave-active {
    transition: transform 0.6s ease-in-out, opacity 0.6s ease-in-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(16px);
    opacity: 0;
}
</style>
