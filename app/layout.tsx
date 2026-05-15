import type { Metadata, Viewport } from "next";
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
import { ToastProvider } from "@/components/toast";

export const metadata: Metadata = {
  title: {
    default: "来悟单词书 · 中国本土版柯林斯词典",
    template: "%s | 来悟单词书",
  },
  description:
    "AI 驱动的 7000 词雅思单词书，鲜活例句 + 多元巧记法 + 熟词生义标注，北京外国语大学大创项目。",
  keywords: ["雅思", "单词书", "AI", "英语学习", "熟词生义", "北外", "大创"],
  authors: [{ name: "北外大创团队" }],
  openGraph: {
    title: "来悟单词书 · 中国本土版柯林斯词典",
    description: "AI 驱动的 7000 词雅思单词书",
    type: "website",
    locale: "zh_CN",
    siteName: "来悟单词书",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[color:var(--color-bg)] text-[color:var(--color-text)] font-sans">
        <ToastProvider>
          <Nav />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
