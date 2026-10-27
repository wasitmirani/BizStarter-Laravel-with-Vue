<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import AdmissionsService from '../../../Services/Admissions/AdmissionsService';
import { errorMessage, validationErrors } from '../../../Services/Admissions/api';

const props = defineProps<{ initial?: Record<string, any> | null }>();
const emit = defineEmits<{ (event: 'saved', payload: any): void }>();

const subjects = [
    'Computer Science',
    'Artificial Intelligence',
    'Data Science',
    'Software Engineering',
    'Cybersecurity',
    'Information Technology',
    'Healthcare Management',
    'Public Health',
];

const form = reactive({
    subject_areas: [] as string[],
    preferred_regions_text: '',
    preferred_universities_text: '',
    institution_type: 'any',
    max_tuition: '' as string | number,
    application_budget: '' as string | number,
    needs_scholarship: true,
    preferred_scholarship_types_text: '',
    min_relevance: 'medium',
    deadline_preference: 'any',
});

const errors = ref<Record<string, string[]>>({});
const saving = ref(false);
const message = ref('');

const hydrate = (source: any) => {
    if (!source) return;
    form.subject_areas = source.subject_areas ?? [];
    form.preferred_regions_text = (source.preferred_regions ?? []).join(', ');
    form.preferred_universities_text = (source.preferred_universities ?? []).join(', ');
    form.institution_type = source.institution_type ?? 'any';
    form.max_tuition = source.max_tuition ?? '';
    form.application_budget = source.application_budget ?? '';
    form.needs_scholarship = source.needs_scholarship ?? true;
    form.preferred_scholarship_types_text = (source.preferred_scholarship_types ?? []).join(', ');
    form.min_relevance = source.min_relevance ?? 'medium';
    form.deadline_preference = source.deadline_preference ?? 'any';
};

watch(() => props.initial, hydrate, { immediate: true });

const toggleSubject = (subject: string) => {
    const index = form.subject_areas.indexOf(subject);
    index === -1 ? form.subject_areas.push(subject) : form.subject_areas.splice(index, 1);
};

const save = async () => {
    saving.value = true;
    errors.value = {};
    message.value = '';

    const toArray = (value: string) => value.split(',').map((item) => item.trim()).filter(Boolean);

    try {
        const result = await AdmissionsService.updatePreferences({
            subject_areas: form.subject_areas,
            preferred_regions: toArray(form.preferred_regions_text),
            preferred_universities: toArray(form.preferred_universities_text),
            institution_type: form.institution_type,
            max_tuition: form.max_tuition === '' ? null : Number(form.max_tuition),
            application_budget: form.application_budget === '' ? null : Number(form.application_budget),
            needs_scholarship: form.needs_scholarship,
            preferred_scholarship_types: toArray(form.preferred_scholarship_types_text),
            min_relevance: form.min_relevance,
            deadline_preference: form.deadline_preference,
        });
        message.value = 'Study preferences saved and matches recalculated.';
        emit('saved', result);
    } catch (error: any) {
        errors.value = validationErrors(error);
        message.value = errorMessage(error);
    } finally {
        saving.value = false;
    }
};
</script>

<template>
    <form class="d-flex flex-column gap-3" @submit.prevent="save">
        <div>
            <label class="form-label">Subject areas</label>
            <div class="d-flex flex-wrap gap-2">
                <button
                    v-for="subject in subjects"
                    :key="subject"
                    type="button"
                    class="btn btn-sm border"
                    :class="form.subject_areas.includes(subject) ? 'bg-primary text-white border-primary' : 'bg-light text-body'"
                    @click="toggleSubject(subject)"
                >
                    {{ subject }}
                </button>
            </div>
        </div>

        <div class="row g-3">
            <div class="col-md-6">
                <label class="form-label">Preferred regions (comma separated)</label>
                <input v-model="form.preferred_regions_text" type="text" class="form-control" placeholder="Lombardy, Lazio" />
            </div>
            <div class="col-md-6">
                <label class="form-label">Preferred universities (comma separated)</label>
                <input v-model="form.preferred_universities_text" type="text" class="form-control" placeholder="Politecnico di Milano" />
            </div>
            <div class="col-md-3">
                <label class="form-label">Institution type</label>
                <select v-model="form.institution_type" class="form-select">
                    <option value="any">Any</option>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>
            </div>
            <div class="col-md-3">
                <label class="form-label">Max annual tuition (€)</label>
                <input v-model="form.max_tuition" type="number" min="0" class="form-control" />
            </div>
            <div class="col-md-3">
                <label class="form-label">Application budget (€)</label>
                <input v-model="form.application_budget" type="number" min="0" class="form-control" />
            </div>
            <div class="col-md-3">
                <label class="form-label">Minimum relevance</label>
                <select v-model="form.min_relevance" class="form-select">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <div class="col-md-6">
                <label class="form-label">Scholarship types (comma separated)</label>
                <input v-model="form.preferred_scholarship_types_text" type="text" class="form-control" placeholder="Regional DSU, MAECI" />
            </div>
            <div class="col-md-6">
                <label class="form-label">Deadline preference</label>
                <select v-model="form.deadline_preference" class="form-select">
                    <option value="any">Any</option>
                    <option value="early">Prefer early deadlines</option>
                    <option value="flexible">Flexible</option>
                </select>
            </div>
        </div>

        <label class="form-check">
            <input v-model="form.needs_scholarship" type="checkbox" class="form-check-input" />
            I need a scholarship or fee waiver
        </label>

        <p v-if="message" class="fs-14 mb-0" :class="Object.keys(errors).length ? 'text-danger' : 'text-success'">{{ message }}</p>

        <div class="d-flex justify-content-end">
            <button type="submit" class="btn btn-primary" :disabled="saving">
                <AppIcon name="device-floppy" class="me-1" />{{ saving ? 'Saving…' : 'Save preferences' }}
            </button>
        </div>
    </form>
</template>
