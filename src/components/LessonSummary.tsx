"use client";

import Image from "next/image";
import Link from "next/link";
import type { Lesson, Scenario } from "@/lib/lessons";

export type StepStats = {
  wrong: string[]; // every wrong answer they submitted
  notes: string[]; // specific corrections they were shown
  hinted: boolean; // whether they opened the hint
};

function headline(firstTry: number, total: number) {
  if (firstTry === total) return "Perfect! Perpekto!";
  if (firstTry >= total / 2) return "Great job! Magaling!";
  return "Nice effort! Tuloy lang!";
}

export default function LessonSummary({
  lesson,
  scenario,
  stats,
  onRestart,
}: {
  lesson: Lesson;
  scenario: Scenario;
  stats: StepStats[];
  onRestart: () => void;
}) {
  const rows = scenario.steps.map((step, i) => ({
    step,
    s: stats[i],
    clean: stats[i].wrong.length === 0 && !stats[i].hinted,
  }));
  const total = rows.length;
  const firstTry = rows.filter((r) => r.clean).length;
  const mistakes = stats.reduce((n, s) => n + s.wrong.length, 0);
  const hints = stats.filter((s) => s.hinted).length;
  const right = rows.filter((r) => r.clean);
  const review = rows.filter((r) => !r.clean);

  return (
    <div>
      <div className="summary-hero">
        <Image src="/bird.png" alt="" width={96} height={96} />
        <h1>{headline(firstTry, total)}</h1>
        <p>You finished “{scenario.title}”.</p>
      </div>

      <div className="stat-row">
        <div className="stat-card stat-green">
          <span>First try</span>
          <strong>{firstTry}/{total}</strong>
        </div>
        <div className="stat-card stat-yellow">
          <span>Mistakes</span>
          <strong>{mistakes}</strong>
        </div>
        <div className="stat-card stat-aqua">
          <span>Hints</span>
          <strong>{hints}</strong>
        </div>
      </div>

      {right.length > 0 && (
        <section>
          <h2 className="summary-title">Got it right</h2>
          {right.map(({ step }) => (
            <div key={step.prompt} className="summary-row">
              <strong>{step.hint}</strong>
              <small>{step.hintTranslation}</small>
            </div>
          ))}
        </section>
      )}

      {review.length > 0 ? (
        <section>
          <h2 className="summary-title">Review these</h2>
          {review.map(({ step, s }) => (
            <div key={step.prompt} className="summary-row bad">
              <small>{step.prompt} ({step.translation})</small>
              <strong>{step.hint}</strong>
              <small>{step.hintTranslation}</small>
              {s.wrong.length > 0 && <small>You tried: {s.wrong.slice(0, 3).join(" · ")}</small>}
              {s.notes.map((n) => (
                <small key={n}>{n}</small>
              ))}
              {s.hinted && <small>You used a hint on this one.</small>}
            </div>
          ))}
        </section>
      ) : (
        <p className="summary-title">No mistakes. Walang mali!</p>
      )}

      <button type="button" className="login-btn login-btn-primary" onClick={onRestart}>
        {lesson.scenarios.length > 1 ? "Try another scenario" : "Practice again"}
      </button>
      <Link href={`/vocab/${lesson.slug}`} className="login-btn login-btn-secondary">
        Review the words
      </Link>
      <Link href="/lesson" className="login-btn login-btn-yellow">
        Back to lessons
      </Link>
    </div>
  );
}