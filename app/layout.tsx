import type { Metadata } from "next";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import "@fontsource/noto-sans-sc/400.css";
import "@fontsource/noto-sans-sc/500.css";
import "@fontsource/noto-sans-sc/700.css";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "来悟单词书 · 中国本土版柯林斯词典",
  description:
    "AI 驱动的 7000 词雅思单词书，鲜活例句 + 多元巧记法 + 熟词生义标注，北京外国语大学大创项目。",
  openGraph: {
    title: "来悟单词书",
    description: "AI 驱动的 7000 词雅思单词书",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[color:var(--color-bg)] text-[color:var(--color-text)] font-sans">
        <Nav />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
