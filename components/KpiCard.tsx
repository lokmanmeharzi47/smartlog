interface KpiCardProps {
  label: string
  value: string | number
  delta?: string
  deltaPositive?: boolean
  icon: React.ReactNode
  accentColor: 'cyan' | 'red' | 'green' | 'orange'
  loading?: boolean
}

const accentMap = {
  cyan:   { bar: 'from-cyan-500 to-blue-600',   text: 'text-cyan-400',   bg: 'bg-cyan-500/10'  },
  red:    { bar: 'from-red-500 to-rose-600',     text: 'text-red-400',    bg: 'bg-red-500/10'   },
  green:  { bar: 'from-emerald-500 to-green-600',text: 'text-emerald-400',bg: 'bg-emerald-500/10'},
  orange: { bar: 'from-orange-500 to-amber-500', text: 'text-orange-400', bg: 'bg-orange-500/10' },
}

export default function KpiCard({ label, value, delta, deltaPositive, icon, accentColor, loading }: KpiCardProps) {
  const acc = accentMap[accentColor]

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 overflow-hidden relative">
        <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${acc.bar}`} />
        <div className="skeleton h-3 w-24 mb-4" />
        <div className="skeleton h-8 w-16 mb-3" />
        <div className="skeleton h-2 w-20" />
      </div>
    )
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 overflow-hidden relative hover:-translate-y-0.5 hover:border-slate-700 hover:shadow-xl hover:shadow-black/30 transition-all duration-300 group">
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${acc.bar}`} />

      {/* Background glow */}
      <div className={`absolute -top-8 -right-8 w-28 h-28 ${acc.bg} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      {/* Icon */}
      <div className={`absolute right-4 top-4 ${acc.text} opacity-15 text-3xl`}>{icon}</div>

      <div className="text-slate-500 text-[10px] font-bold uppercase tracking-[1.5px] mb-3">{label}</div>
      <div className={`${acc.text} text-3xl font-extrabold font-mono leading-none mb-2`}>{value}</div>
      {delta && (
        <div className={`text-xs font-mono ${deltaPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {delta}
        </div>
      )}
    </div>
  )
}
