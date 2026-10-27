<script setup lang="ts">
defineProps<{
    modelValue: string;
    tabs: Array<{ key: string; label: string; count?: number }>;
    label?: string;
}>();

defineEmits<{ (event: 'update:modelValue', value: string): void }>();
</script>

<template>
    <ul class="nav nav-pills nav-light border p-1 rounded d-inline-flex flex-wrap gap-1" role="tablist" :aria-label="label ?? 'Filters'">
        <li v-for="tab in tabs" :key="tab.key" class="nav-item" role="presentation">
            <button
                type="button"
                class="nav-link py-1 fs-15 rounded-1"
                :class="{ active: modelValue === tab.key }"
                role="tab"
                :aria-selected="modelValue === tab.key"
                @click="$emit('update:modelValue', tab.key)"
            >
                {{ tab.label }}
                <span v-if="tab.count !== undefined" class="badge ms-1" :class="modelValue === tab.key ? 'bg-body text-body border' : 'bg-light text-body'">
                    {{ tab.count }}
                </span>
            </button>
        </li>
    </ul>
</template>
