'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Sparkles } from 'lucide-react'
import type { ForecastItem } from '../types/recommendation'
import ABCBadge from './ABCBadge'
import EmptyState from './EmptyState'

interface Props {
  items: ForecastItem[]
  onGeminiClick: (ctx: any) => void
}

export default function ForecastCard({ items, onGeminiClick }: Props) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.005 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative rounded-2xl overflow-hidden border border-emerald-200 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 via-green-400 to-teal-500" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-primary font-bold text-sm leading-tight">Prévisions 7 Jours</h3>
              <p className="text-slate-500 text-[10px] font-mono mt-0.5">WMA · Demande prévue</p>
            </div>
          </div>
          <span className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-black px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            {items.length}
          </span>
        </div>

        {items.length === 0 ? (
          <EmptyState message="Aucune prévision disponible" />
        ) : (
          <div className="space-y-2.5">
            {items.map((item, i) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100 hover:border-emerald-200 rounded-xl p-3 transition-all cursor-pointer"
                onClick={() => onGeminiClick({ ...item, type: 'FORECAST' })}
              >
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-violet-50 rounded-full border border-violet-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-3 h-3 text-violet-500" />
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <p className="text-primary text-xs font-semibold truncate">{item.productName}</p>
                    <ABCBadge cls={item.abcClass} />
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-emerald-600 font-black text-sm font-mono">{item.forecast7d}</span>
                    <span className="text-emerald-500 text-[9px] ml-0.5">u</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.confidence}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                      className="h-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-400"
                    />
                  </div>
                  <span className="text-emerald-600 text-[10px] font-mono font-bold w-8 text-right">
                    {item.confidence}%
                  </span>
                </div>
                <div className="mt-1 text-slate-500 text-[9px] font-mono">
                  WMA: {item.wma} u/j
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
