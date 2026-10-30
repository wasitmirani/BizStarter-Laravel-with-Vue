<template>
    <div class="lk-card">
        <div class="lk-state" style="padding: 56px 24px">
            <p class="lk-error-code">401</p>
            <h1 class="lk-state__title">You are not authorised</h1>
            <p class="lk-state__text">
                Your role does not include the permission required for this page. Ask an administrator to review your access.
            </p>
            <div class="lk-page-actions" style="justify-content: center; margin-top: 16px">
                <router-link to="/app/dashboard" class="lk-btn lk-btn--primary">Back to dashboard</router-link>
                <router-link to="/app/settings/user-account" class="lk-btn lk-btn--secondary">My profile</router-link>
            </div>
        </div>
    </div>
</template>

<style scoped>
.lk-error-code {
    margin: 0;
    font-size: 54px;
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1;
    color: var(--lk-primary);
}
</style>
