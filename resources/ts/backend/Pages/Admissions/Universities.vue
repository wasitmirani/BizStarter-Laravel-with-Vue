<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AdmissionsService from '../../Services/Admissions/AdmissionsService';
import { errorMessage } from '../../Services/Admissions/api';
import PageHeader from './Components/PageHeader.vue';
import EmptyState from './Components/EmptyState.vue';
import Pagination from './Components/Pagination.vue';

const route = useRoute();
const router = useRouter();

const filters = reactive({
    search: '',
    city: '',
    country: '',
    type: '',
    sort: 'name',
    page: 1,
});

const universities = ref<any[]>([]);
const meta = ref<any>({ current_page: 1, last_page: 1, total: 0, from: null, to: null });
const facets = reactive<{ cities: string[]; countries: Array<{ code: string; name: string }>; types: string[] }>({
    cities: [],
    countries: [],
    types: [],
});
const loading = ref(true);
const error = ref('');
const syncing = ref(false);
const syncNotice = ref('');

let debounce: number | undefined;

const load = async (page = filters.page) => {
    filters.page = page;
    loading.value = true;
    error.value = '';

    try {
        const result = await AdmissionsService.universities({
            search: filters.search || undefined,
            city: filters.city || undefined,
            country: filters.country || undefined,
            type: filters.type || undefined,
            sort: filters.sort,
            page,
            per_page: 12,
        });

        universities.value = result.universities ?? [];
        meta.value = result.meta ?? meta.value;

        if (result.facets) {
            facets.cities = result.facets.cities ?? [];
            facets.countries = result.facets.countries ?? [];
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
    debounce = window.setTimeout(() => load(1), 240);
};

const resetFilters = () => {
    filters.search = '';
    filters.city = '';
    filters.country = '';
    filters.type = '';
    filters.sort = 'name';
    router.replace({ name: 'universities' });
    load(1);
};

const syncCatalog = async () => {
    if (syncing.value) return;

    syncing.value = true;
    syncNotice.value = '';
    error.value = '';

    try {
        const result = await AdmissionsService.syncCatalog();
        const checked = Number(result.checked ?? 0);
        const ok = Number(result.ok ?? 0);
        const failed = Number(result.failed ?? 0);
        const remaining = Number(result.remaining ?? 0);

        const parts = [
            `Checked ${checked} source${checked === 1 ? '' : 's'}`,
            `${ok} reachable`,
        ];

        if (failed) parts.push(`${failed} failed`);
        if (remaining) parts.push(`${remaining} still queued — run sync again`);

        syncNotice.value = `${parts.join(' · ')}.`;
        await load();
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        syncing.value = false;
    }
};

const formatDate = (value?: string | null) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
};

const formatChecked = (value?: string | null) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
};

const location = (university: any) =>
    [university.city, university.country_name].filter(Boolean).join(' · ') || 'Europe';

const programsLabel = (count: number) => `${count} ${Number(count) === 1 ? 'program' : 'programs'}`;

watch(
    () => [filters.search, filters.city, filters.country, filters.type, filters.sort],
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

    const legacyUniversity = Number(route.query.university);
    if (legacyUniversity) {
        router.replace({ name: 'university', params: { id: legacyUniversity } });
        return;
    }

    await load(1);
});

onBeforeUnmount(() => window.clearTimeout(debounce));
</script>

<template>
    <div>
        <PageHeader
            title="Universities"
            subtitle="European catalog of public and private institutions. Filter by country, city and type, then open a profile with its stored programs."
        >
            <template #actions>
                <button type="button" class="btn btn-sm btn-light" :disabled="syncing" @click="syncCatalog">
                    <span v-if="syncing" class="spinner-border spinner-border-sm me-1" role="status"></span>
                    <AppIcon v-else name="refresh" class="me-1" />
                    {{ syncing ? 'Checking sources…' : 'Sync catalog' }}
                </button>
                <router-link :to="{ name: 'programs' }" class="btn btn-sm btn-light">
                    <AppIcon name="school" class="me-1" />Browse programs
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

        <div v-if="syncNotice" class="alert alert-success py-2 d-flex align-items-start gap-2">
            <AppIcon name="circle-check" :size="17" class="mt-1" />
            <span class="flex-grow-1">{{ syncNotice }}</span>
            <button type="button" class="btn-close" aria-label="Dismiss" @click="syncNotice = ''"></button>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <div class="row g-3 align-items-end">
                    <div class="col-lg-4">
                        <label class="form-label" for="university-search">Search the catalog</label>
                        <div class="position-relative">
                            <AppIcon name="search" :size="17" class="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                            <input
                                id="university-search"
                                v-model="filters.search"
                                type="search"
                                class="form-control"
                                style="padding-inline-start: 42px; padding-inline-end: 42px"
                                placeholder="University, city, country or subject"
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
                        <label class="form-label">City</label>
                        <select v-model="filters.city" class="form-select">
                            <option value="">All cities</option>
                            <option v-for="city in facets.cities" :key="city" :value="city">{{ city }}</option>
                        </select>
                    </div>
                    <div class="col-sm-6 col-lg-2">
                        <label class="form-label">Country</label>
                        <select v-model="filters.country" class="form-select">
                            <option value="">All countries</option>
                            <option v-for="country in facets.countries" :key="country.code" :value="country.code">{{ country.name }}</option>
                        </select>
                    </div>
                    <div class="col-sm-6 col-lg-2">
                        <label class="form-label">Type</label>
                        <select v-model="filters.type" class="form-select">
                            <option value="">All types</option>
                            <option
                                v-for="type in (facets.types.length ? facets.types : ['public', 'private'])"
                                :key="type"
                                :value="type"
                                class="text-capitalize"
                            >
                                {{ type }}
                            </option>
                        </select>
                    </div>
                    <div class="col-sm-6 col-lg-2">
                        <label class="form-label">Sort by</label>
                        <select v-model="filters.sort" class="form-select">
                            <option value="name">Name (A–Z)</option>
                            <option value="programs">Most programs</option>
                            <option value="country">Country</option>
                            <option value="updated">Recently updated</option>
                        </select>
                    </div>
                </div>
                <div class="d-flex justify-content-end mt-2">
                    <button type="button" class="btn btn-link btn-sm text-decoration-none" @click="resetFilters">
                        Reset filters
                    </button>
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
                                    <h6 class="mb-1 lh-sm">
                                        <router-link
                                            :to="{ name: 'university', params: { id: university.id } }"
                                            class="text-reset text-decoration-none stretched-link-title"
                                        >
                                            {{ university.name }}
                                        </router-link>
                                    </h6>
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
                                <span v-if="university.last_checked_at" class="d-inline-flex align-items-center gap-1">
                                    <AppIcon name="refresh" :size="14" />Checked {{ formatChecked(university.last_checked_at) }}
                                </span>
                                <span v-else-if="university.updated_at" class="d-inline-flex align-items-center gap-1">
                                    <AppIcon name="clock" :size="14" />Updated {{ formatDate(university.updated_at) }}
                                </span>
                            </div>

                            <div class="d-flex flex-wrap gap-2 mt-auto pt-3 border-top">
                                <router-link
                                    :to="{ name: 'university', params: { id: university.id } }"
                                    class="btn btn-sm btn-sub-primary"
                                >
                                    <AppIcon name="list-details" class="me-1" />View profile
                                </router-link>
                                <a
                                    v-if="university.official_website"
                                    :href="university.official_website"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="btn btn-sm btn-light"
                                >
                                    <AppIcon name="external-link" class="me-1" />Website
                                </a>
                                <router-link
                                    :to="{ name: 'programs', query: { university_id: university.id } }"
                                    class="btn btn-sm btn-light ms-auto"
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
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.16), rgba(139, 92, 246, 0.12));
    color: #4f46e5;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.04em;
}

[data-bs-theme="dark"] .university-mark {
    background: rgba(129, 140, 248, 0.18);
    color: #c7d2fe;
}

.university-description {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.stretched-link-title {
    transition: color 0.15s ease;
}

.stretched-link-title:hover {
    color: var(--dx-primary, #4f46e5) !important;
}
</style>
