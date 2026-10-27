<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import AdmissionsService from '../../../Services/Admissions/AdmissionsService';
import { errorMessage, validationErrors } from '../../../Services/Admissions/api';

const props = defineProps<{ initial?: Record<string, any> | null; slackConfigured?: boolean }>();
const emit = defineEmits<{ (event: 'saved', payload: any): void }>();

const form = reactive({
    email: '',
    frequency: 'weekly',
    preferred_time: '09:00',
    timezone: 'Europe/Rome',
    reminder_windows_text: '30, 14, 7',
    scholarship_alerts: true,
    new_announcements: true,
    eligibility_change_alerts: true,
    slack_enabled: false,
    slack_webhook_url: '',
});

const errors = ref<Record<string, string[]>>({});
const saving = ref(false);
const message = ref('');

const hydrate = (source: any) => {
    if (!source) return;
    form.email = source.email ?? '';
    form.frequency = source.frequency ?? 'weekly';
    // The API returns a full time (HH:MM:SS); native time inputs expect HH:MM.
    form.preferred_time = String(source.preferred_time ?? '09:00').slice(0, 5);
    form.timezone = source.timezone ?? 'Europe/Rome';
    form.reminder_windows_text = (source.reminder_windows ?? [30, 14, 7]).join(', ');
    form.scholarship_alerts = !!source.scholarship_alerts;
    form.new_announcements = !!source.new_announcements;
    form.eligibility_change_alerts = !!source.eligibility_change_alerts;
    form.slack_enabled = !!source.slack_enabled;
};

watch(() => props.initial, hydrate, { immediate: true });

const save = async () => {
    saving.value = true;
    errors.value = {};
    message.value = '';

    const payload: Record<string, any> = {
        email: form.email || null,
        frequency: form.frequency,
        preferred_time: form.preferred_time || null,
        timezone: form.timezone,
        reminder_windows: form.reminder_windows_text
            .split(',')
            .map((item) => Number(item.trim()))
            .filter((value) => Number.isFinite(value) && value > 0),
        scholarship_alerts: form.scholarship_alerts,
        new_announcements: form.new_announcements,
        eligibility_change_alerts: form.eligibility_change_alerts,
        slack_enabled: form.slack_enabled,
    };

    if (form.slack_webhook_url.trim() !== '') {
        payload.slack_webhook_url = form.slack_webhook_url.trim();
    }

    try {
        const result = await AdmissionsService.updateNotificationPreferences(payload);
        message.value = 'Notification preferences saved.';
        form.slack_webhook_url = '';
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
        <div class="row g-3">
            <div class="col-md-6">
                <label class="form-label">Report email</label>
                <input v-model="form.email" type="email" class="form-control" placeholder="you@example.com" />
                <p v-if="errors.email" class="text-danger fs-14 mb-0">{{ errors.email[0] }}</p>
            </div>
            <div class="col-md-3">
                <label class="form-label">Frequency</label>
                <select v-model="form.frequency" class="form-select">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="urgent_only">Urgent only</option>
                    <option value="off">Off</option>
                </select>
            </div>
            <div class="col-md-3">
                <label class="form-label">Preferred time</label>
                <input v-model="form.preferred_time" type="time" class="form-control" />
            </div>
            <div class="col-md-4">
                <label class="form-label">Timezone</label>
                <input v-model="form.timezone" type="text" class="form-control" placeholder="Europe/Rome" />
            </div>
            <div class="col-md-4">
                <label class="form-label">Deadline reminder windows (days before)</label>
                <input v-model="form.reminder_windows_text" type="text" class="form-control" placeholder="30, 14, 7" />
            </div>
        </div>

        <div class="d-flex flex-column gap-2">
            <label class="form-check"><input v-model="form.scholarship_alerts" type="checkbox" class="form-check-input" /> Scholarship alerts</label>
            <label class="form-check"><input v-model="form.new_announcements" type="checkbox" class="form-check-input" /> New admission announcements</label>
            <label class="form-check"><input v-model="form.eligibility_change_alerts" type="checkbox" class="form-check-input" /> Eligibility-change alerts</label>
        </div>

        <div class="border-top pt-3">
            <div class="d-flex align-items-center justify-content-between gap-2 mb-2">
                <label class="form-check mb-0"><input v-model="form.slack_enabled" type="checkbox" class="form-check-input" /> Enable Slack notifications</label>
                <span v-if="slackConfigured" class="badge bg-success-subtle text-success border border-success-subtle">Webhook saved</span>
            </div>
            <input
                v-if="form.slack_enabled"
                v-model="form.slack_webhook_url"
                type="password"
                class="form-control"
                autocomplete="new-password"
                :placeholder="slackConfigured ? 'Saved — leave blank to keep the existing webhook' : 'https://hooks.slack.com/services/…'"
            />
            <p class="text-muted fs-14 mt-1 mb-0">The webhook is encrypted at rest and never returned by the API.</p>
            <p v-if="errors.slack_webhook_url" class="text-danger fs-14 mb-0">{{ errors.slack_webhook_url[0] }}</p>
        </div>

        <p v-if="message" class="fs-14 mb-0" :class="Object.keys(errors).length ? 'text-danger' : 'text-success'">{{ message }}</p>

        <div class="d-flex justify-content-end">
            <button type="submit" class="btn btn-primary" :disabled="saving">
                <AppIcon name="device-floppy" class="me-1" />{{ saving ? 'Saving…' : 'Save notifications' }}
            </button>
        </div>
    </form>
</template>
