"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";
import { motion } from "motion/react";

export function WordSpeaker({
  text,
  lang = "en-US",
  label,
}: {
  text: string;
  lang?: "en-US" | "en-GB";
  label?: string;
}) {
  const [pulse, setPulse] = useState(false);

  const speak = () => {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.9;
    synth.speak(u);
    setPulse(true);
    setTimeout(() => setPulse(false), 600);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={speak}
      className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-semibold transition-colors"
      aria-label={`播放 ${text}`}
    >
      <Volume2
        className={`w-3.5 h-3.5 transition-transform ${pulse ? "scale-125" : ""}`}
      />
      {label}
    </motion.button>
  );
}
