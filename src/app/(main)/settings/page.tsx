"use client";

import Image from "next/image";
import { signOut } from "next-auth/react";
import { ChevronRight } from "react-bootstrap-icons";
import TopBar from "@/components/TopBar";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="settings-title">{title}</h2>
      <div className="settings-card">{children}</div>
    </section>
  );
}

function LinkRow({ label }: { label: string }) {
  return (
    <button type="button" className="settings-row">
      <span>{label}</span>
      <ChevronRight size={16} aria-hidden="true" />
    </button>
  );
}

function ValueRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="settings-row">
      <span>{label}</span>
      <span className="settings-value">{value}</span>
    </div>
  );
}

function ToggleRow({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  return (
    <label className="settings-row">
      <span>{label}</span>
      <input type="checkbox" className="switch" defaultChecked={defaultOn} />
    </label>
  );
}

function SelectRow({
  label,
  options,
  defaultValue,
}: {
  label: string;
  options: string[];
  defaultValue: string;
}) {
  return (
    <label className="settings-row">
      <span>{label}</span>
      <select className="settings-select" defaultValue={defaultValue}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

export default function SettingsPage() {
  return (
    <>
      <TopBar title="Settings" backHref="/home" />

      <div className="settings-profile">
        <div className="settings-avatar">
          <Image src="/mascot.png" alt="" width={56} height={56} />
        </div>
        <div>
          <strong>Your name</strong>
          <small>you@example.com</small>
        </div>
      </div>

      <Section title="Account">
        <LinkRow label="Edit profile" />
        <ValueRow label="Email" value="you@example.com" />
        <LinkRow label="Change password" />
      </Section>

      <Section title="Learning">
        <SelectRow label="Daily goal" options={["5 minutes", "10 minutes", "15 minutes"]} defaultValue="10 minutes" />
        <ToggleRow label="Practice reminders" />
        <SelectRow label="Answer style" options={["Tap words", "Type"]} defaultValue="Tap words" />
        <ToggleRow label="Show phonetics" defaultOn />
      </Section>

      <Section title="Sound">
        <ToggleRow label="Sound effects" defaultOn />
        <SelectRow label="Voice speed" options={["Slow", "Normal"]} defaultValue="Normal" />
      </Section>

      <Section title="About">
        <LinkRow label="Help & feedback" />
        <LinkRow label="Privacy policy" />
        <ValueRow label="Version" value="0.1.0" />
      </Section>

      <div className="settings-actions">
        <button type="button" className="login-btn login-btn-primary" onClick={() => signOut({ callbackUrl: "/" })}>
          Log out
        </button>
      </div>
    </>
  );
}
