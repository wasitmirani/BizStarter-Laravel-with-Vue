<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Helpers } from '../Utils/Helper'
const props = defineProps<{ routeName?: string }>()

const emit = defineEmits(['filterChange'])

const route = useRoute()
const router = useRouter()

const ignoredKeys = ['page', 'per_page', 'sort']

const formatLabel = (key: string) =>
  key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

// compute active filters from query
const activeFilters = computed(() =>
  Object.entries(route.query).filter(
    ([key, value]) => !ignoredKeys.includes(key) && value !== '' && value !== null
  )
)

const activeFilterCount = computed(() => activeFilters.value.length)

// normalize query: remove empty or undefined keys
const normalizeQuery = (query: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(query).filter(([_, value]) => value !== undefined && value !== null && value !== '')
  )
}


// remove a single filter
const removeFilter = async (key: string) => {
    const updatedQuery = { ...route.query }
    delete updatedQuery[key] // remove the key

    // Use the helper with the full updated query
    Helpers.updateUrlWithFilters?.(
        route,
        router,
        updatedQuery, // pass full updated query
        { omitDefaults: false }
    )

    // emit normalized query so parent updates
    emit('filterChange', normalizeQuery(updatedQuery))
}

// clear all filters
const clearAllFilters = async () => {
  await router.push({
    name: props.routeName || (route.name as string),
    query: {}
  })
  emit('filterChange', {})
}
</script>

<template>
  <div v-if="activeFilterCount > 0" class="flex flex-wrap items-center gap-2 mt-2">
    <span class="text-xs font-medium text-default-500">
      {{ activeFilterCount }} filter{{ activeFilterCount > 1 ? 's' : '' }} active:
    </span>

    <div
      v-for="([key, value]) in activeFilters"
      :key="key"
      class="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium"
    >
      <span>{{ formatLabel(key) }}:</span>
      <span class="font-semibold">{{ value }}</span>

      <button
        type="button"
        @click="removeFilter(key)"
        class="hover:text-danger transition"
      >
        <i class="iconify tabler--x text-sm"></i>
      </button>
    </div>

    <button type="button" @click="clearAllFilters" class="text-xs text-danger hover:underline">
      Clear all
    </button>
  </div>
</template>
