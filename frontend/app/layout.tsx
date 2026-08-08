import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Shield, Cpu } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "SEOExpert AI - Autonomous SEO Audit & Backlink Agent",
  description: "Autonomous SEO Agent for Domain Auditing, Toxic Link Detection, and AI Outreach",
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
      <body className="antialiased min-h-screen bg-slate-950 text-slate-100 font-sans">
        <header className="flex justify-between items-center p-4 max-w-6xl mx-auto border-b border-purple-900/30">
          <Link href="/" className="font-black text-xl text-white tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-600/30">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <span>SEOExpert <span className="text-purple-400 font-bold">AI Agent</span></span>
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
      </body>
    </html>
  );
}
