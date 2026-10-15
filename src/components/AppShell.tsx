"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login";

  return (
    <div
      className={`phone-frame mx-auto shadow min-vh-100 d-flex flex-column ${
        isAuthPage ? "" : "bg-white"
      }`}
    >
      {!isAuthPage && <NavBar />}
      <main className="flex-grow-1 d-flex flex-column">{children}</main>
      {!isAuthPage && <Footer />}
    </div>
  );
}