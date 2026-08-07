"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, Sparkles, AlertCircle, ArrowRight, CheckCircle, ShieldCheck } from "lucide-react";
import AuditResults from "./AuditResults";

export default function SeoAuditPage() {
  const [inputUrl, setInputUrl] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Clean and validate domain string
  const cleanAndValidateDomain = (raw: string): { valid: boolean; formattedUrl: string; domainName: string; error?: string } => {
    let cleaned = raw.trim();
    if (!cleaned) {
      return { valid: false, formattedUrl: "", domainName: "", error: "Please enter a domain name." };
    }
    // Remove protocol and trailing paths for clean domain check
    cleaned = cleaned.replace(/^https?:\/\//i, "").replace(/^www\./i, "").trim();
    const domainOnly = cleaned.split('/')[0].split('?')[0];

    // Domain regex pattern
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domainOnly)) {
      return { 
        valid: false, 
        formattedUrl: "", 
        domainName: "", 
        error: "Please enter a valid domain (e.g. yourdomain.com)." 
      };
    }

    return { 
      valid: true, 
      formattedUrl: `https://${domainOnly}`, 
      domainName: domainOnly 
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setErrorMsg(null);

    const validation = cleanAndValidateDomain(inputUrl);
    if (!validation.valid) {
      setValidationError(validation.error || "Invalid domain format.");
      return;
    }

    setStatus("queued");
    setProjectId(null);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiBase}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: validation.formattedUrl }),
      });
      
      if (!res.ok) throw new Error("Failed to start SEO audit project.");
      const data = await res.json();
      setProjectId(data.project_id);
    } catch (err: any) {
      setErrorMsg(err.message || "Unable to connect to backend server.");
      setStatus(null);
    }
  };

  const handleSelectExample = (domain: string) => {
    setInputUrl(domain);
    setValidationError(null);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (projectId && status !== "done" && status !== "error") {
      interval = setInterval(async () => {
        try {
          const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
          const res = await fetch(`${apiBase}/api/projects/${projectId}/status`);
          const data = await res.json();
          setStatus(data.status);
          if (data.status === "error") {
            setErrorMsg(data.error_message || "Unknown error occurred during pipeline run.");
          }
        } catch (e) {
          console.error("Status polling failed", e);
        }
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [projectId, status]);

  const loadingSteps = [
    { key: "queued", label: "Queuing Autonomous Pipeline" },
    { key: "scraping", label: "Scraping Live Webpage Content" },
    { key: "auditing", label: "Auditing On-Page SEO & Priority Issues" },
    { key: "finding_backlinks", label: "Discovering Backlink Candidates" },
    { key: "verifying", label: "Verifying Domain Health & Status" },
    { key: "scoring", label: "Scoring Authority & Risk Metrics" },
    { key: "drafting_outreach", label: "Drafting Personalized AI Outreach Pitches" }
  ];

  const currentStepIdx = loadingSteps.findIndex(s => s.key === status);
  const progressPercent = status === "done" 
    ? 100 
    : currentStepIdx >= 0 
      ? Math.round(((currentStepIdx + 1) / loadingSteps.length) * 100)
      : 10;

  return (
    <div className="space-y-10 w-full max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/60 border border-purple-800/40 text-purple-300 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          Autonomous SEO Audit Agent
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
          Complete Domain Audit & Backlinks
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
          Analyze any website instantly. Uncover priority technical SEO issues and discover high-authority backlink opportunities.
        </p>
      </div>

      {/* Input Form */}
      <div className="max-w-2xl mx-auto space-y-3">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <div className="relative flex-1">
            <input 
              type="text"
              placeholder="yourdomain.com"
              value={inputUrl}
              onChange={(e) => {
                setInputUrl(e.target.value);
                if (validationError) setValidationError(null);
              }}
              className={`w-full pl-6 pr-36 py-4 bg-gray-900/90 border rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition text-base font-medium shadow-xl ${
                validationError 
                  ? "border-red-500/70 focus:ring-red-500" 
                  : "border-purple-900/40 focus:border-purple-500 focus:ring-purple-500/30"
              }`}
              disabled={status !== null && status !== "done" && status !== "error"}
            />
            <button 
              type="submit"
              disabled={!inputUrl.trim() || (status !== null && status !== "done" && status !== "error")}
              className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-2 transition shadow-lg shadow-purple-600/30 text-sm"
            >
              {status !== null && status !== "done" && status !== "error" ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Analyze
            </button>
          </div>
        </form>

        {/* Validation Error Message */}
        {validationError && (
          <div className="flex items-center gap-2 text-red-400 text-xs font-semibold px-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Demo Example Domains Helper Link */}
        <div className="flex items-center justify-between text-xs text-gray-500 px-2 pt-1">
          <span>Try an example for demo:</span>
          <div className="flex items-center gap-3 font-medium">
            <button 
              type="button"
              onClick={() => handleSelectExample("vercel.com")}
              className="text-purple-400 hover:text-purple-300 hover:underline transition"
            >
              vercel.com
            </button>
            <span>•</span>
            <button 
              type="button"
              onClick={() => handleSelectExample("stripe.com")}
              className="text-purple-400 hover:text-purple-300 hover:underline transition"
            >
              stripe.com
            </button>
            <span>•</span>
            <button 
              type="button"
              onClick={() => handleSelectExample("github.com")}
              className="text-purple-400 hover:text-purple-300 hover:underline transition"
            >
              github.com
            </button>
          </div>
        </div>
      </div>

      {/* Global Error Banner */}
      {errorMsg && (
        <div className="p-4 bg-red-950/60 border border-red-500/50 text-red-300 rounded-2xl text-center text-sm font-medium shadow-lg max-w-2xl mx-auto flex items-center justify-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Intentional High-Tech Loading State */}
      {status && status !== "error" && status !== "done" && (
        <div className="p-8 bg-gray-900/90 border border-purple-900/30 rounded-3xl space-y-6 max-w-2xl mx-auto shadow-2xl backdrop-blur-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-purple-300">
              <Loader2 className="animate-spin w-5 h-5 text-purple-400" />
              <span className="text-base font-bold tracking-wide">
                {loadingSteps.find(s => s.key === status)?.label || "Processing Audit..."}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/80 px-2.5 py-1 rounded-full border border-purple-800/40">
              {progressPercent}%
            </span>
          </div>

          {/* Glowing Progress Bar */}
          <div className="w-full bg-gray-950 rounded-full h-2.5 overflow-hidden border border-gray-800">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-700 shadow-sm shadow-purple-500/50"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Step Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
            {loadingSteps.slice(1, 5).map((step, sIdx) => {
              const isDone = currentStepIdx > sIdx + 1;
              const isCurrent = currentStepIdx === sIdx + 1;
              return (
                <div 
                  key={step.key}
                  className={`p-2 rounded-xl border transition-all ${
                    isDone 
                      ? "bg-purple-950/40 border-purple-800/30 text-purple-300"
                      : isCurrent 
                        ? "bg-purple-900/60 border-purple-500/50 text-white font-bold animate-pulse"
                        : "bg-gray-950/40 border-gray-800/30 text-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    {isDone ? (
                      <CheckCircle className="w-3 h-3 text-purple-400 flex-shrink-0" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                    )}
                    <span className="truncate">{step.label.split(" ")[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Audit Results View */}
      {status === "done" && projectId && (
        <AuditResults projectId={projectId} />
      )}
    </div>
  );
}
