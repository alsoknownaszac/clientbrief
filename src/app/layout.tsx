import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "ClientBrief Autopilot",
  description:
    "AI-powered client onboarding for freelance agencies. Collect briefs, analyse requirements, and deliver proposals — on autopilot.",
  openGraph: {
    title: "ClientBrief Autopilot",
    description: "AI-powered client onboarding for freelance agencies.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </body>
    </html>
  );
}
