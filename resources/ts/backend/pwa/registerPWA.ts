declare global {
  interface Window {
    /** Set when `beforeinstallprompt` fires so late-mounted UI can show the install banner. */
    __pwaInstallPrompt?: Event & {
      prompt: () => Promise<{ outcome?: string }>;
      userChoice?: { outcome: string };
    };
  }
}

export function registerPWA() {
  const enabled =
    import.meta.env.PROD === true || import.meta.env.VITE_PWA_DEV === 'true';

  if (!enabled) {
    return;
  }

  if (!('serviceWorker' in navigator)) {
    console.warn('[PWA] Service workers are not supported in this browser.');
    return;
  }

  window.addEventListener('beforeinstallprompt', (event: Event) => {
    event.preventDefault();
    const ev = event as Window['__pwaInstallPrompt'];
    window.__pwaInstallPrompt = ev;

    window.dispatchEvent(
      new CustomEvent('pwa:beforeinstallprompt', {
        detail: ev,
      })
    );
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.info('[PWA] Service worker registered:', registration.scope);
      })
      .catch((error) => {
        console.error('[PWA] Service worker registration failed:', error);
      });
  });
}
