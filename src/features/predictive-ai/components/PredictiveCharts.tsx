'use client'

import { motion } from 'framer-motion'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend
} from 'recharts'
import type { Prediction } from '../types'
import { BarChart2 } from 'lucide-react'

interface Props {
  predictions: Prediction[]
  loading: boolean
}

export default function PredictiveCharts({ predictions, loading }: Props) {
  // Top 6 most urgent for bar chart
  const topUrgent = [...predictions]
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 6)
    .map(p => ({
      name: p.barcode,
      jours: p.daysRemaining >= 999 ? 60 : p.daysRemaining,
      status: p.status,
    }))

  // Forecast 7j vs 14j top 6
  const forecastData = predictions.slice(0, 6).map(p => ({
    name: p.barcode,
    '7 jours': p.forecast7d,
    '14 jours': p.forecast14d,
    stock: p.stock,
  }))

  const statusColor = (status: string) => {
    if (status === 'URGENT') return '#ef4444'
    if (status === 'THIS_WEEK') return '#fb923c'
    return '#10b981'
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-[#081225] border border-white/10 rounded-2xl h-64 animate-pulse" />
        ))}
      </div>
    )
  }

  const tooltipStyle = {
    backgroundColor: '#0f1e38',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#e2e8f0',
    fontSize: '12px',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="w-4 h-4 text-cyan-400" />
        <h2 className="text-white font-bold text-sm">Graphiques Prédictifs IA</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Jours restants par article */}
        <div className="bg-[#081225] border border-white/10 rounded-2xl p-5">
          <p className="text-slate-300 font-semibold text-xs mb-4">Top ruptures imminentes — Jours restants</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topUrgent} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="jours" radius={[6, 6, 0, 0]}>
                {topUrgent.map((entry, index) => (
                  <Cell key={index} fill={statusColor(entry.status)} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Prévisions 7j vs 14j */}
        <div className="bg-[#081225] border border-white/10 rounded-2xl p-5">
          <p className="text-slate-300 font-semibold text-xs mb-4">Prévisions de consommation 7j / 14j</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={forecastData} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Legend
                wrapperStyle={{ fontSize: '10px', color: '#94a3b8' }}
                iconType="circle"
                iconSize={8}
              />
              <Bar dataKey="7 jours" fill="#fb923c" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
              <Bar dataKey="14 jours" fill="#ef4444" fillOpacity={0.6} radius={[4, 4, 0, 0]} />
              <Bar dataKey="stock" fill="#22d3ee" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}
