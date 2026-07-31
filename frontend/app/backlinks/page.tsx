"use client";

import { useState } from "react";
import { Search, ExternalLink, Mail, Copy, Check, Sparkles, Shield, TrendingUp, Filter } from "lucide-react";
import { API_BASE_URL } from "@/config/api";

interface BacklinkItem {
  id?: string;
  domain: string;
  url: string;
  score: number;
  relevance: string;
  spam_risk: string;
  outreach_draft?: string;
}

const DEFAULT_OPPORTUNITIES: BacklinkItem[] = [
  {
    domain: "techcrunch.com",
    url: "https://techcrunch.com/submit",
    score: 95,
    relevance: "High",
    spam_risk: "Low",
    outreach_draft: "Hi Editor,\n\nI loved your recent coverage on AI automation. I've prepared a comprehensive guide on modern agentic workflows that would be a perfect fit for TechCrunch readers.\n\nBest regards,\nAuthor"
  },
  {
    domain: "hackernoon.com",
    url: "https://hackernoon.com/write",
    score: 88,
    relevance: "High",
    spam_risk: "Low",
    outreach_draft: "Hello HackerNoon Team,\n\nI'm pitching a technical breakdown on high-performance web scrapers and SEO automation. Would love to submit this as a guest post.\n\nCheers!"
  },
  {
    domain: "smashingmagazine.com",
    url: "https://www.smashingmagazine.com/write-for-us",
    score: 84,
    relevance: "Medium",
    spam_risk: "Low",
    outreach_draft: "Hi Smashing Mag Team,\n\nI have an in-depth tutorial on Next.js 15 performance optimization ready for review. Let me know if you'd be interested in publishing this!\n\nThanks!"
  },
  {
    domain: "dev.to",
    url: "https://dev.to/new",
    score: 82,
    relevance: "High",
    spam_risk: "Low",
    outreach_draft: "Hey Dev Community,\n\nCheck out this guest article on automated SEO auditing algorithms built with FastAPI and Playwright.\n\nBest!"
  }
];

export default function BacklinksPage() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [opportunities, setOpportunities] = useState<BacklinkItem[]>(DEFAULT_OPPORTUNITIES);
  const [copiedDomain, setCopiedDomain] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "high">("all");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword) return;
    setLoading(true);

    try {
      // Trigger project creation with keyword URL
      const searchUrl = keyword.startsWith("http") ? keyword : `https://${keyword.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
      const res = await fetch(`${API_BASE_URL}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: searchUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        // Poll for opportunities
        let attempts = 0;
        const interval = setInterval(async () => {
          attempts++;
          const oppRes = await fetch(`${API_BASE_URL}/api/projects/${data.project_id}/opportunities`);
          if (oppRes.ok) {
            const oppData = await oppRes.json();
            if (oppData && oppData.length > 0) {
              setOpportunities(oppData);
              setLoading(false);
              clearInterval(interval);
            }
          }
          if (attempts > 6) {
            setLoading(false);
            clearInterval(interval);
          }
        }, 1500);
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, domain: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDomain(domain);
    setTimeout(() => setCopiedDomain(null), 2000);
  };

  const filteredItems = activeTab === "high" 
    ? opportunities.filter(o => o.score >= 85)
    : opportunities;

  return (
    <div className="space-y-10 w-full max-w-6xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/60 border border-blue-800/40 text-blue-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          AI Backlink Hunter Engine
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Backlink Opportunities Directory
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
          Discover high-authority guest post targets, filter by Domain Score, and copy AI-generated outreach drafts instantly.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 max-w-3xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Enter niche or target domain (e.g., techcrunch.com, SaaS, Marketing)..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-900/90 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !keyword}
          className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/20"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          Find Backlinks
        </button>
      </form>

      {/* Filter Tabs */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400 font-medium">Filter by Score:</span>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${activeTab === "all" ? "bg-blue-600 text-white" : "bg-gray-900 text-gray-400 hover:text-white"}`}
          >
            All Sites ({opportunities.length})
          </button>
          <button
            onClick={() => setActiveTab("high")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${activeTab === "high" ? "bg-blue-600 text-white" : "bg-gray-900 text-gray-400 hover:text-white"}`}
          >
            High Score (85+)
          </button>
        </div>
        <div className="text-xs text-gray-500">
          Showing {filteredItems.length} verified opportunities
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((opp, idx) => (
          <div
            key={idx}
            className="p-6 bg-gray-900/80 border border-gray-800 hover:border-blue-700/50 rounded-2xl space-y-4 transition group hover:shadow-xl hover:shadow-blue-900/10"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition flex items-center gap-2">
                  {opp.domain}
                  <a
                    href={opp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-white transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </h3>
                <p className="text-xs text-gray-400 truncate max-w-xs mt-1">{opp.url}</p>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-2xl font-black text-blue-400">{opp.score}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Domain Rating</span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-3 pt-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-blue-950/60 border border-blue-800/40 text-blue-300 font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Relevance: {opp.relevance}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 font-medium flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Spam Risk: {opp.spam_risk}
              </span>
            </div>

            {/* Outreach Draft Box */}
            {opp.outreach_draft && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 relative group/draft">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    AI Outreach Pitch
                  </span>
                  <button
                    onClick={() => handleCopy(opp.outreach_draft!, opp.domain)}
                    className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs rounded flex items-center gap-1.5 transition"
                  >
                    {copiedDomain === opp.domain ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy Email
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-300 whitespace-pre-line leading-relaxed italic">
                  "{opp.outreach_draft}"
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
