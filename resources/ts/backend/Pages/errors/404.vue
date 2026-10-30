<template>
    <div class="lk-card">
        <div class="lk-state" style="padding: 56px 24px">
            <p class="lk-error-code">404</p>
            <h1 class="lk-state__title">Page not found</h1>
            <p class="lk-state__text">
                The page you are looking for was moved, deleted or never existed. Check the address or head back to the dashboard.
            </p>
            <div class="lk-page-actions" style="justify-content: center; margin-top: 16px">
                <router-link to="/app/dashboard" class="lk-btn lk-btn--primary">Back to dashboard</router-link>
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
