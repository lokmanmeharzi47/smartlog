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
      {/* ── Z-SCORE ANOMALIES ────────────────────────────────────── */}
      <div className="bg-[#081225] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Détection d'Anomalies (Z-Score)</h2>
            <p className="text-slate-400 text-xs">Détection des pics de consommation</p>
          </div>
        </div>

        {anomalies.length === 0 ? (
          <div className="text-center py-8">
            <ShieldCheck className="w-10 h-10 text-emerald-500/50 mx-auto mb-2" />
            <p className="text-emerald-400 text-sm font-bold">Aucune anomalie détectée</p>
            <p className="text-slate-500 text-xs">La consommation est stable.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            {anomalies.map(a => (
              <div key={a.productId} className={`p-3 rounded-xl border ${a.anomalyLevel === 'CRITICAL' ? 'bg-red-500/5 border-red-500/20' : 'bg-orange-500/5 border-orange-500/20'} flex items-center justify-between`}>
                <div>
                  <h3 className="text-white font-bold text-sm">{a.productName}</h3>
                  <p className="text-slate-400 text-xs font-mono mt-0.5">{a.barcode}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-bold uppercase ${a.anomalyLevel === 'CRITICAL' ? 'text-red-400' : 'text-orange-400'}`}>
                    {a.anomalyLevel === 'CRITICAL' ? 'Critique' : 'Modéré'}
                  </p>
                  <p className="text-slate-300 text-xs font-mono mt-0.5">Z={a.zScore.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── ABC CLASSIFICATION (PARETO) ──────────────────────────── */}
      <div className="bg-[#081225] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <PieChart className="w-5 h-5 text-emerald-400" />
            {/* Fallback to Box icon since PieChart isn't imported from lucide */}
            <Box className="w-5 h-5 text-emerald-400 absolute" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Classification ABC (Pareto)</h2>
            <p className="text-slate-400 text-xs">Répartition par valeur annuelle estimée</p>
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
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 space-y-4 pl-4">
            {abcData.map(d => (
              <div key={d.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                <div>
                  <p className="text-slate-300 text-sm font-bold">{d.name}</p>
                  <p className="text-slate-400 text-xs">{d.value} articles</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>      
    </div>
  )
}
