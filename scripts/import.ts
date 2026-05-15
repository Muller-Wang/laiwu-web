/**
 * 来悟单词书 · 数据导入脚本
 *
 * 用法:
 *   bun run scripts/import.ts                          # 默认读 ~/projects/laiwu-wordbook/output/entries.json
 *   bun run scripts/import.ts /path/to/entries.json    # 自定义路径
 *   bun run scripts/import.ts --dry-run                # 只解析不上传
 *
 * 环境变量（.env.local）:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY  ← 必须！anon key 写入会被 RLS 拦截
 */
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { homedir } from "node:os";

type Entry = {
  word: string;
  pronunciation_us?: string;
  pronunciation_uk?: string;
  frequency_level?: number;
  core_meanings?: Array<{ pos: string; definition: string }>;
  slang_meanings?: Array<{ context: string; definition: string; note?: string }>;
  example?: { text: string; translation: string; source_style?: string };
  mnemonic?: string | null;
  associations?: Record<string, unknown>;
};

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const customPath = args.find((a) => !a.startsWith("--"));
const defaultPath = resolve(
  homedir(),
  "projects/laiwu-wordbook/output/entries.json",
);
const sourcePath = customPath ? resolve(customPath) : defaultPath;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function main() {
  console.log(`📖 读取数据源: ${sourcePath}`);
  const raw = await readFile(sourcePath, "utf8");
  const entries: Entry[] = JSON.parse(raw);
  console.log(`✅ 解析成功: ${entries.length} 条词条`);

  // 转换为表行
  const rows = entries
    .filter((e) => e.word)
    .map((e) => {
      const posList = Array.from(
        new Set((e.core_meanings ?? []).map((m) => m.pos.trim()).filter(Boolean)),
      );
      return {
        word: e.word.trim(),
        pronunciation_us: e.pronunciation_us ?? null,
        pronunciation_uk: e.pronunciation_uk ?? null,
        frequency_level: e.frequency_level ?? 2,
        has_slang: (e.slang_meanings?.length ?? 0) > 0,
        has_mnemonic: !!e.mnemonic,
        pos_list: posList,
        data: e,
      };
    });

  console.log(`📦 转换后准备入库: ${rows.length} 条`);
  console.log(`   含熟词生义: ${rows.filter((r) => r.has_slang).length}`);
  console.log(`   含助记法:   ${rows.filter((r) => r.has_mnemonic).length}`);

  if (dryRun) {
    console.log("🔍 --dry-run 模式，跳过上传。示例首条：");
    console.log(JSON.stringify(rows[0], null, 2));
    return;
  }

  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error(
      "❌ 缺少 NEXT_PUBLIC_SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY",
    );
    console.error("   请在 .env.local 配置后重试，或加 --dry-run 测试解析");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false },
  });

  const BATCH = 200;
  let done = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    const { error } = await supabase
      .from("words")
      .upsert(chunk, { onConflict: "word" });

    if (error) {
      console.error(`❌ 批次 ${i}-${i + chunk.length} 失败:`, error.message);
      process.exit(1);
    }
    done += chunk.length;
    process.stdout.write(`\r⬆️  上传中: ${done}/${rows.length}`);
  }
  console.log(`\n✅ 全部导入完成: ${done} 条`);
}

main().catch((err) => {
  console.error("💥 导入失败:", err);
  process.exit(1);
});
