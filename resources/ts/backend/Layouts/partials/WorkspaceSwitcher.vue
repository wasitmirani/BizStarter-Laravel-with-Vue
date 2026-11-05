<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import WorkspaceService, { type WorkspaceCard } from '../../Services/Workspace/WorkspaceService';

const workspaces = ref<WorkspaceCard[]>([]);
const currentId = ref<number | null>(null);
const loading = ref(true);
const open = ref(false);
const switchingId = ref<number | null>(null);
const creating = ref(false);
const newName = ref('');
const saving = ref(false);
const error = ref<string | null>(null);
const root = ref<HTMLElement | null>(null);

const current = computed(
    () => workspaces.value.find((workspace) => workspace.id === currentId.value) ?? workspaces.value[0] ?? null,
);

const roleLabel = computed(() => {
    const role = current.value?.role ?? 'member';
    return role.charAt(0).toUpperCase() + role.slice(1);
});

const meta = computed(() => {
    if (!current.value) return 'Operations & access';
    return [current.value.plan, roleLabel.value].filter(Boolean).join(' · ');
});

async function load() {
    loading.value = true;
    error.value = null;

    try {
        const response = await WorkspaceService.list();
        const result = response.data?.result;
        workspaces.value = result?.workspaces ?? [];
        currentId.value = result?.current_id ?? workspaces.value[0]?.id ?? null;
    } catch {
        error.value = 'Could not load workspaces.';
    } finally {
        loading.value = false;
    }
}

function toggle() {
    open.value = !open.value;
    if (open.value) error.value = null;
}

async function choose(workspace: WorkspaceCard) {
    if (saving.value) return;

    if (workspace.id === currentId.value) {
        open.value = false;
        return;
    }

    switchingId.value = workspace.id;
    error.value = null;

    try {
        await WorkspaceService.switch(workspace.id);
        currentId.value = workspace.id;
        // Reload so every page and store picks up the new workspace context.
        window.location.assign('/app/dashboard');
    } catch (requestError: any) {
        error.value = requestError?.response?.data?.message ?? 'Could not switch workspace.';
        switchingId.value = null;
    }
}

function startCreate() {
    creating.value = true;
    newName.value = '';
    error.value = null;
}

async function create() {
    const name = newName.value.trim();

    if (!name) {
        error.value = 'Give your workspace a name.';
        return;
    }

    saving.value = true;
    error.value = null;

    try {
        await WorkspaceService.create(name);
        // The new workspace is provisioned as the current one on the server.
        window.location.assign('/app/dashboard');
    } catch (requestError: any) {
        error.value = requestError?.response?.data?.message ?? 'Could not create workspace.';
        saving.value = false;
    }
}

function initials(name?: string | null): string {
    return (name ?? 'W').trim().charAt(0).toUpperCase();
}

function onDocumentClick(event: MouseEvent) {
    if (!open.value) return;
    if (root.value && !root.value.contains(event.target as Node)) {
        open.value = false;
        creating.value = false;
    }
}

function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
        open.value = false;
        creating.value = false;
    }
}

onMounted(() => {
    load();
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
    <div ref="root" class="lk-sidebar__workspace lk-ws" :class="{ 'is-open': open }">
        <button
            type="button"
            class="lk-ws__trigger"
            :aria-expanded="open"
            aria-haspopup="menu"
            :title="current?.name ?? 'Workspace'"
            @click="toggle"
        >
            <span class="lk-sidebar__workspace-mark" aria-hidden="true">
                <span v-if="current" class="lk-ws__initial">{{ initials(current.name) }}</span>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/></svg>
            </span>
            <span class="lk-sidebar__workspace-text">
                <span class="lk-sidebar__workspace-name">{{ loading ? 'Loading…' : current?.name ?? 'Workspace' }}</span>
                <span class="lk-sidebar__workspace-meta">{{ meta }}</span>
            </span>
            <svg class="lk-ws__chevron" :class="{ 'is-open': open }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
        </button>

        <div v-if="open" class="lk-ws__menu" role="menu">
            <p class="lk-ws__menu-label">Switch workspace</p>

            <div v-if="loading" class="lk-ws__empty">Loading workspaces…</div>

            <button
                v-for="workspace in workspaces"
                v-else
                :key="workspace.id"
                type="button"
                class="lk-ws__item"
                :class="{ 'is-current': workspace.id === currentId }"
                role="menuitem"
                :disabled="switchingId !== null || saving"
                @click="choose(workspace)"
            >
                <span class="lk-ws__item-mark">{{ initials(workspace.name) }}</span>
                <span class="lk-ws__item-text">
                    <span class="lk-ws__item-name">{{ workspace.name }}</span>
                    <span class="lk-ws__item-meta">
                        {{ workspace.plan ?? 'No plan' }} · {{ workspace.role }}
                        <template v-if="workspace.members_count"> · {{ workspace.members_count }} member{{ workspace.members_count === 1 ? '' : 's' }}</template>
                    </span>
                </span>
                <span v-if="workspace.id === currentId" class="lk-ws__check" aria-label="Current workspace">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </span>
                <span v-else-if="switchingId === workspace.id" class="lk-ws__spinner" aria-hidden="true"></span>
            </button>

            <div v-if="!loading && !workspaces.length" class="lk-ws__empty">No workspaces yet.</div>

            <div class="lk-ws__divider"></div>

            <form v-if="creating" class="lk-ws__create" @submit.prevent="create">
                <input
                    v-model="newName"
                    class="lk-input lk-input--sm"
                    placeholder="Workspace name"
                    maxlength="120"
                    autofocus
                    @keydown.esc="creating = false"
                />
                <div class="lk-ws__create-actions">
                    <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" @click="creating = false">Cancel</button>
                    <button type="submit" class="lk-btn lk-btn--primary lk-btn--sm" :disabled="saving || !newName.trim()">
                        {{ saving ? 'Creating…' : 'Create' }}
                    </button>
                </div>
            </form>

            <button v-else type="button" class="lk-ws__create-link" role="menuitem" @click="startCreate">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                New workspace
            </button>

            <p v-if="error" class="lk-ws__error">{{ error }}</p>
        </div>
    </div>
</template>

<style scoped>
.lk-ws {
    position: relative;
    padding: 0;
    cursor: default;
}

.lk-ws__trigger {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 12px;
    border: 0;
    border-radius: inherit;
    background: transparent;
    color: inherit;
    text-align: left;
    cursor: pointer;
    min-width: 0;
}

.lk-ws__trigger:hover {
    background: rgba(148, 163, 184, 0.08);
}

.lk-ws__trigger:focus-visible {
    outline: 2px solid #34d399;
    outline-offset: -2px;
}

.lk-ws__initial {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.02em;
}

.lk-sidebar__workspace-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
}

.lk-sidebar__workspace-name {
    overflow: hidden;
    text-overflow: ellipsis;
}

.lk-sidebar__workspace-meta {
    overflow: hidden;
    text-overflow: ellipsis;
}

.lk-ws__chevron {
    flex-shrink: 0;
    color: var(--lk-sidebar-muted);
    transition: transform 160ms ease;
}

.lk-ws__chevron.is-open {
    transform: rotate(180deg);
}

.lk-ws__menu {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    z-index: 1060;
    width: 272px;
    padding: 8px;
    border-radius: 12px;
    background: #0f172a;
    border: 1px solid rgba(148, 163, 184, 0.22);
    box-shadow: 0 18px 40px rgba(2, 6, 23, 0.45);
    color: #e2e8f0;
}

.lk-ws__menu-label {
    margin: 4px 8px 6px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--lk-sidebar-muted);
}

.lk-ws__item {
    display: flex;
    align-items: center;
    gap: 9px;
    width: 100%;
    padding: 8px;
    border: 0;
    border-radius: 9px;
    background: transparent;
    color: inherit;
    text-align: left;
    cursor: pointer;
}

.lk-ws__item:hover {
    background: rgba(148, 163, 184, 0.12);
}

.lk-ws__item.is-current {
    background: rgba(5, 150, 105, 0.14);
}

.lk-ws__item:disabled {
    cursor: progress;
    opacity: 0.75;
}

.lk-ws__item-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 7px;
    background: rgba(148, 163, 184, 0.18);
    color: #cbd5f5;
    font-size: 11px;
    font-weight: 700;
    flex-shrink: 0;
}

.lk-ws__item.is-current .lk-ws__item-mark {
    background: rgba(52, 211, 153, 0.2);
    color: #34d399;
}

.lk-ws__item-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
}

.lk-ws__item-name {
    font-size: 12.5px;
    font-weight: 600;
    color: #e2e8f0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.lk-ws__item-meta {
    font-size: 10.5px;
    color: var(--lk-sidebar-muted);
    text-transform: capitalize;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.lk-ws__check {
    color: #34d399;
    display: inline-flex;
    flex-shrink: 0;
}

.lk-ws__spinner {
    width: 13px;
    height: 13px;
    border-radius: 999px;
    border: 2px solid rgba(148, 163, 184, 0.35);
    border-top-color: #34d399;
    animation: lk-ws-spin 700ms linear infinite;
    flex-shrink: 0;
}

@keyframes lk-ws-spin {
    to {
        transform: rotate(360deg);
    }
}

.lk-ws__empty {
    padding: 10px 8px;
    font-size: 12px;
    color: var(--lk-sidebar-muted);
}

.lk-ws__divider {
    height: 1px;
    margin: 6px 4px;
    background: rgba(148, 163, 184, 0.16);
}

.lk-ws__create {
    display: grid;
    gap: 8px;
    padding: 4px;
}

.lk-ws__create-actions {
    display: flex;
    justify-content: flex-end;
    gap: 6px;
}

.lk-ws__create-link {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px;
    border: 0;
    border-radius: 9px;
    background: transparent;
    color: #a7f3d0;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
}

.lk-ws__create-link:hover {
    background: rgba(52, 211, 153, 0.12);
}

.lk-ws__error {
    margin: 6px 8px 2px;
    font-size: 11.5px;
    color: #fca5a5;
}

:global(.lk-app.is-collapsed .lk-ws__trigger) {
    justify-content: center;
    padding: 0;
}

:global(.lk-app.is-collapsed .lk-ws__chevron) {
    display: none;
}

:global(.lk-app.is-collapsed .lk-ws__menu) {
    left: calc(100% + 8px);
    top: 0;
}
</style>
