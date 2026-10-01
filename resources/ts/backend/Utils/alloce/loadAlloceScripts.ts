/**
 * Alloce template scripts bind listeners at module evaluation time and inside
 * DOMContentLoaded (on document and/or window). In a Vue SPA those nodes
 * mount later, so we defer loading and replay ready events when needed.
 *
 * Public assets cannot be `import()`-ed through Vite — load them as `<script type="module">`.
 */

const ADMIN_BUNDLE = '/backend/assets/admin.bundle-DOCqQWIh.js';
const MAIN_BUNDLE = '/backend/assets/main-BSp6wgyE.js';

let layoutPromise: Promise<void> | null = null;
const pagePromises = new Map<string, Promise<void>>();

type LoadOptions = {
  /** Bypass dedupe so SPA remounts can re-run page chart init. */
  unique?: boolean;
};

function loadModuleScript(src: string, options: LoadOptions = {}): Promise<void> {
  const key = options.unique ? src : src.split('?')[0];
  if (!options.unique) {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-alloce-src="${key}"]`,
    );
    if (existing) {
      return existing.dataset.loaded === 'true'
        ? Promise.resolve()
        : new Promise((resolve, reject) => {
            existing.addEventListener('load', () => resolve(), { once: true });
            existing.addEventListener(
              'error',
              () => reject(new Error(`Failed to load ${src}`)),
              { once: true },
            );
          });
    }
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = src;
    script.dataset.alloceSrc = key;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

type Listener = EventListenerOrEventListenerObject;

function patchReadyListener(
  proto: typeof Document.prototype | typeof Window.prototype,
  runReplay: boolean,
) {
  const original = proto.addEventListener;
  proto.addEventListener = function (
    this: Document | Window,
    type: string,
    listener: Listener,
    options?: boolean | AddEventListenerOptions,
  ) {
    if (runReplay && type === 'DOMContentLoaded') {
      queueMicrotask(() => {
        const event = new Event('DOMContentLoaded');
        if (typeof listener === 'function') {
          listener.call(this, event);
        } else {
          listener.handleEvent(event);
        }
      });
      return;
    }
    original.call(this, type, listener, options);
  };
  return () => {
    proto.addEventListener = original;
  };
}

/** Replay DOMContentLoaded for both document and window listeners (Alloce uses both). */
function patchDomContentLoaded<T>(run: () => Promise<T>): Promise<T> {
  const needsReplay = document.readyState !== 'loading';
  const restoreDocument = patchReadyListener(Document.prototype, needsReplay);
  const restoreWindow = patchReadyListener(Window.prototype, needsReplay);

  return run().finally(() => {
    restoreDocument();
    restoreWindow();
  });
}

/** Re-run Lucide createIcons after Vue paints new [data-lucide] nodes. */
export function refreshAlloceIcons() {
  const id = 'alloce-refresh-icons';
  document.getElementById(id)?.remove();
  const script = document.createElement('script');
  script.id = id;
  script.type = 'module';
  script.textContent = `
    import { t as createIcons, n as icons } from "${ADMIN_BUNDLE}";
    try { createIcons({ icons }); } catch (_) {}
  `;
  document.body.appendChild(script);
}

export function loadAlloceScripts(): Promise<void> {
  if (!layoutPromise) {
    layoutPromise = patchDomContentLoaded(() => loadModuleScript(MAIN_BUNDLE))
      .then(() => {
        requestAnimationFrame(() => refreshAlloceIcons());
      })
      .catch((error) => {
        console.error('[Alloce] Failed to load template scripts', error);
        layoutPromise = null;
      });
  } else {
    void layoutPromise.then(() => refreshAlloceIcons());
  }

  return layoutPromise;
}

/**
 * Load a page-specific Alloce script (e.g. dashboard-hrm.js) after chart
 * containers exist. Uses a cache-busted URL so SPA remounts re-init charts.
 */
export async function loadAllocePageScript(src: string): Promise<void> {
  await loadAlloceScripts();

  const existing = pagePromises.get(src);
  if (existing) {
    pagePromises.delete(src);
  }

  const busted = `${src}${src.includes('?') ? '&' : '?'}t=${Date.now()}`;
  const promise = patchDomContentLoaded(() =>
    loadModuleScript(busted, { unique: true }),
  )
    .then(() => {
      requestAnimationFrame(() => refreshAlloceIcons());
    })
    .catch((error) => {
      console.error(`[Alloce] Failed to load page script ${src}`, error);
      pagePromises.delete(src);
    });

  pagePromises.set(src, promise);
  return promise;
}
