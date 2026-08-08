"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Copy, 
  Check, 
  Globe, 
  ShieldAlert, 
  ExternalLink,
  HelpCircle,
  AlertOctagon,
  Sparkles,
  RefreshCw
} from "lucide-react";

export default function AuditResults({ projectId }: { projectId: string }) {
  const [audit, setAudit] = useState<any>(null);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [selectedDraft, setSelectedDraft] = useState<string | null>(null);
  const [expandedIssues, setExpandedIssues] = useState<Record<number, boolean>>({});
  const [resolvedIssues, setResolvedIssues] = useState<Record<number, boolean>>({});
  const [copiedFixIdx, setCopiedFixIdx] = useState<number | null>(null);
  const [copiedDomainsIdx, setCopiedDomainsIdx] = useState<number | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const auditRes = await fetch(`${apiBase}/api/projects/${projectId}/seo-audit`);
        setAudit(await auditRes.json());
        
        const oppRes = await fetch(`${apiBase}/api/projects/${projectId}/opportunities`);
        setOpportunities(await oppRes.json());
      } catch (e) {
        console.error("Failed to load results", e);
      }
    };
    fetchData();
  }, [projectId]);

  if (!audit) {
    return (
      <div className="p-12 text-center text-gray-400 space-y-3 bg-gray-900/60 border border-gray-800 rounded-3xl">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-purple-400" />
        <p className="font-medium text-sm">Loading comprehensive audit data...</p>
      </div>
    );
  }

  // Tooltips for Non-SEO Judges ("Why this matters")
  const METRIC_TOOLTIPS: Record<string, string> = {
    word_count: "Search engines favor thorough, high-value content (600+ words) that completely satisfies search intent.",
    internal_links: "Distributes ranking power across your site hierarchy and helps Google discovery crawlers index deep pages.",
    external_links: "Referencing authoritative, relevant external sources proves domain credibility and factual trust.",
    toxic_links: "Low-quality or spammy backlinks from bad link networks can trigger harsh manual Google penalties.",
    domain_score: "Measures your site's overall search authority on a scale of 0 to 100 based on backlink quality.",
    meta_description: "Improves organic search click-through rates (CTR) by displaying a clean summary in Google SERP snippets."
  };

  const getSeverityLevel = (sev: string): "critical" | "warning" | "info" => {
    const normalized = (sev || "").toLowerCase();
    if (normalized === "critical" || normalized === "high") return "critical";
    if (normalized === "warning" || normalized === "medium") return "warning";
    return "info";
  };

  const severityBadges = {
    critical: {
      label: "CRITICAL",
      bg: "bg-red-500/10 border-red-500/30 text-red-400",
      cardBorder: "border-red-950/60 hover:border-red-500/40 bg-gradient-to-b from-red-950/20 to-gray-900/90",
      icon: <AlertOctagon className="w-4 h-4 text-red-400 flex-shrink-0" />
    },
    warning: {
      label: "WARNING",
      bg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
      cardBorder: "border-amber-950/60 hover:border-amber-500/40 bg-gradient-to-b from-amber-950/20 to-gray-900/90",
      icon: <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
    },
    info: {
      label: "INFO",
      bg: "bg-blue-500/10 border-blue-500/30 text-blue-400",
      cardBorder: "border-blue-950/60 hover:border-blue-500/40 bg-gradient-to-b from-blue-950/20 to-gray-900/90",
      icon: <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
    }
  };

  // Sort issues by severity (Critical first -> Warning -> Info)
  const sortedIssues = [...(audit.issues || [])].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return order[getSeverityLevel(a.severity)] - order[getSeverityLevel(b.severity)];
  });

  const toggleExpand = (idx: number) => {
    setExpandedIssues(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleResolve = (idx: number) => {
    setResolvedIssues(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getToxicSites = (issue: any): string[] => {
    if (issue.toxic_sites && Array.isArray(issue.toxic_sites) && issue.toxic_sites.length > 0) {
      return issue.toxic_sites;
    }
    return [];
  };

  const handleCopyFix = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedFixIdx(idx);
    setTimeout(() => setCopiedFixIdx(null), 2000);
  };

  const handleDownloadDisavow = (sites: string[], issueTitle: string) => {
    const fileContent = `# Disavow Rules Generated by Backlink Hunter AI\n# Issue: ${issueTitle}\n\n` +
      sites.map(s => `domain:${s}`).join("\n");
    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "disavow.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopySites = (sites: string[], idx: number) => {
    navigator.clipboard.writeText(sites.join("\n"));
    setCopiedDomainsIdx(idx);
    setTimeout(() => setCopiedDomainsIdx(null), 2000);
  };

  const resolvedCount = Object.values(resolvedIssues).filter(Boolean).length;
  const remainingCount = sortedIssues.length - resolvedCount;

  return (
    <div className="space-y-12">
      {/* Metrics Row with Judge Tooltips */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            Domain Overview & Core Metrics
          </h3>
          <span className="text-xs text-purple-400 font-medium">Hover (i) icon for judge insights</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(audit.metrics || {}).map(([key, val]) => {
            if (key === "title" || key === "meta_description") return null;
            const tooltip = METRIC_TOOLTIPS[key] || "Key SEO factor evaluated by search ranking engines.";

            return (
              <div 
                key={key} 
                className="p-5 bg-gray-900/90 border border-purple-900/30 hover:border-purple-500/40 rounded-2xl relative group transition shadow-lg"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="text-3xl font-black text-white">{String(val)}</div>
                  <div className="relative">
                    <button
                      type="button"
                      onMouseEnter={() => setActiveTooltip(key)}
                      onMouseLeave={() => setActiveTooltip(null)}
                      onClick={() => setActiveTooltip(activeTooltip === key ? null : key)}
                      className="text-purple-400 hover:text-purple-300 transition"
                      aria-label="Why this matters"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>

                    {/* Tooltip Card for Judges */}
                    {activeTooltip === key && (
                      <div className="absolute right-0 top-6 z-30 w-64 p-3 bg-slate-950 border border-purple-800/80 text-gray-200 text-xs rounded-xl shadow-2xl space-y-1 animate-fadeIn">
                        <div className="font-bold text-purple-300 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Why this matters:
                        </div>
                        <p className="text-gray-300 leading-relaxed">{tooltip}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">
                  {key.replace("_", " ")}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Redesigned Priority Issues Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-800 pb-4">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              Live Priority Issues ({sortedIssues.length})
            </h3>
            <p className="text-xs text-gray-400 mt-1">Sorted by severity. Click "Mark as resolved" to track progress during audit.</p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="px-3 py-1 bg-purple-950/80 border border-purple-800/40 text-purple-300 rounded-full">
              {remainingCount} Remaining
            </span>
            {resolvedCount > 0 && (
              <span className="px-3 py-1 bg-emerald-950/80 border border-emerald-800/40 text-emerald-300 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {resolvedCount} Resolved
              </span>
            )}
          </div>
        </div>

        {/* Distinct Issue Cards */}
        <div className="grid grid-cols-1 gap-5">
          {sortedIssues.map((issue: any, idx: number) => {
            const sev = getSeverityLevel(issue.severity);
            const badge = severityBadges[sev];
            const toxicSites = getToxicSites(issue);
            const isToxicIssue = toxicSites.length > 0;
            const isResolved = !!resolvedIssues[idx];
            const isExpanded = expandedIssues[idx] !== false;

            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className={`p-6 rounded-2xl border transition-all shadow-xl relative ${
                  isResolved 
                    ? "bg-gray-950/80 border-gray-800/60 opacity-60" 
                    : badge.cardBorder
                }`}
              >
                <div className="space-y-4">
                  {/* Top Bar: Severity Badge + Issue Title + Mark as Resolved Button */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-2 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      {/* Severity Badge */}
                      <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider border flex items-center gap-1.5 ${badge.bg}`}>
                        {badge.icon}
                        {badge.label}
                      </span>

                      {/* Issue Title */}
                      <h4 className={`font-black text-xl text-white tracking-tight ${isResolved ? "line-through text-gray-400" : ""}`}>
                        {issue.issue}
                      </h4>
                    </div>

                    {/* Mark as Resolved Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleResolve(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                        isResolved 
                          ? "bg-emerald-950 border border-emerald-700/60 text-emerald-300" 
                          : "bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 hover:text-white"
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${isResolved ? "text-emerald-400" : "text-gray-500"}`} />
                      {isResolved ? "Resolved" : "Mark as resolved"}
                    </button>
                  </div>

                  {/* Plain Language Explanation (1-2 sentences) */}
                  <p className="text-sm text-gray-300 leading-relaxed opacity-90">
                    {issue.explanation}
                  </p>

                  {/* Recommended Fix Box with Copy Button */}
                  <div className="p-4 bg-slate-950/90 border border-purple-900/40 rounded-xl space-y-2 relative group/fix shadow-inner">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Recommended Fix:
                      </span>

                      <button
                        type="button"
                        onClick={() => handleCopyFix(issue.fix_recommendation, idx)}
                        className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium rounded-lg flex items-center gap-1 transition"
                      >
                        {copiedFixIdx === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            Copied Fix
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy Fix Snippet
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-xs text-gray-200 font-mono bg-black/50 p-3 rounded-lg border border-purple-950/80 leading-relaxed overflow-x-auto">
                      {issue.fix_recommendation}
                    </div>
                  </div>

                  {/* Toxic Sites Section (if applicable) */}
                  {isToxicIssue && (
                    <div className="pt-2">
                      <div className="flex justify-between items-center pb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                          <Globe className="w-4 h-4" />
                          Flagged Toxic Referring Sites ({toxicSites.length}):
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopySites(toxicSites, idx)}
                            className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium rounded-lg flex items-center gap-1 transition"
                          >
                            {copiedDomainsIdx === idx ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                Copy Domains
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDownloadDisavow(toxicSites, issue.issue)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition shadow-sm shadow-red-600/30"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download disavow.txt
                          </button>
                        </div>
                      </div>

                      {/* Domain List Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-950/80 border border-slate-800 rounded-xl">
                        {toxicSites.map((site, sIdx) => (
                          <div 
                            key={sIdx}
                            className="flex justify-between items-center px-3 py-2 bg-gray-900/90 border border-gray-800 rounded-lg text-xs hover:border-red-500/40 transition"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                              <span className="font-mono text-gray-200 truncate">{site}</span>
                            </div>
                            <a
                              href={`https://${site}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-white transition flex-shrink-0"
                              title="Open site safely"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Verified Backlink Opportunities */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-white">Verified High-Quality Backlink Opportunities</h3>
          <span className="text-xs text-purple-400 font-semibold">{opportunities.length} Targets Verified</span>
        </div>

        <div className="overflow-x-auto border border-gray-800 rounded-2xl bg-gray-900/60 shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/90 border-b border-gray-800">
                <th className="p-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Domain</th>
                <th className="p-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Domain Rating</th>
                <th className="p-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Risk Level</th>
                <th className="p-4 font-bold text-gray-400 text-xs uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opp, idx) => (
                <tr key={idx} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-purple-400 font-bold text-base">{opp.domain}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-800 rounded-full">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{ width: `${opp.score}%` }} />
                      </div>
                      <span className="text-sm font-bold text-gray-200">{opp.score}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-semibold text-emerald-400">{opp.spam_risk}</td>
                  <td className="p-4 text-right">
                    <button 
                      type="button"
                      onClick={() => setSelectedDraft(opp.outreach_draft)}
                      className="px-4 py-2 bg-purple-950 hover:bg-purple-900 border border-purple-800/50 text-purple-200 rounded-xl text-xs font-bold flex items-center gap-1.5 ml-auto transition shadow-sm"
                    >
                      <FileText className="w-3.5 h-3.5 text-purple-400" />
                      View Pitch
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Outreach Pitch Modal */}
      {selectedDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md" onClick={() => setSelectedDraft(null)}>
          <div className="bg-gray-900 border border-purple-900/50 p-6 rounded-3xl w-full max-w-lg space-y-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              AI Outreach Draft
            </h3>
            <textarea 
              className="w-full h-64 bg-gray-950 border border-gray-800 rounded-2xl p-4 text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono text-xs leading-relaxed"
              defaultValue={selectedDraft}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button 
                type="button"
                onClick={() => setSelectedDraft(null)}
                className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white transition text-xs font-semibold"
              >
                Close
              </button>
              <button 
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(selectedDraft);
                  setSelectedDraft(null);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl transition text-xs font-bold shadow-lg shadow-purple-600/30"
              >
                Copy Pitch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
