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
  accent?: "cyan" | "emerald" | "rose" | "amber" | "default" | "red" | "orange" | "green" | "blue" | "violet";
  loading?: boolean;
  pulse?: boolean;
  size?: "sm" | "md";
}

const colorMap: Record<string, string> = {
  default: "from-slate-400 to-slate-500",
  cyan: "from-secondary to-primary",
  emerald: "from-emerald-400 to-emerald-600",
  green: "from-emerald-400 to-emerald-600",
  rose: "from-rose-400 to-rose-600",
  red: "from-rose-400 to-rose-600",
  amber: "from-amber-400 to-amber-600",
  orange: "from-amber-400 to-amber-600",
  blue: "from-blue-400 to-blue-600",
  violet: "from-violet-400 to-violet-600",
};

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
  size = "md",
}: KpiCardProps) {
  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden shadow-sm">
        <div className="animate-pulse space-y-3">
          <div className="h-3 w-20 bg-slate-200 rounded" />
          <div className="h-8 w-28 bg-slate-200 rounded" />
          <div className="h-3 w-16 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  const accentClass = colorMap[accent] || colorMap.default;

  const TrendIcon =
    trend === undefined ? null : trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;

  const trendColor =
    trend === undefined ? "" : trend > 0 ? "text-emerald-500" : trend < 0 ? "text-rose-500" : "text-slate-400";

  const valueSize = size === "sm" ? "text-2xl" : "text-3xl";

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="group bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden transition-all duration-200 shadow-sm hover:shadow-lg"
    >
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${accentClass}`} />

      <div className="absolute -top-10 -right-10 w-24 h-24 bg-secondary/5 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700" />

      {pulse && (
        <div className="absolute top-4 right-4 flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-gradient-to-r ${accentClass}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r ${accentClass}`} />
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0">
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[1.5px] font-mono mb-0.5 truncate">
              {label}
            </p>
            {(subLabel || description) && (
              <p className="text-slate-400 text-[9px] font-medium truncate">
                {subLabel || description}
              </p>
            )}
          </div>
          {icon && (
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-colors flex-shrink-0 ml-2">
              {icon}
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className={`${valueSize} font-bold text-primary tracking-tight font-mono leading-none`}>
            {value}
          </span>
          {(unit || suffix) && (
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{unit || suffix}</span>
          )}
        </div>

        {(trend !== undefined || trendLabel) && (
          <div className="flex items-center gap-2 mt-3">
            {trend !== undefined && (
              <div className={`flex items-center gap-1 text-[10px] font-bold ${trendColor} bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100`}>
                {TrendIcon && <TrendIcon size={11} strokeWidth={3} />}
                <span>{Math.abs(trend)}%</span>
              </div>
            )}
            {trendLabel && (
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">
                {trendLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
