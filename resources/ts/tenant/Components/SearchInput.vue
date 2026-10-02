<template>
    <div class="input-icon-group">
        <i class="iconify tabler--search input-icon"></i>
        <input
            type="search"
            class="form-input w-auto ps-10"
            :placeholder="label || 'Search...'"
            title="Search characters should be greater than two."
            v-model="query"
        />
    </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import debounce from 'lodash/debounce'
import { ref, watch } from 'vue'
import { Helpers } from '../Utils/Helper'

const router = Helpers.router()
const route = Helpers.route()

const props = defineProps<{
    label: string
    apiPath: string
}>()

const emit = defineEmits(['loading', 'filterData', 'query', 'reload'])

const query = ref('')
let controller: AbortController | null = null

const search = async (value: string) => {
    if (value.length <= 2) return

    // Cancel previous request
    if (controller) {
        controller.abort()
    }

    controller = new AbortController()

    emit('loading', true)

    try {
        const response = await axios.get(`${props.apiPath}?query=${value}`, {
            signal: controller.signal
        })

        emit('filterData', response.data)
        emit('query', value)

        Helpers.updateUrlWithFilters?.(
            route,
            router,
            { search: value },
            { omitDefaults: false }
        )
    } catch (error: any) {
        if (error.name !== 'CanceledError') {
            console.error(error)
        }
    } finally {
        emit('loading', false)
    }
}

const debouncedSearch = debounce((value: string) => {
    search(value)
}, 500)

watch(query, (newValue) => {
    if (!newValue.trim()) {
        emit('query', '')
        emit('reload')
        return
    }

    debouncedSearch(newValue)
})
</script>
