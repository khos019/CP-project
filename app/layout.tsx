import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001"),
  title: "AlgoYo‘l — Algoritmlarni o‘rganing, bellashing, o‘sing",
  description: "O‘zbek tilidagi interaktiv algoritmlar yo‘l xaritalari, masalalar, kod tekshiruvchi va jonli duellar.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: { title: "AlgoYo‘l", description: "O‘rganing. Bellashing. O‘sing.", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "AlgoYo‘l", description: "O‘rganing. Bellashing. O‘sing.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz">
      <body className={`${geist.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}
