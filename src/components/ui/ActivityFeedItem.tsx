import StatusBadge from "./StatusBadge";

interface ActivityFeedItemProps {
  id: string;
  type: string;
  location: string;
  collectedBy?: string;
  time: string;
  flagged?: boolean;
  flagLabel?: string;
}

export default function ActivityFeedItem({
  id,
  type,
  location,
  collectedBy,
  time,
  flagged,
  flagLabel,
}: ActivityFeedItemProps) {
  const typeColors: Record<string, { bg: string; text: string }> = {
    "Biohazard - Level 2": { bg: "#FFDAD6", text: "#93000A" },
    "Recyclable Glass": { bg: "#E8F5E9", text: "#1B5E20" },
    "Chemical Waste": { bg: "#FFF3E0", text: "#E65100" },
    "Organic Waste": { bg: "#F3E5F5", text: "#6A1B9A" },
    "Sharps": { bg: "#E3F2FD", text: "#0D47A1" },
  };

  const colors = typeColors[type] || { bg: "#EDEEEF", text: "#44474E" };

  return (
    <div
      className="flex items-start gap-3 py-3 cursor-pointer rounded hover:bg-[#F3F4F5] hover:px-2 transition-all"
    >
      {/* Color dot */}
      <div className="pt-0.5 flex-shrink-0">
        <span
          className="w-2.5 h-2.5 rounded-full block mt-1"
          style={{ background: colors.text }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-[#44474E] font-mono">{id}</span>
          <span
            className="text-[0.6875rem] font-medium px-2 py-0.5 rounded-full"
            style={{ background: colors.bg, color: colors.text }}
          >
            {type}
          </span>
          {flagged && (
            <StatusBadge status="warning" label={flagLabel || "Flagged"} />
          )}
        </div>
        <p className="text-xs text-[#44474E] mt-1">{location}</p>
        {collectedBy && (
          <p className="text-[0.6875rem] text-[#75777F] mt-0.5">
            Collected by: {collectedBy}
          </p>
        )}
      </div>

      {/* Time */}
      <span className="text-[0.6875rem] text-[#75777F] uppercase tracking-wide flex-shrink-0 mt-0.5">
        {time}
      </span>
    </div>
  );
}
