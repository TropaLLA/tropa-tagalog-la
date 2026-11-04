"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lightbulb, Mic, SendFill } from "react-bootstrap-icons";
import IntroCards from "@/components/IntroCards";
import LessonSummary, { type StepStats } from "@/components/LessonSummary";
import ScenarioCard from "@/components/ScenarioCard";
import TopBar from "@/components/TopBar";
import { completeToday } from "@/lib/daily";
import { listen } from "@/lib/speech";
import { normalize, type Lesson, type Scenario } from "@/lib/lessons";
import Reflection from "@/components/Reflection";

type Msg = {
  from: "mascot" | "me";
  text: string;
  sub?: string;
  tone?: "ok" | "error" | "hint";
};
type Tile = { id: number; text: string };

// Swap these for real art later (one image per mood).
const SPRITES = {
  neutral: "/headshot.png",
  happy: "/headshot.png",
  confused: "/headshot.png",
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
  const router = useRouter();
  const [phase, setPhase] = useState<"cards" | "brief" | "chat">("cards");
  const [mode, setMode] = useState<"tap" | "type">("tap");
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showScenario, setShowScenario] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showLeave, setShowLeave] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
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
        <TopBar title={lesson.title} backHref="/lesson" />
        <p className="chat-progress">Your mission</p>
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
        setHintLevel(0);
      } else {
        added.push({ from: "mascot", text: lesson.outro });
        setFinished(true);
        completeToday(); // finishing a lesson counts toward the home streak
      }
    } else {
      const known = step.mistakes?.find((m) => clean.includes(normalize(m.contains)));
      const attempts = stats[index].wrong.length; // wrong tries so far on this step

      // Feedback gets more specific the more times the learner tries.
      let feedback: string;
      if (attempts === 0) {
        feedback = "Good try! Something is wrong. Try again.";
      } else if (attempts === 1) {
        feedback = known ? known.feedback : "There is an error in your sentence. Check the words you used.";
      } else {
        feedback = known
          ? `${known.feedback} Tap the lightbulb if you want a hint.`
          : "Look closely at the vocabulary you used. Tap the lightbulb if you want a hint.";
      }

      added.push({ from: "mascot", text: feedback, tone: "error" });
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

  // Hints go step by step: translation, then word choices, then the answer.
  function showHint() {
    if (finished) return;
    setStats((all) => all.map((s, i) => (i === index ? { ...s, hinted: true } : s)));
    const level = Math.min(hintLevel + 1, 3);
    setHintLevel(level);

    let msg: Msg;
    if (level === 1) {
      msg = { from: "mascot", text: `Hint: the question means "${step.translation}"`, tone: "hint" };
    } else if (level === 2) {
      if (mode === "type") {
        setMode("tap");
        msg = {
          from: "mascot",
          text: "Here are some word choices. Tap them in order to build your answer.",
          tone: "hint",
        };
      } else {
        msg = { from: "mascot", text: `Try starting with "${wordsOf(step.hint)[0]}".`, tone: "hint" };
      }
    } else {
      msg = {
        from: "mascot",
        text: `Answer: ${step.hint}`,
        sub: `Question: ${step.translation}\nAnswer: ${step.hintTranslation}`,
        tone: "hint",
      };
    }
    setMessages((m) => [...m, msg]);
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
    setShowLeave(false);
    setHintLevel(0);
    setInput("");
    setPicked([]);
    setStats(blankStats(next.steps.length));
    setMessages(openingMessages(lesson, next));
    setPhase("brief");
  }

  if (showSummary) {
    return (
      <>
        <LessonSummary lesson={lesson} scenario={scenario} stats={stats} onRestart={restart} />
        <Reflection />
      </>
    );
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
      {/* Mid-lesson, the back arrow asks before leaving; once finished it just goes. */}
      <TopBar
        title={scenario.title}
        backHref="/lesson"
        onBack={finished ? undefined : () => setShowLeave(true)}
      />
      <p className="chat-progress">{finished ? steps.length : index + 1}/{steps.length}</p>

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
          <div
            className="vn-stage"
            style={
              scenario.background
                ? { backgroundImage: `url(${scenario.background})`, backgroundSize: "cover", backgroundPosition: "center" }
                : undefined
            }
          >
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

      {showLeave && (
        <div className="leave-overlay" role="dialog" aria-modal="true">
          <div className="leave-card">
            <Image src="/headshot.png" alt="" width={64} height={64} className="chat-avatar" />
            <h2>Aalis ka na?</h2>
            <p>Are you sure you want to go back? Your progress in this lesson won&apos;t be saved.</p>
            <button type="button" className="login-btn login-btn-primary" onClick={() => setShowLeave(false)}>
              Stay and keep practicing
            </button>
            <button type="button" className="mode-toggle" onClick={() => router.push("/lesson")}>
              Leave lesson
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
