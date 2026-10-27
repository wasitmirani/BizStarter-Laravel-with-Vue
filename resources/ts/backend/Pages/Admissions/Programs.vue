<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AdmissionsService from '../../Services/Admissions/AdmissionsService';
import { errorMessage } from '../../Services/Admissions/api';
import PageHeader from '../Admissions/Components/PageHeader.vue';
import ProgramCard from '../Admissions/Components/ProgramCard.vue';
import EmptyState from '../Admissions/Components/EmptyState.vue';
import Modal from '../Admissions/Components/Modal.vue';
import AssessmentDetails from '../Admissions/Components/AssessmentDetails.vue';
import SourceBadge from '../Admissions/Components/SourceBadge.vue';
import StatusBadge from '../Admissions/Components/StatusBadge.vue';
import Pagination from '../Admissions/Components/Pagination.vue';

const router = useRouter();
const route = useRoute();

const subjects = [
    'Computer Science',
    'Artificial Intelligence',
    'Data Science',
    'Software Engineering',
    'Cybersecurity',
    'Information Technology',
    'Healthcare Management',
    'Public Health',
];

const filters = reactive({
    search: '',
    subject_area: '',
    language: '',
    sort: 'deadline',
    has_open_call: true,
    university_id: '' as string | number,
    page: 1,
});

const universityName = ref('');

const programs = ref<any[]>([]);
const meta = ref<any>({ current_page: 1, last_page: 1, total: 0 });
const facets = reactive<{ subject_areas: string[]; languages: string[] }>({ subject_areas: [], languages: [] });
const loading = ref(true);
const error = ref('');
const selected = ref<any>(null);
const detailLoading = ref(false);
const showDetail = ref(false);

const load = async (page = filters.page) => {
    filters.page = page;
    loading.value = true;
    error.value = '';

    try {
        const result = await AdmissionsService.programs({ ...filters, has_open_call: filters.has_open_call ? 1 : 0 });
        programs.value = result.programs;
        meta.value = result.meta;
        if (result.facets) {
            facets.subject_areas = result.facets.subject_areas ?? [];
            facets.languages = result.facets.languages ?? [];
        }
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    if (typeof route.query.search === 'string') filters.search = route.query.search;
    if (typeof route.query.subject_area === 'string') filters.subject_area = route.query.subject_area;

    const requested = Number(route.query.university_id);
    if (requested) {
        filters.university_id = requested;
        try {
            const result = await AdmissionsService.university(requested);
            universityName.value = result.university?.name ?? '';
        } catch {
            // The filter still works without the display name.
        }
    }

    await load(1);

    const requestedProgram = Number(route.query.program);
    if (requestedProgram) {
        openProgram({ id: requestedProgram });
    }
});

watch(
    () => route.query,
    (next, previous) => {
        if (next.search !== previous?.search) {
            filters.search = typeof next.search === 'string' ? next.search : '';
            load(1);
        }

        const programId = Number(next.program);
        if (programId && programId !== Number(previous?.program)) {
            openProgram({ id: programId });
        }
    },
);

const clearUniversityFilter = () => {
    filters.university_id = '';
    universityName.value = '';
    router.replace({ name: 'programs' });
    load(1);
};

const openProgram = async (program: any) => {
    showDetail.value = true;
    selected.value = program;
    detailLoading.value = true;
    try {
        const result = await AdmissionsService.program(program.id);
        selected.value = result.program;
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        detailLoading.value = false;
    }
};

const toggleBookmark = async (program: any) => {
    try {
        if (program.bookmarked) {
            await AdmissionsService.removeBookmark(program.id);
        } else {
            await AdmissionsService.bookmark(program.id);
        }
        const next = !program.bookmarked;
        program.bookmarked = next;
        if (selected.value?.id === program.id) selected.value.bookmarked = next;
    } catch (exception: any) {
        error.value = errorMessage(exception);
    }
};

const startApplication = (program: any) => {
    showDetail.value = false;
    router.push({ name: 'applications', query: { program: program.id } });
};

const requirementRows = (program: any) => [
    { label: 'Degree level', value: program.requirements?.required_degree_level ?? 'Not published' },
    { label: 'Minimum grade', value: program.requirements?.minimum_grade_percentage ? `${program.requirements.minimum_grade_percentage}%` : 'Not published' },
    { label: 'Prerequisite subjects', value: program.requirements?.required_subjects?.join(', ') || 'Not published' },
    { label: 'Language test', value: program.requirements?.required_language_test ? `${String(program.requirements.required_language_test).toUpperCase()} ${program.requirements.minimum_language_score ?? ''}` : 'Not published' },
    { label: 'Work experience', value: program.requirements?.minimum_work_experience_months ? `${program.requirements.minimum_work_experience_months} months` : 'Not required' },
];

const formatDate = (value?: string | null) =>
    value ? new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
</script>

<template>
    <div>
        <PageHeader title="Master's programs" subtitle="Shared catalog with source verification status. Demo records are clearly marked.">
            <template #actions>
                <router-link :to="{ name: 'universities' }" class="btn btn-sm btn-light"><AppIcon name="building" class="me-1" />Universities</router-link>
                <router-link :to="{ name: 'matches' }" class="btn btn-sm btn-primary"><AppIcon name="target-arrow" class="me-1" />My matches</router-link>
            </template>
        </PageHeader>

        <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

        <div class="card mb-4">
            <div class="card-body">
                <form class="row g-3 align-items-end" @submit.prevent="load(1)">
                    <div class="col-md-4">
                        <label class="form-label" for="program-search">Search</label>
                        <div class="position-relative">
                            <input
                                id="program-search"
                                v-model="filters.search"
                                type="search"
                                class="form-control ps-9"
                                placeholder="Program, subject or university"
                            />
                            <AppIcon name="search" :size="16" class="text-muted position-absolute top-50 start-0 ms-3 translate-middle-y" />
                        </div>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Subject area</label>
                        <select v-model="filters.subject_area" class="form-select" @change="load(1)">
                            <option value="">All subjects</option>
                            <option v-for="subject in (facets.subject_areas.length ? facets.subject_areas : subjects)" :key="subject" :value="subject">{{ subject }}</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Language</label>
                        <select v-model="filters.language" class="form-select" @change="load(1)">
                            <option value="">Any</option>
                            <option v-for="language in (facets.languages.length ? facets.languages : ['en', 'it'])" :key="language" :value="language">
                                {{ language === 'en' ? 'English' : language === 'it' ? 'Italian' : String(language).toUpperCase() }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Sort</label>
                        <select v-model="filters.sort" class="form-select" @change="load(1)">
                            <option value="deadline">Nearest deadline</option>
                            <option value="title">Title</option>
                            <option value="tuition_asc">Tuition: low to high</option>
                            <option value="tuition_desc">Tuition: high to low</option>
                        </select>
                    </div>
                    <div class="col-12 d-flex flex-wrap gap-3 align-items-center justify-content-between">
                        <label class="form-check mb-0">
                            <input v-model="filters.has_open_call" type="checkbox" class="form-check-input" @change="load(1)" />
                            Only programs with an open call
                        </label>
                        <div class="d-flex gap-2">
                            <button type="button" class="btn btn-link btn-sm text-decoration-none" @click="Object.assign(filters, { search: '', subject_area: '', language: '', sort: 'deadline', has_open_call: true }); load(1)">Reset</button>
                            <button type="submit" class="btn btn-primary btn-sm"><AppIcon name="search" class="me-1" />Search</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="loading" class="card"><div class="card-body text-center py-10"><span class="spinner-border text-primary"></span></div></div>

        <template v-else>
            <div class="d-flex justify-content-between align-items-center mb-3">
                <p class="text-muted fs-15 mb-0">
                    {{ meta.total }} programs
                    <template v-if="filters.university_id">
                        · filtered to <strong>{{ universityName || `university #${filters.university_id}` }}</strong>
                        <button type="button" class="btn btn-link btn-sm p-0 ms-1 align-baseline" @click="clearUniversityFilter">clear</button>
                    </template>
                </p>
                <p class="text-muted fs-14 mb-0">Catalog data must be verified on the official source before applying.</p>
            </div>

            <EmptyState v-if="!programs.length" icon="school" title="No programs found" message="Adjust the filters or search for a different subject." />

            <div v-else class="row g-4">
                <div v-for="program in programs" :key="program.id" class="col-md-6 col-xxl-4">
                    <ProgramCard :program="program" @open="openProgram" @toggle-bookmark="toggleBookmark" />
                </div>
            </div>

            <Pagination :meta="meta" @change="load" />
        </template>

        <Modal
            :show="showDetail"
            :title="selected?.title ?? 'Program'"
            :subtitle="selected ? `${selected.university?.name ?? ''}${selected.university?.region ? ` · ${selected.university.region}` : ''}` : 'Loading program details…'"
            icon="school"
            size="lg"
            @close="showDetail = false"
        >
            <div v-if="detailLoading" class="text-center py-8"><span class="spinner-border text-primary"></span></div>
            <div v-else-if="selected" class="d-flex flex-column gap-4">
                <div class="d-flex flex-wrap gap-2 align-items-center justify-content-between">
                    <div>
                        <p class="text-muted fs-15 mb-1">{{ selected.university?.name }} · {{ selected.university?.region }}</p>
                        <div class="d-flex flex-wrap gap-2">
                            <StatusBadge v-if="selected.assessment" :status="selected.assessment.status" />
                            <SourceBadge :status="selected.verification_status" :verified-at="selected.source_verified_at" :sample="selected.is_sample" />
                        </div>
                    </div>
                    <span v-if="selected.bookmarked" class="badge bg-primary-subtle text-primary border border-primary-subtle">
                        <AppIcon name="bookmark-filled" :size="13" class="me-1" />Bookmarked
                    </span>
                </div>

                <div class="row g-3">
                    <div class="col-sm-6 col-lg-3"><p class="text-muted fs-14 mb-1">Tuition</p><p class="mb-0">{{ selected.tuition?.label }}</p></div>
                    <div class="col-sm-6 col-lg-3"><p class="text-muted fs-14 mb-1">Duration</p><p class="mb-0">{{ selected.duration_months ?? '—' }} months</p></div>
                    <div class="col-sm-6 col-lg-3"><p class="text-muted fs-14 mb-1">Language</p><p class="mb-0 text-uppercase">{{ selected.language }}</p></div>
                    <div class="col-sm-6 col-lg-3"><p class="text-muted fs-14 mb-1">Next deadline</p><p class="mb-0">{{ selected.next_call?.deadline ? formatDate(selected.next_call.deadline) : 'Not stored' }}</p></div>
                </div>

                <div v-if="selected.is_sample" class="alert alert-warning py-2 fs-15 mb-0">
                    <AppIcon name="info-circle" class="me-1" />
                    Demo catalog record. Dates and requirements are illustrative — confirm them on the official page before applying.
                </div>

                <div>
                    <h6 class="mb-2">Admission requirements</h6>
                    <div class="table-responsive">
                        <table class="table table-sm align-middle mb-0">
                            <tbody>
                                <tr v-for="row in requirementRows(selected)" :key="row.label">
                                    <th class="text-muted fw-medium" style="width: 240px">{{ row.label }}</th>
                                    <td>{{ row.value }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p class="text-muted fs-14 mb-0 mt-2">{{ selected.requirements?.prerequisites || 'No additional prerequisite text stored.' }}</p>
                </div>

                <div v-if="selected.required_documents?.length">
                    <h6 class="mb-2">Required documents</h6>
                    <div class="d-flex flex-wrap gap-2">
                        <span v-for="document in selected.required_documents" :key="document" class="badge bg-light text-body border">{{ document }}</span>
                    </div>
                </div>

                <div v-if="selected.assessment">
                    <h6 class="mb-3">Your assessment</h6>
                    <AssessmentDetails :assessment="selected.assessment" />
                </div>

                <div class="d-flex flex-wrap gap-2 border-top pt-3">
                    <a v-if="selected.source_url" :href="selected.source_url" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-light">
                        <AppIcon name="external-link" class="me-1" />Official program page
                    </a>
                    <a v-if="selected.application_url" :href="selected.application_url" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-light">
                        <AppIcon name="send" class="me-1" />Application page
                    </a>
                </div>
            </div>

            <template #footer>
                <button type="button" class="btn btn-light" @click="showDetail = false">Close</button>
                <button v-if="selected" type="button" class="btn btn-sub-primary" @click="toggleBookmark(selected)">
                    <AppIcon :name="selected.bookmarked ? 'bookmark-filled' : 'bookmark'" class="me-1" />
                    {{ selected.bookmarked ? 'Bookmarked' : 'Bookmark' }}
                </button>
                <button v-if="selected" type="button" class="btn btn-primary" @click="startApplication(selected)">Track application</button>
            </template>
        </Modal>
    </div>
</template>
