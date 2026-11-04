"use client";

import { useState } from "react";
import { Mic, VolumeUpFill } from "react-bootstrap-icons";
import { normalize } from "@/lib/lessons";
import { listen, speak } from "@/lib/speech";
import TopBar from "@/components/TopBar";
import type { VocabItem, VocabTheme } from "@/lib/vocab";

// "Nasaan ang...?" -> "Nasaan ang?" so the voice doesn't read out dots
const spoken = (text: string) => text.replace(/\.\.\./g, "").replace(/\s+/g, " ").trim();

export default function VocabList({ theme }: { theme: VocabTheme }) {
  const [listeningWord, setListeningWord] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, { ok: boolean; heard: string }>>({});

  function practice(item: VocabItem) {
    if (listeningWord) return;
    const target = normalize(spoken(item.word));
    setListeningWord(item.word);
    const supported = listen(
      (heard) =>
        setResults((r) => ({
          ...r,
          [item.word]: { ok: normalize(heard).includes(target), heard },
        })),
      () => setListeningWord(null),
    );
    if (!supported) {
      setListeningWord(null);
      alert("Speech input isn't supported in this browser. Try Chrome or Edge.");
    }
  }

  return (
    <>
      <TopBar title={theme.title} backHref="/vocab" />

      {theme.sections.map((section) => (
        <section key={section.heading}>
          <h2 className="vocab-section-title">{section.heading}</h2>

          {section.items.map((item) => {
            const result = results[item.word];
            return (
              <article key={item.word} className="vocab-card">
                <div className="vocab-top">
                  <div>
                    <h3 className="vocab-word">{item.word}</h3>
                    <p className="vocab-meaning">{item.meaning}</p>
                  </div>
                  <div className="vocab-actions">
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => speak(spoken(item.word))}
                      aria-label={`Listen to ${item.word}`}
                    >
                      <VolumeUpFill size={20} />
                    </button>
                    <button
                      type="button"
                      className={`icon-btn${listeningWord === item.word ? " listening" : ""}`}
                      onClick={() => practice(item)}
                      aria-label={`Repeat ${item.word}`}
                    >
                      <Mic size={20} />
                    </button>
                  </div>
                </div>

                {result && (
                  <p className={`vocab-result ${result.ok ? "ok" : "bad"}`}>
                    {result.ok ? "Magaling! Great pronunciation." : `Try again. I heard: “${result.heard}”`}
                  </p>
                )}

                <div className="vocab-example">
                  <button
                    type="button"
                    className="vocab-speak"
                    onClick={() => speak(item.example)}
                    aria-label="Listen to the example"
                  >
                    <VolumeUpFill size={16} />
                  </button>
                  <div>
                    <em>{item.example}</em>
                    <small>{item.exampleMeaning}</small>
                  </div>
                </div>

                {item.grammar && (
                  <p className="vocab-grammar">
                    <strong>Grammar:</strong> {item.grammar}
                  </p>
                )}
              </article>
            );
          })}
        </section>
      ))}
    </>
  );
}