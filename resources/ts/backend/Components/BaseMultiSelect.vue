<template>
    <VueMultiselect
      v-model="model"
      :placeholder="placeholder"
      :track-by="trackBy"
      :label="optionLabel"
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
  import { computed } from 'vue';

  const props = defineProps<{
    modelValue: any
    placeholder?: string
    trackBy?: string
    optionLabel?: string
    options: any[]
    multiple: boolean
  }>()

  const emit = defineEmits(['update:modelValue'])

  const model = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  })
  </script>
