import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import Footer from '@/components/Footer';
import NavBar from '@/components/Navbar';
import Providers from './providers';
import AppShell from "@/components/AppShell";


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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const classString = `${geistSans.variable} ${geistMono.variable} wrapper`;
  return (
    <html lang="en">
      <body className={classString}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
