<template>
    <RouterLink   :to="{ name: routeName }" class="hs-tooltip-toggle ti-btn ti-btn-primary !m-0 btn-wave ti-btn-sm">

        <i :class="`${icon ?? 'ri-add-line'} me-1 align-middle`"></i>{{ buttonText }}
    </RouterLink>
</template>

<script setup>
const props = defineProps(['routeName', 'buttonText','icon'])

</script>
