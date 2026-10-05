
// ===== SERVICE WORKER - The Tribez Tracker =====
// Permite que la app funcione sin internet

const CACHE_NAME = 'tribez-tracker-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Instalar: guardar archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activar: limpiar cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Interceptar peticiones: servir desde caché si no hay internet
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si hay internet, guardar copia en caché
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => {
        // Sin internet, servir desde caché
        return caches.match(event.request);
      })
  );
});

