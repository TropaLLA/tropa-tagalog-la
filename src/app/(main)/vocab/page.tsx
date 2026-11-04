import Link from "next/link";
import { GeoAlt, EggFried, ChatQuote, Flag, Star, Dribbble, Award, Feather, Lightbulb } from "react-bootstrap-icons";
import { VOCAB } from "@/lib/vocab";
import MascotSays from "@/components/MascotSays";
import TopBar from "@/components/TopBar";

const look = {
  travel: { Icon: GeoAlt, color: "vocab-hub-card--aqua" },
  restaurant: { Icon: EggFried, color: "vocab-hub-card--yellow" },
  daily: { Icon: ChatQuote, color: "vocab-hub-card--green" },
} as const;

// Culture notes about Tambay. Plain cards, not links.
const CULTURE = [
  {
    Icon: Lightbulb,
    title: "Who's a tambay?",
    body: "A tambay is someone who hangs out around the neighborhood. The word is often traced to the English \"stand by.\"",
  },
  {
    Icon: Flag,
    title: "Barangay jerseys",
    body: "Tambays often wear jerseys, custom-made with their names or bought to represent their barangay (town or village).",
  },
  {
    Icon: Star,
    title: "The headband",
    body: "Headbands keep hair out of your face so it doesn't get in the way while playing.",
  },
  {
    Icon: Dribbble,
    title: "Barefoot games",
    body: "Pickup basketball and volleyball are often played barefoot, right on the street or court.",
  },
  {
    Icon: Award,
    title: "\"San Mig\" on the jersey",
    body: "A nod to San Miguel, the oldest and largest brewery in the Philippines. On jerseys it's just decoration to look \"official,\" not a real sponsor.",
  },
  {
    Icon: Feather,
    title: "Her bird companion",
    body: "Inspired by the blue-eared kingfisher, a bird native to the Philippines. It's there to support you with tips and hints.",
  },
];

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

      <h2 className="section-title culture-heading">Kilalanin si Tambay</h2>
      <p className="culture-sub">Get to know Tambay</p>
      <div className="vocab-row">
        {CULTURE.map(({ Icon, title, body }) => (
          <article key={title} className="culture-card">
            <Icon size={26} aria-hidden="true" />
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </>
  );
}
