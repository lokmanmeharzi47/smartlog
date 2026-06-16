import { Sparkles } from 'lucide-react'

export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-2">
      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
        <Sparkles className="w-5 h-5 text-slate-600" />
      </div>
      <p className="text-slate-600 text-xs text-center font-medium">{message}</p>
    </div>
  )
}
