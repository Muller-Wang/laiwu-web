import { notFound } from "next/navigation";
import { getWord } from "@/lib/words";
import { WordDetailView } from "@/components/word-detail-view";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const word = decodeURIComponent(slug);
  return {
    title: `${word} · 来悟单词书`,
    description: `${word} · pronunciation, definitions, slang meanings, examples and mnemonics`,
  };
}

export default async function WordDetailPage({ params }: Props) {
  const { slug } = await params;
  const word = decodeURIComponent(slug);
  const row = await getWord(word);

  if (!row) notFound();

  return <WordDetailView row={row} />;
}
