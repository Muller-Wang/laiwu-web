import Link from "next/link";
import { Search, Home, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-20">
      <div className="max-w-md text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-400 to-brand-600 text-white mb-6 shadow-xl shadow-brand-500/30">
          <Search className="w-10 h-10" />
        </div>
        <h1 className="text-7xl font-extrabold tracking-tight bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-bold">没找到这个词条</h2>
        <p className="mt-3 text-[color:var(--color-text-muted)]">
          可能是单词拼写有误，或这个词还没收录。
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/wordbook"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-semibold shadow-lg shadow-brand-500/30 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            浏览词库
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white border border-[color:var(--color-border)] hover:border-brand-300 font-semibold transition-all"
          >
            <Home className="w-4 h-4" />
            回到首页
          </Link>
        </div>
      </div>
    </div>
  );
}
