"use client";

import Link from "next/link";
import { Dropdown } from "react-bootstrap";
import { ArrowLeft, List, Gear, BoxArrowRight } from "react-bootstrap-icons";
import { signOut } from "next-auth/react";

type Props = {
  title: string;
  /** Where the back arrow goes. Leave out (with onBack) on pages with nowhere to go back to. */
  backHref?: string;
  /** Runs instead of navigating, e.g. to ask "leave this lesson?" first. */
  onBack?: () => void;
};

export default function TopBar({ title, backHref, onBack }: Props) {
  let back = <span className="topbar-slot" aria-hidden="true" />;
  if (onBack) {
    back = (
      <button type="button" className="icon-btn" onClick={onBack} aria-label="Back">
        <ArrowLeft size={22} />
      </button>
    );
  } else if (backHref) {
    back = (
      <Link href={backHref} className="icon-btn" aria-label="Back">
        <ArrowLeft size={22} />
      </Link>
    );
  }

  return (
    <header className="topbar">
      {back}
      <h1 className="topbar-title">{title}</h1>
      <Dropdown align="end">
        <Dropdown.Toggle as="button" type="button" className="icon-btn" aria-label="Menu">
          <List size={26} />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item as={Link} href="/settings" className="menu-item">
            <Gear size={18} />
            <span>Settings</span>
          </Dropdown.Item>
          <Dropdown.Item
            as="button"
            className="menu-item"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <BoxArrowRight size={18} />
            <span>Log out</span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </header>
  );
}
