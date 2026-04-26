'use client'

import { useEffect, useState, useCallback } from 'react'
import Topbar from '@/components/Topbar'
import { getProducts, getRecentMovements } from '@/lib/api'
import type { Product, MovementWithProduct } from '@/types/database'
import toast from 'react-hot-toast'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts'

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; fill: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs shadow-xl">
      <p className="text-slate-400 mb-1 font-mono">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.fill ?? '#22d3ee' }} className="font-semibold">{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [moves, setMoves]       = useState<MovementWithProduct[]>([])
  const [loading, setLoading]   = useState(true)

  const load = useCallback(async () => {
    try {
      const [p, m] = await Promise.all([getProducts(), getRecentMovements(50)])
      setProducts(p)
      setMoves(m)
    } catch { toast.error('Erreur de chargement') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  // ── Chart data computations ─────────────────────────────────────────────

  // Category stock breakdown
  const catData = Object.entries(
    products.reduce((acc, p) => {
      const cat = p.category ?? 'Autre'
      acc[cat] = (acc[cat] ?? 0) + p.stock
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  // Stock vs min_stock for top-10 products by stock level
  const stockCompare = [...products]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 10)
    .map(p => ({ name: p.name.length > 14 ? p.name.slice(0, 14) + '…' : p.name, stock: p.stock, min: p.min_stock }))

  // Movement trend last 30 days (bucketed by day)
  const movTrend = (() => {
    const map: Record<string, { IN: number; OUT: number }> = {}
    moves.forEach(m => {
      if (!m.created_at) return
      const day = m.created_at.split('T')[0]
      if (!map[day]) map[day] = { IN: 0, OUT: 0 }
      map[day][m.type as 'IN' | 'OUT'] += m.quantity
    })
    return Object.entries(map).sort().slice(-14).map(([day, v]) => ({
      day: day.slice(5),
      ...v,
    }))
  })()

  // ABC analysis
  const sorted = [...products].sort((a, b) => (b.stock * (b.unit_price ?? 0)) - (a.stock * (a.unit_price ?? 0)))
  const totalVal = sorted.reduce((s, p) => s + p.stock * (p.unit_price ?? 0), 0)
  let cum = 0
  const abcData = sorted.map(p => {
    cum += (p.stock * (p.unit_price ?? 0)) / totalVal
    return { name: p.name, pct: +(cum * 100).toFixed(1), cat: cum <= 0.7 ? 'A' : cum <= 0.9 ? 'B' : 'C' }
  })
  const aCount = abcData.filter(p => p.cat === 'A').length
  const bCount = abcData.filter(p => p.cat === 'B').length
  const cCount = abcData.filter(p => p.cat === 'C').length

  const PIE_COLORS = ['#1E9FD8', '#18A265', '#E07020', '#7C3AED']

  if (loading) {
    return (
      <>
        <Topbar title="Analytique" />
        <main className="flex-1 p-6 space-y-5">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-64 w-full rounded-2xl" />)}
        </main>
      </>
    )
  }

  return (
    <>
      <Topbar title="Analytique" subtitle="Analyses avancées de l'inventaire" />

      <main className="flex-1 p-6 space-y-5 fade-in">
        {/* Top row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Stock by category */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800">
              <span className="text-white font-semibold text-sm">Stock par catégorie</span>
            </div>
            <div className="p-4 flex items-center justify-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie data={catData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                    {catData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {catData.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-slate-400 text-xs">{c.name}</span>
                    <span className="text-slate-200 text-xs font-mono ml-2">{c.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ABC Analysis */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800">
              <span className="text-white font-semibold text-sm">Analyse ABC (par valeur)</span>
            </div>
            <div className="p-5 grid grid-cols-3 gap-3">
              {[
                { label: 'A', count: aCount, desc: '70% de la valeur', color: 'cyan',   bg: 'bg-cyan-500/10 border-cyan-500/20'   },
                { label: 'B', count: bCount, desc: '20% de la valeur', color: 'green',  bg: 'bg-emerald-500/10 border-emerald-500/20' },
                { label: 'C', count: cCount, desc: '10% de la valeur', color: 'orange', bg: 'bg-orange-500/10 border-orange-500/20' },
              ].map(a => (
                <div key={a.label} className={`${a.bg} border rounded-xl p-4 text-center`}>
                  <div className={`text-4xl font-black text-${a.color}-400`}>{a.label}</div>
                  <div className={`text-${a.color}-400 text-xl font-bold font-mono mt-1`}>{a.count}</div>
                  <div className="text-slate-500 text-[10px] mt-1">{a.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stock vs min stock bar chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800">
            <span className="text-white font-semibold text-sm">Top 10 articles — Stock actuel vs Seuil minimum</span>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stockCompare} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="stock" name="Stock" fill="#1E9FD8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="min"   name="Seuil min" fill="#D63031" radius={[4, 4, 0, 0]} fillOpacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Movement trend */}
        {movTrend.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800">
              <span className="text-white font-semibold text-sm">Tendance des mouvements (14 derniers jours)</span>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={movTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
                  <Line type="monotone" dataKey="IN"  name="Entrées" stroke="#18A265" strokeWidth={2} dot={{ fill: '#18A265', r: 3 }} />
                  <Line type="monotone" dataKey="OUT" name="Sorties" stroke="#D63031" strokeWidth={2} dot={{ fill: '#D63031', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
