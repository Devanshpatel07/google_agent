import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-4 text-slate-300">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
      
      <div className="space-y-3 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800/40 text-purple-300 text-xs font-semibold">
          <FileText className="w-3.5 h-3.5" />
          Legal Terms
        </div>
        <h1 className="text-4xl font-extrabold text-white">Terms of Service</h1>
        <p className="text-xs text-slate-500">Last updated: August 8, 2026</p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Service Usage</h2>
          <p>
            By using Backlink Hunter AI, you agree to analyze only websites you own or have permission to audit. Automated web crawling adheres strictly to standard robots.txt protocols.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. AI Outreach Content</h2>
          <p>
            Generated guest post outreach pitches are provided as AI recommendations. Users are responsible for reviewing and sending cold outreach in compliance with applicable anti-spam regulations (CAN-SPAM, GDPR).
          </p>
        </section>
      </div>
    </div>
  );
}
