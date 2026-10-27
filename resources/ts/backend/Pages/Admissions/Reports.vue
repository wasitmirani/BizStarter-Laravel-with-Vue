<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AdmissionsService from '../../Services/Admissions/AdmissionsService';
import { errorMessage } from '../../Services/Admissions/api';
import PageHeader from '../Admissions/Components/PageHeader.vue';
import EmptyState from '../Admissions/Components/EmptyState.vue';
import MetricCard from '../Admissions/Components/MetricCard.vue';
import StatusBadge from '../Admissions/Components/StatusBadge.vue';
import Pagination from '../Admissions/Components/Pagination.vue';

const reports = ref<any[]>([]);
const programs = ref<any[]>([]);
const meta = ref<any>({ current_page: 1, last_page: 1, total: 0 });
const loading = ref(true);
const generating = ref(false);
const error = ref('');
const notice = ref('');
const page = ref(1);

const latest = computed(() => reports.value[0] ?? null);

const load = async (target = page.value) => {
    page.value = target;
    loading.value = true;
    error.value = '';
    try {
        const result = await AdmissionsService.reports({ page: target, per_page: 10 });
        reports.value = result.reports;
        meta.value = result.meta;
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        loading.value = false;
    }
};

const generate = async () => {
    generating.value = true;
    error.value = '';
    notice.value = '';
    try {
        await AdmissionsService.generateReport();
        notice.value = 'A fresh report has been generated for today.';
        await load(1);
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        generating.value = false;
    }
};

const counts = (report: any) => report?.payload?.counts ?? {};
const topMatches = (report: any) => report?.payload?.top_matches ?? [];

const loadPrograms = async () => {
    try {
        const result = await AdmissionsService.programs({ per_page: 100, sort: 'title' });
        programs.value = result.programs;
    } catch {
        // Program titles are a display convenience; reports still render with ids.
    }
};

const programLabel = (id: number) => programs.value.find((program) => Number(program.id) === Number(id));
const programTitle = (id: number) => programLabel(id)?.title ?? `Program #${id}`;
const programUniversity = (id: number) => programLabel(id)?.university?.name ?? '';

const parseDate = (value: string) => new Date(`${value.slice(0, 10)}T00:00:00`);

const formatDate = (value?: string | null) =>
    value ? parseDate(value).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

onMounted(async () => {
    await Promise.all([load(1), loadPrograms()]);
});
</script>

<template>
    <div>
        <PageHeader title="Reports" subtitle="A snapshot of your matches and outstanding actions, generated on demand.">
            <template #actions>
                <router-link :to="{ name: 'matches' }" class="btn btn-sm btn-light">
                    <AppIcon name="target-arrow" class="me-1" />My matches
                </router-link>
                <button type="button" class="btn btn-sm btn-primary" :disabled="generating" @click="generate">
                    <AppIcon name="report" class="me-1" />{{ generating ? 'Generating…' : 'Generate report' }}
                </button>
            </template>
        </PageHeader>

        <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>
        <div v-if="notice" class="alert alert-success py-2">{{ notice }}</div>

        <div v-if="loading" class="card">
            <div class="card-body text-center py-10"><span class="spinner-border text-primary"></span></div>
        </div>

        <template v-else>
            <EmptyState
                v-if="!reports.length"
                icon="report"
                title="No reports yet"
                message="Generate your first report to get a summary of your strongest matches and the evidence still missing."
            >
                <button type="button" class="btn btn-sm btn-primary" :disabled="generating" @click="generate">Generate report</button>
            </EmptyState>

            <template v-else>
                <div v-if="latest" class="row g-4 mb-4">
                    <div class="col-sm-6 col-xl-3">
                        <MetricCard label="Likely eligible" :value="counts(latest).likely_eligible ?? 0" icon="circle-check" tone="success" />
                    </div>
                    <div class="col-sm-6 col-xl-3">
                        <MetricCard label="Potential matches" :value="counts(latest).potential_match ?? 0" icon="target-arrow" tone="primary" />
                    </div>
                    <div class="col-sm-6 col-xl-3">
                        <MetricCard label="Need verification" :value="counts(latest).needs_verification ?? 0" icon="alert-triangle" tone="warning" />
                    </div>
                    <div class="col-sm-6 col-xl-3">
                        <MetricCard label="Not eligible" :value="counts(latest).not_eligible ?? 0" icon="circle-x" tone="danger" />
                    </div>
                </div>

                <div class="d-flex flex-column gap-3">
                    <div v-for="report in reports" :key="report.id" class="card">
                        <div class="card-header d-flex flex-wrap gap-2 justify-content-between align-items-center">
                            <div>
                                <h5 class="card-title mb-0">{{ formatDate(report.report_date) }}</h5>
                                <p class="text-muted fs-14 mb-0">
                                    {{ report.type }} report
                                    <span v-if="report.payload?.generated_at">· generated {{ new Date(report.payload.generated_at).toLocaleString() }}</span>
                                </p>
                            </div>
                            <span class="badge bg-light text-body border">{{ topMatches(report).length }} top matches</span>
                        </div>
                        <div class="card-body">
                            <p class="fs-15 mb-3">{{ report.summary }}</p>

                            <div v-if="topMatches(report).length" class="table-responsive">
                                <table class="table table-borderless table-sm align-middle mb-0">
                                    <thead class="border-bottom">
                                        <tr>
                                            <th class="text-muted fw-medium">Program</th>
                                            <th class="text-muted fw-medium">Status</th>
                                            <th class="text-muted fw-medium">Match strength</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="match in topMatches(report)" :key="`${report.id}-${match.program_id}`">
                                            <td>
                                                <p class="mb-0 fw-medium">{{ programTitle(match.program_id) }}</p>
                                                <p v-if="programUniversity(match.program_id)" class="text-muted fs-14 mb-0">{{ programUniversity(match.program_id) }}</p>
                                            </td>
                                            <td><StatusBadge :status="match.status" /></td>
                                            <td>
                                                <div class="d-flex align-items-center gap-2">
                                                    <div class="progress" style="width: 100px; height: 6px">
                                                        <div class="progress-bar bg-primary" :style="{ width: `${match.score}%` }"></div>
                                                    </div>
                                                    <span class="fs-14 text-muted">{{ match.score }}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <Pagination :meta="meta" @change="load" />
            </template>

            <p class="text-muted fs-14 mt-4 mb-0">
                Reports summarize stored data only. They are not an admission decision or a probability estimate.
            </p>
        </template>
    </div>
</template>
