/**
 * 来悟单词书 · Service Worker
 * - Stale-while-revalidate for navigation requests
 * - Cache-first for /_next/static and /word-index.json
 * - Network-first for /api/*
 */
const CACHE = "laiwu-v1";
const STATIC_ASSETS = ["/", "/wordbook", "/about", "/word-index.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(STATIC_ASSETS).catch(() => undefined))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // 静态资源：cache-first
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname === "/word-index.json" ||
    url.pathname === "/cover-v2.png" ||
    url.pathname === "/icon.svg"
  ) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(req, clone));
          }
          return res;
        });
      }),
    );
    return;
  }

  // 页面导航：stale-while-revalidate
  if (req.mode === "navigate") {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetched = fetch(req)
          .then((res) => {
            if (res.ok) {
              const clone = res.clone();
              caches.open(CACHE).then((c) => c.put(req, clone));
            }
            return res;
          })
          .catch(() => cached || Response.error());
        return cached || fetched;
      }),
    );
  }
});
