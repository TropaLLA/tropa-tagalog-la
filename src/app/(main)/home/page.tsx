"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { liveStreak, loadDaily, todayKey, type DailyState } from "@/lib/daily";
import styles from "./home.module.css";

const EMPTY: DailyState = { lastDone: null, streak: 0, best: 0 };
const noopSubscribe = () => () => {};

function greetingFor(hour: number) {
  if (hour < 12) return "Magandang umaga!";
  if (hour < 18) return "Magandang hapon!";
  return "Magandang gabi!";
}

function Dashboard({ greeting, state }: { greeting: string; state: DailyState }) {
  const streak = liveStreak(state);
  const doneToday = state.lastDone === todayKey();

  let dailyTitle = "Today's puzzle";
  let dailyText = "Decode new Tagalog words from clues.";
  if (doneToday) {
    dailyTitle = "Tapos na!";
    dailyText = "Come back tomorrow to keep your streak going.";
  } else if (streak > 0) {
    dailyTitle = "Keep your streak alive";
    dailyText = `Solve today's puzzle to reach ${streak + 1} days.`;
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.greeting}>{greeting}</h1>
          <div className={styles.bubble}>Ready for today&apos;s lesson?</div>
        </div>
        <Image src="/mascot.png" alt="Tambay" width={84} height={174} className={styles.mascot} priority />
      </section>

      <div className="stat-row">
        <div className="stat-card stat-yellow">
          <span>🔥 Streak</span>
          <strong>{streak}</strong>
        </div>
        <div className="stat-card stat-green">
          <span>🏆 Achievements</span>
          <strong>0</strong>
        </div>
      </div>

      <Link href="/lesson" className={styles.start}>
        Start Lesson
      </Link>

      <h2 className="section-title">Today</h2>
      <Link href="/daily" className={`${styles.card} ${doneToday ? styles.dailyDone : styles.daily}`}>
        <div className={styles.cardIcon}>{doneToday ? "✅" : "🧩"}</div>
        <div className={styles.cardBody}>
          <span className={styles.tag}>Tambay Daily</span>
          <h3>{dailyTitle}</h3>
          <p>{dailyText}</p>
        </div>
        <span className={styles.chevron}>›</span>
      </Link>

      <h2 className="section-title">Hang out with Tambay</h2>
      <Link href="/call" className={`${styles.card} ${styles.call}`}>
        <div className={styles.cardIcon}>📞</div>
        <div className={styles.cardBody}>
          <span className={styles.tag}>Call Tambay</span>
          <h3>Share a photo, chat in Tagalog</h3>
          <p>Show him your food or your surroundings and he&apos;ll talk about it with you.</p>
        </div>
        <span className={styles.chevron}>›</span>
      </Link>
    </div>
  );
}

// The greeting and streak depend on the player's clock and saved data, so they're only read in the browser.
function ClientDashboard() {
  const [greeting] = useState(() => greetingFor(new Date().getHours()));
  const [state] = useState(loadDaily);
  return <Dashboard greeting={greeting} state={state} />;
}

export default function HomePage() {
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  return mounted ? <ClientDashboard /> : <Dashboard greeting="Kumusta!" state={EMPTY} />;
}
