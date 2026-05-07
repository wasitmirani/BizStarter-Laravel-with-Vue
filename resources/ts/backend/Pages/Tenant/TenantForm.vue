<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { AxiosService } from "../../Utils/AxiosService";

const props = defineProps<{
    modelValue: any;
    submitting?: boolean;
    heading: string;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: any): void;
    (e: "submit"): void;
}>();

const optionData = ref<{ timezones: any[]; languages: any[]; currencies: any[] }>({
    timezones: [],
    languages: [],
    currencies: [],
});

const model = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
});

const loadOptions = async () => {
    const response = await AxiosService.get("/dropdown/options-list");
    const options = response?.data?.result ?? {};
    optionData.value.timezones = options.timezones ?? [];
    optionData.value.languages = options.languages ?? [];
    optionData.value.currencies = options.currencies ?? [];
};

onMounted(loadOptions);
</script>

<template>
    <div class="card">
        <div class="card-header">
            <h4 class="mb-0">{{ heading }}</h4>
        </div>
        <div class="card-body">
            <form class="row g-3" @submit.prevent="$emit('submit')">
                <div class="col-md-6">
                    <label class="form-label">Name</label>
                    <input v-model="model.name" type="text" class="form-control" required />
                </div>
                <div class="col-md-6">
                    <label class="form-label">Slug</label>
                    <input v-model="model.slug" type="text" class="form-control" />
                </div>
                <div class="col-md-6">
                    <label class="form-label">Domain</label>
                    <input v-model="model.domain" type="text" class="form-control" />
                </div>
                <div class="col-md-6">
                    <label class="form-label">Database</label>
                    <input v-model="model.database" type="text" class="form-control" />
                </div>
                <div class="col-md-4">
                    <label class="form-label">Status</label>
                    <select v-model="model.status" class="form-select">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Contact Email</label>
                    <input v-model="model.contact_email" type="email" class="form-control" />
                </div>
                <div class="col-md-4">
                    <label class="form-label">Contact Phone</label>
                    <input v-model="model.contact_phone" type="text" class="form-control" />
                </div>
                <div class="col-md-4">
                    <label class="form-label">Timezone</label>
                    <select v-model="model.timezone_id" class="form-select">
                        <option :value="null">Select timezone</option>
                        <option v-for="item in optionData.timezones" :key="item.id" :value="item.id">{{ item.name }}</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Language</label>
                    <select v-model="model.language_id" class="form-select">
                        <option :value="null">Select language</option>
                        <option v-for="item in optionData.languages" :key="item.id" :value="item.id">{{ item.name }}</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Currency</label>
                    <select v-model="model.currency_id" class="form-select">
                        <option :value="null">Select currency</option>
                        <option v-for="item in optionData.currencies" :key="item.id" :value="item.id">{{ item.name }} ({{ item.code }})</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Max Users</label>
                    <input v-model="model.max_users" type="number" min="1" class="form-control" />
                </div>
                <div class="col-md-6">
                    <label class="form-label">Max Roles</label>
                    <input v-model="model.max_roles" type="number" min="1" class="form-control" />
                </div>
                <div class="col-12 d-flex justify-content-end gap-2">
                    <router-link :to="{ name: 'tenants' }" class="btn btn-light">Cancel</router-link>
                    <button type="submit" class="btn btn-primary" :disabled="submitting">{{ submitting ? "Saving..." : "Save Tenant" }}</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
export default {};
</script>
