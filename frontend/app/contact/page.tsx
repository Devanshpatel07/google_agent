import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8 px-4 text-slate-300">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
      
      <div className="space-y-3 border-b border-slate-800 pb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800/40 text-purple-300 text-xs font-semibold">
          <MessageSquare className="w-3.5 h-3.5" />
          Get In Touch
        </div>
        <h1 className="text-4xl font-extrabold text-white">Contact Backlink Hunter AI</h1>
        <p className="text-sm text-slate-400">Have questions or feedback about our AI agent platform?</p>
      </div>

      <div className="p-8 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-6">
        <div className="flex items-center gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800/40 text-purple-400 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Direct Support Email</div>
            <div className="text-sm font-bold text-white">support@backlinkhunter.ai</div>
          </div>
        </div>

        <p className="text-xs text-slate-500 text-center leading-relaxed">
          Our automated AI agent engine operates 24/7. Support inquiries are typically answered within 12 hours.
        </p>
      </div>
    </div>
  );
}
