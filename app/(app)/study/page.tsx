import { listWords } from "@/lib/words";
import { StudyView } from "@/components/study-view";

export default async function StudyPage() {
  const [{ items: newWords }, { items: reviewWords }] = await Promise.all([
    listWords({ freq: 1, pageSize: 10, page: 1 }),
    listWords({ freq: 2, pageSize: 5, page: 1 }),
  ]);

  return <StudyView newWords={newWords} reviewWords={reviewWords} />;
}
