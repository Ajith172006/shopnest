const CACHE_NAME = 'buyit-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Basic minimal caching to satisfy PWABuilder
      return cache.addAll(['/']);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Network first, fallback to cache
      return fetch(event.request).catch(() => response);
    })
  );
});
