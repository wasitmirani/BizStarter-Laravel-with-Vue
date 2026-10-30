<script setup lang="ts">
import { computed, inject, onMounted, ref, type Ref } from 'vue';
import ReportService from '../../Services/Report/ReportService';

const toast = inject<Ref<any>>('toast', ref(null));

const loading = ref(true);
const error = ref('');
const summary = ref<any>(null);
const exporting = ref(false);

const filters = ref({
    search: '',
    role: '',
    status: '',
    from: '',
    to: '',
});

const users = computed(() => summary.value?.users ?? { total: 0, active: 0, inactive: 0 });
const roles = computed<any[]>(() => summary.value?.roles ?? []);
const permissions = computed(() => summary.value?.permissions ?? { total: 0 });

const activeShare = computed(() => {
    const total = Number(users.value.total ?? 0);
    if (!total) return 0;
    return Math.round((Number(users.value.active ?? 0) / total) * 100);
});

function formatNumber(value: number | null | undefined): string {
    return new Intl.NumberFormat().format(Number(value ?? 0));
}

async function load() {
    loading.value = true;
    error.value = '';

    try {
        const response = await ReportService.summary();
        summary.value = response.data?.result ?? null;
    } catch (requestError: any) {
        error.value = requestError?.response?.data?.message ?? 'Could not load report data.';
    } finally {
        loading.value = false;
    }
}

async function exportCsv() {
    exporting.value = true;

    try {
        const response = await ReportService.exportUsers({
            search: filters.value.search.trim() || undefined,
            role: filters.value.role || undefined,
            status: filters.value.status || undefined,
            from: filters.value.from || undefined,
            to: filters.value.to || undefined,
        });

        const disposition = response.headers?.['content-disposition'] as string | undefined;
        const match = disposition?.match(/filename="?([^";]+)"?/i);
        const filename = match?.[1] ?? `users-report-${new Date().toISOString().slice(0, 10)}.csv`;

        const url = URL.createObjectURL(response.data);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(url);

        toast.value?.showToast(200, 'Export ready', {
            message: 'Your user report has been downloaded.',
        });
    } catch (requestError: any) {
        const message =
            requestError?.response?.data?.message ?? 'The export could not be generated. Please try again.';
        toast.value?.showToast(422, 'Export failed', { message });
    } finally {
        exporting.value = false;
    }
}

function resetFilters() {
    filters.value = { search: '', role: '', status: '', from: '', to: '' };
}

onMounted(() => {
    void load();
});
</script>

<template>
    <div>
        <header class="lk-page-head">
            <div>
                <h1 class="lk-page-title">Reports</h1>
                <p class="lk-page-subtitle">
                    Live access-control totals and a filtered user export you can hand to compliance.
                </p>
            </div>
            <div class="lk-page-actions">
                <button type="button" class="lk-btn lk-btn--secondary" :disabled="loading" @click="load">
                    Refresh
                </button>
            </div>
        </header>

        <div v-if="loading" class="lk-kpi-grid" aria-busy="true" aria-label="Loading report summary">
            <div v-for="index in 3" :key="index" class="lk-kpi">
                <span class="lk-skeleton" style="display: block; width: 50%; height: 12px"></span>
                <span class="lk-skeleton" style="display: block; width: 40%; height: 30px; margin-top: 14px"></span>
            </div>
        </div>

        <div v-else-if="error" class="lk-card">
            <div class="lk-state lk-state--error">
                <p class="lk-state__title">Report summary unavailable</p>
                <p class="lk-state__text">{{ error }}</p>
                <button type="button" class="lk-btn lk-btn--secondary lk-btn--sm" style="margin-top: 8px" @click="load">
                    Try again
                </button>
            </div>
        </div>

        <template v-else>
            <section class="lk-kpi-grid lk-kpi-grid--three" aria-label="Report totals">
                <article class="lk-kpi">
                    <div class="lk-kpi__top">
                        <span class="lk-kpi__label">Users</span>
                    </div>
                    <p class="lk-kpi__value">{{ formatNumber(users.total) }}</p>
                    <div class="lk-kpi__footer">
                        <span class="lk-badge lk-badge--success">{{ formatNumber(users.active) }} active</span>
                        <span class="lk-badge lk-badge--neutral">{{ formatNumber(users.inactive) }} inactive</span>
                    </div>
                </article>

                <article class="lk-kpi">
                    <div class="lk-kpi__top">
                        <span class="lk-kpi__label">Active share</span>
                    </div>
                    <p class="lk-kpi__value">{{ activeShare }}%</p>
                    <div class="lk-kpi__footer">
                        <div class="lk-meter" role="img" :aria-label="`${activeShare}% of users are active`">
                            <span :style="{ width: activeShare + '%' }"></span>
                        </div>
                    </div>
                </article>

                <article class="lk-kpi">
                    <div class="lk-kpi__top">
                        <span class="lk-kpi__label">Permissions</span>
                    </div>
                    <p class="lk-kpi__value">{{ formatNumber(permissions.total) }}</p>
                    <div class="lk-kpi__footer">
                        <span>Across {{ formatNumber(roles.length) }} roles</span>
                    </div>
                </article>
            </section>

            <div class="lk-grid-2">
                <section class="lk-card">
                    <div class="lk-card__head">
                        <div>
                            <h2 class="lk-card__title">Users per role</h2>
                            <p class="lk-card__meta">Current assignments, highest first</p>
                        </div>
                    </div>
                    <div v-if="roles.length" class="lk-table-wrap">
                        <table class="lk-table">
                            <thead>
                                <tr>
                                    <th scope="col">Role</th>
                                    <th scope="col">Users</th>
                                    <th scope="col">Share</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="role in roles" :key="role.name">
                                    <td class="lk-table__strong">{{ role.name }}</td>
                                    <td>{{ formatNumber(role.users_count) }}</td>
                                    <td>
                                        <div class="lk-meter lk-meter--sm" role="img" :aria-label="`${role.users_count} users in ${role.name}`">
                                            <span
                                                :style="{
                                                    width: (users.total ? Math.round((role.users_count / users.total) * 100) : 0) + '%',
                                                }"
                                            ></span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else class="lk-state">
                        <p class="lk-state__title">No roles yet</p>
                        <p class="lk-state__text">Create roles to see how users are distributed.</p>
                    </div>
                </section>

                <section class="lk-card" aria-label="User export">
                    <div class="lk-card__head">
                        <div>
                            <h2 class="lk-card__title">Export users</h2>
                            <p class="lk-card__meta">CSV with name, email, roles, status and join date</p>
                        </div>
                    </div>
                    <div class="lk-card__body">
                        <div class="lk-form-grid">
                            <label class="lk-field lk-field--full">
                                <span class="lk-label">Search</span>
                                <input
                                    v-model="filters.search"
                                    type="search"
                                    class="lk-input"
                                    placeholder="Name or email"
                                    aria-label="Search users for export"
                                />
                            </label>

                            <label class="lk-field">
                                <span class="lk-label">Role</span>
                                <select v-model="filters.role" class="lk-select" aria-label="Filter export by role">
                                    <option value="">All roles</option>
                                    <option v-for="role in roles" :key="role.name" :value="role.name">{{ role.name }}</option>
                                </select>
                            </label>

                            <label class="lk-field">
                                <span class="lk-label">Status</span>
                                <select v-model="filters.status" class="lk-select" aria-label="Filter export by status">
                                    <option value="">All statuses</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </label>

                            <label class="lk-field">
                                <span class="lk-label">Joined from</span>
                                <input v-model="filters.from" type="date" class="lk-input" aria-label="Joined from" />
                            </label>

                            <label class="lk-field">
                                <span class="lk-label">Joined to</span>
                                <input v-model="filters.to" type="date" class="lk-input" aria-label="Joined to" />
                            </label>
                        </div>

                        <div class="lk-export-actions">
                            <button type="button" class="lk-btn lk-btn--ghost" @click="resetFilters">Reset</button>
                            <button type="button" class="lk-btn lk-btn--primary" :disabled="exporting" @click="exportCsv">
                                <span v-if="exporting" class="lk-btn__spinner" aria-hidden="true"></span>
                                {{ exporting ? 'Preparing…' : 'Download CSV' }}
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </template>
    </div>
</template>

<style scoped>
.lk-kpi-grid--three {
    grid-template-columns: repeat(3, minmax(0, 1fr));
}

.lk-meter {
    width: 100%;
    height: 8px;
    border-radius: 999px;
    background: var(--lk-surface);
    overflow: hidden;
}

.lk-meter--sm {
    height: 6px;
    min-width: 90px;
}

.lk-meter span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--lk-primary);
}

.lk-table__strong {
    color: var(--lk-text);
    font-weight: 600;
    text-transform: capitalize;
}

.lk-form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
}

.lk-field {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.lk-field--full {
    grid-column: 1 / -1;
}

.lk-export-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 16px;
}

@media (max-width: 1279.98px) {
    .lk-kpi-grid--three {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 767.98px) {
    .lk-kpi-grid--three {
        grid-template-columns: minmax(0, 1fr);
    }

    .lk-form-grid {
        grid-template-columns: minmax(0, 1fr);
    }
}
</style>
