<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AdmissionsService from '../../Services/Admissions/AdmissionsService';
import { errorMessage } from '../../Services/Admissions/api';
import PageHeader from '../Admissions/Components/PageHeader.vue';
import MetricCard from '../Admissions/Components/MetricCard.vue';
import StatusBadge from '../Admissions/Components/StatusBadge.vue';
import EmptyState from '../Admissions/Components/EmptyState.vue';

const data = ref<any>(null);
const loading = ref(true);
const busy = ref(false);
const error = ref('');
const notice = ref('');

const load = async () => {
    loading.value = true;
    error.value = '';
    try {
        data.value = await AdmissionsService.dashboard();
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        loading.value = false;
    }
};

onMounted(load);

const completion = computed(() => data.value?.profile_completion?.percentage ?? 0);
const counts = computed(() => data.value?.counts ?? {});

const upcomingCount = computed(() => data.value?.open_calls?.length ?? 0);
const pendingTasks = computed(() => data.value?.tasks?.length ?? 0);

const reassess = async () => {
    busy.value = true;
    notice.value = '';
    try {
        const result = await AdmissionsService.reassess();
        notice.value = `Recalculated ${result.assessed} program matches.`;
        await load();
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        busy.value = false;
    }
};

const completeTask = async (task: any) => {
    await AdmissionsService.updateTask(task.id, {
        title: task.title,
        status: 'done',
    });
    await load();
};

const deadlineClass = (days: number | null) => {
    if (days === null) return 'text-muted';
    if (days <= 14) return 'text-danger fw-semibold';
    if (days <= 45) return 'text-warning fw-semibold';
    return 'text-muted';
};

const formatDate = (value?: string | null) =>
    value
        ? new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
        : '—';
</script>

<template>
    <div>
        <PageHeader
            title="Admission intelligence"
            subtitle="Your own profile, deadlines, scholarships and evidence-based matches — stored in your account only."
        >
            <template #actions>
                <router-link :to="{ name: 'onboarding' }" class="btn btn-sm btn-light">
                    <AppIcon name="user-check" class="me-1" />Profile {{ completion }}%
                </router-link>
                <button type="button" class="btn btn-sm bg-primary text-white" :disabled="busy" @click="reassess">
                    <AppIcon name="refresh" class="me-1" />{{ busy ? 'Recalculating…' : 'Refresh matches' }}
                </button>
            </template>
        </PageHeader>

        <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>
        <div v-if="notice" class="alert alert-success py-2">{{ notice }}</div>

        <div v-if="loading" class="card">
            <div class="card-body text-center py-10">
                <span class="spinner-border text-primary" role="status"></span>
                <p class="text-muted fs-15 mt-3 mb-0">Loading your dashboard…</p>
            </div>
        </div>

        <template v-else-if="data">
            <!-- Profile completion -->
            <div class="card mb-4">
                <div class="card-body d-flex flex-wrap gap-4 align-items-start justify-content-between">
                    <div class="flex-grow-1" style="min-width: 260px">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5 class="card-title mb-0">Profile completion</h5>
                            <span class="fs-15 text-muted">{{ data.profile_completion.completed }} / {{ data.profile_completion.total }} checks</span>
                        </div>
                        <div class="progress" style="height: 8px">
                            <div class="progress-bar bg-primary" :style="{ width: `${completion}%` }"></div>
                        </div>
                        <div v-if="data.profile_completion.missing.length" class="d-flex flex-wrap gap-2 mt-3">
                            <span v-for="item in data.profile_completion.missing" :key="item.step" class="badge bg-warning-subtle text-warning border border-warning-subtle">
                                {{ item.label }}
                            </span>
                        </div>
                        <p v-else class="text-success fs-15 mb-0 mt-3"><AppIcon name="circle-check" class="me-1" />Profile is complete.</p>
                    </div>
                    <div class="text-md-end">
                        <p class="text-muted fs-14 mb-1">Last assessment</p>
                        <p class="fs-15 mb-0">{{ data.meta?.last_assessed_at ? new Date(data.meta.last_assessed_at).toLocaleString() : 'Not calculated yet' }}</p>
                        <p class="text-muted fs-14 mb-0">{{ data.meta?.assessments_total ?? 0 }} programs assessed</p>
                    </div>
                </div>
            </div>

            <!-- Metrics -->
            <div class="row g-4 mb-4">
                <div class="col-sm-6 col-xl-3">
                    <MetricCard label="Likely eligible" :value="counts.likely_eligible ?? 0" hint="Mandatory criteria confirmed" icon="circle-check" tone="success" />
                </div>
                <div class="col-sm-6 col-xl-3">
                    <MetricCard label="Potential matches" :value="counts.potential_match ?? 0" hint="Preference gaps to review" icon="target-arrow" tone="primary" />
                </div>
                <div class="col-sm-6 col-xl-3">
                    <MetricCard label="Need verification" :value="counts.insufficient_evidence ?? 0" hint="Missing official evidence" icon="alert-triangle" tone="warning" />
                </div>
                <div class="col-sm-6 col-xl-3">
                    <MetricCard label="Upcoming deadlines" :value="upcomingCount" :hint="`${pendingTasks} open tasks`" icon="calendar-event" tone="info" />
                </div>
            </div>

            <div class="row g-4">
                <!-- Recommended -->
                <div class="col-xl-8">
                    <div class="card h-100">
                        <div class="card-header d-flex align-items-center justify-content-between">
                            <h5 class="card-title mb-0">Recommended programs</h5>
                            <router-link :to="{ name: 'matches' }" class="link link-custom-primary fs-15">View all matches <AppIcon name="arrow-right" /></router-link>
                        </div>
                        <div class="card-body">
                            <EmptyState
                                v-if="!data.recommended.length"
                                icon="school"
                                title="No matches yet"
                                message="Complete your profile and education, then refresh matches to see evidence-based recommendations."
                            >
                                <router-link :to="{ name: 'onboarding' }" class="btn btn-sm bg-primary text-white">Complete profile</router-link>
                            </EmptyState>

                            <div v-else class="d-flex flex-column gap-3">
                                <div v-for="match in data.recommended" :key="match.id" class="border rounded p-3">
                                    <div class="d-flex flex-wrap gap-2 justify-content-between align-items-start">
                                        <div>
                                            <h6 class="mb-1">{{ match.program?.title }}</h6>
                                            <p class="text-muted fs-15 mb-1">{{ match.program?.university }}<span v-if="match.program?.region"> · {{ match.program.region }}</span></p>
                                            <div class="d-flex flex-wrap align-items-center gap-2">
                                                <StatusBadge :status="match.status" :label="match.status_label" />
                                                <span class="badge bg-light text-body border">Match strength {{ match.score }}%</span>
                                                <span v-if="match.program?.deadline" :class="deadlineClass(match.program?.days_left)" class="fs-14">
                                                    <AppIcon name="calendar-event" class="me-1" />{{ formatDate(match.program.deadline) }}
                                                </span>
                                            </div>
                                        </div>
                                        <router-link :to="{ name: 'programs', query: { program: match.program?.id } }" class="btn btn-sm btn-sub-primary">Open catalog</router-link>
                                    </div>
                                    <p class="text-muted fs-14 mb-0 mt-2"><strong>Next:</strong> {{ match.next_action }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Deadlines + scholarships -->
                <div class="col-xl-4">
                    <div class="card mb-4">
                        <div class="card-header d-flex align-items-center justify-content-between">
                            <h5 class="card-title mb-0">Upcoming deadlines</h5>
                            <router-link :to="{ name: 'programs' }" class="link link-custom-primary fs-15">Catalog</router-link>
                        </div>
                        <div class="card-body">
                            <EmptyState v-if="!data.open_calls.length" icon="calendar-off" title="No open calls" message="No verified deadlines are stored yet." />
                            <div v-else class="d-flex flex-column gap-3">
                                <div v-for="call in data.open_calls" :key="call.id">
                                    <div class="d-flex justify-content-between gap-2">
                                        <div class="min-w-0">
                                            <p class="mb-0 fs-15 fw-medium text-truncate">{{ call.program }}</p>
                                            <p class="text-muted fs-14 mb-0 text-truncate">{{ call.university }}</p>
                                        </div>
                                        <span class="fs-14 text-nowrap" :class="deadlineClass(call.days_left)">
                                            {{ call.days_left }}d
                                        </span>
                                    </div>
                                    <p class="text-muted fs-14 mb-0">{{ formatDate(call.deadline) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header d-flex align-items-center justify-content-between">
                            <h5 class="card-title mb-0">Scholarships</h5>
                            <router-link :to="{ name: 'scholarships' }" class="link link-custom-primary fs-15">All</router-link>
                        </div>
                        <div class="card-body">
                            <EmptyState v-if="!data.scholarships.length" icon="award" title="No scholarships" message="Tracked scholarship calls will appear here." />
                            <div v-else class="d-flex flex-column gap-3">
                                <div v-for="scholarship in data.scholarships" :key="scholarship.id">
                                    <p class="mb-0 fs-15 fw-medium">{{ scholarship.name }}</p>
                                    <p class="text-muted fs-14 mb-0">{{ scholarship.provider }}</p>
                                    <p class="text-muted fs-14 mb-0">
                                        <span v-if="scholarship.next_call?.deadline">Deadline {{ formatDate(scholarship.next_call.deadline) }}</span>
                                        <span v-else>Deadline not stored</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-4 mt-0">
                <!-- Applications -->
                <div class="col-xl-7">
                    <div class="card h-100">
                        <div class="card-header d-flex align-items-center justify-content-between">
                            <h5 class="card-title mb-0">My applications</h5>
                            <router-link :to="{ name: 'applications' }" class="link link-custom-primary fs-15">Manage</router-link>
                        </div>
                        <div class="card-body p-0">
                            <EmptyState v-if="!data.applications.length" icon="files" title="No applications" message="Start tracking an application from the program catalog." />
                            <div v-else class="table-responsive">
                                <table class="table align-middle mb-0">
                                    <thead class="border-bottom">
                                        <tr>
                                            <th class="text-muted fw-medium">Program</th>
                                            <th class="text-muted fw-medium">Status</th>
                                            <th class="text-muted fw-medium">Documents</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="application in data.applications" :key="application.id">
                                            <td>
                                                <p class="mb-0 fw-medium">{{ application.program?.title }}</p>
                                                <p class="text-muted fs-14 mb-0">{{ application.program?.university?.name }}</p>
                                            </td>
                                            <td><StatusBadge :status="application.status" /></td>
                                            <td class="text-muted fs-15">{{ application.documents_count ?? 0 }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tasks -->
                <div class="col-xl-5">
                    <div class="card h-100">
                        <div class="card-header d-flex align-items-center justify-content-between">
                            <h5 class="card-title mb-0">Next actions</h5>
                            <router-link :to="{ name: 'tasks' }" class="link link-custom-primary fs-15">All tasks</router-link>
                        </div>
                        <div class="card-body">
                            <EmptyState v-if="!data.tasks.length" icon="checks" title="No open tasks" message="Add tasks to keep document preparation on track." />
                            <div v-else class="d-flex flex-column gap-3">
                                <label v-for="task in data.tasks" :key="task.id" class="d-flex gap-2 align-items-start mb-0">
                                    <input type="checkbox" class="form-check-input mt-1" @change="completeTask(task)" />
                                    <span class="min-w-0">
                                        <span class="d-block fs-15 fw-medium">{{ task.title }}</span>
                                        <span class="d-block text-muted fs-14">
                                            {{ task.due_date ? formatDate(task.due_date) : 'No due date' }}
                                            · {{ task.priority }} priority
                                        </span>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-4 mt-0">
                <div class="col-lg-4">
                    <div class="card h-100">
                        <div class="card-header"><h5 class="card-title mb-0">Bookmarks</h5></div>
                        <div class="card-body">
                            <EmptyState v-if="!data.bookmarks.length" icon="bookmark" title="Nothing bookmarked" message="Save programs you want to revisit." />
                            <div v-else class="d-flex flex-column gap-2">
                                <div v-for="bookmark in data.bookmarks" :key="bookmark.id" class="border-bottom pb-2">
                                    <p class="mb-0 fs-15 fw-medium">{{ bookmark.title }}</p>
                                    <p class="text-muted fs-14 mb-0">{{ bookmark.university }} · {{ bookmark.subject_area }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="card h-100">
                        <div class="card-header"><h5 class="card-title mb-0">Recent source checks</h5></div>
                        <div class="card-body">
                            <EmptyState v-if="!data.recent_changes.length" icon="world" title="No monitoring runs" message="Official-source checks will be logged here." />
                            <div v-else class="d-flex flex-column gap-2">
                                <div v-for="change in data.recent_changes" :key="`${change.source}-${change.captured_at}`" class="border-bottom pb-2">
                                    <p class="mb-0 fs-15 fw-medium">{{ change.source }}</p>
                                    <p class="text-muted fs-14 mb-0">
                                        HTTP {{ change.http_status ?? '—' }} · {{ change.captured_at ? new Date(change.captured_at).toLocaleString() : '—' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="card h-100">
                        <div class="card-header d-flex align-items-center justify-content-between">
                            <h5 class="card-title mb-0">Latest report</h5>
                            <router-link :to="{ name: 'reports' }" class="link link-custom-primary fs-15">Reports</router-link>
                        </div>
                        <div class="card-body">
                            <EmptyState v-if="!data.latest_report" icon="report" title="No report yet" message="Generate a personalized report from the reports page." />
                            <div v-else>
                                <p class="text-muted fs-14 mb-1">{{ formatDate(data.latest_report.report_date) }}</p>
                                <p class="fs-15 mb-0">{{ data.latest_report.summary }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <p class="text-muted fs-14 mt-4 mb-0">
                Match strength measures how many published criteria you satisfy. It is <strong>not</strong> a probability of admission.
            </p>
        </template>
    </div>
</template>
