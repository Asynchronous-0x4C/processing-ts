// Service Worker for `vt run --offline`: network first, falling back to what earlier requests cached.
// With the page offline, the sketch's files (fetched by SketchFiles) must still load from the cache.
const CACHE = "vt-offline";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || !e.request.url.startsWith("http")) return;
  e.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      try {
        const res = await fetch(e.request);
        if (res.ok) await cache.put(e.request, res.clone());
        return res;
      } catch {
        return (await cache.match(e.request)) ?? Response.error();
      }
    })(),
  );
});
