<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

const now = ref(new Date());

let interval: ReturnType<typeof setInterval> | null = null;

/**
 * Greeting Message
 */
const greeting = computed(() => {
    const hour = now.value.getHours();

    if (hour >= 5 && hour < 12) {
        return 'Good Morning';
    }

    if (hour >= 12 && hour < 18) {
        return 'Good Afternoon';
    }

    return 'Good Evening';
});

/**
 * Current Date
 */
const currentDate = computed(() => {
    return new Intl.DateTimeFormat(undefined, {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(now.value);
});

/**
 * Current Time
 */
const currentTime = computed(() => {
    return new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    }).format(now.value);
});

/**
 * Start Clock
 */
const startClock = () => {
    interval = setInterval(() => {
        now.value = new Date();
    }, 1000);
};

onMounted(() => {
    startClock();
});

onUnmounted(() => {
    if (interval) {
        clearInterval(interval);
    }
});
</script>

<template>
    <!-- Breadcrumb -->
    <BreadcrumbComponent
        :current="'Main Dashboard'"
        :links="[
            {
                name: 'Dashboard',
                route: 'dashboard',
            },
        ]"
    />
    <div class="container">
        <div class="row">
            <div class="col-12">
                <h1>Dashboard {{ $authUser?.name }} {{ greeting }} {{ currentDate }} {{ currentTime }}</h1>
            </div>
        </div>
    </div>
</template>