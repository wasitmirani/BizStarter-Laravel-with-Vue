<script setup lang="ts">
import { Helpers } from '../Utils/Helper';
import { nextTick } from 'vue';

interface Props {
    id: string;
    title?: string;
    buttonLabel?: string;
    buttonClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
    title: 'Offcanvas',
    buttonLabel: 'Toggle offcanvas',
    buttonClass: 'btn bg-primary hover:bg-primary-hover text-white'
});

const offCanvasRef = Helpers.useDynamicRef<HTMLElement | null>(null);

Helpers.useDynamicOnMounted(() => {
    nextTick(() => {
        // Reinitialize HSOverlay for the new elements
        if ((window as any).HSOverlay) {
            (window as any).HSOverlay.autoInit();
        }
    });
});

// Expose methods for child components to trigger
const open = () => {
    const element = document.getElementById(props.id);
    if (element && (window as any).HSOverlay) {
        const overlay = (window as any).HSOverlay.getOrCreateInstance(element);
        if (overlay) {
            overlay.open();
        }
    }
};

const close = () => {
    const element = document.getElementById(props.id);
    if (element && (window as any).HSOverlay) {
        const overlay = (window as any).HSOverlay.getOrCreateInstance(element);
        if (overlay) {
            overlay.close();
        }
    }
};

defineExpose({
    open,
    close
});
</script>
<template>
    <div>
        <button :class="buttonClass" aria-haspopup="dialog" aria-expanded="false" :aria-controls="id" :data-hs-overlay="`#${id}`">
            <slot name="button-icon">
                {{ buttonLabel }}
            </slot>
        </button>

        <!-- Off-Canvas Modal -->
        <div :id="id" class="hs-overlay hs-overlay-open:translate-x-0 bg-card border-default-300 fixed end-0 top-0 z-80 h-full w-full max-w-sm translate-x-full transform border-s transition-all duration-300 hidden" role="dialog" :aria-labelledby="`${id}-label`">
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-default-200 p-5">
                <h3 :id="`${id}-label`" class="font-semibold">{{ title }}</h3>

                <button
                    type="button"
                    aria-label="Close"
                    :data-hs-overlay="`#${id}`"
                    aria-expanded="false"
                    class="text-gray-500 hover:text-gray-700"
                >
                    <span class="sr-only">Close</span>
                    <i class="iconify tabler--x text-xl"></i>
                </button>
            </div>

            <!-- Body - Scrollable Content -->
            <div class="overflow-y-auto flex-1 p-5" style="height: calc(100% - 70px);">
                <slot name="body">
                    <!-- <div>Some text as placeholder. In real life you can have the elements you have chosen. Like, text, images, lists, etc.</div> -->

                </slot>
            </div>
        </div>
    </div>

</template>
