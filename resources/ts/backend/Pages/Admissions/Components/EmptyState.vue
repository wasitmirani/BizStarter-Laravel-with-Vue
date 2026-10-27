<script setup lang="ts">
withDefaults(defineProps<{ title: string; message?: string; icon?: string }>(), {
    icon: 'inbox',
});
</script>

<template>
    <div class="text-center py-10 px-4">
        <span class="d-inline-flex align-items-center justify-content-center rounded-circle bg-light mb-3" style="width: 56px; height: 56px">
            <AppIcon :name="icon" :size="24" class="text-muted" />
        </span>
        <h6 class="mb-1">{{ title }}</h6>
        <p class="text-muted fs-15 mb-3">{{ message }}</p>
        <slot />
    </div>
</template>
