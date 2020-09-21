const cacheName = 'news-v1';
const staticAssets = [
    './',
    './js/app.js',
    './css/style.css',
    './fallback.json',
    './images/fetch-dog.jpg'
];

self.addEventListener('install', async function() {
    const cache = await caches.open(cacheName);
    cache.addAll(staticAssets);
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    if (url.origin === location.origin) {
        event.respondWith(cacheFirst(request));
    } else {
        event.respondWith(networkFirst(request));
    }
});
//caching the first request
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || fetch(request);
}
//setting dynamic caching for better performance
async function networkFirst(request) {
    const dynamicCache = await caches.open('news-dynamic');
    try {
        const networkResponse = await fetch(request);
        dynamicCache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (err) {
        const cachedResponse = await dynamicCache.match(request);
        //adding fallbacks in case of api fetching fails due to no network
        return cachedResponse || await caches.match('../fallback.json');
    }
}