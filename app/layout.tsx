import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GreyVoice — Healthcare Integration | EMR Voice to Text",
  description: "Human-centered clinical documentation. Turn consultations into clinician-reviewed intake drafts and connect voice-to-text to your existing EMR. Explore per-minute pricing.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
