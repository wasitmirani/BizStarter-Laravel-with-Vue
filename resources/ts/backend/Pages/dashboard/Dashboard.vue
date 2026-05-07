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

    <div class="container-fluid">
        <div class="grid grid-cols-1 gap-base mb-base xl:grid-cols-12">
            <div class="xl:col-span-5">
                <div class="grid h-full grid-cols-1 gap-base md:grid-cols-2">
                    <div class="card h-full overflow-hidden">
                        <!-- Card Header -->
                        <div class="card-body pb-0">
                            <div class="flex items-center justify-between">
                                <div class="overflow-hidden">
                                    <h3 class="mb-2 text-xl font-normal">
                                        <span class="text-sm font-medium uppercase text-default-400">
                                            {{ greeting }},
                                        </span>

                                        <br />

                                        <b>{{ $authUser?.name }}!</b>
                                    </h3>
                                </div>

                                <div class="text-end">
                                    <img
                                        class="hidden xl:block"
                                        :src="'/backend/images/svg/email-campaign.svg'"
                                        width="110"
                                        alt="Dashboard Image"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Card Footer -->
                        <div class="card-body flex items-center overflow-hidden bg-light/50 p-2.5">
                            <div class="flex w-full items-center justify-between">
                                <!-- Date -->
                                <div class="flex items-center gap-1.5">
                                    <i class="iconify tabler--calendar text-md"></i>

                                    <span class="font-semibold">
                                        {{ currentDate }}
                                    </span>
                                </div>

                                <!-- Time -->
                                <div class="flex items-center gap-1.5">
                                    <i class="iconify tabler--clock text-md"></i>

                                    <span class="font-semibold">
                                        {{ currentTime }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>