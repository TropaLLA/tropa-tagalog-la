"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { PUZZLES, isMatch, keyOf, wordsInOrder, type Puzzle } from "@/lib/decipher";
import styles from "./Decipher.module.css";

// Difficulty knobs. Flip SHOW_WHICH to true if players find it too harsh.
const SHOW_WHICH = false; // false = Check only says "3 of 5 right"; true = it also marks which words are wrong
const MAX_HINTS = 2;

type Assigned = Record<string, string>;

export function PuzzleBoard({
  puzzle,
  onNext,
  nextLabel,
  onSolved,
}: {
  puzzle: Puzzle;
  onNext: () => void;
  nextLabel: string;
  onSolved?: () => void;
}) {
  const order = useMemo(() => wordsInOrder(puzzle), [puzzle]);

  const [assigned, setAssigned] = useState<Assigned>({});
  const [selected, setSelected] = useState<string | null>(order[0] ?? null);
  const [draft, setDraft] = useState("");
  const [results, setResults] = useState<Record<string, boolean> | null>(null);
  const [tries, setTries] = useState(0);
  const [hints, setHints] = useState(0);
  const [solved, setSolved] = useState(false);
  const [focusTick, setFocusTick] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the guess box only after the player does something, never on first load.
  useEffect(() => {
    if (focusTick > 0) inputRef.current?.focus();
  }, [focusTick]);

  const filled = order.filter((w) => assigned[w]).length;
  const rightCount = results ? order.filter((w) => results[w]).length : 0;
  const showMarks = results !== null && (SHOW_WHICH || solved);

  function choose(word: string) {
    if (solved) return;
    setSelected(word);
    setDraft(assigned[word] ?? "");
    setFocusTick((t) => t + 1);
  }

  function save(e?: React.FormEvent) {
    e?.preventDefault();
    if (!selected || solved) return;
    const text = draft.trim();
    const next = { ...assigned };
    if (text) next[selected] = text;
    else delete next[selected];
    setAssigned(next);
    setResults(null);

    const nextWord = order.find((w) => w !== selected && !next[w]) ?? null;
    setSelected(nextWord);
    setDraft(nextWord ? (next[nextWord] ?? "") : "");
    if (nextWord) setFocusTick((t) => t + 1);
  }

  function check() {
    const r: Record<string, boolean> = {};
    for (const w of order) r[w] = isMatch(puzzle, w, assigned[w] ?? "");
    setResults(r);
    setTries((t) => t + 1);
    if (order.every((w) => r[w])) {
        setSolved(true);
        onSolved?.();
    }
  }

  function hint() {
    if (solved || hints >= MAX_HINTS) return;
    const target = order.find((w) => !isMatch(puzzle, w, assigned[w] ?? ""));
    if (!target) return;
    const answer = puzzle.meanings[target][0];
    setAssigned({ ...assigned, [target]: answer });
    if (selected === target) setDraft(answer);
    setHints((h) => h + 1);
    setResults(null);
  }

  return (
    <>
      <h1 className={styles.title}>{puzzle.title}</h1>
      <p className={styles.intro}>
        Work out what the yellow words mean. Some sentences come with a translation and some don&apos;t, so compare
        sentences and use the pictures. Type your own guess for each word.
      </p>

      {puzzle.clues.map((clue, i) => (
        <div key={i} className={styles.clue}>
          <div className={styles.clueEmoji}>{clue.emoji}</div>
          <div className={styles.clueBody}>
            <div className={styles.sentence}>
              {clue.tagalog.split(/\s+/).map((token, j) => {
                const k = keyOf(token);
                if (!(k in puzzle.meanings)) {
                  return (
                    <span key={j} className={styles.plain}>
                      {token}
                    </span>
                  );
                }
                const cls = [
                  styles.word,
                  showMarks ? (results![k] ? styles.wordRight : styles.wordWrong) : "",
                  selected === k ? styles.wordSelected : "",
                ].join(" ");
                return (
                  <button
                    key={j}
                    type="button"
                    className={cls}
                    aria-pressed={selected === k}
                    disabled={solved}
                    onClick={() => choose(k)}
                  >
                    {token}
                    <span className={styles.wordMeaning}>{assigned[k] ?? "?"}</span>
                  </button>
                );
              })}
            </div>
            <p className={`${styles.english} ${clue.given || solved ? "" : styles.englishHidden}`}>
              {clue.given || solved ? clue.english : "???"}
            </p>
          </div>
        </div>
      ))}

      {!solved && (
        <form className={styles.guess} onSubmit={save}>
          <label className={styles.guessLabel} htmlFor="guess">
            {selected ? (
              <>
                What does <strong>{selected}</strong> mean?
              </>
            ) : filled === order.length ? (
              "All words filled in. Tap a word to change it, or hit Check."
            ) : (
              "Tap a yellow word to guess its meaning."
            )}
          </label>
          <div className={styles.guessRow}>
            <input
              id="guess"
              ref={inputRef}
              className={styles.guessInput}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type your guess…"
              disabled={!selected}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
            />
            <button type="submit" className={styles.saveBtn} disabled={!selected}>
              Save
            </button>
          </div>
        </form>
      )}

      {solved ? (
        <>
          <div className={`${styles.msg} ${styles.msgOk}`}>
            <strong>Magaling! You decoded it.</strong>
            <p className={styles.note}>
              Solved in {tries} {tries === 1 ? "try" : "tries"}
              {hints > 0 ? ` with ${hints} hint${hints === 1 ? "" : "s"}` : ""}.
            </p>
            <ul className={styles.keyList}>
              {order.map((w) => (
                <li key={w}>
                  <strong>{w}</strong> = {puzzle.meanings[w][0]}
                </li>
              ))}
            </ul>
            <p className={styles.note}>{puzzle.note}</p>
          </div>
          <button type="button" className="login-btn login-btn-primary" onClick={onNext}>
            {nextLabel}
          </button>
        </>
      ) : (
        <>
          {results && (
            <div className={`${styles.msg} ${styles.msgBad}`}>
              {rightCount} of {order.length} right.{" "}
              {SHOW_WHICH
                ? "Red words need another look."
                : "Some of your guesses are off. A word that shows up in several sentences is your best clue."}
            </div>
          )}
          <div className={styles.actions}>
            <button
              type="button"
              className="login-btn login-btn-yellow"
              onClick={hint}
              disabled={hints >= MAX_HINTS}
            >
              Hint ({MAX_HINTS - hints} left)
            </button>
            <button
              type="button"
              className="login-btn login-btn-primary"
              disabled={filled < order.length}
              onClick={check}
            >
              Check
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default function Decipher() {
  const [index, setIndex] = useState(0);
  const puzzle = PUZZLES[index];
  const last = index === PUZZLES.length - 1;

  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <Link href="/lesson" className={styles.back}>
          ← Lessons
        </Link>
        <span className={styles.count}>
          Puzzle {index + 1}/{PUZZLES.length}
        </span>
      </div>
      <PuzzleBoard
        key={puzzle.id}
        puzzle={puzzle}
        onNext={() => setIndex(last ? 0 : index + 1)}
        nextLabel={last ? "Play again" : "Next puzzle"}
      />
    </div>
  );
}
