import type { Metadata } from "next";
import "./globals.css";
import { THEME_INIT_SCRIPT } from "./ui/theme-script";

// next/font/google emitted absolute build-machine paths
// (file:///C:/.../.vinext/fonts/...) into the deployed stylesheet, so every
// @font-face failed in production and the whole site fell back to an unstyled
// default. Typography now comes from a native stack defined in globals.css,
// which needs no network request and cannot break on deploy.

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
    // data-theme is rewritten by the head script before first paint when a dark
    // choice is stored, so the server's "light" may differ from the attribute
    // React hydrates against — hence suppressHydrationWarning on <html> only.
    <html lang="uz" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
