<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const now = ref(new Date());
let clockInterval: ReturnType<typeof setInterval> | undefined;

const currentDate = computed(() =>
    new Intl.DateTimeFormat(undefined, {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(now.value),
);

const currentTime = computed(() =>
    new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    }).format(now.value),
);

onMounted(() => {
    now.value = new Date();
    clockInterval = setInterval(() => {
        now.value = new Date();
    }, 1000);
});

onBeforeUnmount(() => {
    if (clockInterval) {
        clearInterval(clockInterval);
    }
});
</script>
<template>
    <!-- Breadcrumb  -->
    <BreadcrumbComponent :current="'Main Dashboard'" :links="[{ name: 'Dashboard', route: 'dashboard' }]" />
    <div class="container-fluid">
        <div class="grid xl:grid-cols-12 grid-cols-1 gap-base mb-base">
            <div class="xl:col-span-5">
                <div class="grid md:grid-cols-2 grid-cols-1 gap-base h-full">
                    <div class="card h-full overflow-hidden">
                        <div class="card-body pb-0">
                            <div class="flex justify-between items-center">
                                <div class="overflow-hidden">
                                    <h3 class="font-normal text-xl mb-2">
                                        <span class="text-default-400 text-sm uppercase font-medium">Good
                                            Day,</span>
                                        <br>
                                        <b>David Dev!</b>
                                    </h3>
                                </div>
                                <div class="text-end">
                                    <img class="xl:block hidden" :src="`/backend/images/svg/email-campaign.svg`"
                                        width="110" alt="Generic placeholder image">
                                </div>
                            </div>
                        </div>

                        <div class="card-body p-2.5 flex items-center bg-light/50 overflow-hidden">
                            <p class="flex items-center justify-between w-full">
                                <span class="flex items-center gap-1.25">
                                    <i class="iconify tabler--calendar align-middle text-md"></i>
                                    <span class="ms-1 font-semibold">
                                        {{ currentDate }}
                                    </span>
                                </span>

                                <span class="flex items-center gap-1.25">
                                    <i class="iconify tabler--clock align-middle text-md"></i>
                                    <span class="font-semibold">{{ currentTime }}</span>
                                </span>
                            </p>
                        </div>
                    </div>

                </div>
            </div>

        </div>

       
        
    </div>
</template>
