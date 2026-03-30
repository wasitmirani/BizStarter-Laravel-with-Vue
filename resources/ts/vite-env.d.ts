/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Set to `true` to register the service worker while using `vite` dev (HTTPS + local testing). */
  readonly VITE_PWA_DEV?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
