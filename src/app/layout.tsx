import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import Providers from './providers';
import AppShell from "@/components/AppShell";
import { quiapo, cubao, kagitingan } from "./fonts";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tropa",
  description: "Developed by Group 4 of SLS 480E.",
};

// "cover" lets the page draw under phone notches, so env(safe-area-inset-*) has real values.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const classString = `${geistSans.variable} ${geistMono.variable} wrapper`;
  return (
    <html lang="en" className={`${quiapo.variable} ${cubao.variable} ${kagitingan.variable}`}>
      <body className={classString}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
