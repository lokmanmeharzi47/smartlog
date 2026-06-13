'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import TopBar from '@/components/layout/TopBar'
import { supabase } from '@/lib/supabaseClient'
import { fetchAlerts, type Alert, type AlertType } from '@/features/alerts/services/alerts.service'
import toast from 'react-hot-toast'
import { AlertTriangle, AlertCircle, Package, BrainCircuit, Search, Filter } from 'lucide-react'

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<AlertType | 'ALL'>('ALL')

  const load = useCallback(async (isRealtimeUpdate = false) => {
    try {
      const data = await fetchAlerts()
      setAlerts(data)
      if (isRealtimeUpdate) {
        toast('Inventaire mis à jour. Recalcul des alertes.', {
          icon: '🔄',
          style: { background: '#3b82f6', color: '#fff' },
          duration: 3000
        })
      }
    } catch {
      toast.error('Erreur de chargement des alertes', { duration: 7000 })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const ch = supabase
      .channel('alerts-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => load(true))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'movements' }, () => load(true))
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [load])

  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      const matchesSearch = a.productName.toLowerCase().includes(search.toLowerCase()) || a.sku.toLowerCase().includes(search.toLowerCase())
      const matchesType = filterType === 'ALL' || a.type === filterType
      return matchesSearch && matchesType
    })
  }, [alerts, search, filterType])

  const stats = useMemo(() => {
    return {
      total: alerts.length,
      critical: alerts.filter(a => a.type === 'CRITICAL_STOCK').length,
      warning: alerts.filter(a => a.type === 'WARNING_STOCK').length,
      predictive: alerts.filter(a => a.type === 'PREDICTIVE').length,
      overstock: alerts.filter(a => a.type === 'OVERSTOCK').length,
    }
  }, [alerts])

  const getAlertConfig = (type: AlertType) => {
    switch (type) {
      case 'CRITICAL_STOCK': return { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: <AlertTriangle className="w-4 h-4 text-red-400" />, label: 'Critique' }
      case 'WARNING_STOCK': return { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: <AlertCircle className="w-4 h-4 text-orange-400" />, label: 'Attention' }
      case 'PREDICTIVE': return { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: <BrainCircuit className="w-4 h-4 text-purple-400" />, label: 'Prédictif' }
      case 'OVERSTOCK': return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: <Package className="w-4 h-4 text-emerald-400" />, label: 'Surstock' }
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#020617' }}>
      <TopBar title="Alertes & Notifications" subtitle="Centre de contrôle des anomalies et ruptures" />

      <main className="p-8 space-y-6 max-w-[1600px] mx-auto">
        {/* STATS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total Alertes', value: stats.total, color: 'text-cyan-400', border: 'border-cyan-500/20' },
            { label: 'Critiques', value: stats.critical, color: 'text-red-400', border: 'border-red-500/20' },
            { label: 'Attention', value: stats.warning, color: 'text-orange-400', border: 'border-orange-500/20' },
            { label: 'Prédictives', value: stats.predictive, color: 'text-purple-400', border: 'border-purple-500/20' },
            { label: 'Surstock', value: stats.overstock, color: 'text-emerald-400', border: 'border-emerald-500/20' },
          ].map(stat => (
            <div key={stat.label} className={`bg-[#081225] border ${stat.border} rounded-2xl p-4 flex flex-col justify-center`}>
              <p className={`text-3xl font-black font-mono ${stat.color}`}>{loading ? '-' : stat.value}</p>
              <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* FILTERS & SEARCH */}
        <div className="bg-[#081225] border border-white/10 rounded-2xl p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Rechercher par produit ou SKU..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700/50 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
            <Filter className="w-4 h-4 text-slate-500 mr-2 flex-shrink-0" />
            {(['ALL', 'CRITICAL_STOCK', 'WARNING_STOCK', 'PREDICTIVE', 'OVERSTOCK'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${filterType === type ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800'}`}
              >
                {type === 'ALL' ? 'Toutes' : getAlertConfig(type as AlertType).label}
              </button>
            ))}
          </div>
        </div>

        {/* ALERTS TABLE */}
        <div className="bg-[#081225] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-white/5">
                  <th className="p-4 text-slate-400 text-xs uppercase font-semibold">Produit & SKU</th>
                  <th className="p-4 text-slate-400 text-xs uppercase font-semibold">Type</th>
                  <th className="p-4 text-slate-400 text-xs uppercase font-semibold text-right">Stock / Seuil</th>
                  <th className="p-4 text-slate-400 text-xs uppercase font-semibold">Message & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-500">Chargement des alertes...</td></tr>
                ) : filteredAlerts.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-emerald-500">✓ Aucune alerte trouvée</td></tr>
                ) : (
                  filteredAlerts.map(a => {
                    const cfg = getAlertConfig(a.type)
                    return (
                      <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <p className="text-white font-bold text-sm">{a.productName}</p>
                          <p className="text-slate-500 text-xs font-mono">{a.sku}</p>
                        </td>
                        <td className="p-4">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${cfg.bg} ${cfg.border}`}>
                            {cfg.icon}
                            <span className={`text-[10px] font-bold uppercase ${cfg.color}`}>{cfg.label}</span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <p className="text-white font-mono font-bold">{a.currentStock}</p>
                          <p className="text-slate-500 text-xs font-mono">Seuil: {a.threshold}</p>
                        </td>
                        <td className="p-4 max-w-[300px]">
                          <p className={`text-sm font-semibold ${cfg.color}`}>{a.message}</p>
                          <p className="text-slate-400 text-xs mt-1">{a.recommendedAction}</p>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
