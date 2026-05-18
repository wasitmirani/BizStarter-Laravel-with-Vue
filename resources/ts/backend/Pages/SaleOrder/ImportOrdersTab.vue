<script setup lang="ts">
import { computed, ref } from 'vue';
import { Helpers } from '../../Utils/Helper';
import { SaleOrderService } from '../../Services/SaleOrder/SaleOrderService';

const service = new SaleOrderService();
const fileInput = ref<File | null>(null);
const fileError = ref('');
const uploadResult = ref('');
const uploadErrors = ref<any[]>([]);
const isUploading = ref(false);
const uploadProgress = ref(0);

const acceptedTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
const acceptedExtensions = ['csv', 'xls', 'xlsx'];

const progressLabel = computed(() => {
    if (isUploading.value) {
        return `Uploading ${uploadProgress.value}%`;
    }
    if (uploadProgress.value === 100) {
        return 'Upload completed';
    }
    return '';
});

const setFile = (event: Event) => {
    const target = event.target as HTMLInputElement;
    uploadResult.value = '';
    uploadErrors.value = [];
    fileError.value = '';
    uploadProgress.value = 0;

    if (!target.files?.length) {
        fileInput.value = null;
        return;
    }

    const file = target.files[0];
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!extension || !acceptedExtensions.includes(extension)) {
        fileInput.value = null;
        fileError.value = 'Please select a valid CSV or Excel file.';
        return;
    }

    fileInput.value = file;
};

const uploadFile = async () => {
    if (!fileInput.value) {
        fileError.value = 'Select a CSV or Excel file first.';
        return;
    }

    isUploading.value = true;
    uploadProgress.value = 0;
    fileError.value = '';
    uploadResult.value = '';
    uploadErrors.value = [];

    try {
        const response = await service.importOrders(fileInput.value, {
            onUploadProgress: (event: ProgressEvent) => {
                if (event.lengthComputable) {
                    uploadProgress.value = Math.round((event.loaded * 100) / event.total);
                }
            },
        });

        const data = response?.data as any;

        if (data?.status === false || data?.code === 422) {
            uploadErrors.value = data?.data?.errors || data?.errors || [];
            fileError.value = data?.message || 'Some rows failed validation.';
        } else {
            uploadResult.value = `Imported successfully. ${data?.data?.created?.length ?? 0} orders added.`;
            fileInput.value = null;
            uploadProgress.value = 100;
        }
    } catch (error: any) {
        fileError.value = error?.message ?? 'Upload failed. Please try again.';
    } finally {
        isUploading.value = false;
    }
};
</script>

<template>
    <div class="space-y-6">
        <div class="card p-5 bg-slate-50 border border-slate-200">
            <h3 class="text-xl font-semibold">Import Orders</h3>
            <p class="mt-2 text-slate-600">Upload a CSV or Excel file with order rows. The import process validates customer, totals, and product data before saving.</p>

            <div class="grid gap-4 pt-4 md:grid-cols-2">
                <div class="rounded-3xl border border-slate-200 bg-white p-4">
                    <h4 class="text-base font-semibold">File requirements</h4>
                    <ul class="mt-3 space-y-2 text-sm text-slate-600">
                        <li class="flex items-start gap-2"><span class="text-primary">•</span> Columns required: <strong>customer_name</strong>, <strong>total</strong>, <strong>status</strong>, <strong>payment_status</strong>.</li>
                        <li class="flex items-start gap-2"><span class="text-primary">•</span> Optional columns: <strong>subtotal</strong>, <strong>discount</strong>, <strong>tax</strong>, <strong>notes</strong>.</li>
                        <li class="flex items-start gap-2"><span class="text-primary">•</span> Accepted formats: <strong>CSV</strong>, <strong>XLS</strong>, <strong>XLSX</strong>.</li>
                        <li class="flex items-start gap-2"><span class="text-primary">•</span> Invalid rows are reported immediately after upload.</li>
                    </ul>
                </div>
                <div class="rounded-3xl border border-slate-200 bg-white p-4">
                    <h4 class="text-base font-semibold">Quick tips</h4>
                    <ul class="mt-3 space-y-2 text-sm text-slate-600">
                        <li class="flex items-start gap-2"><span class="text-primary">•</span> Use a template file to ensure headers match exactly.</li>
                        <li class="flex items-start gap-2"><span class="text-primary">•</span> Empty rows are skipped automatically.</li>
                        <li class="flex items-start gap-2"><span class="text-primary">•</span> Large imports are processed in a single batch.</li>
                        <li class="flex items-start gap-2"><span class="text-primary">•</span> You can re-upload to fix any invalid rows.</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="card p-5 bg-white border border-slate-200">
            <div class="grid gap-4 sm:grid-cols-[1fr,auto] sm:items-end">
                <div>
                    <label class="mb-2 block text-sm font-semibold text-slate-700">Select a file</label>
                    <input type="file" class="form-input" accept=".csv,.xls,.xlsx" @change="setFile" :disabled="isUploading" />
                    <p class="mt-2 text-sm text-slate-500">Only CSV, XLS, or XLSX files are supported.</p>
                    <p v-if="fileInput" class="mt-2 text-sm text-slate-600">Selected file: <strong>{{ fileInput.name }}</strong></p>
                    <p v-if="fileError" class="mt-2 text-sm text-danger">{{ fileError }}</p>
                </div>

                <button
                    class="btn inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
                    type="button"
                    :disabled="isUploading"
                    @click="uploadFile"
                >
                    <i class="iconify tabler--upload mr-2 text-lg"></i>
                    <span v-if="!isUploading">Upload and Import</span>
                    <span v-else>Uploading...</span>
                </button>
            </div>

            <div v-if="isUploading || uploadProgress > 0" class="mt-5 space-y-3">
                <div class="flex items-center justify-between text-sm text-slate-600">
                    <span>{{ progressLabel }}</span>
                    <span v-if="uploadProgress > 0">{{ uploadProgress }}%</span>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div class="h-full rounded-full bg-primary transition-all duration-300" :style="{ width: `${uploadProgress}%` }"></div>
                </div>
            </div>

            <div v-if="uploadResult || uploadErrors.length" class="mt-5 space-y-4">
                <div v-if="uploadResult" class="rounded-2xl border border-success/20 bg-success/10 p-4 text-success">
                    <strong>Success:</strong> {{ uploadResult }}
                </div>

                <div v-if="uploadErrors.length" class="rounded-2xl border border-danger/20 bg-danger/10 p-4 text-danger">
                    <p class="font-semibold">Import errors detected:</p>
                    <ul class="mt-2 list-disc space-y-1 pl-5 text-sm">
                        <li v-for="error in uploadErrors" :key="error.line">
                            Row {{ error.line }}: {{ error.message || error.error || JSON.stringify(error) }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
