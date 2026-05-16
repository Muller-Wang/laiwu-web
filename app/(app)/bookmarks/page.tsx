import { listWords } from "@/lib/words";
import { BookmarkList } from "@/components/bookmark-list";

export const dynamic = "force-dynamic";

export default async function BookmarksPage() {
  // 服务端先抽 200 条候选，前端再用收藏 word 列表过滤
  const { items } = await listWords({ pageSize: 200, page: 1 });
  return <BookmarkList candidates={items} />;
}
