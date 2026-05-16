import { listWords } from "@/lib/words";
import { StudyView } from "@/components/study-view";

/**
 * 学习计划页：服务端抽出 200 条词作为今日清单候选池
 * （客户端按 IndexedDB 进度筛出"新学"和"待复习"两类）
 */
export default async function StudyPage() {
  const [hi, mid] = await Promise.all([
    listWords({ freq: 1, pageSize: 100, page: 1 }),
    listWords({ freq: 2, pageSize: 100, page: 1 }),
  ]);
  const candidates = [...hi.items, ...mid.items];

  return <StudyView candidates={candidates} />;
}
