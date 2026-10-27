<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import AdmissionsService from '../../../Services/Admissions/AdmissionsService';
import { errorMessage, validationErrors } from '../../../Services/Admissions/api';

const props = withDefaults(defineProps<{ initial?: Record<string, any> | null; submitLabel?: string; compact?: boolean }>(), {
    initial: null,
    submitLabel: 'Save personal details',
});
const emit = defineEmits<{ (event: 'saved', payload: any): void }>();

const currentYear = new Date().getFullYear();

const form = reactive({
    full_name: '',
    nationality: '',
    country_of_residence: '',
    applicant_category: 'international',
    target_intake_year: currentYear + 1,
    intended_level: 'master',
    preferred_language: 'en',
});

const errors = ref<Record<string, string[]>>({});
const saving = ref(false);
const message = ref('');

const hydrate = (source: any) => {
    if (!source) return;
    Object.keys(form).forEach((key) => {
        if (source[key] !== null && source[key] !== undefined) {
            (form as any)[key] = source[key];
        }
    });
};

watch(() => props.initial, hydrate, { immediate: true });

const save = async () => {
    saving.value = true;
    errors.value = {};
    message.value = '';

    try {
        const result = await AdmissionsService.updateProfile({ ...form });
        message.value = 'Personal details saved.';
        emit('saved', result);
        hydrate(result.profile);
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
        <div class="row g-3">
            <div class="col-md-6">
                <label class="form-label">Full name</label>
                <input v-model="form.full_name" type="text" class="form-control" placeholder="As shown on your passport" />
                <p v-if="errors.full_name" class="text-danger fs-14 mb-0">{{ errors.full_name[0] }}</p>
            </div>
            <div class="col-md-3">
                <label class="form-label">Nationality (ISO)</label>
                <input v-model="form.nationality" type="text" maxlength="2" class="form-control text-uppercase" placeholder="IT" />
                <p v-if="errors.nationality" class="text-danger fs-14 mb-0">{{ errors.nationality[0] }}</p>
            </div>
            <div class="col-md-3">
                <label class="form-label">Country of residence</label>
                <input v-model="form.country_of_residence" type="text" maxlength="2" class="form-control text-uppercase" placeholder="IN" />
                <p v-if="errors.country_of_residence" class="text-danger fs-14 mb-0">{{ errors.country_of_residence[0] }}</p>
            </div>

            <div class="col-md-4">
                <label class="form-label">Applicant category</label>
                <select v-model="form.applicant_category" class="form-select">
                    <option value="international">International</option>
                    <option value="eu">EU</option>
                    <option value="non_eu">Non-EU</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="col-md-4">
                <label class="form-label">Target intake year</label>
                <select v-model="form.target_intake_year" class="form-select">
                    <option v-for="year in 4" :key="year" :value="currentYear + year - 1">{{ currentYear + year - 1 }}</option>
                </select>
            </div>
            <div class="col-md-4">
                <label class="form-label">Intended level</label>
                <select v-model="form.intended_level" class="form-select">
                    <option value="master">Master's</option>
                    <option value="postgraduate">Postgraduate</option>
                    <option value="phd">PhD</option>
                </select>
            </div>
            <div class="col-md-4">
                <label class="form-label">Preferred language of instruction</label>
                <select v-model="form.preferred_language" class="form-select">
                    <option value="en">English</option>
                    <option value="it">Italian</option>
                </select>
            </div>
        </div>

        <p v-if="message" class="fs-14 mb-0" :class="errors && Object.keys(errors).length ? 'text-danger' : 'text-success'">{{ message }}</p>

        <div v-if="!compact" class="d-flex justify-content-end">
            <button type="submit" class="btn btn-primary" :disabled="saving">
                <AppIcon name="device-floppy" class="me-1" />{{ saving ? 'Saving…' : submitLabel }}
            </button>
        </div>
        <slot v-else name="actions" :save="save" :saving="saving" />
    </form>
</template>
