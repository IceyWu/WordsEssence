import type { Metadata } from "next";
import localFont from "next/font/local";
// Inter shipped locally (self-hosted variable font) so builds never reach out
// to Google Fonts. Same typeface as before — see --font-sans in globals.css.
import "@fontsource-variable/inter";
import "./globals.css";

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
      className={`${xinye.variable} h-full`}
    >
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
