<script setup lang="ts">
defineProps<{
    user?: any;
}>();

const tenant = window.__APP_CONTEXT__?.config?.tenant;
</script>

<template>
    <div class="row g-4">
        <div class="col-md-6">
            <label class="form-label">Name</label>
            <input class="form-control" :value="user?.name" readonly />
        </div>
        <div class="col-md-6">
            <label class="form-label">Email</label>
            <input class="form-control" :value="user?.email" readonly />
        </div>
        <div class="col-md-6">
            <label class="form-label">Tenant</label>
            <input class="form-control" :value="tenant?.name" readonly />
        </div>
        <div class="col-md-6">
            <label class="form-label">Domain</label>
            <input class="form-control" :value="tenant?.domain" readonly />
        </div>
    </div>
</template>
