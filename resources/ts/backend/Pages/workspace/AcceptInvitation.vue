<script setup lang="ts">
import { inject, onMounted, ref, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import WorkspaceService from '../../Services/Workspace/WorkspaceService';
import { useAuthStore } from '../../../shared/stores/authStore';

const toast = inject<Ref<any>>('toast', ref(null));
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
authStore.initFromWindow();

const token = String(route.params.token ?? '');
const joining = ref(false);
const joined = ref(false);
const error = ref('');

async function accept() {
    joining.value = true;
    error.value = '';

    try {
        await WorkspaceService.acceptInvitation(token);
        joined.value = true;
        toast.value?.showToast(200, 'Welcome aboard', { message: 'You joined the workspace.' });
        setTimeout(() => {
            void router.push({ name: 'team' });
        }, 700);
    } catch (requestError: any) {
        error.value = requestError?.response?.data?.message ?? 'This invitation is invalid or has expired.';
    } finally {
        joining.value = false;
    }
}

onMounted(() => {
    if (!token) {
        error.value = 'This invitation link is incomplete.';
    }
});
</script>

<template>
    <div class="lk-invite">
        <section class="lk-card">
            <div class="lk-card__body lk-invite__body">
                <span class="lk-invite__icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></svg>
                </span>
                <h1 class="lk-page-title">Join this workspace</h1>
                <p class="lk-page-subtitle">
                    You are signed in as {{ authStore.user?.email }}. Accept the invitation to collaborate with this team.
                </p>

                <div v-if="error" class="lk-inline-note lk-inline-note--error" role="alert" style="margin-top: 14px">
                    {{ error }}
                </div>
                <div v-if="joined" class="lk-inline-note lk-inline-note--success" role="status" style="margin-top: 14px">
                    Invitation accepted. Taking you to the team page…
                </div>

                <button
                    type="button"
                    class="lk-btn lk-btn--primary"
                    style="margin-top: 16px"
                    :disabled="joining || joined || !token"
                    @click="accept"
                >
                    {{ joining ? 'Joining…' : joined ? 'Joined' : 'Accept invitation' }}
                </button>

                <p class="lk-hint" style="margin-top: 12px">
                    <router-link :to="{ name: 'dashboard' }">Back to dashboard</router-link>
                </p>
            </div>
        </section>
    </div>
</template>

<style scoped>
.lk-invite {
    display: flex;
    justify-content: center;
    padding-top: 40px;
}

.lk-invite .lk-card {
    width: min(460px, 100%);
}

.lk-invite__body {
    text-align: center;
    padding: 30px 26px;
}

.lk-invite__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: var(--lk-primary-subtle);
    color: var(--lk-primary-active);
    margin-bottom: 14px;
}
</style>
