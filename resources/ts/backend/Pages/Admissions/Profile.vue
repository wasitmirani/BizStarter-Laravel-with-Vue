<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AdmissionsService from '../../Services/Admissions/AdmissionsService';
import { errorMessage } from '../../Services/Admissions/api';
import PageHeader from '../Admissions/Components/PageHeader.vue';
import FilterTabs from '../Admissions/Components/FilterTabs.vue';
import PersonalProfileForm from '../Admissions/Partials/PersonalProfileForm.vue';
import EducationManager from '../Admissions/Partials/EducationManager.vue';
import LanguageManager from '../Admissions/Partials/LanguageManager.vue';
import WorkManager from '../Admissions/Partials/WorkManager.vue';

const tabs = [
    { key: 'personal', label: 'Personal' },
    { key: 'education', label: 'Education' },
    { key: 'languages', label: 'Languages' },
    { key: 'work', label: 'Work experience' },
];

const active = ref('personal');
const data = ref<any>(null);
const loading = ref(true);
const error = ref('');

const load = async () => {
    loading.value = true;
    error.value = '';
    try {
        data.value = await AdmissionsService.profile();
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        loading.value = false;
    }
};

onMounted(load);

const completion = computed(() => data.value?.completion?.percentage ?? 0);
</script>

<template>
    <div>
        <PageHeader title="My profile" subtitle="Everything here is private to your account and powers your recommendations.">
            <template #actions>
                <span class="badge bg-primary-subtle text-primary border border-primary-subtle">{{ completion }}% complete</span>
                <router-link :to="{ name: 'preferences' }" class="btn btn-sm btn-light">
                    <AppIcon name="adjustments" class="me-1" />Study preferences
                </router-link>
            </template>
        </PageHeader>

        <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

        <div v-if="loading" class="card"><div class="card-body text-center py-10"><span class="spinner-border text-primary"></span></div></div>

        <div v-else-if="data" class="card">
            <div class="card-header">
                <FilterTabs v-model="active" :tabs="tabs" label="Profile sections" />
            </div>
            <div class="card-body">
                <PersonalProfileForm v-if="active === 'personal'" :initial="data.profile" @saved="load" />
                <EducationManager v-else-if="active === 'education'" :items="data.education" @changed="load" />
                <LanguageManager v-else-if="active === 'languages'" :items="data.language_qualifications" @changed="load" />
                <WorkManager v-else :items="data.work_experiences" @changed="load" />
            </div>
        </div>
    </div>
</template>
