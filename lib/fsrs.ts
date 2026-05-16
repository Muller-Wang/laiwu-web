/**
 * FSRS-4.5 间隔重复算法包装
 *
 * 用法：
 *   const card = createCard();         // 新词
 *   const next = grade(card, 'good');  // 评分后得到下一张卡片状态
 */
import {
  FSRS,
  generatorParameters,
  Rating,
  State,
  type Card,
  type Grade as FsrsGrade,
} from "ts-fsrs";
import type { ProgressRow, ProgressState } from "./db";

const fsrs = new FSRS(
  generatorParameters({
    enable_fuzz: true,
    request_retention: 0.9, // 目标记忆保留率 90%
  }),
);

export type Grade = "forget" | "hard" | "good" | "easy";

const RATING_MAP: Record<Grade, FsrsGrade> = {
  forget: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
  easy: Rating.Easy,
};

const STATE_MAP: Record<State, ProgressState> = {
  [State.New]: "new",
  [State.Learning]: "learning",
  [State.Review]: "review",
  [State.Relearning]: "relearning",
};

const STATE_REVERSE: Record<ProgressState, State> = {
  new: State.New,
  learning: State.Learning,
  review: State.Review,
  relearning: State.Relearning,
};

/** 把 IndexedDB 的 ProgressRow 转回 FSRS 内部 Card 结构 */
function rowToCard(row: ProgressRow): Card {
  return {
    due: new Date(row.due),
    stability: row.stability,
    difficulty: row.difficulty,
    elapsed_days: 0,
    scheduled_days: 0,
    reps: row.reps,
    lapses: row.lapses,
    state: STATE_REVERSE[row.state],
    last_review: row.last_review ? new Date(row.last_review) : undefined,
    learning_steps: 0,
  };
}

function cardToRow(word: string, card: Card): ProgressRow {
  return {
    word,
    stability: card.stability,
    difficulty: card.difficulty,
    due: card.due.getTime(),
    last_review: card.last_review ? card.last_review.getTime() : Date.now(),
    reps: card.reps,
    lapses: card.lapses,
    state: STATE_MAP[card.state],
  };
}

/** 给某个单词打分并计算下一次复习时间 */
export function gradeWord(
  existing: ProgressRow | null,
  word: string,
  grade: Grade,
  now = new Date(),
): { row: ProgressRow; nextDue: Date } {
  const card: Card = existing
    ? rowToCard(existing)
    : {
        due: now,
        stability: 0,
        difficulty: 0,
        elapsed_days: 0,
        scheduled_days: 0,
        reps: 0,
        lapses: 0,
        state: State.New,
        last_review: undefined,
        learning_steps: 0,
      };

  const result = fsrs.next(card, now, RATING_MAP[grade]);
  const row = cardToRow(word, result.card);
  return { row, nextDue: result.card.due };
}

/** 用人类可读字符串描述下次复习的相对时间 */
export function describeNextDue(due: Date, now = new Date()): string {
  const diffMs = due.getTime() - now.getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "<1m";
  if (diffMin < 60) return `${diffMin}m`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `${diffH}h`;
  const diffD = Math.round(diffH / 24);
  if (diffD < 30) return `${diffD}d`;
  const diffMo = Math.round(diffD / 30);
  if (diffMo < 12) return `${diffMo}mo`;
  return `${Math.round(diffMo / 12)}y`;
}
