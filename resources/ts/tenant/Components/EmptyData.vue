
<script setup lang="ts">
const props = defineProps(['message', 'is_rows'])

</script>

<template>
    <div class="alert alert-outline-warning alert-dismissible fade show" role="alert">
      <strong v-if="is_rows !== undefined"> {{ props.is_rows  ?  'No Rows!' : '' }} </strong>
      <strong v-else-if="props.is_rows === undefined"> No Rows! </strong>
        {{props.message}}
      <button aria-label="Close" class="btn-close" data-bs-dismiss="alert" type="button">
        <span aria-hidden="true">×</span>
      </button>
    </div>
  </template>
  