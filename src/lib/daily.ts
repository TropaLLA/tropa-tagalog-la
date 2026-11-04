export type DailyState = { lastDone: string | null; streak: number; best: number };

const KEY = "tropa-daily";

/** Local calendar date as YYYY-MM-DD (the player's day, not UTC). */
export function todayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return todayKey(d);
}

export function loadDaily(): DailyState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (typeof s.streak === "number" && typeof s.best === "number") {
        return { lastDone: typeof s.lastDone === "string" ? s.lastDone : null, streak: s.streak, best: s.best };
      }
    }
  } catch {
    // storage unavailable or corrupted: start fresh
  }
  return { lastDone: null, streak: 0, best: 0 };
}

/** Call when today's puzzle is solved. Safe to call twice in one day. */
export function completeToday(): DailyState {
  const s = loadDaily();
  const today = todayKey();
  if (s.lastDone === today) return s;
  const streak = s.lastDone === yesterdayKey() ? s.streak + 1 : 1;
  const next: DailyState = { lastDone: today, streak, best: Math.max(s.best, streak) };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore: the streak just won't persist
  }
  return next;
}

/** The streak to display: it's broken if the last completion was before yesterday. */
export function liveStreak(s: DailyState): number {
  if (!s.lastDone) return 0;
  return s.lastDone === todayKey() || s.lastDone === yesterdayKey() ? s.streak : 0;
}
