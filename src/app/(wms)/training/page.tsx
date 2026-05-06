import type { Metadata } from "next";
import TopBar from "@/components/layout/TopBar";
import KpiCard from "@/components/ui/KpiCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { trainingData } from "@/lib/mockData";
import { GraduationCap, Users, CheckCircle, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Training & Compliance",
  description: "Staff training records and waste management compliance tracking.",
};

export default function TrainingPage() {
  const avgCompliance = Math.round(trainingData.reduce((acc, curr) => acc + curr.rate, 0) / trainingData.length);

  return (
    <div className="min-h-full">
      <TopBar 
        title="Training & Compliance" 
        subtitle="Clinical staff waste management certifications and audit results" 
      />

      <div className="px-8 py-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard label="Overall Compliance" value={`${avgCompliance}%`} icon={<GraduationCap size={18} />} accent="emerald" />
          <KpiCard label="Total Certified" value="126" subLabel="Active personnel" icon={<Users size={18} />} accent="cyan" />
          <KpiCard label="Latest Audit" value="Pass" subLabel="October 28" icon={<CheckCircle size={18} />} accent="emerald" />
          <KpiCard label="Required Refresher" value="14" subLabel="Due in 30 days" icon={<AlertCircle size={18} />} accent="amber" />
        </div>

        {/* Training Table */}
        <section className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-[#f8fafc]" style={{ fontFamily: "Manrope, sans-serif" }}>
              Departmental Certification Status
            </h2>
            <button className="btn-primary text-xs">Schedule Training</button>
          </div>

          <div className="grid grid-cols-12 gap-4 pb-3 mb-2 border-b border-[rgba(255,255,255,0.1)]/20">
            <p className="col-span-5 section-label">Department</p>
            <p className="col-span-2 section-label">Total Staff</p>
            <p className="col-span-2 section-label">Certified</p>
            <p className="col-span-3 section-label">Compliance Rate</p>
          </div>

          <div className="divide-y divide-[rgba(255,255,255,0.1)]/10">
            {trainingData.map((dept) => (
              <div key={dept.department} className="grid grid-cols-12 gap-4 py-4 items-center hover:bg-[#0f172a] hover:px-2 rounded transition-all">
                <div className="col-span-5">
                  <p className="text-sm font-medium text-[#f8fafc]" style={{ fontFamily: "Manrope, sans-serif" }}>
                    {dept.department}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-[#94a3b8]">{dept.staff}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-[#94a3b8]">{dept.trained}</p>
                </div>
                <div className="col-span-3 flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <div className="h-1.5 w-full bg-[#1e293b] rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${dept.rate >= 95 ? "bg-[#34d399]" : dept.rate >= 85 ? "bg-[#E65100]" : "bg-[#fb7185]"}`} 
                        style={{ width: `${dept.rate}%` }}
                      ></div>
                    </div>
                  </div>
                  <StatusBadge 
                    status={dept.rate >= 95 ? "success" : dept.rate >= 85 ? "warning" : "error"} 
                    label={`${dept.rate}%`} 
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Resources Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
           <section className="card">
              <h2 className="text-sm font-semibold text-[#f8fafc] mb-4" style={{ fontFamily: "Manrope, sans-serif" }}>
                Pending Refresher Trainings
              </h2>
              <div className="space-y-3">
                 {[
                   { name: "John Doe", dept: "Radiology South", due: "2 days" },
                   { name: "Sarah Smith", dept: "Oncology West", due: "5 days" },
                   { name: "Mike Johnson", dept: "Maternity Ward", due: "1 week" }
                 ].map((staff, i) => (
                   <div key={i} className="flex items-center justify-between p-3 bg-[#0f172a] rounded">
                      <div>
                        <p className="text-sm font-medium text-[#f8fafc]">{staff.name}</p>
                        <p className="text-xs text-[#94a3b8]">{staff.dept}</p>
                      </div>
                      <span className="text-xs font-semibold text-[#fb7185]">Due in {staff.due}</span>
                   </div>
                 ))}
              </div>
           </section>

           <section className="card">
              <h2 className="text-sm font-semibold text-[#f8fafc] mb-4" style={{ fontFamily: "Manrope, sans-serif" }}>
                Certification Materials
              </h2>
              <div className="space-y-2">
                 {[
                   "Biohazard Level 2 Protocols",
                   "Chemical Waste Segregation Guide",
                   "Traceability System User Manual",
                   "Hospital Waste Policy 2024"
                 ].map((doc, i) => (
                   <div key={i} className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.1)]/10 last:border-0 hover:bg-[#0f172a] px-2 -mx-2 rounded transition-colors cursor-pointer">
                      <span className="text-sm text-[#94a3b8]">{doc}</span>
                      <button className="text-[0.6875rem] font-bold text-[#1A2B4B] uppercase tracking-wider">Download</button>
                   </div>
                 ))}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}
