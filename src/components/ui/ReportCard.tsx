import { FileText, Download, Eye } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface ReportCardProps {
  title: string;
  period: string;
  type: string;
  status: "ready" | "processing" | "draft";
  size?: string;
  generatedAt?: string;
}

export default function ReportCard({
  title,
  period,
  type,
  status,
  size,
  generatedAt,
}: ReportCardProps) {
  const statusMap = {
    ready: "success" as const,
    processing: "warning" as const,
    draft: "neutral" as const,
  };

  return (
    <div className="data-row group cursor-pointer">
      {/* Icon */}
      <div
        className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(26, 43, 75, 0.08)" }}
      >
        <FileText size={16} className="text-[#1A2B4B]" />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#191C1D] truncate" style={{ fontFamily: "Manrope, sans-serif" }}>
          {title}
        </p>
        <p className="text-xs text-[#44474E] mt-0.5">
          {period} · {type}
          {generatedAt && ` · Generated ${generatedAt}`}
        </p>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3">
        {size && <span className="text-xs text-[#75777F]">{size}</span>}
        <StatusBadge status={statusMap[status]} label={status} />
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-[#EDEEEF] transition-colors text-[#44474E]"
            title="Preview"
          >
            <Eye size={14} />
          </button>
          <button
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-[#EDEEEF] transition-colors text-[#44474E]"
            title="Download"
          >
            <Download size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
