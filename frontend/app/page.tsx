import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-900/40 border border-blue-700/50 text-blue-300 text-sm font-medium tracking-wide">
        v1.0 Now Live
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-blue-200 to-indigo-400 text-transparent bg-clip-text">
        Automate Your Backlink Strategy
      </h1>
      <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
        Our AI-powered engine instantly audits any domain, scrapes the web for highly relevant guest post opportunities, and drafts personalized outreach pitches for you in seconds.
      </p>
      
      <Link href="/seo-audit" className="group flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10">
        Launch Platform
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
