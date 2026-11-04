"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Reflection.module.css";

type Feel = "easy" | "okay" | "hard";
type Hard = "listening" | "speaking" | "vocabulary";

const FEEL: { id: Feel; emoji: string; label: string }[] = [
  { id: "easy", emoji: "😄", label: "Easy" },
  { id: "okay", emoji: "🙂", label: "Okay" },
  { id: "hard", emoji: "😓", label: "Hard" },
];

const HARD: { id: Hard; emoji: string; label: string }[] = [
  { id: "listening", emoji: "👂", label: "Listening" },
  { id: "speaking", emoji: "🗣️", label: "Speaking" },
  { id: "vocabulary", emoji: "📚", label: "Vocabulary" },
];

const TIPS: Record<Hard, { tip: string; cta: { href: string; label: string } }> = {
  listening: {
    tip: "Play a short Tagalog clip or song today and try to catch just one new word. You don't have to understand everything.",
    cta: { href: "/vocab", label: "Hear words in Vocab" },
  },
  speaking: {
    tip: "Say your answers out loud, even when you're alone. Talking to yourself in Tagalog counts as practice, and mistakes are part of it.",
    cta: { href: "/call", label: "Call Tambay" },
  },
  vocabulary: {
    tip: "Pick three words you missed and use each one in a short sentence of your own.",
    cta: { href: "/vocab", label: "Review vocab" },
  },
};

const FEEL_NOTE: Record<Feel, string> = {
  easy: "That felt easy, so try the next lesson for more of a challenge.",
  okay: "Steady work. A little practice each day adds up.",
  hard: "Hard lessons are where the learning happens. You can replay this one anytime.",
};

export default function Reflection() {
  const [stage, setStage] = useState<"feel" | "hard" | "tip" | "skipped">("feel");
  const [feel, setFeel] = useState<Feel | null>(null);
  const [hard, setHard] = useState<Hard | null>(null);

  if (stage === "skipped") return null;

  const tip = hard ? TIPS[hard] : null;

  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <Image src="/headshot.png" alt="Tambay" width={44} height={44} className={styles.avatar} />
        <div className={styles.bubble}>
          {stage === "feel" && "How was the lesson?"}
          {stage === "hard" && "What was the hardest part?"}
          {stage === "tip" && "Salamat! Here's one tip for next time."}
        </div>
      </div>

      {stage === "feel" && (
        <div className={styles.options}>
          {FEEL.map((o) => (
            <button
              key={o.id}
              type="button"
              className={styles.option}
              onClick={() => {
                setFeel(o.id);
                setStage("hard");
              }}
            >
              <span className={styles.emoji}>{o.emoji}</span>
              {o.label}
            </button>
          ))}
        </div>
      )}

      {stage === "hard" && (
        <div className={styles.options}>
          {HARD.map((o) => (
            <button
              key={o.id}
              type="button"
              className={styles.option}
              onClick={() => {
                setHard(o.id);
                setStage("tip");
              }}
            >
              <span className={styles.emoji}>{o.emoji}</span>
              {o.label}
            </button>
          ))}
        </div>
      )}

      {stage === "tip" && tip && feel && (
        <div className={styles.tip}>
          <p>{tip.tip}</p>
          <p className={styles.note}>{FEEL_NOTE[feel]}</p>
          <Link href={tip.cta.href} className="login-btn login-btn-yellow">
            {tip.cta.label}
          </Link>
        </div>
      )}

      {stage !== "tip" && (
        <button type="button" className={styles.skip} onClick={() => setStage("skipped")}>
          Skip
        </button>
      )}
    </section>
  );
}
