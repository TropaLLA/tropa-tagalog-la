import Link from "next/link";
import { GeoAlt, EggFried, ChatQuote } from "react-bootstrap-icons";
import { VOCAB } from "@/lib/vocab";
import MascotSays from "@/components/MascotSays";
import TopBar from "@/components/TopBar";

const look = {
  travel: { Icon: GeoAlt, color: "vocab-hub-card--aqua" },
  restaurant: { Icon: EggFried, color: "vocab-hub-card--yellow" },
  daily: { Icon: ChatQuote, color: "vocab-hub-card--green" },
} as const;

export default function VocabHubPage() {
  return (
    <>
      <TopBar title="Vocab" />
      <MascotSays tagalog="Tara, mag-aral tayo ng mga salita!" english="Let's learn some words today!" />
      <div className="vocab-row">
        {VOCAB.map((theme) => {
          const { Icon, color } = look[theme.slug as keyof typeof look];
          const words = theme.sections.flatMap((s) => s.items);
          const sample = words[0];
          return (
            <Link key={theme.slug} href={`/vocab/${theme.slug}`} className={`vocab-hub-card ${color}`}>
              <Icon size={28} aria-hidden="true" />
              <h2>{theme.title}</h2>
              <p className="vocab-hub-card-count">
                {words.length} {words.length === 1 ? "word" : "words"}
              </p>
              {sample && (
                <p className="vocab-hub-card-sample">
                  {sample.word} → {sample.meaning}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </>
  );
}
