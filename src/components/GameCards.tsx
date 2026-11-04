import Link from "next/link";
import { Puzzle, People } from "react-bootstrap-icons";

const GAMES = [
  {
    href: "/decipher",
    title: "Decipher",
    blurb: "Crack the code: work out what Tagalog words mean from clues.",
    Icon: Puzzle,
    color: "module-yellow",
  },
  {
    href: "/situations",
    title: "Ano'ng Gagawin Mo?",
    blurb: "Pick the respectful move in real Filipino family situations.",
    Icon: People,
    color: "module-aqua",
  },
  // Add the next game here, for example { href: "/scenarios", title: "Ano'ng Gagawin Mo?", ... }
];

export default function GameCards() {
  return (
    <>
      <h2 className="section-title" style={{ margin: "1.5rem 0 0.75rem" }}>
        Games
      </h2>
      <div className="module-list">
        {GAMES.map(({ href, title, blurb, Icon, color }) => (
          <Link key={href} href={href} className={`module-card ${color}`}>
            <Icon size={32} />
            <div>
              <h2>{title}</h2>
              <p>{blurb}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
