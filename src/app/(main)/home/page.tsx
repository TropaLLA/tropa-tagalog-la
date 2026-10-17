import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="speech-bubble">Ready for today&apos;s lesson?</div>
        <Image src="/bird.png" alt="Mascot" width={110} height={110} />
      </section>

      <div className="stat-row">
        <div className="stat-card stat-yellow">
          <span>Streak</span>
          <strong>0</strong>
        </div>
        <div className="stat-card stat-green">
          <span>Achievements</span>
          <strong>0</strong>
        </div>
      </div>

      <Link href="/lesson" className="start-btn">Start Lesson</Link>
    </>
  );
}