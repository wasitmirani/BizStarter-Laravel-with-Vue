/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Set to `true` to register the service worker while using `vite` dev (HTTPS + local testing). */
  readonly VITE_PWA_DEV?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** Injected by Laravel Blade on admin/frontend layouts — source of truth for RBAC in the SPA. */
interface Window {
  user?: unknown;
  permissions?: string[];
  token?: string;
  /** Theme/layout bootstrap; optional per layout. */
  config?: Record<string, unknown>;
}
