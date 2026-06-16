'use client'

import { useEffect, useState, useCallback } from 'react'
import TopBar from '@/components/layout/TopBar'
import KpiCard from '@/components/ui/KpiCard'
import { getDashboardStats, getRecentMovements } from '@/lib/api'
import { supabase } from '@/lib/supabaseClient'
import type { DashboardStats, MovementWithProduct } from '@/types/database'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { Package, AlertTriangle, CheckCircle, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { AdvancedMetricsGrid } from '@/features/dashboard/components/AdvancedMetricsGrid'

// ── Helper: format big numbers ─────────────────────────────────────────────
function fmt(n: number) {
  return n >= 1_000_000
    ? (n / 1_000_000).toFixed(1) + 'M'
    : n >= 1_000
    ? (n / 1_000).toFixed(1) + 'k'
    : String(n)
}

// ── Custom Tooltip for Recharts ─────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; fill: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs shadow-xl">
      <p className="text-slate-400 mb-1 font-mono">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.fill }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats]     = useState<DashboardStats | null>(null)
  const [moves, setMoves]     = useState<MovementWithProduct[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const [s, m] = await Promise.all([getDashboardStats(), getRecentMovements(10)])
      setStats(s)
      setMoves(m)
    } catch {
      toast.error('Erreur de chargement des données')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()

    // Real-time subscriptions
    const channel = supabase
      .channel('dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        loadData()
        toast.success('Données mises à jour en temps réel', { id: 'rt-products', duration: 2000 })
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'movements' }, () => {
        loadData()
        toast.success('Nouveau mouvement détecté', { id: 'rt-movements', duration: 2000 })
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        loadData()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'warehouse_config' }, () => {
        loadData()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [loadData])

  // Mock sparkline data (30-day movement trend)
  const sparkData = [
    { day: 'J-7', IN: 120, OUT: 85 },
    { day: 'J-6', IN: 95,  OUT: 110 },
    { day: 'J-5', IN: 200, OUT: 130 },
    { day: 'J-4', IN: 150, OUT: 90  },
    { day: 'J-3', IN: 80,  OUT: 160 },
    { day: 'J-2', IN: 180, OUT: 70  },
    { day: 'J-1', IN: 130, OUT: 100 },
  ]

  const categoryData = [
    { name: 'Papeterie',    value: 7, fill: '#1E9FD8' },
    { name: 'Informatique', value: 6, fill: '#18A265' },
    { name: 'Emballage',    value: 5, fill: '#E07020'  },
    { name: 'Outillage',    value: 1, fill: '#7C3AED'  },
  ]

  return (
    <>
      <TopBar title="Dashboard" subtitle="Vue globale de l'entrepôt — Temps réel" />

      <main className="flex-1 p-6 space-y-6 fade-in">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 fade-up">
          <KpiCard
            label="Total articles en stock"
            value={loading ? '—' : fmt(stats?.totalStock ?? 0)}
            subLabel={`${stats?.totalProducts ?? 0} références`}
            icon={<Package />}
            accent="cyan"
            loading={loading}
          />
          <KpiCard
            label="Articles critiques"
            value={loading ? '—' : String(stats?.criticalItems ?? 0)}
            subLabel={stats?.criticalItems ? `⚠ ${stats.criticalItems} à commander` : '✓ Stock OK'}
            icon={<AlertTriangle />}
            accent="rose"
            loading={loading}
          />
          <KpiCard
            label="Stock faible"
            value={loading ? '—' : String(stats?.lowItems ?? 0)}
            subLabel="Réapprovisionnement à prévoir"
            icon={<TrendingUp />}
            accent="orange"
            loading={loading}
          />
          <KpiCard
            label="Articles stock OK"
            value={loading ? '—' : String(stats?.okItems ?? 0)}
            subLabel="Niveaux optimaux"
            icon={<CheckCircle />}
            accent="emerald"
            loading={loading}
          />
          <KpiCard
            label="Taux de couverture"
            value={loading ? '—' : `${stats?.coverageRate ?? 0}%`}
            subLabel={`Valeur: ${fmt(stats?.totalValue ?? 0)} DZD`}
            icon={<TrendingUp />}
            accent="amber"
            loading={loading}
          />
        </div>

        {/* Indicateurs Avancés */}
        <AdvancedMetricsGrid />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 fade-up" style={{ animationDelay: '100ms' }}>
          {/* Movement trend chart */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_6px_rgba(0,153,224,0.7)]" />
                <span className="text-primary text-sm font-semibold">Mouvements (7 derniers jours)</span>
              </div>
              <span className="text-slate-600 text-xs font-mono bg-slate-100 px-2 py-1 rounded-lg">Entrées / Sorties</span>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={sparkData}>
                  <defs>
                    <linearGradient id="gIn"  x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#1E9FD8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1E9FD8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#D63031" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#D63031" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="IN"  name="Entrées" stroke="#1E9FD8" fill="url(#gIn)"  strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="OUT" name="Sorties" stroke="#D63031" fill="url(#gOut)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category donut chart */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_6px_rgba(0,153,224,0.7)]" />
              <span className="text-primary text-sm font-semibold">Répartition par catégorie</span>
            </div>
            <div className="p-4 flex items-center justify-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={0}>
                    {categoryData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {categoryData.map(c => (
                  <div key={c.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.fill }} />
                    <span className="text-slate-500 text-xs">{c.name}</span>
                    <span className="text-slate-700 text-xs font-mono ml-auto pl-4">{c.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Movements Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow fade-up" style={{ animationDelay: '200ms' }}>
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_6px_rgba(0,153,224,0.7)]" />
              <span className="text-primary text-sm font-semibold">Derniers mouvements</span>
            </div>
            <span className="text-slate-600 text-xs font-mono bg-slate-100 px-2 py-1 rounded-lg">
              {stats?.todayMovements ?? 0} aujourd&apos;hui
            </span>
          </div>

          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton h-10 w-full" />
              ))}
            </div>
          ) : moves.length === 0 ? (
            <div className="p-8 text-center text-slate-600 text-sm">
              Aucun mouvement enregistré
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    {['Produit', 'Catégorie', 'Type', 'Quantité', 'Date'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {moves.map((m) => (
                    <tr key={m.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 text-slate-700 font-medium">{m.products?.name}</td>
                      <td className="px-5 py-3">
                        <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-lg font-mono">
                          {m.products?.category ?? '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg ${
                          m.type === 'IN'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                            : 'bg-red-500/15 text-red-400 border border-red-500/20'
                        }`}>
                          {m.type === 'IN' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                          {m.type}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-primary font-mono font-semibold">+{m.quantity}</td>
                      <td className="px-5 py-3 text-slate-500 font-mono text-xs">
                        {m.created_at
                          ? new Date(m.created_at).toLocaleString('fr-FR', {
                              day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                            })
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
