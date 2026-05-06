import type { Metadata } from "next";
import TopBar from "@/components/layout/TopBar";
import KpiCard from "@/components/ui/KpiCard";
import ReportCard from "@/components/ui/ReportCard";
import DonutChart from "@/components/charts/DonutChart";
import { reportKPIs, recentReports, recommendations, errorsByType } from "@/lib/mockData";
import { ArrowRight, Beaker, Route, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Management Reports",
  description: "Monthly performance reports, strategic recommendations, and generated report archive.",
};

const recIcons = [Route, Users, Beaker];
const impactColors = { high: "#fb7185", medium: "#E65100", low: "#34d399" };

export default function ReportsPage() {
  return (
    <div className="min-h-full">
      <TopBar
        title="Reports &amp; Insights"
        subtitle="Automated reporting — Clinical Logistics Management"
        period="October 01 – 31, 2023"
      />

      <div className="px-8 py-6 space-y-6">
        {/* Monthly preview KPIs */}
        <section>
          <p className="section-label mb-3">Monthly Performance Preview</p>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {reportKPIs.map((kpi) => (
              <KpiCard
                key={kpi.label}
                label={kpi.label}
                value={kpi.value}
                unit={kpi.unit}
                trend={kpi.trend}
                subLabel={kpi.subLabel}
                accent="cyan"
              />
            ))}
          </div>
        </section>

        {/* Content row */}
        <div className="grid grid-cols-12 gap-4">
          {/* Errors donut */}
          <section className="col-span-12 xl:col-span-5 card">
            <h2 className="text-base font-semibold text-[#f8fafc] mb-4" style={{ fontFamily: "Manrope, sans-serif" }}>
              Errors by Type
            </h2>
            <DonutChart data={errorsByType} height={240} />
          </section>

          {/* Strategic Recommendations */}
          <section className="col-span-12 xl:col-span-7 card">
            <h2 className="text-base font-semibold text-[#f8fafc] mb-4" style={{ fontFamily: "Manrope, sans-serif" }}>
              Strategic Recommendations
            </h2>
            <div className="space-y-4">
              {recommendations.map((rec, i) => {
                const Icon = recIcons[i] || Route;
                return (
                  <div
                    key={rec.id}
                    className="p-4 rounded bg-[#0f172a] hover:bg-[#1e293b] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `${impactColors[rec.impact]}18` }}
                      >
                        <Icon size={15} style={{ color: impactColors[rec.impact] }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-[#f8fafc]" style={{ fontFamily: "Manrope, sans-serif" }}>
                          {rec.title}
                        </h3>
                        <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">{rec.description}</p>
                        <button className="flex items-center gap-1 text-xs font-semibold text-[#1A2B4B] mt-3 group-hover:gap-2 transition-all">
                          {rec.action}
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Recent Reports */}
        <section className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-[#f8fafc]" style={{ fontFamily: "Manrope, sans-serif" }}>
              Recent Generated Reports
            </h2>
            <button className="btn-ghost text-xs py-1.5 px-3">View Archive</button>
          </div>
          <div className="divide-y divide-[rgba(255,255,255,0.1)]/10">
            {recentReports.map((r, i) => (
              <ReportCard key={i} {...r} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
