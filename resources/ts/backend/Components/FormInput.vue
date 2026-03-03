<!-- DynamicInput.vue -->
<template>
    <div class="form-floating mb-3" v-if="inputStyle === 'float'">
        <!-- <input type="email" class="form-control" value="Wasit" id="floatingInput" placeholder="name@example.com"> -->
        <input class="form-control" :type="type" :id="name" :name="name" :placeholder="placeholder" :value="modelValue"
        @input="updateValue" @keyup="updateValue" :class="{ 'is-invalid': hasError }" :autofocus="autofocus" />
        <label :for="name">{{ label }}</label>
        <div  v-if="hasError" class="invalid-feedback">
        <validate-input :errors="errors" :value="name" />
                                            </div>
    </div>
    <div v-else>
        <label :for="name" class="form-label">{{ label }}</label>
        <input class="form-control" :type="type" :id="name" :name="name" :placeholder="placeholder" :value="modelValue"
            @input="updateValue" @keyup="updateValue" :class="{ 'is-invalid': hasError }" :autofocus="autofocus" />
            <div  v-if="hasError" class="invalid-feedback">
                
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
        console.log("hasError", hasError);
        console.log("errors", props.errors);

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
