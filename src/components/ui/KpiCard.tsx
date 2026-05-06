'use client'

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  suffix?: string;
  trend?: number;
  trendLabel?: string;
  subLabel?: string;
  description?: string;
  icon?: ReactNode;
  accent?: "cyan" | "emerald" | "rose" | "amber" | "default" | "red" | "orange" | "green";
  loading?: boolean;
  pulse?: boolean;
}

export default function KpiCard({
  label,
  value,
  unit,
  suffix,
  trend,
  trendLabel,
  subLabel,
  description,
  icon,
  accent = "default",
  loading = false,
  pulse = false,
}: KpiCardProps) {
  if (loading) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="animate-pulse space-y-4">
          <div className="h-3 w-24 bg-slate-800 rounded" />
          <div className="h-10 w-32 bg-slate-800 rounded" />
          <div className="h-3 w-20 bg-slate-800 rounded" />
        </div>
      </div>
    );
  }

  // Map colors for compatibility
  const colorMap: Record<string, string> = {
    default: "from-slate-500 to-slate-700 shadow-slate-500/20",
    cyan: "from-cyan-500 to-blue-600 shadow-cyan-500/20",
    emerald: "from-emerald-500 to-green-600 shadow-emerald-500/20",
    green: "from-emerald-500 to-green-600 shadow-emerald-500/20",
    rose: "from-rose-500 to-red-600 shadow-rose-500/20",
    red: "from-rose-500 to-red-600 shadow-rose-500/20",
    amber: "from-amber-500 to-orange-600 shadow-amber-500/20",
    orange: "from-amber-500 to-orange-600 shadow-amber-500/20",
  };

  const accentClass = colorMap[accent] || colorMap.default;

  const TrendIcon =
    trend === undefined ? null : trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;

  const trendColor =
    trend === undefined ? "" : trend > 0 ? "text-emerald-400" : trend < 0 ? "text-rose-400" : "text-slate-400";

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-black/50"
    >
      {/* Top Accent Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accentClass}`} />
      
      {/* Glow Effect */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700" />

      {/* Pulse Indicator */}
      {pulse && (
        <div className="absolute top-4 right-4 flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-gradient-to-r ${accentClass}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r ${accentClass} shadow-[0_0_8px_rgba(34,211,238,0.5)]`}></span>
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[2px] font-mono mb-1">
              {label}
            </p>
            {(subLabel || description) && (
              <p className="text-slate-600 text-[10px] font-medium leading-none">
                {subLabel || description}
              </p>
            )}
          </div>
          {icon && (
            <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 group-hover:text-cyan-400 transition-colors shadow-inner">
              {icon}
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black text-white tracking-tight font-mono">
            {value}
          </span>
          {(unit || suffix) && (
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{unit || suffix}</span>
          )}
        </div>

        {(trend !== undefined || trendLabel) && (
          <div className="flex items-center gap-2 mt-4">
            {trend !== undefined && (
              <div className={`flex items-center gap-1 text-[11px] font-bold ${trendColor} bg-slate-800/50 px-2 py-0.5 rounded-md border border-slate-700/50`}>
                {TrendIcon && <TrendIcon size={12} strokeWidth={3} />}
                <span>{Math.abs(trend)}%</span>
              </div>
            )}
            {trendLabel && (
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                {trendLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
