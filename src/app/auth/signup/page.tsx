"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { createUser } from "@/lib/dbActions";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
        try {
      await createUser({ email, password });
      await signIn("credentials", { email, password, callbackUrl: "/home" });
    } catch {
      setError("Couldn't create that account. The email may already be in use.");
    }
  }

  return (
    <div className="login-page">
      <div className="login-circle login-yellow" />
      <div className="login-circle login-green" />
      <div className="login-circle login-teal" />
      <div className="login-circle login-red" />

      <form onSubmit={handleSubmit} className="login-form">
        <Image src="/bird.png" alt="Mascot" width={120} height={120} className="login-bird" priority />
        <h1 className="login-title">Create account</h1>

        <label htmlFor="email" className="login-label">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="login-input" required />

        <label htmlFor="password" className="login-label">Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="login-input" required />

        <label htmlFor="confirm" className="login-label">Confirm password</label>
        <input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="login-input" required />

        {error && <p className="login-error">{error}</p>}

        <button type="submit" className="login-btn login-btn-yellow">Sign up</button>
        <Link href="/auth/signin" className="login-btn login-btn-primary login-link">
          Back to log in
        </Link>
      </form>
    </div>
  );
}