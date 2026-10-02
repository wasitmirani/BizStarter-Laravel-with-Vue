
<script setup lang="ts">
const props = defineProps(['errors'])

</script>

<template>
    <div class="mb-4 text-danger col-12" v-if="props.errors?.errors">
      <div class="font-medium text-red-600">Whoops! Something went wrong.</div>
      <ul class="mt-3 list-disc list-inside text-sm text-red-600">

        <div  v-for="error in props.errors.errors" :key="error.id"  class="alert mt-2 alert-outline-danger mg-b-0 alert-dismissible fade show" role="alert">
          <strong>Missing Field!</strong> {{ error.join(", ") }}
          <button aria-label="Close" class="btn-close" data-bs-dismiss="alert" type="button"><span aria-hidden="true">×</span></button>
        </div>
      </ul>
    </div>
  </template>
