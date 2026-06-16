interface ABCBadgeProps {
  cls: 'A' | 'B' | 'C'
}

const colors = {
  A: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  B: 'bg-amber-50 text-amber-700 border-amber-200',
  C: 'bg-slate-100 text-slate-500 border-slate-200',
}

export default function ABCBadge({ cls }: ABCBadgeProps) {
  return (
    <span className={`text-[9px] font-bold border rounded px-1.5 py-0.5 leading-none ${colors[cls]}`}>
      {cls}
    </span>
  )
}
