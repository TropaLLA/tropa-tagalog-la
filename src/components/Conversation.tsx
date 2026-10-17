"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lightbulb, Mic, SendFill } from "react-bootstrap-icons";
import { normalize, type Lesson } from "@/lib/lessons";

type Msg = {
  from: "mascot" | "me";
  text: string;
  sub?: string;
  tone?: "ok" | "error" | "hint";
};

type Recognizer = {
  lang: string;
  interimResults: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
};
type RecognizerCtor = new () => Recognizer;

export default function Conversation({ lesson }: { lesson: Lesson }) {
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(() => [
    { from: "mascot", text: lesson.intro },
    { from: "mascot", text: lesson.steps[0].prompt },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const step = lesson.steps[index];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || finished) return;
    setInput("");

    const added: Msg[] = [{ from: "me", text }];
    const clean = normalize(text);

    if (step.answers.some((a) => normalize(a) === clean)) {
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
    }
    setMessages((m) => [...m, ...added]);
  }

  function showHint() {
    if (finished) return;
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
    const w = window as unknown as {
      SpeechRecognition?: RecognizerCtor;
      webkitSpeechRecognition?: RecognizerCtor;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) {
      alert("Speech input isn't supported in this browser. Try Chrome or Edge.");
      return;
    }
    const rec = new Ctor();
    rec.lang = "fil-PH";
    rec.interimResults = false;
    rec.onresult = (e) => setInput(e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    setListening(true);
    rec.start();
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
        <Link href="/lesson" className="login-btn login-btn-yellow">Back to lessons</Link>
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
    </div>
  );
}