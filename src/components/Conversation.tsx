"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lightbulb, Mic, SendFill } from "react-bootstrap-icons";
import IntroCards from "@/components/IntroCards";
import LessonSummary, { type StepStats } from "@/components/LessonSummary";
import { listen } from "@/lib/speech";
import { normalize, type Lesson } from "@/lib/lessons";

type Msg = {
  from: "mascot" | "me";
  text: string;
  sub?: string;
  tone?: "ok" | "error" | "hint";
};
type Tile = { id: number; text: string };

const blankStats = (count: number): StepStats[] =>
  Array.from({ length: count }, () => ({ wrong: [], notes: [], hinted: false }));

const openingMessages = (lesson: Lesson): Msg[] => [
  { from: "mascot", text: lesson.intro },
  { from: "mascot", text: lesson.steps[0].prompt },
];

function wordsOf(sentence: string) {
  return sentence
    .replace(/[.,!?]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase());
}

// Same order every time for the same step, so nothing random happens while rendering.
function shuffled(words: string[], seed: number): Tile[] {
  const tiles = words.map((text, id) => ({ id, text }));
  let s = seed * 9301 + 49297;
  for (let i = tiles.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = s % (i + 1);
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles;
}

export default function Conversation({ lesson }: { lesson: Lesson }) {
  const [phase, setPhase] = useState<"cards" | "chat">("cards");
  const [mode, setMode] = useState<"tap" | "type">("tap");
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [stats, setStats] = useState<StepStats[]>(() => blankStats(lesson.steps.length));
  const [input, setInput] = useState("");
  const [picked, setPicked] = useState<number[]>([]);
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(() => openingMessages(lesson));
  const endRef = useRef<HTMLDivElement>(null);
  const step = lesson.steps[index];

  const tiles = useMemo(
    () => shuffled([...wordsOf(step.hint), ...(step.distractors ?? [])], index + 1),
    [step, index],
  );
  const tileText = (id: number) => tiles.find((t) => t.id === id)?.text ?? "";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (phase === "cards") {
    return <IntroCards title={lesson.title} cards={lesson.cards} onDone={() => setPhase("chat")} />;
  }

  // Returns true when the answer was correct.
  function check(raw: string): boolean {
    const text = raw.trim();
    if (!text || finished) return false;

    const added: Msg[] = [{ from: "me", text: text.charAt(0).toUpperCase() + text.slice(1) }];
    const clean = normalize(text);
    const correct = step.answers.some((a) => normalize(a) === clean);

    if (correct) {
      added.push({ from: "mascot", text: "Magaling! Great job!", tone: "ok" });
      const next = lesson.steps[index + 1];
      if (next) {
        added.push({ from: "mascot", text: next.prompt });
        setIndex(index + 1);
      } else {
        added.push({ from: "mascot", text: lesson.outro });
        setFinished(true);
      }
    } else {
      const known = step.mistakes?.find((m) => clean.includes(normalize(m.contains)));
      added.push({
        from: "mascot",
        text: known ? known.feedback : "Something is wrong, try again.",
        tone: "error",
      });
      setStats((all) =>
        all.map((s, i) =>
          i === index
            ? {
                ...s,
                wrong: [...s.wrong, text],
                notes: known && !s.notes.includes(known.feedback) ? [...s.notes, known.feedback] : s.notes,
              }
            : s,
        ),
      );
    }
    setMessages((m) => [...m, ...added]);
    return correct;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (check(input)) setInput("");
  }

  function checkTiles() {
    if (check(picked.map(tileText).join(" "))) setPicked([]);
  }

  function showHint() {
    if (finished) return;
    setStats((all) => all.map((s, i) => (i === index ? { ...s, hinted: true } : s)));
    setMessages((m) => [
      ...m,
      {
        from: "mascot",
        text: `Answer: ${step.hint}`,
        sub: `Question: ${step.translation}\nAnswer: ${step.hintTranslation}`,
        tone: "hint",
      },
    ]);
  }

  function startListening() {
    if (listening) return;
    setListening(true);
    const supported = listen(setInput, () => setListening(false));
    if (!supported) {
      setListening(false);
      alert("Speech input isn't supported in this browser. Try Chrome or Edge.");
    }
  }

  function restart() {
    setIndex(0);
    setFinished(false);
    setShowSummary(false);
    setInput("");
    setPicked([]);
    setStats(blankStats(lesson.steps.length));
    setMessages(openingMessages(lesson));
  }

  if (showSummary) {
    return <LessonSummary lesson={lesson} stats={stats} onRestart={restart} />;
  }

  return (
    <div className="chat">
      <div className="chat-header">
        <Link href="/lesson" className="chat-back">← Lessons</Link>
        <strong>{lesson.title}</strong>
        <span>{finished ? lesson.steps.length : index + 1}/{lesson.steps.length}</span>
      </div>

      <div className="chat-log">
        {messages.map((m, i) => (
          <div key={i} className={`chat-row ${m.from}`}>
            {m.from === "mascot" && (
              <Image src="/bird.png" alt="" width={36} height={36} className="chat-avatar" />
            )}
            <div className={`chat-bubble ${m.tone ?? ""}`}>
              <div>{m.text}</div>
              {m.sub && <small>{m.sub}</small>}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {finished ? (
        <button
          type="button"
          className="login-btn login-btn-yellow"
          onClick={() => setShowSummary(true)}
        >
          See my results
        </button>
      ) : (
        <>
          {mode === "tap" ? (
            <div>
              <div className="tap-answer">
                {picked.length === 0 && <span className="tap-placeholder">Tap the words in order</span>}
                {picked.map((id) => (
                  <button
                    key={id}
                    type="button"
                    className="tile tile-picked"
                    onClick={() => setPicked(picked.filter((p) => p !== id))}
                  >
                    {tileText(id)}
                  </button>
                ))}
              </div>

              <div className="tap-bank">
                {tiles
                  .filter((t) => !picked.includes(t.id))
                  .map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className="tile"
                      onClick={() => setPicked([...picked, t.id])}
                    >
                      {t.text}
                    </button>
                  ))}
              </div>

              <div className="tap-actions">
                <button type="button" className="icon-btn" onClick={showHint} aria-label="Hint">
                  <Lightbulb size={20} />
                </button>
                <button
                  type="button"
                  className="login-btn login-btn-primary"
                  onClick={checkTiles}
                  disabled={picked.length === 0}
                >
                  Check
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="chat-input">
              <button type="button" className="icon-btn" onClick={showHint} aria-label="Hint">
                <Lightbulb size={20} />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type or tap the mic…"
                className="chat-field"
              />
              <button
                type="button"
                className={`icon-btn${listening ? " listening" : ""}`}
                onClick={startListening}
                aria-label="Speak"
              >
                <Mic size={20} />
              </button>
              <button type="submit" className="icon-btn send" aria-label="Send">
                <SendFill size={18} />
              </button>
            </form>
          )}

          <button
            type="button"
            className="mode-toggle"
            onClick={() => setMode(mode === "tap" ? "type" : "tap")}
          >
            {mode === "tap" ? "Type instead" : "Tap words instead"}
          </button>
        </>
      )}
    </div>
  );
}