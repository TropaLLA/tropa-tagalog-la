"use client";

import { useEffect, useState } from "react";
import { ACHIEVEMENTS, ACHIEVEMENT_EVENT, recordVisit, type AchievementId } from "@/lib/progress";
import { ACHIEVEMENT_ICONS } from "./achievementIcons";

const SHOW_MS = 4500; // how long a toast stays up
const LEAVE_MS = 200; // matches the fade-out in motion.css

/** Small "achievement unlocked" toast at the top. Shows one at a time, never blocks the page. */
export default function AchievementToaster({ trackVisit }: { trackVisit: boolean }) {
  const [queue, setQueue] = useState<AchievementId[]>([]);
  const [leaving, setLeaving] = useState(false);
  const current = queue[0];

  // Listen first, so the Welcome event from recordVisit() below isn't missed.
  useEffect(() => {
    const onEarned = (e: Event) => {
      const ids = (e as CustomEvent<AchievementId[]>).detail;
      setQueue((q) => [...q, ...ids]);
    };
    window.addEventListener(ACHIEVEMENT_EVENT, onEarned);
    return () => window.removeEventListener(ACHIEVEMENT_EVENT, onEarned);
  }, []);

  useEffect(() => {
    if (trackVisit) recordVisit();
  }, [trackVisit]);

  // Auto-hide after a few seconds.
  useEffect(() => {
    if (!current || leaving) return;
    const t = setTimeout(() => setLeaving(true), SHOW_MS);
    return () => clearTimeout(t);
  }, [current, leaving]);

  // After the fade-out, drop it and show the next one (if any).
  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(() => {
      setQueue((q) => q.slice(1));
      setLeaving(false);
    }, LEAVE_MS);
    return () => clearTimeout(t);
  }, [leaving]);

  if (!current) return null;
  const achievement = ACHIEVEMENTS.find((a) => a.id === current);
  if (!achievement) return null;
  const Icon = ACHIEVEMENT_ICONS[current];

  return (
    <div className="achv-toast-wrap">
      <div key={current} className={`achv-toast${leaving ? " leaving" : ""}`} role="status" aria-live="polite">
        <span className="achv-icon">
          <Icon size={20} aria-hidden="true" />
        </span>
        <div className="achv-toast-text">
          <small>Achievement unlocked</small>
          <strong>{achievement.title}</strong>
        </div>
        <button type="button" className="btn-close" aria-label="Dismiss" onClick={() => setLeaving(true)} />
      </div>
    </div>
  );
}
