const CACHE_NAME = 'zahngut-v1';
const RUNTIME_CACHE = 'zahngut-runtime';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/index.css',
  '/src/main.tsx',
  '/src/app.js',
  '/src/supabaseClient.js',
  '/src/dataService.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS).catch(err => {
          console.log('Some assets failed to cache:', err);
          return Promise.resolve();
        });
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin === location.origin) {
    if (request.method === 'GET') {
      event.respondWith(
        caches.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }

            return caches.open(RUNTIME_CACHE).then((cache) => {
              return fetch(request).then((response) => {
                if (response && response.status === 200) {
                  cache.put(request, response.clone());
                }
                return response;
              });
            });
          })
          .catch(() => {
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }
          })
      );
    }
  } else if (url.origin.includes('supabase')) {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return caches.match(request);
        })
    );
  } else {
    event.respondWith(fetch(request));
  }
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
