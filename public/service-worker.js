/**
 * Lightweight PWA service worker: offline shell + static asset cache only.
 * Does not cache API/XHR responses (avoids stale data and storage bloat).
 */
const CACHE_VERSION = 'v2';
const CACHE_NAME = `larabase-admin-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  '/offline.html',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

function isCacheableStatic(request, url) {
  if (request.method !== 'GET' || !isSameOrigin(url)) {
    return false;
  }
  if (url.pathname === '/manifest.webmanifest') {
    return true;
  }
  const dest = request.destination;
  return dest === 'style' || dest === 'script' || dest === 'image' || dest === 'font';
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.allSettled(
          PRECACHE_URLS.map((path) =>
            cache.add(path).catch(() => {
              /* offline.html or icons may be missing in dev; skip */
            })
          )
        )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/offline.html'))
    );
    return;
  }

  const url = new URL(request.url);

  if (!isSameOrigin(url)) {
    return;
  }

  // Static assets: cache-first (small cache, faster repeat visits)
  if (isCacheableStatic(request, url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Everything else (API, XHR, HTML partials): network only
  event.respondWith(fetch(request));
});
