import { AlertTriangle, AlertCircle, Info } from "lucide-react";

interface AlertCardProps {
  title: string;
  description: string;
  severity: "critical" | "warning" | "info";
  location?: string;
  time?: string;
}

export default function AlertCard({
  title,
  description,
  severity,
  location,
  time,
}: AlertCardProps) {
  const config = {
    critical: {
      iconBg: "rgba(186, 26, 26, 0.08)",
      icon: AlertTriangle,
      iconColor: "#BA1A1A",
      borderColor: "#BA1A1A",
      badgeBg: "#FFDAD6",
      badgeText: "#93000A",
      label: "Critical",
    },
    warning: {
      iconBg: "rgba(255, 152, 0, 0.08)",
      icon: AlertCircle,
      iconColor: "#E65100",
      borderColor: "#FF9800",
      badgeBg: "#FFF3E0",
      badgeText: "#E65100",
      label: "Warning",
    },
    info: {
      iconBg: "rgba(21, 101, 192, 0.08)",
      icon: Info,
      iconColor: "#1565C0",
      borderColor: "#42A5F5",
      badgeBg: "#E3F2FD",
      badgeText: "#0D47A1",
      label: "Notice",
    },
  };

  const c = config[severity];
  const Icon = c.icon;

  return (
    <div
      className="flex gap-4 p-5 rounded-xl bg-white border border-black/[0.03] group hover:border-black/10 hover:shadow-ambient transition-all duration-300 transform hover:-translate-x-1"
      style={{ borderLeft: `4px solid ${c.borderColor}` }}
    >
      {/* Icon Area */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm"
        style={{ background: c.iconBg }}
      >
        <Icon size={18} style={{ color: c.iconColor }} strokeWidth={2.5} />
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          <span
            className="text-[15px] font-bold text-on-surface tracking-tight"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            {title}
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-md"
            style={{ background: c.badgeBg, color: c.badgeText }}
          >
            {c.label}
          </span>
        </div>
        <p className="text-[13px] text-on-surface-variant leading-relaxed font-medium opacity-90">{description}</p>
        
        {(location || time) && (
          <div className="flex items-center gap-4 mt-3">
             {location && (
               <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-outline">
                  <span className="w-1 h-1 rounded-full bg-outline/30" />
                  {location}
               </div>
             )}
             {time && (
               <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-outline">
                  <span className="w-1 h-1 rounded-full bg-outline/30" />
                  {time}
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}

