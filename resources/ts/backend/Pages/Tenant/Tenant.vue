<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import TenantForm from "./TenantForm.vue";
import TenantService from "../../Services/tenant/TenantService";

const route = useRoute();
const router = useRouter();
const submitting = ref(false);
const tenantId = computed(() => route.params.id as string | undefined);
const isEdit = computed(() => !!tenantId.value);

const form = ref<any>({
    name: "",
    slug: "",
    domain: "",
    database: "",
    status: "active",
    contact_email: "",
    contact_phone: "",
    timezone_id: null,
    language_id: null,
    currency_id: null,
    max_users: 10,
    max_roles: 5,
});

const loadTenant = async () => {
    if (!isEdit.value) {
        return;
    }
    const response = await TenantService.get(tenantId.value as string);
    const tenant = response?.data?.result?.tenant;
    if (tenant) {
        form.value = { ...form.value, ...tenant };
    }
};

const submit = async () => {
    submitting.value = true;
    try {
        if (isEdit.value) {
            await TenantService.update(tenantId.value as string, form.value);
        } else {
            await TenantService.create(form.value);
        }
        router.push({ name: "tenants" });
    } finally {
        submitting.value = false;
    }
};

onMounted(loadTenant);
</script>

<template>
    <BreadcrumbComponent
        :current="isEdit ? 'Edit Tenant' : 'Create Tenant'"
        :links="[{ name: 'Dashboard', route: 'dashboard' }, { name: 'Tenants', route: 'tenants' }]"
    />
    <div class="container-fluid">
        <TenantForm v-model="form" :heading="isEdit ? 'Update Tenant' : 'Create Tenant'" :submitting="submitting" @submit="submit" />
    </div>
</template>
