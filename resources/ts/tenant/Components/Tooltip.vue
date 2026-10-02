<script setup>


const props = defineProps({
    content: {
        type: String,
        required: true
    },
    position: {
        type: String,
        default: 'top'
    }
})
</script>

<template>
    <div :class="`hs-tooltip ti-main-tooltip hs-tooltip-${position}`">

            <slot></slot>
            <span class="hs-tooltip-content ti-main-tooltip-content py-1 px-2 !bg-black !text-xs !font-medium !text-white shadow-sm" role="tooltip">
                {{ content }}
            </span>

    </div>


</template>
