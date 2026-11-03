"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Pair = { tagalog: string; english: string };
type Reply = {
  seen: string;
  tagalog: string;
  english: string;
  vocab: { word: string; meaning: string }[];
  culture_note: string | null;
  follow_up: Pair;
  suggested_replies: Pair[];
};
type Turn = { role: "user" | "model"; text: string };
type LogItem = { from: "me"; text: string } | { from: "tambay"; reply: Reply };

// Resize big phone photos before upload.
async function toJpeg(file: File, max = 1024): Promise<string> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.8);
}

async function ask(body: object): Promise<Reply> {
  const res = await fetch("/api/tambay-call", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "The call failed.");
  const r = data.reply as Reply;
  return { ...r, vocab: r.vocab ?? [], suggested_replies: r.suggested_replies ?? [], culture_note: r.culture_note ?? null };
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function CallPage() {
  const [phase, setPhase] = useState<"ready" | "ringing" | "call">("ready");
  const [photo, setPhoto] = useState<string | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [log, setLog] = useState<LogItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [showEnglish, setShowEnglish] = useState(false);
  const [showWords, setShowWords] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const callId = useRef(0);

  useEffect(() => {
    if (phase !== "call") return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  let latest: Reply | null = null;
  for (let i = log.length - 1; i >= 0; i--) {
    const item = log[i];
    if (item.from === "tambay") {
      latest = item.reply;
      break;
    }
  }

  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const id = ++callId.current;
    setError(null);
    setSeconds(0);
    setPhase("ringing");
    try {
      const dataUrl = await toJpeg(file);
      const reply = await ask({ image: dataUrl.split(",")[1], history: [] });
      if (id !== callId.current) return; // call was cancelled
      setPhoto(dataUrl);
      setTurns([
        { role: "user", text: "[I shared a photo]" },
        { role: "model", text: JSON.stringify(reply) },
      ]);
      setLog([{ from: "tambay", reply }]);
      setShowEnglish(false);
      setShowWords(false);
      setShowTranscript(false);
      setPhase("call");
    } catch (err) {
      if (id !== callId.current) return;
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setPhase("ready");
    }
  }

  async function send(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    const id = callId.current;
    setBusy(true);
    setError(null);
    try {
      const reply = await ask({ history: turns, message });
      if (id !== callId.current) return;
      setTurns([...turns, { role: "user", text: message }, { role: "model", text: JSON.stringify(reply) }]);
      setLog((l) => [...l, { from: "me", text: message }, { from: "tambay", reply }]);
      setInput("");
      setShowEnglish(false);
      setShowWords(false);
    } catch (err) {
      if (id !== callId.current) return;
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  function hangUp() {
    callId.current++;
    setPhase("ready");
    setPhoto(null);
    setTurns([]);
    setLog([]);
    setInput("");
    setError(null);
    setBusy(false);
    setSeconds(0);
    setShowEnglish(false);
    setShowWords(false);
    setShowTranscript(false);
  }

  const avatar = (active: boolean) => (
    <div className={`tc-avatar${active ? " tc-avatar-active" : ""}`}>
      <Image src="/headshot.png" alt="Tambay" width={200} height={200} priority />
    </div>
  );

  if (phase === "ready") {
    return (
      <div className="tc-screen">
        <div className="tc-top">
          <Link href="/lesson" className="tc-link">← Back</Link>
        </div>
        <div className="tc-center">
          {avatar(false)}
          <h1 className="tc-name">Tambay</h1>
          <p className="tc-status">Uy! Ano&apos;ng meron diyan? Send mo sa akin ang picture!</p>
          <p className="tc-sub">
            Share a photo of food, a place, or anything around you and Tambay will chat with you about it.
          </p>
        </div>
        {error && <p className="tc-error tc-error-pad">{error}</p>}
        <div className="tc-actions">
          <label className="tc-btn tc-btn-green">
            Take a photo
            <input type="file" accept="image/*" capture="environment" hidden onChange={onPhoto} />
          </label>
          <label className="tc-btn tc-btn-ghost">
            Upload a photo
            <input type="file" accept="image/*" hidden onChange={onPhoto} />
          </label>
        </div>
      </div>
    );
  }

  if (phase === "ringing") {
    return (
      <div className="tc-screen">
        <div className="tc-top" />
        <div className="tc-center">
          {avatar(true)}
          <h1 className="tc-name">Tambay</h1>
          <p className="tc-status">Calling…</p>
        </div>
        <div className="tc-actions">
          <button type="button" className="tc-btn tc-btn-red" onClick={hangUp}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tc-screen">
      <div className="tc-top">
        <div>
          <div className="tc-title">Tambay</div>
          <div className="tc-timer">{busy ? "typing…" : fmt(seconds)}</div>
        </div>
        <div className="tc-top-actions">
          <button type="button" className="tc-pill" onClick={() => setShowTranscript(true)}>
            Transcript
          </button>
          <button type="button" className="tc-hang" onClick={hangUp}>
            Hang up
          </button>
        </div>
      </div>

      {photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="Your photo" className="tc-pip" />
      )}

      <div className="tc-center tc-center-call">{avatar(busy)}</div>

      <div className="tc-sheet">
        {latest && (
          <>
            <div className="tc-say">{latest.tagalog}</div>
            <div className="tc-ask">{latest.follow_up.tagalog}</div>
            {showEnglish && (
              <div className="tc-english">
                {latest.english}
                {"\n"}
                {latest.follow_up.english}
              </div>
            )}
            <div className="tc-row">
              <button type="button" className="tc-chip" onClick={() => setShowEnglish(!showEnglish)}>
                {showEnglish ? "Hide English" : "Show English"}
              </button>
              <button type="button" className="tc-chip" onClick={() => setShowWords(!showWords)}>
                {showWords ? "Hide words" : "Words & culture"}
              </button>
            </div>
            {showWords && (
              <div className="tc-words">
                {latest.vocab.map((v) => (
                  <span key={v.word} className="tc-word">
                    {v.word} = {v.meaning}
                  </span>
                ))}
                {latest.culture_note && <p className="tc-note">{latest.culture_note}</p>}
              </div>
            )}
          </>
        )}

        {error && <p className="tc-error">{error}</p>}

        {latest && (
          <div className="tc-replies">
            {latest.suggested_replies.map((r, i) => (
              <button key={i} type="button" className="tc-reply" disabled={busy} onClick={() => send(r.tagalog)}>
                {r.tagalog}
                <small>{r.english}</small>
              </button>
            ))}
          </div>
        )}

        <form
          className="tc-input"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={busy ? "Tambay is typing…" : "Or type your own reply…"}
            disabled={busy}
          />
          <button type="submit" className="tc-send" aria-label="Send" disabled={busy}>
            ➤
          </button>
        </form>
      </div>

      {showTranscript && (
        <div className="tc-transcript">
          <div className="tc-top">
            <div className="tc-title">Transcript</div>
            <button type="button" className="tc-pill" onClick={() => setShowTranscript(false)}>
              Close
            </button>
          </div>
          <div className="tc-transcript-body">
            {log.map((item, i) =>
              item.from === "me" ? (
                <div key={i} className="tc-msg tc-msg-me">{item.text}</div>
              ) : (
                <div key={i} className="tc-msg tc-msg-tambay">
                  {item.reply.tagalog}
                  <small>{item.reply.english}</small>
                  <div className="tc-msg-q">{item.reply.follow_up.tagalog}</div>
                  <small>{item.reply.follow_up.english}</small>
                </div>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}