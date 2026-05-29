import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Notion-Sans is Inter-based; Inter is the documented fallback.
const notionSans = Inter({
  variable: "--font-notion-sans",
  subsets: ["latin"],
  display: "swap",
});

// The original site's handwriting typeface — preserves its soul for bodies.
const xinye = localFont({
  variable: "--font-xinye",
  src: "./fonts/xinye.otf",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "字里 · Words Essence",
  description: "一处收存只言片语的地方 — 摘抄、诗与句子。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${notionSans.variable} ${xinye.variable} h-full`}
    >
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
