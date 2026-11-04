import Link from "next/link";
import { Signpost, CupHot, ChatDots } from "react-bootstrap-icons";
import GameCards from "@/components/GameCards";
import MascotSays from "@/components/MascotSays";
import TopBar from "@/components/TopBar";
import { LESSONS } from "@/lib/lessons";

const look = {
  travel: { Icon: Signpost, color: "module-aqua" },
  restaurant: { Icon: CupHot, color: "module-yellow" },
  daily: { Icon: ChatDots, color: "module-green" },
} as const;

export default function LessonHubPage() {
  return (
    <>
      <TopBar title="Lessons" />
      <MascotSays tagalog="Handa ka na ba?" english="Are you ready? Pick a lesson." />

      <h2 className="section-title" style={{ margin: "0.5rem 0 0.75rem" }}>
        Chat with Tambay
      </h2>
      <div className="module-list">
        {LESSONS.map((lesson) => {
          const { Icon, color } = look[lesson.slug as keyof typeof look];
          return (
            <Link key={lesson.slug} href={`/lesson/${lesson.slug}`} className={`module-card ${color}`}>
              <Icon size={32} />
              <div>
                <h2>{lesson.title}</h2>
                <p>{lesson.blurb}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <GameCards />
    </>
  );
}
