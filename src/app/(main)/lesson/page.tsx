import Link from "next/link";
import { Signpost, CupHot, ChatDots } from "react-bootstrap-icons";
import { LESSONS } from "@/lib/lessons";

const look = {
  travel: { Icon: Signpost, color: "module-aqua" },
  restaurant: { Icon: CupHot, color: "module-yellow" },
  daily: { Icon: ChatDots, color: "module-green" },
} as const;

export default function LessonHubPage() {
  return (
    <>
      <h1 className="page-heading">Lessons</h1>
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
    </>
  );
}