'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Clock3, CheckCircle2, ShoppingCart, Calendar, TrendingUp } from 'lucide-react'
import type { Prediction } from '../types'
import { getRecommendation } from '../utils/forecast'

interface Props {
  predictions: Prediction[]
  loading: boolean
}

const statusConfig = {
  URGENT: {
    badge: 'bg-red-500/15 text-red-400 border-red-500/30',
    row: 'hover:bg-red-500/[0.03]',
    icon: AlertTriangle,
    actionBg: 'bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25',
    barColor: 'bg-red-500',
  },
  THIS_WEEK: {
    badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    row: 'hover:bg-orange-500/[0.03]',
    icon: Clock3,
    actionBg: 'bg-orange-500/15 text-orange-300 border-orange-500/30 hover:bg-orange-500/25',
    barColor: 'bg-orange-400',
  },
  OK: {
    badge: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    row: 'hover:bg-slate-50',
    icon: CheckCircle2,
    actionBg: 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100',
    barColor: 'bg-secondary',
  },
}

export default function PredictionTable({ predictions, loading }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-secondary" />
          <div>
            <h2 className="text-primary font-bold text-sm">Table des Prévisions Détaillées</h2>
            <p className="text-slate-500 text-xs">Analyse WMA par article</p>
          </div>
        </div>
        <span className="text-xs text-slate-500 font-mono">{predictions.length} articles</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {['Article', 'Stock actuel', 'Moy./jour', 'Prévu 7j', 'Prévu 14j', 'Jours restants', 'Confiance', 'Action'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? [...Array(6)].map((_, i) => (
                <tr key={i} className="border-b border-slate-200">
                  {[...Array(8)].map((_, j) => (
                    <td key={j} className="px-4 py-3.5">
                      <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
              : predictions.map((p, idx) => {
                const cfg = statusConfig[p.status]
                const Icon = cfg.icon
                const pct = Math.min(100, Math.round((p.daysRemaining / 30) * 100))

                return (
                  <motion.tr
                    key={p.productId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`border-b border-slate-200 transition-all duration-200 ${cfg.row}`}
                  >
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="text-primary font-semibold text-xs leading-tight">{p.productName}</p>
                        <p className="text-secondary font-mono text-[10px] mt-0.5">{p.barcode}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-primary font-mono font-bold">{p.stock}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-slate-600 font-mono">{p.wma} u/j</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-orange-500 font-mono">{p.forecast7d}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-slate-600 font-mono">{p.forecast14d}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-1">
                        <span className={`font-mono font-bold text-xs ${p.daysRemaining < 7 ? 'text-red-500' : p.daysRemaining < 14 ? 'text-orange-500' : 'text-emerald-500'}`}>
                          {p.daysRemaining >= 999 ? '∞' : `${p.daysRemaining}j`}
                        </span>
                        <div className="w-14 h-1 bg-slate-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(pct, 100)}%` }}
                            transition={{ duration: 1, delay: idx * 0.05 }}
                            className={`h-full rounded-full ${cfg.barColor}`}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-8 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${p.confidence}%` }}
                            transition={{ duration: 1.2, delay: idx * 0.05 }}
                            className="h-full bg-secondary rounded-full"
                          />
                        </div>
                        <span className="text-secondary font-mono text-xs">{p.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-wide cursor-pointer transition-colors w-max ${cfg.actionBg}`}
                      >
                        <Icon className="w-3 h-3" />
                        {getRecommendation(p.status)}
                      </motion.div>
                    </td>
                  </motion.tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
