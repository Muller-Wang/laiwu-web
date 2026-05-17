"use client";

import { useEffect } from "react";

/**
 * Service Worker 注册器
 * 仅在生产环境注册（dev 模式下 SW 会缓存 dev assets 造成调试困扰）
 */
export function SWRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const register = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch (err) {
        console.warn("[sw] register failed", err);
      }
    };
    register();
  }, []);
  return null;
}
