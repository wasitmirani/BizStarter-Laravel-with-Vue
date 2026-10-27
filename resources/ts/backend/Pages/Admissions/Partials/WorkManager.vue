<script setup lang="ts">
import { reactive, ref } from 'vue';
import AdmissionsService from '../../../Services/Admissions/AdmissionsService';
import { errorMessage, validationErrors } from '../../../Services/Admissions/api';
import Modal from '../Components/Modal.vue';
import EmptyState from '../Components/EmptyState.vue';
import ConfirmDialog from '../Components/ConfirmDialog.vue';

defineProps<{ items: any[] }>();
const emit = defineEmits<{ (event: 'changed'): void }>();

const showForm = ref(false);
const editingId = ref<number | null>(null);
const saving = ref(false);
const errors = ref<Record<string, string[]>>({});
const feedback = ref('');
const confirmTarget = ref<any>(null);
const removing = ref(false);

const blank = () => ({
    job_title: '',
    company: '',
    country: '',
    start_date: '',
    end_date: '',
    is_current: false,
    skills_text: '',
    description: '',
});

const form = reactive(blank());

const openCreate = () => {
    Object.assign(form, blank());
    editingId.value = null;
    errors.value = {};
    showForm.value = true;
};

const openEdit = (record: any) => {
    Object.assign(form, {
        job_title: record.job_title,
        company: record.company ?? '',
        country: record.country ?? '',
        start_date: record.start_date ?? '',
        end_date: record.end_date ?? '',
        is_current: !!record.is_current,
        skills_text: (record.skills ?? []).join(', '),
        description: record.description ?? '',
    });
    editingId.value = record.id;
    errors.value = {};
    showForm.value = true;
};

const submit = async () => {
    saving.value = true;
    errors.value = {};
    feedback.value = '';

    const payload = {
        job_title: form.job_title,
        company: form.company || null,
        country: form.country || null,
        start_date: form.start_date || null,
        end_date: form.is_current ? null : form.end_date || null,
        is_current: form.is_current,
        skills: form.skills_text.split(',').map((item) => item.trim()).filter(Boolean),
        description: form.description || null,
    };

    try {
        if (editingId.value) {
            await AdmissionsService.updateWork(editingId.value, payload);
        } else {
            await AdmissionsService.createWork(payload);
        }
        showForm.value = false;
        emit('changed');
    } catch (error: any) {
        errors.value = validationErrors(error);
        feedback.value = errorMessage(error);
    } finally {
        saving.value = false;
    }
};

const askRemove = (record: any) => {
    confirmTarget.value = record;
};

const remove = async () => {
    const record = confirmTarget.value;
    if (!record) return;

    removing.value = true;
    try {
        await AdmissionsService.deleteWork(record.id);
        confirmTarget.value = null;
        emit('changed');
    } finally {
        removing.value = false;
    }
};
</script>

<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
                <h6 class="mb-1">Work experience</h6>
                <p class="text-muted fs-15 mb-0">Supporting information — not a substitute for academic requirements.</p>
            </div>
            <button type="button" class="btn btn-primary btn-sm" @click="openCreate">
                <AppIcon name="plus" class="me-1" />Add experience
            </button>
        </div>

        <EmptyState v-if="!items.length" icon="briefcase" title="No work experience" message="Optional, but useful for programs that require professional experience." />

        <div v-else class="d-flex flex-column gap-2">
            <div v-for="record in items" :key="record.id" class="border rounded p-3 d-flex flex-wrap gap-2 align-items-start justify-content-between">
                <div>
                    <h6 class="mb-1">{{ record.job_title }}</h6>
                    <p class="text-muted fs-15 mb-1">{{ record.company }}<span v-if="record.country"> · {{ record.country }}</span> · {{ record.start_date }} → {{ record.is_current ? 'present' : record.end_date || '—' }}</p>
                    <p v-if="record.skills?.length" class="text-muted fs-14 mb-0">{{ record.skills.join(', ') }}</p>
                </div>
                <div class="d-flex gap-2">
                    <button type="button" class="btn btn-icon btn-sub-primary size-7-5" aria-label="Edit" @click="openEdit(record)"><AppIcon name="edit" /></button>
                    <button type="button" class="btn btn-icon btn-sub-danger size-7-5" aria-label="Delete" @click="askRemove(record)"><AppIcon name="trash" :size="16" /></button>
                </div>
            </div>
        </div>

        <Modal
            :show="showForm"
            :title="editingId ? 'Edit work experience' : 'Add work experience'"
            :subtitle="editingId ? 'Update the experience stored on your profile.' : 'Optional supporting information for programs that require professional experience.'"
            icon="briefcase"
            size="lg"
            @close="showForm = false"
        >
            <form id="work-form" class="row g-3" @submit.prevent="submit">
                <div class="col-md-6">
                    <label class="form-label">Job title</label>
                    <input v-model="form.job_title" type="text" class="form-control" required />
                </div>
                <div class="col-md-4">
                    <label class="form-label">Company</label>
                    <input v-model="form.company" type="text" class="form-control" />
                </div>
                <div class="col-md-2">
                    <label class="form-label">Country</label>
                    <input v-model="form.country" type="text" maxlength="2" class="form-control text-uppercase" placeholder="IT" />
                </div>
                <div class="col-md-5">
                    <label class="form-label">Start date</label>
                    <input v-model="form.start_date" type="date" class="form-control" />
                </div>
                <div class="col-md-5">
                    <label class="form-label">End date</label>
                    <input v-model="form.end_date" type="date" class="form-control" :disabled="form.is_current" />
                </div>
                <div class="col-md-2 d-flex align-items-end">
                    <label class="form-check"><input v-model="form.is_current" type="checkbox" class="form-check-input" /> Current</label>
                </div>
                <div class="col-12">
                    <label class="form-label">Skills (comma separated)</label>
                    <input v-model="form.skills_text" type="text" class="form-control" placeholder="Python, SQL, Project management" />
                </div>
                <div class="col-12">
                    <label class="form-label">Description</label>
                    <textarea v-model="form.description" rows="2" class="form-control"></textarea>
                </div>

                <p v-if="feedback" class="text-danger fs-14 mb-0">{{ feedback }}</p>
            </form>

            <template #footer>
                <button type="button" class="btn btn-light" @click="showForm = false">Cancel</button>
                <button type="submit" form="work-form" class="btn btn-primary" :disabled="saving">
                    <span v-if="saving" class="spinner-border spinner-border-sm me-1" role="status"></span>
                    {{ saving ? 'Saving…' : 'Save experience' }}
                </button>
            </template>
        </Modal>

        <ConfirmDialog
            :show="!!confirmTarget"
            title="Delete work experience?"
            :message="`Delete “${confirmTarget?.job_title ?? 'this experience'}”? This only affects your own profile.`"
            :busy="removing"
            @cancel="confirmTarget = null"
            @confirm="remove"
        />
    </div>
</template>
