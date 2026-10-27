<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AdmissionsService from '../../Services/Admissions/AdmissionsService';
import { errorMessage, validationErrors } from '../../Services/Admissions/api';
import PageHeader from '../Admissions/Components/PageHeader.vue';
import StatusBadge from '../Admissions/Components/StatusBadge.vue';
import EmptyState from '../Admissions/Components/EmptyState.vue';
import FilterTabs from '../Admissions/Components/FilterTabs.vue';
import Pagination from '../Admissions/Components/Pagination.vue';
import ConfirmDialog from '../Admissions/Components/ConfirmDialog.vue';
import Modal from '../Admissions/Components/Modal.vue';

const route = useRoute();
const router = useRouter();

const statuses = [
    { key: 'planned', label: 'Planned' },
    { key: 'in_progress', label: 'In progress' },
    { key: 'submitted', label: 'Submitted' },
    { key: 'offer', label: 'Offer' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'withdrawn', label: 'Withdrawn' },
];

const tabs = computed(() => [
    { key: '', label: 'All' },
    ...statuses.map((status) => ({ key: status.key, label: status.label })),
]);

const applications = ref<any[]>([]);
const programs = ref<any[]>([]);
const meta = ref<any>({ current_page: 1, last_page: 1, total: 0, per_page: 12 });
const filters = reactive({ status: '', page: 1 });
const loading = ref(true);
const saving = ref(false);
const deleting = ref<number | null>(null);
const error = ref('');
const notice = ref('');

const showForm = ref(false);
const editingId = ref<number | null>(null);
const errors = ref<Record<string, string[]>>({});
const confirmTarget = ref<any>(null);

const form = reactive({
    program_id: '' as string | number,
    admission_call_id: '' as string | number,
    status: 'planned',
    priority: 'medium',
    notes: '',
});

const selectedProgram = computed(() => programs.value.find((item) => Number(item.id) === Number(form.program_id)) ?? null);
const availableCalls = computed(() => (selectedProgram.value?.next_call ? [selectedProgram.value.next_call] : []));

const blank = () => ({
    program_id: '' as string | number,
    admission_call_id: '' as string | number,
    status: 'planned',
    priority: 'medium',
    notes: '',
});

const load = async (page = filters.page) => {
    filters.page = page;
    loading.value = true;
    error.value = '';

    try {
        const result = await AdmissionsService.applications({ ...filters, per_page: 12 });
        applications.value = result.applications;
        meta.value = result.meta;
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        loading.value = false;
    }
};

const loadPrograms = async () => {
    try {
        const result = await AdmissionsService.programs({ per_page: 100, sort: 'title' });
        programs.value = result.programs;
    } catch {
        // The catalog dropdown is a convenience; application data still loads.
    }
};

const clearDeepLink = () => {
    if (!route.query.new && !route.query.program) return;

    const query = { ...route.query };
    delete query.new;
    delete query.program;
    void router.replace({ name: 'applications', query });
};

const openCreate = async () => {
    Object.assign(form, blank());
    editingId.value = null;
    errors.value = {};
    error.value = '';
    notice.value = '';

    if (programs.value.length === 0) {
        await loadPrograms();
    }

    const requested = Number(route.query.program);
    if (requested && programs.value.some((program) => Number(program.id) === requested)) {
        form.program_id = requested;
        const program = programs.value.find((item) => Number(item.id) === requested);
        form.admission_call_id = program?.next_call?.id ?? '';
    }

    showForm.value = true;
    clearDeepLink();
};

const openEdit = async (application: any) => {
    if (programs.value.length === 0) {
        await loadPrograms();
    }

    Object.assign(form, {
        program_id: application.program?.id ?? '',
        admission_call_id: application.admission_call?.id ?? '',
        status: application.status ?? 'planned',
        priority: application.priority ?? 'medium',
        notes: application.notes ?? '',
    });
    editingId.value = application.id;
    errors.value = {};
    error.value = '';
    notice.value = '';
    showForm.value = true;
};

const payload = () => ({
    program_id: Number(form.program_id),
    admission_call_id: form.admission_call_id === '' ? null : Number(form.admission_call_id),
    status: form.status,
    priority: form.priority,
    notes: form.notes || null,
});

const submit = async () => {
    saving.value = true;
    errors.value = {};
    error.value = '';
    try {
        if (editingId.value) {
            await AdmissionsService.updateApplication(editingId.value, payload());
            notice.value = 'Application updated.';
        } else {
            await AdmissionsService.createApplication(payload());
            notice.value = 'Application added to your workspace.';
        }
        showForm.value = false;
        await load(editingId.value ? filters.page : 1);
    } catch (exception: any) {
        errors.value = validationErrors(exception);
        error.value = errorMessage(exception);
    } finally {
        saving.value = false;
    }
};

const changeStatus = async (application: any, status: string) => {
    if (application.status === status) return;

    try {
        await AdmissionsService.updateApplication(application.id, {
            program_id: application.program?.id,
            admission_call_id: application.admission_call?.id ?? null,
            status,
            priority: application.priority ?? 'medium',
            notes: application.notes ?? null,
        });
        notice.value = `Status changed to ${status.replace('_', ' ')}.`;
        await load();
    } catch (exception: any) {
        error.value = errorMessage(exception);
    }
};

const onStatusChange = (application: any, event: Event) => {
    const status = (event.target as HTMLSelectElement).value;
    void changeStatus(application, status);
};

const askRemove = (application: any) => {
    confirmTarget.value = application;
};

const remove = async () => {
    const application = confirmTarget.value;
    if (!application) return;

    deleting.value = application.id;
    try {
        await AdmissionsService.deleteApplication(application.id);
        notice.value = 'Application deleted.';
        confirmTarget.value = null;
        await load();
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        deleting.value = null;
    }
};

const selectStatus = (status: string) => {
    filters.status = status;
    load(1);
};

const priorityTone = (priority?: string | null) => {
    if (priority === 'high') return 'bg-danger-subtle text-danger border-danger-subtle';
    if (priority === 'low') return 'bg-secondary-subtle text-secondary border-secondary-subtle';
    return 'bg-warning-subtle text-warning border-warning-subtle';
};

const formatDate = (value?: string | null) =>
    value
        ? new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
        : '—';

onMounted(async () => {
    await Promise.all([load(1), loadPrograms()]);
    if (route.query.program || route.query.new) {
        await openCreate();
    }
});

watch(
    () => [route.query.new, route.query.program],
    ([isNew, programId]) => {
        if (isNew || programId) void openCreate();
    },
);
</script>

<template>
    <div>
        <PageHeader title="My applications" subtitle="Track each application privately. Status changes are saved to your account only.">
            <template #actions>
                <router-link :to="{ name: 'programs' }" class="btn btn-sm btn-light">
                    <AppIcon name="school" class="me-1" />Browse catalog
                </router-link>
                <button type="button" class="btn btn-sm btn-primary" @click="openCreate">
                    <AppIcon name="plus" class="me-1" />Track application
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

        <FilterTabs :model-value="filters.status" :tabs="tabs" label="Application status" class="mb-4" @update:model-value="selectStatus" />

        <div v-if="loading" class="card">
            <div class="card-body text-center py-10"><span class="spinner-border text-primary"></span></div>
        </div>

        <template v-else>
            <div class="card">
                <div class="card-header d-flex flex-wrap gap-2 justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title mb-0">Tracked applications</h5>
                        <p class="text-muted fs-14 mb-0">{{ meta.total }} {{ meta.total === 1 ? 'application' : 'applications' }} in this view</p>
                    </div>
                    <button type="button" class="btn btn-sm btn-sub-primary" @click="openCreate">
                        <AppIcon name="plus" class="me-1" />Add
                    </button>
                </div>

                <div v-if="applications.length" class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-borderless align-middle mb-0">
                            <thead class="border-bottom">
                                <tr>
                                    <th class="text-muted fw-medium">Program</th>
                                    <th class="text-muted fw-medium">Status</th>
                                    <th class="text-muted fw-medium">Priority</th>
                                    <th class="text-muted fw-medium">Deadline</th>
                                    <th class="text-muted fw-medium">Docs</th>
                                    <th class="text-muted fw-medium text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="application in applications" :key="application.id">
                                    <td style="min-width: 260px">
                                        <div class="d-flex align-items-center gap-3">
                                            <span class="avatar bg-primary-subtle text-primary rounded flex-shrink-0">
                                                <AppIcon name="school" :size="18" />
                                            </span>
                                            <div class="min-w-0">
                                                <h6 class="mb-0 fw-medium">{{ application.program?.title }}</h6>
                                                <p class="text-muted fs-14 mb-0">
                                                    {{ application.program?.university?.name }}
                                                    <span v-if="application.program?.university?.region">· {{ application.program.university.region }}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <select
                                            class="form-select form-select-sm"
                                            style="min-width: 140px"
                                            :value="application.status"
                                            :aria-label="`Status for ${application.program?.title}`"
                                            @change="onStatusChange(application, $event)"
                                        >
                                            <option v-for="status in statuses" :key="status.key" :value="status.key">{{ status.label }}</option>
                                        </select>
                                    </td>
                                    <td>
                                        <span class="badge border text-capitalize" :class="priorityTone(application.priority)">{{ application.priority }}</span>
                                    </td>
                                    <td class="text-muted fs-15 text-nowrap">
                                        <template v-if="application.admission_call?.deadline">
                                            <AppIcon name="calendar-event" class="me-1" />{{ formatDate(application.admission_call.deadline) }}
                                        </template>
                                        <span v-else>—</span>
                                    </td>
                                    <td>
                                        <router-link
                                            :to="{ name: 'documents', query: { application: application.id } }"
                                            class="badge bg-light text-body border text-decoration-none"
                                        >
                                            <AppIcon name="paperclip" class="me-1" />{{ application.documents_count ?? 0 }}
                                        </router-link>
                                    </td>
                                    <td class="text-end">
                                        <div class="d-flex justify-content-end gap-2">
                                            <button type="button" class="btn btn-icon btn-sub-primary size-7-5" aria-label="Edit application" @click="openEdit(application)">
                                                <AppIcon name="edit" :size="16" />
                                            </button>
                                            <router-link
                                                :to="{ name: 'documents', query: { application: application.id } }"
                                                class="btn btn-icon btn-light size-7-5"
                                                aria-label="Application documents"
                                            >
                                                <AppIcon name="paperclip" :size="16" />
                                            </router-link>
                                            <button type="button" class="btn btn-icon btn-sub-danger size-7-5" aria-label="Delete application" @click="askRemove(application)">
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
                        icon="files"
                        title="No applications tracked"
                        message="Open a program in the catalog and choose “Track application” to start."
                    >
                        <router-link :to="{ name: 'programs' }" class="btn btn-sm btn-primary">Browse programs</router-link>
                    </EmptyState>
                </div>
            </div>

            <Pagination :meta="meta" @change="load" />
        </template>

        <Modal
            :show="showForm"
            :title="editingId ? 'Edit application' : 'Track a new application'"
            :subtitle="editingId ? 'Update the status, priority or notes for this application.' : 'Link a catalog program and keep its progress in one place.'"
            icon="files"
            size="lg"
            @close="showForm = false"
        >
            <form id="application-form" class="row g-3" @submit.prevent="submit">
                <div class="col-12">
                    <label class="form-label">Program</label>
                    <select v-model="form.program_id" class="form-select" required>
                        <option value="" disabled>Select a program</option>
                        <option v-for="program in programs" :key="program.id" :value="program.id">
                            {{ program.title }} — {{ program.university?.name }}
                        </option>
                    </select>
                    <p v-if="errors.program_id" class="text-danger fs-14 mb-0">{{ errors.program_id[0] }}</p>
                </div>

                <div class="col-md-6">
                    <label class="form-label">Admission call</label>
                    <select v-model="form.admission_call_id" class="form-select" :disabled="!availableCalls.length">
                        <option value="">No specific call</option>
                        <option v-for="call in availableCalls" :key="call.id" :value="call.id">
                            {{ call.intake_label }} — deadline {{ formatDate(call.deadline) }}
                        </option>
                    </select>
                </div>

                <div class="col-md-3">
                    <label class="form-label">Status</label>
                    <select v-model="form.status" class="form-select">
                        <option v-for="status in statuses" :key="status.key" :value="status.key">{{ status.label }}</option>
                    </select>
                </div>

                <div class="col-md-3">
                    <label class="form-label">Priority</label>
                    <select v-model="form.priority" class="form-select">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <div class="col-12">
                    <label class="form-label">Notes</label>
                    <textarea v-model="form.notes" rows="3" class="form-control" placeholder="Portal login, missing documents, contact person…"></textarea>
                </div>

                <div v-if="error" class="col-12">
                    <p class="text-danger fs-14 mb-0">{{ error }}</p>
                </div>
            </form>

            <template #footer>
                <button type="button" class="btn btn-light" @click="showForm = false">Cancel</button>
                <button type="submit" form="application-form" class="btn btn-primary" :disabled="saving">
                    <span v-if="saving" class="spinner-border spinner-border-sm me-1" role="status"></span>
                    {{ saving ? 'Saving…' : editingId ? 'Save changes' : 'Track application' }}
                </button>
            </template>
        </Modal>

        <ConfirmDialog
            :show="!!confirmTarget"
            title="Delete application?"
            :message="`Delete the application for “${confirmTarget?.program?.title ?? 'this program'}”? Your documents are kept.`"
            :busy="deleting !== null"
            @cancel="confirmTarget = null"
            @confirm="remove"
        />
    </div>
</template>
