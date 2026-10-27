<script setup lang="ts">
import Modal from './Modal.vue';

withDefaults(
    defineProps<{
        show: boolean;
        title?: string;
        message?: string;
        confirmLabel?: string;
        busy?: boolean;
    }>(),
    {
        title: 'Delete this record?',
        message: 'This action cannot be undone.',
        confirmLabel: 'Delete',
        busy: false,
    },
);

defineEmits<{ (event: 'confirm'): void; (event: 'cancel'): void }>();
</script>

<template>
    <Modal :show="show" :title="title" icon="alert-triangle" size="sm" @close="$emit('cancel')">
        <p class="text-muted mb-0">{{ message }}</p>

        <template #footer>
            <button type="button" class="btn btn-light" :disabled="busy" @click="$emit('cancel')">Cancel</button>
            <button type="button" class="btn btn-danger" :disabled="busy" @click="$emit('confirm')">
                <span v-if="busy" class="spinner-border spinner-border-sm me-1" role="status"></span>
                {{ busy ? 'Deleting…' : confirmLabel }}
            </button>
        </template>
    </Modal>
</template>
