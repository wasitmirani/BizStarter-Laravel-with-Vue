<script setup lang="ts">
import { computed } from 'vue';
import { appIcons, type AppIconName } from '../Utils/icons';

const props = withDefaults(
    defineProps<{
        name?: string;
        size?: number | string;
        strokeWidth?: number;
    }>(),
    {
        name: 'circle-help',
        size: 18,
        strokeWidth: 1.8,
    },
);

const resolved = computed(() => {
    const key = String(props.name ?? 'circle-help')
        .replace(/^iconify\s+/, '')
        .replace(/^tabler--/, '')
        .replace(/^lucide--/, '') as AppIconName;

    return appIcons[key] ?? appIcons['circle-help'];
});
</script>

<template>
    <component :is="resolved" :size="size" :stroke-width="strokeWidth" class="app-icon" aria-hidden="true" />
</template>

<style scoped>
.app-icon {
    flex-shrink: 0;
    vertical-align: -0.125em;
}
</style>
