<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
    name?: string
    img?: string
    href?: string
    email?: string
}>(), {
    name: '',
    img: '',
    href: '',
    email: ''
})

const imageError = ref(false)

const initials = computed(() => {
    return props.name
        ? props.name.trim().slice(0, 2).toUpperCase()
        : 'NA'
})
</script>

<template>
<div class="flex items-center gap-3">

    <!-- Avatar -->
    <div class="size-11 flex items-center justify-center rounded-full overflow-hidden bg-primary text-white text-xs font-semibold">

        <!-- Image -->
        <img
            v-if="props.img && !imageError"
            :src="props.img"
            :alt="props.name"
            class="w-full h-full object-cover"
            @error="imageError = true"
        />

        <!-- Initials fallback -->
        <span v-else>
            {{ initials }}
        </span>
    </div>

    <!-- User Info -->
    <div>
        <h5 class="leading-none">
            <!-- Link only if href exists -->
            <a
                v-if="props.href"
                :href="props.href"
                class="hover:text-primary"
            >
                {{ props.name || 'Unknown' }}
            </a>

            <span v-else>
                {{ props.name || 'Unknown' }}
            </span>
        </h5>

        <p v-if="props.email" class="text-default-400 text-xs">
            {{ props.email }}
        </p>
    </div>

</div>
</template>
