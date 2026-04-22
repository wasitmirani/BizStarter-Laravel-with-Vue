<template>
  <div>
    <VueMultiselect
      v-model="selectedOption"
      :placeholder="placeholder"
      :track-by="trackBy"
      :label="optionLabel"
      :options="options"
      :multiple="multiple"
    />
  </div>
</template>

<script setup lang="ts">
import { Helpers } from '../Utils/Helper';

// Props
const props = defineProps<{
  modelValue: any
  placeholder?: string
  trackBy?: string
  optionLabel?: string   // ✅ rename this
  label?: string         // ✅ UI label
  options: any[]
  multiple:boolean,
}>()

// Emits
const emit = defineEmits(['update:modelValue'])

// Local state
const selectedOption = Helpers.useDynamicRef(props.modelValue)

// Sync parent -> child
Helpers.useDynamicWatch(
  () => props.modelValue,
  (val) => {
    selectedOption.value = val
  }
)

// Sync child -> parent
Helpers.useDynamicWatch(
  () => selectedOption.value,
  (val) => {
    emit('update:modelValue', val)
  }
)
</script>
