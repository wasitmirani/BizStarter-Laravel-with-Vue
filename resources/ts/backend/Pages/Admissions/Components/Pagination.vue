<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    meta: { current_page: number; last_page: number; total: number; per_page?: number };
}>();

const emit = defineEmits<{ (event: 'change', page: number): void }>();

const perPage = computed(() => props.meta.per_page ?? 12);

const from = computed(() => (props.meta.total === 0 ? 0 : (props.meta.current_page - 1) * perPage.value + 1));
const to = computed(() => Math.min(props.meta.current_page * perPage.value, props.meta.total));

const pages = computed(() => {
    const last = props.meta.last_page;
    const current = props.meta.current_page;
    const window = 2;
    const start = Math.max(1, Math.min(current - window, last - window * 2));
    const end = Math.min(last, Math.max(current + window, window * 2 + 1));

    const list: number[] = [];
    for (let page = start; page <= end; page += 1) list.push(page);
    return list;
});

const go = (page: number) => {
    if (page < 1 || page > props.meta.last_page || page === props.meta.current_page) return;
    emit('change', page);
};
</script>

<template>
    <div v-if="meta.last_page > 1" class="d-flex flex-wrap gap-2 justify-content-between align-items-center mt-4">
        <p class="text-muted fs-14 mb-0">Showing {{ from }}–{{ to }} of {{ meta.total }}</p>

        <nav aria-label="Pagination">
            <ul class="pagination pagination-sm mb-0">
                <li class="page-item" :class="{ disabled: meta.current_page <= 1 }">
                    <button type="button" class="page-link" aria-label="Previous page" @click="go(meta.current_page - 1)">
                        <AppIcon name="chevron-left" :size="16" />
                    </button>
                </li>
                <li v-for="page in pages" :key="page" class="page-item" :class="{ active: page === meta.current_page }">
                    <button type="button" class="page-link" @click="go(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: meta.current_page >= meta.last_page }">
                    <button type="button" class="page-link" aria-label="Next page" @click="go(meta.current_page + 1)">
                        <AppIcon name="chevron-right" :size="16" />
                    </button>
                </li>
            </ul>
        </nav>
    </div>
</template>
