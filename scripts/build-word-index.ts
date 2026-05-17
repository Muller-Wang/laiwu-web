/**
 * 构建客户端搜索索引
 *
 * 输入：data/words.json （从 entries.json 拷贝过来的快照）
 * 输出：public/word-index.json
 *   [{ w: "lit", f: 1, d: "点燃" }, ...]
 *
 * 客户端首次访问时 lazy fetch，存到 module-level cache，
 * 之后所有 SearchBar 输入都本地 0ms 匹配。
 *
 * 用法：bun run scripts/build-word-index.ts
 */
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

type Entry = {
  word: string;
  frequency_level?: number;
  core_meanings?: Array<{ pos?: string; definition?: string }>;
};

const ROOT = resolve(import.meta.dirname ?? __dirname, "..");
const SOURCE = resolve(ROOT, "data/words.json");
const OUT = resolve(ROOT, "public/word-index.json");

async function main() {
  const raw = await readFile(SOURCE, "utf8");
  const entries: Entry[] = JSON.parse(raw);
  const out = entries
    .filter((e) => e.word)
    .map((e) => {
      // 取第一释义，截断 40 字，去前缀词性
      const def = (
        e.core_meanings?.[0]?.definition ?? ""
      )
        .replace(/^(n\.|v\.|adj\.|adv\.|prep\.|conj\.|pron\.|int\.)\s*/, "")
        .slice(0, 40);
      return {
        w: e.word.trim(),
        f: e.frequency_level ?? 2,
        d: def,
      };
    })
    .sort((a, b) => a.f - b.f || a.w.localeCompare(b.w));

  await writeFile(OUT, JSON.stringify(out));
  const size = (Buffer.byteLength(JSON.stringify(out)) / 1024).toFixed(1);
  console.log(`✅ word-index.json 生成 · ${out.length} 词 · ${size} KB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
