<script setup lang="ts">
import { computed } from 'vue';

const year = new Date().getFullYear();
const appName = computed(() => window.__APP_CONTEXT__?.config.appName ?? 'Admin portal');
const environment = computed(() => window.__APP_CONTEXT__?.config.appEnv ?? 'production');
</script>

<template>
    <footer class="lk-footer">
        <p class="lk-footer__text">
            © {{ year }} <strong>{{ appName }}</strong>. All rights reserved.
        </p>
        <div class="lk-footer__meta">
            <span class="lk-footer__env">{{ environment }}</span>
            <a href="/app/settings/user-account">Account</a>
            <a href="mailto:support@example.com">Support</a>
        </div>
    </footer>
</template>

<style scoped>
.lk-footer__text {
    margin: 0;
}

.lk-footer__meta {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
}

.lk-footer__meta a {
    color: var(--lk-text-muted);
    text-decoration: none;
}

.lk-footer__meta a:hover {
    color: var(--lk-primary);
}

.lk-footer__env {
    padding: 1px 7px;
    border-radius: 999px;
    background: var(--lk-surface);
    border: 1px solid var(--lk-border);
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--lk-text-secondary);
}
</style>
