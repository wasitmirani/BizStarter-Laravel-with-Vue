export function registerPWA() {

  if (!('serviceWorker' in navigator)) {
    console.warn('[PWA] Service workers are not supported in this browser.');
    return;
  }

  // Listen for browser install prompt and forward as a custom event
  window.addEventListener('beforeinstallprompt', (event: Event) => {
    event.preventDefault();

    const customEvent = new CustomEvent('pwa:beforeinstallprompt', {
      detail: event,
    });
    window.dispatchEvent(customEvent);
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

