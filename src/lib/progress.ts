// Daily streak + achievements, saved in this browser's localStorage.
//
// A "day" counts when the player finishes any activity: a lesson, the daily
// puzzle, a Decipher puzzle, or a round of Ano'ng Gagawin Mo?. Each of those
// calls recordActivity(). Opening the app only earns the Welcome badge.
//
// Why localStorage and not the database: testers share one account, so a
// server-side streak would mix everyone's progress together. The catch is
// that progress stays on one device and browser.

import { loadDaily, todayKey, yesterdayKey } from "./daily";

export type AchievementId = "welcome" | "day1" | "day3" | "week" | "month";

export type Achievement = {
  id: AchievementId;
  title: string;
  description: string;
  /** Streak length that earns it. Welcome has none. */
  days?: number;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: "welcome", title: "Welcome!", description: "Opened Pocket Tropa for the first time." },
  { id: "day1", title: "First day", description: "Finished your first lesson, puzzle or game.", days: 1 },
  { id: "day3", title: "3 days in a row", description: "Practiced 3 days in a row.", days: 3 },
  { id: "week", title: "1 week streak", description: "Practiced 7 days in a row.", days: 7 },
  { id: "month", title: "1 month streak", description: "Practiced 30 days in a row.", days: 30 },
];

export type Progress = {
  lastActive: string | null; // YYYY-MM-DD of the last finished activity
  streak: number;
  best: number;
  earned: Partial<Record<AchievementId, string>>; // id -> YYYY-MM-DD earned
};

const KEY = "tropa-progress";

/** Window event fired with the ids of newly earned achievements (the toast listens for it). */
export const ACHIEVEMENT_EVENT = "tropa:achievement";

function save(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // storage unavailable: progress just won't persist
  }
}

/** Marks any not-yet-earned ids as earned today and returns the new ones. */
function earn(p: Progress, ids: AchievementId[]): AchievementId[] {
  const fresh = ids.filter((id) => !p.earned[id]);
  for (const id of fresh) p.earned[id] = todayKey();
  return fresh;
}

/** Streak badges the player qualifies for. Uses `best`, so a broken streak never takes a badge away. */
function streakBadges(p: Progress): AchievementId[] {
  return ACHIEVEMENTS.filter((a) => a.days !== undefined && p.best >= a.days).map((a) => a.id);
}

function notify(ids: AchievementId[]) {
  if (ids.length > 0) window.dispatchEvent(new CustomEvent(ACHIEVEMENT_EVENT, { detail: ids }));
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (typeof s.streak === "number" && typeof s.best === "number") {
        return {
          lastActive: typeof s.lastActive === "string" ? s.lastActive : null,
          streak: s.streak,
          best: s.best,
          earned: s.earned && typeof s.earned === "object" ? s.earned : {},
        };
      }
    }
  } catch {
    // corrupted: fall through and rebuild
  }

  // First run of this version: carry over the streak the old daily-puzzle code saved,
  // and quietly grant any streak badges it already qualifies for (no toast flood).
  const old = loadDaily();
  const p: Progress = { lastActive: old.lastDone, streak: old.streak, best: old.best, earned: {} };
  earn(p, streakBadges(p));
  save(p);
  return p;
}

/** The streak to show: 0 if the last activity was before yesterday. */
export function liveStreak(p: Progress): number {
  if (!p.lastActive) return 0;
  return p.lastActive === todayKey() || p.lastActive === yesterdayKey() ? p.streak : 0;
}

/** Call when the player finishes a lesson, puzzle or game. Safe to call more than once a day. */
export function recordActivity(): AchievementId[] {
  const p = loadProgress();
  const today = todayKey();
  if (p.lastActive !== today) {
    p.streak = p.lastActive === yesterdayKey() ? p.streak + 1 : 1;
    p.lastActive = today;
    p.best = Math.max(p.best, p.streak);
  }
  const fresh = earn(p, streakBadges(p));
  save(p);
  notify(fresh);
  return fresh;
}

/** Call when a signed-in screen opens. Earns Welcome the first time. */
export function recordVisit(): AchievementId[] {
  const p = loadProgress();
  const fresh = earn(p, ["welcome"]);
  if (fresh.length > 0) save(p);
  notify(fresh);
  return fresh;
}
