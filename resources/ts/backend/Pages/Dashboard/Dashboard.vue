<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AdmissionsService from '../../Services/Admissions/AdmissionsService';
import { errorMessage } from '../../Services/Admissions/api';
import PageHeader from '../Admissions/Components/PageHeader.vue';
import MetricCard from '../Admissions/Components/MetricCard.vue';
import StatusBadge from '../Admissions/Components/StatusBadge.vue';
import EmptyState from '../Admissions/Components/EmptyState.vue';
import { useGlobal } from '../../../shared/composables/useGlobal';

const { user } = useGlobal();

const data = ref<any>(null);
const loading = ref(true);
const busy = ref(false);
const error = ref('');
const notice = ref('');
const completingTask = ref<number | null>(null);
const syncingSources = ref(false);

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

const syncSources = async () => {
    if (syncingSources.value) return;

    syncingSources.value = true;
    error.value = '';

    try {
        const result = await AdmissionsService.syncCatalog();
        const checked = Number(result.checked ?? 0);
        const ok = Number(result.ok ?? 0);
        const failed = Number(result.failed ?? 0);
        const remaining = Number(result.remaining ?? 0);

        const parts = [`Checked ${checked} source${checked === 1 ? '' : 's'}`, `${ok} reachable`];
        if (failed) parts.push(`${failed} failed`);
        if (remaining) parts.push(`${remaining} still queued — run sync again`);

        notice.value = `${parts.join(' · ')}.`;
        await load();
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        syncingSources.value = false;
    }
};

const completion = computed(() => data.value?.profile_completion?.percentage ?? 0);
const counts = computed(() => data.value?.counts ?? {});
const firstName = computed(() => (user.value?.name ?? 'there').split(/\s+/)[0]);
const upcomingCount = computed(() => data.value?.open_calls?.length ?? 0);
const pendingTasks = computed(() => data.value?.tasks?.length ?? 0);
const applicationCount = computed(() => data.value?.applications?.length ?? 0);

const greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
});

const summaryLine = computed(() => {
    const matches = (counts.value.likely_eligible ?? 0) + (counts.value.potential_match ?? 0);
    const parts = [
        `${matches} evidence-based ${matches === 1 ? 'match' : 'matches'}`,
        `${upcomingCount.value} upcoming ${upcomingCount.value === 1 ? 'deadline' : 'deadlines'}`,
        `${pendingTasks.value} open ${pendingTasks.value === 1 ? 'task' : 'tasks'}`,
    ];

    return parts.join(' · ');
});

const reassess = async () => {
    busy.value = true;
    notice.value = '';
    error.value = '';

    try {
        const result = await AdmissionsService.reassess();
        notice.value = `Recalculated ${result.assessed} program ${result.assessed === 1 ? 'match' : 'matches'}.`;
        await load();
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        busy.value = false;
    }
};

const completeTask = async (task: any) => {
    if (completingTask.value) return;

    completingTask.value = task.id;

    try {
        await AdmissionsService.updateTask(task.id, {
            title: task.title,
            status: 'done',
        });

        if (data.value?.tasks) {
            data.value.tasks = data.value.tasks.filter((item: any) => item.id !== task.id);
        }
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        completingTask.value = null;
    }
};

const formatDate = (value?: string | null) =>
    value
        ? new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString(undefined, {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
          })
        : '—';

const formatDateTime = (value?: string | null) => (value ? new Date(value).toLocaleString() : '—');

const daysLabel = (days: number | null) => {
    if (days === null || days === undefined) return 'TBC';
    if (days <= 0) return 'Today';
    if (days === 1) return '1 day left';

    return `${days} days left`;
};

const deadlineTone = (days: number | null) => {
    if (days === null || days === undefined) return 'chip-warning';
    if (days <= 14) return 'chip-warning';

    return '';
};

const isOverdue = (task: any) => {
    if (!task?.due_date) return false;
    const due = new Date(`${String(task.due_date).slice(0, 10)}T23:59:59`);

    return due.getTime() < Date.now();
};

const priorityTone = (priority: string) => {
    switch (priority) {
        case 'high':
            return 'bg-danger-subtle text-danger border-danger-subtle';
        case 'medium':
            return 'bg-warning-subtle text-warning border-warning-subtle';
        default:
            return 'bg-secondary-subtle text-secondary border-secondary-subtle';
    }
};

const institutionInitials = (name?: string) =>
    (name ?? 'University')
        .split(/\s+/)
        .filter((part) => !['of', 'the', 'and', 'for'].includes(part.toLowerCase()))
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
</script>

<template>
    <div>
        <PageHeader
            title="Dashboard"
            subtitle="Your admission command centre — deadlines, matches and the next best action."
        >
            <template #actions>
                <router-link :to="{ name: 'profile' }" class="btn btn-sm btn-light">
                    <AppIcon name="user-check" class="me-1" />Profile {{ completion }}%
                </router-link>
                <button type="button" class="btn btn-sm btn-primary text-nowrap" :disabled="busy" @click="reassess">
                    <span v-if="busy" class="spinner-border spinner-border-sm me-1" role="status"></span>
                    <AppIcon v-else name="refresh" class="me-1" />{{ busy ? 'Recalculating…' : 'Refresh matches' }}
                </button>
            </template>
        </PageHeader>

        <div v-if="error" class="alert alert-danger py-2 d-flex align-items-start gap-2">
            <AppIcon name="alert-triangle" class="mt-1" />
            <span class="flex-grow-1">{{ error }}</span>
            <button type="button" class="btn-close" aria-label="Dismiss" @click="error = ''"></button>
        </div>
        <div v-if="notice" class="alert alert-success py-2 d-flex align-items-start gap-2">
            <AppIcon name="circle-check" class="mt-1" />
            <span class="flex-grow-1">{{ notice }}</span>
            <button type="button" class="btn-close" aria-label="Dismiss" @click="notice = ''"></button>
        </div>

        <div v-if="loading" class="card">
            <div class="card-body py-5">
                <div class="placeholder-glow mb-4">
                    <span class="placeholder col-4 d-block mb-2" style="height: 20px"></span>
                    <span class="placeholder col-7 d-block" style="height: 14px"></span>
                </div>
                <div class="row g-4">
                    <div v-for="index in 4" :key="index" class="col-sm-6 col-xl-3">
                        <span class="placeholder col-12 d-block" style="height: 92px"></span>
                    </div>
                </div>
            </div>
        </div>

        <template v-else-if="data">
            <!-- Welcome / completion -->
            <section class="app-hero card mb-4">
                <div class="card-body">
                    <div class="d-flex flex-wrap align-items-center justify-content-between gap-4">
                        <div class="min-w-0">
                            <span class="chip mb-3">
                                <AppIcon name="sparkles" :size="13" />Admission intelligence
                            </span>
                            <h4 class="mb-2">{{ greeting }}, {{ firstName }}.</h4>
                            <p class="text-muted mb-3">{{ summaryLine }}</p>

                            <div class="d-flex flex-wrap gap-2">
                                <router-link :to="{ name: 'programs' }" class="btn btn-sm btn-primary">
                                    <AppIcon name="graduation-cap" class="me-1" />Browse catalog
                                </router-link>
                                <router-link :to="{ name: 'applications' }" class="btn btn-sm btn-light">
                                    <AppIcon name="files" class="me-1" />Applications
                                    <span v-if="applicationCount" class="badge bg-primary-subtle text-primary ms-1">{{ applicationCount }}</span>
                                </router-link>
                                <router-link :to="{ name: 'documents' }" class="btn btn-sm btn-light">
                                    <AppIcon name="file-text" class="me-1" />Documents
                                </router-link>
                                <router-link :to="{ name: 'reports' }" class="btn btn-sm btn-light">
                                    <AppIcon name="report" class="me-1" />Reports
                                </router-link>
                            </div>
                        </div>

                        <div class="d-flex align-items-center gap-4 flex-shrink-0">
                            <div
                                class="app-ring"
                                :style="{ background: `conic-gradient(#4f46e5 ${completion * 3.6}deg, rgba(148, 163, 184, 0.22) 0deg)` }"
                                role="img"
                                :aria-label="`Profile ${completion}% complete`"
                            >
                                <span class="app-ring-inner">
                                    <strong>{{ completion }}%</strong>
                                    <small>profile</small>
                                </span>
                            </div>
                            <div style="max-width: 230px">
                                <p class="text-muted fs-14 mb-2">Profile completion</p>
                                <div v-if="data.profile_completion.missing.length" class="d-flex flex-wrap gap-1">
                                    <router-link
                                        v-for="item in data.profile_completion.missing.slice(0, 3)"
                                        :key="item.step"
                                        :to="{ name: 'onboarding' }"
                                        class="chip chip-warning text-decoration-none"
                                    >
                                        {{ item.label }}
                                    </router-link>
                                    <span v-if="data.profile_completion.missing.length > 3" class="chip">
                                        +{{ data.profile_completion.missing.length - 3 }} more
                                    </span>
                                </div>
                                <p v-else class="text-success fs-14 mb-0">
                                    <AppIcon name="circle-check" class="me-1" />All admission checks complete.
                                </p>
                                <router-link :to="{ name: 'onboarding' }" class="link link-custom-primary fs-14 d-inline-flex align-items-center gap-1 mt-2">
                                    Finish onboarding <AppIcon name="arrow-right" :size="13" />
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Metrics -->
            <div class="row g-4 mb-4">
                <div class="col-sm-6 col-xl-3">
                    <router-link :to="{ name: 'matches' }" class="text-decoration-none d-block h-100">
                        <MetricCard label="Likely eligible" :value="counts.likely_eligible ?? 0" hint="Mandatory criteria confirmed" icon="circle-check" tone="success" />
                    </router-link>
                </div>
                <div class="col-sm-6 col-xl-3">
                    <router-link :to="{ name: 'matches' }" class="text-decoration-none d-block h-100">
                        <MetricCard label="Potential matches" :value="counts.potential_match ?? 0" hint="Preference gaps to review" icon="target-arrow" tone="primary" />
                    </router-link>
                </div>
                <div class="col-sm-6 col-xl-3">
                    <router-link :to="{ name: 'programs', query: { verified: '1' } }" class="text-decoration-none d-block h-100">
                        <MetricCard label="Need verification" :value="counts.insufficient_evidence ?? 0" hint="Missing official evidence" icon="alert-triangle" tone="warning" />
                    </router-link>
                </div>
                <div class="col-sm-6 col-xl-3">
                    <router-link :to="{ name: 'programs' }" class="text-decoration-none d-block h-100">
                        <MetricCard label="Upcoming deadlines" :value="upcomingCount" :hint="`${pendingTasks} open tasks`" icon="calendar-event" tone="info" />
                    </router-link>
                </div>
            </div>

            <div class="row g-4">
                <!-- Recommended -->
                <div class="col-xl-8">
                    <div class="card h-100">
                        <div class="card-header d-flex align-items-center justify-content-between">
                            <div>
                                <h5 class="card-title mb-0">Recommended programs</h5>
                                <p class="text-muted fs-14 mb-0">Ranked by published criteria you satisfy.</p>
                            </div>
                            <router-link :to="{ name: 'matches' }" class="link link-custom-primary fs-15 text-nowrap">
                                All matches <AppIcon name="arrow-right" :size="14" />
                            </router-link>
                        </div>
                        <div class="card-body">
                            <EmptyState
                                v-if="!data.recommended.length"
                                icon="school"
                                title="No matches yet"
                                message="Complete your profile and education, then refresh matches to see evidence-based recommendations."
                            >
                                <router-link :to="{ name: 'onboarding' }" class="btn btn-sm btn-primary">Complete profile</router-link>
                            </EmptyState>

                            <div v-else class="d-flex flex-column gap-2">
                                <router-link
                                    v-for="match in data.recommended"
                                    :key="match.id"
                                    :to="{ name: 'program', params: { id: match.program?.id } }"
                                    class="app-program-row text-body text-decoration-none"
                                >
                                    <span class="app-program-logo">{{ institutionInitials(match.program?.university) }}</span>

                                    <div class="flex-grow-1 min-w-0">
                                        <div class="d-flex flex-wrap align-items-start justify-content-between gap-2">
                                            <div class="min-w-0">
                                                <p class="fw-semibold mb-1 text-truncate">{{ match.program?.title }}</p>
                                                <p class="text-muted fs-14 mb-2 text-truncate">
                                                    {{ match.program?.university }}<span v-if="match.program?.region"> · {{ match.program.region }}</span>
                                                </p>
                                            </div>
                                            <span class="chip"><AppIcon name="target-arrow" :size="12" />{{ match.score }}% match</span>
                                        </div>

                                        <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                                            <StatusBadge :status="match.status" :label="match.status_label" />
                                            <span v-if="match.program?.deadline" class="chip" :class="deadlineTone(match.program?.days_left)">
                                                <AppIcon name="calendar-event" :size="12" />{{ formatDate(match.program.deadline) }}
                                            </span>
                                            <span class="chip"><AppIcon name="list-check" :size="12" />{{ match.matching_count }} met · {{ match.unknown_count }} unknown</span>
                                        </div>

                                        <div class="progress app-score" style="height: 5px">
                                            <div class="progress-bar bg-primary" :style="{ width: `${match.score}%` }"></div>
                                        </div>

                                        <p class="text-muted fs-14 mb-0 mt-2 text-truncate"><strong class="text-body">Next:</strong> {{ match.next_action }}</p>
                                    </div>

                                    <AppIcon name="chevron-right" :size="18" class="text-muted align-self-center" />
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Deadlines + scholarships -->
                <div class="col-xl-4">
                    <div class="card mb-4">
                        <div class="card-header d-flex align-items-center justify-content-between">
                            <div>
                                <h5 class="card-title mb-0">Upcoming deadlines</h5>
                                <p class="text-muted fs-14 mb-0">Catalog-wide verified calls</p>
                            </div>
                            <router-link :to="{ name: 'programs' }" class="link link-custom-primary fs-15">Catalog</router-link>
                        </div>
                        <div class="card-body">
                            <EmptyState v-if="!data.open_calls.length" icon="calendar-off" title="No open calls" message="No verified deadlines are stored yet." />

                            <div v-else class="d-flex flex-column gap-1">
                                <router-link
                                    v-for="call in data.open_calls"
                                    :key="call.id"
                                    :to="{ name: 'program', params: { id: call.program_id } }"
                                    class="app-deadline-row text-body text-decoration-none"
                                >
                                    <div class="flex-grow-1 min-w-0">
                                        <p class="mb-0 fs-15 fw-medium text-truncate">{{ call.program }}</p>
                                        <p class="text-muted fs-14 mb-1 text-truncate">{{ call.university }}</p>
                                        <span class="text-muted fs-13">{{ formatDate(call.deadline) }}</span>
                                    </div>
                                    <span class="chip flex-shrink-0" :class="deadlineTone(call.days_left)">{{ daysLabel(call.days_left) }}</span>
                                </router-link>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header d-flex align-items-center justify-content-between">
                            <div>
                                <h5 class="card-title mb-0">Scholarships</h5>
                                <p class="text-muted fs-14 mb-0">Funding calls with open deadlines</p>
                            </div>
                            <router-link :to="{ name: 'scholarships' }" class="link link-custom-primary fs-15">All</router-link>
                        </div>
                        <div class="card-body">
                            <EmptyState v-if="!data.scholarships.length" icon="award" title="No scholarships" message="Tracked scholarship calls will appear here." />

                            <div v-else class="d-flex flex-column gap-2">
                                <router-link
                                    v-for="scholarship in data.scholarships"
                                    :key="scholarship.id"
                                    :to="{ name: 'scholarships' }"
                                    class="app-deadline-row text-body text-decoration-none"
                                >
                                    <div class="flex-grow-1 min-w-0">
                                        <p class="mb-0 fs-15 fw-medium text-truncate">{{ scholarship.name }}</p>
                                        <p class="text-muted fs-14 mb-1 text-truncate">{{ scholarship.provider }}</p>
                                        <span class="text-muted fs-13">
                                            {{ scholarship.next_call?.deadline ? formatDate(scholarship.next_call.deadline) : 'Deadline not stored' }}
                                        </span>
                                    </div>
                                    <span class="chip flex-shrink-0" :class="scholarship.next_call?.deadline ? '' : 'chip-warning'">
                                        <AppIcon name="award" :size="12" />{{ scholarship.next_call?.deadline ? 'Open' : 'TBC' }}
                                    </span>
                                </router-link>
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
                            <div>
                                <h5 class="card-title mb-0">My applications</h5>
                                <p class="text-muted fs-14 mb-0">{{ applicationCount }} in progress</p>
                            </div>
                            <router-link :to="{ name: 'applications' }" class="link link-custom-primary fs-15">Manage</router-link>
                        </div>
                        <div class="card-body p-0">
                            <EmptyState v-if="!data.applications.length" icon="files" title="No applications" message="Start tracking an application from the program catalog.">
                                <router-link :to="{ name: 'programs' }" class="btn btn-sm btn-primary">Find a program</router-link>
                            </EmptyState>

                            <div v-else class="d-flex flex-column">
                                <router-link
                                    v-for="application in data.applications"
                                    :key="application.id"
                                    :to="{ name: 'applications' }"
                                    class="app-application-row text-body text-decoration-none"
                                >
                                    <span class="app-program-logo app-program-logo-sm">{{ institutionInitials(application.program?.university?.name) }}</span>
                                    <div class="flex-grow-1 min-w-0">
                                        <p class="fw-medium mb-0 text-truncate">{{ application.program?.title }}</p>
                                        <p class="text-muted fs-14 mb-0 text-truncate">{{ application.program?.university?.name }}</p>
                                    </div>
                                    <div class="d-flex align-items-center gap-2 flex-shrink-0">
                                        <StatusBadge :status="application.status" />
                                        <span class="chip d-none d-sm-inline-flex"><AppIcon name="files" :size="12" />{{ application.documents_count ?? 0 }}</span>
                                        <AppIcon name="chevron-right" :size="16" class="text-muted" />
                                    </div>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tasks -->
                <div class="col-xl-5">
                    <div class="card h-100">
                        <div class="card-header d-flex align-items-center justify-content-between">
                            <div>
                                <h5 class="card-title mb-0">Next actions</h5>
                                <p class="text-muted fs-14 mb-0">{{ pendingTasks }} open tasks</p>
                            </div>
                            <router-link :to="{ name: 'tasks' }" class="link link-custom-primary fs-15">All tasks</router-link>
                        </div>
                        <div class="card-body">
                            <EmptyState v-if="!data.tasks.length" icon="checks" title="No open tasks" message="Add tasks to keep document preparation on track.">
                                <router-link :to="{ name: 'tasks' }" class="btn btn-sm btn-primary">Add a task</router-link>
                            </EmptyState>

                            <div v-else class="d-flex flex-column gap-2">
                                <label v-for="task in data.tasks" :key="task.id" class="app-task">
                                    <input
                                        type="checkbox"
                                        class="form-check-input mt-1 flex-shrink-0"
                                        :disabled="completingTask === task.id"
                                        @change="completeTask(task)"
                                    />
                                    <span class="flex-grow-1 min-w-0">
                                        <span class="d-block fs-15 fw-medium">{{ task.title }}</span>
                                        <span class="d-flex flex-wrap align-items-center gap-2 mt-1">
                                            <span class="fs-14" :class="isOverdue(task) ? 'text-danger fw-semibold' : 'text-muted'">
                                                <AppIcon name="calendar" :size="12" class="me-1" />{{ task.due_date ? formatDate(task.due_date) : 'No due date' }}
                                            </span>
                                            <span class="badge border text-capitalize" :class="priorityTone(task.priority)">{{ task.priority }}</span>
                                            <span v-if="isOverdue(task)" class="badge bg-danger-subtle text-danger border border-danger-subtle">Overdue</span>
                                        </span>
                                    </span>
                                    <span v-if="completingTask === task.id" class="spinner-border spinner-border-sm text-primary" role="status"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-4 mt-0">
                <div class="col-lg-4">
                    <div class="card h-100">
                        <div class="card-header d-flex align-items-center justify-content-between">
                            <h5 class="card-title mb-0">Bookmarks</h5>
                            <router-link :to="{ name: 'matches' }" class="link link-custom-primary fs-14">Matches</router-link>
                        </div>
                        <div class="card-body">
                            <EmptyState v-if="!data.bookmarks.length" icon="bookmark" title="Nothing bookmarked" message="Save programs you want to revisit." />

                            <div v-else class="d-flex flex-column gap-2">
                                <router-link
                                    v-for="bookmark in data.bookmarks"
                                    :key="bookmark.id"
                                    :to="{ name: 'program', params: { id: bookmark.id } }"
                                    class="app-compact-row text-body text-decoration-none"
                                >
                                    <span class="flex-grow-1 min-w-0">
                                        <span class="d-block fs-15 fw-medium text-truncate">{{ bookmark.title }}</span>
                                        <span class="d-block text-muted fs-14 text-truncate">{{ bookmark.university }} · {{ bookmark.subject_area }}</span>
                                    </span>
                                    <StatusBadge v-if="bookmark.assessment" :status="bookmark.assessment" />
                                    <AppIcon v-else name="chevron-right" :size="15" class="text-muted" />
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="card h-100">
                        <div class="card-header d-flex align-items-center justify-content-between">
                            <h5 class="card-title mb-0">Recent documents</h5>
                            <router-link :to="{ name: 'documents' }" class="link link-custom-primary fs-14">All files</router-link>
                        </div>
                        <div class="card-body">
                            <EmptyState v-if="!data.documents.length" icon="file-text" title="No documents" message="Upload transcripts, test scores and references." />

                            <div v-else class="d-flex flex-column gap-2">
                                <router-link
                                    v-for="document in data.documents"
                                    :key="document.id"
                                    :to="{ name: 'documents' }"
                                    class="app-compact-row text-body text-decoration-none"
                                >
                                    <span class="avatar rounded bg-info-subtle text-info flex-shrink-0" style="width: 32px; height: 32px">
                                        <AppIcon name="file-text" :size="15" />
                                    </span>
                                    <span class="flex-grow-1 min-w-0">
                                        <span class="d-block fs-15 fw-medium text-truncate">{{ document.name ?? document.original_name }}</span>
                                        <span class="d-block text-muted fs-14 text-capitalize">{{ document.type }} · {{ formatDateTime(document.created_at) }}</span>
                                    </span>
                                    <StatusBadge v-if="document.status" :status="document.status" />
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="card h-100">
                        <div class="card-header d-flex align-items-center justify-content-between">
                            <h5 class="card-title mb-0">Latest report</h5>
                            <router-link :to="{ name: 'reports' }" class="link link-custom-primary fs-14">Reports</router-link>
                        </div>
                        <div class="card-body">
                            <EmptyState v-if="!data.latest_report" icon="report" title="No report yet" message="Generate a personalised report from the reports page.">
                                <router-link :to="{ name: 'reports' }" class="btn btn-sm btn-primary">Generate report</router-link>
                            </EmptyState>

                            <div v-else>
                                <div class="d-flex align-items-center gap-2 mb-2">
                                    <span class="avatar rounded bg-primary-subtle text-primary" style="width: 32px; height: 32px">
                                        <AppIcon name="report" :size="15" />
                                    </span>
                                    <div>
                                        <p class="fw-medium mb-0">{{ formatDate(data.latest_report.report_date) }}</p>
                                        <p class="text-muted fs-14 mb-0">Daily admission briefing</p>
                                    </div>
                                </div>
                                <p class="fs-15 mb-3">{{ data.latest_report.summary }}</p>
                                <router-link :to="{ name: 'reports' }" class="btn btn-sm btn-light w-100">
                                    Open reports <AppIcon name="arrow-right" :size="14" class="ms-1" />
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Source monitoring -->
            <div class="card mt-4">
                <div class="card-body py-3">
                    <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-2">
                        <div class="d-flex align-items-center gap-2">
                            <span class="avatar rounded bg-success-subtle text-success" style="width: 32px; height: 32px">
                                <AppIcon name="globe" :size="15" />
                            </span>
                            <div>
                                <p class="fw-medium mb-0">Official source checks</p>
                                <p class="text-muted fs-14 mb-0">Recent monitoring runs behind your confirmed facts.</p>
                            </div>
                        </div>
                        <div class="d-flex flex-wrap align-items-center gap-2">
                            <span class="chip chip-success"><AppIcon name="shield-check" :size="12" />Verified-first catalog</span>
                            <button
                                type="button"
                                class="btn btn-sm btn-light"
                                :disabled="syncingSources"
                                @click="syncSources"
                            >
                                <span v-if="syncingSources" class="spinner-border spinner-border-sm me-1" role="status"></span>
                                <AppIcon v-else name="refresh" class="me-1" />
                                {{ syncingSources ? 'Checking…' : 'Sync sources' }}
                            </button>
                        </div>
                    </div>

                    <div v-if="data.recent_changes.length" class="d-flex flex-wrap gap-2">
                        <a
                            v-for="change in data.recent_changes"
                            :key="`${change.source}-${change.captured_at}`"
                            :href="change.url ?? undefined"
                            target="_blank"
                            rel="noopener"
                            class="chip text-decoration-none"
                        >
                            <AppIcon name="external-link" :size="12" />{{ change.source ?? 'Source' }}
                            <span class="fw-normal">HTTP {{ change.http_status ?? '—' }}</span>
                            <span v-if="change.changed" class="badge bg-warning-subtle text-warning border border-warning-subtle">changed</span>
                        </a>
                    </div>
                    <p v-else class="text-muted fs-14 mb-0">
                        No source check has been recorded yet. Run a sync to fetch the latest status from the official pages.
                    </p>
                </div>
            </div>

            <div class="d-flex flex-wrap align-items-start gap-2 text-muted fs-14 mt-4 mb-0">
                <AppIcon name="info-circle" :size="15" class="mt-1" />
                <p class="mb-0">
                    Match strength measures how many published criteria you satisfy. It is <strong>not</strong> a probability of admission.
                    Always confirm requirements and deadlines on the official university page.
                </p>
            </div>
        </template>
    </div>
</template>

<style scoped>
.app-hero {
    background:
        radial-gradient(120% 160% at 100% 0%, rgba(79, 70, 229, 0.12) 0%, rgba(79, 70, 229, 0) 55%),
        radial-gradient(100% 140% at 0% 100%, rgba(14, 165, 233, 0.1) 0%, rgba(14, 165, 233, 0) 60%),
        var(--dx-card-bg, #fff);
    border-color: rgba(79, 70, 229, 0.16);
}

.app-ring {
    width: 104px;
    height: 104px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    flex-shrink: 0;
}

.app-ring-inner {
    width: 82px;
    height: 82px;
    border-radius: 50%;
    background: var(--dx-card-bg, #fff);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    line-height: 1.1;
}

.app-ring-inner strong {
    font-size: 22px;
    color: var(--dx-heading-color);
}

.app-ring-inner small {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--dx-secondary-color);
}

.app-program-row {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 14px;
    border: 1px solid var(--dx-border-color);
    border-radius: 14px;
    transition:
        border-color 0.15s ease,
        background-color 0.15s ease,
        transform 0.15s ease;
}

.app-program-row:hover {
    border-color: rgba(79, 70, 229, 0.35);
    background: rgba(79, 70, 229, 0.03);
    transform: translateY(-1px);
}

.app-program-logo {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(79, 70, 229, 0.1);
    color: #4338ca;
    font-size: 13px;
    font-weight: 700;
    flex-shrink: 0;
}

.app-program-logo-sm {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    font-size: 11px;
}

.app-score {
    max-width: 240px;
    border-radius: 999px;
    background: rgba(148, 163, 184, 0.18);
}

.app-deadline-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid var(--dx-border-color);
}

.app-deadline-row:last-child {
    border-bottom: 0;
    padding-bottom: 0;
}

.app-deadline-row:hover p {
    color: var(--dx-link-color);
}

.app-application-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    border-bottom: 1px solid var(--dx-border-color);
}

.app-application-row:last-child {
    border-bottom: 0;
}

.app-application-row:hover {
    background: rgba(79, 70, 229, 0.03);
}

.app-task {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid var(--dx-border-color);
    cursor: pointer;
}

.app-task:last-child {
    border-bottom: 0;
    padding-bottom: 0;
}

.app-compact-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 0;
    border-bottom: 1px solid var(--dx-border-color);
}

.app-compact-row:last-child {
    border-bottom: 0;
    padding-bottom: 0;
}

[data-bs-theme='dark'] .app-hero {
    background:
        radial-gradient(120% 160% at 100% 0%, rgba(129, 140, 248, 0.14) 0%, rgba(129, 140, 248, 0) 55%),
        radial-gradient(100% 140% at 0% 100%, rgba(56, 189, 248, 0.1) 0%, rgba(56, 189, 248, 0) 60%),
        var(--dx-card-bg, #0f172a);
}

[data-bs-theme='dark'] .app-ring-inner {
    background: #0f172a;
}

[data-bs-theme='dark'] .app-program-logo {
    background: rgba(129, 140, 248, 0.16);
    color: #c7d2fe;
}
</style>
