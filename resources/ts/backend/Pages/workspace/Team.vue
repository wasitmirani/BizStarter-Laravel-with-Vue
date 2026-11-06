<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref, type Ref } from 'vue';
import WorkspaceService, {
    type WorkspaceInvitation,
    type WorkspaceMember,
    type WorkspacePayload,
} from '../../Services/Workspace/WorkspaceService';
import { useAuthStore } from '../../../shared/stores/authStore';

const toast = inject<Ref<any>>('toast', ref(null));
const authStore = useAuthStore();
authStore.initFromWindow();

const loading = ref(true);
const error = ref('');
const data = ref<WorkspacePayload | null>(null);
const savingWorkspace = ref(false);
const inviting = ref(false);
const busyMember = ref<number | null>(null);
const createdInvite = ref<{ url: string; email: string } | null>(null);
const leaving = ref(false);
const deleting = ref(false);
const showDelete = ref(false);
const deleteName = ref('');

const settings = reactive({ name: '', currency: 'USD', timezone: 'UTC' });
const inviteForm = reactive({ email: '', role: 'member' });

const members = computed<WorkspaceMember[]>(() => data.value?.members ?? []);
const invitations = computed<WorkspaceInvitation[]>(() => data.value?.invitations ?? []);
const pendingInvites = computed(() => invitations.value.filter((invite) => invite.status === 'pending'));

const canManage = computed(() => {
    if (!data.value) return false;
    const me = authStore.user;
    if (!me) return false;

    if (Number(data.value.workspace.owner?.id) === Number(me.id)) return true;

    const globalRoles = (me.roles ?? []).map((role) => role.name);
    if (globalRoles.includes('super-admin') || globalRoles.includes('admin')) return true;

    const membership = members.value.find((member) => Number(member.user?.id) === Number(me.id));
    return membership?.role === 'admin' || membership?.role === 'owner';
});

const seatUsage = computed(() => data.value?.usage?.members ?? { used: 0, limit: 0, unlimited: false, percent: 0 });

const isOwner = computed(() => {
    if (!data.value) return false;
    return Number(data.value.workspace.owner?.id) === Number(authStore.user?.id);
});

const myMembership = computed<WorkspaceMember | null>(() => {
    const me = authStore.user;
    if (!me) return null;
    return members.value.find((member) => Number(member.user?.id) === Number(me.id)) ?? null;
});

function formatDate(value?: string | null): string {
    if (!value) return '—';
    return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}

function initials(name?: string | null): string {
    return (name ?? '?')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
}

function roleLabel(role: string): string {
    return role === 'owner' ? 'Owner' : role === 'admin' ? 'Admin' : 'Member';
}

function isMe(member: WorkspaceMember): boolean {
    return Number(member.user?.id) === Number(authStore.user?.id);
}

function apply(next: WorkspacePayload) {
    data.value = next;
    settings.name = next.workspace.name;
    settings.currency = next.workspace.currency;
    settings.timezone = next.workspace.timezone;
}

async function load() {
    loading.value = true;
    error.value = '';

    try {
        const response = await WorkspaceService.show();
        apply(response.data.result);
    } catch (requestError: any) {
        error.value = requestError?.response?.data?.message ?? 'We could not load this workspace.';
    } finally {
        loading.value = false;
    }
}

async function saveWorkspace() {
    savingWorkspace.value = true;

    try {
        const response = await WorkspaceService.update({
            name: settings.name,
            currency: settings.currency,
            timezone: settings.timezone,
        });
        apply(response.data.result);
        toast.value?.showToast(200, 'Workspace updated', { message: 'Your workspace settings are saved.' });
    } catch (requestError: any) {
        toast.value?.showToast(requestError?.response?.status ?? 500, 'Could not save workspace', {
            message: requestError?.response?.data?.message ?? 'Try again in a moment.',
        });
    } finally {
        savingWorkspace.value = false;
    }
}

async function invite() {
    if (!inviteForm.email.trim()) return;
    inviting.value = true;
    createdInvite.value = null;

    try {
        const response = await WorkspaceService.invite({
            email: inviteForm.email.trim(),
            role: inviteForm.role,
        });
        const invitation = response.data?.result?.invitation;
        if (invitation) {
            createdInvite.value = { url: invitation.url, email: invitation.email };
        }
        inviteForm.email = '';
        invitationInviteToast();
        await load();
    } catch (requestError: any) {
        toast.value?.showToast(requestError?.response?.status ?? 500, 'Invitation not sent', {
            message: requestError?.response?.data?.message ?? 'Check the email address and try again.',
        });
    } finally {
        inviting.value = false;
    }
}

function invitationInviteToast() {
    toast.value?.showToast(201, 'Invitation ready', {
        message: 'Share the invite link with your teammate.',
    });
}

async function copyInvite(url: string) {
    try {
        await navigator.clipboard.writeText(url);
        toast.value?.showToast(200, 'Link copied', { message: 'Invite link copied to your clipboard.' });
    } catch {
        toast.value?.showToast(500, 'Copy failed', { message: url });
    }
}

async function revoke(invitation: WorkspaceInvitation) {
    try {
        await WorkspaceService.revokeInvitation(invitation.id);
        toast.value?.showToast(200, 'Invitation revoked');
        await load();
    } catch (requestError: any) {
        toast.value?.showToast(500, 'Could not revoke invitation', {
            message: requestError?.response?.data?.message ?? 'Try again.',
        });
    }
}

async function changeRole(member: WorkspaceMember, role: string) {
    busyMember.value = member.id;

    try {
        await WorkspaceService.updateMember(member.id, role);
        toast.value?.showToast(200, 'Role updated', { message: `${member.user?.name ?? 'Member'} is now ${roleLabel(role)}.` });
        await load();
    } catch (requestError: any) {
        toast.value?.showToast(500, 'Could not update role', {
            message: requestError?.response?.data?.message ?? 'Try again.',
        });
    } finally {
        busyMember.value = null;
    }
}

async function remove(member: WorkspaceMember) {
    const confirmed = window.confirm(`Remove ${member.user?.name ?? 'this member'} from the workspace?`);
    if (!confirmed) return;

    busyMember.value = member.id;

    try {
        await WorkspaceService.removeMember(member.id);
        toast.value?.showToast(200, 'Member removed');
        await load();
    } catch (requestError: any) {
        toast.value?.showToast(500, 'Could not remove member', {
            message: requestError?.response?.data?.message ?? 'Try again.',
        });
    } finally {
        busyMember.value = null;
    }
}

async function leaveWorkspace() {
    if (!window.confirm('Leave this workspace? You will need a new invitation to return.')) {
        return;
    }

    leaving.value = true;

    try {
        await WorkspaceService.leave();
        window.location.assign('/app/dashboard');
    } catch (requestError: any) {
        toast.value?.showToast(requestError?.response?.status ?? 500, 'Could not leave workspace', {
            message: requestError?.response?.data?.message ?? 'Try again.',
        });
        leaving.value = false;
    }
}

async function deleteWorkspace() {
    if (!data.value) return;

    if (deleteName.value.trim() !== data.value.workspace.name) {
        toast.value?.showToast(422, 'Name does not match', {
            message: 'Type the workspace name exactly to confirm deletion.',
        });
        return;
    }

    deleting.value = true;

    try {
        await WorkspaceService.destroy(deleteName.value.trim());
        window.location.assign('/app/dashboard');
    } catch (requestError: any) {
        toast.value?.showToast(requestError?.response?.status ?? 500, 'Could not delete workspace', {
            message: requestError?.response?.data?.message ?? 'Try again.',
        });
        deleting.value = false;
    }
}

onMounted(() => {
    void load();
});
</script>

<template>
    <div>
        <header class="lk-page-head">
            <div>
                <h1 class="lk-page-title">Team</h1>
                <p class="lk-page-subtitle">Invite teammates, assign roles and keep seats under control.</p>
            </div>
            <div class="lk-page-actions">
                <span class="lk-badge lk-badge--neutral">
                    {{ seatUsage.used }} / {{ seatUsage.unlimited ? '∞' : seatUsage.limit }} seats
                </span>
            </div>
        </header>

        <div v-if="loading" class="lk-kpi-grid" aria-busy="true">
            <div v-for="index in 3" :key="index" class="lk-kpi">
                <span class="lk-skeleton" style="display: block; width: 50%; height: 12px"></span>
                <span class="lk-skeleton" style="display: block; width: 55%; height: 28px; margin-top: 14px"></span>
            </div>
        </div>

        <div v-else-if="error" class="lk-card">
            <div class="lk-state lk-state--error">
                <p class="lk-state__title">Workspace unavailable</p>
                <p class="lk-state__text">{{ error }}</p>
                <button type="button" class="lk-btn lk-btn--secondary lk-btn--sm" style="margin-top: 8px" @click="load">
                    Try again
                </button>
            </div>
        </div>

        <template v-else-if="data">
            <section class="lk-kpi-grid lk-kpi-grid--three" aria-label="Workspace statistics">
                <article class="lk-kpi">
                    <div class="lk-kpi__top"><span class="lk-kpi__label">Members</span></div>
                    <p class="lk-kpi__value">{{ data.stats.members }}</p>
                    <div class="lk-kpi__footer"><span class="lk-badge lk-badge--success">Active team</span></div>
                </article>
                <article class="lk-kpi">
                    <div class="lk-kpi__top"><span class="lk-kpi__label">Pending invites</span></div>
                    <p class="lk-kpi__value">{{ data.stats.pending_invitations }}</p>
                    <div class="lk-kpi__footer"><span class="lk-badge lk-badge--neutral">Expire in 7 days</span></div>
                </article>
                <article class="lk-kpi">
                    <div class="lk-kpi__top"><span class="lk-kpi__label">Seats used</span></div>
                    <p class="lk-kpi__value">{{ seatUsage.percent }}%</p>
                    <div class="lk-kpi__footer">
                        <span class="lk-badge" :class="seatUsage.percent >= 90 ? 'lk-badge--warning' : 'lk-badge--neutral'">
                            {{ data.plan?.name ?? 'No plan' }} plan
                        </span>
                    </div>
                </article>
            </section>

            <div class="lk-team-grid">
                <section class="lk-card">
                    <div class="lk-card__head">
                        <div>
                            <h2 class="lk-card__title">Members</h2>
                            <p class="lk-card__meta">People with access to this workspace</p>
                        </div>
                    </div>
                    <div class="lk-card__body lk-card__body--flush">
                        <div class="lk-table-wrap">
                            <table class="lk-table">
                                <thead>
                                    <tr>
                                        <th>Member</th>
                                        <th>Role</th>
                                        <th>Joined</th>
                                        <th v-if="canManage" aria-label="Actions"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="member in members" :key="member.id">
                                        <td>
                                            <div class="lk-member">
                                                <img
                                                    v-if="member.user?.thumbnail"
                                                    :src="member.user.thumbnail"
                                                    alt=""
                                                    class="lk-avatar lk-avatar--sm"
                                                />
                                                <span v-else class="lk-avatar lk-avatar--sm lk-avatar--initials">
                                                    {{ initials(member.user?.name) }}
                                                </span>
                                                <span>
                                                    <span class="lk-member__name">
                                                        {{ member.user?.name ?? 'Unknown' }}
                                                        <span v-if="isMe(member)" class="lk-badge lk-badge--info">You</span>
                                                    </span>
                                                    <span class="lk-member__email">{{ member.user?.email }}</span>
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <select
                                                v-if="canManage && !member.is_owner"
                                                class="lk-select lk-select--sm"
                                                :value="member.role"
                                                :disabled="busyMember === member.id"
                                                @change="changeRole(member, ($event.target as HTMLSelectElement).value)"
                                            >
                                                <option value="admin">Admin</option>
                                                <option value="member">Member</option>
                                            </select>
                                            <span v-else class="lk-badge lk-badge--neutral">
                                                {{ member.is_owner ? 'Owner' : roleLabel(member.role) }}
                                            </span>
                                        </td>
                                        <td class="lk-muted">{{ formatDate(member.joined_at) }}</td>
                                        <td v-if="canManage">
                                            <button
                                                v-if="!member.is_owner"
                                                type="button"
                                                class="lk-btn lk-btn--ghost lk-btn--sm"
                                                :disabled="busyMember === member.id"
                                                @click="remove(member)"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <div class="lk-team-side">
                    <section v-if="canManage" class="lk-card">
                        <div class="lk-card__head">
                            <div>
                                <h2 class="lk-card__title">Invite a teammate</h2>
                                <p class="lk-card__meta">Seat limits are enforced by your plan</p>
                            </div>
                        </div>
                        <div class="lk-card__body">
                            <form novalidate @submit.prevent="invite">
                                <label class="lk-field">
                                    <span class="lk-label">Email address</span>
                                    <input
                                        v-model="inviteForm.email"
                                        type="email"
                                        class="lk-input"
                                        placeholder="teammate@company.com"
                                        autocomplete="email"
                                        required
                                    />
                                </label>
                                <label class="lk-field" style="margin-top: 10px">
                                    <span class="lk-label">Role</span>
                                    <select v-model="inviteForm.role" class="lk-select">
                                        <option value="member">Member — use the workspace</option>
                                        <option value="admin">Admin — manage the workspace</option>
                                    </select>
                                </label>
                                <button type="submit" class="lk-btn lk-btn--primary" style="margin-top: 12px; width: 100%" :disabled="inviting">
                                    {{ inviting ? 'Creating invite…' : 'Create invite link' }}
                                </button>
                            </form>

                            <div v-if="createdInvite" class="lk-invite-result">
                                <p class="lk-label">Invite link for {{ createdInvite.email }}</p>
                                <div class="lk-invite-result__row">
                                    <input class="lk-input lk-input--sm" :value="createdInvite.url" readonly />
                                    <button type="button" class="lk-btn lk-btn--secondary lk-btn--sm" @click="copyInvite(createdInvite.url)">
                                        Copy
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section class="lk-card">
                        <div class="lk-card__head">
                            <div>
                                <h2 class="lk-card__title">Workspace settings</h2>
                                <p class="lk-card__meta">Shown across billing, invoices and invites</p>
                            </div>
                        </div>
                        <div class="lk-card__body">
                            <form novalidate @submit.prevent="saveWorkspace">
                                <label class="lk-field">
                                    <span class="lk-label">Workspace name</span>
                                    <input v-model="settings.name" class="lk-input" :disabled="!canManage" required />
                                </label>
                                <div class="lk-form-grid" style="margin-top: 10px">
                                    <label class="lk-field">
                                        <span class="lk-label">Currency</span>
                                        <select v-model="settings.currency" class="lk-select" :disabled="!canManage">
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                            <option value="GBP">GBP</option>
                                            <option value="AED">AED</option>
                                            <option value="PKR">PKR</option>
                                            <option value="INR">INR</option>
                                        </select>
                                    </label>
                                    <label class="lk-field">
                                        <span class="lk-label">Timezone</span>
                                        <input v-model="settings.timezone" class="lk-input" :disabled="!canManage" />
                                    </label>
                                </div>
                                <button v-if="canManage" type="submit" class="lk-btn lk-btn--secondary" style="margin-top: 12px" :disabled="savingWorkspace">
                                    {{ savingWorkspace ? 'Saving…' : 'Save changes' }}
                                </button>
                            </form>
                        </div>
                    </section>

                    <section v-if="isOwner || myMembership" class="lk-card lk-danger-zone">
                        <div class="lk-card__head">
                            <div>
                                <h2 class="lk-card__title">Danger zone</h2>
                                <p class="lk-card__meta">These actions change your access permanently</p>
                            </div>
                        </div>
                        <div class="lk-card__body">
                            <template v-if="isOwner">
                                <p class="lk-danger-zone__title">Delete this workspace</p>
                                <p class="lk-danger-zone__text">
                                    Permanently removes contacts, conversations, campaigns, templates, billing history and every member.
                                    This cannot be undone.
                                </p>

                                <div v-if="showDelete" class="lk-danger-zone__confirm">
                                    <label class="lk-field">
                                        <span class="lk-label">
                                            Type <strong>{{ data.workspace.name }}</strong> to confirm
                                        </span>
                                        <input v-model="deleteName" class="lk-input" :placeholder="data.workspace.name" autocomplete="off" />
                                    </label>
                                    <div class="lk-danger-zone__actions">
                                        <button type="button" class="lk-btn lk-btn--ghost lk-btn--sm" @click="showDelete = false; deleteName = ''">
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            class="lk-btn lk-btn--danger lk-btn--sm"
                                            :disabled="deleting || deleteName.trim() !== data.workspace.name"
                                            @click="deleteWorkspace"
                                        >
                                            {{ deleting ? 'Deleting…' : 'Delete workspace' }}
                                        </button>
                                    </div>
                                </div>

                                <button v-else type="button" class="lk-btn lk-btn--danger lk-btn--sm" @click="showDelete = true">
                                    Delete workspace
                                </button>
                            </template>

                            <template v-else>
                                <p class="lk-danger-zone__title">Leave this workspace</p>
                                <p class="lk-danger-zone__text">
                                    You will lose access to its inbox, contacts and campaigns until you are invited again.
                                </p>
                                <button type="button" class="lk-btn lk-btn--danger lk-btn--sm" :disabled="leaving" @click="leaveWorkspace">
                                    {{ leaving ? 'Leaving…' : 'Leave workspace' }}
                                </button>
                            </template>
                        </div>
                    </section>
                </div>
            </div>

            <section class="lk-card" style="margin-top: 16px">
                <div class="lk-card__head">
                    <div>
                        <h2 class="lk-card__title">Invitations</h2>
                        <p class="lk-card__meta">Pending, expired and accepted invites</p>
                    </div>
                    <span class="lk-badge lk-badge--neutral">{{ pendingInvites.length }} pending</span>
                </div>
                <div class="lk-card__body lk-card__body--flush">
                    <div v-if="!invitations.length" class="lk-state">
                        <p class="lk-state__title">No invitations yet</p>
                        <p class="lk-state__text">Invite a teammate to start collaborating.</p>
                    </div>
                    <div v-else class="lk-table-wrap">
                        <table class="lk-table">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Expires</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="invitation in invitations" :key="invitation.id">
                                    <td>{{ invitation.email }}</td>
                                    <td>{{ roleLabel(invitation.role) }}</td>
                                    <td>
                                        <span
                                            class="lk-badge"
                                            :class="{
                                                'lk-badge--success': invitation.status === 'accepted',
                                                'lk-badge--warning': invitation.status === 'pending',
                                                'lk-badge--neutral': invitation.status === 'expired',
                                            }"
                                        >
                                            {{ invitation.status }}
                                        </span>
                                    </td>
                                    <td class="lk-muted">{{ formatDate(invitation.expires_at) }}</td>
                                    <td class="lk-table__actions">
                                        <button
                                            v-if="invitation.status === 'pending'"
                                            type="button"
                                            class="lk-btn lk-btn--ghost lk-btn--sm"
                                            @click="copyInvite(invitation.url)"
                                        >
                                            Copy link
                                        </button>
                                        <button
                                            v-if="canManage && invitation.status !== 'accepted'"
                                            type="button"
                                            class="lk-btn lk-btn--ghost lk-btn--sm"
                                            @click="revoke(invitation)"
                                        >
                                            Revoke
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </template>
    </div>
</template>

<style scoped>
.lk-team-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.65fr) minmax(0, 1fr);
    gap: 16px;
    align-items: start;
}

.lk-kpi-grid--three {
    grid-template-columns: repeat(3, minmax(0, 1fr));
}

@media (max-width: 900px) {
    .lk-kpi-grid--three {
        grid-template-columns: minmax(0, 1fr);
    }
}

.lk-team-side {
    display: grid;
    gap: 16px;
}

.lk-member {
    display: flex;
    align-items: center;
    gap: 10px;
}

.lk-member__name {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    color: var(--lk-text);
}

.lk-member__email {
    display: block;
    font-size: 11.5px;
    color: var(--lk-text-muted);
}

.lk-muted {
    color: var(--lk-text-muted);
    font-size: 12px;
}

.lk-table__actions {
    text-align: right;
    white-space: nowrap;
}

.lk-invite-result {
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid var(--lk-border);
}

.lk-invite-result__row {
    display: flex;
    gap: 6px;
    margin-top: 6px;
}

.lk-invite-result__row .lk-input {
    flex: 1;
    min-width: 0;
}

@media (max-width: 1023.98px) {
    .lk-team-grid {
        grid-template-columns: minmax(0, 1fr);
    }
}

.lk-danger-zone {
    border-color: color-mix(in srgb, var(--lk-error) 35%, var(--lk-border));
}

.lk-danger-zone__title {
    margin: 0 0 4px;
    font-size: 13px;
    font-weight: 700;
    color: var(--lk-error);
}

.lk-danger-zone__text {
    margin: 0 0 12px;
    font-size: 12.5px;
    line-height: 1.5;
    color: var(--lk-text-muted);
}

.lk-danger-zone__confirm {
    display: grid;
    gap: 10px;
}

.lk-danger-zone__actions {
    display: flex;
    justify-content: flex-end;
    gap: 6px;
}
</style>
