"use client";

import { useEffect } from "react";

/**
 * Service Worker 卸载器（不再注册新 SW）
 *
 * 之前部署的 SW 缓存了旧版 JS bundle，导致用户拿到的客户端代码与
 * 服务端不一致（搜索 typeahead / 学习计划 / 测验等纯客户端功能因此失效）。
 *
 * 这里：
 *  - 不再注册新 SW
 *  - 主动卸载所有已注册的 SW
 *  - 清空 caches API 里的所有缓存
 * 让浏览器下次访问拿到最新代码。
 */
export function SWRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .getRegistrations()
      .then((regs) =>
        Promise.all(
          regs.map((r) => r.unregister().catch(() => undefined)),
        ),
      )
      .catch(() => undefined);

    if ("caches" in window) {
      caches
        .keys()
        .then((keys) =>
          Promise.all(keys.map((k) => caches.delete(k))),
        )
        .catch(() => undefined);
    }
  }, []);
  return null;
}
