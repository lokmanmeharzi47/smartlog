'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, TrendingDown, Zap, Activity } from 'lucide-react'
import type { Prediction } from '../types'

interface Props {
  predictions: Prediction[]
}

export default function RealtimeInsights({ predictions }: Props) {
  // Generate insights from current predictions
  const insights = []

  const urgent = predictions.filter(p => p.status === 'URGENT')
  const thisWeek = predictions.filter(p => p.status === 'THIS_WEEK')
  const avgConf = predictions.length > 0
    ? Math.round(predictions.reduce((a, p) => a + p.confidence, 0) / predictions.length)
    : 0

  if (urgent.length > 0) {
    insights.push({
      id: 'urgent',
      type: 'stockout' as const,
      icon: AlertTriangle,
      color: 'red',
      message: `${urgent.length} article(s) en rupture imminente`,
      detail: urgent.slice(0, 2).map(p => p.productName).join(', '),
    })
  }

  if (thisWeek.length > 0) {
    insights.push({
      id: 'this-week',
      type: 'anomaly' as const,
      icon: TrendingDown,
      color: 'orange',
      message: `${thisWeek.length} article(s) à commander cette semaine`,
      detail: thisWeek.slice(0, 2).map(p => p.productName).join(', '),
    })
  }

  if (avgConf >= 85) {
    insights.push({
      id: 'conf',
      type: 'variation' as const,
      icon: Activity,
      color: 'emerald',
      message: `Confiance algorithme élevée : ${avgConf}%`,
      detail: 'Demande globalement stable sur 7 jours',
    })
  } else {
    insights.push({
      id: 'conf-low',
      type: 'spike' as const,
      icon: Zap,
      color: 'cyan',
      message: `Confiance modérée : ${avgConf}%`,
      detail: 'Variabilité détectée dans la consommation',
    })
  }

  const colorMap = {
    red: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', icon: 'text-red-400' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-300', icon: 'text-orange-300' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', icon: 'text-emerald-400' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-300', icon: 'text-cyan-300' },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="bg-[#081225] border border-white/10 rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <Activity className="w-4 h-4 text-cyan-400" />
        <h2 className="text-white font-bold text-sm">Realtime Insights</h2>
        <div className="flex items-center gap-1.5 ml-auto">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-400 text-xs font-mono">LIVE</span>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((ins, i) => {
          const c = colorMap[ins.color as keyof typeof colorMap]
          const Icon = ins.icon
          return (
            <motion.div
              key={ins.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className={`flex items-start gap-3 p-3.5 rounded-xl border ${c.bg} ${c.border}`}
            >
              <div className={`p-1.5 rounded-lg ${c.bg} flex-shrink-0`}>
                <Icon className={`w-3.5 h-3.5 ${c.icon}`} />
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-bold ${c.text} leading-tight`}>{ins.message}</p>
                <p className="text-slate-500 text-[10px] mt-0.5 truncate">{ins.detail}</p>
              </div>
              <span className="text-slate-600 text-[9px] font-mono ml-auto flex-shrink-0">
                {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
