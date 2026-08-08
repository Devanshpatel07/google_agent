import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-4 text-slate-300">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
      
      <div className="space-y-3 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800/40 text-purple-300 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" />
          Trust &amp; Compliance
        </div>
        <h1 className="text-4xl font-extrabold text-white">Privacy Policy</h1>
        <p className="text-xs text-slate-500">Last updated: August 8, 2026</p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
          <p>
            Backlink Hunter AI collects only the target domain URLs submitted for technical SEO auditing and link prospecting. We do not store sensitive user credentials or personal browsing data.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. How We Use Data</h2>
          <p>
            Submitted target URLs are analyzed using Playwright and Google Gemini 1.5 Flash to generate technical audit reports and guest post pitches. Audit records are retained strictly for reporting and user history.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. Data Security</h2>
          <p>
            All API communications are encrypted via SSL/TLS. We do not sell or transfer analyzed URL data to third-party advertisers.
          </p>
        </section>
      </div>
    </div>
  );
}
