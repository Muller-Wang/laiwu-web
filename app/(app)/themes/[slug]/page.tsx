import { notFound } from "next/navigation";
import { findTheme } from "@/lib/themes";
import { listByWords } from "@/lib/words";
import { ThemeDetail } from "@/components/theme-detail";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const theme = findTheme(slug);
  return { title: theme ? `${theme.nameZh} · 主题词包` : "主题" };
}

export default async function ThemePage({ params }: Props) {
  const { slug } = await params;
  const theme = findTheme(slug);
  if (!theme) notFound();

  const words = await listByWords(theme.words);
  // 按 theme.words 的顺序排
  const order = new Map(theme.words.map((w, i) => [w.toLowerCase(), i]));
  words.sort(
    (a, b) =>
      (order.get(a.word.toLowerCase()) ?? 999) -
      (order.get(b.word.toLowerCase()) ?? 999),
  );

  return <ThemeDetail theme={theme} words={words} />;
}
