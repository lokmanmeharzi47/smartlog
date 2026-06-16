'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import {
  BrainCircuit,
  AlertTriangle,
  ShoppingCart,
  BarChart3,
  TrendingUp,
  X,
  ExternalLink,
  ChevronRight,
  Zap,
  Package,
  ArrowDown,
  Sparkles,
  Info,
  RefreshCw,
} from 'lucide-react'
import type { Prediction } from '../types'
import { Pagination } from '@/components/ui/Pagination'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  predictions: Prediction[]
  loading: boolean
}

interface UrgentItem {
  productId: string
  productName: string
  stock: number
  minStock: number
  daysRemaining: number
  recommendedQty: number
  abcClass: 'A' | 'B' | 'C'
}

interface OrderItem {
  productId: string
  productName: string
  stock: number
  forecast7d: number
  eoq: number
  abcClass: 'A' | 'B' | 'C'
}

interface OptimItem {
  productId: string
  productName: string
  issue: 'OVERSTOCK' | 'LOW_ROTATION' | 'ANOMALY'
  detail: string
  recommendation: string
  surplusPct?: number
}

interface ForecastItem {
  productId: string
  productName: string
  forecast7d: number
  confidence: number
  wma: number
  abcClass: 'A' | 'B' | 'C'
}

interface ModalRow {
  productId: string
  productName: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  risk: string
  days: number | null
  recommendation: string
  abcClass: 'A' | 'B' | 'C'
}

// ─────────────────────────────────────────────────────────────────────────────
// Derive card data from predictions (pure computation)
// ─────────────────────────────────────────────────────────────────────────────

function deriveUrgent(predictions: Prediction[]): UrgentItem[] {
  return predictions
    .filter(p => p.status === 'URGENT')
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 5)
    .map(p => ({
      productId: p.productId,
      productName: p.productName,
      stock: p.stock,
      minStock: p.minStock,
      daysRemaining: p.daysRemaining,
      recommendedQty: p.eoq > 0 ? p.eoq : Math.max(p.minStock * 2 - p.stock, 10),
      abcClass: p.abcClass,
    }))
}

function deriveOrders(predictions: Prediction[]): OrderItem[] {
  return predictions
    .filter(p => p.status !== 'OK' && p.eoq > 0)
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 5)
    .map(p => ({
      productId: p.productId,
      productName: p.productName,
      stock: p.stock,
      forecast7d: p.forecast7d,
      eoq: p.eoq,
      abcClass: p.abcClass,
    }))
}

function deriveOptim(predictions: Prediction[]): OptimItem[] {
  const items: OptimItem[] = []
  for (const p of predictions) {
    if (p.stock > p.minStock * 3) {
      const surplusPct = Math.round(((p.stock - p.minStock * 3) / (p.minStock * 3)) * 100)
      items.push({
        productId: p.productId,
        productName: p.productName,
        issue: 'OVERSTOCK',
        detail: `Surstock +${surplusPct}%`,
        recommendation: 'Suspendre les commandes',
        surplusPct,
      })
    } else if (p.wma <= 0.1 && p.stock > p.minStock) {
      items.push({
        productId: p.productId,
        productName: p.productName,
        issue: 'LOW_ROTATION',
        detail: 'Rotation très faible',
        recommendation: 'Réduire le réapprovisionnement',
      })
    } else if (p.anomalyLevel === 'CRITICAL') {
      items.push({
        productId: p.productId,
        productName: p.productName,
        issue: 'ANOMALY',
        detail: `Anomalie détectée (Z=${p.zScore})`,
        recommendation: 'Vérifier les mouvements récents',
      })
    }
    if (items.length >= 5) break
  }
  return items
}

function deriveForecast(predictions: Prediction[]): ForecastItem[] {
  return predictions
    .filter(p => p.forecast7d > 0)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5)
    .map(p => ({
      productId: p.productId,
      productName: p.productName,
      forecast7d: p.forecast7d,
      confidence: p.confidence,
      wma: p.wma,
      abcClass: p.abcClass,
    }))
}

function deriveModalRows(predictions: Prediction[]): ModalRow[] {
  return [...predictions]
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .map(p => {
      let priority: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW'
      let risk = 'Stock OK'
      let recommendation = 'Maintenir le niveau de stock'

      if (p.status === 'URGENT') {
        priority = 'HIGH'
        risk = 'Rupture imminente'
        recommendation = `Commander ${p.eoq > 0 ? p.eoq : p.minStock * 2} unités`
      } else if (p.status === 'THIS_WEEK') {
        priority = 'MEDIUM'
        risk = 'Stock faible'
        recommendation = `Planifier commande (EOQ: ${p.eoq})`
      } else if (p.stock > p.minStock * 3) {
        priority = 'LOW'
        risk = 'Surstock'
        recommendation = 'Suspendre les commandes'
      } else if (p.anomalyLevel !== 'NORMAL') {
        priority = 'MEDIUM'
        risk = `Anomalie (Z=${p.zScore})`
        recommendation = 'Investiguer les mouvements'
      }

      return {
        productId: p.productId,
        productName: p.productName,
        priority,
        risk,
        days: p.daysRemaining >= 999 ? null : p.daysRemaining,
        recommendation,
        abcClass: p.abcClass,
      }
    })
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function ABCBadge({ cls }: { cls: 'A' | 'B' | 'C' }) {
  const colors = {
    A: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    B: 'bg-amber-50 text-amber-700 border-amber-200',
    C: 'bg-slate-100 text-slate-500 border-slate-200',
  }
  return (
    <span className={`text-[9px] font-bold border rounded px-1.5 py-0.5 leading-none ${colors[cls]}`}>
      {cls}
    </span>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-slate-100" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-slate-100 rounded w-40" />
          <div className="h-2.5 bg-slate-100 rounded w-24" />
        </div>
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="mb-3 space-y-1.5">
          <div className="h-3 bg-slate-100 rounded w-full" />
          <div className="h-2 bg-slate-100 rounded w-3/4" />
        </div>
      ))}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-2">
      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
        <Sparkles className="w-5 h-5 text-slate-600" />
      </div>
      <p className="text-slate-600 text-xs text-center font-medium">{message}</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Card 1 — Actions Urgentes
// ─────────────────────────────────────────────────────────────────────────────

function UrgentActionsCard({ items, onGeminiClick }: { items: UrgentItem[], onGeminiClick: (ctx: any) => void }) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.005 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative rounded-2xl overflow-hidden border border-red-100 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Glow accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-400 to-rose-500" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-sm leading-tight">Actions Urgentes</h3>
              <p className="text-slate-500 text-[10px] font-mono mt-0.5">Ruptures imminentes · &lt; 7j</p>
            </div>
          </div>
          <span className="flex items-center gap-1 bg-red-50 border border-red-200 text-red-600 text-[10px] font-black px-2 py-1 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {items.length}
          </span>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <EmptyState message="Aucune rupture imminente détectée" />
        ) : (
          <div className="space-y-2.5">
            {items.map((item, i) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative bg-red-50/50 hover:bg-red-50 border border-red-100 hover:border-red-200 rounded-xl p-3 transition-all cursor-pointer"
                onClick={() => onGeminiClick({ ...item, type: 'URGENT' })}
              >
                {/* AI badge */}
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-violet-50 rounded-full border border-violet-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-3 h-3 text-violet-500" />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[8px] text-slate-400 font-mono">{i + 1}.</span>
                      <p className="text-slate-900 text-xs font-semibold truncate">{item.productName}</p>
                      <ABCBadge cls={item.abcClass} />
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-mono">
                      <span className="text-slate-500">Stock: <span className="text-red-600 font-bold">{item.stock}</span></span>
                      <span className="text-slate-300">|</span>
                      <span className="text-slate-500">Seuil: <span className="text-slate-600">{item.minStock}</span></span>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-1.5 w-full bg-slate-200 rounded-full h-1">
                      <div
                        className="h-1 rounded-full bg-gradient-to-r from-red-500 to-red-400 transition-all"
                        style={{ width: `${Math.min((item.stock / Math.max(item.minStock, 1)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-red-400 font-black text-sm font-mono leading-tight">
                      {item.daysRemaining}j
                    </div>
                    <div className="text-red-400/50 text-[9px]">restants</div>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-red-400 flex-shrink-0" />
                  <span className="text-red-300 text-[10px] font-semibold">
                    Commander {item.recommendedQty} unités
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Card 2 — Commandes Recommandées
// ─────────────────────────────────────────────────────────────────────────────

function OrdersCard({ items, onGeminiClick }: { items: OrderItem[], onGeminiClick: (ctx: any) => void }) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.005 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative rounded-2xl overflow-hidden border border-orange-200 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 via-amber-400 to-yellow-500" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-sm leading-tight">Commandes Recommandées</h3>
              <p className="text-slate-500 text-[10px] font-mono mt-0.5">EOQ — Formule de Wilson</p>
            </div>
          </div>
          <span className="flex items-center gap-1 bg-orange-50 border border-orange-200 text-orange-600 text-[10px] font-black px-2 py-1 rounded-full">
            <Package className="w-3 h-3" />
            {items.length}
          </span>
        </div>

        {items.length === 0 ? (
          <EmptyState message="Aucune commande recommandée" />
        ) : (
          <div className="space-y-2.5">
            {items.map((item, i) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative bg-orange-50/50 hover:bg-orange-50 border border-orange-100 hover:border-orange-200 rounded-xl p-3 transition-all cursor-pointer"
                onClick={() => onGeminiClick({ ...item, type: 'ORDER' })}
              >
                {/* AI badge */}
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-violet-50 rounded-full border border-violet-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-3 h-3 text-violet-500" />
                </div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <p className="text-white text-xs font-semibold truncate">{item.productName}</p>
                    <ABCBadge cls={item.abcClass} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                  <div className="bg-black/20 rounded-lg p-1.5 text-center">
                    <div className="text-slate-400 text-[8px] uppercase mb-0.5">Stock</div>
                    <div className="text-orange-300 font-bold">{item.stock}</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-1.5 text-center">
                    <div className="text-slate-400 text-[8px] uppercase mb-0.5">Prévu 7j</div>
                    <div className="text-slate-300 font-bold">{item.forecast7d}</div>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-1.5 text-center">
                    <div className="text-orange-400/70 text-[8px] uppercase mb-0.5">EOQ</div>
                    <div className="text-orange-300 font-bold">{item.eoq}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Card 3 — Optimisation du Stock
// ─────────────────────────────────────────────────────────────────────────────

function OptimCard({ items, onGeminiClick }: { items: OptimItem[], onGeminiClick: (ctx: any) => void }) {
  const issueConfig = {
    OVERSTOCK: {
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: <ArrowDown className="w-3 h-3" />,
      label: 'Overstock',
    },
    LOW_ROTATION: {
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      icon: <RefreshCw className="w-3 h-3" />,
      label: 'Low Rotation',
    },
    ANOMALY: {
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      border: 'border-violet-200',
      icon: <Info className="w-3 h-3" />,
      label: 'Anomaly',
    },
  }

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.005 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative rounded-2xl overflow-hidden border border-blue-200 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-500" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-primary font-bold text-sm leading-tight">Optimisation du Stock</h3>
              <p className="text-slate-500 text-[10px] font-mono mt-0.5">Surstock · Rotation faible</p>
            </div>
          </div>
          <span className="flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-black px-2 py-1 rounded-full">
            <BarChart3 className="w-3 h-3" />
            {items.length}
          </span>
        </div>

        {items.length === 0 ? (
          <EmptyState message="Stock bien optimisé — aucun problème détecté" />
        ) : (
          <div className="space-y-2.5">
            {items.map((item, i) => {
              const cfg = issueConfig[item.issue]
              return (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`group relative ${cfg.bg} border ${cfg.border} hover:bg-opacity-50 rounded-xl p-3 transition-all cursor-pointer`}
                  onClick={() => onGeminiClick({ ...item, type: 'OPTIMIZATION' })}
                >
                  {/* AI badge */}
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-violet-50 rounded-full border border-violet-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="w-3 h-3 text-violet-500" />
                  </div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-primary text-xs font-semibold truncate">{item.productName}</p>
                    <span className={`flex items-center gap-1 text-[9px] font-bold ${cfg.color.replace('300','600')} bg-white/50 rounded-full px-2 py-0.5`}>
                      {cfg.icon}{cfg.label}
                    </span>
                  </div>
                  <p className={`text-[10px] font-mono ${cfg.color.replace('300','600')} opacity-80`}>{item.detail}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-blue-500 flex-shrink-0" />
                    <span className="text-slate-600 text-[10px]">{item.recommendation}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Card 4 — Prévisions 7 Jours
// ─────────────────────────────────────────────────────────────────────────────

function ForecastCard({ items, onGeminiClick }: { items: ForecastItem[], onGeminiClick: (ctx: any) => void }) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.005 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative rounded-2xl overflow-hidden border border-emerald-200 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 via-green-400 to-teal-500" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-primary font-bold text-sm leading-tight">Prévisions 7 Jours</h3>
              <p className="text-slate-500 text-[10px] font-mono mt-0.5">WMA · Demande prévue</p>
            </div>
          </div>
          <span className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-black px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            {items.length}
          </span>
        </div>

        {items.length === 0 ? (
          <EmptyState message="Aucune prévision disponible" />
        ) : (
          <div className="space-y-2.5">
            {items.map((item, i) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100 hover:border-emerald-200 rounded-xl p-3 transition-all cursor-pointer"
                onClick={() => onGeminiClick({ ...item, type: 'FORECAST' })}
              >
                {/* AI badge */}
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-violet-50 rounded-full border border-violet-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-3 h-3 text-violet-500" />
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <p className="text-primary text-xs font-semibold truncate">{item.productName}</p>
                    <ABCBadge cls={item.abcClass} />
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-emerald-600 font-black text-sm font-mono">{item.forecast7d}</span>
                    <span className="text-emerald-500 text-[9px] ml-0.5">u</span>
                  </div>
                </div>
                {/* Confidence bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.confidence}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                      className="h-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-400"
                    />
                  </div>
                  <span className="text-emerald-600 text-[10px] font-mono font-bold w-8 text-right">
                    {item.confidence}%
                  </span>
                </div>
                <div className="mt-1 text-slate-500 text-[9px] font-mono">
                  WMA: {item.wma} u/j
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal — Toutes les recommandations
// ─────────────────────────────────────────────────────────────────────────────

function RecommendationsModal({ rows, onClose, onGeminiClick }: { rows: ModalRow[]; onClose: () => void; onGeminiClick: (ctx: any) => void }) {
  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  const paginatedRows = rows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(rows.length / itemsPerPage)

  const priorityConfig = {
    HIGH: { label: 'High', dot: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-50 border-red-200' },
    MEDIUM: { label: 'Medium', dot: 'bg-orange-500', text: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
    LOW: { label: 'Low', dot: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-5xl max-h-[85vh] bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-slate-900/15"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h2 className="text-primary font-bold text-base">All AI Recommendations</h2>
                <p className="text-slate-400 text-xs">{rows.length} products analyzed &middot; Sorted by criticality</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Table */}
          <div className="overflow-y-auto overflow-x-auto flex-1 overscroll-contain">
            <table className="w-full text-xs min-w-[800px]">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
                <tr>
                  {['Priority', 'Product', 'Class', 'Risk', 'Days', 'Recommendation'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedRows.map((row, i) => {
                  const cfg = priorityConfig[row.priority]
                  return (
                    <motion.tr
                      key={row.productId}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.02, 0.3) }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {/* Priority */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 border rounded-full px-2 py-0.5 text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </td>
                      {/* Product */}
                      <td className="px-4 py-3">
                        <p className="text-slate-800 font-semibold">{row.productName}</p>
                      </td>
                      {/* ABC Class */}
                      <td className="px-4 py-3">
                        <ABCBadge cls={row.abcClass} />
                      </td>
                      {/* Risk */}
                      <td className="px-4 py-3">
                        <span className={`font-mono font-semibold text-xs ${cfg.text}`}>{row.risk}</span>
                      </td>
                      {/* Days */}
                      <td className="px-4 py-3">
                        <span className={`font-mono font-bold ${row.days !== null && row.days < 7 ? 'text-red-500' : row.days !== null && row.days < 14 ? 'text-orange-500' : 'text-slate-400'}`}>
                          {row.days !== null ? `${row.days}d` : '∞'}
                        </span>
                      </td>
                      {/* Recommendation */}
                      <td className="px-4 py-3 text-slate-600">
                        <div className="flex items-center justify-between gap-3">
                          <span>{row.recommendation}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onGeminiClick({ ...row, type: 'MODAL_ROW' });
                            }}
                            className="w-6 h-6 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/20 flex items-center justify-center transition-all flex-shrink-0"
                            title="Ask AI"
                          >
                            <Sparkles className="w-3 h-3 text-primary" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between flex-shrink-0">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center justify-between">
                <p className="text-slate-400 text-[10px] font-mono">
                  WMA Engine · EOQ Wilson · ABC Classification · Z-Score · Safety Stock
                </p>
                <button
                  onClick={onClose}
                  className="text-xs text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 rounded-lg px-4 py-1.5 transition-all bg-white"
                >
                  Close
                </button>
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Animation variants (module-level to avoid recreation on render)
// ─────────────────────────────────────────────────────────────────────────────

const staggerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component — Centre de Décision IA
// ─────────────────────────────────────────────────────────────────────────────

import GeminiModal from './GeminiModal'

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
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* ── Section Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-8 h-8 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-secondary" />
              </div>
              <h2 className="text-primary font-bold text-lg tracking-tight">
                AI Decision Center
              </h2>
              {/* Live badge */}
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-600 text-[10px] font-semibold uppercase tracking-wider">Live</span>
              </div>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed max-w-2xl">
              Smart recommendations generated from consumption forecasts, stock levels, recent movements and stockout risks.
            </p>
          </div>

          {/* CTA Button */}
          {!loading && predictions.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setModalOpen(true)}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-primary/30 text-primary rounded-xl text-xs font-semibold transition-all shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View All Recommendations
            </motion.button>
          )}
        </div>

        {/* ── 2×2 Grid ── */}
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
              <p className="text-slate-600 font-semibold">No data available</p>
              <p className="text-slate-400 text-xs mt-1">Load products and movements to activate AI</p>
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

        {/* ── Engine signature ── */}
        {!loading && predictions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 flex items-center justify-center gap-2 text-slate-400 text-[10px] font-mono"
          >
            <BrainCircuit className="w-3 h-3" />
            <span>WMA Engine · EOQ Wilson · ABC Pareto · Z-Score Anomaly Detection · Safety Stock</span>
          </motion.div>
        )}
      </motion.section>

      {/* ── Modal ── */}
      {modalOpen && (
        <RecommendationsModal rows={modalRows} onClose={closeModal} onGeminiClick={setGeminiContext} />
      )}

      {/* ── Gemini Modal ── */}
      {geminiContext && (
        <GeminiModal context={geminiContext} onClose={() => setGeminiContext(null)} />
      )}
    </>
  )
}
