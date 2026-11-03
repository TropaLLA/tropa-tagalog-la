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
        <Image src="/mascot.png" alt="Mascot" width={120} height={120} className="login-bird" priority />
        <h1 className="login-title">Tropa!</h1>
        <Image src="/logo.png" alt=" " width={120} height={120} className="login-bird" priority />
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