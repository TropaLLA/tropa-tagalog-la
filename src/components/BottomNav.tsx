"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Book, Pencil } from "react-bootstrap-icons";

const tabs = [
  { href: "/home", label: "Home", Icon: House },
  { href: "/vocab", label: "Vocab", Icon: Book },
  { href: "/lesson", label: "Lesson", Icon: Pencil },
];

// Only these exact pages show the tabs. Lessons and word lists (/lesson/travel, /vocab/travel) don't.
const SHOW_ON = ["/home", "/vocab", "/lesson", "/settings"];

export default function BottomNav() {
  const pathname = usePathname();
  if (!SHOW_ON.includes(pathname)) return null;

  return (
    <nav className="bottom-nav">
      {tabs.map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          className={`bottom-nav-item${pathname.startsWith(href) ? " active" : ""}`}
        >
          <Icon size={22} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}