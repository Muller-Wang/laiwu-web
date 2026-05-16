import { listWords } from "@/lib/words";
import { QuizRunner } from "@/components/quiz-runner";
import type { QuizType } from "@/lib/quiz";

export const dynamic = "force-dynamic";

type SP = { type?: string; count?: string };

const VALID_TYPES: QuizType[] = [
  "mc_zh2en",
  "mc_en2zh",
  "spelling",
  "dictation",
  "wrong",
];

export default async function QuizSessionPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const type = (
    VALID_TYPES.includes(sp.type as QuizType) ? sp.type : "mc_zh2en"
  ) as QuizType;
  const count = Math.max(3, Math.min(20, Number(sp.count) || 10));

  // 服务端抽 300 条候选词作为出题池
  const [hi, mid] = await Promise.all([
    listWords({ freq: 1, pageSize: 200, page: 1 }),
    listWords({ freq: 2, pageSize: 100, page: 1 }),
  ]);
  const candidates = [...hi.items, ...mid.items];

  return <QuizRunner type={type} count={count} candidates={candidates} />;
}
