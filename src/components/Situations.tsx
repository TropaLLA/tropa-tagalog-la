"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { POINTS, SITUATIONS, type Rating } from "@/lib/situations";
import styles from "./Situations.module.css";

const MAX = SITUATIONS.length * POINTS.best;
const REACTION: Record<Rating, string> = { best: "Ayos!", ok: "Pwede na.", miss: "Naku!" };
const RESULT_STYLE: Record<Rating, string> = { best: styles.best, ok: styles.ok, miss: styles.miss };

function Tambay({ size = 44 }: { size?: number }) {
  return (
    <Image src="/headshot.png" alt="Tambay" width={size} height={size} className={styles.avatar} />
  );
}

export default function Situations() {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const situation = SITUATIONS[index];
  const chosen = picked === null ? null : situation.choices[picked];
  const last = index === SITUATIONS.length - 1;

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    setScore((s) => s + POINTS[situation.choices[i].rating]);
  }

  function next() {
    if (last) {
      setFinished(true);
    } else {
      setIndex(index + 1);
      setPicked(null);
    }
  }

  function restart() {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    const pct = score / MAX;
    const headline = pct >= 0.8 ? "Magaling!" : pct >= 0.5 ? "Pwede na!" : "Subukan ulit!";
    const message =
      pct >= 0.8
        ? "You'd fit right in at the next family gathering."
        : pct >= 0.5
          ? "Good instincts. A few more rounds and these will feel natural."
          : "These take practice. Read the recap below and try again.";
    return (
      <div className={styles.wrap}>
        <div className={styles.top}>
          <Link href="/lesson" className={styles.back}>
            ← Lessons
          </Link>
        </div>
        <div className={styles.hero}>
          <Tambay size={72} />
          <h1>{headline}</h1>
          <div className={styles.score}>
            {score}/{MAX}
          </div>
          <p>{message}</p>
        </div>

        <h2 className="section-title">What you learned</h2>
        {SITUATIONS.map((s) => (
          <div key={s.id} className={styles.recap}>
            <span className={styles.recapEmoji}>{s.emoji}</span>
            <div>
              <strong>{s.place}</strong>
              <p>{s.norm}</p>
            </div>
          </div>
        ))}

        <button type="button" className="login-btn login-btn-primary" onClick={restart}>
          Play again
        </button>
        <Link href="/lesson" className="login-btn login-btn-yellow">
          Back to lessons
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <Link href="/lesson" className={styles.back}>
          ← Lessons
        </Link>
        <span className={styles.count}>
          {index + 1}/{SITUATIONS.length}
        </span>
      </div>
      <div className={styles.bar}>
        <div className={styles.barFill} style={{ width: `${(index / SITUATIONS.length) * 100}%` }} />
      </div>

      <div className={styles.ask}>
        <Tambay />
        <div className={styles.bubble}>Ano&apos;ng gagawin mo?</div>
      </div>

      <div className={styles.scene}>
        <div className={styles.sceneEmoji}>{situation.emoji}</div>
        <div className={styles.place}>{situation.place}</div>
        <p className={styles.setup}>{situation.setup}</p>
        {situation.line && (
          <div className={styles.quote}>
            <strong>{situation.line.tagalog}</strong>
            <small>{situation.line.english}</small>
          </div>
        )}
      </div>

      <div className={styles.choices}>
        {situation.choices.map((c, i) => {
          const isPicked = picked === i;
          const reveal = picked !== null;
          const cls = [
            styles.choice,
            reveal && isPicked ? RESULT_STYLE[c.rating] : "",
            reveal && !isPicked && c.rating === "best" ? styles.bestOutline : "",
            reveal && !isPicked && c.rating !== "best" ? styles.dim : "",
          ].join(" ");
          return (
            <button key={i} type="button" className={cls} disabled={reveal} onClick={() => choose(i)}>
              {c.say && <strong className={styles.say}>{c.say}</strong>}
              <span className={styles.text}>{c.text}</span>
            </button>
          );
        })}
      </div>

      {chosen && (
        <div className={styles.feedback}>
          <Tambay size={40} />
          <div>
            <strong className={`${styles.reaction} ${RESULT_STYLE[chosen.rating]}`}>
              {REACTION[chosen.rating]}
            </strong>
            <p>{chosen.why}</p>
            {chosen.rating !== "best" && (
              <p className={styles.hintBest}>The outlined answer was the best one.</p>
            )}
          </div>
        </div>
      )}

      {chosen && (
        <button type="button" className="login-btn login-btn-primary" onClick={next}>
          {last ? "See results" : "Next situation"}
        </button>
      )}
    </div>
  );
}
