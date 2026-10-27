<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import AdmissionsService from '../../Services/Admissions/AdmissionsService';
import { errorMessage } from '../../Services/Admissions/api';
import PageHeader from '../Admissions/Components/PageHeader.vue';
import EmptyState from '../Admissions/Components/EmptyState.vue';
import SourceBadge from '../Admissions/Components/SourceBadge.vue';
import Modal from '../Admissions/Components/Modal.vue';

const filters = reactive({ search: '', type: '', has_open_call: true });
const scholarships = ref<any[]>([]);
const loading = ref(true);
const error = ref('');
const selected = ref<any>(null);

let searchTimer: number | null = null;

const load = async () => {
    loading.value = true;
    error.value = '';
    try {
        const result = await AdmissionsService.scholarships({ ...filters, has_open_call: filters.has_open_call ? 1 : 0, per_page: 50 });
        scholarships.value = result.scholarships;
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        loading.value = false;
    }
};

watch(
    () => filters.search,
    () => {
        if (searchTimer) window.clearTimeout(searchTimer);
        searchTimer = window.setTimeout(() => void load(), 300);
    },
);

onMounted(load);

const formatDate = (value?: string | null) =>
    value
        ? new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
        : '—';

const openDetails = (scholarship: any) => {
    selected.value = scholarship;
};
</script>

<template>
    <div>
        <PageHeader title="Scholarships" subtitle="Regional DSU schemes and national programs, with their official source links.">
            <template #actions>
                <span class="badge bg-primary-subtle text-primary border border-primary-subtle">{{ scholarships.length }} opportunities</span>
            </template>
        </PageHeader>

        <div v-if="error" class="alert alert-danger d-flex align-items-center gap-2 py-2">
            <AppIcon name="alert-triangle" :size="16" />
            <span class="flex-grow-1">{{ error }}</span>
            <button type="button" class="btn-close" aria-label="Dismiss" @click="error = ''"></button>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <form class="row g-3 align-items-end" @submit.prevent="load">
                    <div class="col-md-6">
                        <label class="form-label" for="scholarship-search">Search</label>
                        <div class="position-relative">
                            <input
                                id="scholarship-search"
                                v-model="filters.search"
                                type="search"
                                class="form-control ps-9"
                                placeholder="Scholarship or provider"
                            />
                            <AppIcon name="search" :size="16" class="text-muted position-absolute top-50 start-0 ms-3 translate-middle-y" />
                        </div>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label" for="scholarship-type">Type</label>
                        <select id="scholarship-type" v-model="filters.type" class="form-select" @change="load">
                            <option value="">All types</option>
                            <option value="regional">Regional</option>
                            <option value="national">National</option>
                        </select>
                    </div>
                    <div class="col-md-3 d-flex flex-wrap gap-3 align-items-center justify-content-md-end">
                        <label class="form-check form-switch mb-0">
                            <input v-model="filters.has_open_call" type="checkbox" class="form-check-input" @change="load" />
                            <span class="form-check-label fs-15">Open calls only</span>
                        </label>
                        <button type="submit" class="btn btn-sm btn-primary">
                            <AppIcon name="search" class="me-1" />Search
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="loading" class="card">
            <div class="card-body text-center py-10"><span class="spinner-border text-primary"></span></div>
        </div>

        <template v-else>
            <EmptyState
                v-if="!scholarships.length"
                icon="award"
                title="No scholarships found"
                message="Adjust the filters to see more opportunities."
            />

            <div v-else class="row g-4">
                <div v-for="scholarship in scholarships" :key="scholarship.id" class="col-md-6">
                    <div class="card h-100">
                        <div class="card-body d-flex flex-column gap-2">
                            <div class="d-flex gap-3 justify-content-between align-items-start">
                                <div class="d-flex gap-3">
                                    <span class="avatar bg-warning-subtle text-warning rounded flex-shrink-0">
                                        <AppIcon name="award" :size="18" />
                                    </span>
                                    <div>
                                        <h6 class="mb-1">{{ scholarship.name }}</h6>
                                        <p class="text-muted fs-15 mb-0">{{ scholarship.provider }}</p>
                                    </div>
                                </div>
                                <span class="badge bg-light text-body border text-capitalize">{{ scholarship.type }}</span>
                            </div>

                            <p class="text-muted fs-14 mb-0">{{ scholarship.description }}</p>

                            <p class="fs-14 mb-0 text-muted">
                                <AppIcon name="map-pin" class="me-1" />{{ scholarship.region ?? 'Italy' }}
                                <template v-if="scholarship.next_call?.deadline">
                                    · <AppIcon name="calendar-event" class="me-1" />Deadline {{ formatDate(scholarship.next_call.deadline) }}
                                </template>
                            </p>

                            <div v-if="scholarship.eligibility_criteria?.length" class="d-flex flex-wrap gap-1">
                                <span v-for="criterion in scholarship.eligibility_criteria" :key="criterion" class="badge bg-light text-body border">{{ criterion }}</span>
                            </div>

                            <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-auto pt-3 border-top">
                                <SourceBadge :status="scholarship.verification_status" :verified-at="scholarship.verified_at" :sample="scholarship.is_sample" />
                                <div class="d-flex gap-2">
                                    <button type="button" class="btn btn-sm btn-light" @click="openDetails(scholarship)">Details</button>
                                    <a
                                        v-if="scholarship.application_url"
                                        :href="scholarship.application_url"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="btn btn-sm btn-sub-primary"
                                    >
                                        Official page <AppIcon name="external-link" class="ms-1" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <Modal
            :show="!!selected"
            :title="selected?.name ?? 'Scholarship'"
            :subtitle="selected?.provider"
            icon="award"
            size="lg"
            @close="selected = null"
        >
            <div v-if="selected" class="d-flex flex-column gap-3">
                <div class="d-flex flex-wrap gap-2 align-items-center">
                    <span class="badge bg-light text-body border text-capitalize">{{ selected.type }}</span>
                    <span class="badge bg-light text-body border">{{ selected.region ?? 'Italy' }}</span>
                    <span v-if="selected.next_call?.deadline" class="badge bg-warning-subtle text-warning border border-warning-subtle">
                        Deadline {{ formatDate(selected.next_call.deadline) }}
                    </span>
                    <SourceBadge :status="selected.verification_status" :verified-at="selected.verified_at" :sample="selected.is_sample" />
                </div>

                <p class="mb-0">{{ selected.description }}</p>

                <div v-if="selected.eligibility_criteria?.length">
                    <p class="text-muted fs-14 mb-2">Eligibility criteria</p>
                    <div class="d-flex flex-wrap gap-1">
                        <span v-for="criterion in selected.eligibility_criteria" :key="criterion" class="badge bg-light text-body border">{{ criterion }}</span>
                    </div>
                </div>

                <div v-if="selected.benefits">
                    <p class="text-muted fs-14 mb-1">Benefits</p>
                    <p class="mb-0">{{ selected.benefits }}</p>
                </div>

                <p class="text-muted fs-14 mb-0">
                    Always confirm amounts, deadlines and eligibility on the official provider page before applying.
                </p>
            </div>

            <template #footer>
                <button type="button" class="btn btn-light" @click="selected = null">Close</button>
                <a
                    v-if="selected?.application_url"
                    :href="selected.application_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-primary"
                >
                    Open official page <AppIcon name="external-link" class="ms-1" />
                </a>
            </template>
        </Modal>
    </div>
</template>
