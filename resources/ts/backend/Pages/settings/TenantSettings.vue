<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import TenantService from "../../Services/tenant/TenantService";
import { AxiosService } from "../../Utils/AxiosService";

const loading = ref(false);
const submitting = ref(false);
const currentStep = ref(1);
const steps = [
    { index: 1, title: "Tenant Profile", subtitle: "Basic company details", icon: "tabler--building-skyscraper" },
    { index: 2, title: "Contact Info", subtitle: "How we reach tenant", icon: "tabler--address-book" },
    { index: 3, title: "Localization", subtitle: "Region and language", icon: "tabler--world" },
    { index: 4, title: "Plan & Access", subtitle: "Limits and access state", icon: "tabler--shield-check" },
    { index: 5, title: "Review & Save", subtitle: "Finalize configuration", icon: "tabler--device-floppy" },
];
const optionData = ref<{ timezones: any[]; languages: any[]; currencies: any[] }>({
    timezones: [],
    languages: [],
    currencies: [],
});
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

const loadOptions = async () => {
    const response = await AxiosService.get("/dropdown/options-list");
    const options = response?.data?.result ?? {};
    optionData.value.timezones = options.timezones ?? [];
    optionData.value.languages = options.languages ?? [];
    optionData.value.currencies = options.currencies ?? [];
};

const fetchCurrent = async () => {
    loading.value = true;
    try {
        const response = await TenantService.current();
        const tenant = response?.data?.result?.tenant;
        if (tenant) {
            form.value = { ...form.value, ...tenant };
        }
    } finally {
        loading.value = false;
    }
};

const submit = async () => {
    submitting.value = true;
    try {
        await TenantService.updateCurrent(form.value);
        await fetchCurrent();
    } finally {
        submitting.value = false;
    }
};

const isLastStep = computed(() => currentStep.value === steps.length);

const nextStep = async () => {
    if (isLastStep.value) {
        await submit();
        return;
    }
    currentStep.value += 1;
};

const prevStep = () => {
    if (currentStep.value > 1) {
        currentStep.value -= 1;
    }
};

const goToStep = (stepIndex: number) => {
    currentStep.value = stepIndex;
};

onMounted(fetchCurrent);
onMounted(loadOptions);
</script>

<template>
    <BreadcrumbComponent
        :current="'Tenant Settings'"
        :links="[{ name: 'Dashboard', route: 'dashboard' }, { name: 'Tenants', route: 'tenants' }]"
    />
    <div class="container-fluid">
        <div v-if="loading" class="rounded-xl border border-default-200 bg-white p-6 text-default-600">
            Loading tenant settings...
        </div>
        <div v-else class="rounded-xl border border-default-200 bg-white shadow-sm overflow-hidden">
            <div class="px-6 py-5 border-b border-default-200">
                <h4 class="text-lg font-semibold text-default-900">Tenant-Level Settings</h4>
                <p class="text-sm text-default-500 mt-1">Configure organization profile, localization, and plan limits for your SaaS tenant.</p>
            </div>
            <div class="p-6">
                <div class="mb-6">
                    <ul class="flex flex-wrap gap-2">
                        <li v-for="step in steps" :key="step.index">
                            <button
                                type="button"
                                class="inline-flex items-center gap-3 rounded-lg border border-dashed px-4 py-2 text-left transition"
                                :class="currentStep === step.index ? 'border-primary bg-primary/10 text-primary' : 'border-default-300 bg-white text-default-700 hover:bg-default-100'"
                                @click="goToStep(step.index)"
                            >
                                <i class="iconify size-6" :class="step.icon"></i>
                                <span>
                                    <span class="block text-sm font-semibold">{{ step.title }}</span>
                                    <span class="block text-xs opacity-80">{{ step.subtitle }}</span>
                                </span>
                            </button>
                        </li>
                    </ul>
                </div>

                <form class="grid grid-cols-1 md:grid-cols-2 gap-4" @submit.prevent="nextStep">
                    <div v-if="currentStep === 1" class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="form-label text-sm font-medium">Tenant Name</label>
                            <input v-model="form.name" type="text" class="mt-1 w-full rounded-lg border border-default-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" required />
                        </div>
                        <div>
                            <label class="form-label text-sm font-medium">Slug</label>
                            <input v-model="form.slug" type="text" class="mt-1 w-full rounded-lg border border-default-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                        </div>
                        <div>
                            <label class="form-label text-sm font-medium">Domain</label>
                            <input v-model="form.domain" type="text" class="mt-1 w-full rounded-lg border border-default-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                        </div>
                        <div>
                            <label class="form-label text-sm font-medium">Database</label>
                            <input v-model="form.database" type="text" class="mt-1 w-full rounded-lg border border-default-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                        </div>
                    </div>
                    <div v-if="currentStep === 2" class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="form-label text-sm font-medium">Contact Email</label>
                            <input v-model="form.contact_email" type="email" class="mt-1 w-full rounded-lg border border-default-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                        </div>
                        <div>
                            <label class="form-label text-sm font-medium">Contact Phone</label>
                            <input v-model="form.contact_phone" type="text" class="mt-1 w-full rounded-lg border border-default-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                        </div>
                        <div>
                            <label class="form-label text-sm font-medium">Address</label>
                            <input v-model="form.address" type="text" class="mt-1 w-full rounded-lg border border-default-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                        </div>
                        <div>
                            <label class="form-label text-sm font-medium">City</label>
                            <input v-model="form.city" type="text" class="mt-1 w-full rounded-lg border border-default-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                        </div>
                        <div>
                            <label class="form-label text-sm font-medium">State</label>
                            <input v-model="form.state" type="text" class="mt-1 w-full rounded-lg border border-default-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                        </div>
                        <div>
                            <label class="form-label text-sm font-medium">Postal Code</label>
                            <input v-model="form.postal_code" type="text" class="mt-1 w-full rounded-lg border border-default-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                        </div>
                    </div>

                    <div v-if="currentStep === 3" class="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="form-label text-sm font-medium">Timezone</label>
                            <select v-model="form.timezone_id" class="mt-1 w-full rounded-lg border border-default-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                                <option :value="null">Select timezone</option>
                                <option v-for="item in optionData.timezones" :key="item.id" :value="item.id">{{ item.name }}</option>
                            </select>
                        </div>
                        <div>
                            <label class="form-label text-sm font-medium">Language</label>
                            <select v-model="form.language_id" class="mt-1 w-full rounded-lg border border-default-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                                <option :value="null">Select language</option>
                                <option v-for="item in optionData.languages" :key="item.id" :value="item.id">{{ item.name }}</option>
                            </select>
                        </div>
                        <div>
                            <label class="form-label text-sm font-medium">Currency</label>
                            <select v-model="form.currency_id" class="mt-1 w-full rounded-lg border border-default-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                                <option :value="null">Select currency</option>
                                <option v-for="item in optionData.currencies" :key="item.id" :value="item.id">{{ item.name }} ({{ item.code }})</option>
                            </select>
                        </div>
                    </div>

                    <div v-if="currentStep === 4" class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="form-label text-sm font-medium">Status</label>
                            <select v-model="form.status" class="mt-1 w-full rounded-lg border border-default-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>
                        <div>
                            <label class="form-label text-sm font-medium">Subscription Plan</label>
                            <input v-model="form.subscription_plan" type="text" class="mt-1 w-full rounded-lg border border-default-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="e.g. Pro, Enterprise" />
                        </div>
                        <div>
                            <label class="form-label text-sm font-medium">Max Users</label>
                            <input v-model="form.max_users" type="number" min="1" class="mt-1 w-full rounded-lg border border-default-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                        </div>
                        <div>
                            <label class="form-label text-sm font-medium">Max Roles</label>
                            <input v-model="form.max_roles" type="number" min="1" class="mt-1 w-full rounded-lg border border-default-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                        </div>
                        <div class="md:col-span-2">
                            <div class="mt-2 inline-flex items-center gap-2">
                                <input id="tenant-active-flag" v-model="form.is_active" :true-value="1" :false-value="0" type="checkbox" class="size-4 rounded border-default-300 text-primary focus:ring-primary/30" />
                                <label class="text-sm font-medium text-default-700" for="tenant-active-flag">Tenant Enabled</label>
                            </div>
                        </div>
                    </div>

                    <div v-if="currentStep === 5" class="md:col-span-2 rounded-lg border border-default-200 bg-default-50 p-4">
                        <h6 class="text-base font-semibold text-default-900 mb-3">Review Tenant Configuration</h6>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <p><span class="font-semibold">Tenant:</span> {{ form.name || "-" }}</p>
                            <p><span class="font-semibold">Slug:</span> {{ form.slug || "-" }}</p>
                            <p><span class="font-semibold">Domain:</span> {{ form.domain || "-" }}</p>
                            <p><span class="font-semibold">Status:</span> {{ form.status || "-" }}</p>
                            <p><span class="font-semibold">Plan:</span> {{ form.subscription_plan || "-" }}</p>
                            <p><span class="font-semibold">Max Users:</span> {{ form.max_users || "-" }}</p>
                        </div>
                    </div>

                    <div class="md:col-span-2 mt-2 flex flex-wrap items-center justify-between gap-2">
                        <button
                            type="button"
                            class="inline-flex items-center rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                            :disabled="currentStep === 1 || submitting"
                            @click="prevStep"
                        >
                            ← Back
                        </button>

                        <button
                            type="submit"
                            class="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
                            :disabled="submitting"
                        >
                            {{ isLastStep ? (submitting ? "Saving..." : "Save Settings") : "Next →" }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
