import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Zap, Bot, Search } from "lucide-react";
import StatCounters from "@/components/StatCounters";
import LinkGraphBackground from "@/components/LinkGraphBackground";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] text-center px-4 space-y-8 py-8 z-10">
      <LinkGraphBackground />

      {/* Top Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/70 border border-purple-800/40 text-purple-300 text-xs font-bold tracking-wide shadow-lg shadow-purple-900/20">
        <Bot className="w-4 h-4 text-purple-400" />
        AI-Powered SEO &amp; Outreach Automation
      </div>

      {/* Main Benefit-Led Heading */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight max-w-4xl bg-gradient-to-r from-white via-purple-100 to-indigo-300 text-transparent bg-clip-text leading-tight">
        Boost Your Google Rankings with Autonomous AI SEO
      </h1>

      {/* Benefit-Led Subtitle */}
      <p className="text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
        Fix technical website issues, disavow toxic links, and connect with high-authority publications to earn high-converting backlinks in under 30 seconds.
      </p>

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
        <Link 
          href="/seo-audit" 
          className="group flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-base transition-all hover:scale-105 active:scale-95 shadow-xl shadow-purple-600/30"
        >
          <Sparkles className="w-5 h-5 text-purple-200" />
          Start Free SEO Audit
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link 
          href="/backlinks" 
          className="px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-purple-900/40 text-slate-200 hover:text-white rounded-2xl font-bold text-base transition flex items-center gap-2"
        >
          <Search className="w-5 h-5 text-purple-400" />
          Find Backlink Opportunities
        </Link>
      </div>

      {/* Server-Rendered Stat Counters */}
      <StatCounters />

      {/* Benefit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl pt-6 text-left text-xs">
        <div className="p-5 bg-slate-900/70 border border-purple-900/30 rounded-2xl space-y-1.5 hover:border-purple-600/40 transition">
          <div className="font-bold text-purple-300 text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-400" />
            30-Second Technical Audit
          </div>
          <p className="text-slate-400 leading-relaxed">
            Scan your full site structure, meta tags, and page speed issues with automated fix recommendations.
          </p>
        </div>
        <div className="p-5 bg-slate-900/70 border border-purple-900/30 rounded-2xl space-y-1.5 hover:border-purple-600/40 transition">
          <div className="font-bold text-purple-300 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            Protect Domain Reputation
          </div>
          <p className="text-slate-400 leading-relaxed">
            Detect toxic referring link farms and export 1-click Disavow files for Google Search Console.
          </p>
        </div>
        <div className="p-5 bg-slate-900/70 border border-purple-900/30 rounded-2xl space-y-1.5 hover:border-purple-600/40 transition">
          <div className="font-bold text-purple-300 text-sm flex items-center gap-2">
            <Bot className="w-4 h-4 text-purple-400" />
            AI Guest Post Copywriter
          </div>
          <p className="text-slate-400 leading-relaxed">
            Generate personalized outreach pitch emails tailored to target editors to secure guest contributions.
          </p>
        </div>
      </div>
    </div>
  );
}
