'use client'

import { motion } from 'framer-motion'
import { BarChart3, ArrowDown, RefreshCw, Info, ChevronRight, Sparkles } from 'lucide-react'
import type { OptimItem } from '../types/recommendation'
import EmptyState from './EmptyState'

interface Props {
  items: OptimItem[]
  onGeminiClick: (ctx: any) => void
}

const issueConfig = {
  OVERSTOCK: {
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: <ArrowDown className="w-3 h-3" />,
    label: 'Overstock',
  },
  LOW_ROTATION: {
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    icon: <RefreshCw className="w-3 h-3" />,
    label: 'Low Rotation',
  },
  ANOMALY: {
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    icon: <Info className="w-3 h-3" />,
    label: 'Anomaly',
  },
}

export default function OptimCard({ items, onGeminiClick }: Props) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.005 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative rounded-2xl overflow-hidden border border-blue-200 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-500" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-primary font-bold text-sm leading-tight">Optimisation du Stock</h3>
              <p className="text-slate-500 text-[10px] font-mono mt-0.5">Surstock · Rotation faible</p>
            </div>
          </div>
          <span className="flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-black px-2 py-1 rounded-full">
            <BarChart3 className="w-3 h-3" />
            {items.length}
          </span>
        </div>

        {items.length === 0 ? (
          <EmptyState message="Stock bien optimisé — aucun problème détecté" />
        ) : (
          <div className="space-y-2.5">
            {items.map((item, i) => {
              const cfg = issueConfig[item.issue]
              return (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`group relative ${cfg.bg} border ${cfg.border} hover:bg-opacity-50 rounded-xl p-3 transition-all cursor-pointer`}
                  onClick={() => onGeminiClick({ ...item, type: 'OPTIMIZATION' })}
                >
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-violet-50 rounded-full border border-violet-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="w-3 h-3 text-violet-500" />
                  </div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-primary text-xs font-semibold truncate">{item.productName}</p>
                    <span className={`flex items-center gap-1 text-[9px] font-bold ${cfg.color.replace('300', '600')} bg-white/50 rounded-full px-2 py-0.5`}>
                      {cfg.icon}{cfg.label}
                    </span>
                  </div>
                  <p className={`text-[10px] font-mono ${cfg.color.replace('300', '600')} opacity-80`}>{item.detail}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-blue-500 flex-shrink-0" />
                    <span className="text-slate-600 text-[10px]">{item.recommendation}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </motion.div>
  )
}
