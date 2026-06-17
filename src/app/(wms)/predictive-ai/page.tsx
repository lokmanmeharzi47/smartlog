'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Clock3, ShieldCheck, Gauge } from 'lucide-react'
import { usePredictiveAI } from '@/features/predictive-ai/hooks/usePredictiveAI'
import KpiCard from '@/components/ui/KpiCard'
import PredictionTable from '@/features/predictive-ai/components/PredictionTable'
import StockoutCalendar from '@/features/predictive-ai/components/StockoutCalendar'
import ConfidenceGauge from '@/features/predictive-ai/components/ConfidenceGauge'
import PredictiveCharts from '@/features/predictive-ai/components/PredictiveCharts'
import RealtimeInsights from '@/features/predictive-ai/components/RealtimeInsights'
import AdvancedAnalytics from '@/features/predictive-ai/components/AdvancedAnalytics'
import GenerateDemoData from '@/features/predictive-ai/components/GenerateDemoData'
import TopBar from '@/components/layout/TopBar'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function PredictiveAIPage() {
  const { predictions, loading, kpis } = usePredictiveAI()

  return (
    <div className="min-h-screen">
      <TopBar title="IA Prédictive" subtitle="Prévisions intelligentes et détection des ruptures" />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="px-4 md:px-8 py-5 space-y-5 max-w-[1600px] mx-auto"
      >
        <motion.div variants={fadeUp} className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <GenerateDemoData />
            <motion.div
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/10 border border-secondary/20 rounded-full"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              <span className="text-secondary text-[10px] font-bold tracking-wider uppercase">WMA Engine</span>
            </motion.div>
          </div>
        </motion.div>
        <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard label="Ruptures imminentes" value={loading ? '—' : kpis.urgent} suffix="articles" accent="red" icon={<AlertTriangle />} description="Stock < 7 jours restants" loading={loading} size="sm" />
          <KpiCard label="Prévisions cette semaine" value={loading ? '—' : kpis.thisWeek} suffix="articles" accent="orange" icon={<Clock3 />} description="7 à 14 jours restants" loading={loading} size="sm" />
          <KpiCard label="Stock sécurisé" value={loading ? '—' : kpis.ok} suffix="articles" accent="green" icon={<ShieldCheck />} description="Plus de 14 jours restants" loading={loading} size="sm" />
          <KpiCard label="Taux de confiance" value={loading ? '—' : kpis.avgConf} suffix="%" accent="cyan" icon={<Gauge />} description="Confiance algorithmique moyenne" loading={loading} size="sm" />
        </motion.div>

        <motion.div variants={fadeUp}>
          <PredictionTable predictions={predictions} loading={loading} />
        </motion.div>

        <motion.div variants={fadeUp}>
          <StockoutCalendar predictions={predictions} loading={loading} />
        </motion.div>

        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 bg-orange-400 rounded-full" />
                <h3 className="text-primary font-bold text-sm">Date de Rupture</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-sm">
                  <p className="text-slate-400 text-xs mb-2 uppercase tracking-wider">Formule</p>
                  <p className="text-primary font-bold">jours_restants = floor(stock / WMA)</p>
                  <p className="text-slate-500 mt-1">date_rupture = aujourd&apos;hui + jours_restants</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <p className="text-slate-400 text-xs mb-2 uppercase tracking-wider">Exemple — SL-006</p>
                  <div className="space-y-1 font-mono text-xs">
                    <p className="text-slate-500">Stock = <span className="text-primary font-bold">1 250</span></p>
                    <p className="text-slate-500">WMA = <span className="text-primary font-bold">95.5 u/jour</span></p>
                    <p className="text-slate-500">1 250 ÷ 95.5 = <span className="text-orange-500 font-bold">13 jours</span></p>
                    <p className="text-red-500 font-bold mt-2">→ Rupture estimée : 31 mars 2026</p>
                  </div>
                </div>
              </div>
            </div>
            <ConfidenceGauge confidence={kpis.avgConf} loading={loading} />
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <AdvancedAnalytics predictions={predictions} loading={loading} />
        </motion.div>

        <motion.div variants={fadeUp}>
          <PredictiveCharts predictions={predictions} loading={loading} />
        </motion.div>

        <motion.div variants={fadeUp}>
          <RealtimeInsights predictions={predictions} />
        </motion.div>
      </motion.div>
    </div>
  )
}
