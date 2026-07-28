"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import AuditResults from "./AuditResults";

export default function SeoAuditPage() {
  const [url, setUrl] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setStatus("queued");
    setProjectId(null);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
      const res = await fetch(`${apiBase}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formattedUrl }),
      });
      
      if (!res.ok) throw new Error("Failed to start project");
      const data = await res.json();
      setProjectId(data.project_id);
    } catch (err: any) {
      setErrorMsg(err.message);
      setStatus(null);
    }
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
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [projectId, status]);

  const loadingStates = ["queued", "scraping", "auditing", "finding_backlinks", "verifying", "scoring", "drafting_outreach"];

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">SEO Audit & Backlinks</h2>
        <p className="text-gray-400">Enter a single URL to perform a complete analysis.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-4 max-w-2xl mx-auto">
        <input 
          type="url"
          required
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 px-6 py-4 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={status !== null && status !== "done" && status !== "error"}
        />
        <button 
          type="submit"
          className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg flex items-center gap-2 disabled:opacity-50"
          disabled={!url || (status !== null && status !== "done" && status !== "error")}
        >
          {status !== null && status !== "done" && status !== "error" ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          Analyze
        </button>
      </form>

      {errorMsg && (
        <div className="p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-lg text-center">
          {errorMsg}
        </div>
      )}

      {status && status !== "error" && status !== "done" && (
        <div className="p-8 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
          <div className="flex items-center gap-4 text-blue-400">
            <Loader2 className="animate-spin w-6 h-6" />
            <span className="text-lg font-medium capitalize animate-pulse">
              {status.replace("_", " ")}...
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(10, ((loadingStates.indexOf(status) + 1) / loadingStates.length) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {status === "done" && projectId && (
        <AuditResults projectId={projectId} />
      )}
    </div>
  );
}
