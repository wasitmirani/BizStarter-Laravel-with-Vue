<!-- components/CountryFlagName.vue -->
<template>
    <div class="flex items-center gap-2">
        <img
            :src="flag"
            :alt="country"
            class="size-6 rounded-full"
        >

        <span class="font-medium text-gray-800">
            {{ country }}
        </span>
    </div>
</template>

<script setup lang="ts">
interface Props {
    country: string
    code?: string
    flag?: string
}

const props = defineProps<Props>()

// Auto generate flag if not passed
const flag = props.flag || `https://flagcdn.com/w40/${(props.code || 'us').toLowerCase()}.png`
</script>