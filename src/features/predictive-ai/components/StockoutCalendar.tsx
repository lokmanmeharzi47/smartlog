'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Clock3, CheckCircle2, CalendarDays } from 'lucide-react'
import type { Prediction } from '../types'

interface Props {
  predictions: Prediction[]
  loading: boolean
}

const statusCfg = {
  URGENT: {
    label: 'RUPTURE IMMINENTE',
    badge: 'bg-red-50 text-red-600 border-red-200',
    pulse: true,
    icon: AlertTriangle,
  },
  THIS_WEEK: {
    label: 'URGENT',
    badge: 'bg-orange-50 text-orange-600 border-orange-200',
    pulse: false,
    icon: Clock3,
  },
  OK: {
    label: 'OK',
    badge: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    pulse: false,
    icon: CheckCircle2,
  },
}

export default function StockoutCalendar({ predictions, loading }: Props) {
  // Sort: URGENT first, then THIS_WEEK, then OK
  const sorted = [...predictions].sort((a, b) => {
    const order = { URGENT: 0, THIS_WEEK: 1, OK: 2 }
    return order[a.status] - order[b.status]
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200">
        <CalendarDays className="w-5 h-5 text-secondary" />
        <div>
          <h2 className="text-primary font-bold text-sm">Calendrier des Ruptures</h2>
          <p className="text-slate-500 text-xs">Prévision de date de rupture par article</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {['Article', 'Stock actuel', 'Moy./jour', 'Jours restants', 'Seuil atteint', 'Date rupture', 'Statut'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-slate-200">
                  {[...Array(7)].map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
              : sorted.map((p, idx) => {
                const cfg = statusCfg[p.status]
                const Icon = cfg.icon

                return (
                  <motion.tr
                    key={p.productId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.04 }}
                    className="border-b border-slate-200 hover:bg-slate-50 transition-all"
                  >
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="text-primary font-semibold text-xs">{p.productName}</p>
                        <p className="text-secondary font-mono text-[10px] mt-0.5">{p.barcode}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-primary font-mono font-bold">{p.stock}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-slate-600 font-mono">{p.wma > 0 ? `${p.wma} u/j` : '—'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`font-mono font-bold ${p.daysRemaining < 7 ? 'text-red-500' : p.daysRemaining < 14 ? 'text-orange-500' : 'text-emerald-500'}`}>
                        {p.daysRemaining >= 999 ? '∞' : `${p.daysRemaining}j`}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-slate-500 text-xs">{p.thresholdDate ?? '—'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-medium ${p.stockoutDate ? 'text-red-500' : 'text-slate-500'}`}>
                        {p.stockoutDate ?? 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <motion.div
                        animate={cfg.pulse ? { opacity: [1, 0.6, 1] } : {}}
                        transition={cfg.pulse ? { repeat: Infinity, duration: 1.8 } : {}}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-wide w-max ${cfg.badge}`}
                      >
                        <Icon className="w-3 h-3" />
                        {cfg.label}
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
