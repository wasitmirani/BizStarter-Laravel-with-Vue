<script setup lang="ts">
const props = defineProps(['current', 'links'])

</script>
<template>

    <div class="page-title-head">
        <h4 class="page-main-title">{{ props.current }}</h4>

        <div class="hidden items-center gap-1.25 text-sm md:flex">

            <router-link to="/" class="text-sm">Home</router-link>

            <i class="iconify tabler--chevron-right text-sm rtl:rotate-180"></i>

            <a href="#" class="text-sm" v-for="link in props.links" :key="link.id">{{ link.name }}</a>

            <i class="iconify tabler--chevron-right text-sm rtl:rotate-180"></i>

            <a href="#" class="text-default-400 text-sm" aria-current="page">{{ props.current }}</a>
        </div>
    </div>
</template>
<style></style>
