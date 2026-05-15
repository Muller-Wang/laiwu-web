import Link from "next/link";
import { BookOpen, Globe, Mail } from "lucide-react";

export function Footer() {
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
              <span className="font-bold text-lg">来悟单词书</span>
            </div>
            <p className="mt-3 text-sm text-[color:var(--color-text-muted)] max-w-md leading-relaxed">
              中国本土版柯林斯词典。AI 驱动的 7000 词雅思单词书，
              鲜活例句 + 多元巧记法 + 熟词生义标注。
            </p>
            <p className="mt-4 text-xs text-[color:var(--color-text-muted)]">
              为雅思考生与海外华人打造
              <br />
              让单词学习从机械记忆走向真正理解
            </p>
          </div>

          {/* 站点导航 */}
          <div>
            <h4 className="font-semibold text-sm mb-3">站点</h4>
            <ul className="space-y-2 text-sm text-[color:var(--color-text-muted)]">
              <li>
                <Link href="/wordbook" className="hover:text-brand-600 transition-colors">
                  词库
                </Link>
              </li>
              <li>
                <Link href="/study" className="hover:text-brand-600 transition-colors">
                  学习计划
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-600 transition-colors">
                  关于
                </Link>
              </li>
            </ul>
          </div>

          {/* 联系 */}
          <div>
            <h4 className="font-semibold text-sm mb-3">联系</h4>
            <ul className="space-y-2 text-sm text-[color:var(--color-text-muted)]">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:muller@bfsu.edu.cn"
                  className="hover:text-brand-600 transition-colors"
                >
                  muller@bfsu.edu.cn
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>laiwu-web.vercel.app</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[color:var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-[color:var(--color-text-muted)]">
          <span>© 2026 来悟单词书</span>
          <span>Made with care for English learners.</span>
        </div>
      </div>
    </footer>
  );
}
