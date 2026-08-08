"use client";

import { useEffect, useState } from "react";
import { Search, ExternalLink, Mail, Copy, Check, Sparkles, Shield, TrendingUp, Filter, Globe, SlidersHorizontal } from "lucide-react";

interface BacklinkItem {
  id?: string;
  domain: string;
  url: string;
  score: number;
  relevance: string;
  spam_risk: string;
  niche?: string;
  language?: string;
  outreach_draft?: string;
}

const defaultOpportunities: BacklinkItem[] = [
  {
    domain: "hackernoon.com",
    url: "https://hackernoon.com/write-for-us",
    score: 88,
    relevance: "High",
    spam_risk: "Low",
    niche: "DevTools",
    language: "English",
    outreach_draft: "Hi HackerNoon team,\n\nI've been following your deep dives on software architecture. We engineered a multi-agent DAG framework with Playwright and LangGraph. I'd love to write a step-by-step tutorial for your developer audience.\n\nWould you be open to an outline?\n\nBest regards,"
  },
  {
    domain: "dev.to",
    url: "https://dev.to",
    score: 84,
    relevance: "High",
    spam_risk: "Low",
    niche: "DevTools",
    language: "English",
    outreach_draft: "Hey Dev.to editorial team,\n\nI built an open-source SEO audit agent combining Next.js 14, FastAPI, and Google Gemini 1.5 Flash. I'm preparing a practical guide on async state handling without WebSockets. Mind if I share an early draft?"
  },
  {
    domain: "searchengineland.com",
    url: "https://searchengineland.com",
    score: 91,
    relevance: "High",
    spam_risk: "Low",
    niche: "Marketing",
    language: "English",
    outreach_draft: "Hello Search Engine Land team,\n\nWe analyzed how autonomous web search footprints outperform static backlink databases. I've compiled our empirical data into a contributor piece.\n\nWould you be open to reviewing the outline?"
  },
  {
    domain: "smashingmagazine.com",
    url: "https://smashingmagazine.com",
    score: 89,
    relevance: "Medium",
    spam_risk: "Low",
    niche: "Technology",
    language: "English",
    outreach_draft: "Hi Smashing Magazine team,\n\nWe designed a real-time progress tracker UI for autonomous AI workflows that keeps users engaged during multi-second backend crawling tasks. I'd love to write a practical breakdown for your UX readers."
  },
  {
    domain: "techcrunch.com",
    url: "https://techcrunch.com",
    score: 94,
    relevance: "High",
    spam_risk: "Low",
    niche: "SaaS",
    language: "English",
    outreach_draft: "Hi TechCrunch team,\n\nWe built Backlink Hunter AI to automate guest post link building for SaaS startups. We'd love to share our benchmark metrics on AI outreach conversion rates."
  },
  {
    domain: "fintechweekly.com",
    url: "https://fintechweekly.com",
    score: 79,
    relevance: "Medium",
    spam_risk: "Low",
    niche: "Fintech",
    language: "English",
    outreach_draft: "Hi Fintech Weekly team,\n\nWe've analyzed technical SEO vulnerabilities across top fintech landing pages. I'd love to contribute an industry report for your readers."
  }
];

export default function BacklinksPage() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [opportunities, setOpportunities] = useState<BacklinkItem[]>(defaultOpportunities);
  const [copiedDomain, setCopiedDomain] = useState<string | null>(null);

  // Filters State
  const [selectedNiche, setSelectedNiche] = useState<string>("All niches");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All languages");
  const [minDa, setMinDa] = useState<number>(0);

  useEffect(() => {
    const fetchLatestOpportunities = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${apiBase}/api/projects`);
        if (res.ok) {
          const projects = await res.json();
          if (projects && projects.length > 0) {
            const latestProject = projects[0];
            const oppRes = await fetch(`${apiBase}/api/projects/${latestProject.project_id}/opportunities`);
            if (oppRes.ok) {
              const data = await oppRes.json();
              if (data && data.length > 0) {
                setOpportunities(data);
              }
            }
          }
        }
      } catch {
        // Fallback gracefully to default opportunities
      }
    };
    fetchLatestOpportunities();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword) return;
    setLoading(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const searchUrl = keyword.startsWith("http") ? keyword : `https://${keyword.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
      const res = await fetch(`${apiBase}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: searchUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        let attempts = 0;
        const interval = setInterval(async () => {
          attempts++;
          const oppRes = await fetch(`${apiBase}/api/projects/${data.project_id}/opportunities`);
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

  // Active Client-Side Filtering
  const filteredItems = opportunities.filter((item) => {
    // Niche filter
    if (selectedNiche !== "All niches") {
      const itemNiche = item.niche || "SaaS";
      if (itemNiche.toLowerCase() !== selectedNiche.toLowerCase()) return false;
    }
    // Language filter
    if (selectedLanguage !== "All languages") {
      const itemLang = item.language || "English";
      if (itemLang.toLowerCase() !== selectedLanguage.toLowerCase()) return false;
    }
    // Min DA score filter
    if (item.score < minDa) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-10 w-full max-w-6xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/60 border border-blue-800/40 text-blue-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          AI Backlink Hunter Directory
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Verified Backlink Opportunities
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
          Find high-authority guest post targets, filter by niche or Domain Score, and copy AI-crafted outreach pitches.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 max-w-3xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Enter keyword or target domain (e.g., techcrunch.com, SaaS, DevTools)..."
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

      {/* Filter Control Bar (Fix #3) */}
      <div className="p-4 bg-gray-900/80 border border-gray-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-gray-400 font-semibold pr-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-400" />
            Filters:
          </div>

          {/* Niche Filter Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Niche:</span>
            <select
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              className="bg-slate-950 border border-gray-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All niches">All niches</option>
              <option value="SaaS">SaaS</option>
              <option value="DevTools">DevTools</option>
              <option value="Marketing">Marketing</option>
              <option value="Technology">Technology</option>
              <option value="Fintech">Fintech</option>
            </select>
          </div>

          {/* Language Filter Dropdown */}
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-400">Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-slate-950 border border-gray-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All languages">All languages</option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="German">German</option>
              <option value="French">French</option>
            </select>
          </div>

          {/* Min DA Filter Select */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-400">Min DA Score:</span>
            <select
              value={minDa}
              onChange={(e) => setMinDa(Number(e.target.value))}
              className="bg-slate-950 border border-gray-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>All Scores (0+)</option>
              <option value={80}>High DA (80+)</option>
              <option value={85}>Ultra High (85+)</option>
              <option value={90}>Elite (90+)</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-gray-400 font-medium">
          Showing <span className="text-blue-400 font-bold">{filteredItems.length}</span> of {opportunities.length} sites
        </div>
      </div>

      {/* Opportunities Grid */}
      {filteredItems.length > 0 ? (
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
              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-blue-950/60 border border-blue-800/40 text-blue-300 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Relevance: {opp.relevance}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 font-medium flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Spam Risk: {opp.spam_risk}
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/40 text-purple-300 text-[10px] font-bold">
                  {opp.niche || "SaaS"}
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
      ) : (
        <div className="p-12 text-center bg-gray-900/60 border border-gray-800 rounded-3xl space-y-4 max-w-2xl mx-auto shadow-xl">
          <div className="w-12 h-12 rounded-full bg-blue-950/80 border border-blue-800/40 text-blue-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">No Sites Match Selected Filters</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Try resetting your niche or Min DA filters to view all available backlink opportunities.
          </p>
          <button
            onClick={() => {
              setSelectedNiche("All niches");
              setSelectedLanguage("All languages");
              setMinDa(0);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
