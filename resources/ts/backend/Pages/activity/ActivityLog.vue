<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import ActivityService from '../../Services/Activity/ActivityService';
import { Helpers } from '../../Utils/Helper';

const loading = ref(true);
const error = ref('');
const activities = ref<any>({ data: [], current_page: 1, last_page: 1, total: 0, from: 0, to: 0 });
const events = ref<string[]>([]);

const filters = ref({
    search: '',
    event: '',
    from: '',
    to: '',
});

const page = ref(1);
const perPage = ref(15);

let debounce: number | null = null;

const rows = computed<any[]>(() => activities.value?.data ?? []);
const hasFilters = computed(() => Boolean(filters.value.search || filters.value.event || filters.value.from || filters.value.to));

function subjectLabel(activity: any): string {
    if (!activity?.subject_type) return '—';
    const parts = String(activity.subject_type).split('\\');
    return parts[parts.length - 1] ?? '—';
}

function eventTone(event?: string | null): string {
    switch ((event ?? '').toLowerCase()) {
        case 'created':
            return 'lk-badge--success';
        case 'updated':
            return 'lk-badge--info';
        case 'deleted':
            return 'lk-badge--error';
        case 'restored':
            return 'lk-badge--warning';
        default:
            return 'lk-badge--neutral';
    }
}

async function fetchActivities() {
    loading.value = true;
    error.value = '';

    try {
        const response = await ActivityService.list({
            page: page.value,
            per_page: perPage.value,
            search: filters.value.search.trim() || undefined,
            event: filters.value.event || undefined,
            from: filters.value.from || undefined,
            to: filters.value.to || undefined,
        });

        activities.value = response.data?.result?.activities ?? activities.value;
        events.value = response.data?.result?.events ?? [];
    } catch (requestError: any) {
        error.value = requestError?.response?.data?.message ?? 'Could not load the activity log.';
    } finally {
        loading.value = false;
    }
}

function applyFilters() {
    page.value = 1;
    void fetchActivities();
}

function clearFilters() {
    filters.value = { search: '', event: '', from: '', to: '' };
    applyFilters();
}

function goTo(target: number) {
    const last = Number(activities.value?.last_page ?? 1);
    if (target < 1 || target > last || target === page.value) return;
    page.value = target;
    void fetchActivities();
}

watch(
    () => filters.value.search,
    () => {
        if (debounce) window.clearTimeout(debounce);
        debounce = window.setTimeout(applyFilters, 300);
    },
);

watch(() => filters.value.event, applyFilters);
watch(() => filters.value.from, applyFilters);
watch(() => filters.value.to, applyFilters);

onMounted(() => {
    void fetchActivities();
});

onBeforeUnmount(() => {
    if (debounce) window.clearTimeout(debounce);
});

const pageButtons = computed(() => {
    const last = Number(activities.value?.last_page ?? 1);
    const current = Number(activities.value?.current_page ?? 1);
    const start = Math.max(1, Math.min(current - 2, last - 4));
    const end = Math.min(last, start + 4);
    return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);
});
</script>

<template>
    <div>
        <header class="lk-page-head">
            <div>
                <h1 class="lk-page-title">Activity log</h1>
                <p class="lk-page-subtitle">
                    Every change recorded by the audit trail, with the person who made it and when.
                </p>
            </div>
            <div class="lk-page-actions">
                <span class="lk-badge lk-badge--neutral">{{ activities.total ?? 0 }} events</span>
            </div>
        </header>

        <section class="lk-card" aria-label="Activity filters">
            <div class="lk-card__body lk-filter-bar">
                <label class="lk-filter-field lk-filter-field--grow">
                    <span class="lk-label">Search</span>
                    <input
                        v-model="filters.search"
                        type="search"
                        class="lk-input"
                        placeholder="Search descriptions…"
                        aria-label="Search activity descriptions"
                    />
                </label>

                <label class="lk-filter-field">
                    <span class="lk-label">Event</span>
                    <select v-model="filters.event" class="lk-select" aria-label="Filter by event type">
                        <option value="">All events</option>
                        <option v-for="event in events" :key="event" :value="event">{{ event }}</option>
                    </select>
                </label>

                <label class="lk-filter-field">
                    <span class="lk-label">From</span>
                    <input v-model="filters.from" type="date" class="lk-input" aria-label="Activity from date" />
                </label>

                <label class="lk-filter-field">
                    <span class="lk-label">To</span>
                    <input v-model="filters.to" type="date" class="lk-input" aria-label="Activity to date" />
                </label>

                <button v-if="hasFilters" type="button" class="lk-btn lk-btn--secondary lk-btn--sm" @click="clearFilters">
                    Clear filters
                </button>
            </div>
        </section>

        <section class="lk-card" style="margin-top: 16px" aria-live="polite">
            <div v-if="loading" class="lk-card__body">
                <div v-for="index in 6" :key="index" class="lk-activity-item" style="border-bottom: 1px solid var(--lk-border)">
                    <span class="lk-skeleton" style="width: 8px; height: 8px; border-radius: 50%; margin-top: 7px"></span>
                    <span style="flex: 1">
                        <span class="lk-skeleton" style="display: block; width: 60%; height: 12px"></span>
                        <span class="lk-skeleton" style="display: block; width: 35%; height: 10px; margin-top: 8px"></span>
                    </span>
                </div>
            </div>

            <div v-else-if="error" class="lk-state lk-state--error">
                <p class="lk-state__title">Activity unavailable</p>
                <p class="lk-state__text">{{ error }}</p>
                <button type="button" class="lk-btn lk-btn--secondary lk-btn--sm" style="margin-top: 8px" @click="fetchActivities">
                    Try again
                </button>
            </div>

            <div v-else-if="!rows.length" class="lk-state">
                <span class="lk-state__icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                </span>
                <p class="lk-state__title">No matching activity</p>
                <p class="lk-state__text">
                    {{ hasFilters ? 'Try loosening the filters to see more events.' : 'Audit events will appear here as soon as changes are made.' }}
                </p>
            </div>

            <div v-else class="lk-table-wrap">
                <table class="lk-table">
                    <thead>
                        <tr>
                            <th scope="col">Event</th>
                            <th scope="col">Description</th>
                            <th scope="col">Subject</th>
                            <th scope="col">Actor</th>
                            <th scope="col">When</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="activity in rows" :key="activity.id">
                            <td>
                                <span class="lk-badge" :class="eventTone(activity.event)">
                                    {{ activity.event ?? 'event' }}
                                </span>
                            </td>
                            <td>
                                <span class="lk-table__strong">{{ activity.description }}</span>
                            </td>
                            <td>
                                {{ subjectLabel(activity) }}
                                <template v-if="activity.subject_id"> #{{ activity.subject_id }}</template>
                            </td>
                            <td>
                                <span class="lk-actor">
                                    <img v-if="activity.causer?.thumbnail" :src="activity.causer.thumbnail" alt="" class="lk-avatar lk-avatar--sm" />
                                    <span v-else class="lk-avatar lk-avatar--sm lk-avatar--initials">
                                        {{ activity.causer?.name?.charAt(0)?.toUpperCase() ?? 'S' }}
                                    </span>
                                    {{ activity.causer?.name ?? 'System' }}
                                </span>
                            </td>
                            <td>
                                <span class="lk-table__meta">{{ Helpers.DateTimeFormat(activity.created_at) }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="!loading && !error && rows.length" class="lk-pagination">
                <p class="lk-pagination__meta">
                    Showing {{ activities.from ?? 0 }}–{{ activities.to ?? 0 }} of {{ activities.total ?? 0 }}
                </p>
                <div class="lk-pagination__buttons">
                    <button type="button" :disabled="page <= 1" aria-label="Previous page" @click="goTo(page - 1)">‹</button>
                    <button
                        v-for="button in pageButtons"
                        :key="button"
                        type="button"
                        :class="{ 'is-active': button === page }"
                        :aria-current="button === page ? 'page' : undefined"
                        @click="goTo(button)"
                    >
                        {{ button }}
                    </button>
                    <button type="button" :disabled="page >= (activities.last_page ?? 1)" aria-label="Next page" @click="goTo(page + 1)">›</button>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.lk-filter-bar {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    flex-wrap: wrap;
}

.lk-filter-field {
    display: flex;
    flex-direction: column;
    min-width: 150px;
}

.lk-filter-field--grow {
    flex: 1;
    min-width: 220px;
}

.lk-table__strong {
    color: var(--lk-text);
    font-weight: 500;
}

.lk-table__meta {
    color: var(--lk-text-muted);
    font-size: 12px;
    white-space: nowrap;
}

.lk-actor {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    white-space: nowrap;
}

@media (max-width: 767.98px) {
    .lk-filter-field,
    .lk-filter-field--grow {
        min-width: 100%;
    }
}
</style>
