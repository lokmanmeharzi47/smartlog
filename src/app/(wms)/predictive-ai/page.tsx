'use client'

import { motion } from 'framer-motion'
import { BrainCircuit, AlertTriangle, Clock3, ShieldCheck, Gauge } from 'lucide-react'
import { usePredictiveAI } from '@/features/predictive-ai/hooks/usePredictiveAI'
import KpiCard from '@/components/ui/KpiCard'
import PredictionTable from '@/features/predictive-ai/components/PredictionTable'
import StockoutCalendar from '@/features/predictive-ai/components/StockoutCalendar'
import ConfidenceGauge from '@/features/predictive-ai/components/ConfidenceGauge'
import PredictiveCharts from '@/features/predictive-ai/components/PredictiveCharts'
import RealtimeInsights from '@/features/predictive-ai/components/RealtimeInsights'
import AdvancedAnalytics from '@/features/predictive-ai/components/AdvancedAnalytics'
import GenerateDemoData from '@/features/predictive-ai/components/GenerateDemoData'
import PDFExportButton from '@/features/pdf-export/components/PDFExportButton'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function PredictiveAIPage() {
  const { predictions, loading, kpis } = usePredictiveAI()

  return (
    <div className="min-h-screen" style={{ background: '#020617' }}>
      {/* ══ PAGE HEADER ══════════════════════════════════════════ */}
      <div className="relative px-8 pt-8 pb-6 border-b border-white/5 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
              <BrainCircuit className="w-7 h-7 text-cyan-300" />
            </div>
            <div>
              <h1 className="text-white font-black text-2xl tracking-tight">Predictive AI</h1>
              <p className="text-slate-400 text-sm mt-0.5">
                Prévisions intelligentes et détection des ruptures en temps réel
              </p>
            </div>
          </div>

          {/* WMA Engine badge + Export */}
          <div className="flex items-center gap-3">
            <GenerateDemoData />
            <motion.div
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/25 rounded-full backdrop-blur-sm"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-300 text-xs font-bold tracking-wider uppercase">WMA Engine Active</span>
            </motion.div>
            <PDFExportButton />
          </div>
        </div>
      </div>

      {/* ══ CONTENT ══════════════════════════════════════════════ */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="px-8 py-6 space-y-6 max-w-[1600px] mx-auto"
      >
        {/* ── KPI CARDS ──────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Ruptures imminentes"
            value={loading ? '—' : kpis.urgent}
            suffix="articles"
            accent="red"
            icon={<AlertTriangle className="w-5 h-5" />}
            description="Stock < 7 jours restants"
            loading={loading}
          />
          <KpiCard
            label="Prévisions cette semaine"
            value={loading ? '—' : kpis.thisWeek}
            suffix="articles"
            accent="orange"
            icon={<Clock3 className="w-5 h-5" />}
            description="7 à 14 jours restants"
            loading={loading}
          />
          <KpiCard
            label="Stock sécurisé"
            value={loading ? '—' : kpis.ok}
            suffix="articles"
            accent="green"
            icon={<ShieldCheck className="w-5 h-5" />}
            description="Plus de 14 jours restants"
            loading={loading}
          />
          <KpiCard
            label="Taux de confiance"
            value={loading ? '—' : kpis.avgConf}
            suffix="%"
            accent="cyan"
            icon={<Gauge className="w-5 h-5" />}
            description="Confiance algorithmique moyenne"
            loading={loading}
          />
        </motion.div>

        {/* ── PREDICTION TABLE ───────────────────────────────────── */}
        <motion.div variants={fadeUp}>
          <PredictionTable predictions={predictions} loading={loading} />
        </motion.div>

        {/* ── STOCKOUT CALENDAR ──────────────────────────────────── */}
        <motion.div variants={fadeUp}>
          <StockoutCalendar predictions={predictions} loading={loading} />
        </motion.div>

        {/* ── DATE DE RUPTURE FORMULA ────────────────────────────── */}
        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-[#081225] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-orange-400 rounded-full" />
                <h3 className="text-white font-bold text-sm">6.2 Date de Rupture</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-slate-900/60 border border-slate-700/30 rounded-xl p-4 font-mono text-sm">
                  <p className="text-slate-400 text-xs mb-2 uppercase tracking-wider">Formule</p>
                  <p className="text-cyan-300 font-bold">jours_restants = floor(stock / WMA)</p>
                  <p className="text-slate-300 mt-1">date_rupture = <span className="text-orange-300">aujourd&apos;hui + jours_restants</span></p>
                </div>
                <div className="bg-orange-500/8 border border-orange-500/20 rounded-xl p-4">
                  <p className="text-slate-400 text-xs mb-2 uppercase tracking-wider">Exemple — SL-006</p>
                  <div className="space-y-1 font-mono text-xs">
                    <p className="text-slate-300">Stock = <span className="text-white font-bold">1 250</span></p>
                    <p className="text-slate-300">WMA = <span className="text-cyan-300 font-bold">95.5 u/jour</span></p>
                    <p className="text-slate-300">1 250 ÷ 95.5 = <span className="text-orange-300 font-bold">13 jours</span></p>
                    <p className="text-red-400 font-bold mt-2">→ Rupture estimée : 31 mars 2026</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── CONFIDENCE GAUGE ─────────────────────────────────── */}
            <ConfidenceGauge confidence={kpis.avgConf} loading={loading} />
          </div>
        </motion.div>

        {/* ── ADVANCED AI ANALYTICS ──────────────────────────────── */}
        <motion.div variants={fadeUp}>
          <AdvancedAnalytics predictions={predictions} loading={loading} />
        </motion.div>

        {/* ── CHARTS ─────────────────────────────────────────────── */}
        <motion.div variants={fadeUp}>
          <PredictiveCharts predictions={predictions} loading={loading} />
        </motion.div>

        {/* ── REALTIME INSIGHTS ──────────────────────────────────── */}
        <motion.div variants={fadeUp}>
          <RealtimeInsights predictions={predictions} />
        </motion.div>
      </motion.div>
    </div>
  )
}
