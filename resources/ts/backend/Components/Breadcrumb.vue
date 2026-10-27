<script setup lang="ts">
const props = defineProps(['current', 'links'])

</script>
<template>

    <div class="page-title-head">
        <h4 class="page-main-title">{{ props.current }}</h4>

        <div class="hidden items-center gap-1.25 text-sm md:flex">
            <router-link to="/app" class="text-sm">Home</router-link>
            <AppIcon name="chevron-right" class="text-sm rtl:rotate-180" />

            <template v-for="(link, idx) in props.links" :key="idx">
                <router-link
                    :to="{ name: link.route }"
                    class="text-sm"
                >
                    {{ link.name }}
                </router-link>
                <AppIcon
                    v-if="Number(idx) < props.links.length - 1"
                    name="chevron-right"
                    class="text-sm rtl:rotate-180"
                />
            </template>
            <AppIcon v-if="props.links?.length" name="chevron-right" class="text-sm rtl:rotate-180" />
            <span class="text-default-400 text-sm" aria-current="page">{{ props.current }}</span>
        </div>
    </div>
</template>
<style></style>
