'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Sparkles, Zap } from 'lucide-react'
import type { UrgentItem } from '../types/recommendation'
import ABCBadge from './ABCBadge'
import EmptyState from './EmptyState'

interface Props {
  items: UrgentItem[]
  onGeminiClick: (ctx: any) => void
}

export default function UrgentActionsCard({ items, onGeminiClick }: Props) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.005 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative rounded-2xl overflow-hidden border border-red-100 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-400 to-rose-500" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-sm leading-tight">Actions Urgentes</h3>
              <p className="text-slate-500 text-[10px] font-mono mt-0.5">Ruptures imminentes · &lt; 7j</p>
            </div>
          </div>
          <span className="flex items-center gap-1 bg-red-50 border border-red-200 text-red-600 text-[10px] font-black px-2 py-1 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {items.length}
          </span>
        </div>

        {items.length === 0 ? (
          <EmptyState message="Aucune rupture imminente détectée" />
        ) : (
          <div className="space-y-2.5">
            {items.map((item, i) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative bg-red-50/50 hover:bg-red-50 border border-red-100 hover:border-red-200 rounded-xl p-3 transition-all cursor-pointer"
                onClick={() => onGeminiClick({ ...item, type: 'URGENT' })}
              >
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-violet-50 rounded-full border border-violet-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-3 h-3 text-violet-500" />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[8px] text-slate-400 font-mono">{i + 1}.</span>
                      <p className="text-slate-900 text-xs font-semibold truncate">{item.productName}</p>
                      <ABCBadge cls={item.abcClass} />
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-mono">
                      <span className="text-slate-500">Stock: <span className="text-red-600 font-bold">{item.stock}</span></span>
                      <span className="text-slate-300">|</span>
                      <span className="text-slate-500">Seuil: <span className="text-slate-600">{item.minStock}</span></span>
                    </div>
                    <div className="mt-1.5 w-full bg-slate-200 rounded-full h-1">
                      <div
                        className="h-1 rounded-full bg-gradient-to-r from-red-500 to-red-400 transition-all"
                        style={{ width: `${Math.min((item.stock / Math.max(item.minStock, 1)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-red-400 font-black text-sm font-mono leading-tight">
                      {item.daysRemaining}j
                    </div>
                    <div className="text-red-400/50 text-[9px]">restants</div>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-red-500 flex-shrink-0" />
                  <span className="text-red-700 text-[10px] font-semibold">
                    Commander {item.recommendedQty} unités
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
