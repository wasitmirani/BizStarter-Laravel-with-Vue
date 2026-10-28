<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AdmissionsService from '../../Services/Admissions/AdmissionsService';
import { errorMessage } from '../../Services/Admissions/api';
import EmptyState from './Components/EmptyState.vue';
import SourceBadge from './Components/SourceBadge.vue';

const route = useRoute();
const router = useRouter();

const university = ref<any>(null);
const programs = ref<any[]>([]);
const stats = ref<any>(null);
const loading = ref(true);
const error = ref('');
const syncing = ref(false);
const syncNotice = ref('');
const syncError = ref('');

const search = ref('');
const subject = ref('');

const subjectOptions = computed(() =>
    (stats.value?.subject_areas ?? programs.value.map((program) => program.subject_area))
        .filter(Boolean)
        .filter((value: string, index: number, all: string[]) => all.indexOf(value) === index)
        .sort(),
);

const filteredPrograms = computed(() => {
    const term = search.value.trim().toLowerCase();

    return programs.value.filter((program) => {
        if (subject.value && program.subject_area !== subject.value) return false;
        if (!term) return true;

        return [program.title, program.subject_area, program.degree_type]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(term));
    });
});

const load = async () => {
    loading.value = true;
    error.value = '';

    try {
        const result = await AdmissionsService.university(Number(route.params.id));
        university.value = result.university ?? null;
        programs.value = result.programs ?? [];
        stats.value = result.stats ?? null;
    } catch (exception: any) {
        error.value = errorMessage(exception);
        university.value = null;
    } finally {
        loading.value = false;
    }
};

onMounted(load);
watch(() => route.params.id, load);

const location = (value: any) =>
    [value?.city, value?.region, value?.country_name].filter(Boolean).join(' · ') || 'Europe';

const syncSources = async () => {
    if (!university.value || syncing.value) return;

    syncing.value = true;
    syncNotice.value = '';
    syncError.value = '';

    try {
        const result = await AdmissionsService.syncCatalog(university.value.id);
        const checked = Number(result.checked ?? 0);
        const ok = Number(result.ok ?? 0);
        const failed = Number(result.failed ?? 0);

        syncNotice.value = checked
            ? `Checked ${checked} official source${checked === 1 ? '' : 's'} · ${ok} reachable${failed ? ` · ${failed} failed` : ''}.`
            : 'No official source is stored for this university yet.';

        await load();
    } catch (exception: any) {
        syncError.value = errorMessage(exception);
    } finally {
        syncing.value = false;
    }
};

const formatDate = (value?: string | null) => {
    if (!value) return '';
    const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
    if (Number.isNaN(date.getTime())) return '';

    return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
};

const programsLabel = (count: number) => `${count} ${Number(count) === 1 ? 'program' : 'programs'}`;

const tuitionFrom = computed(() => {
    if (stats.value?.tuition_from == null) return 'Not published';

    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: stats.value.currency ?? 'EUR',
        maximumFractionDigits: 0,
    }).format(Number(stats.value.tuition_from));
});

const openProgram = (program: any) => router.push({ name: 'program', params: { id: program.id } });
</script>

<template>
    <div>
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
            <router-link :to="{ name: 'universities' }" class="btn btn-sm btn-light">
                <AppIcon name="arrow-left" class="me-1" />All universities
            </router-link>
            <div class="d-flex flex-wrap gap-2">
                <router-link
                    v-if="university"
                    :to="{ name: 'programs', query: { university_id: university.id } }"
                    class="btn btn-sm btn-light"
                >
                    <AppIcon name="school" class="me-1" />Browse in catalog
                </router-link>
                <router-link :to="{ name: 'matches' }" class="btn btn-sm btn-primary">
                    <AppIcon name="target-arrow" class="me-1" />My matches
                </router-link>
            </div>
        </div>

        <div v-if="syncError" class="alert alert-danger py-2 d-flex align-items-start gap-2">
            <AppIcon name="alert-circle" :size="17" class="mt-1" />
            <span class="flex-grow-1">{{ syncError }}</span>
            <button type="button" class="btn-close" aria-label="Dismiss" @click="syncError = ''"></button>
        </div>

        <div v-if="syncNotice" class="alert alert-success py-2 d-flex align-items-start gap-2">
            <AppIcon name="circle-check" :size="17" class="mt-1" />
            <span class="flex-grow-1">{{ syncNotice }}</span>
            <button type="button" class="btn-close" aria-label="Dismiss" @click="syncNotice = ''"></button>
        </div>

        <div v-if="loading" class="card">
            <div class="card-body py-10 text-center"><span class="spinner-border text-primary"></span></div>
        </div>

        <EmptyState
            v-else-if="error || !university"
            icon="building"
            title="University not available"
            :message="error || 'This institution is not in the catalog anymore.'"
        >
            <router-link :to="{ name: 'universities' }" class="btn btn-sm btn-primary">Back to universities</router-link>
        </EmptyState>

        <template v-else>
            <!-- Hero -->
            <div class="card detail-hero mb-4">
                <div class="card-body">
                    <div class="d-flex flex-wrap align-items-start gap-3 gap-md-4">
                        <span class="university-mark university-mark-xl">{{ university.initials || 'UN' }}</span>

                        <div class="min-w-0 flex-grow-1">
                            <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
                                <span class="badge bg-primary-subtle text-primary text-capitalize">{{ university.type }}</span>
                                <span class="chip"><AppIcon name="map-pin" :size="13" />{{ location(university) }}</span>
                                <SourceBadge status="unverified" />
                            </div>
                            <h4 class="mb-2">{{ university.name }}</h4>
                            <p v-if="university.description" class="text-muted mb-0 detail-lead">{{ university.description }}</p>

                            <div class="d-flex flex-wrap gap-2 mt-3">
                                <a
                                    v-if="university.official_website"
                                    :href="university.official_website"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="btn btn-sm btn-primary"
                                >
                                    <AppIcon name="globe" class="me-1" />Official website
                                </a>
                                <a
                                    v-if="university.admissions_page_url"
                                    :href="university.admissions_page_url"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="btn btn-sm btn-light"
                                >
                                    <AppIcon name="flag" class="me-1" />Admissions page
                                </a>
                                <a
                                    v-if="university.scholarship_source_url"
                                    :href="university.scholarship_source_url"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="btn btn-sm btn-light"
                                >
                                    <AppIcon name="award" class="me-1" />Scholarships
                                </a>
                                <button
                                    type="button"
                                    class="btn btn-sm btn-light"
                                    :disabled="syncing"
                                    @click="syncSources"
                                >
                                    <span v-if="syncing" class="spinner-border spinner-border-sm me-1" role="status"></span>
                                    <AppIcon v-else name="refresh" class="me-1" />
                                    {{ syncing ? 'Checking sources…' : 'Check official sources' }}
                                </button>
                            </div>

                            <p v-if="university.last_checked_at" class="d-inline-flex align-items-center gap-1 fs-14 text-muted mt-3 mb-0">
                                <AppIcon name="clock" :size="14" />
                                Sources last checked {{ formatDate(university.last_checked_at) }}
                                <span v-if="university.source_status" class="chip ms-1 text-capitalize">{{ university.source_status }}</span>
                            </p>
                            <p v-else class="fs-14 text-muted mt-3 mb-0">
                                Sources have not been checked from the app yet.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Stats -->
            <div class="row g-3 mb-4">
                <div class="col-6 col-xl-3">
                    <div class="card h-100"><div class="card-body">
                        <p class="text-muted fs-14 mb-1">Programs in catalog</p>
                        <p class="h4 mb-0">{{ stats?.programs ?? programs.length }}</p>
                    </div></div>
                </div>
                <div class="col-6 col-xl-3">
                    <div class="card h-100"><div class="card-body">
                        <p class="text-muted fs-14 mb-1">Open admission calls</p>
                        <p class="h4 mb-0">{{ stats?.open_calls ?? 0 }}</p>
                    </div></div>
                </div>
                <div class="col-6 col-xl-3">
                    <div class="card h-100"><div class="card-body">
                        <p class="text-muted fs-14 mb-1">Next stored deadline</p>
                        <p class="h5 mb-0">{{ stats?.next_deadline ? formatDate(stats.next_deadline) : 'To be confirmed' }}</p>
                    </div></div>
                </div>
                <div class="col-6 col-xl-3">
                    <div class="card h-100"><div class="card-body">
                        <p class="text-muted fs-14 mb-1">Tuition from</p>
                        <p class="h5 mb-0">{{ tuitionFrom }}</p>
                    </div></div>
                </div>
            </div>

            <div class="row g-4">
                <!-- Programs -->
                <div class="col-lg-8">
                    <div class="card">
                        <div class="card-header d-flex flex-wrap align-items-center justify-content-between gap-2">
                            <div>
                                <h5 class="card-title mb-0">English-taught &amp; catalog programs</h5>
                                <p class="text-muted fs-14 mb-0">Only records stored for this institution are listed.</p>
                            </div>
                            <span class="chip">{{ programsLabel(programs.length) }}</span>
                        </div>
                        <div class="card-body">
                            <div class="row g-2 mb-3">
                                <div class="col-sm-7">
                                    <div class="position-relative">
                                        <AppIcon name="search" :size="16" class="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                                        <input
                                            v-model="search"
                                            type="search"
                                            class="form-control form-control-sm ps-9"
                                            placeholder="Filter programs by name or subject"
                                            aria-label="Filter programs"
                                        />
                                    </div>
                                </div>
                                <div class="col-sm-5">
                                    <select v-model="subject" class="form-select form-select-sm" aria-label="Filter by subject">
                                        <option value="">All subject areas</option>
                                        <option v-for="option in subjectOptions" :key="option" :value="option">{{ option }}</option>
                                    </select>
                                </div>
                            </div>

                            <EmptyState
                                v-if="!filteredPrograms.length"
                                icon="school"
                                title="No programs match"
                                message="Clear the filter to see every stored program at this university."
                            />

                            <div v-else class="d-flex flex-column gap-2">
                                <button
                                    v-for="program in filteredPrograms"
                                    :key="program.id"
                                    type="button"
                                    class="program-row text-start"
                                    @click="openProgram(program)"
                                >
                                    <span class="min-w-0 flex-grow-1">
                                        <span class="d-block fw-semibold text-truncate">{{ program.title }}</span>
                                        <span class="d-flex flex-wrap align-items-center gap-2 fs-14 text-muted mt-1">
                                            <span class="badge bg-light text-body border">{{ program.subject_area }}</span>
                                            <span class="text-uppercase">{{ program.language }}</span>
                                            <span v-if="program.duration_months">· {{ program.duration_months }} months</span>
                                            <span>· {{ program.tuition?.label }}</span>
                                            <template v-if="program.next_call?.deadline">
                                                <span>· deadline {{ formatDate(program.next_call.deadline) }}</span>
                                            </template>
                                            <span v-else-if="program.next_call" class="chip chip-warning">Deadline TBC</span>
                                            <span v-else class="chip">No open call</span>
                                        </span>
                                    </span>
                                    <span class="d-flex flex-column align-items-end gap-2 flex-shrink-0">
                                        <SourceBadge :status="program.verification_status" :sample="program.is_sample" />
                                        <AppIcon name="chevron-right" :size="16" class="text-muted" />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar facts -->
                <div class="col-lg-4">
                    <div class="card mb-4">
                        <div class="card-header"><h5 class="card-title mb-0">Institution facts</h5></div>
                        <div class="card-body">
                            <dl class="fact-list mb-0">
                                <dt>Type</dt>
                                <dd class="text-capitalize">{{ university.type || 'Not published' }}</dd>
                                <dt>Country</dt>
                                <dd>{{ university.country_name || 'Not published' }}</dd>
                                <dt>City</dt>
                                <dd>{{ university.city || 'Not published' }}</dd>
                                <dt>Region</dt>
                                <dd>{{ university.region || 'Not published' }}</dd>
                                <dt>Teaching languages</dt>
                                <dd class="text-uppercase">{{ stats?.languages?.join(', ') || 'Not published' }}</dd>
                                <dt>Subject areas</dt>
                                <dd>{{ stats?.subject_areas?.join(', ') || 'Not published' }}</dd>
                                <dt>Last catalog update</dt>
                                <dd>{{ university.updated_at ? formatDate(university.updated_at) : 'Unknown' }}</dd>
                                <dt>Sources checked</dt>
                                <dd>{{ university.last_checked_at ? formatDate(university.last_checked_at) : 'Not yet' }}</dd>
                            </dl>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex align-items-center gap-2 mb-2">
                                <span class="source-icon"><AppIcon name="info-circle" :size="16" /></span>
                                <h6 class="mb-0">Verify before applying</h6>
                            </div>
                            <p class="text-muted fs-14 mb-3">
                                Catalog entries link to official university pages. Tuition, language thresholds and
                                deadlines are only marked confirmed after a verified import — always re-check the
                                official call before you submit an application.
                            </p>
                            <a
                                v-if="university.admissions_page_url"
                                :href="university.admissions_page_url"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="btn btn-sm btn-sub-primary w-100"
                            >
                                Open official admissions <AppIcon name="external-link" :size="14" class="ms-1" />
                            </a>
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
        radial-gradient(600px 220px at 0% 0%, rgba(99, 102, 241, 0.1), transparent 70%),
        var(--dx-secondary-bg, #fff);
}

.detail-lead {
    max-width: 70ch;
    line-height: 1.6;
}

.university-mark-xl {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    flex-shrink: 0;
    border-radius: 20px;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.16), rgba(139, 92, 246, 0.12));
    color: #4f46e5;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: 0.04em;
}

[data-bs-theme="dark"] .university-mark-xl {
    background: rgba(129, 140, 248, 0.18);
    color: #c7d2fe;
}

.program-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    width: 100%;
    border: 1px solid var(--dx-border-color, #eef0f3);
    border-radius: 12px;
    background: transparent;
    padding: 12px 14px;
    text-align: left;
    transition: border-color 0.15s ease, background-color 0.15s ease, transform 0.15s ease;
}

.program-row:hover,
.program-row:focus-visible {
    background: var(--dx-tertiary-bg, #f6f8fa);
    border-color: rgba(99, 102, 241, 0.35);
    outline: none;
}

.source-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    flex-shrink: 0;
    border-radius: 9px;
    background: rgba(14, 165, 233, 0.14);
    color: #0284c7;
}
</style>
