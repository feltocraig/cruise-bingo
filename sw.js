const CACHE_NAME = 'cache-v10';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    '/icon-192x192.svg',
    '/icon-512x512.svg',
    // Note: avoid adding cross-origin resources here (CDNs, Google Fonts).
    // Caching those in install can cause the install step to fail when offline
    // or when CORS headers prevent caching. They will be requested at runtime.
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    // Navigation requests should return the cached app shell (index.html)
    // when offline. For other requests, use cache-first, then network,
    // and for same-origin GET responses add them to the cache for future use.
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => caches.match('/index.html'))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;

            return fetch(event.request).then(networkResponse => {
                try {
                    const requestURL = new URL(event.request.url);
                    // Only cache same-origin GET requests
                    if (event.request.method === 'GET' && requestURL.origin === location.origin) {
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse.clone()));
                    }
                } catch (e) {
                    // ignore URL parsing/cache errors
                }
                return networkResponse;
            }).catch(() => {
                // If network fails and nothing in cache, just let it fail.
                return cached;
            });
        })
    );
});