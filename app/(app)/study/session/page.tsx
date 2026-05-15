import { getRandomWords } from "@/lib/words";
import { StudySession } from "@/components/study-session";

export const dynamic = "force-dynamic";

export default async function StudySessionPage() {
  const words = await getRandomWords(10);

  if (words.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-[color:var(--color-text-muted)]">
          暂无可学习的词条
        </p>
      </div>
    );
  }

  return <StudySession words={words} />;
}
