<script setup lang="ts">
const props = defineProps<{
    current: string;
    links?: Array<{ name: string; route: string; id?: string | number }>;
}>();
</script>

<template>
    <div class="gap-2 page-heading mb-4 flex-column flex-md-row">
        <h6 class="flex-grow-1 mb-0">{{ props.current }}</h6>
        <ul class="breadcrumb flex-shrink-0 mb-0">
            <li class="breadcrumb-item">
                <router-link to="/app/dashboard">Home</router-link>
            </li>
            <li
                v-for="link in props.links || []"
                :key="link.id ?? link.route"
                class="breadcrumb-item"
            >
                <router-link :to="{ name: link.route }">{{ link.name }}</router-link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">{{ props.current }}</li>
        </ul>
    </div>
</template>
