const CACHE = "coffeehub-shell-v1";
const SHELL = ["/offline", "/icons/icon-192.svg", "/icons/icon-512.svg"];
self.addEventListener("install", (event) => { event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", (event) => { event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))); self.clients.claim(); });
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || request.mode !== "navigate") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/app") || url.pathname.startsWith("/admin") || url.pathname.startsWith("/auth")) {
    event.respondWith(fetch(request).catch(() => caches.match("/offline")));
    return;
  }
  event.respondWith(fetch(request).catch(() => caches.match("/offline")));
});
