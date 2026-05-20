/**
 * 空 Service Worker · 自我卸载脚本
 *
 * 老用户的浏览器里如果还注册着旧版 SW，这个脚本会在 activate 时清掉所有
 * caches、卸载自己、强制所有客户端 navigate 一次拿到新代码。
 */
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll();
      clients.forEach((c) => c.navigate(c.url));
    })(),
  );
});
