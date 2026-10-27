<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AdmissionsService from '../../Services/Admissions/AdmissionsService';
import { errorMessage, validationErrors } from '../../Services/Admissions/api';
import PageHeader from '../Admissions/Components/PageHeader.vue';
import StatusBadge from '../Admissions/Components/StatusBadge.vue';
import EmptyState from '../Admissions/Components/EmptyState.vue';
import FilterTabs from '../Admissions/Components/FilterTabs.vue';
import ConfirmDialog from '../Admissions/Components/ConfirmDialog.vue';
import Modal from '../Admissions/Components/Modal.vue';

const route = useRoute();
const router = useRouter();

const documentTypes = [
    { key: 'cv', label: 'CV' },
    { key: 'transcript', label: 'Transcript' },
    { key: 'degree', label: 'Degree certificate' },
    { key: 'language', label: 'Language certificate' },
    { key: 'passport', label: 'Passport / ID' },
    { key: 'recommendation', label: 'Recommendation letter' },
    { key: 'other', label: 'Other' },
];

const tabs = computed(() => [{ key: '', label: 'All' }, ...documentTypes]);

const filters = reactive({ type: '' });
const documents = ref<any[]>([]);
const applications = ref<any[]>([]);
const loading = ref(true);
const uploading = ref(false);
const busyId = ref<number | null>(null);
const error = ref('');
const notice = ref('');

const showForm = ref(false);
const errors = ref<Record<string, string[]>>({});
const fileInput = ref<HTMLInputElement | null>(null);
const confirmTarget = ref<any>(null);

const form = reactive({
    type: 'transcript',
    name: '',
    user_application_id: '' as string | number,
    file: null as File | null,
});

const load = async () => {
    loading.value = true;
    error.value = '';
    try {
        const result = await AdmissionsService.documents({ ...filters });
        documents.value = result.documents;
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        loading.value = false;
    }
};

const loadApplications = async () => {
    try {
        const result = await AdmissionsService.applications({ per_page: 100 });
        applications.value = result.applications;
    } catch {
        // Linking to an application stays optional.
    }
};

const clearDeepLink = () => {
    if (!route.query.new && !route.query.application) return;

    const query = { ...route.query };
    delete query.new;
    delete query.application;
    void router.replace({ name: 'documents', query });
};

const openUpload = async () => {
    if (applications.value.length === 0) await loadApplications();

    form.type = 'transcript';
    form.name = '';
    form.file = null;
    form.user_application_id = route.query.application ? Number(route.query.application) : '';

    errors.value = {};
    error.value = '';
    notice.value = '';
    showForm.value = true;
    if (fileInput.value) fileInput.value.value = '';
    clearDeepLink();
};

const setFile = (file: File | null) => {
    form.file = file;
    if (file && !form.name) form.name = file.name.replace(/\.[^.]+$/, '');
    errors.value = { ...errors.value, file: [] };
};

const onFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    setFile(target.files?.[0] ?? null);
};

const onDrop = (event: DragEvent) => {
    const file = event.dataTransfer?.files?.[0] ?? null;
    if (file) setFile(file);
};

const upload = async () => {
    errors.value = {};
    error.value = '';
    notice.value = '';

    if (!form.file) {
        errors.value = { file: ['Choose a file to upload.'] };
        return;
    }

    uploading.value = true;
    try {
        const payload = new FormData();
        payload.append('type', form.type);
        payload.append('name', form.name || form.file.name);
        payload.append('file', form.file);
        if (form.user_application_id !== '') {
            payload.append('user_application_id', String(form.user_application_id));
        }

        await AdmissionsService.uploadDocument(payload);
        notice.value = 'Document uploaded.';
        showForm.value = false;
        await load();
    } catch (exception: any) {
        errors.value = validationErrors(exception);
        error.value = errorMessage(exception);
    } finally {
        uploading.value = false;
    }
};

const download = async (document: any) => {
    busyId.value = document.id;
    try {
        await AdmissionsService.downloadDocument(document.id, document.original_name || document.name);
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        busyId.value = null;
    }
};

const askRemove = (document: any) => {
    confirmTarget.value = document;
};

const remove = async () => {
    const document = confirmTarget.value;
    if (!document) return;

    busyId.value = document.id;
    try {
        await AdmissionsService.deleteDocument(document.id);
        notice.value = 'Document deleted.';
        confirmTarget.value = null;
        await load();
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        busyId.value = null;
    }
};

const selectType = (type: string) => {
    filters.type = type;
    load();
};

const typeLabel = (type: string) => documentTypes.find((item) => item.key === type)?.label ?? type;
const applicationLabel = (id?: number | null) => {
    const application = applications.value.find((item) => Number(item.id) === Number(id));
    return application ? `${application.program?.title}` : '—';
};
const formatSize = (bytes?: number | null) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
};
const formatDate = (value?: string | null) =>
    value ? new Date(value).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

onMounted(async () => {
    await Promise.all([load(), loadApplications()]);
    if (route.query.application || route.query.new) {
        await openUpload();
    }
});

watch(
    () => [route.query.new, route.query.application],
    ([isNew, applicationId]) => {
        if (isNew || applicationId) void openUpload();
    },
);
</script>

<template>
    <div>
        <PageHeader title="Documents" subtitle="Files are stored privately per account and can only be downloaded by you.">
            <template #actions>
                <button type="button" class="btn btn-sm btn-primary" @click="openUpload">
                    <AppIcon name="upload" class="me-1" />Upload document
                </button>
            </template>
        </PageHeader>

        <div v-if="error" class="alert alert-danger d-flex align-items-center gap-2 py-2">
            <AppIcon name="alert-triangle" :size="16" />
            <span class="flex-grow-1">{{ error }}</span>
            <button type="button" class="btn-close" aria-label="Dismiss" @click="error = ''"></button>
        </div>
        <div v-if="notice" class="alert alert-success d-flex align-items-center gap-2 py-2">
            <AppIcon name="circle-check" :size="16" />
            <span class="flex-grow-1">{{ notice }}</span>
            <button type="button" class="btn-close" aria-label="Dismiss" @click="notice = ''"></button>
        </div>

        <div class="card">
            <div class="card-header d-flex flex-wrap gap-2 justify-content-between align-items-center">
                <div>
                    <h5 class="card-title mb-0">Document library</h5>
                    <p class="text-muted fs-14 mb-0">{{ documents.length }} {{ documents.length === 1 ? 'file' : 'files' }} · private to your account</p>
                </div>
                <button type="button" class="btn btn-sm btn-sub-primary" @click="openUpload">
                    <AppIcon name="plus" class="me-1" />Add file
                </button>
            </div>

            <div class="card-body border-bottom py-2">
                <FilterTabs :model-value="filters.type" :tabs="tabs" label="Document type" @update:model-value="selectType" />
            </div>

            <div v-if="loading" class="card-body text-center py-10"><span class="spinner-border text-primary"></span></div>

            <template v-else>
                <div v-if="documents.length" class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-borderless align-middle mb-0">
                            <thead class="border-bottom">
                                <tr>
                                    <th class="text-muted fw-medium">Document</th>
                                    <th class="text-muted fw-medium">Type</th>
                                    <th class="text-muted fw-medium">Application</th>
                                    <th class="text-muted fw-medium">Size</th>
                                    <th class="text-muted fw-medium">Status</th>
                                    <th class="text-muted fw-medium">Uploaded</th>
                                    <th class="text-muted fw-medium text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="document in documents" :key="document.id">
                                    <td style="min-width: 220px">
                                        <div class="d-flex align-items-center gap-3">
                                            <span class="avatar bg-primary-subtle text-primary rounded flex-shrink-0">
                                                <AppIcon name="file-text" :size="18" />
                                            </span>
                                            <div class="min-w-0">
                                                <p class="mb-0 fw-medium text-truncate">{{ document.name }}</p>
                                                <p v-if="document.original_name && document.original_name !== document.name" class="text-muted fs-14 mb-0 text-truncate">
                                                    {{ document.original_name }}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-muted fs-15">{{ typeLabel(document.type) }}</td>
                                    <td class="text-muted fs-15">{{ applicationLabel(document.user_application_id) }}</td>
                                    <td class="text-muted fs-15 text-nowrap">{{ formatSize(document.size) }}</td>
                                    <td><StatusBadge :status="document.status" /></td>
                                    <td class="text-muted fs-15 text-nowrap">{{ formatDate(document.created_at) }}</td>
                                    <td class="text-end">
                                        <div class="d-flex justify-content-end gap-2">
                                            <button
                                                type="button"
                                                class="btn btn-icon btn-sub-primary size-7-5"
                                                aria-label="Download document"
                                                :disabled="busyId === document.id"
                                                @click="download(document)"
                                            >
                                                <AppIcon name="download" :size="16" />
                                            </button>
                                            <button
                                                type="button"
                                                class="btn btn-icon btn-sub-danger size-7-5"
                                                aria-label="Delete document"
                                                :disabled="busyId === document.id"
                                                @click="askRemove(document)"
                                            >
                                                <AppIcon name="trash" :size="16" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div v-else class="card-body">
                    <EmptyState
                        icon="file-upload"
                        title="No documents yet"
                        message="Upload your transcript, degree certificate, CV and language results so they are ready when a call opens."
                    >
                        <button type="button" class="btn btn-sm btn-primary" @click="openUpload">Upload the first file</button>
                    </EmptyState>
                </div>
            </template>
        </div>

        <Modal
            :show="showForm"
            title="Upload document"
            subtitle="Files stay private and are never shared with universities automatically."
            icon="upload"
            size="lg"
            @close="showForm = false"
        >
            <form id="document-form" class="row g-3" @submit.prevent="upload">
                <div class="col-md-6">
                    <label class="form-label">Document type</label>
                    <select v-model="form.type" class="form-select">
                        <option v-for="type in documentTypes" :key="type.key" :value="type.key">{{ type.label }}</option>
                    </select>
                </div>

                <div class="col-md-6">
                    <label class="form-label">Linked application (optional)</label>
                    <select v-model="form.user_application_id" class="form-select">
                        <option value="">Not linked</option>
                        <option v-for="application in applications" :key="application.id" :value="application.id">
                            {{ application.program?.title }}
                        </option>
                    </select>
                </div>

                <div class="col-12">
                    <label class="form-label">Display name (optional)</label>
                    <input v-model="form.name" type="text" class="form-control" placeholder="Defaults to the file name" />
                </div>

                <div class="col-12">
                    <label
                        for="document-file"
                        class="d-block border border-dashed rounded-4 p-4 p-md-5 text-center bg-light-subtle"
                        style="cursor: pointer"
                        @dragover.prevent
                        @drop.prevent="onDrop"
                    >
                        <span
                            class="avatar bg-primary-subtle text-primary rounded-circle mx-auto mb-3 flex-shrink-0"
                            style="width: 48px; height: 48px"
                        >
                            <AppIcon name="upload" :size="22" />
                        </span>
                        <p class="mb-1 fw-medium">{{ form.file ? form.file.name : 'Click to choose a file, or drop it here' }}</p>
                        <p class="text-muted fs-14 mb-0">PDF, DOC/DOCX, JPG or PNG up to 10 MB.</p>
                        <input
                            id="document-file"
                            ref="fileInput"
                            type="file"
                            class="d-none"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            @change="onFileChange"
                        />
                    </label>
                    <p v-if="errors.file?.[0]" class="text-danger fs-14 mt-1 mb-0">{{ errors.file[0] }}</p>
                    <p v-if="errors.type" class="text-danger fs-14 mb-0">{{ errors.type[0] }}</p>
                </div>

                <div v-if="error" class="col-12">
                    <p class="text-danger fs-14 mb-0">{{ error }}</p>
                </div>
            </form>

            <template #footer>
                <button type="button" class="btn btn-light" @click="showForm = false">Cancel</button>
                <button type="submit" form="document-form" class="btn btn-primary" :disabled="uploading">
                    <span v-if="uploading" class="spinner-border spinner-border-sm me-1" role="status"></span>
                    <AppIcon v-else name="upload" class="me-1" />
                    {{ uploading ? 'Uploading…' : 'Upload document' }}
                </button>
            </template>
        </Modal>

        <ConfirmDialog
            :show="!!confirmTarget"
            title="Delete document?"
            :message="`Delete “${confirmTarget?.name ?? 'this file'}”? The file is removed from storage.`"
            :busy="busyId !== null"
            @cancel="confirmTarget = null"
            @confirm="remove"
        />
    </div>
</template>
