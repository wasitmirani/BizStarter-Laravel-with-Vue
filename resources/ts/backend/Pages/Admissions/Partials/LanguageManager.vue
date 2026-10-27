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
    language: 'en',
    test_type: 'ielts',
    score: '' as string | number,
    score_max: '' as string | number,
    certificate_available: false,
    issue_date: '',
    expiry_date: '',
    notes: '',
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
        language: record.language ?? 'en',
        test_type: record.test_type,
        score: record.score ?? '',
        score_max: record.score_max ?? '',
        certificate_available: !!record.certificate_available,
        issue_date: record.issue_date ?? '',
        expiry_date: record.expiry_date ?? '',
        notes: record.notes ?? '',
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
        language: form.language,
        test_type: form.test_type,
        score: form.score === '' ? null : Number(form.score),
        score_max: form.score_max === '' ? null : Number(form.score_max),
        certificate_available: form.certificate_available,
        issue_date: form.issue_date || null,
        expiry_date: form.expiry_date || null,
        notes: form.notes || null,
    };

    try {
        if (editingId.value) {
            await AdmissionsService.updateLanguage(editingId.value, payload);
        } else {
            await AdmissionsService.createLanguage(payload);
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
        await AdmissionsService.deleteLanguage(record.id);
        confirmTarget.value = null;
        emit('changed');
    } finally {
        removing.value = false;
    }
};

const formatDate = (value?: string | null) =>
    value ? new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
</script>

<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
                <h6 class="mb-1">Language qualifications</h6>
                <p class="text-muted fs-15 mb-0">MOI acceptance is program-specific — never assumed automatically.</p>
            </div>
            <button type="button" class="btn btn-primary btn-sm" @click="openCreate">
                <AppIcon name="plus" class="me-1" />Add result
            </button>
        </div>

        <EmptyState v-if="!items.length" icon="language" title="No language results" message="Add IELTS, TOEFL, MOI or another certificate to unlock language checks." />

        <div v-else class="d-flex flex-column gap-2">
            <div v-for="record in items" :key="record.id" class="border rounded p-3 d-flex flex-wrap gap-2 align-items-start justify-content-between">
                <div>
                    <h6 class="mb-1 text-uppercase">{{ record.test_type }}</h6>
                    <p class="text-muted fs-15 mb-1">
                        <template v-if="record.score !== null">{{ record.score }}<span v-if="record.score_max"> / {{ record.score_max }}</span></template>
                        <template v-else>No score recorded</template>
                        · {{ record.certificate_available ? 'certificate available' : 'certificate missing' }}
                        <template v-if="record.expiry_date"> · expires {{ formatDate(record.expiry_date) }}</template>
                    </p>
                    <p v-if="record.notes" class="text-muted fs-14 mb-0">{{ record.notes }}</p>
                </div>
                <div class="d-flex gap-2">
                    <button type="button" class="btn btn-icon btn-sub-primary size-7-5" aria-label="Edit" @click="openEdit(record)"><AppIcon name="edit" /></button>
                    <button type="button" class="btn btn-icon btn-sub-danger size-7-5" aria-label="Delete" @click="askRemove(record)"><AppIcon name="trash" :size="16" /></button>
                </div>
            </div>
        </div>

        <Modal
            :show="showForm"
            :title="editingId ? 'Edit language result' : 'Add language result'"
            :subtitle="editingId ? 'Update the test details stored for eligibility checks.' : 'MOI acceptance is program-specific and never assumed automatically.'"
            icon="language"
            size="lg"
            @close="showForm = false"
        >
            <form id="language-form" class="row g-3" @submit.prevent="submit">
                <div class="col-md-4">
                    <label class="form-label">Test</label>
                    <select v-model="form.test_type" class="form-select">
                        <option value="ielts">IELTS</option>
                        <option value="toefl">TOEFL</option>
                        <option value="cambridge">Cambridge</option>
                        <option value="pte">PTE</option>
                        <option value="duolingo">Duolingo</option>
                        <option value="moi">MOI certificate</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label class="form-label">Language</label>
                    <select v-model="form.language" class="form-select">
                        <option value="en">EN</option>
                        <option value="it">IT</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Score</label>
                    <input v-model="form.score" type="number" step="0.1" min="0" class="form-control" />
                </div>
                <div class="col-md-3">
                    <label class="form-label">Score max</label>
                    <input v-model="form.score_max" type="number" step="0.1" min="0" class="form-control" placeholder="9" />
                </div>
                <div class="col-md-6">
                    <label class="form-label">Issue date</label>
                    <input v-model="form.issue_date" type="date" class="form-control" />
                </div>
                <div class="col-md-6">
                    <label class="form-label">Expiry date</label>
                    <input v-model="form.expiry_date" type="date" class="form-control" />
                </div>
                <div class="col-12">
                    <label class="form-label">Notes</label>
                    <textarea v-model="form.notes" rows="2" class="form-control" placeholder="e.g. university confirmed MOI acceptance by email"></textarea>
                </div>
                <div class="col-12">
                    <label class="form-check"><input v-model="form.certificate_available" type="checkbox" class="form-check-input" /> Certificate available</label>
                </div>

                <p v-if="feedback" class="text-danger fs-14 mb-0">{{ feedback }}</p>
            </form>

            <template #footer>
                <button type="button" class="btn btn-light" @click="showForm = false">Cancel</button>
                <button type="submit" form="language-form" class="btn btn-primary" :disabled="saving">
                    <span v-if="saving" class="spinner-border spinner-border-sm me-1" role="status"></span>
                    {{ saving ? 'Saving…' : 'Save result' }}
                </button>
            </template>
        </Modal>

        <ConfirmDialog
            :show="!!confirmTarget"
            title="Delete language result?"
            :message="`Delete the ${String(confirmTarget?.test_type ?? '').toUpperCase()} result? Matching results will be recalculated.`"
            :busy="removing"
            @cancel="confirmTarget = null"
            @confirm="remove"
        />
    </div>
</template>
