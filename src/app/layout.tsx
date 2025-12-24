import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Dental Receptionist",
  description: "Sistema de recepción virtual con IA para clínicas dentales. Atiende llamadas 24/7 y agenda citas automáticamente.",
  keywords: ["IA Dental", "Recepción Virtual", "Clínica Dental", "Automatización", "SaaS Salud"],
  authors: [{ name: "AI Dental Team" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "AI Dental Receptionist",
    description: "Recepción virtual intelligente para tu clínica dental 24/7.",
    url: "https://ai-dental-receptionist.com",
    siteName: "AI Dental Receptionist",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Dental Receptionist",
    description: "Sistema de recepción virtual con IA para clínicas dentales.",
  },
};

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LiveChat } from "@/components/layout/LiveChat";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
        <LiveChat />
        <AnalyticsTracker />
        <Toaster />
      </body>
    </html>
  );
}
