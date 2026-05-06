import type { Metadata } from "next";
import TopBar from "@/components/layout/TopBar";
import { recommendations } from "@/lib/mockData";
import { Lightbulb, TrendingUp, Zap, MessageSquare, Plus, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Continuous Improvement",
  description: "Operational suggestions, route optimizations, and strategic recommendations.",
};

export default function ImprovementPage() {
  return (
    <div className="min-h-full">
      <TopBar 
        title="Continuous Improvement" 
        subtitle="AI-driven suggestions and staff-submitted optimizations" 
      />

      <div className="px-8 py-6 space-y-6">
        {/* Header Header */}
        <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
           <div>
              <h2 className="text-xl font-bold text-[#f8fafc]" style={{ fontFamily: "Manrope, sans-serif" }}>
                 Operational Backlog
              </h2>
              <p className="text-sm text-[#94a3b8] mt-1">
                 Total of 14 improvements identified this month. 3 high priority.
              </p>
           </div>
           <button className="btn-primary">
              <Plus size={16} className="mr-2" />
              New Suggestion
           </button>
        </div>

        {/* Priority Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Section 1: AI Recommendations */}
           <section className="lg:col-span-2 space-y-4">
              <p className="section-label">Strategic Recommendations (AI-Driven)</p>
              <div className="space-y-4">
                 {recommendations.map((rec) => (
                   <div key={rec.id} className="card group hover:bg-[#0f172a] transition-all cursor-pointer">
                      <div className="flex items-start gap-4">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${rec.impact === 'high' ? 'bg-[rgba(251, 113, 133, 0.15)]' : 'bg-[rgba(52, 211, 153, 0.15)]'}`}>
                            {rec.impact === 'high' ? <Zap size={18} className="text-[#fb7185]" /> : <TrendingUp size={18} className="text-[#34d399]" />}
                         </div>
                         <div className="flex-1">
                            <div className="flex items-center justify-between">
                               <h3 className="text-base font-semibold text-[#f8fafc]" style={{ fontFamily: "Manrope, sans-serif" }}>
                                  {rec.title}
                               </h3>
                               <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${rec.impact === 'high' ? 'bg-[#fb7185] text-white' : 'bg-[#34d399] text-white'}`}>
                                  {rec.impact} Impact
                               </span>
                            </div>
                            <p className="text-sm text-[#94a3b8] mt-2 leading-relaxed">
                               {rec.description}
                            </p>
                            <div className="mt-4 flex items-center justify-between">
                               <div className="flex items-center gap-4 text-xs text-[#64748b]">
                                  <span className="flex items-center gap-1"><MessageSquare size={13} /> 4 Comments</span>
                                  <span>ID: RE-842</span>
                               </div>
                               <button className="btn-ghost text-xs py-1.5 px-3">
                                  {rec.action} <ArrowRight size={14} className="ml-1" />
                               </button>
                            </div>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </section>

           {/* Section 2: Staff Suggestions */}
           <section className="space-y-4">
              <p className="section-label">Latest Staff Submissions</p>
              <div className="space-y-3">
                 {[
                   { user: "Sarah J.", title: "Scanner Battery Swap", desc: "Suggesting rotating chargers for scanners on Shift A to avoid mid-collection dead zones.", votes: 12 },
                   { user: "Kevin M.", title: "Bay 4 Labeling", desc: "Pathology labels are often smudged. Requesting thermal printer upgrade for Bay 4.", votes: 8 },
                   { user: "Ahmed T.", title: "Recycling Incentives", desc: "Could we implement a 'Green Team' recognition for departments with zero misclassifications?", votes: 24 }
                 ].map((s, i) => (
                   <div key={i} className="card p-4 hover:bg-[#0f172a] transition-all cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-semibold text-[#1A2B4B] uppercase tracking-wider">{s.user}</span>
                        <div className="flex items-center gap-1 text-[#34d399] text-xs font-bold">
                           <TrendingUp size={12} /> {s.votes}
                        </div>
                      </div>
                      <h4 className="text-sm font-semibold text-[#f8fafc] mb-1">{s.title}</h4>
                      <p className="text-xs text-[#94a3b8] line-clamp-2 leading-relaxed">{s.desc}</p>
                   </div>
                 ))}
              </div>
              <button className="w-full btn-ghost text-[0.6875rem] uppercase tracking-widest font-bold mt-2">View All Staff Proposals</button>
           </section>
        </div>
      </div>
    </div>
  );
}
