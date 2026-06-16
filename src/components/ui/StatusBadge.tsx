interface StatusBadgeProps {
  status: "success" | "error" | "warning" | "neutral" | "info";
  label: string;
  dot?: boolean;
}

const statusColorMap = {
  success: { 
    bg: "bg-emerald-50", 
    text: "text-emerald-600", 
    dot: "bg-emerald-500",
    border: "border-emerald-200"
  },
  error: { 
    bg: "bg-rose-50", 
    text: "text-rose-600", 
    dot: "bg-rose-500",
    border: "border-rose-200"
  },
  warning: { 
    bg: "bg-amber-50", 
    text: "text-amber-600", 
    dot: "bg-amber-500",
    border: "border-amber-200"
  },
  neutral: { 
    bg: "bg-slate-100", 
    text: "text-slate-500", 
    dot: "bg-slate-400",
    border: "border-slate-200"
  },
  info: { 
    bg: "bg-cyan-50", 
    text: "text-cyan-600", 
    dot: "bg-cyan-500",
    border: "border-cyan-200"
  },
};

export default function StatusBadge({ status, label, dot = true }: StatusBadgeProps) {
  const c = statusColorMap[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.5px] border ${c.bg} ${c.text} ${c.border}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`}
        />
      )}
      {label}
    </span>
  );
}
