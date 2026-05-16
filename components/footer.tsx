"use client";

import Link from "next/link";
import { BookOpen, Globe, Mail } from "lucide-react";
import { useT } from "./i18n-provider";

export function Footer() {
  const t = useT();
  return (
    <footer className="mt-24 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 品牌 */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg">
                {t("home.brand")}
                {t("home.brandSuffix")}
              </span>
            </div>
            <p className="mt-3 text-sm text-[color:var(--color-text-muted)] max-w-md leading-relaxed">
              {t("footer.tagline")}
            </p>
            <p className="mt-4 text-xs text-[color:var(--color-text-muted)]">
              {t("footer.subtagline1")}
              <br />
              {t("footer.subtagline2")}
            </p>
          </div>

          {/* 站点导航 */}
          <div>
            <h4 className="font-semibold text-sm mb-3">{t("footer.sitemap")}</h4>
            <ul className="space-y-2 text-sm text-[color:var(--color-text-muted)]">
              <li>
                <Link href="/wordbook" className="hover:text-brand-600 transition-colors">
                  {t("nav.wordbook")}
                </Link>
              </li>
              <li>
                <Link href="/study" className="hover:text-brand-600 transition-colors">
                  {t("nav.study")}
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="hover:text-brand-600 transition-colors">
                  {t("nav.quiz")}
                </Link>
              </li>
              <li>
                <Link href="/bookmarks" className="hover:text-brand-600 transition-colors">
                  {t("bookmark.page.title")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-600 transition-colors">
                  {t("nav.about")}
                </Link>
              </li>
            </ul>
          </div>

          {/* 访问节点 */}
          <div>
            <h4 className="font-semibold text-sm mb-3">{t("footer.nodes")}</h4>
            <ul className="space-y-2 text-sm text-[color:var(--color-text-muted)]">
              <li className="flex items-start gap-2">
                <Globe className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wide text-[color:var(--color-text-muted)]">
                    {t("footer.nodeCN")}
                  </div>
                  <a
                    href="http://39.105.122.95:3000"
                    className="hover:text-brand-600 transition-colors font-mono text-xs break-all"
                  >
                    39.105.122.95:3000
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Globe className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wide text-[color:var(--color-text-muted)]">
                    {t("footer.nodeGlobal")}
                  </div>
                  <a
                    href="https://laiwu-web.vercel.app"
                    className="hover:text-brand-600 transition-colors font-mono text-xs break-all"
                  >
                    laiwu-web.vercel.app
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2 pt-1">
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:muller@bfsu.edu.cn"
                  className="hover:text-brand-600 transition-colors text-xs"
                >
                  muller@bfsu.edu.cn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[color:var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-[color:var(--color-text-muted)]">
          <span>{t("footer.copyright")}</span>
          <span>{t("footer.madeWith")}</span>
        </div>
      </div>
    </footer>
  );
}
