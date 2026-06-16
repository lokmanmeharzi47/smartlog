'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useAdvancedMetrics } from '../hooks/useAdvancedMetrics'
import KpiCard from '@/components/ui/KpiCard'
import {
  RefreshCcw,
  Wallet,
  ClipboardList,
  Target,
  Factory,
  Package,
  ShoppingCart,
  BarChart4
} from 'lucide-react'
import { formatCurrencyDZD, formatPercentage } from '../utils'

export function AdvancedMetricsGrid() {
  const { metrics, loading } = useAdvancedMetrics()

  // Dynamic color for health score
  let healthColor: 'cyan' | 'emerald' | 'orange' | 'red' | 'blue' | 'violet' = 'emerald'
  let healthLabel = 'OK'
  if (metrics) {
    if (metrics.stockHealthScore < 60) {
      healthColor = 'red'
      healthLabel = 'CRITIQUE'
    } else if (metrics.stockHealthScore <= 80) {
      healthColor = 'orange'
      healthLabel = 'WARNING'
    }
  }

  return (
    <section className="space-y-6">
      {/* Title Section */}
      <div className="flex items-center gap-3 mt-8">
        <div className="w-1 h-6 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
        <h2 className="text-slate-400 font-semibold uppercase tracking-[0.3em] text-sm">
          Indicateurs avancés — calculés en temps réel
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard
          label="Taux de rotation"
          value={loading ? '—' : `${metrics?.rotationRate}x`}
          subLabel="sorties (30j)"
          icon={<RefreshCcw size={18} />}
          accent="cyan"
          loading={loading}
          pulse
        />
        <KpiCard
          label="Valeur totale stock"
          value={loading ? '—' : `${formatCurrencyDZD(metrics?.stockValue || 0)}`}
          subLabel="DZD estimé"
          icon={<Wallet size={18} />}
          accent="emerald"
          loading={loading}
          pulse
        />
        <KpiCard
          label="Mouvements aujourd'hui"
          value={loading ? '—' : (metrics?.todayMovements ?? 0)}
          subLabel={
            (metrics?.todayMovements ?? 0) === 0 ? 'aucun mouvement' : 'scans enregistrés'
          }
          icon={<ClipboardList size={18} />}
          accent="amber"
          loading={loading}
          pulse
        />
        <KpiCard
          label="Précision RFID"
          value={loading ? '—' : formatPercentage(metrics?.rfidAccuracy || 0)}
          subLabel="taux de lecture"
          icon={<Target size={18} />}
          accent="emerald"
          loading={loading}
          pulse
        />
        <KpiCard
          label="Coût de stockage"
          value={loading ? '—' : `${formatCurrencyDZD(metrics?.storageCost || 0)}`}
          subLabel="DZD / mois estimé"
          icon={<Factory size={18} />}
          accent="rose"
          loading={loading}
          pulse
        />
        <KpiCard
          label="Articles en surstock"
          value={loading ? '—' : (metrics?.overstockItems ?? 0)}
          subLabel={`${metrics?.overstockItems ?? 0} article(s) au-dessus stock max`}
          icon={<Package size={18} />}
          accent="cyan"
          loading={loading}
          pulse
        />
        <KpiCard
          label="Commandes en attente"
          value={loading ? '—' : (metrics?.pendingOrders ?? 0)}
          subLabel={`${metrics?.pendingOrders ?? 0} en attente`}
          icon={<ShoppingCart size={18} />}
          accent="amber"
          loading={loading}
          pulse
        />
        <KpiCard
          label="Score santé stock"
          value={loading ? '—' : `${metrics?.stockHealthScore}/100`}
          subLabel={healthLabel}
          icon={<BarChart4 size={18} />}
          accent={healthColor}
          loading={loading}
          pulse
        />
      </div>
    </section>
  )
}
