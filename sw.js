const CACHE_NAME = "mountain-xiaobao-v11-backpack-buildings";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=20260520-backpack-buildings",
  "./game.js?v=20260520-backpack-buildings",
  "./manifest.webmanifest",
  "./assets/penguin-01.png",
  "./assets/penguin-08.png",
  "./assets/walkers/penguin-walk-east.png",
  "./assets/walkers/penguin-walk-south.png",
  "./assets/walkers/penguin-walk-west.png",
  "./assets/walkers/penguin-walk-north.png",
  "./assets/resource-coins.png",
  "./assets/resource-energy.png",
  "./assets/resource-stars.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names
        .filter((name) => name !== CACHE_NAME)
        .map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        if (new URL(request.url).origin === self.location.origin) {
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match("./index.html")))
  );
});
