import Link from "next/link";
import { Signpost, CupHot, ChatDots } from "react-bootstrap-icons";
import { VOCAB } from "@/lib/vocab";

const look = {
  travel: { Icon: Signpost, color: "module-aqua" },
  restaurant: { Icon: CupHot, color: "module-yellow" },
  daily: { Icon: ChatDots, color: "module-green" },
} as const;

export default function VocabHubPage() {
  return (
    <>
      <h1 className="page-heading">Vocab</h1>
      <div className="module-list">
        {VOCAB.map((theme) => {
          const { Icon, color } = look[theme.slug as keyof typeof look];
          return (
            <Link key={theme.slug} href={`/vocab/${theme.slug}`} className={`module-card ${color}`}>
              <Icon size={32} />
              <div>
                <h2>{theme.title}</h2>
                <p>{theme.blurb}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}