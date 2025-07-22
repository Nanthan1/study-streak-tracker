const CACHE_NAME = 'study-streak-cache-v1';

const urlsToCache = [
  '/study-streak-tracker/',              // if deployed under a folder
  '/study-streak-tracker/index.html',
  '/study-streak-tracker/style.css',
  '/study-streak-tracker/script.js',
  '/study-streak-tracker/manifest.json',
  '/study-streak-tracker/icon.png',
  '/study-streak-tracker/doggo.jpg',
  '/study-streak-tracker/doggo1.jpg'
];


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
