"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { loadDaily, todayKey, type DailyState } from "@/lib/daily";
import { ACHIEVEMENTS, ACHIEVEMENT_EVENT, liveStreak, loadProgress, type Progress } from "@/lib/progress";
import TopBar from "@/components/TopBar";
import styles from "./home.module.css";

const EMPTY_DAILY: DailyState = { lastDone: null, streak: 0, best: 0 };
const EMPTY_PROGRESS: Progress = { lastActive: null, streak: 0, best: 0, earned: {} };
const noopSubscribe = () => () => {};

function greetingFor(hour: number) {
  if (hour < 12) return "Magandang umaga!";
  if (hour < 18) return "Magandang hapon!";
  return "Magandang gabi!";
}

type DashboardProps = { greeting: string; daily: DailyState; progress: Progress };

function Dashboard({ greeting, daily, progress }: DashboardProps) {
  const streak = liveStreak(progress);
  const doneToday = daily.lastDone === todayKey(); // today's puzzle specifically
  const activeToday = progress.lastActive === todayKey(); // any lesson, puzzle or game
  const earnedCount = ACHIEVEMENTS.filter((a) => progress.earned[a.id]).length;

  let dailyTitle = "Today's puzzle";
  let dailyText = "Decode new Tagalog words from clues.";
  if (doneToday) {
    dailyTitle = "Tapos na!";
    dailyText = "Come back tomorrow for a new puzzle.";
  } else if (activeToday) {
    dailyText = "Your streak is safe today. Solve it for extra practice.";
  } else if (streak > 0) {
    dailyTitle = "Keep your streak alive";
    dailyText = `Finish this puzzle or any lesson to reach ${streak + 1} days.`;
  }

  return (
    <div className={`${styles.page} stagger`}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={`${styles.greeting} title-screen`}>{greeting}</h1>
          <div className={styles.bubble}>Ready for today&apos;s lesson?</div>
        </div>
        <Image src="/mascot.png" alt="Tambay" width={84} height={174} className={styles.mascot} priority />
      </section>

      <div className="stat-row">
        <Link href="/achievements" className="stat-card stat-yellow">
          <span>🔥 Streak</span>
          <strong>{streak}</strong>
        </Link>
        <Link href="/achievements" className="stat-card stat-green">
          <span>🏆 Achievements</span>
          <strong>
            {earnedCount}/{ACHIEVEMENTS.length}
          </strong>
        </Link>
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
          <p>Show your food or your surroundings</p>
        </div>
        <span className={styles.chevron}>›</span>
      </Link>
    </div>
  );
}

// The greeting and streak depend on the player's clock and saved data, so they're only read in the browser.
function ClientDashboard() {
  const [greeting] = useState(() => greetingFor(new Date().getHours()));
  const [daily] = useState(loadDaily);
  const [progress, setProgress] = useState(loadProgress);
  // Refresh the counts when a badge is earned while Home is open (e.g. Welcome on first visit).
  useEffect(() => {
    const refresh = () => setProgress(loadProgress());
    window.addEventListener(ACHIEVEMENT_EVENT, refresh);
    return () => window.removeEventListener(ACHIEVEMENT_EVENT, refresh);
  }, []);
  return <Dashboard greeting={greeting} daily={daily} progress={progress} />;
}

export default function HomePage() {
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  return (
    <>
      <TopBar title="Home" />
      {/* Stable wrapper: swapping placeholder -> real dashboard shouldn't replay the fade-in. */}
      <div>{mounted ? <ClientDashboard /> : <Dashboard greeting="Kumusta!" daily={EMPTY_DAILY} progress={EMPTY_PROGRESS} />}</div>
    </>
  );
}
