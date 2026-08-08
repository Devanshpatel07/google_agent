"use client";

import { useEffect, useState } from "react";
import { Globe, Link2, TrendingUp, Zap } from "lucide-react";

interface StatItem {
  id: string;
  label: string;
  displayValue: string;
  targetNum: number;
  suffix: string;
  prefix?: string;
  icon: typeof Globe;
}

const statsData: StatItem[] = [
  {
    id: "domains",
    label: "DOMAINS AUDITED",
    displayValue: "15,400+",
    targetNum: 15400,
    suffix: "+",
    icon: Globe,
  },
  {
    id: "backlinks",
    label: "BACKLINKS INDEXED",
    displayValue: "85,000+",
    targetNum: 85000,
    suffix: "+",
    icon: Link2,
  },
  {
    id: "reply",
    label: "AVERAGE REPLY RATE",
    displayValue: "34%",
    targetNum: 34,
    suffix: "%",
    icon: TrendingUp,
  },
  {
    id: "time",
    label: "MEDIAN AUDIT TIME",
    displayValue: "< 28s",
    targetNum: 28,
    suffix: "s",
    prefix: "< ",
    icon: Zap,
  },
];

export default function StatCounters() {
  const [mounted, setMounted] = useState(false);
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    domains: 15400,
    backlinks: 85000,
    reply: 34,
    time: 28,
  });

  useEffect(() => {
    setMounted(true);
    // Smooth count-up animation after mount
    const duration = 1200;
    const steps = 30;
    const stepTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounts({
        domains: Math.floor(15400 * progress),
        backlinks: Math.floor(85000 * progress),
        reply: Math.floor(34 * progress),
        time: Math.floor(28 * progress),
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts({
          domains: 15400,
          backlinks: 85000,
          reply: 34,
          time: 28,
        });
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl pt-8">
      {statsData.map((stat) => {
        const Icon = stat.icon;
        const valueStr = !mounted
          ? stat.displayValue
          : `${stat.prefix || ""}${counts[stat.id].toLocaleString()}${stat.suffix}`;

        return (
          <div
            key={stat.id}
            className="p-5 bg-slate-900/80 border border-purple-900/30 rounded-2xl flex flex-col items-center justify-center text-center space-y-1.5 hover:border-purple-600/40 transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-800/40 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Icon className="w-4 h-4" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {valueStr}
            </div>
            <div className="text-[10px] md:text-xs font-semibold text-purple-300/70 tracking-wider uppercase">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
