import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "来悟单词书 · Laiwu Wordbook",
    short_name: "来悟单词书",
    description:
      "AI 驱动的 7000 词雅思单词书，鲜活例句 + 多元巧记法 + 熟词生义标注",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    theme_color: "#10b981",
    background_color: "#fafaf9",
    lang: "zh-CN",
    categories: ["education", "books", "productivity"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "进入词库",
        short_name: "词库",
        url: "/wordbook",
      },
      {
        name: "学习计划",
        short_name: "学习",
        url: "/study",
      },
      {
        name: "测验",
        short_name: "测验",
        url: "/quiz",
      },
    ],
  };
}
