'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Activity, ShieldCheck, Box, PackageOpen } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'
import type { Prediction } from '../types'

interface Props {
  predictions: Prediction[]
  loading: boolean
}

export default function AdvancedAnalytics({ predictions, loading }: Props) {
  if (loading) return null
  if (!predictions || predictions.length === 0) return null

  // ABC Data
  const abcCounts = { A: 0, B: 0, C: 0 }
  predictions.forEach(p => { abcCounts[p.abcClass]++ })
  const abcData = [
    { name: 'Classe A (70% Valeur)', value: abcCounts.A, color: '#34d399' },
    { name: 'Classe B (20% Valeur)', value: abcCounts.B, color: '#fbbf24' },
    { name: 'Classe C (10% Valeur)', value: abcCounts.C, color: '#94a3b8' }
  ]

  // Anomalies
  const anomalies = predictions.filter(p => p.anomalyLevel !== 'NORMAL')
    .sort((a, b) => b.zScore - a.zScore)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* ── ABC CLASSIFICATION (PARETO) ──────────────────────────── */}
      <div className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <PieChart className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-primary font-bold text-lg">Classification ABC (Pareto)</h2>
            <p className="text-slate-500 text-xs">Répartition par valeur annuelle estimée</p>
          </div>
        </div>

        <div className="flex items-center h-[200px]">
          <div className="w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={abcData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {abcData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#334155', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#334155', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 space-y-4 pl-4">
            {abcData.map(d => (
              <div key={d.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                <div>
                  <p className="text-slate-700 text-sm font-bold">{d.name}</p>
                  <p className="text-slate-500 text-xs">{d.value} articles</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>      
    </div>
  )
}
