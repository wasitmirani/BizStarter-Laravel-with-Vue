<!-- DynamicInput.vue -->
<template>
    <div v-if="inputStyle === 'float'" class="mb-4">
        <div class="relative">
            <input
                class="form-input peer w-full border border-default-300 rounded placeholder-transparent focus:border-primary focus:ring-0"
                :type="type"
                :id="name"
                :name="name"
                :placeholder="placeholder"
                :value="modelValue"
                @input="updateValue"
                :class="{ 'is-invalid': hasError }"
                :autofocus="autofocus"
            />
            <label
                :for="name"
                class="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:left-3 peer-focus:text-sm peer-focus:text-primary bg-white px-1"
            >
                {{ label }}
            </label>
        </div>
        <div v-if="hasError" class="text-danger text-xs mt-1">
            <validate-input :errors="errors" :value="name" />
        </div>
    </div>
    <div v-else class="mb-4">
        <label :for="name" class="form-label text-sm font-medium mb-1 block">{{ label }}</label>
        <input
            class="form-input w-full border border-default-300 rounded focus:border-primary focus:ring-0"
            :type="type"
            :id="name"
            :name="name"
            :placeholder="placeholder"
            :value="modelValue"
            @input="updateValue"
            :class="{ 'is-invalid': hasError }"
            :autofocus="autofocus"
        />
        <div v-if="hasError" class="text-danger text-xs mt-1">
            <validate-input :errors="errors" :value="name" />
        </div>
    </div>

</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
    name: 'DynamicInput',
    props: {
        modelValue: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        placeholder: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            default: 'text',
        },
        autofocus: {
            type: Boolean,
            default: false,
        },
        errors: {
            type: Object,
            default: () => ({}),
        },
        inputStyle: {
            type: String,
            default: 'basic',
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const hasError = computed(() => props.errors?.[props.name]?.length > 0);
        const updateValue = (event: Event) => {
            delete props.errors[props.name];
            const target = event.target as HTMLInputElement;
            emit('update:modelValue', target.value);
        };

        return {
            hasError,
            updateValue,
        };
    },
});
</script>

<style scoped>
.is-invalid {
    border-color: red;
}
</style>
