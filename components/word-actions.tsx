"use client";

import { CalendarPlus, BookmarkCheck } from "lucide-react";
import { motion } from "motion/react";
import { useToast } from "./toast";

export function WordActions() {
  const { push } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <motion.button
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => push("已加入学习记录")}
        className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white border border-[color:var(--color-border)] shadow-lg text-sm font-semibold text-[color:var(--color-text)] hover:border-brand-300"
      >
        <BookmarkCheck className="w-4 h-4 text-brand-600" />
        标记已学
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => push("已加入今日学习计划")}
        className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 shadow-xl shadow-brand-500/30 text-sm font-semibold text-white"
      >
        <CalendarPlus className="w-4 h-4" />
        加入计划
      </motion.button>
    </div>
  );
}
