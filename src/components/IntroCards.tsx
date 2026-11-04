"use client";

import { useState } from "react";
import Image from "next/image";
import TopBar from "@/components/TopBar";
import { VolumeUpFill } from "react-bootstrap-icons";
import { speak } from "@/lib/speech";
import type { IntroCard } from "@/lib/lessons";

export default function IntroCards({
  title,
  cards,
  onDone,
}: {
  title: string;
  cards: IntroCard[];
  onDone: () => void;
}) {
  const [i, setI] = useState(0);
  const card = cards[i];
  const last = i === cards.length - 1;

  return (
    <div>
      <TopBar title={title} backHref="/lesson" />
      <p className="chat-progress">{i + 1}/{cards.length}</p>

      <div className="intro-card">
        <div className="intro-art">
          {card.image ? (
            <Image src={card.image} alt="" width={140} height={140} />
          ) : (
            <span className="intro-emoji" aria-hidden="true">{card.emoji}</span>
          )}
        </div>
        <h2 className="intro-word">{card.word}</h2>
        <p className="intro-phonetic">{card.phonetic}</p>
        <p className="intro-meaning">{card.meaning}</p>
        <button type="button" className="icon-btn" onClick={() => speak(card.word)} aria-label="Listen">
          <VolumeUpFill size={20} />
        </button>
      </div>

      <div className="intro-actions">
        {i > 0 && (
          <button type="button" className="login-btn login-btn-secondary" onClick={() => setI(i - 1)}>
            Back
          </button>
        )}
        <button
          type="button"
          className="login-btn login-btn-primary"
          onClick={() => (last ? onDone() : setI(i + 1))}
        >
          {last ? "Start lesson" : "Next"}
        </button>
      </div>

      <button type="button" className="mode-toggle" onClick={onDone}>
        Skip to practice
      </button>
    </div>
  );
}