export default function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-slate-100" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-slate-100 rounded w-40" />
          <div className="h-2.5 bg-slate-100 rounded w-24" />
        </div>
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="mb-3 space-y-1.5">
          <div className="h-3 bg-slate-100 rounded w-full" />
          <div className="h-2 bg-slate-100 rounded w-3/4" />
        </div>
      ))}
    </div>
  )
}
