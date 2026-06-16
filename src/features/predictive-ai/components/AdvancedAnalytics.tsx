'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Activity, PackageSearch, Cpu } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'
import type { Prediction } from '../types'

interface Props {
  predictions: Prediction[]
  loading: boolean
}

export default function AdvancedAnalytics({ predictions, loading }: Props) {
  if (loading) return null
  if (!predictions || predictions.length === 0) return null

  // ── §7.2 — ABC Classification Pareto ──────────────────────────────────────
  const abcCounts = { A: 0, B: 0, C: 0 }
  predictions.forEach(p => { abcCounts[p.abcClass]++ })

  const abcRows = [
    {
      label: 'Classe A',
      sub: '0–70% de la valeur',
      count: abcCounts.A,
      color: '#0099e0',
      strategy: 'Contrôle strict · Réappro fréquent',
    },
    {
      label: 'Classe B',
      sub: '70–90% de la valeur',
      count: abcCounts.B,
      color: '#18A265',
      strategy: 'Contrôle modéré · Réappro mensuel',
    },
    {
      label: 'Classe C',
      sub: '90–100% de la valeur',
      count: abcCounts.C,
      color: '#94a3b8',
      strategy: 'Contrôle allégé · Commande en lot',
    },
  ]
  const abcPieData = abcRows.map(d => ({ name: d.label, value: d.count, color: d.color }))

  // ── §7.1 — Z-Score Anomaly Detection ──────────────────────────────────────
  const anomalies = [...predictions]
    .filter(p => p.anomalyLevel !== 'NORMAL')
    .sort((a, b) => b.zScore - a.zScore)

  // ── §7.3 — EOQ & Safety Stock (top 6 by annual value) ─────────────────────
  const eoqItems = [...predictions]
    .filter(p => p.eoq > 0)
    .sort((a, b) => b.annualValue - a.annualValue)
    .slice(0, 6)

  // ── §7.4 — Behavior Clustering ────────────────────────────────────────────
  // CV ≈ (1 - confidence/100) / 0.8  (reverse of confidence formula)
  type ClusterItem = Prediction & { profile: string; strategy: string; color: string; cv: number }
  const clusters: ClusterItem[] = predictions.map(p => {
    const cv = p.confidence > 0 ? (1 - p.confidence / 100) / 0.8 : 1
    let profile: string, strategy: string, color: string
    if (p.wma < 2) {
      profile = 'Faible'; strategy = 'Contrôle allégé'
      color = 'text-slate-600 bg-slate-50 border-slate-200'
    } else if (cv > 0.5) {
      profile = 'Irrégulier'; strategy = 'WMA + Stock sécurité élevé'
      color = 'text-orange-700 bg-orange-50 border-orange-200'
    } else {
      profile = 'Stable'; strategy = 'WMA'
      color = 'text-emerald-700 bg-emerald-50 border-emerald-200'
    }
    return { ...p, profile, strategy, color, cv: Math.round(cv * 100) / 100 }
  })

  const clusterGroups: Record<string, ClusterItem[]> = {}
  clusters.forEach(c => {
    if (!clusterGroups[c.profile]) clusterGroups[c.profile] = []
    clusterGroups[c.profile].push(c)
  })

  // Sort cluster groups: Stable → Irrégulier → Faible
  const clusterOrder = ['Stable', 'Irrégulier', 'Faible']
  const orderedGroups = clusterOrder
    .filter(k => clusterGroups[k]?.length > 0)
    .map(k => ({ profile: k, items: clusterGroups[k] }))

  return (
    <div className="space-y-6">

      {/* ── Row 1: ABC Chart + Z-Score Anomalies ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* §7.2 — Classification ABC (Pareto) */}
        <div className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <PieChart className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-primary font-bold text-base leading-tight">Classification ABC — Pareto</h2>
              <p className="text-slate-500 text-xs mt-0.5">Valeur annuelle estimée · Loi 80/20</p>
            </div>
          </div>

          <div className="flex items-center gap-4 h-[190px]">
            <div className="w-[45%] h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={abcPieData}
                    cx="50%" cy="50%"
                    innerRadius={46} outerRadius={76}
                    paddingAngle={4} dataKey="value" stroke="none"
                  >
                    {abcPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ background: '#fff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3.5">
              {abcRows.map(d => (
                <div key={d.label} className="flex items-start gap-2.5">
                  <div className="w-3 h-3 rounded-full mt-0.5 flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <div>
                    <p className="text-slate-800 text-xs font-bold">{d.label}</p>
                    <p className="text-slate-500 text-[10px]">{d.count} articles · {d.sub}</p>
                    <p className="text-slate-400 text-[10px] italic">{d.strategy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* §7.1 — Z-Score Anomaly Detection */}
        <div className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-primary font-bold text-base leading-tight">Détection d&apos;Anomalies — Z-Score</h2>
              <p className="text-slate-500 text-xs mt-0.5">Z = |x − μ| / σ &nbsp;·&nbsp; &gt;1.5 Modéré &nbsp;·&nbsp; &gt;2.5 Critique</p>
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex-shrink-0 ${
              anomalies.length > 0
                ? 'bg-red-50 border-red-200 text-red-600'
                : 'bg-emerald-50 border-emerald-200 text-emerald-600'
            }`}>
              {anomalies.length} anomalie{anomalies.length !== 1 ? 's' : ''}
            </span>
          </div>

          {anomalies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <Activity className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="text-center">
                <p className="text-emerald-600 text-sm font-bold">Aucune anomalie détectée</p>
                <p className="text-slate-400 text-xs mt-0.5">Consommation stable sur 7 jours</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2 overflow-y-auto max-h-[165px]" style={{ scrollbarWidth: 'thin' }}>
              {anomalies.map((a, idx) => (
                <motion.div
                  key={a.productId}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    a.anomalyLevel === 'CRITICAL'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-orange-50 border-orange-200'
                  }`}
                >
                  <div>
                    <p className="text-slate-800 font-semibold text-xs">{a.productName}</p>
                    <p className="text-slate-500 text-[10px] font-mono mt-0.5">{a.barcode} · μ={a.wma.toFixed(1)} u/j</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-black ${a.anomalyLevel === 'CRITICAL' ? 'text-red-600' : 'text-orange-600'}`}>
                      Z = {a.zScore.toFixed(2)}
                    </p>
                    <p className={`text-[10px] font-bold uppercase ${a.anomalyLevel === 'CRITICAL' ? 'text-red-500' : 'text-orange-500'}`}>
                      {a.anomalyLevel === 'CRITICAL' ? '🔴 Critique' : '🟠 Modéré'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Row 2: EOQ & Safety Stock + Clustering ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* §7.3 — EOQ & Stock de Sécurité */}
        <div className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <PackageSearch className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-primary font-bold text-base leading-tight">EOQ &amp; Stock de Sécurité</h2>
              <p className="text-slate-500 text-xs mt-0.5">EOQ = √(2DK/h) · Stock sécu = 1.65σ√délai · Niveau 95%</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Article', 'EOQ opt.', 'Stock sécu.', 'Cls'].map(h => (
                    <th key={h} className="text-left pb-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {eoqItems.map((p, i) => (
                  <motion.tr
                    key={p.productId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-2.5 pr-3">
                      <p className="text-slate-800 font-semibold text-xs truncate max-w-[110px]">{p.productName}</p>
                      <p className="text-slate-400 text-[10px] font-mono">{p.barcode}</p>
                    </td>
                    <td className="py-2.5 pr-3">
                      <span className="text-blue-700 font-bold font-mono">{p.eoq} u</span>
                    </td>
                    <td className="py-2.5 pr-3">
                      <span className="text-emerald-700 font-bold font-mono">{p.safetyStock} u</span>
                    </td>
                    <td className="py-2.5">
                      <span className={`text-[9px] font-black border rounded-md px-1.5 py-0.5 leading-none ${
                        p.abcClass === 'A' ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : p.abcClass === 'B' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {p.abcClass}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* EOQ formula reminder */}
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[10px] text-slate-500">
            EOQ = √(2 × D × K / h) &nbsp;|&nbsp; D=demande/an, K=coût cmd, h=coût stockage
          </div>
        </div>

        {/* §7.4 — Clustering comportements */}
        <div className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-500" />
            </div>
            <div>
              <h2 className="text-primary font-bold text-base leading-tight">Clustering Comportements</h2>
              <p className="text-slate-500 text-xs mt-0.5">Profilage de la demande — CV, WMA, fréquence</p>
            </div>
          </div>
          <div className="space-y-3">
            {orderedGroups.map(({ profile, items }) => {
              const sample = items[0]
              const iconMap: Record<string, string> = { Stable: '📈', Irrégulier: '⚡', Faible: '📦' }
              return (
                <div key={profile} className={`p-4 rounded-xl border ${sample.color}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm">{iconMap[profile] || ''} {profile}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono opacity-70">{items.length} article{items.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <p className="text-[11px] font-semibold opacity-75 mb-1.5">Modèle : {sample.strategy}</p>
                  <p className="text-[10px] opacity-55 leading-relaxed truncate">
                    {items.slice(0, 4).map(i => i.productName).join(' · ')}
                    {items.length > 4 ? ` +${items.length - 4} autres` : ''}
                  </p>
                </div>
              )
            })}
          </div>
          {/* Legend */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] text-center font-mono text-slate-500">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg py-1.5">CV &lt; 0.5 → Stable</div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg py-1.5">CV &gt; 0.5 → Irrégulier</div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg py-1.5">WMA &lt; 2 → Faible</div>
          </div>
        </div>
      </div>

    </div>
  )
}
