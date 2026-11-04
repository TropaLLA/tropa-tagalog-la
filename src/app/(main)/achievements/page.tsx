"use client";

import { useState, useSyncExternalStore } from "react";
import { LockFill } from "react-bootstrap-icons";
import TopBar from "@/components/TopBar";
import { ACHIEVEMENT_ICONS } from "@/components/achievementIcons";
import { ACHIEVEMENTS, liveStreak, loadProgress, type Progress } from "@/lib/progress";

const EMPTY: Progress = { lastActive: null, streak: 0, best: 0, earned: {} };
const noopSubscribe = () => () => {};

const dayLabel = (n: number) => `${n} day${n === 1 ? "" : "s"}`;
const prettyDate = (key: string) =>
  new Date(`${key}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

function Achievements({ progress }: { progress: Progress }) {
  const earnedCount = ACHIEVEMENTS.filter((a) => progress.earned[a.id]).length;
  return (
    <div>
      <div className="stat-row">
        <div className="stat-card stat-yellow">
          <span>🔥 Current streak</span>
          <strong>{dayLabel(liveStreak(progress))}</strong>
        </div>
        <div className="stat-card stat-aqua">
          <span>⭐ Best streak</span>
          <strong>{dayLabel(progress.best)}</strong>
        </div>
      </div>
      <p className="achv-note">
        A day counts when you finish a lesson, the daily puzzle, a Decipher puzzle, or Ano&apos;ng Gagawin Mo?
      </p>

      <h2 className="section-title">
        Achievements · {earnedCount}/{ACHIEVEMENTS.length}
      </h2>
      <ul className="achv-list stagger">
        {ACHIEVEMENTS.map((a) => {
          const earnedOn = progress.earned[a.id];
          const Icon = earnedOn ? ACHIEVEMENT_ICONS[a.id] : LockFill;
          return (
            <li key={a.id} className={`achv-item${earnedOn ? "" : " locked"}`}>
              <span className="achv-icon">
                <Icon size={22} aria-hidden="true" />
              </span>
              <div>
                <strong>{a.title}</strong>
                <p>{a.description}</p>
                <small>{earnedOn ? `Earned ${prettyDate(earnedOn)}` : "Locked"}</small>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="achv-note">Progress is saved on this device only.</p>
    </div>
  );
}

// Progress lives in localStorage, so it's only read in the browser.
function ClientAchievements() {
  const [progress] = useState(loadProgress);
  return <Achievements progress={progress} />;
}

export default function AchievementsPage() {
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  return (
    <>
      <TopBar title="Achievements" backHref="/home" />
      <div>{mounted ? <ClientAchievements /> : <Achievements progress={EMPTY} />}</div>
    </>
  );
}
