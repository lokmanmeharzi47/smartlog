'use client'

import { useEffect, useState, useCallback } from 'react'
import TopBar from '@/components/layout/TopBar'
import KpiCard from '@/components/ui/KpiCard'
import { getDashboardStats, getRecentMovements, getProducts } from '@/lib/api'
import { supabase } from '@/lib/supabaseClient'
import type { DashboardStats, MovementWithProduct, Product } from '@/types/database'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { Package, AlertTriangle, CheckCircle, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { AdvancedMetricsGrid } from '@/features/dashboard/components/AdvancedMetricsGrid'
import { motion } from 'framer-motion'
import { getStockStatus } from '@/features/inventory/utils/stock'

function fmt(n: number) {
  return n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + 'M'
    : n >= 1_000 ? (n / 1_000).toFixed(1) + 'k'
    : String(n)
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { name: string; value: number; fill: string; color: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs shadow-lg">
      <p className="text-slate-600 mb-1 font-semibold">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.fill || p.color }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

function getBarColor(stock: number, minStock: number): string {
  const status = getStockStatus(stock, minStock)
  if (status === 'CRITICAL') return '#ef4444'
  if (status === 'LOW') return '#f97316'
  return '#0099e0'
}

const CATEGORY_COLORS = ['#0099e0', '#18A265', '#E07020', '#7C3AED', '#f59e0b', '#ec4899', '#14b8a6']

export default function DashboardPage() {
  const [stats, setStats]       = useState<DashboardStats | null>(null)
  const [moves, setMoves]       = useState<MovementWithProduct[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)

  const loadData = useCallback(async () => {
    try {
      const [s, m, prods] = await Promise.all([
        getDashboardStats(),
        getRecentMovements(10),
        getProducts(),
      ])
      setStats(s)
      setMoves(m)
      setProducts(prods)
    } catch {
      toast.error('Erreur de chargement des données')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
    const channel = supabase
      .channel('dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        loadData()
        toast.success('Données mises à jour', { id: 'rt-products', duration: 2000 })
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'movements' }, () => {
        loadData()
        toast.success('Nouveau mouvement détecté', { id: 'rt-movements', duration: 2000 })
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'warehouse_config' }, () => loadData())
      .subscribe()

    const timer = setInterval(loadData, 5000)
    return () => {
      supabase.removeChannel(channel)
      clearInterval(timer)
    }
  }, [loadData])

  const barData = products.slice(0, 20).map(p => ({
    name: (p.barcode || p.name).substring(0, 8),
    fullName: p.name,
    stock: p.stock,
    seuil: p.min_stock,
    color: getBarColor(p.stock, p.min_stock),
  }))

  const categoryMap: Record<string, number> = {}
  products.forEach(p => {
    const cat = p.category || 'Autre'
    categoryMap[cat] = (categoryMap[cat] || 0) + p.stock
  })
  const categoryData = Object.entries(categoryMap).map(([name, value], i) => ({
    name, value, fill: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  }))

  const zoneMap: Record<string, { stock: number; capacity: number }> = {}
  products.forEach(p => {
    const zone = p.zone || 'Zone A'
    if (!zoneMap[zone]) zoneMap[zone] = { stock: 0, capacity: 0 }
    zoneMap[zone].stock += p.stock
    zoneMap[zone].capacity += Math.max(p.min_stock * 3, 1)
  })
  const zoneFillData = Object.entries(zoneMap)
    .map(([zone, { stock, capacity }]) => ({
      zone,
      pct: Math.min(100, Math.round((stock / capacity) * 100)),
      stock,
      capacity,
    }))
    .sort((a, b) => b.pct - a.pct)

  return (
    <>
      <TopBar title="Dashboard" subtitle="Vue globale de l'entrepôt — Temps réel" />

      <main className="flex-1 p-4 md:p-6 space-y-6 fade-in max-w-[1600px] mx-auto">

        {/* KPIs Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <KpiCard
            label="Total articles en stock"
            value={loading ? '—' : fmt(stats?.totalStock ?? 0)}
            subLabel={`${stats?.totalProducts ?? 0} références`}
            icon={<Package />} accent="cyan" loading={loading}
          />
          <KpiCard
            label="Articles critiques"
            value={loading ? '—' : String(stats?.criticalItems ?? 0)}
            subLabel={stats?.criticalItems ? `⚠ ${stats.criticalItems} à commander` : '✓ Stock OK'}
            icon={<AlertTriangle />} accent="rose" loading={loading}
          />
          <KpiCard
            label="Stock faible"
            value={loading ? '—' : String(stats?.lowItems ?? 0)}
            subLabel="Réapprovisionnement à prévoir"
            icon={<TrendingUp />} accent="orange" loading={loading}
          />
          <KpiCard
            label="Articles stock OK"
            value={loading ? '—' : String(stats?.okItems ?? 0)}
            subLabel="Niveaux optimaux"
            icon={<CheckCircle />} accent="emerald" loading={loading}
          />
          <KpiCard
            label="Taux de couverture"
            value={loading ? '—' : `${stats?.coverageRate ?? 0}%`}
            subLabel={`Valeur: ${fmt(stats?.totalValue ?? 0)} DZD`}
            icon={<TrendingUp />} accent="amber" loading={loading}
          />
        </div>

        {/* Advanced Metrics */}
        <AdvancedMetricsGrid />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 dashboard-card">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                <span className="text-primary text-sm font-semibold">Niveau de stock par article</span>
              </div>
              <div className="flex items-center gap-2.5 text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#0099e0] inline-block" />OK</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f97316] inline-block" />Faible</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ef4444] inline-block" />Critique</span>
              </div>
            </div>
            <div className="p-4 overflow-x-auto">
              {loading ? (
                <div className="h-[220px] bg-slate-100 rounded-xl animate-pulse" />
              ) : barData.length === 0 ? (
                <div className="h-[220px] flex items-center justify-center text-slate-400 text-sm">Aucun article chargé</div>
              ) : (
                <ResponsiveContainer width="100%" height={220} minWidth={500}>
                  <BarChart data={barData} margin={{ top: 5, right: 8, bottom: 25, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#94a3b8', fontSize: 9 }}
                      axisLine={false} tickLine={false}
                      interval={0} angle={-35} textAnchor="end"
                    />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="stock" name="Stock actuel" radius={[3, 3, 0, 0]} maxBarSize={28}>
                      {barData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Bar>
                    <Bar dataKey="seuil" name="Seuil min" fill="#e2e8f0" radius={[3, 3, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span className="text-primary text-sm font-semibold">Répartition par catégorie</span>
            </div>
            <div className="p-4">
              {loading ? (
                <div className="h-[220px] bg-slate-100 rounded-xl animate-pulse" />
              ) : categoryData.length === 0 ? (
                <div className="h-[220px] flex items-center justify-center text-slate-400 text-sm">Aucune donnée</div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%" cy="50%"
                        innerRadius={42} outerRadius={68}
                        dataKey="value" strokeWidth={0}
                      >
                        {categoryData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="w-full space-y-1.5">
                    {categoryData.map(c => (
                      <div key={c.name} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.fill }} />
                        <span className="text-slate-400 text-[11px] flex-1 truncate">{c.name}</span>
                        <span className="text-slate-600 text-[11px] font-mono font-semibold">{c.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="dashboard-card">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                <span className="text-primary text-sm font-semibold">Remplissage des zones</span>
              </div>
              <span className="text-slate-400 text-[10px] font-mono">Qté / (Seuil × 3)</span>
            </div>
            <div className="p-5 space-y-4">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-1">
                    <div className="h-3.5 bg-slate-100 rounded animate-pulse" />
                    <div className="h-2 bg-slate-100 rounded-full animate-pulse" />
                  </div>
                ))
              ) : zoneFillData.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">Aucune zone définie</div>
              ) : (
                zoneFillData.map(z => {
                  const barColor = z.pct >= 90 ? 'bg-red-500' : z.pct >= 70 ? 'bg-orange-400' : 'bg-secondary'
                  return (
                    <div key={z.zone}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-slate-600 text-xs font-semibold">{z.zone}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-[10px] font-mono">{z.stock} / {z.capacity} u</span>
                          <span className={`text-[11px] font-bold font-mono ${z.pct >= 90 ? 'text-red-500' : z.pct >= 70 ? 'text-orange-500' : 'text-secondary'}`}>{z.pct}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${z.pct}%` }}
                          transition={{ duration: 0.9, ease: 'easeOut' }}
                          className={`h-full rounded-full ${barColor}`}
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                <span className="text-primary text-sm font-semibold">Fil d'événements</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-600 text-[9px] font-bold uppercase tracking-wider">Live</span>
                <span className="text-slate-400 text-[10px] font-mono ml-1">{stats?.todayMovements ?? 0} aujourd'hui</span>
              </div>
            </div>
            <div
              className="divide-y divide-slate-100 overflow-y-auto"
              style={{ maxHeight: '280px', scrollbarWidth: 'thin' }}
            >
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="p-3">
                    <div className="h-7 bg-slate-100 rounded-lg animate-pulse" />
                  </div>
                ))
              ) : moves.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">Aucun mouvement enregistré</div>
              ) : (
                moves.map(m => (
                  <div key={m.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      m.type === 'IN'
                        ? 'bg-emerald-50 border border-emerald-200'
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      {m.type === 'IN'
                        ? <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
                        : <ArrowDown className="w-3.5 h-3.5 text-red-600" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-700 text-xs font-semibold truncate">{m.products?.name ?? '—'}</p>
                      <p className="text-slate-400 text-[10px] font-mono">
                        {m.type === 'IN' ? 'Entrée' : 'Sortie'} &nbsp;
                        {m.type === 'IN' ? '+' : '-'}{m.quantity} u
                        {m.products?.category ? ` · ${m.products.category}` : ''}
                      </p>
                    </div>
                    <span className="text-slate-400 text-[10px] font-mono flex-shrink-0">
                      {m.created_at
                        ? new Date(m.created_at).toLocaleString('fr-FR', {
                            day: '2-digit', month: '2-digit',
                            hour: '2-digit', minute: '2-digit',
                          })
                        : '—'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </main>
    </>
  )
}
