<script setup lang="ts">
import { computed } from 'vue';

const config = computed(() => window.__APP_CONTEXT__?.config ?? null);

const rows = computed(() => [
    { label: 'Application name', value: config.value?.appName ?? '—' },
    { label: 'Environment', value: config.value?.appEnv ?? '—' },
    { label: 'Application URL', value: config.value?.appUrl ?? window.location.origin },
    { label: 'Locale', value: config.value ? `${config.value.locale} (fallback ${config.value.fallbackLocale})` : '—' },
    { label: 'Layout', value: config.value?.theme?.layout ?? 'backend' },
]);
</script>

<template>
    <div>
        <header class="lk-page-head">
            <div>
                <h1 class="lk-page-title">App configuration</h1>
                <p class="lk-page-subtitle">Values injected by the server for this deployment.</p>
            </div>
        </header>

        <div class="lk-grid-2">
            <section class="lk-card">
                <div class="lk-card__head">
                    <div>
                        <h2 class="lk-card__title">Runtime configuration</h2>
                        <p class="lk-card__meta">Read-only, resolved from <code>.env</code> at boot</p>
                    </div>
                </div>
                <div class="lk-card__body">
                    <dl class="lk-config-list">
                        <div v-for="row in rows" :key="row.label">
                            <dt>{{ row.label }}</dt>
                            <dd>{{ row.value }}</dd>
                        </div>
                    </dl>
                </div>
            </section>

            <section class="lk-card">
                <div class="lk-card__head">
                    <div>
                        <h2 class="lk-card__title">Tenant settings</h2>
                        <p class="lk-card__meta">Not stored in this build</p>
                    </div>
                </div>
                <div class="lk-card__body">
                    <div class="lk-inline-note">
                        <span>
                            Editable branding, feature flags and mail settings require a settings table and admin endpoints,
                            which this deployment does not include yet. The values above are the real runtime configuration.
                        </span>
                    </div>
                    <p class="lk-hint" style="margin-top: 12px">
                        To change them, update the environment file and redeploy.
                    </p>
                </div>
            </section>
        </div>
    </div>
</template>

<style scoped>
.lk-config-list {
    margin: 0;
    display: grid;
    gap: 0;
}

.lk-config-list div {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 11px 0;
    border-bottom: 1px solid var(--lk-border);
}

.lk-config-list div:last-child {
    border-bottom: 0;
    padding-bottom: 0;
}

.lk-config-list dt {
    font-size: 12.5px;
    color: var(--lk-text-muted);
}

.lk-config-list dd {
    margin: 0;
    font-size: 12.5px;
    font-weight: 600;
    color: var(--lk-text);
    text-align: right;
    word-break: break-word;
}

code {
    font-size: 11.5px;
    color: var(--lk-text-secondary);
}
</style>
