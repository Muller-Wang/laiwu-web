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

/**
 * 返回词频徽章的样式与 i18n key。
 * 调用方负责 t(textKey) 翻译。
 */
export function freqStyle(level: number): {
  textKey: "wordbook.freq1" | "wordbook.freq2" | "wordbook.freq3";
  color: string;
} {
  switch (level) {
    case 1:
      return { textKey: "wordbook.freq1", color: "var(--color-freq-1)" };
    case 2:
      return { textKey: "wordbook.freq2", color: "var(--color-freq-2)" };
    default:
      return { textKey: "wordbook.freq3", color: "var(--color-freq-3)" };
  }
}
