<template>
    <RouterLink   :to="{ name: routeName }" class="hs-tooltip-toggle ti-btn ti-btn-primary !m-0 btn-wave ti-btn-sm">

        <AppIcon :name="icon ?? 'plus'" :size="16" class="me-1 align-middle" />{{ buttonText }}
    </RouterLink>
</template>

<script setup>
const props = defineProps(['routeName', 'buttonText','icon'])

</script>
