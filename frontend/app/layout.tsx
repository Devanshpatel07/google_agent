import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Cpu, Shield, Heart } from "lucide-react";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://google-agent-frontend-ahi8.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Backlink Hunter AI — Autonomous SEO Audit & Backlink Agent",
  description: "Fix technical website SEO errors, disavow toxic links, and discover high-authority backlink opportunities with AI outreach in seconds.",
  keywords: ["SEO Agent", "Backlink Hunter", "Technical SEO Audit", "AI Outreach", "Google Gemini API", "Guest Post Outreach"],
  authors: [{ name: "Backlink Hunter AI Team" }],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Backlink Hunter AI — Autonomous SEO Audit & Backlink Agent",
    description: "Fix technical website SEO errors, disavow toxic links, and discover high-authority backlink opportunities with AI outreach in seconds.",
    url: siteUrl,
    siteName: "Backlink Hunter AI",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Backlink Hunter AI Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Backlink Hunter AI — Autonomous SEO Audit & Backlink Agent",
    description: "Fix technical website SEO errors, disavow toxic links, and discover high-authority backlink opportunities with AI outreach in seconds.",
    images: ["/og-image.svg"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between">
        <div>
          <header className="flex justify-between items-center p-4 max-w-6xl mx-auto border-b border-purple-900/30">
            <Link href="/" className="font-black text-xl text-white tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-600/30">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <span>Backlink Hunter <span className="text-purple-400 font-bold">AI</span></span>
            </Link>
            <div className="flex items-center gap-3 md:gap-6">
              <Link href="/seo-audit" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-purple-600/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                SEO Audit Agent
              </Link>
              <Link href="/backlinks" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-purple-900/40 rounded-xl font-semibold text-sm transition text-slate-200 hover:text-white">
                Backlink Directory
              </Link>
            </div>
          </header>

          <main className="max-w-6xl mx-auto p-4 md:p-8">
            {children}
          </main>
        </div>

        {/* Global Footer (Fix #4) */}
        <footer className="border-t border-purple-900/30 bg-slate-950/90 py-8 px-4 mt-16">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200">Backlink Hunter AI</span>
              <span>© 2026. All rights reserved.</span>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-purple-300 transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-purple-300 transition">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-purple-300 transition">
                Contact Support
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
