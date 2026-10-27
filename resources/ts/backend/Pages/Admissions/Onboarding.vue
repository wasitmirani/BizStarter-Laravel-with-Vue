<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import AdmissionsService from '../../Services/Admissions/AdmissionsService';
import { errorMessage } from '../../Services/Admissions/api';
import PageHeader from '../Admissions/Components/PageHeader.vue';
import PersonalProfileForm from '../Admissions/Partials/PersonalProfileForm.vue';
import EducationManager from '../Admissions/Partials/EducationManager.vue';
import LanguageManager from '../Admissions/Partials/LanguageManager.vue';
import StudyPreferencesForm from '../Admissions/Partials/StudyPreferencesForm.vue';
import WorkManager from '../Admissions/Partials/WorkManager.vue';
import NotificationPreferencesForm from '../Admissions/Partials/NotificationPreferencesForm.vue';

const router = useRouter();

const steps = [
    { key: 1, label: 'Personal' },
    { key: 2, label: 'Education' },
    { key: 3, label: 'Languages' },
    { key: 4, label: 'Preferences' },
    { key: 5, label: 'Experience' },
    { key: 6, label: 'Notifications' },
];

const step = ref(1);
const data = ref<any>(null);
const loading = ref(true);
const saving = ref(false);
const error = ref('');

const load = async () => {
    loading.value = true;
    error.value = '';
    try {
        data.value = await AdmissionsService.profile();
        step.value = data.value?.profile?.onboarding_step || 1;
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        loading.value = false;
    }
};

onMounted(load);

const completion = computed(() => data.value?.completion?.percentage ?? 0);

const go = async (next: number) => {
    step.value = Math.min(6, Math.max(1, next));
    try {
        await AdmissionsService.updateProfile({ onboarding_step: step.value });
    } catch {
        // Step position is a convenience only; never block navigation on it.
    }
};

const finish = async () => {
    saving.value = true;
    error.value = '';
    try {
        await AdmissionsService.updateProfile({ complete: true });
        await router.push({ name: 'dashboard' });
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        saving.value = false;
    }
};
</script>

<template>
    <div>
        <PageHeader title="Applicant onboarding" subtitle="Save and resume at any time. Your answers are used only for your own matches.">
            <template #actions>
                <span class="badge bg-primary-subtle text-primary border border-primary-subtle">{{ completion }}% complete</span>
                <router-link :to="{ name: 'dashboard' }" class="btn btn-sm btn-light">Back to dashboard</router-link>
            </template>
        </PageHeader>

        <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

        <div v-if="loading" class="card"><div class="card-body text-center py-10"><span class="spinner-border text-primary"></span></div></div>

        <template v-else-if="data">
            <!-- Step indicator -->
            <div class="card mb-4">
                <div class="card-body">
                    <div class="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
                        <p class="mb-0 fw-medium">Step {{ step }} of 6 · {{ steps[step - 1].label }}</p>
                        <span class="text-muted fs-14">{{ completion }}% profile complete</span>
                    </div>
                    <div class="progress mb-3" style="height: 6px">
                        <div class="progress-bar bg-primary" :style="{ width: `${(step / 6) * 100}%` }"></div>
                    </div>
                    <ul class="nav nav-pills nav-light border p-1 rounded d-inline-flex flex-wrap gap-1">
                        <li v-for="item in steps" :key="item.key" class="nav-item">
                            <button
                                type="button"
                                class="nav-link py-1 fs-15 rounded-1"
                                :class="{ active: step === item.key }"
                                @click="go(item.key)"
                            >
                                <span class="me-1">{{ item.key }}.</span>{{ item.label }}
                                <AppIcon v-if="step > item.key" name="check" :size="14" class="ms-1" />
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">Step {{ step }} of 6 — {{ steps[step - 1].label }}</h5>
                </div>
                <div class="card-body">
                    <!-- 1. Personal -->
                    <PersonalProfileForm v-if="step === 1" :initial="data.profile" compact @saved="load">
                        <template #actions="{ save, saving: personalSaving }">
                            <button type="button" class="btn btn-primary" :disabled="personalSaving" @click="save(); go(2)">
                                {{ personalSaving ? 'Saving…' : 'Save & continue' }}
                            </button>
                        </template>
                    </PersonalProfileForm>

                    <!-- 2. Education -->
                    <EducationManager v-else-if="step === 2" :items="data.education" @changed="load" />

                    <!-- 3. Languages -->
                    <LanguageManager v-else-if="step === 3" :items="data.language_qualifications" @changed="load" />

                    <!-- 4. Study preferences -->
                    <StudyPreferencesForm v-else-if="step === 4" :initial="data.study_preferences" @saved="load" />

                    <!-- 5. Work experience -->
                    <WorkManager v-else-if="step === 5" :items="data.work_experiences" @changed="load" />

                    <!-- 6. Notifications -->
                    <NotificationPreferencesForm
                        v-else
                        :initial="data.notification_preferences"
                        :slack-configured="!!data.slack_webhook_configured"
                        @saved="load"
                    />
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center">
                    <button type="button" class="btn btn-light btn-sm" :disabled="step === 1" @click="go(step - 1)">
                        <AppIcon name="arrow-left" class="me-1" />Back
                    </button>

                    <div class="d-flex gap-2">
                        <button v-if="step < 6" type="button" class="btn btn-primary btn-sm" @click="go(step + 1)">
                            Continue<AppIcon name="arrow-right" class="ms-1" />
                        </button>
                        <button v-else type="button" class="btn btn-success btn-sm" :disabled="saving" @click="finish">
                            <AppIcon name="flag" class="me-1" />{{ saving ? 'Finishing…' : 'Finish onboarding' }}
                        </button>
                    </div>
                </div>
            </div>

            <p class="text-muted fs-14 mt-3 mb-0">
                Tip: records are saved as you add them. Continuing only moves to the next step.
            </p>
        </template>
    </div>
</template>
