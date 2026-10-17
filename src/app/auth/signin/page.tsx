"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push("/home"); // change to wherever logged-in users should land
    router.refresh();
  }

  return (
    <div className="login-page">
      <div className="login-circle login-yellow" />
      <div className="login-circle login-green" />
      <div className="login-circle login-teal" />
      <div className="login-circle login-red" />

      <form onSubmit={handleSubmit} className="login-form">
        <Image src="/bird.png" alt="Mascot" width={120} height={120} className="login-bird" priority />
        <h1 className="login-title">Welcome!</h1>

        <label htmlFor="email" className="login-label">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          required
        />

        <label htmlFor="password" className="login-label">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />

        {error && <p className="login-error">{error}</p>}

        <button type="submit" className="login-btn login-btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>
        <Link href="/auth/signup" className="login-btn login-btn-secondary login-link">
          Sign up
        </Link>
      </form>
    </div>
  );
}