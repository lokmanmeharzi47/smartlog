import type { Metadata } from "next";
import TopBar from "@/components/layout/TopBar";
import ActivityFeedItem from "@/components/ui/ActivityFeedItem";
import KpiCard from "@/components/ui/KpiCard";
import { liveActivity } from "@/lib/mockData";
import { Search, Filter, ArrowUpDown, MapPin, Database, QrCode } from "lucide-react";

export const metadata: Metadata = {
  title: "Waste Traceability",
  description: "End-to-end collection logs and real-time waste tracking.",
};

export default function TrackingPage() {
  return (
    <div className="min-h-full">
      <TopBar 
        title="Waste Traceability" 
        subtitle="End-to-end collection logs and real-time tracking" 
        showFilter 
      />

      <div className="px-8 py-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <KpiCard label="Active Logs" value="142" subLabel="Currently in transit" icon={<MapPin size={18} />} accent="cyan" />
          <KpiCard label="Total Scanned Today" value="842" subLabel="+12% from avg" icon={<QrCode size={18} />} accent="amber" />
          <KpiCard label="Database Sync" value="100%" subLabel="All nodes online" icon={<Database size={18} />} accent="emerald" />
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" size={16} />
            <input 
              type="text" 
              placeholder="Search by Bag ID, Dept, or Collector..." 
              className="w-full pl-10 pr-4 py-2 bg-white border-none rounded focus:ring-2 focus:ring-[#1A2B4B]/20 text-sm"
            />
          </div>
          <button className="btn-ghost text-sm">
            <Filter size={15} className="mr-2" />
            Filter Status
          </button>
          <button className="btn-ghost text-sm">
            <ArrowUpDown size={15} className="mr-2" />
            Sort
          </button>
        </div>

        {/* Tracking Table/List */}
        <section className="card">
          <div className="grid grid-cols-12 gap-4 pb-3 mb-2 border-b border-[rgba(255,255,255,0.1)]/20">
            <p className="col-span-4 section-label">Identification & Item</p>
            <p className="col-span-3 section-label">Origin Location</p>
            <p className="col-span-3 section-label">Personnel</p>
            <p className="col-span-2 section-label text-right">Time</p>
          </div>
          <div className="divide-y divide-[rgba(255,255,255,0.1)]/10">
            {liveActivity.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 items-center group">
                <div className="col-span-4">
                   <ActivityFeedItem {...item} />
                </div>
                <div className="col-span-3">
                   <p className="text-sm text-[#f8fafc]">{item.location}</p>
                </div>
                <div className="col-span-3">
                   <p className="text-sm text-[#94a3b8]">{item.collectedBy || "System Scan"}</p>
                </div>
                <div className="col-span-2 text-right">
                   <span className="text-[0.6875rem] text-[#64748b] uppercase tracking-wide">{item.time}</span>
                </div>
              </div>
            ))}
            {/* Extended Mock rows for fill */}
             {[...Array(5)].map((_, i) => (
               <div key={i} className="grid grid-cols-12 gap-4 items-center group grayscale opacity-60">
                <div className="col-span-4">
                   <ActivityFeedItem id={`#BAG-293${50-i}`} type="Standard Waste" location="General Ward" time={`${i+1}h ago`} />
                </div>
                <div className="col-span-3">
                   <p className="text-sm text-[#f8fafc]">General Ward</p>
                </div>
                <div className="col-span-3">
                   <p className="text-sm text-[#94a3b8]">System</p>
                </div>
                <div className="col-span-2 text-right">
                   <span className="text-[0.6875rem] text-[#64748b] uppercase tracking-wide">{i + 1}h ago</span>
                </div>
              </div>
             ))}
          </div>
          
          <div className="mt-6 flex justify-center">
            <button className="btn-ghost text-[0.6875rem] uppercase tracking-widest font-bold">Load More Records</button>
          </div>
        </section>
      </div>
    </div>
  );
}
