<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue';

const props = withDefaults(
    defineProps<{
        show: boolean;
        title: string;
        subtitle?: string;
        icon?: string;
        size?: 'sm' | 'md' | 'lg' | 'xl';
    }>(),
    { size: 'md' },
);

const emit = defineEmits<{ (event: 'close'): void }>();

const sizes: Record<string, string> = {
    sm: 'modal-sm',
    md: '',
    lg: 'modal-lg',
    xl: 'modal-xl',
};

const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && props.show) emit('close');
};

watch(
    () => props.show,
    (visible) => {
        document.body.classList.toggle('modal-open', visible);
    },
);

onMounted(() => document.addEventListener('keydown', onKeydown));

onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown);
    document.body.classList.remove('modal-open');
});
</script>

<template>
    <Teleport to="body">
        <Transition name="app-modal">
            <div v-if="show" class="modal d-block app-modal" role="dialog" aria-modal="true" :aria-label="title" @click.self="emit('close')">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" :class="sizes[size]">
                    <div class="modal-content border-0 shadow-lg">
                        <div class="modal-header d-flex align-items-center">
                            <div v-if="icon" class="avatar bg-primary-subtle text-primary size-10 rounded-circle me-3 flex-shrink-0">
                                <AppIcon :name="icon" :size="20" />
                            </div>
                            <div class="flex-grow-1 min-w-0">
                                <h6 class="modal-title mb-0">{{ title }}</h6>
                                <p v-if="subtitle" class="text-muted fs-14 mb-0">{{ subtitle }}</p>
                            </div>
                            <button type="button" class="btn btn-icon btn-light size-7-5 flex-shrink-0" aria-label="Close" @click="emit('close')">
                                <AppIcon name="x" :size="16" />
                            </button>
                        </div>

                        <div class="modal-body">
                            <slot />
                        </div>

                        <div v-if="$slots.footer" class="modal-footer border-0 pt-0">
                            <slot name="footer" />
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.app-modal {
    background: rgba(16, 24, 40, 0.55);
    backdrop-filter: blur(2px);
}

.app-modal-enter-active,
.app-modal-leave-active {
    transition: opacity 0.18s ease;
}

.app-modal-enter-active .modal-dialog,
.app-modal-leave-active .modal-dialog {
    transition: transform 0.18s ease, opacity 0.18s ease;
}

.app-modal-enter-from,
.app-modal-leave-to {
    opacity: 0;
}

.app-modal-enter-from .modal-dialog,
.app-modal-leave-to .modal-dialog {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
}
</style>
