<script lang="ts" setup>
import { computed, ref } from 'vue';

type ToastTone = 'success' | 'error' | 'warning' | 'info';

type ToastItem = {
    id: number;
    tone: ToastTone;
    title: string;
    message: string;
};

const items = ref<ToastItem[]>([]);
let counter = 0;

const timers = new Map<number, number>();

function toneFor(status: number | string | undefined): ToastTone {
    if (status === 200 || status === 201 || status === 204 || status === 'success') return 'success';
    if (status === 400 || status === 422 || status === 500 || status === 'error' || status === 'danger') return 'error';
    if (status === 404 || status === 'warning') return 'warning';
    return 'info';
}

function messageFrom(response: unknown): string {
    if (typeof response === 'string') return response;
    if (response && typeof response === 'object') {
        const candidate = response as Record<string, unknown>;
        if (typeof candidate.message === 'string') return candidate.message;
        if (typeof candidate.error === 'string') return candidate.error;
    }
    return '';
}

function remove(id: number) {
    const timer = timers.get(id);
    if (timer) window.clearTimeout(timer);
    timers.delete(id);
    items.value = items.value.filter((item) => item.id !== id);
}

/**
 * Backwards-compatible toast contract used by the existing admin screens:
 *   inject('toast').value.showToast(status, title, response)
 */
function showToast(status: number | string, title: string, response?: unknown): void {
    const id = ++counter;
    const item: ToastItem = {
        id,
        tone: toneFor(status),
        title: title || 'Notice',
        message: messageFrom(response),
    };

    items.value = [item, ...items.value].slice(0, 4);

    timers.set(
        id,
        window.setTimeout(() => remove(id), 4800),
    );
}

defineExpose({ showToast });

const iconFor = computed(() => (tone: ToastTone) => {
    switch (tone) {
        case 'success':
            return 'M20 6 9 17l-5-5';
        case 'error':
            return 'M12 8v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z';
        case 'warning':
            return 'M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z';
        default:
            return 'M12 16v-4m0-4h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z';
    }
});
</script>

<template>
    <Teleport to="body">
        <div class="lk-toast-region" aria-live="polite" aria-atomic="false">
            <TransitionGroup name="lk-toast">
                <div
                    v-for="item in items"
                    :key="item.id"
                    class="lk-toast"
                    :class="`lk-toast--${item.tone}`"
                    :role="item.tone === 'error' ? 'alert' : 'status'"
                >
                    <span class="lk-toast__icon" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path :d="iconFor(item.tone)" />
                        </svg>
                    </span>
                    <div class="lk-toast__body">
                        <p class="lk-toast__title">{{ item.title }}</p>
                        <p v-if="item.message" class="lk-toast__message">{{ item.message }}</p>
                    </div>
                    <button type="button" class="lk-toast__close" aria-label="Dismiss notification" @click="remove(item.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>
                </div>
            </TransitionGroup>
        </div>
    </Teleport>
</template>

<style scoped>
.lk-toast-region {
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: min(360px, calc(100vw - 32px));
    pointer-events: none;
}

.lk-toast {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 12px 12px 14px;
    background: var(--lk-card);
    border: 1px solid var(--lk-border);
    border-left: 3px solid var(--lk-info);
    border-radius: 10px;
    box-shadow: var(--lk-shadow-pop);
    pointer-events: auto;
}

.lk-toast--success {
    border-left-color: var(--lk-success);
}

.lk-toast--error {
    border-left-color: var(--lk-error);
}

.lk-toast--warning {
    border-left-color: var(--lk-warning);
}

.lk-toast__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: var(--lk-info-bg);
    color: var(--lk-info);
    flex-shrink: 0;
}

.lk-toast--success .lk-toast__icon {
    background: var(--lk-success-bg);
    color: var(--lk-success);
}

.lk-toast--error .lk-toast__icon {
    background: var(--lk-error-bg);
    color: var(--lk-error);
}

.lk-toast--warning .lk-toast__icon {
    background: var(--lk-warning-bg);
    color: var(--lk-warning);
}

.lk-toast__body {
    min-width: 0;
    flex: 1;
}

.lk-toast__title {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: var(--lk-text);
}

.lk-toast__message {
    margin: 2px 0 0;
    font-size: 12.5px;
    color: var(--lk-text-muted);
    line-height: 1.4;
    word-break: break-word;
}

.lk-toast__close {
    border: 0;
    background: transparent;
    color: var(--lk-text-muted);
    cursor: pointer;
    padding: 2px;
    border-radius: 5px;
    flex-shrink: 0;
}

.lk-toast__close:hover {
    color: var(--lk-text);
    background: var(--lk-surface);
}

.lk-toast-enter-active,
.lk-toast-leave-active {
    transition: opacity 160ms ease, transform 160ms ease;
}

.lk-toast-enter-from,
.lk-toast-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}
</style>
