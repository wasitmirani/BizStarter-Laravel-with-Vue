<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ status?: string; verifiedAt?: string | null; sample?: boolean }>();

const config = computed(() => {
    switch (props.status) {
        case 'confirmed':
            return { label: 'Verified source', classes: 'bg-success-subtle text-success border-success-subtle', icon: 'shield-check' };
        case 'estimated':
            return { label: 'Estimated', classes: 'bg-info-subtle text-info border-info-subtle', icon: 'help-circle' };
        case 'unavailable':
            return { label: 'Unavailable', classes: 'bg-secondary-subtle text-secondary border-secondary-subtle', icon: 'minus' };
        default:
            return { label: 'Unverified', classes: 'bg-warning-subtle text-warning border-warning-subtle', icon: 'alert-triangle' };
    }
});
</script>

<template>
    <span class="d-inline-flex align-items-center gap-1 flex-wrap">
        <span class="badge border d-inline-flex align-items-center gap-1" :class="config.classes">
            <AppIcon :name="config.icon" :size="13" />{{ config.label }}
        </span>
        <span v-if="sample" class="badge bg-dark-subtle text-dark border-dark-subtle" title="Demo catalog record — confirm on the official page">
            Demo
        </span>
        <span v-if="verifiedAt" class="text-muted fs-14">checked {{ verifiedAt }}</span>
    </span>
</template>
