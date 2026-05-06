'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Clock3, CheckCircle2, Sparkles } from 'lucide-react'
import type { Prediction } from '../types'
import { getRecommendation } from '../utils/forecast'

interface Props {
  predictions: Prediction[]
  loading: boolean
}

export default function RecommendationCards({ predictions, loading }: Props) {
  const urgent = predictions.filter(p => p.status === 'URGENT').slice(0, 3)
  const thisWeek = predictions.filter(p => p.status === 'THIS_WEEK').slice(0, 3)
  const ok = predictions.filter(p => p.status === 'OK').slice(0, 3)

  const sections = [
    {
      title: 'Ruptures imminentes',
      items: urgent,
      color: 'red' as const,
      icon: AlertTriangle,
      border: 'border-red-500/20',
      bg: 'bg-red-500/8',
      headerBg: 'bg-red-500/15',
      text: 'text-red-400',
      dot: 'bg-red-400',
    },
    {
      title: 'Cette semaine',
      items: thisWeek,
      color: 'orange' as const,
      icon: Clock3,
      border: 'border-orange-500/20',
      bg: 'bg-orange-500/8',
      headerBg: 'bg-orange-500/15',
      text: 'text-orange-300',
      dot: 'bg-orange-400',
    },
    {
      title: 'Stock suffisant',
      items: ok,
      color: 'emerald' as const,
      icon: CheckCircle2,
      border: 'border-emerald-500/20',
      bg: 'bg-emerald-500/8',
      headerBg: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      dot: 'bg-emerald-400',
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-[#081225] border border-white/10 rounded-2xl h-40 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-cyan-400" />
        <h2 className="text-white font-bold text-sm">Recommandations IA</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sections.map((sec) => {
          const Icon = sec.icon
          return (
            <motion.div
              key={sec.title}
              whileHover={{ scale: 1.01, y: -2 }}
              className={`bg-[#081225] border ${sec.border} rounded-2xl overflow-hidden`}
            >
              <div className={`flex items-center gap-2 px-4 py-3 ${sec.headerBg}`}>
                <Icon className={`w-4 h-4 ${sec.text}`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${sec.text}`}>{sec.title}</span>
                <span className={`ml-auto text-xs font-mono ${sec.text} opacity-70`}>
                  {sec.items.length > 3 ? `+${sec.items.length - 3}` : sec.items.length} articles
                </span>
              </div>
              <div className="p-4 space-y-2.5">
                {sec.items.length === 0 ? (
                  <p className="text-slate-600 text-xs text-center py-4">Aucun article</p>
                ) : (
                  sec.items.map((p) => (
                    <div key={p.productId} className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-xs font-medium leading-tight truncate max-w-[120px]">{p.productName}</p>
                        <p className={`text-[10px] font-mono ${sec.text} opacity-70`}>
                          {p.daysRemaining >= 999 ? '∞j' : `${p.daysRemaining}j restants`}
                        </p>
                      </div>
                      <div className={`w-1.5 h-1.5 rounded-full ${sec.dot} flex-shrink-0`} />
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
