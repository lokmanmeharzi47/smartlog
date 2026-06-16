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
import { formatCurrencyDZD } from '../utils'

export function AdvancedMetricsGrid() {
  const { metrics, loading } = useAdvancedMetrics()

  let healthColor: 'cyan' | 'emerald' | 'orange' | 'red' | 'blue' | 'violet' | 'default' = 'emerald'
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
    <section>
      <div className="flex items-center gap-2 mt-6 mb-3">
        <div className="w-1 h-4 bg-secondary rounded-full" />
        <h2 className="text-slate-400 font-semibold uppercase tracking-[0.15em] text-[11px]">
          Indicateurs avancés
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard
          label="Taux de rotation"
          value={loading ? '—' : `${metrics?.rotationRate}x`}
          subLabel="sorties (30j)"
          icon={<RefreshCcw size={16} />}
          accent="cyan"
          loading={loading}
          pulse
          size="sm"
        />
        <KpiCard
          label="Valeur totale stock"
          value={loading ? '—' : `${formatCurrencyDZD(metrics?.stockValue || 0)}`}
          subLabel="DZD estimé"
          icon={<Wallet size={16} />}
          accent="emerald"
          loading={loading}
          pulse
          size="sm"
        />
        <KpiCard
          label="Mouvements aujourd'hui"
          value={loading ? '—' : (metrics?.todayMovements ?? 0)}
          subLabel={metrics?.todayMovements === 0 ? 'aucun mouvement' : 'scans enregistrés'}
          icon={<ClipboardList size={16} />}
          accent="amber"
          loading={loading}
          pulse
          size="sm"
        />
        <KpiCard
          label="Précision RFID"
          value={loading ? '—' : `${metrics?.rfidAccuracy ?? 0}%`}
          subLabel="taux de lecture"
          icon={<Target size={16} />}
          accent="emerald"
          loading={loading}
          pulse
          size="sm"
        />
        <KpiCard
          label="Coût de stockage"
          value={loading ? '—' : `${formatCurrencyDZD(metrics?.storageCost || 0)}`}
          subLabel="DZD / mois estimé"
          icon={<Factory size={16} />}
          accent="rose"
          loading={loading}
          pulse
          size="sm"
        />
        <KpiCard
          label="Articles en surstock"
          value={loading ? '—' : (metrics?.overstockItems ?? 0)}
          subLabel={`${metrics?.overstockItems ?? 0} article(s) au-dessus max`}
          icon={<Package size={16} />}
          accent="cyan"
          loading={loading}
          pulse
          size="sm"
        />
        <KpiCard
          label="Commandes en attente"
          value={loading ? '—' : (metrics?.pendingOrders ?? 0)}
          subLabel={`${metrics?.pendingOrders ?? 0} en attente`}
          icon={<ShoppingCart size={16} />}
          accent="amber"
          loading={loading}
          pulse
          size="sm"
        />
        <KpiCard
          label="Score santé stock"
          value={loading ? '—' : `${metrics?.stockHealthScore}/100`}
          subLabel={healthLabel}
          icon={<BarChart4 size={16} />}
          accent={healthColor}
          loading={loading}
          pulse
          size="sm"
        />
      </div>
    </section>
  )
}
