<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AdmissionsService from '../../Services/Admissions/AdmissionsService';
import { errorMessage, validationErrors } from '../../Services/Admissions/api';
import PageHeader from '../Admissions/Components/PageHeader.vue';
import EmptyState from '../Admissions/Components/EmptyState.vue';
import FilterTabs from '../Admissions/Components/FilterTabs.vue';
import ConfirmDialog from '../Admissions/Components/ConfirmDialog.vue';
import Modal from '../Admissions/Components/Modal.vue';

const route = useRoute();
const router = useRouter();

const statusOptions = [
    { key: 'pending', label: 'Pending' },
    { key: 'in_progress', label: 'In progress' },
    { key: 'done', label: 'Done' },
];

const tabs = computed(() => [{ key: '', label: 'All' }, ...statusOptions]);

const filters = reactive({ status: '', open_only: false });
const tasks = ref<any[]>([]);
const applications = ref<any[]>([]);
const loading = ref(true);
const saving = ref(false);
const busyId = ref<number | null>(null);
const error = ref('');
const notice = ref('');

const showForm = ref(false);
const editingId = ref<number | null>(null);
const errors = ref<Record<string, string[]>>({});
const confirmTarget = ref<any>(null);

const blank = () => ({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
    status: 'pending',
    user_application_id: '' as string | number,
});

const form = reactive(blank());

const openTasks = computed(() => tasks.value.filter((task) => task.status !== 'done').length);

const load = async () => {
    loading.value = true;
    error.value = '';
    try {
        const result = await AdmissionsService.tasks({ ...filters, open_only: filters.open_only ? 1 : 0 });
        tasks.value = result.tasks;
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        loading.value = false;
    }
};

const loadApplications = async () => {
    try {
        const result = await AdmissionsService.applications({ per_page: 100 });
        applications.value = result.applications;
    } catch {
        // Linking a task to an application is optional.
    }
};

const clearDeepLink = () => {
    if (!route.query.new) return;
    const query = { ...route.query };
    delete query.new;
    void router.replace({ name: 'tasks', query });
};

const openCreate = async () => {
    if (applications.value.length === 0) await loadApplications();
    Object.assign(form, blank());
    editingId.value = null;
    errors.value = {};
    error.value = '';
    notice.value = '';
    showForm.value = true;
    clearDeepLink();
};

const openEdit = async (task: any) => {
    if (applications.value.length === 0) await loadApplications();
    Object.assign(form, {
        title: task.title,
        description: task.description ?? '',
        due_date: (task.due_date ?? '').slice(0, 10),
        priority: task.priority ?? 'medium',
        status: task.status ?? 'pending',
        user_application_id: task.user_application_id ?? '',
    });
    editingId.value = task.id;
    errors.value = {};
    error.value = '';
    notice.value = '';
    showForm.value = true;
};

const payload = () => ({
    title: form.title,
    description: form.description || null,
    due_date: form.due_date || null,
    priority: form.priority,
    status: form.status,
    user_application_id: form.user_application_id === '' ? null : Number(form.user_application_id),
});

const submit = async () => {
    saving.value = true;
    errors.value = {};
    error.value = '';
    try {
        if (editingId.value) {
            await AdmissionsService.updateTask(editingId.value, payload());
            notice.value = 'Task updated.';
        } else {
            await AdmissionsService.createTask(payload());
            notice.value = 'Task added.';
        }
        showForm.value = false;
        await load();
    } catch (exception: any) {
        errors.value = validationErrors(exception);
        error.value = errorMessage(exception);
    } finally {
        saving.value = false;
    }
};

const toggleDone = async (task: any) => {
    busyId.value = task.id;
    try {
        await AdmissionsService.updateTask(task.id, {
            title: task.title,
            description: task.description ?? null,
            due_date: task.due_date ?? null,
            priority: task.priority ?? 'medium',
            status: task.status === 'done' ? 'pending' : 'done',
            user_application_id: task.user_application_id ?? null,
        });
        await load();
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        busyId.value = null;
    }
};

const askRemove = (task: any) => {
    confirmTarget.value = task;
};

const remove = async () => {
    const task = confirmTarget.value;
    if (!task) return;

    busyId.value = task.id;
    try {
        await AdmissionsService.deleteTask(task.id);
        notice.value = 'Task deleted.';
        confirmTarget.value = null;
        await load();
    } catch (exception: any) {
        error.value = errorMessage(exception);
    } finally {
        busyId.value = null;
    }
};

const selectStatus = (status: string) => {
    filters.status = status;
    filters.open_only = false;
    load();
};

const parseDate = (value: string) => new Date(`${value.slice(0, 10)}T00:00:00`);

const dueClass = (task: any) => {
    if (!task.due_date || task.status === 'done') return 'text-muted';
    const due = parseDate(task.due_date).getTime();
    const today = new Date(new Date().toDateString()).getTime();
    const days = Math.round((due - today) / 86400000);

    if (days < 0) return 'text-danger fw-semibold';
    if (days <= 7) return 'text-warning fw-semibold';
    return 'text-muted';
};

const priorityTone = (priority?: string | null) => {
    if (priority === 'high') return 'bg-danger-subtle text-danger border-danger-subtle';
    if (priority === 'low') return 'bg-secondary-subtle text-secondary border-secondary-subtle';
    return 'bg-warning-subtle text-warning border-warning-subtle';
};

const formatDate = (value?: string | null) =>
    value ? parseDate(value).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : 'No due date';

onMounted(async () => {
    await Promise.all([load(), loadApplications()]);
    if (route.query.new) {
        await openCreate();
    }
});

watch(
    () => route.query.new,
    (value) => {
        if (value) void openCreate();
    },
);
</script>

<template>
    <div>
        <PageHeader title="Tasks" subtitle="Deadlines, document prep and follow-ups — visible only to you.">
            <template #actions>
                <span class="badge bg-warning-subtle text-warning border border-warning-subtle">{{ openTasks }} open</span>
                <button type="button" class="btn btn-sm btn-primary" @click="openCreate">
                    <AppIcon name="plus" class="me-1" />Add task
                </button>
            </template>
        </PageHeader>

        <div v-if="error" class="alert alert-danger d-flex align-items-center gap-2 py-2">
            <AppIcon name="alert-triangle" :size="16" />
            <span class="flex-grow-1">{{ error }}</span>
            <button type="button" class="btn-close" aria-label="Dismiss" @click="error = ''"></button>
        </div>
        <div v-if="notice" class="alert alert-success d-flex align-items-center gap-2 py-2">
            <AppIcon name="circle-check" :size="16" />
            <span class="flex-grow-1">{{ notice }}</span>
            <button type="button" class="btn-close" aria-label="Dismiss" @click="notice = ''"></button>
        </div>

        <div class="card">
            <div class="card-header d-flex flex-wrap gap-3 justify-content-between align-items-center">
                <div>
                    <h5 class="card-title mb-0">Task list</h5>
                    <p class="text-muted fs-14 mb-0">{{ tasks.length }} shown · {{ openTasks }} still open</p>
                </div>
                <label class="form-check form-switch mb-0">
                    <input v-model="filters.open_only" type="checkbox" class="form-check-input" @change="filters.status = ''; load()" />
                    <span class="form-check-label fs-15">Only open tasks</span>
                </label>
            </div>

            <div class="card-body border-bottom py-2">
                <FilterTabs :model-value="filters.status" :tabs="tabs" label="Task status" @update:model-value="selectStatus" />
            </div>

            <div v-if="loading" class="card-body text-center py-10"><span class="spinner-border text-primary"></span></div>

            <template v-else>
                <div v-if="tasks.length" class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-borderless align-middle mb-0">
                            <thead class="border-bottom">
                                <tr>
                                    <th class="text-muted fw-medium" style="width: 56px"><span class="visually-hidden">Done</span></th>
                                    <th class="text-muted fw-medium">Task</th>
                                    <th class="text-muted fw-medium">Application</th>
                                    <th class="text-muted fw-medium">Due</th>
                                    <th class="text-muted fw-medium">Priority</th>
                                    <th class="text-muted fw-medium text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="task in tasks" :key="task.id" :class="task.status === 'done' ? 'opacity-75' : ''">
                                    <td>
                                        <input
                                            type="checkbox"
                                            class="form-check-input"
                                            :checked="task.status === 'done'"
                                            :disabled="busyId === task.id"
                                            :aria-label="`Toggle ${task.title}`"
                                            @change="toggleDone(task)"
                                        />
                                    </td>
                                    <td style="min-width: 240px">
                                        <p class="mb-0 fw-medium" :class="task.status === 'done' ? 'text-decoration-line-through text-muted' : ''">{{ task.title }}</p>
                                        <p v-if="task.description" class="text-muted fs-14 mb-0">{{ task.description }}</p>
                                    </td>
                                    <td class="text-muted fs-15">
                                        <template v-if="task.application?.program">
                                            {{ task.application.program.title }}
                                        </template>
                                        <span v-else>—</span>
                                    </td>
                                    <td class="fs-15 text-nowrap" :class="dueClass(task)">{{ formatDate(task.due_date) }}</td>
                                    <td>
                                        <span class="badge border text-capitalize" :class="priorityTone(task.priority)">{{ task.priority }}</span>
                                    </td>
                                    <td class="text-end">
                                        <div class="d-flex justify-content-end gap-2">
                                            <button type="button" class="btn btn-icon btn-sub-primary size-7-5" aria-label="Edit task" @click="openEdit(task)">
                                                <AppIcon name="edit" :size="16" />
                                            </button>
                                            <button
                                                type="button"
                                                class="btn btn-icon btn-sub-danger size-7-5"
                                                aria-label="Delete task"
                                                :disabled="busyId === task.id"
                                                @click="askRemove(task)"
                                            >
                                                <AppIcon name="trash" :size="16" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div v-else class="card-body">
                    <EmptyState
                        icon="checks"
                        title="No tasks"
                        message="Add the next action for each application so nothing gets missed."
                    >
                        <button type="button" class="btn btn-sm btn-primary" @click="openCreate">Add the first task</button>
                    </EmptyState>
                </div>
            </template>
        </div>

        <Modal
            :show="showForm"
            :title="editingId ? 'Edit task' : 'Add task'"
            :subtitle="editingId ? 'Adjust the deadline, priority or linked application.' : 'Capture the next action so nothing slips past a deadline.'"
            icon="checks"
            size="lg"
            @close="showForm = false"
        >
            <form id="task-form" class="row g-3" @submit.prevent="submit">
                <div class="col-12">
                    <label class="form-label">Title</label>
                    <input v-model="form.title" type="text" class="form-control" required placeholder="Request transcript translation" />
                    <p v-if="errors.title" class="text-danger fs-14 mb-0">{{ errors.title[0] }}</p>
                </div>

                <div class="col-md-6">
                    <label class="form-label">Due date</label>
                    <input v-model="form.due_date" type="date" class="form-control" />
                </div>
                <div class="col-md-3">
                    <label class="form-label">Priority</label>
                    <select v-model="form.priority" class="form-select">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Status</label>
                    <select v-model="form.status" class="form-select">
                        <option v-for="status in statusOptions" :key="status.key" :value="status.key">{{ status.label }}</option>
                    </select>
                </div>

                <div class="col-12">
                    <label class="form-label">Linked application (optional)</label>
                    <select v-model="form.user_application_id" class="form-select">
                        <option value="">Not linked</option>
                        <option v-for="application in applications" :key="application.id" :value="application.id">
                            {{ application.program?.title }} — {{ application.program?.university?.name }}
                        </option>
                    </select>
                </div>

                <div class="col-12">
                    <label class="form-label">Description</label>
                    <textarea v-model="form.description" rows="3" class="form-control"></textarea>
                </div>

                <div v-if="error" class="col-12">
                    <p class="text-danger fs-14 mb-0">{{ error }}</p>
                </div>
            </form>

            <template #footer>
                <button type="button" class="btn btn-light" @click="showForm = false">Cancel</button>
                <button type="submit" form="task-form" class="btn btn-primary" :disabled="saving">
                    <span v-if="saving" class="spinner-border spinner-border-sm me-1" role="status"></span>
                    {{ saving ? 'Saving…' : editingId ? 'Save changes' : 'Add task' }}
                </button>
            </template>
        </Modal>

        <ConfirmDialog
            :show="!!confirmTarget"
            title="Delete task?"
            :message="`Delete “${confirmTarget?.title ?? 'this task'}”? This only removes the task, not the linked application.`"
            :busy="busyId !== null"
            @cancel="confirmTarget = null"
            @confirm="remove"
        />
    </div>
</template>
