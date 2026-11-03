"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lightbulb, Mic, SendFill } from "react-bootstrap-icons";
import IntroCards from "@/components/IntroCards";
import LessonSummary, { type StepStats } from "@/components/LessonSummary";
import ScenarioCard from "@/components/ScenarioCard";
import { listen } from "@/lib/speech";
import { normalize, type Lesson, type Scenario } from "@/lib/lessons";

type Msg = {
  from: "mascot" | "me";
  text: string;
  sub?: string;
  tone?: "ok" | "error" | "hint";
};
type Tile = { id: number; text: string };

// Swap these for real art later (one image per mood).
const SPRITES = {
  neutral: "/mascot.png",
  happy: "/mascot.png",
  confused: "/mascot.png",
};

const blankStats = (count: number): StepStats[] =>
  Array.from({ length: count }, () => ({ wrong: [], notes: [], hinted: false }));

const openingMessages = (lesson: Lesson, scenario: Scenario): Msg[] => [
  { from: "mascot", text: lesson.intro },
  { from: "mascot", text: scenario.steps[0].prompt },
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
  const [phase, setPhase] = useState<"cards" | "brief" | "chat">("cards");
  const [mode, setMode] = useState<"tap" | "type">("tap");
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showScenario, setShowScenario] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [stats, setStats] = useState<StepStats[]>(() => blankStats(lesson.scenarios[0].steps.length));
  const [input, setInput] = useState("");
  const [picked, setPicked] = useState<number[]>([]);
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(() => openingMessages(lesson, lesson.scenarios[0]));
  const endRef = useRef<HTMLDivElement>(null);

  const scenario = lesson.scenarios[scenarioIndex];
  const steps = scenario.steps;
  const step = steps[index];

  const tiles = useMemo(
    () => shuffled([...wordsOf(step.hint), ...(step.distractors ?? [])], index + 1),
    [step, index],
  );
  const tileText = (id: number) => tiles.find((t) => t.id === id)?.text ?? "";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showTranscript]);

  if (phase === "cards") {
    return <IntroCards title={lesson.title} cards={lesson.cards} onDone={() => setPhase("brief")} />;
  }

  if (phase === "brief") {
    return (
      <div>
        <div className="chat-header">
          <Link href="/lesson" className="chat-back">← Lessons</Link>
          <strong>{lesson.title}</strong>
          <span>Your mission</span>
        </div>
        <ScenarioCard scenario={scenario} />
        <button type="button" className="login-btn login-btn-primary" onClick={() => setPhase("chat")}>
          Start
        </button>
        <p className="scenario-tip">Tap “Scenario” during the chat to read this again.</p>
      </div>
    );
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
      const next = steps[index + 1];
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

  // Moves to the next scenario (or repeats the only one) and shows its briefing.
  function restart() {
    const nextIndex = (scenarioIndex + 1) % lesson.scenarios.length;
    const next = lesson.scenarios[nextIndex];
    setScenarioIndex(nextIndex);
    setIndex(0);
    setFinished(false);
    setShowSummary(false);
    setShowScenario(false);
    setShowTranscript(false);
    setInput("");
    setPicked([]);
    setStats(blankStats(next.steps.length));
    setMessages(openingMessages(lesson, next));
    setPhase("brief");
  }

  if (showSummary) {
    return <LessonSummary lesson={lesson} scenario={scenario} stats={stats} onRestart={restart} />;
  }

  // What Tambay is saying right now: his latest consecutive lines, plus the current
  // question if it isn't already among them (for example after a wrong answer).
  let start = messages.length;
  while (start > 0 && messages[start - 1].from === "mascot") start--;
  const lines = messages.slice(start);
  const needsPrompt = !finished && !lines.some((m) => m.text === step.prompt);

  const lastTone = [...lines].reverse().find((m) => m.tone)?.tone;
  const mood = finished || lastTone === "ok" ? "happy" : lastTone === "error" ? "confused" : "neutral";

  return (
    <div className="chat">
      <div className="chat-header">
        <Link href="/lesson" className="chat-back">← Lessons</Link>
        <strong>{scenario.title}</strong>
        <span>{finished ? steps.length : index + 1}/{steps.length}</span>
      </div>

      <div className="vn-toggles">
        <button
          type="button"
          className="mode-toggle"
          onClick={() => { setShowScenario(!showScenario); setShowTranscript(false); }}
        >
          {showScenario ? "Back to chat" : "Scenario"}
        </button>
        <button
          type="button"
          className="mode-toggle"
          onClick={() => { setShowTranscript(!showTranscript); setShowScenario(false); }}
        >
          {showTranscript ? "Back to chat" : "Transcript"}
        </button>
      </div>

      {showScenario ? (
        <ScenarioCard scenario={scenario} />
      ) : showTranscript ? (
        <div className="chat-log">
          {messages.map((m, i) => (
            <div key={i} className={`chat-row ${m.from}`}>
              {m.from === "mascot" && (
                <Image src="/headshot.png" alt="" width={36} height={36} className="chat-avatar" />
              )}
              <div className={`chat-bubble ${m.tone ?? ""}`}>
                <div>{m.text}</div>
                {m.sub && <small>{m.sub}</small>}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      ) : (
        <>
          <div className="vn-stage">
            <Image
              key={mood}
              src={SPRITES[mood]}
              alt="Tambay"
              width={180}
              height={180}
              className="vn-sprite"
              priority
            />
          </div>
          <div className="vn-box">
            <div className="vn-name">Tambay</div>
            {lines.map((m, i) => (
              <div key={i} className={`vn-line ${m.tone ?? ""}`}>
                {m.text}
                {m.sub && <small>{m.sub}</small>}
              </div>
            ))}
            {needsPrompt && <div className="vn-line">{step.prompt}</div>}
          </div>
        </>
      )}

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