<script setup lang="ts">
import { reactive, ref } from 'vue';
import AdmissionsService from '../../../Services/Admissions/AdmissionsService';
import { errorMessage, validationErrors } from '../../../Services/Admissions/api';
import Modal from '../Components/Modal.vue';
import EmptyState from '../Components/EmptyState.vue';
import ConfirmDialog from '../Components/ConfirmDialog.vue';

defineProps<{ items: any[] }>();
const emit = defineEmits<{ (event: 'changed'): void }>();

const currentYear = new Date().getFullYear();
const showForm = ref(false);
const editingId = ref<number | null>(null);
const saving = ref(false);
const errors = ref<Record<string, string[]>>({});
const feedback = ref('');
const confirmTarget = ref<any>(null);
const removing = ref(false);

const blank = () => ({
    qualification_title: '',
    degree_level: 'bachelor',
    institution_name: '',
    institution_country: '',
    graduation_year: new Date().getFullYear(),
    grading_system: 'percentage',
    grade_value: '' as string | number,
    grade_max: 100 as string | number,
    transcript_available: false,
    certificate_available: false,
    prerequisite_subjects_text: '',
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
        qualification_title: record.qualification_title,
        degree_level: record.degree_level,
        institution_name: record.institution_name,
        institution_country: record.institution_country ?? '',
        graduation_year: record.graduation_year ?? '',
        grading_system: record.grading_system,
        grade_value: record.grade_value ?? '',
        grade_max: record.grade_max ?? '',
        transcript_available: !!record.transcript_available,
        certificate_available: !!record.certificate_available,
        prerequisite_subjects_text: (record.prerequisite_subjects ?? []).join(', '),
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
        qualification_title: form.qualification_title,
        degree_level: form.degree_level,
        institution_name: form.institution_name,
        institution_country: form.institution_country || null,
        graduation_year: form.graduation_year ? Number(form.graduation_year) : null,
        grading_system: form.grading_system,
        grade_value: form.grade_value === '' ? null : Number(form.grade_value),
        grade_max: form.grade_max === '' ? null : Number(form.grade_max),
        transcript_available: form.transcript_available,
        certificate_available: form.certificate_available,
        prerequisite_subjects: form.prerequisite_subjects_text
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
    };

    try {
        if (editingId.value) {
            await AdmissionsService.updateEducation(editingId.value, payload);
        } else {
            await AdmissionsService.createEducation(payload);
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
        await AdmissionsService.deleteEducation(record.id);
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
                <h6 class="mb-1">Education</h6>
                <p class="text-muted fs-15 mb-0">Different grading scales are never converted automatically.</p>
            </div>
            <button type="button" class="btn btn-primary btn-sm" @click="openCreate">
                <AppIcon name="plus" class="me-1" />Add education
            </button>
        </div>

        <EmptyState v-if="!items.length" icon="school" title="No education records" message="Add your degree so the eligibility engine can compare it with program requirements." />

        <div v-else class="d-flex flex-column gap-2">
            <div v-for="record in items" :key="record.id" class="border rounded p-3 d-flex flex-wrap gap-2 align-items-start justify-content-between">
                <div>
                    <h6 class="mb-1">{{ record.qualification_title }}</h6>
                    <p class="text-muted fs-15 mb-1">{{ record.institution_name }}<span v-if="record.institution_country"> · {{ record.institution_country }}</span><span v-if="record.graduation_year"> · {{ record.graduation_year }}</span></p>
                    <p class="text-muted fs-14 mb-0">
                        {{ record.degree_level }}
                        · {{ record.grade_value ?? '—' }} / {{ record.grade_max ?? '—' }} ({{ record.grading_system }})
                        · transcript {{ record.transcript_available ? 'available' : 'missing' }}
                    </p>
                </div>
                <div class="d-flex gap-2">
                    <button type="button" class="btn btn-icon btn-sub-primary size-7-5" aria-label="Edit" @click="openEdit(record)"><AppIcon name="edit" /></button>
                    <button type="button" class="btn btn-icon btn-sub-danger size-7-5" aria-label="Delete" @click="askRemove(record)"><AppIcon name="trash" :size="16" /></button>
                </div>
            </div>
        </div>

        <Modal
            :show="showForm"
            :title="editingId ? 'Edit education record' : 'Add education record'"
            :subtitle="editingId ? 'Update the qualification details used for eligibility checks.' : 'Grades are stored as entered — they are never converted automatically.'"
            icon="school"
            size="lg"
            @close="showForm = false"
        >
            <form id="education-form" class="row g-3" @submit.prevent="submit">
                <div class="col-md-6">
                    <label class="form-label">Qualification title</label>
                    <input v-model="form.qualification_title" type="text" class="form-control" required />
                    <p v-if="errors.qualification_title" class="text-danger fs-14 mb-0">{{ errors.qualification_title[0] }}</p>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Degree level</label>
                    <select v-model="form.degree_level" class="form-select">
                        <option value="high_school">High school</option>
                        <option value="bachelor">Bachelor</option>
                        <option value="master">Master</option>
                        <option value="phd">PhD</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="col-md-8">
                    <label class="form-label">Institution</label>
                    <input v-model="form.institution_name" type="text" class="form-control" required />
                    <p v-if="errors.institution_name" class="text-danger fs-14 mb-0">{{ errors.institution_name[0] }}</p>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Country (ISO)</label>
                    <input v-model="form.institution_country" type="text" maxlength="2" class="form-control text-uppercase" placeholder="IN" />
                </div>
                <div class="col-md-4">
                    <label class="form-label">Graduation year</label>
                    <input v-model="form.graduation_year" type="number" min="1950" :max="currentYear + 1" class="form-control" />
                </div>
                <div class="col-md-4">
                    <label class="form-label">Grading system</label>
                    <select v-model="form.grading_system" class="form-select">
                        <option value="percentage">Percentage (0–100)</option>
                        <option value="gpa">GPA</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label class="form-label">Result</label>
                    <input v-model="form.grade_value" type="number" step="0.01" min="0" class="form-control" />
                </div>
                <div class="col-md-2">
                    <label class="form-label">Scale max</label>
                    <input v-model="form.grade_max" type="number" step="0.01" min="0" class="form-control" />
                </div>
                <div class="col-md-12">
                    <label class="form-label">Relevant subjects (comma separated)</label>
                    <input v-model="form.prerequisite_subjects_text" type="text" class="form-control" placeholder="Computer Science, Mathematics, Statistics" />
                </div>
                <div class="col-md-6 d-flex gap-4">
                    <label class="form-check"><input v-model="form.transcript_available" type="checkbox" class="form-check-input" /> Transcript available</label>
                    <label class="form-check"><input v-model="form.certificate_available" type="checkbox" class="form-check-input" /> Certificate available</label>
                </div>

                <p v-if="feedback" class="text-danger fs-14 mb-0">{{ feedback }}</p>
            </form>

            <template #footer>
                <button type="button" class="btn btn-light" @click="showForm = false">Cancel</button>
                <button type="submit" form="education-form" class="btn btn-primary" :disabled="saving">
                    <span v-if="saving" class="spinner-border spinner-border-sm me-1" role="status"></span>
                    {{ saving ? 'Saving…' : 'Save record' }}
                </button>
            </template>
        </Modal>

        <ConfirmDialog
            :show="!!confirmTarget"
            title="Delete education record?"
            :message="`Delete “${confirmTarget?.qualification_title ?? 'this record'}”? Matching results will be recalculated.`"
            :busy="removing"
            @cancel="confirmTarget = null"
            @confirm="remove"
        />
    </div>
</template>
