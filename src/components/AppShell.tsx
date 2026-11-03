"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NO_CHROME = ["/auth", "/home", "/vocab", "/lesson", "/settings", "/call"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = pathname === "/" || NO_CHROME.some((p) => pathname.startsWith(p));

  return (
    <div
      className={`phone-frame mx-auto shadow d-flex flex-column ${hideChrome ? "" : "bg-white"}`}
      style={{ height: "100dvh" }}
    >
      {!hideChrome && <NavBar />}
      <main
        className="flex-grow-1 d-flex flex-column"
        style={{ minHeight: 0, overflowY: "auto", overscrollBehavior: "contain" }}
      >
        {children}
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
}
