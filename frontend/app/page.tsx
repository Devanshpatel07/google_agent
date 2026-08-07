import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Zap, Bot } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 space-y-8">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/70 border border-purple-800/40 text-purple-300 text-xs font-bold tracking-wide shadow-lg shadow-purple-900/20">
        <Bot className="w-4 h-4 text-purple-400" />
        SEOExpert Agent v1.0 Autonomous Engine
      </div>

      <h1 className="text-5xl md:text-7xl font-black tracking-tight max-w-4xl bg-gradient-to-r from-white via-purple-200 to-indigo-400 text-transparent bg-clip-text leading-tight">
        Autonomous SEO Audits & Intelligent Backlinking
      </h1>

      <p className="text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed">
        <strong>SEOExpert Agent</strong> autonomously audits website health, identifies critical technical vulnerabilities, flags toxic referring subnets, and scrapes high-authority backlink outreach opportunities in seconds.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
        <Link 
          href="/seo-audit" 
          className="group flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-base transition-all hover:scale-105 active:scale-95 shadow-xl shadow-purple-600/30"
        >
          <Sparkles className="w-5 h-5 text-purple-200" />
          Launch SEOExpert Agent
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link 
          href="/backlinks" 
          className="px-8 py-4 bg-gray-900 hover:bg-gray-800 border border-purple-900/40 text-gray-200 rounded-2xl font-bold text-base transition"
        >
          Browse Backlink Directory
        </Link>
      </div>

      {/* Feature Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl pt-10 text-left text-xs">
        <div className="p-4 bg-gray-900/60 border border-purple-900/30 rounded-2xl space-y-1">
          <div className="font-bold text-purple-300 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-purple-400" />
            Instant Crawling & Audit
          </div>
          <p className="text-gray-400">Playwright & BeautifulSoup live extraction with fast HTTP fallback.</p>
        </div>
        <div className="p-4 bg-gray-900/60 border border-purple-900/30 rounded-2xl space-y-1">
          <div className="font-bold text-purple-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            Toxic Subnet Detection
          </div>
          <p className="text-gray-400">Flags toxic referring link farms and downloads GSC disavow.txt files.</p>
        </div>
        <div className="p-4 bg-gray-900/60 border border-purple-900/30 rounded-2xl space-y-1">
          <div className="font-bold text-purple-300 flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-purple-400" />
            AI Guest Post Copywriter
          </div>
          <p className="text-gray-400">Generates 3-sentence high-converting outreach pitch emails automatically.</p>
        </div>
      </div>
    </div>
  );
}
