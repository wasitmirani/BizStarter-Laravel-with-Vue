<script setup lang="ts">
withDefaults(
    defineProps<{
        title: string;
        subtitle?: string;
        eyebrow?: string;
        backTo?: string;
    }>(),
    { backTo: 'dashboard' },
);
</script>

<template>
    <div class="page-heading mb-4 flex-column flex-md-row gap-3">
        <div class="flex-grow-1 min-w-0">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb mb-1 fs-14 app-breadcrumb">
                    <li class="breadcrumb-item">
                        <router-link :to="{ name: backTo }" class="text-muted">Workspace</router-link>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">{{ eyebrow ?? title }}</li>
                </ol>
            </nav>
            <h5 class="mb-1">{{ title }}</h5>
            <p v-if="subtitle" class="text-muted fs-15 mb-0">{{ subtitle }}</p>
        </div>

        <div class="d-flex flex-wrap align-items-center gap-2 flex-shrink-0">
            <slot name="actions" />
        </div>
    </div>
</template>

<style scoped>
/* The Alloce bundle ships a corrupted remixicon glyph for this separator. */
.app-breadcrumb :deep(.breadcrumb-item + .breadcrumb-item::before) {
    content: "/";
    font-family: inherit;
}
</style>
