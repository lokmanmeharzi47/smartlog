'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import TopBar from '@/components/layout/TopBar'
import { supabase } from '@/lib/supabaseClient'
import { fetchAlerts, type Alert, type AlertType } from '@/features/alerts/services/alerts.service'
import { fetchPredictions } from '@/features/predictive-ai/services/predictive.service'
import type { Prediction } from '@/features/predictive-ai/types'
import toast from 'react-hot-toast'
import { AlertTriangle, AlertCircle, Package, BrainCircuit, Search, Activity, ShieldCheck } from 'lucide-react'
import { Pagination } from '@/components/ui/Pagination'

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<AlertType | 'ALL'>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const load = useCallback(async (isRealtimeUpdate = false) => {
    try {
      const [data, preds] = await Promise.all([fetchAlerts(), fetchPredictions()])
      setAlerts(data)
      setPredictions(preds)
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

  const paginatedAlerts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAlerts.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAlerts, currentPage])

  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [search, filterType])

  const stats = useMemo(() => {
    return {
      total: alerts.length,
      critical: alerts.filter(a => a.type === 'CRITICAL_STOCK').length,
      warning: alerts.filter(a => a.type === 'WARNING_STOCK').length,
      predictive: alerts.filter(a => a.type === 'PREDICTIVE').length,
      overstock: alerts.filter(a => a.type === 'OVERSTOCK').length,
    }
  }, [alerts])

  const anomalies = useMemo(() => {
    return predictions.filter(p => p.anomalyLevel !== 'NORMAL')
      .sort((a, b) => b.zScore - a.zScore)
  }, [predictions])

  const getAlertConfig = (type: AlertType) => {
    switch (type) {
      case 'CRITICAL_STOCK': return { color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', icon: <AlertTriangle className="w-3.5 h-3.5 text-red-500" />, label: 'Critique' }
      case 'WARNING_STOCK': return { color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', icon: <AlertCircle className="w-3.5 h-3.5 text-orange-500" />, label: 'Attention' }
      case 'PREDICTIVE': return { color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200', icon: <BrainCircuit className="w-3.5 h-3.5 text-purple-500" />, label: 'Prédictif' }
      case 'OVERSTOCK': return { color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: <Package className="w-3.5 h-3.5 text-emerald-500" />, label: 'Surstock' }
    }
  }

  return (
    <div className="min-h-screen">
      <TopBar title="Alertes & Notifications" subtitle="Centre de contrôle des anomalies et ruptures" />

      <main className="px-4 md:px-8 py-5 space-y-4 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: 'Total Alertes', value: stats.total, color: 'text-secondary' },
            { label: 'Critiques', value: stats.critical, color: 'text-red-500' },
            { label: 'Attention', value: stats.warning, color: 'text-orange-500' },
            { label: 'Prédictives', value: stats.predictive, color: 'text-purple-500' },
            { label: 'Surstock', value: stats.overstock, color: 'text-emerald-500' },
          ].map(stat => (
            <div key={stat.label} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4">
              <p className={`text-2xl font-bold font-mono ${stat.color}`}>{loading ? '-' : stat.value}</p>
              <p className="text-slate-400 text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-3 flex flex-col lg:flex-row items-center justify-between gap-3">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par produit ou SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-colors"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
            {(['ALL', 'CRITICAL_STOCK', 'WARNING_STOCK', 'PREDICTIVE', 'OVERSTOCK'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-colors ${filterType === type ? 'bg-secondary text-white border border-secondary shadow-sm' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
              >
                {type === 'ALL' ? 'Toutes' : getAlertConfig(type as AlertType).label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-3 text-slate-400 text-[10px] uppercase font-bold tracking-wider">Produit & SKU</th>
                  <th className="p-3 text-slate-400 text-[10px] uppercase font-bold tracking-wider">Type</th>
                  <th className="p-3 text-slate-400 text-[10px] uppercase font-bold tracking-wider text-right">Stock / Seuil</th>
                  <th className="p-3 text-slate-400 text-[10px] uppercase font-bold tracking-wider">Message & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={4} className="p-6 text-center text-slate-400 text-sm">Chargement des alertes...</td></tr>
                ) : filteredAlerts.length === 0 ? (
                  <tr><td colSpan={4} className="p-6 text-center text-emerald-500 font-medium text-sm">✓ Aucune alerte trouvée</td></tr>
                ) : (
                  paginatedAlerts.map(a => {
                    const cfg = getAlertConfig(a.type)
                    return (
                      <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <p className="text-primary font-semibold text-sm">{a.productName}</p>
                          <p className="text-slate-400 text-[10px] font-mono">{a.sku}</p>
                        </td>
                        <td className="p-3">
                          <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border ${cfg.bg} ${cfg.border}`}>
                            {cfg.icon}
                            <span className={`text-[10px] font-bold uppercase ${cfg.color}`}>{cfg.label}</span>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <p className="text-primary font-mono font-bold">{a.currentStock}</p>
                          <p className="text-slate-400 text-[10px] font-mono">Seuil: {a.threshold}</p>
                        </td>
                        <td className="p-3 max-w-[280px]">
                          <p className={`text-xs font-semibold ${cfg.color}`}>{a.message}</p>
                          <p className="text-slate-400 text-[10px] mt-0.5">{a.recommendedAction}</p>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
          {!loading && filteredAlerts.length > 0 && (
            <div className="border-t border-slate-100 px-3 py-2">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
              <Activity className="w-4 h-4 text-purple-500" />
            </div>
            <div>
              <h2 className="text-primary font-bold text-sm">Détection d'Anomalies (Z-Score)</h2>
              <p className="text-slate-400 text-[10px]">Détection des pics de consommation</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-6 text-slate-400 text-sm">Chargement...</div>
          ) : anomalies.length === 0 ? (
            <div className="text-center py-6">
              <ShieldCheck className="w-8 h-8 text-emerald-400/50 mx-auto mb-1" />
              <p className="text-emerald-500 text-sm font-bold">Aucune anomalie détectée</p>
              <p className="text-slate-400 text-xs">La consommation est stable.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
              {anomalies.map(a => (
                <div key={a.productId} className={`p-3 rounded-xl border flex items-center justify-between ${a.anomalyLevel === 'CRITICAL' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'}`}>
                  <div>
                    <h3 className="text-primary font-semibold text-sm">{a.productName}</h3>
                    <p className="text-slate-400 text-[10px] font-mono mt-0.5">{a.barcode}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-bold uppercase ${a.anomalyLevel === 'CRITICAL' ? 'text-red-500' : 'text-orange-500'}`}>
                      {a.anomalyLevel === 'CRITICAL' ? 'Critique' : 'Modéré'}
                    </p>
                    <p className="text-slate-400 text-[10px] font-mono mt-0.5">Z={a.zScore.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
