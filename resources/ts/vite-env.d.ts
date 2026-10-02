/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Set to `true` to register the service worker while using `vite` dev (HTTPS + local testing). */
  readonly VITE_PWA_DEV?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type AppContextUserRole = {
  id: number | string;
  name: string;
};

type AppContextUser = {
  id: number | string;
  name: string;
  email: string;
  roles: AppContextUserRole[];
} | null;

type AppContext = {
  auth: {
    user: AppContextUser;
    permissions: string[];
  };
  config: {
    appName: string;
    appEnv: string;
    appUrl: string | null;
    locale: string;
    fallbackLocale: string;
    theme: {
      layout: string;
    };
    tenant?: {
      id: string | number;
      name: string | null;
      email?: string | null;
      primary_color?: string | null;
      logo?: string | null;
      domain?: string | null;
    } | null;
  };
  layout: Readonly<Record<string, unknown>>;
};

/** Injected by Laravel Blade on admin/frontend layouts — source of truth for global app state. */
interface Window {
  __APP_CONTEXT__?: Readonly<AppContext>;
  user?: AppContextUser;
  permissions?: string[];
 token?: string | null;
  /** Theme/layout bootstrap; optional per layout. */
  config?: Record<string, unknown>;
}
