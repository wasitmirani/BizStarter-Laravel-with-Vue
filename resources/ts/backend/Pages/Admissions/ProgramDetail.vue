<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AdmissionsService from '../../Services/Admissions/AdmissionsService';
import { errorMessage } from '../../Services/Admissions/api';
import AssessmentDetails from './Components/AssessmentDetails.vue';
import EmptyState from './Components/EmptyState.vue';
import SourceBadge from './Components/SourceBadge.vue';
import StatusBadge from './Components/StatusBadge.vue';

const route = useRoute();
const router = useRouter();

const program = ref<any>(null);
const related = ref<any[]>([]);
const loading = ref(true);
const error = ref('');
const bookmarking = ref(false);

const load = async () => {
    loading.value = true;
    error.value = '';

    try {
        const result = await AdmissionsService.program(Number(route.params.id));
        program.value = result.program ?? null;
        related.value = result.related ?? [];
    } catch (exception: any) {
        error.value = errorMessage(exception);
        program.value = null;
        related.value = [];
    } finally {
        loading.value = false;
    }
};

onMounted(load);
watch(() => route.params.id, load);

const formatDate = (value?: string | null) => {
    if (!value) return '';
    const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
    if (Number.isNaN(date.getTime())) return '';

    return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
};

const deadlineState = computed(() => {
    const call = program.value?.next_call;
    if (!call) return { tone: 'muted', label: 'No open call stored' };
    if (!call.deadline) return { tone: 'warning', label: 'Deadline to be confirmed' };

    return { tone: 'default', label: formatDate(call.deadline) };
});

const requirementRows = computed(() => [
    {
        label: 'Degree level',
        value: program.value?.requirements?.required_degree_level ?? 'Not published',
        known: !!program.value?.requirements?.required_degree_level,
    },
    {
        label: 'Minimum grade',
        value: program.value?.requirements?.minimum_grade_percentage
            ? `${program.value.requirements.minimum_grade_percentage}%`
            : 'Not published',
        known: !!program.value?.requirements?.minimum_grade_percentage,
    },
    {
        label: 'Prerequisite subjects',
        value: program.value?.requirements?.required_subjects?.join(', ') || 'Not published',
        known: !!program.value?.requirements?.required_subjects?.length,
    },
    {
        label: 'Language test',
        value: program.value?.requirements?.required_language_test
            ? `${String(program.value.requirements.required_language_test).toUpperCase()} ${
                  program.value.requirements.minimum_language_score ?? ''
              }`.trim()
            : 'Not published',
        known: !!program.value?.requirements?.required_language_test,
    },
    {
        label: 'Work experience',
        value: program.value?.requirements?.minimum_work_experience_months
            ? `${program.value.requirements.minimum_work_experience_months} months`
            : 'Not required',
        known: true,
    },
]);

const toggleBookmark = async () => {
    if (!program.value || bookmarking.value) return;
    bookmarking.value = true;

    try {
        if (program.value.bookmarked) {
            await AdmissionsService.removeBookmark(program.value.id);
        } else {
            await AdmissionsService.bookmark(program.value.id);
        }
        program.value.bookmarked = !program.value.bookmarked;
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        bookmarking.value = false;
    }
};

const startApplication = () => {
    if (program.value) router.push({ name: 'applications', query: { program: program.value.id } });
};

const openRelated = (item: any) => router.push({ name: 'program', params: { id: item.id } });
</script>

<template>
    <div>
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
            <router-link :to="{ name: 'programs' }" class="btn btn-sm btn-light">
                <AppIcon name="arrow-left" class="me-1" />All programs
            </router-link>
            <div class="d-flex flex-wrap gap-2">
                <router-link
                    v-if="program?.university"
                    :to="{ name: 'university', params: { id: program.university.id } }"
                    class="btn btn-sm btn-light"
                >
                    <AppIcon name="building" class="me-1" />View university
                </router-link>
                <button
                    v-if="program"
                    type="button"
                    class="btn btn-sm btn-light"
                    :disabled="bookmarking"
                    @click="toggleBookmark"
                >
                    <AppIcon :name="program.bookmarked ? 'bookmark-filled' : 'bookmark'" :size="15" class="me-1" />
                    {{ program.bookmarked ? 'Saved' : 'Save' }}
                </button>
                <button v-if="program" type="button" class="btn btn-sm btn-primary" @click="startApplication">
                    <AppIcon name="plus" :size="15" class="me-1" />Track application
                </button>
            </div>
        </div>

        <div v-if="loading" class="card">
            <div class="card-body py-10 text-center"><span class="spinner-border text-primary"></span></div>
        </div>

        <EmptyState
            v-else-if="error || !program"
            icon="school"
            title="Program not available"
            :message="error || 'This program is not in the catalog anymore.'"
        >
            <router-link :to="{ name: 'programs' }" class="btn btn-sm btn-primary">Back to programs</router-link>
        </EmptyState>

        <template v-else>
            <!-- Hero -->
            <div class="card detail-hero mb-4">
                <div class="card-body">
                    <nav aria-label="breadcrumb" class="mb-2">
                        <ol class="breadcrumb mb-0 fs-14 app-breadcrumb">
                            <li class="breadcrumb-item">
                                <router-link :to="{ name: 'universities' }" class="text-muted">Universities</router-link>
                            </li>
                            <li class="breadcrumb-item">
                                <router-link
                                    :to="{ name: 'university', params: { id: program.university?.id } }"
                                    class="text-muted"
                                >
                                    {{ program.university?.name }}
                                </router-link>
                            </li>
                            <li class="breadcrumb-item active" aria-current="page">Program</li>
                        </ol>
                    </nav>

                    <div class="d-flex flex-wrap align-items-start justify-content-between gap-3">
                        <div class="min-w-0">
                            <h4 class="mb-2">{{ program.title }}</h4>
                            <p class="text-muted mb-3 d-flex flex-wrap align-items-center gap-2">
                                <AppIcon name="building" :size="15" />
                                {{ program.university?.name }}
                                <template v-if="program.university?.city || program.university?.country_name">
                                    <span class="text-muted">·</span>
                                    <AppIcon name="map-pin" :size="14" />{{ [program.university.city, program.university.country_name].filter(Boolean).join(', ') }}
                                </template>
                            </p>
                            <div class="d-flex flex-wrap gap-2 align-items-center">
                                <span class="badge bg-primary-subtle text-primary">{{ program.subject_area }}</span>
                                <span class="badge bg-light text-body border text-uppercase">{{ program.language }}</span>
                                <span class="badge bg-light text-body border text-capitalize">{{ program.degree_type }}</span>
                                <SourceBadge
                                    :status="program.verification_status"
                                    :verified-at="program.source_verified_at"
                                    :sample="program.is_sample"
                                />
                                <StatusBadge
                                    v-if="program.assessment"
                                    :status="program.assessment.status"
                                    :label="program.assessment.status_label"
                                />
                            </div>
                        </div>

                        <div class="deadline-tile" :class="`deadline-${deadlineState.tone}`">
                            <span class="deadline-label">Next deadline</span>
                            <span class="deadline-value">{{ deadlineState.label }}</span>
                            <span v-if="program.next_call?.deadline && program.next_call?.days_left !== null" class="deadline-meta">
                                {{ program.next_call.days_left }} days left
                            </span>
                            <span v-else-if="program.next_call" class="deadline-meta">
                                {{ program.next_call.intake_label }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="program.is_sample" class="alert alert-warning py-2 fs-15">
                <AppIcon name="info-circle" class="me-1" />
                Demo catalog record. Dates and requirements are illustrative — confirm them on the official page before applying.
            </div>

            <div class="row g-4">
                <div class="col-lg-8">
                    <!-- Program facts -->
                    <div class="row g-3 mb-4">
                        <div class="col-sm-6 col-xl-3">
                            <div class="card h-100"><div class="card-body">
                                <p class="text-muted fs-14 mb-1">Tuition</p>
                                <p class="fw-semibold mb-0">{{ program.tuition?.label }}</p>
                            </div></div>
                        </div>
                        <div class="col-sm-6 col-xl-3">
                            <div class="card h-100"><div class="card-body">
                                <p class="text-muted fs-14 mb-1">Duration</p>
                                <p class="fw-semibold mb-0">
                                    {{ program.duration_months ? `${program.duration_months} months` : 'Not published' }}
                                </p>
                            </div></div>
                        </div>
                        <div class="col-sm-6 col-xl-3">
                            <div class="card h-100"><div class="card-body">
                                <p class="text-muted fs-14 mb-1">Language</p>
                                <p class="fw-semibold mb-0 text-uppercase">{{ program.language }}</p>
                            </div></div>
                        </div>
                        <div class="col-sm-6 col-xl-3">
                            <div class="card h-100"><div class="card-body">
                                <p class="text-muted fs-14 mb-1">Intake</p>
                                <p class="fw-semibold mb-0">
                                    {{ program.next_call?.intake_year ?? 'Not published' }}
                                </p>
                            </div></div>
                        </div>
                    </div>

                    <!-- Requirements -->
                    <div class="card mb-4">
                        <div class="card-header d-flex align-items-center justify-content-between">
                            <div>
                                <h5 class="card-title mb-0">Admission requirements</h5>
                                <p class="text-muted fs-14 mb-0">Unpublished fields stay empty — nothing is inferred.</p>
                            </div>
                            <span class="chip"><AppIcon name="list-check" :size="13" />Rules based</span>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-borderless align-middle mb-0 requirement-table">
                                    <tbody>
                                        <tr v-for="row in requirementRows" :key="row.label">
                                            <th class="text-muted fw-medium">{{ row.label }}</th>
                                            <td>
                                                <span v-if="row.known">{{ row.value }}</span>
                                                <span v-else class="text-muted">{{ row.value }}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div v-if="program.requirements?.prerequisites" class="alert alert-light border mt-3 mb-0 fs-15">
                                {{ program.requirements.prerequisites }}
                            </div>
                        </div>
                    </div>

                    <!-- Documents -->
                    <div v-if="program.required_documents?.length" class="card mb-4">
                        <div class="card-header"><h5 class="card-title mb-0">Required documents</h5></div>
                        <div class="card-body">
                            <div class="d-flex flex-wrap gap-2">
                                <span v-for="document in program.required_documents" :key="document" class="chip">
                                    <AppIcon name="file-text" :size="13" />{{ document }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Assessment -->
                    <div class="card mb-4">
                        <div class="card-header"><h5 class="card-title mb-0">Your eligibility assessment</h5></div>
                        <div class="card-body">
                            <AssessmentDetails v-if="program.assessment" :assessment="program.assessment" />
                            <div v-else class="text-muted fs-15">
                                No assessment stored for this program yet. Recalculate matches once your profile and
                                preferences are complete.
                                <router-link :to="{ name: 'matches' }" class="ms-1">Open matches</router-link>
                            </div>
                        </div>
                    </div>

                    <!-- Related -->
                    <div v-if="related.length" class="card">
                        <div class="card-header d-flex align-items-center justify-content-between">
                            <h5 class="card-title mb-0">Related programs</h5>
                            <span class="chip">Same university or subject</span>
                        </div>
                        <div class="card-body">
                            <div class="row g-2">
                                <div v-for="item in related" :key="item.id" class="col-md-6">
                                    <button type="button" class="related-card text-start" @click="openRelated(item)">
                                        <span class="d-flex align-items-center justify-content-between gap-2">
                                            <span class="fw-semibold text-truncate">{{ item.title }}</span>
                                            <AppIcon name="chevron-right" :size="16" class="text-muted flex-shrink-0" />
                                        </span>
                                        <span class="d-block text-muted fs-14 mt-1">
                                            {{ item.university?.name }} · {{ item.tuition?.label }}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="col-lg-4">
                    <div class="card mb-4">
                        <div class="card-header"><h5 class="card-title mb-0">Official sources</h5></div>
                        <div class="card-body d-flex flex-column gap-2">
                            <a
                                v-if="program.source_url"
                                :href="program.source_url"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="btn btn-light btn-sm text-start"
                            >
                                <AppIcon name="external-link" :size="15" class="me-2" />Program page
                            </a>
                            <a
                                v-if="program.application_url"
                                :href="program.application_url"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="btn btn-light btn-sm text-start"
                            >
                                <AppIcon name="send" :size="15" class="me-2" />Application portal
                            </a>
                            <a
                                v-if="program.next_call?.source_url"
                                :href="program.next_call.source_url"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="btn btn-light btn-sm text-start"
                            >
                                <AppIcon name="flag" :size="15" class="me-2" />Admission call
                            </a>
                            <p class="text-muted fs-13 mb-0 mt-1">
                                Links open the institution's own website in a new tab.
                            </p>
                        </div>
                    </div>

                    <div class="card mb-4">
                        <div class="card-header"><h5 class="card-title mb-0">At a glance</h5></div>
                        <div class="card-body">
                            <dl class="fact-list mb-0">
                                <dt>University</dt>
                                <dd>{{ program.university?.name || 'Not published' }}</dd>
                                <dt>Location</dt>
                                <dd>
                                    {{ [program.university?.city, program.university?.region, program.university?.country_name].filter(Boolean).join(' · ') || 'Europe' }}
                                </dd>
                                <dt>Intake</dt>
                                <dd>{{ program.next_call?.intake_label || 'Not published' }}</dd>
                                <dt>Verification</dt>
                                <dd class="text-capitalize">
                                    {{ program.is_sample ? 'Demo / unverified' : program.verification_status }}
                                </dd>
                                <dt v-if="program.source_verified_at">Last verified</dt>
                                <dd v-if="program.source_verified_at">{{ formatDate(program.source_verified_at) }}</dd>
                            </dl>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex align-items-center gap-2 mb-2">
                                <span class="tip-icon"><AppIcon name="target-arrow" :size="16" /></span>
                                <h6 class="mb-0">Match score ≠ admission odds</h6>
                            </div>
                            <p class="text-muted fs-14 mb-3">
                                Eligibility is calculated against published rules only. A high score means the stored
                                criteria are satisfied, not that the university will accept you.
                            </p>
                            <button type="button" class="btn btn-sm btn-sub-primary w-100" @click="startApplication">
                                <AppIcon name="files" :size="14" class="me-1" />Start tracking this program
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
.detail-hero {
    background:
        radial-gradient(600px 240px at 100% 0%, rgba(139, 92, 246, 0.1), transparent 70%),
        var(--dx-secondary-bg, #fff);
}

.app-breadcrumb :deep(.breadcrumb-item + .breadcrumb-item::before) {
    content: "/";
    font-family: inherit;
}

.deadline-tile {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 190px;
    padding: 14px 18px;
    border-radius: 14px;
    border: 1px solid var(--dx-border-color, #e4e9f2);
    background: var(--dx-tertiary-bg, #f1f5f9);
}

.deadline-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--dx-secondary-color, #64748b);
}

.deadline-value {
    font-size: 18px;
    font-weight: 700;
    line-height: 1.25;
}

.deadline-meta {
    font-size: 12px;
    color: var(--dx-secondary-color, #64748b);
}

.deadline-warning {
    border-color: rgba(245, 158, 11, 0.35);
    background: rgba(245, 158, 11, 0.1);
}

.deadline-warning .deadline-value {
    color: #b45309;
}

.deadline-muted .deadline-value {
    color: var(--dx-secondary-color, #64748b);
}

[data-bs-theme="dark"] .deadline-warning .deadline-value {
    color: #fcd34d;
}

.requirement-table th {
    width: 220px;
    padding-inline-start: 0;
}

.related-card {
    display: block;
    width: 100%;
    border: 1px solid var(--dx-border-color, #eef0f3);
    border-radius: 12px;
    background: transparent;
    padding: 12px 14px;
    transition: border-color 0.15s ease, background-color 0.15s ease;
}

.related-card:hover,
.related-card:focus-visible {
    background: var(--dx-tertiary-bg, #f6f8fa);
    border-color: rgba(99, 102, 241, 0.35);
    outline: none;
}

.tip-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    flex-shrink: 0;
    border-radius: 9px;
    background: rgba(99, 102, 241, 0.14);
    color: #4f46e5;
}

[data-bs-theme="dark"] .tip-icon {
    background: rgba(129, 140, 248, 0.18);
    color: #c7d2fe;
}
</style>
