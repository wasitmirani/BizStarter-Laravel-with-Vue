<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdmissionsService from '../../Services/Admissions/AdmissionsService';
import { errorMessage } from '../../Services/Admissions/api';
import PageHeader from '../Admissions/Components/PageHeader.vue';
import FilterTabs from '../Admissions/Components/FilterTabs.vue';
import StudyPreferencesForm from '../Admissions/Partials/StudyPreferencesForm.vue';
import NotificationPreferencesForm from '../Admissions/Partials/NotificationPreferencesForm.vue';

const active = ref('study');
const profile = ref<any>(null);
const notifications = ref<any>(null);
const slackConfigured = ref(false);
const loading = ref(true);
const error = ref('');
const notice = ref('');

const load = async () => {
    loading.value = true;
    error.value = '';
    try {
        const [profileData, notificationData] = await Promise.all([
            AdmissionsService.profile(),
            AdmissionsService.notificationPreferences(),
        ]);
        profile.value = profileData;
        notifications.value = notificationData.notification_preferences;
        slackConfigured.value = notificationData.slack_webhook_configured;
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        loading.value = false;
    }
};

const onSaved = () => {
    notice.value = 'Preferences saved.';
    load();
};

onMounted(load);
</script>

<template>
    <div>
        <PageHeader title="Preferences" subtitle="Control which programs are recommended and how reports reach you." />

        <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>
        <div v-if="notice" class="alert alert-success py-2">{{ notice }}</div>

        <div v-if="loading" class="card"><div class="card-body text-center py-10"><span class="spinner-border text-primary"></span></div></div>

        <template v-else>
            <FilterTabs
                v-model="active"
                :tabs="[
                    { key: 'study', label: 'Study preferences' },
                    { key: 'notifications', label: 'Notifications' },
                ]"
                label="Preference sections"
                class="mb-4"
            />

            <div class="card">
                <div class="card-body">
                    <StudyPreferencesForm v-if="active === 'study'" :initial="profile?.study_preferences" @saved="onSaved" />
                    <NotificationPreferencesForm
                        v-else
                        :initial="notifications"
                        :slack-configured="slackConfigured"
                        @saved="onSaved"
                    />
                </div>
            </div>

            <p class="text-muted fs-14 mt-3 mb-0">
                Notification delivery is only active once the scheduler and SMTP/Slack integrations are configured.
            </p>
        </template>
    </div>
</template>
