import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 安全获取嵌套字段，缺失时降级到 fallback。
 * 用于词条 JSONB 渲染，避免某字段缺失整页崩。
 */
export function safeGet<T = unknown>(
  obj: unknown,
  path: string,
  fallback: T,
): T {
  try {
    const keys = path.split(".");
    let cur: unknown = obj;
    for (const k of keys) {
      if (cur == null || typeof cur !== "object") return fallback;
      cur = (cur as Record<string, unknown>)[k];
    }
    return (cur ?? fallback) as T;
  } catch {
    return fallback;
  }
}

export function freqLabel(level: number): { text: string; color: string } {
  switch (level) {
    case 1:
      return { text: "高频", color: "var(--color-freq-1)" };
    case 2:
      return { text: "中频", color: "var(--color-freq-2)" };
    default:
      return { text: "低频", color: "var(--color-freq-3)" };
  }
}
