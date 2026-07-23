const CACHE = "xiaobao-ocean-pop-v4";
const CORE = [
  "/",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/og.png",
  "/game-assets/ammo-bomb-v1.png",
  "/game-assets/ammo-rainbow-v1.png",
  "/game-assets/ammo-torpedo-v1.png",
  "/game-assets/backpack.png",
  "/game-assets/bubble-crab-v2.png",
  "/game-assets/bubble-fish-v2.png",
  "/game-assets/bubble-shell-v2.png",
  "/game-assets/bubble-shrimp-v2.png",
  "/game-assets/bubble-squid-v2.png",
  "/game-assets/obstacle-seal.png",
  "/game-assets/peanut-hit.png",
  "/game-assets/peanut-idle.png",
  "/game-assets/peanut-shell.png",
  "/game-assets/peanut-shrimp.png",
  "/game-assets/save.png",
  "/game-assets/shop-board.png",
  ...Array.from(
    { length: 16 },
    (_, index) => `/penguins/penguin-${String(index + 1).padStart(2, "0")}.png`,
  ),
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const developmentModule =
    url.pathname.startsWith("/app/") ||
    url.pathname.startsWith("/@") ||
    url.pathname.startsWith("/node_modules/") ||
    url.pathname.startsWith("/__debug");
  if (developmentModule) {
    event.respondWith(fetch(event.request));
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put("/", copy));
          return response;
        })
        .catch(() => caches.match("/")),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ??
        fetch(event.request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          }
          return response;
        }),
    ),
  );
});
