import type { Metadata } from "next";
import TopBar from "@/components/layout/TopBar";
import { ClipboardList, BookOpen, Shield, FlaskConical, Trash2, HelpCircle, ArrowRight, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Logistics Procedures",
  description: "Operational protocols, safety guidelines, and waste management procedures.",
};

const procedures = [
  {
    category: "Safety & Compliance",
    icon: <Shield size={18} className="text-[#fb7185]" />,
    items: [
      { id: "P-01", title: "Emergency Biohazard Spillage Protocol", update: "Aug 12, 2023", priority: "critical" },
      { id: "P-02", title: "Chemical Exposure First Aid", update: "Jul 05, 2023", priority: "high" },
      { id: "P-03", title: "PPE Selection Guide for Waste Disposal", update: "Oct 22, 2023", priority: "medium" },
    ]
  },
  {
    category: "Operational Workflows",
    icon: <ClipboardList size={18} className="text-[#1A2B4B]" />,
    items: [
      { id: "W-01", title: "Standard Collection Route B-12", update: "Oct 29, 2023", priority: "standard" },
      { id: "W-02", title: "Onboarding Radiology Waste Stream", update: "Sep 15, 2023", priority: "standard" },
      { id: "W-03", title: "Compactor Unit 3 Maintenance Cycle", update: "Jun 12, 2023", priority: "medium" },
    ]
  },
  {
    category: "Waste Segregation",
    icon: <FlaskConical size={18} className="text-[#34d399]" />,
    items: [
      { id: "S-01", title: "Radioactive Waste Identifiers", update: "Nov 01, 2023", priority: "critical" },
      { id: "S-02", title: "Organic vs. Medical Standardized Sorting", update: "Oct 10, 2023", priority: "standard" },
      { id: "S-03", title: "Packaging Guide for Sharp Objects", update: "Aug 20, 2023", priority: "high" },
    ]
  }
];

export default function ProceduresPage() {
  return (
    <div className="min-h-full">
      <TopBar 
        title="Logistics Procedures" 
        subtitle="Operational standard operating procedures (SOPs) and safety protocols" 
        showExport={false}
      />

      <div className="px-8 py-6 space-y-8">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {procedures.map((group) => (
             <section key={group.category} className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                   <div className="w-8 h-8 rounded bg-white flex items-center justify-center shadow-sm">
                      {group.icon}
                   </div>
                   <h2 className="text-sm font-bold text-[#f8fafc] uppercase tracking-wider" style={{ fontFamily: "Manrope, sans-serif" }}>
                      {group.category}
                   </h2>
                </div>
                
                <div className="space-y-2">
                   {group.items.map((item) => (
                     <div key={item.id} className="card p-4 hover:bg-[#0f172a] transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                           <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest">{item.id}</span>
                           <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              item.priority === 'critical' ? 'bg-[rgba(251, 113, 133, 0.15)] text-[#fb7185]' :
                              item.priority === 'high' ? 'bg-[#FFF3E0] text-[#E65100]' :
                              'bg-[#1e293b] text-[#94a3b8]'
                           }`}>
                              {item.priority}
                           </span>
                        </div>
                        <h3 className="text-sm font-semibold text-[#f8fafc] mb-1 leading-tight">{item.title}</h3>
                        <p className="text-[10px] text-[#64748b]">Last Update: {item.update}</p>
                        <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-[#1A2B4B] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                           Open Protocol <ArrowRight size={12} />
                        </div>
                     </div>
                   ))}
                </div>
             </section>
           ))}
        </div>

        {/* Global Documentation */}
        <section className="card">
           <div className="flex items-center justify-between mb-6">
              <div>
                 <h2 className="text-base font-semibold text-[#f8fafc]" style={{ fontFamily: "Manrope, sans-serif" }}>
                    Global Documentation Hub
                 </h2>
                 <p className="text-xs text-[#94a3b8] mt-0.5">Quick access to regulatory and hospital-wide mandates</p>
              </div>
              <button className="btn-ghost text-xs">Access Intranet</button>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-2">
              {[
                "Healthcare Waste Management Act 2022",
                "NIOSH Guidelines for Sharp Object Handling",
                "ISO 14001:2015 Environmental Compliance",
                "WHO Hospital Waste Technical Series",
                "National Biohazard Transport Regulation",
                "Occupational Safety Records (Internal)"
              ].map((doc, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-[rgba(255,255,255,0.1)]/10 hover:bg-[#0f172a] px-2 -mx-2 rounded transition-colors group cursor-pointer">
                   <div className="flex items-center gap-3">
                      <BookOpen size={15} className="text-[#64748b]" />
                      <span className="text-sm text-[#94a3b8]">{doc}</span>
                   </div>
                   <ExternalLink size={14} className="text-[rgba(255,255,255,0.1)] group-hover:text-[#1A2B4B] transition-colors" />
                </div>
              ))}
           </div>
        </section>

        {/* Support Block */}
        <div className="flex items-center justify-center py-6">
           <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-[#1A2B4B] flex items-center justify-center text-white">
                 <HelpCircle size={24} />
              </div>
              <div>
                 <p className="text-sm font-bold text-[#f8fafc]">Need procedure clarification?</p>
                 <p className="text-xs text-[#94a3b8] mt-1">Contact the Compliance Officer at extension 4402</p>
              </div>
              <button className="btn-primary mt-2">Open Internal Ticket</button>
           </div>
        </div>
      </div>
    </div>
  );
}
