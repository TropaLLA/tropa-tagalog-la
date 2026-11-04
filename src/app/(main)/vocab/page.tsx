import Link from "next/link";
import { GeoAlt, EggFried, ChatQuote } from "react-bootstrap-icons";
import { VOCAB } from "@/lib/vocab";
import MascotSays from "@/components/MascotSays";

const look = {
  travel: { Icon: GeoAlt, color: "module-aqua" },
  restaurant: { Icon: EggFried, color: "module-yellow" },
  daily: { Icon: ChatQuote, color: "module-green" },
} as const;

export default function VocabHubPage() {
  return (
    <>
      <h1 className="page-heading">Vocab</h1>
      <MascotSays tagalog="Tara, mag-aral tayo ng mga salita!" english="Let's learn some words today!" />
      <div className="vocab-grid">
        {VOCAB.map((theme) => {
          const { Icon, color } = look[theme.slug as keyof typeof look];
          const words = theme.sections.flatMap((s) => s.items);
          const sample = words[0];
          return (
            <Link key={theme.slug} href={`/vocab/${theme.slug}`} className={`vocab-card ${color}`}>
              <Icon size={28} aria-hidden="true" />
              <h2>{theme.title}</h2>
              <p className="vocab-card-count">
                {words.length} {words.length === 1 ? "word" : "words"}
              </p>
              {sample && (
                <p className="vocab-card-sample">
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
