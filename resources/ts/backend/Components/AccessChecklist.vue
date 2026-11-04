<script setup lang="ts">
import { computed, ref } from 'vue';

export type AccessChecklistItem = {
    id: number | string;
    name: string;
    hint?: string | null;
};

const props = withDefaults(
    defineProps<{
        items: AccessChecklistItem[];
        modelValue: Array<number | string>;
        title?: string;
        description?: string;
        emptyText?: string;
        searchPlaceholder?: string;
    }>(),
    {
        title: '',
        description: '',
        emptyText: 'Nothing to choose from yet.',
        searchPlaceholder: 'Search…',
    },
);

const emit = defineEmits<{
    (event: 'update:modelValue', value: Array<number | string>): void;
}>();

const search = ref('');

const selectedKeys = computed(() => (props.modelValue ?? []).map((value) => String(value)));
const totalSelected = computed(() => selectedKeys.value.length);

const filtered = computed(() => {
    const term = search.value.trim().toLowerCase();
    if (!term) {
        return props.items;
    }

    return props.items.filter((item) => {
        const haystack = `${item.name} ${item.hint ?? ''}`.toLowerCase();
        return haystack.includes(term);
    });
});

const allFilteredSelected = computed(
    () => filtered.value.length > 0 && filtered.value.every((item) => selectedKeys.value.includes(String(item.id))),
);

function isSelected(id: number | string): boolean {
    return selectedKeys.value.includes(String(id));
}

function toggle(id: number | string): void {
    const key = String(id);

    if (selectedKeys.value.includes(key)) {
        emit('update:modelValue', props.modelValue.filter((value) => String(value) !== key));
        return;
    }

    emit('update:modelValue', [...props.modelValue, id]);
}

function toggleFiltered(): void {
    if (allFilteredSelected.value) {
        const filteredKeys = filtered.value.map((item) => String(item.id));
        emit('update:modelValue', props.modelValue.filter((value) => !filteredKeys.includes(String(value))));
        return;
    }

    const next = [...props.modelValue];
    for (const item of filtered.value) {
        if (!next.map(String).includes(String(item.id))) {
            next.push(item.id);
        }
    }

    emit('update:modelValue', next);
}

function clearAll(): void {
    emit('update:modelValue', []);
}
</script>

<template>
    <div class="acl">
        <div class="acl__head">
            <div>
                <p class="acl__title">{{ title }}</p>
                <p v-if="description" class="acl__description">{{ description }}</p>
            </div>
            <span class="lk-badge lk-badge--neutral">{{ totalSelected }} selected</span>
        </div>

        <div class="acl__toolbar">
            <input
                v-model="search"
                type="search"
                class="lk-input lk-input--sm"
                :placeholder="searchPlaceholder"
                :aria-label="searchPlaceholder"
            />
            <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" :disabled="!filtered.length" @click="toggleFiltered">
                {{ allFilteredSelected ? 'Clear shown' : 'Select shown' }}
            </button>
            <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" :disabled="!totalSelected" @click="clearAll">
                Clear all
            </button>
        </div>

        <div class="acl__list" role="group" :aria-label="title">
            <label v-for="item in filtered" :key="item.id" class="acl__option" :class="{ 'is-selected': isSelected(item.id) }">
                <input type="checkbox" :checked="isSelected(item.id)" @change="toggle(item.id)" />
                <span class="acl__option-text">
                    <span class="acl__option-name">{{ item.name }}</span>
                    <span v-if="item.hint" class="acl__option-hint">{{ item.hint }}</span>
                </span>
            </label>

            <p v-if="!filtered.length" class="acl__empty">
                {{ items.length ? 'No matches for that search.' : emptyText }}
            </p>
        </div>
    </div>
</template>

<style scoped>
.acl {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: 1px solid var(--lk-border);
    border-radius: 10px;
    padding: 14px;
    background: var(--lk-surface);
}

.acl__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
}

.acl__title {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: var(--lk-text);
}

.acl__description {
    margin: 2px 0 0;
    font-size: 11.5px;
    color: var(--lk-text-muted);
}

.acl__toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.acl__toolbar .lk-input {
    flex: 1 1 180px;
}

.acl__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 6px;
    max-height: 240px;
    overflow-y: auto;
    padding-right: 2px;
}

.acl__option {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 7px 9px;
    border: 1px solid var(--lk-border);
    border-radius: 8px;
    background: var(--lk-card);
    cursor: pointer;
    transition: border-color 120ms ease, background 120ms ease;
}

.acl__option:hover {
    border-color: var(--lk-primary);
}

.acl__option.is-selected {
    border-color: var(--lk-primary);
    background: var(--lk-primary-subtle);
}

.acl__option input {
    margin-top: 2px;
    accent-color: var(--lk-primary);
}

.acl__option-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.acl__option-name {
    font-size: 12.5px;
    font-weight: 500;
    color: var(--lk-text);
    overflow-wrap: anywhere;
}

.acl__option-hint {
    font-size: 11px;
    color: var(--lk-text-muted);
    overflow-wrap: anywhere;
}

.acl__empty {
    grid-column: 1 / -1;
    margin: 6px 0;
    font-size: 12px;
    color: var(--lk-text-muted);
}
</style>
