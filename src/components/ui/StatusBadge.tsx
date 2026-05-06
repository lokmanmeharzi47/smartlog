interface StatusBadgeProps {
  status: "success" | "error" | "warning" | "neutral" | "info";
  label: string;
  dot?: boolean;
}

const statusColorMap = {
  success: { 
    bg: "bg-emerald-500/10", 
    text: "text-emerald-400", 
    dot: "bg-emerald-400",
    border: "border-emerald-500/20"
  },
  error: { 
    bg: "bg-rose-500/10", 
    text: "text-rose-400", 
    dot: "bg-rose-400",
    border: "border-rose-500/20"
  },
  warning: { 
    bg: "bg-amber-500/10", 
    text: "text-amber-400", 
    dot: "bg-amber-400",
    border: "border-amber-500/20"
  },
  neutral: { 
    bg: "bg-slate-500/10", 
    text: "text-slate-400", 
    dot: "bg-slate-400",
    border: "border-slate-500/20"
  },
  info: { 
    bg: "bg-cyan-500/10", 
    text: "text-cyan-400", 
    dot: "bg-cyan-400",
    border: "border-cyan-500/20"
  },
};

export default function StatusBadge({ status, label, dot = true }: StatusBadgeProps) {
  const c = statusColorMap[status];
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[1px] border ${c.bg} ${c.text} ${c.border} shadow-lg shadow-black/20`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot} shadow-[0_0_8px_currentColor]`}
        />
      )}
      {label}
    </span>
  );
}
