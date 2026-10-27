<script setup lang="ts">
withDefaults(
    defineProps<{
        label: string;
        value: string | number;
        hint?: string;
        icon?: string;
        tone?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';
    }>(),
    { icon: 'chart-bar', tone: 'primary' },
);
</script>

<template>
    <div class="card h-100">
        <div class="card-body d-flex align-items-start gap-3">
            <span class="avatar rounded" :class="`bg-${tone}-subtle text-${tone}`" style="width: 42px; height: 42px">
                <AppIcon :name="icon" :size="20" />
            </span>
            <div class="min-w-0">
                <p class="text-muted fs-15 mb-1">{{ label }}</p>
                <h4 class="mb-0">{{ value }}</h4>
                <p v-if="hint" class="text-muted fs-14 mb-0 mt-1">{{ hint }}</p>
            </div>
        </div>
    </div>
</template>
