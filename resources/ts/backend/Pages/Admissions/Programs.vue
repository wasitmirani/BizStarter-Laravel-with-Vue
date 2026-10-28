<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AdmissionsService from '../../Services/Admissions/AdmissionsService';
import { errorMessage } from '../../Services/Admissions/api';
import PageHeader from './Components/PageHeader.vue';
import ProgramCard from './Components/ProgramCard.vue';
import EmptyState from './Components/EmptyState.vue';
import Pagination from './Components/Pagination.vue';

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
    country: '',
    sort: 'deadline',
    has_open_call: true,
    university_id: '' as string | number,
    page: 1,
});

const universityName = ref('');

const programs = ref<any[]>([]);
const meta = ref<any>({ current_page: 1, last_page: 1, total: 0, from: null, to: null });
const facets = reactive<{ subject_areas: string[]; languages: string[]; countries: Array<{ code: string; name: string }> }>({
    subject_areas: [],
    languages: [],
    countries: [],
});
const loading = ref(true);
const error = ref('');

let debounce: number | undefined;

const load = async (page = filters.page) => {
    filters.page = page;
    loading.value = true;
    error.value = '';

    try {
        const result = await AdmissionsService.programs({
            search: filters.search || undefined,
            subject_area: filters.subject_area || undefined,
            language: filters.language || undefined,
            country: filters.country || undefined,
            sort: filters.sort,
            has_open_call: filters.has_open_call ? 1 : 0,
            university_id: filters.university_id || undefined,
            page,
            per_page: 12,
        });

        programs.value = result.programs ?? [];
        meta.value = result.meta ?? meta.value;
        if (result.facets) {
            facets.subject_areas = result.facets.subject_areas ?? [];
            facets.languages = result.facets.languages ?? [];
            facets.countries = result.facets.countries ?? [];
        }
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        loading.value = false;
    }
};

const scheduleLoad = () => {
    window.clearTimeout(debounce);
    debounce = window.setTimeout(() => load(1), 240);
};

const resetFilters = () => {
    filters.search = '';
    filters.subject_area = '';
    filters.language = '';
    filters.country = '';
    filters.sort = 'deadline';
    filters.has_open_call = true;
    filters.university_id = '';
    universityName.value = '';
    router.replace({ name: 'programs' });
    load(1);
};

const clearUniversityFilter = () => {
    filters.university_id = '';
    universityName.value = '';
    router.replace({ name: 'programs' });
    load(1);
};

const openProgram = (program: any) => router.push({ name: 'program', params: { id: program.id } });

const toggleBookmark = async (program: any) => {
    try {
        if (program.bookmarked) {
            await AdmissionsService.removeBookmark(program.id);
        } else {
            await AdmissionsService.bookmark(program.id);
        }
        program.bookmarked = !program.bookmarked;
    } catch (exception: any) {
        error.value = errorMessage(exception);
    }
};

watch(
    () => [filters.search, filters.subject_area, filters.language, filters.country, filters.sort, filters.has_open_call],
    scheduleLoad,
);

watch(
    () => route.query.search,
    (value) => {
        const next = typeof value === 'string' ? value : '';
        if (next !== filters.search) filters.search = next;
    },
);

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

    const legacyProgram = Number(route.query.program);
    if (legacyProgram) {
        router.replace({ name: 'program', params: { id: legacyProgram } });
        return;
    }

    await load(1);
});

onBeforeUnmount(() => window.clearTimeout(debounce));
</script>

<template>
    <div>
        <PageHeader
            title="Master's programs"
            subtitle="Search the shared European catalog by subject, language and country. Every record links back to its official source."
        >
            <template #actions>
                <router-link :to="{ name: 'universities' }" class="btn btn-sm btn-light">
                    <AppIcon name="building" class="me-1" />Universities
                </router-link>
                <router-link :to="{ name: 'matches' }" class="btn btn-sm btn-primary">
                    <AppIcon name="target-arrow" class="me-1" />My matches
                </router-link>
            </template>
        </PageHeader>

        <div v-if="error" class="alert alert-danger py-2 d-flex align-items-start gap-2">
            <AppIcon name="alert-circle" :size="17" class="mt-1" />
            <span>{{ error }}</span>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <div class="row g-3 align-items-end">
                    <div class="col-lg-3">
                        <label class="form-label" for="program-search">Search</label>
                        <div class="position-relative">
                            <AppIcon name="search" :size="17" class="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                            <input
                                id="program-search"
                                v-model="filters.search"
                                type="search"
                                class="form-control"
                                style="padding-inline-start: 42px; padding-inline-end: 42px"
                                placeholder="Program, subject or university"
                                autocomplete="off"
                            />
                            <span v-if="loading" class="spinner-border spinner-border-sm text-primary position-absolute top-50 end-0 translate-middle-y me-3"></span>
                        </div>
                    </div>
                    <div class="col-sm-6 col-lg-2">
                        <label class="form-label">Subject area</label>
                        <select v-model="filters.subject_area" class="form-select">
                            <option value="">All subjects</option>
                            <option v-for="subject in (facets.subject_areas.length ? facets.subject_areas : subjects)" :key="subject" :value="subject">
                                {{ subject }}
                            </option>
                        </select>
                    </div>
                    <div class="col-sm-6 col-lg-2">
                        <label class="form-label">Language</label>
                        <select v-model="filters.language" class="form-select">
                            <option value="">Any</option>
                            <option v-for="language in (facets.languages.length ? facets.languages : ['en', 'it'])" :key="language" :value="language">
                                {{ language === 'en' ? 'English' : language === 'it' ? 'Italian' : String(language).toUpperCase() }}
                            </option>
                        </select>
                    </div>
                    <div class="col-sm-6 col-lg-2">
                        <label class="form-label">Country</label>
                        <select v-model="filters.country" class="form-select">
                            <option value="">All countries</option>
                            <option v-for="country in facets.countries" :key="country.code" :value="country.code">{{ country.name }}</option>
                        </select>
                    </div>
                    <div class="col-sm-6 col-lg-3">
                        <label class="form-label">Sort by</label>
                        <select v-model="filters.sort" class="form-select">
                            <option value="deadline">Nearest deadline</option>
                            <option value="title">Title</option>
                            <option value="tuition_asc">Tuition: low to high</option>
                            <option value="tuition_desc">Tuition: high to low</option>
                        </select>
                    </div>
                    <div class="col-12 d-flex flex-wrap gap-3 align-items-center justify-content-between pt-1">
                        <label class="form-check mb-0">
                            <input v-model="filters.has_open_call" type="checkbox" class="form-check-input" />
                            <span class="form-check-label">Only programs with an open call</span>
                        </label>
                        <button type="button" class="btn btn-link btn-sm text-decoration-none" @click="resetFilters">
                            Reset filters
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
            <p class="text-muted fs-15 mb-0">
                <template v-if="meta.total">
                    Showing <strong>{{ meta.from }}–{{ meta.to }}</strong> of <strong>{{ meta.total }}</strong> programs
                </template>
                <template v-else>No programs match the current filters</template>
                <template v-if="filters.university_id">
                    · filtered to <strong>{{ universityName || `university #${filters.university_id}` }}</strong>
                    <button type="button" class="btn btn-link btn-sm p-0 ms-1 align-baseline" @click="clearUniversityFilter">clear</button>
                </template>
            </p>
            <p class="text-muted fs-14 mb-0 d-flex align-items-center gap-1">
                <AppIcon name="info-circle" :size="14" />
                Confirm requirements on the official source before applying.
            </p>
        </div>

        <div v-if="loading && !programs.length" class="row g-4">
            <div v-for="index in 6" :key="index" class="col-md-6 col-xxl-4">
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
                v-if="!programs.length"
                icon="school"
                title="No programs found"
                message="Adjust the filters, widen the country or turn off the open-call filter."
            >
                <button type="button" class="btn btn-sm btn-primary" @click="resetFilters">Clear filters</button>
            </EmptyState>

            <div v-else class="row g-4" :class="{ 'opacity-50': loading }">
                <div v-for="program in programs" :key="program.id" class="col-md-6 col-xxl-4">
                    <ProgramCard :program="program" @open="openProgram" @toggle-bookmark="toggleBookmark" />
                </div>
            </div>

            <Pagination :meta="meta" @change="load" />
        </template>
    </div>
</template>
