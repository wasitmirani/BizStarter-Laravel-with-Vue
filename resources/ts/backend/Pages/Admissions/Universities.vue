<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AdmissionsService from '../../Services/Admissions/AdmissionsService';
import { errorMessage } from '../../Services/Admissions/api';
import PageHeader from '../Admissions/Components/PageHeader.vue';
import EmptyState from '../Admissions/Components/EmptyState.vue';
import Modal from '../Admissions/Components/Modal.vue';
import SourceBadge from '../Admissions/Components/SourceBadge.vue';
import Pagination from '../Admissions/Components/Pagination.vue';

const route = useRoute();
const router = useRouter();

const filters = reactive({
    search: '',
    region: '',
    type: '',
    sort: 'name',
    page: 1,
});

const universities = ref<any[]>([]);
const meta = ref<any>({ current_page: 1, last_page: 1, total: 0, from: null, to: null });
const facets = reactive<{ regions: string[]; types: string[] }>({ regions: [], types: [] });
const loading = ref(true);
const error = ref('');
const showDetail = ref(false);
const detail = ref<any>(null);
const detailPrograms = ref<any[]>([]);
const detailLoading = ref(false);

let debounce: number | undefined;

const load = async (page = filters.page) => {
    filters.page = page;
    loading.value = true;
    error.value = '';

    try {
        const result = await AdmissionsService.universities({
            search: filters.search || undefined,
            region: filters.region || undefined,
            type: filters.type || undefined,
            sort: filters.sort,
            page,
            per_page: 12,
        });

        universities.value = result.universities ?? [];
        meta.value = result.meta ?? meta.value;

        if (result.facets) {
            facets.regions = result.facets.regions ?? [];
            facets.types = result.facets.types ?? [];
        }
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        loading.value = false;
    }
};

const scheduleLoad = () => {
    window.clearTimeout(debounce);
    debounce = window.setTimeout(() => load(1), 220);
};

const resetFilters = () => {
    filters.search = '';
    filters.region = '';
    filters.type = '';
    filters.sort = 'name';
    router.replace({ name: 'universities' });
    load(1);
};

const openUniversity = async (university: any) => {
    showDetail.value = true;
    detail.value = university;
    detailPrograms.value = [];
    detailLoading.value = true;

    if (route.query.university !== String(university.id)) {
        router.replace({ name: 'universities', query: { ...route.query, university: university.id } });
    }

    try {
        const result = await AdmissionsService.university(university.id);
        detail.value = result.university ?? university;
        detailPrograms.value = result.programs ?? [];
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        detailLoading.value = false;
    }
};

const closeDetail = () => {
    showDetail.value = false;
    detail.value = null;
    detailPrograms.value = [];

    if (route.query.university) {
        const query = { ...route.query };
        delete query.university;
        router.replace({ name: 'universities', query });
    }
};

const openProgramFromDetail = (program: any) => {
    showDetail.value = false;
    detail.value = null;
    detailPrograms.value = [];
    router.push({ name: 'programs', query: { program: program.id } });
};

const browseProgramsFromDetail = () => {
    const id = detail.value?.id;
    showDetail.value = false;
    detail.value = null;
    detailPrograms.value = [];
    if (id) router.push({ name: 'programs', query: { university_id: id } });
};

const formatDate = (value?: string | null) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
};

const formatDeadline = (value?: string | null) =>
    value ? new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : '';

const location = (university: any) => [university.city, university.region].filter(Boolean).join(' · ') || 'Italy';

const programsLabel = (count: number) => `${count} ${Number(count) === 1 ? 'program' : 'programs'}`;

watch(
    () => [filters.search, filters.region, filters.type, filters.sort],
    scheduleLoad,
);

watch(
    () => route.query.search,
    (value) => {
        const next = typeof value === 'string' ? value : '';
        if (next !== filters.search) {
            filters.search = next;
        }
    },
);

watch(
    () => route.query.university,
    (value) => {
        const id = Number(value);
        if (!id) {
            if (showDetail.value) closeDetail();
            return;
        }

        if (detail.value?.id === id) return;
        const match = universities.value.find((university) => university.id === id);
        openUniversity(match ?? { id });
    },
);

onMounted(async () => {
    if (typeof route.query.search === 'string') {
        filters.search = route.query.search;
    }

    await load(1);

    const requested = Number(route.query.university);
    if (requested) {
        openUniversity(universities.value.find((university) => university.id === requested) ?? { id: requested });
    }
});

onBeforeUnmount(() => window.clearTimeout(debounce));
</script>

<template>
    <div>
        <PageHeader title="Universities" subtitle="Live catalog of Italian institutions. Search by name, city, region or subject and open the official admissions pages.">
            <template #actions>
                <router-link :to="{ name: 'programs' }" class="btn btn-sm btn-light"><AppIcon name="school" class="me-1" />Browse programs</router-link>
                <router-link :to="{ name: 'matches' }" class="btn btn-sm btn-primary"><AppIcon name="target-arrow" class="me-1" />My matches</router-link>
            </template>
        </PageHeader>

        <div v-if="error" class="alert alert-danger py-2 d-flex align-items-start gap-2">
            <AppIcon name="alert-circle" :size="17" class="mt-1" />
            <span>{{ error }}</span>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <div class="row g-3 align-items-end">
                    <div class="col-lg-5">
                        <label class="form-label" for="university-search">Search the catalog</label>
                        <div class="position-relative">
                            <AppIcon name="search" :size="17" class="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                            <input
                                id="university-search"
                                v-model="filters.search"
                                type="search"
                                class="form-control"
                                style="padding-inline-start: 42px; padding-inline-end: 42px"
                                placeholder="University, city, region or subject"
                                autocomplete="off"
                            />
                            <span v-if="loading" class="spinner-border spinner-border-sm text-primary position-absolute top-50 end-0 translate-middle-y me-3"></span>
                            <button
                                v-else-if="filters.search"
                                type="button"
                                class="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2"
                                aria-label="Clear search"
                                @click="filters.search = ''"
                            >
                                <AppIcon name="x" :size="15" />
                            </button>
                        </div>
                    </div>
                    <div class="col-sm-6 col-lg-2">
                        <label class="form-label">Region</label>
                        <select v-model="filters.region" class="form-select">
                            <option value="">All regions</option>
                            <option v-for="region in facets.regions" :key="region" :value="region">{{ region }}</option>
                        </select>
                    </div>
                    <div class="col-sm-6 col-lg-2">
                        <label class="form-label">Type</label>
                        <select v-model="filters.type" class="form-select">
                            <option value="">All types</option>
                            <option v-for="type in (facets.types.length ? facets.types : ['public', 'private'])" :key="type" :value="type" class="text-capitalize">
                                {{ type }}
                            </option>
                        </select>
                    </div>
                    <div class="col-sm-6 col-lg-2">
                        <label class="form-label">Sort by</label>
                        <select v-model="filters.sort" class="form-select">
                            <option value="name">Name (A–Z)</option>
                            <option value="programs">Most programs</option>
                            <option value="region">Region</option>
                            <option value="updated">Recently updated</option>
                        </select>
                    </div>
                    <div class="col-sm-6 col-lg-1 d-grid">
                        <button type="button" class="btn btn-link btn-sm text-decoration-none" @click="resetFilters">Reset</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
            <p class="text-muted fs-15 mb-0">
                <template v-if="meta.total">
                    Showing <strong>{{ meta.from }}–{{ meta.to }}</strong> of <strong>{{ meta.total }}</strong> institutions
                </template>
                <template v-else>No institutions match the current filters</template>
                <span v-if="filters.search" class="text-muted"> · “{{ filters.search }}”</span>
            </p>
            <p class="text-muted fs-14 mb-0 d-flex align-items-center gap-1">
                <AppIcon name="info-circle" :size="14" />
                Always confirm requirements on the official university page.
            </p>
        </div>

        <div v-if="loading && !universities.length" class="row g-4">
            <div v-for="index in 6" :key="index" class="col-md-6 col-xl-4">
                <div class="card h-100"><div class="card-body">
                    <div class="placeholder-glow">
                        <span class="placeholder col-8 d-block mb-3"></span>
                        <span class="placeholder col-5 d-block mb-2"></span>
                        <span class="placeholder col-12 d-block mb-2"></span>
                        <span class="placeholder col-10 d-block"></span>
                    </div>
                </div></div>
            </div>
        </div>

        <template v-else>
            <EmptyState
                v-if="!universities.length"
                icon="building"
                title="No universities found"
                message="Try a different name, city or region. Clear the filters to see the whole catalog."
            >
                <button type="button" class="btn btn-sm btn-primary" @click="resetFilters">Clear filters</button>
            </EmptyState>

            <div v-else class="row g-4" :class="{ 'opacity-50': loading }">
                <div v-for="university in universities" :key="university.id" class="col-md-6 col-xl-4">
                    <div class="card h-100 university-card">
                        <div class="card-body d-flex flex-column gap-3">
                            <div class="d-flex align-items-start gap-3">
                                <span class="university-mark">{{ university.initials || 'UN' }}</span>
                                <div class="min-w-0 flex-grow-1">
                                    <h6 class="mb-1 lh-sm">{{ university.name }}</h6>
                                    <p class="text-muted fs-14 mb-0 d-flex align-items-center gap-1">
                                        <AppIcon name="map-pin" :size="13" />{{ location(university) }}
                                    </p>
                                </div>
                                <span class="badge bg-light text-body border text-capitalize flex-shrink-0">{{ university.type }}</span>
                            </div>

                            <p v-if="university.description" class="text-muted fs-14 mb-0 university-description">
                                {{ university.description }}
                            </p>

                            <div class="d-flex flex-wrap gap-3 fs-14 text-muted">
                                <span class="d-inline-flex align-items-center gap-1">
                                    <AppIcon name="school" :size="14" />{{ programsLabel(university.programs_count ?? 0) }}
                                </span>
                                <span v-if="university.updated_at" class="d-inline-flex align-items-center gap-1">
                                    <AppIcon name="clock" :size="14" />Updated {{ formatDate(university.updated_at) }}
                                </span>
                            </div>

                            <div class="d-flex flex-wrap gap-2 mt-auto pt-3 border-top">
                                <button type="button" class="btn btn-sm btn-light" @click="openUniversity(university)">
                                    <AppIcon name="list-details" class="me-1" />Details
                                </button>
                                <a
                                    v-if="university.official_website"
                                    :href="university.official_website"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="btn btn-sm btn-light"
                                >
                                    <AppIcon name="external-link" class="me-1" />Website
                                </a>
                                <a
                                    v-if="university.admissions_page_url"
                                    :href="university.admissions_page_url"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="btn btn-sm btn-light"
                                >
                                    <AppIcon name="flag" class="me-1" />Admissions
                                </a>
                                <router-link
                                    :to="{ name: 'programs', query: { university_id: university.id } }"
                                    class="btn btn-sm btn-sub-primary ms-auto"
                                >
                                    Programs <AppIcon name="arrow-right" :size="14" class="ms-1" />
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Pagination :meta="meta" @change="load" />
        </template>

        <Modal
            :show="showDetail"
            :title="detail?.name ?? 'University'"
            :subtitle="detail?.id ? location(detail) : 'Loading institution details…'"
            icon="building"
            size="lg"
            @close="closeDetail"
        >
            <div v-if="detail?.id" class="d-flex flex-column gap-4">
                <div class="d-flex flex-wrap align-items-start gap-3">
                    <span class="university-mark university-mark-lg">{{ detail.initials || 'UN' }}</span>
                    <div class="min-w-0 flex-grow-1">
                        <p class="text-muted fs-15 mb-1 d-flex align-items-center gap-1">
                            <AppIcon name="map-pin" :size="14" />{{ location(detail) }}
                            <span class="badge bg-light text-body border text-capitalize ms-2">{{ detail.type }}</span>
                        </p>
                        <p v-if="detail.description" class="mb-0">{{ detail.description }}</p>
                    </div>
                </div>

                <div class="d-flex flex-wrap gap-2">
                    <a v-if="detail.official_website" :href="detail.official_website" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">
                        <AppIcon name="external-link" class="me-1" />Official website
                    </a>
                    <a v-if="detail.admissions_page_url" :href="detail.admissions_page_url" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-light">
                        <AppIcon name="flag" class="me-1" />Admissions page
                    </a>
                    <a v-if="detail.scholarship_source_url" :href="detail.scholarship_source_url" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-light">
                        <AppIcon name="award" class="me-1" />Scholarships
                    </a>
                    <router-link :to="{ name: 'programs', query: { university_id: detail.id } }" class="btn btn-sm btn-light">
                        <AppIcon name="school" class="me-1" />All {{ programsLabel(detail.programs_count ?? detailPrograms.length) }}
                    </router-link>
                </div>

                <div>
                    <h6 class="mb-3">Programs at this university</h6>
                    <div v-if="detailLoading" class="text-center py-6"><span class="spinner-border text-primary"></span></div>
                    <div v-else-if="!detailPrograms.length" class="alert alert-light border mb-0">No programs are stored for this university yet.</div>
                    <div v-else class="d-flex flex-column gap-2">
                        <button
                            v-for="program in detailPrograms"
                            :key="program.id"
                            type="button"
                            class="program-row text-start"
                            @click="openProgramFromDetail(program)"
                        >
                            <span class="min-w-0 flex-grow-1">
                                <span class="d-block fw-medium text-truncate">{{ program.title }}</span>
                                <span class="d-flex flex-wrap align-items-center gap-2 fs-14 text-muted mt-1">
                                    <span class="badge bg-light text-body border">{{ program.subject_area }}</span>
                                    <span class="text-uppercase">{{ program.language }}</span>
                                    <span v-if="program.tuition?.label">· {{ program.tuition.label }}</span>
                                    <template v-if="program.next_call?.deadline">
                                        <span>· deadline {{ formatDeadline(program.next_call.deadline) }}</span>
                                    </template>
                                    <span v-else>· no open call</span>
                                </span>
                            </span>
                            <SourceBadge :status="program.verification_status" :sample="program.is_sample" />
                        </button>
                    </div>
                </div>
            </div>
            <div v-else class="text-center py-6"><span class="spinner-border text-primary"></span></div>

            <template #footer>
                <button type="button" class="btn btn-light" @click="closeDetail">Close</button>
                <button v-if="detail?.id" type="button" class="btn btn-primary" @click="browseProgramsFromDetail">
                    Browse programs <AppIcon name="arrow-right" class="ms-1" />
                </button>
            </template>
        </Modal>
    </div>
</template>

<style scoped>
.university-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    flex-shrink: 0;
    border-radius: 12px;
    background: var(--dx-primary-bg-subtle, #e8f0fb);
    color: var(--dx-primary, #2563eb);
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.04em;
}

.university-mark-lg {
    width: 58px;
    height: 58px;
    border-radius: 16px;
    font-size: 16px;
}

[data-bs-theme="dark"] .university-mark {
    background: rgba(59, 130, 246, 0.22);
    color: #93c5fd;
}

.university-description {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.program-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    width: 100%;
    border: 1px solid var(--dx-border-color, #eef0f3);
    border-radius: 10px;
    background: transparent;
    padding: 10px 12px;
}

.program-row:hover,
.program-row:focus-visible {
    background: var(--dx-tertiary-bg, #f6f8fa);
    outline: none;
}
</style>
