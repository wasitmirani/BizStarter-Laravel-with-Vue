<template>
    <VueMultiselect
      v-bind="forwardedAttrs"
      v-model="model"
      :placeholder="placeholder"
      :track-by="trackBy"
      :label="resolvedOptionLabel"
      :options="options"
      :multiple="multiple"
    >

      <!-- 🔥 forward ALL slots (VERY IMPORTANT) -->
      <template v-for="(_, name) in $slots" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps" />
      </template>

    </VueMultiselect>
  </template>

  <script setup lang="ts">
  import { computed, useAttrs } from 'vue';
  import VueMultiselect from 'vue-multiselect';
  import "vue-multiselect/dist/vue-multiselect.css";
  defineOptions({ inheritAttrs: false })

  const props = defineProps<{
    modelValue: any
    placeholder?: string
    trackBy?: string
    optionLabel?: string
    options: any[]
    multiple: boolean
  }>()

  const emit = defineEmits(['update:modelValue'])
  const attrs = useAttrs()

  const model = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  })

  const resolvedOptionLabel = computed(() => props.optionLabel || 'label')

  const forwardedAttrs = computed(() => {
    const { label, ...rest } = attrs
    return rest
  })
  </script>
