"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, AlertTriangle, Info, CheckCircle2, FileText } from "lucide-react";

export default function AuditResults({ projectId }: { projectId: string }) {
  const [audit, setAudit] = useState<any>(null);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [selectedDraft, setSelectedDraft] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auditRes = await fetch(`http://localhost:8000/api/projects/${projectId}/seo-audit`);
        setAudit(await auditRes.json());
        
        const oppRes = await fetch(`http://localhost:8000/api/projects/${projectId}/opportunities`);
        setOpportunities(await oppRes.json());
      } catch (e) {
        console.error("Failed to load results", e);
      }
    };
    fetchData();
  }, [projectId]);

  if (!audit) return <div className="text-center text-gray-500">Loading results...</div>;

  const severityColor = {
    high: "text-red-400 bg-red-400/10 border-red-500/20",
    medium: "text-orange-400 bg-orange-400/10 border-orange-500/20",
    low: "text-blue-400 bg-blue-400/10 border-blue-500/20"
  };

  const severityIcon = {
    high: <AlertCircle className="w-5 h-5 text-red-500" />,
    medium: <AlertTriangle className="w-5 h-5 text-orange-500" />,
    low: <Info className="w-5 h-5 text-blue-500" />
  };

  return (
    <div className="space-y-12">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(audit.metrics).map(([key, val]) => (
          key !== "title" && key !== "meta_description" && (
            <div key={key} className="p-4 bg-gray-900 border border-gray-800 rounded-xl text-center">
              <div className="text-3xl font-bold text-white">{String(val)}</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                {key.replace("_", " ")}
              </div>
            </div>
          )
        ))}
      </div>

      {/* SEO Errors */}
      <section className="space-y-6">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          SEO Issues
        </h3>
        <div className="grid gap-4">
          {audit.issues?.map((issue: any, idx: number) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-5 rounded-xl border ${severityColor[issue.severity as keyof typeof severityColor]}`}
            >
              <div className="flex items-start gap-4">
                {severityIcon[issue.severity as keyof typeof severityIcon]}
                <div className="flex-1 space-y-2">
                  <h4 className="font-semibold text-lg">{issue.issue}</h4>
                  <p className="text-sm opacity-80">{issue.explanation}</p>
                  <div className="text-sm bg-black/20 p-3 rounded-lg flex items-center gap-2 mt-4">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-gray-300">Fix: {issue.fix_recommendation}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Backlink Opportunities */}
      <section className="space-y-6">
        <h3 className="text-2xl font-bold">Verified Backlink Opportunities</h3>
        <div className="overflow-x-auto border border-gray-800 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800">
                <th className="p-4 font-medium text-gray-400">Domain</th>
                <th className="p-4 font-medium text-gray-400">Score</th>
                <th className="p-4 font-medium text-gray-400">Risk</th>
                <th className="p-4 font-medium text-gray-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opp, idx) => (
                <tr key={idx} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-emerald-400 font-medium">{opp.domain}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-800 rounded-full">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${opp.score}%` }} />
                      </div>
                      <span className="text-sm text-gray-300">{opp.score}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-400">{opp.spam_risk}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => setSelectedDraft(opp.outreach_draft)}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm flex items-center gap-2 ml-auto"
                    >
                      <FileText className="w-4 h-4" />
                      View Draft
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Draft Modal */}
      {selectedDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedDraft(null)}>
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl w-full max-w-lg space-y-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold">Outreach Draft</h3>
            <textarea 
              className="w-full h-64 bg-gray-800 border border-gray-700 rounded-xl p-4 text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              defaultValue={selectedDraft}
            />
            <div className="flex justify-end gap-4 mt-4">
              <button 
                onClick={() => setSelectedDraft(null)}
                className="px-6 py-2 rounded-lg text-gray-400 hover:text-white transition"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(selectedDraft);
                  setSelectedDraft(null);
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition font-medium"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
