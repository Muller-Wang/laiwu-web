"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { dict, type Lang, type DictKey } from "@/lib/i18n/dict";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey, vars?: Record<string, string | number>) => string;
};

const I18nCtx = createContext<Ctx>({
  lang: "zh",
  setLang: () => {},
  t: (k) => dict.zh[k] ?? k,
});

const STORAGE_KEY = "laiwu-lang";

function interpolate(s: string, vars?: Record<string, string | number>) {
  if (!vars) return s;
  return s.replace(/\{\{(\w+)\}\}/g, (_, k) =>
    vars[k] != null ? String(vars[k]) : `{{${k}}}`,
  );
}

export function I18nProvider({ children }: { children: ReactNode }) {
  // SSR/初始一律 zh，挂载后从 localStorage 同步，避免水合不匹配
  const [lang, setLangState] = useState<Lang>("zh");

  useEffect(() => {
    let target: Lang = "zh";
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "zh" || stored === "en") {
        target = stored;
      } else if (typeof navigator !== "undefined") {
        target = navigator.language?.toLowerCase().startsWith("zh")
          ? "zh"
          : "en";
      }
    } catch {
      // localStorage 不可用时降级
    }
    if (target !== lang) setLangState(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* noop */
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = l === "zh" ? "zh-CN" : "en";
    }
  };

  const t = (key: DictKey, vars?: Record<string, string | number>) => {
    const raw = dict[lang][key] ?? dict.zh[key] ?? (key as string);
    return interpolate(raw, vars);
  };

  return (
    <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>
  );
}

export function useI18n() {
  return useContext(I18nCtx);
}

export function useT() {
  return useContext(I18nCtx).t;
}
