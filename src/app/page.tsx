import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="login-page">
      <div className="login-circle login-yellow" />
      <div className="login-circle login-green" />
      <div className="login-circle login-teal" />
      <div className="login-circle login-red" />

      <div className="login-form landing-content">
        <div className="landing-hero">
          <Image src="/titles.png" alt="Tropa mascot" width={300} height={450} className="landing-mascot" priority />
          <div className="landing-brand">
            <Image src="/logo.png" alt="Tropa logo" width={300} height={300} className="landing-logo" priority />
            <h1 className="login-title title-screen">Tropa!</h1>
          </div>
        </div>

        <p className="landing-subtitle">
          Your pocket tropa for learning Tagalog!
        </p>

        <Link href="/auth/signup" className="login-btn login-btn-yellow login-link">
          Get started
        </Link>
        <Link href="/auth/signin" className="login-btn login-btn-primary login-link">
          I already have an account
        </Link>
      </div>
    </div>
  );
}
