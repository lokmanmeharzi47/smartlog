import type { Metadata } from "next";
import TopBar from "@/components/layout/TopBar";
import KpiCard from "@/components/ui/KpiCard";
import BarChart from "@/components/charts/BarChart";
import StatusBadge from "@/components/ui/StatusBadge";
import { performanceData } from "@/lib/mockData";
import { TrendingUp, Award, AlertOctagon, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Service Performance",
  description: "Department-level service performance, collection times and route analytics.",
};

const kpis = [
  { label: "Overall Score", value: "91.4", unit: "%", trend: 1.8, icon: <Award size={18} />, accent: "emerald" as const },
  { label: "On-Time Collection", value: "94.2", unit: "%", trend: -0.5, icon: <Clock size={18} /> },
  { label: "Route Efficiency", value: "87.6", unit: "%", subLabel: "3 routes below target", icon: <TrendingUp size={18} /> },
  { label: "SLA Breaches", value: "7", unit: "", trend: -30, trendLabel: "vs last month", icon: <AlertOctagon size={18} />, accent: "emerald" as const },
];

export default function PerformancePage() {
  return (
    <div className="min-h-full">
      <TopBar title="Service Performance" subtitle="Route analytics and departmental collection scores" showFilter />

      <div className="px-8 py-6 space-y-6">
        {/* KPIs */}
        <section>
          <p className="section-label mb-3">Performance Overview</p>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {kpis.map((kpi) => (
              <KpiCard key={kpi.label} {...kpi} />
            ))}
          </div>
        </section>

        {/* Dept bar chart */}
        <section className="card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-[#f8fafc]" style={{ fontFamily: "Manrope, sans-serif" }}>
                Department Scores vs. Target
              </h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">Target: 95% collection compliance</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#94a3b8]">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#1A2B4B] inline-block" /> Score
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#B6C6EF] inline-block" /> Target
              </span>
            </div>
          </div>
          <BarChart
            data={performanceData.map((d) => ({ label: d.label, value: d.value, secondary: d.target }))}
            showSecondary
            height={250}
          />
        </section>

        {/* Department table */}
        <section className="card">
          <h2 className="text-base font-semibold text-[#f8fafc] mb-4" style={{ fontFamily: "Manrope, sans-serif" }}>
            Department Breakdown
          </h2>
          {/* Header */}
          <div className="grid grid-cols-5 gap-4 pb-2 mb-1 border-b border-[rgba(255,255,255,0.1)]/20">
            {["Department", "Score", "Avg Time", "Errors", "Status"].map((h) => (
              <p key={h} className="section-label">{h}</p>
            ))}
          </div>
          {/* Rows */}
          {performanceData.map((dept) => (
            <div
              key={dept.label}
              className="grid grid-cols-5 gap-4 py-3 hover:bg-[#0f172a] hover:px-2 rounded transition-all"
            >
              <p className="text-sm font-medium text-[#f8fafc]" style={{ fontFamily: "Manrope, sans-serif" }}>
                {dept.label}
              </p>
              <p className="text-sm font-semibold text-[#f8fafc]" style={{ fontFamily: "Manrope, sans-serif" }}>
                {dept.value}%
              </p>
              <p className="text-sm text-[#94a3b8]">
                {Math.round(10 + Math.random() * 20)} min
              </p>
              <p className="text-sm text-[#94a3b8]">
                {Math.round(Math.random() * 10)}
              </p>
              <StatusBadge
                status={dept.value >= 95 ? "success" : dept.value >= 85 ? "warning" : "error"}
                label={dept.value >= 95 ? "On Target" : dept.value >= 85 ? "Below Target" : "Critical"}
              />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
