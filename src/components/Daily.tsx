"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { puzzleOfTheDay } from "@/lib/decipher";
import { completeToday, liveStreak, loadDaily, todayKey } from "@/lib/daily";
import { PuzzleBoard } from "./Decipher";
import board from "./Decipher.module.css";
import styles from "./Daily.module.css";

const noopSubscribe = () => () => {};

const dayLabel = (n: number) => `${n} day${n === 1 ? "" : "s"}`;

function DailyToday() {
  const router = useRouter();
  const [puzzle] = useState(() => puzzleOfTheDay());
  const [label] = useState(() =>
    new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" }),
  );
  const [initial] = useState(loadDaily);
  const [state, setState] = useState(initial);
  const [alreadyDone] = useState(initial.lastDone === todayKey());

  return (
    <div className={board.wrap}>
      <div className={board.top}>
        <span className={styles.streak}>🔥 {dayLabel(liveStreak(state))}</span>
      </div>
      <p className={styles.date}>Tambay Daily · {label}</p>

      {alreadyDone ? (
        <div className={styles.done}>
          <div className={styles.doneEmoji}>✅</div>
          <h1>Tapos na!</h1>
          <p>Magaling! You finished today&apos;s puzzle. Balik ka bukas!</p>
          <p className={styles.doneStats}>
            🔥 {dayLabel(liveStreak(state))} · Best: {dayLabel(state.best)}
          </p>
          <div className={styles.doneActions}>
            <Link href="/decipher" className="login-btn login-btn-yellow">
              Practice more puzzles
            </Link>
            <Link href="/home" className="login-btn login-btn-primary">
              Back home
            </Link>
          </div>
        </div>
      ) : (
        <PuzzleBoard
          puzzle={puzzle}
          onSolved={() => setState(completeToday())}
          onNext={() => router.push("/home")}
          nextLabel="Done"
        />
      )}
    </div>
  );
}

// The puzzle and streak depend on the player's date and saved data, so only render them in the browser.
export default function Daily() {
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  return mounted ? (
    <DailyToday />
  ) : (
    <div className={board.wrap}>
      <p>Loading today&apos;s puzzle…</p>
    </div>
  );
}
