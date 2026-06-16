'use client'

import { useState, useCallback } from 'react'
import { motion, type Variants } from 'framer-motion'
import { BrainCircuit, ExternalLink } from 'lucide-react'
import type { Prediction } from '../types'
import { deriveUrgent, deriveOrders, deriveOptim, deriveForecast, deriveModalRows } from '../utils/recommendation-data'
import SmartAlertsPanel from './SmartAlertsPanel'
import UrgentActionsCard from './UrgentActionsCard'
import OrdersCard from './OrdersCard'
import OptimCard from './OptimCard'
import ForecastCard from './ForecastCard'
import RecommendationsModal from './RecommendationsModal'
import SkeletonCard from './SkeletonCard'
import GeminiModal from './GeminiModal'

interface Props {
  predictions: Prediction[]
  loading: boolean
}

const staggerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

export default function RecommendationCards({ predictions, loading }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [geminiContext, setGeminiContext] = useState<any | null>(null)

  const urgent = deriveUrgent(predictions)
  const orders = deriveOrders(predictions)
  const optim = deriveOptim(predictions)
  const forecast = deriveForecast(predictions)
  const modalRows = deriveModalRows(predictions)

  const closeModal = useCallback(() => setModalOpen(false), [])

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4 order-last xl:order-first">
          <SmartAlertsPanel predictions={predictions} loading={loading} />
        </div>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="xl:col-span-8 flex flex-col h-full bg-white rounded-3xl shadow-sm border border-slate-200 p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-8 h-8 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                  <BrainCircuit className="w-4 h-4 text-secondary" />
                </div>
                <h2 className="text-primary font-bold text-lg tracking-tight">
                  Recommandations Stratégiques
                </h2>
                <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-600 text-[10px] font-semibold uppercase tracking-wider">Live</span>
                </div>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed max-w-xl">
                Recommandations intelligentes générées à partir des prévisions de consommation, niveaux de stock, mouvements récents et risques de rupture (WMA, EOQ, ABC).
              </p>
            </div>

            {!loading && predictions.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setModalOpen(true)}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-primary/30 text-primary rounded-xl text-xs font-semibold transition-all shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Toutes les recommandations
              </motion.button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : predictions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 border border-slate-200 rounded-2xl bg-white">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                <BrainCircuit className="w-7 h-7 text-secondary/50" />
              </div>
              <div className="text-center">
                <p className="text-slate-600 font-semibold">Aucune donnée disponible</p>
                <p className="text-slate-400 text-xs mt-1">Chargez les produits et mouvements pour activer l'IA</p>
              </div>
            </div>
          ) : (
            <motion.div
              variants={staggerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <motion.div variants={fadeUpVariants}>
                <UrgentActionsCard items={urgent} onGeminiClick={setGeminiContext} />
              </motion.div>
              <motion.div variants={fadeUpVariants}>
                <OrdersCard items={orders} onGeminiClick={setGeminiContext} />
              </motion.div>
              <motion.div variants={fadeUpVariants}>
                <OptimCard items={optim} onGeminiClick={setGeminiContext} />
              </motion.div>
              <motion.div variants={fadeUpVariants}>
                <ForecastCard items={forecast} onGeminiClick={setGeminiContext} />
              </motion.div>
            </motion.div>
          )}

          {!loading && predictions.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-[10px] font-mono border-t border-slate-100 pt-4"
            >
              <BrainCircuit className="w-3 h-3" />
              <span>WMA Engine · EOQ Wilson · ABC Pareto · Z-Score Anomaly Detection · Safety Stock</span>
            </motion.div>
          )}
        </motion.section>
      </div>

      {modalOpen && (
        <RecommendationsModal rows={modalRows} onClose={closeModal} onGeminiClick={setGeminiContext} />
      )}

      {geminiContext && (
        <GeminiModal context={geminiContext} onClose={() => setGeminiContext(null)} />
      )}
    </>
  )
}
