<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import AdmissionsService from '../../Services/Admissions/AdmissionsService';
import { errorMessage } from '../../Services/Admissions/api';
import PageHeader from '../Admissions/Components/PageHeader.vue';
import StatusBadge from '../Admissions/Components/StatusBadge.vue';
import EmptyState from '../Admissions/Components/EmptyState.vue';
import AssessmentDetails from '../Admissions/Components/AssessmentDetails.vue';
import FilterTabs from '../Admissions/Components/FilterTabs.vue';
import Pagination from '../Admissions/Components/Pagination.vue';
import Modal from '../Admissions/Components/Modal.vue';

const router = useRouter();

const statuses = [
    { key: 'likely_eligible', label: 'Likely Eligible' },
    { key: 'potential_match', label: 'Potential Match' },
    { key: 'ambitious', label: 'Ambitious' },
    { key: 'insufficient_evidence', label: 'Insufficient Evidence' },
    { key: 'not_eligible', label: 'Not Eligible' },
];

const filters = reactive({ status: '', search: '', page: 1 });
const assessments = ref<any[]>([]);
const counts = ref<Record<string, number>>({});
const meta = ref<any>({ current_page: 1, last_page: 1, total: 0, per_page: 12 });
const loading = ref(true);
const busy = ref(false);
const error = ref('');
const notice = ref('');
const selected = ref<any>(null);

const tabs = computed(() => {
    const total = Object.values(counts.value).reduce((sum, value) => sum + Number(value || 0), 0);
    return [
        { key: '', label: 'All', count: total },
        ...statuses.map((status) => ({ ...status, count: counts.value[status.key] ?? 0 })),
    ];
});

const load = async (page = filters.page) => {
    filters.page = page;
    loading.value = true;
    error.value = '';
    try {
        const result = await AdmissionsService.eligibility({ ...filters, per_page: 12 });
        assessments.value = result.assessments;
        counts.value = result.counts ?? {};
        meta.value = result.meta;
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        loading.value = false;
    }
};

onMounted(() => load(1));

const reassess = async () => {
    busy.value = true;
    notice.value = '';
    try {
        const result = await AdmissionsService.reassess();
        notice.value = `Recalculated ${result.assessed} program matches.`;
        await load(1);
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        busy.value = false;
    }
};

const startApplication = (assessment: any) => {
    router.push({ name: 'applications', query: { program: assessment.program?.id } });
};

const toggleBookmark = async (assessment: any) => {
    const program = assessment.program;
    if (!program) return;

    try {
        if (program.bookmarked) {
            await AdmissionsService.removeBookmark(program.id);
            program.bookmarked = false;
            notice.value = 'Bookmark removed.';
        } else {
            await AdmissionsService.bookmark(program.id);
            program.bookmarked = true;
            notice.value = 'Program bookmarked.';
        }
    } catch (exception: any) {
        error.value = errorMessage(exception);
    }
};

const openDetails = (assessment: any) => {
    selected.value = assessment;
};

const closeDetails = () => {
    selected.value = null;
};

const scoreTone = (status: string) => {
    if (status === 'likely_eligible') return 'bg-success';
    if (status === 'potential_match') return 'bg-primary';
    if (status === 'ambitious') return 'bg-warning';
    if (status === 'not_eligible') return 'bg-danger';
    return 'bg-secondary';
};

const formatDate = (value?: string | null) =>
    value
        ? new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
        : '—';

const selectStatus = (status: string) => {
    filters.status = status;
    load(1);
};
</script>

<template>
    <div>
        <PageHeader title="My eligibility matches" subtitle="Rules-based results from your own profile. Match strength is not an admission probability.">
            <template #actions>
                <button type="button" class="btn btn-sm btn-primary" :disabled="busy" @click="reassess">
                    <span v-if="busy" class="spinner-border spinner-border-sm me-1" role="status"></span>
                    <AppIcon v-else name="refresh" class="me-1" />
                    {{ busy ? 'Recalculating…' : 'Recalculate' }}
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

        <FilterTabs :model-value="filters.status" :tabs="tabs" label="Match status" class="mb-4" @update:model-value="selectStatus" />

        <div v-if="loading" class="card">
            <div class="card-body text-center py-10"><span class="spinner-border text-primary"></span></div>
        </div>

        <template v-else>
            <div class="card">
                <div class="card-header d-flex flex-wrap gap-2 justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title mb-0">Evaluated programs</h5>
                        <p class="text-muted fs-14 mb-0">{{ meta.total }} {{ meta.total === 1 ? 'program' : 'programs' }} in this view</p>
                    </div>
                    <router-link :to="{ name: 'programs' }" class="link link-custom-primary fs-15">
                        Browse catalog <AppIcon name="arrow-right" :size="15" />
                    </router-link>
                </div>

                <div v-if="assessments.length" class="card-body d-flex flex-column gap-3">
                    <div
                        v-for="assessment in assessments"
                        :key="assessment.id"
                        class="border rounded-4 p-3 p-md-4 d-flex flex-wrap gap-3 justify-content-between align-items-start"
                    >
                        <div class="flex-grow-1" style="min-width: 260px">
                            <div class="d-flex flex-wrap gap-2 align-items-center mb-1">
                                <h6 class="mb-0">{{ assessment.program?.title }}</h6>
                                <StatusBadge :status="assessment.status" :label="assessment.status_label" />
                            </div>
                            <p class="text-muted fs-15 mb-2">
                                {{ assessment.program?.university }}
                                <span v-if="assessment.program?.region">· {{ assessment.program.region }}</span>
                                <span v-if="assessment.program?.tuition">· {{ assessment.program.tuition }}</span>
                            </p>

                            <div class="d-flex flex-wrap align-items-center gap-3">
                                <div class="d-flex align-items-center gap-2">
                                    <div class="progress" style="width: 120px; height: 6px">
                                        <div class="progress-bar" :class="scoreTone(assessment.status)" :style="{ width: `${assessment.score}%` }"></div>
                                    </div>
                                    <span class="fs-14 text-muted">Match strength {{ assessment.score }}%</span>
                                </div>
                                <span v-if="assessment.admission_call?.deadline" class="fs-14 text-muted">
                                    <AppIcon name="calendar-event" class="me-1" />{{ formatDate(assessment.admission_call.deadline) }}
                                    <template v-if="assessment.admission_call.days_left !== null"> ({{ assessment.admission_call.days_left }} days)</template>
                                </span>
                            </div>
                        </div>

                        <div class="d-flex flex-wrap gap-2">
                            <button
                                type="button"
                                class="btn btn-icon btn-sub-primary size-7-5"
                                :aria-label="assessment.program?.bookmarked ? 'Remove bookmark' : 'Bookmark program'"
                                @click="toggleBookmark(assessment)"
                            >
                                <AppIcon :name="assessment.program?.bookmarked ? 'bookmark-filled' : 'bookmark'" :size="16" />
                            </button>
                            <button type="button" class="btn btn-sm btn-light" @click="openDetails(assessment)">Details</button>
                            <button type="button" class="btn btn-sm btn-primary" @click="startApplication(assessment)">Track application</button>
                        </div>
                    </div>
                </div>

                <div v-else class="card-body">
                    <EmptyState
                        icon="target-arrow"
                        title="No matches in this view"
                        message="Complete your profile, then recalculate to generate evidence-based matches."
                    >
                        <router-link :to="{ name: 'onboarding' }" class="btn btn-sm btn-primary">Complete profile</router-link>
                    </EmptyState>
                </div>
            </div>

            <Pagination :meta="meta" @change="load" />
        </template>

        <Modal
            :show="!!selected"
            :title="selected?.program?.title ?? 'Match details'"
            :subtitle="selected?.program ? `${selected.program.university ?? ''}${selected.program.region ? ` · ${selected.program.region}` : ''}` : ''"
            icon="target-arrow"
            size="xl"
            @close="closeDetails"
        >
            <div v-if="selected" class="d-flex flex-column gap-4">
                <div class="d-flex flex-wrap gap-3 align-items-center justify-content-between border rounded-3 p-3">
                    <div class="d-flex flex-wrap align-items-center gap-2">
                        <StatusBadge :status="selected.status" :label="selected.status_label" />
                        <span class="fs-14 text-muted">Match strength</span>
                        <div class="progress" style="width: 140px; height: 6px">
                            <div class="progress-bar" :class="scoreTone(selected.status)" :style="{ width: `${selected.score}%` }"></div>
                        </div>
                        <span class="fs-14 fw-medium">{{ selected.score }}%</span>
                    </div>
                    <span v-if="selected.admission_call?.deadline" class="fs-14 text-muted">
                        <AppIcon name="calendar-event" class="me-1" />Deadline {{ formatDate(selected.admission_call.deadline) }}
                    </span>
                </div>

                <AssessmentDetails :assessment="selected" />
            </div>

            <template #footer>
                <button type="button" class="btn btn-light" @click="closeDetails">Close</button>
                <button type="button" class="btn btn-sub-primary" @click="toggleBookmark(selected)">
                    <AppIcon :name="selected?.program?.bookmarked ? 'bookmark-filled' : 'bookmark'" class="me-1" />
                    {{ selected?.program?.bookmarked ? 'Bookmarked' : 'Bookmark' }}
                </button>
                <button type="button" class="btn btn-primary" @click="startApplication(selected); closeDetails()">Track application</button>
            </template>
        </Modal>
    </div>
</template>
