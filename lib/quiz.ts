/**
 * 测验出题器
 *
 * 5 种题型：
 *   - mc_zh2en : 给中文释义，4 个英文单词选 1
 *   - mc_en2zh : 给英文单词，4 个中文释义选 1
 *   - spelling : 给中文释义 + 首字母提示，键入完整单词
 *   - dictation: Web Speech 朗读单词，键入听到的单词
 *   - wrong    : 错题专项，从 wrong_words 池抽词，混合多种题型
 */
import type { WordRow } from "./supabase";
import { safeGet } from "./utils";

export type QuizType =
  | "mc_zh2en"
  | "mc_en2zh"
  | "spelling"
  | "dictation"
  | "wrong";

export type Question = {
  type: Exclude<QuizType, "wrong">;
  word: WordRow;
  prompt: string;
  answer: string;
  options?: string[]; // 仅选择题
  hint?: string; // 仅拼写题（首字母）
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function firstDefinition(w: WordRow): string {
  return safeGet<string>(w, "data.core_meanings.0.definition", w.word);
}

function firstPos(w: WordRow): string {
  return safeGet<string>(w, "data.core_meanings.0.pos", "");
}

function buildMcZh2En(target: WordRow, pool: WordRow[]): Question {
  // 干扰项：同词性优先，凑不齐再随机
  const targetPos = firstPos(target);
  const samePos = pool.filter(
    (w) => w.word !== target.word && firstPos(w) === targetPos,
  );
  const others = pool.filter(
    (w) => w.word !== target.word && firstPos(w) !== targetPos,
  );
  const distractors = shuffle([...samePos, ...others])
    .slice(0, 3)
    .map((w) => w.word);
  while (distractors.length < 3) distractors.push(`option${distractors.length}`);
  return {
    type: "mc_zh2en",
    word: target,
    prompt: firstDefinition(target),
    answer: target.word,
    options: shuffle([target.word, ...distractors]),
  };
}

function buildMcEn2Zh(target: WordRow, pool: WordRow[]): Question {
  const correct = firstDefinition(target);
  const distractors = shuffle(
    pool.filter((w) => w.word !== target.word).map((w) => firstDefinition(w)),
  ).slice(0, 3);
  while (distractors.length < 3) distractors.push("（占位释义）");
  return {
    type: "mc_en2zh",
    word: target,
    prompt: target.word,
    answer: correct,
    options: shuffle([correct, ...distractors]),
  };
}

function buildSpelling(target: WordRow): Question {
  const word = target.word;
  const pos = firstPos(target);
  return {
    type: "spelling",
    word: target,
    prompt: `${pos ? `[${pos}] ` : ""}${firstDefinition(target)}`,
    answer: word,
    hint: `${word[0]}${"_".repeat(Math.max(0, word.length - 1))}`,
  };
}

function buildDictation(target: WordRow): Question {
  return {
    type: "dictation",
    word: target,
    prompt: "🔊", // 由 UI 渲染播放按钮
    answer: target.word,
  };
}

/**
 * 主入口：根据题型与可用单词池生成题目。
 * pool 应来自"用户已学过的词"（progress 表里有记录的）。
 */
export function buildQuestions(
  type: Exclude<QuizType, "wrong">,
  pool: WordRow[],
  count: number,
): Question[] {
  const shuffled = shuffle(pool);
  const targets = shuffled.slice(0, Math.min(count, shuffled.length));
  return targets.map((target) => {
    switch (type) {
      case "mc_zh2en":
        return buildMcZh2En(target, pool);
      case "mc_en2zh":
        return buildMcEn2Zh(target, pool);
      case "spelling":
        return buildSpelling(target);
      case "dictation":
        return buildDictation(target);
    }
  });
}

/** 错题专项：每题随机挑题型 */
export function buildWrongQuestions(
  wrongWords: WordRow[],
  fullPool: WordRow[],
  count: number,
): Question[] {
  const types: Exclude<QuizType, "wrong">[] = [
    "mc_zh2en",
    "mc_en2zh",
    "spelling",
  ];
  const targets = shuffle(wrongWords).slice(0, count);
  return targets.map((target) => {
    const type = types[Math.floor(Math.random() * types.length)];
    if (type === "mc_zh2en") return buildMcZh2En(target, fullPool);
    if (type === "mc_en2zh") return buildMcEn2Zh(target, fullPool);
    return buildSpelling(target);
  });
}

/** 评判答案 */
export function judge(q: Question, userAnswer: string): boolean {
  const ans = userAnswer.trim().toLowerCase();
  if (q.type === "spelling" || q.type === "dictation") {
    return ans === q.answer.toLowerCase();
  }
  // 选择题：直接比对（用户传 option 字符串）
  return ans === q.answer.trim().toLowerCase();
}
