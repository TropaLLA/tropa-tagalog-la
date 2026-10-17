"use client";

import Link from "next/link";
import { Dropdown } from "react-bootstrap";
import { List, Gear, BoxArrowRight } from "react-bootstrap-icons";
import { signOut } from "next-auth/react";

export default function TopBar() {
  return (
    <header className="topbar">
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