"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, BookOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useT } from "./i18n-provider";
import { LangSwitcher } from "./lang-switcher";
import type { DictKey } from "@/lib/i18n/dict";

const NAV_ITEMS: Array<{ href: string; key: DictKey }> = [
  { href: "/wordbook", key: "nav.wordbook" },
  { href: "/study", key: "nav.study" },
  { href: "/quiz", key: "nav.quiz" },
  { href: "/about", key: "nav.about" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useT();

  return (
    <header className="sticky top-0 z-50 w-full bg-[color:var(--color-bg)]/85 backdrop-blur-md border-b border-[color:var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          onClick={() => setOpen(false)}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <BookOpen className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg tracking-tight">
            {t("home.brand")}
            {t("home.brandSuffix")}
          </span>
        </Link>

        {/* 桌面菜单 */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "text-brand-700 bg-brand-50"
                    : "text-[color:var(--color-text)] hover:bg-[color:var(--color-surface-2)]",
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
          <Link
            href="/wordbook"
            className="ml-3 px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors shadow-sm hover:shadow-md"
          >
            {t("nav.enterWordbook")}
          </Link>
          <div className="ml-2">
            <LangSwitcher />
          </div>
        </nav>

        {/* 移动端：语言切换 + 汉堡 */}
        <div className="md:hidden flex items-center gap-2">
          <LangSwitcher compact />
          <button
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded-lg hover:bg-[color:var(--color-surface-2)]"
            aria-label={t("nav.menu")}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 移动端展开层 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-[color:var(--color-border)] overflow-hidden"
          >
            <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-xl text-base font-medium transition-colors",
                      active
                        ? "text-brand-700 bg-brand-50"
                        : "hover:bg-[color:var(--color-surface-2)]",
                    )}
                  >
                    {t(item.key)}
                  </Link>
                );
              })}
              <Link
                href="/wordbook"
                onClick={() => setOpen(false)}
                className="mt-2 px-4 py-3 rounded-xl bg-brand-500 text-white text-center font-semibold"
              >
                {t("nav.enterWordbook")}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
