"use client";

import { CalendarPlus, Bookmark, BookmarkCheck } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useToast } from "./toast";
import { useT } from "./i18n-provider";
import { isBookmarked, addBookmark, removeBookmark } from "@/lib/db";

export function WordActions({ word }: { word: string }) {
  const { push } = useToast();
  const t = useT();
  const [bookmarked, setBookmarked] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const b = await isBookmarked(word);
        setBookmarked(b);
      } catch {
        /* noop */
      }
    })();
  }, [word]);

  const toggleBookmark = async () => {
    if (busy) return;
    setBusy(true);
    try {
      if (bookmarked) {
        await removeBookmark(word);
        setBookmarked(false);
        push(t("bookmark.toastRemove"));
      } else {
        await addBookmark(word);
        setBookmarked(true);
        push(t("bookmark.toastAdd"));
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <motion.button
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: 1.02 }}
        disabled={busy}
        onClick={toggleBookmark}
        className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white border border-[color:var(--color-border)] shadow-lg text-sm font-semibold text-[color:var(--color-text)] hover:border-brand-300 disabled:opacity-60"
      >
        {bookmarked ? (
          <BookmarkCheck className="w-4 h-4 text-brand-600 fill-current" />
        ) : (
          <Bookmark className="w-4 h-4 text-brand-600" />
        )}
        {bookmarked ? t("bookmark.remove") : t("bookmark.add")}
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => push(t("word.toast.plan"))}
        className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 shadow-xl shadow-brand-500/30 text-sm font-semibold text-white"
      >
        <CalendarPlus className="w-4 h-4" />
        {t("word.action.plan")}
      </motion.button>
    </div>
  );
}
