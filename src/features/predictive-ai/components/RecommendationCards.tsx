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
    A: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    B: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    C: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  }
  return (
    <span className={`text-[9px] font-black border rounded px-1 py-0.5 leading-none ${colors[cls]}`}>
      {cls}
    </span>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-white/5" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-white/5 rounded w-40" />
          <div className="h-2.5 bg-white/5 rounded w-24" />
        </div>
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="mb-3 space-y-1.5">
          <div className="h-3 bg-white/5 rounded w-full" />
          <div className="h-2 bg-white/5 rounded w-3/4" />
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
      className="relative rounded-2xl overflow-hidden border border-red-500/20 bg-gradient-to-br from-red-950/40 via-[#0d0a0a] to-[#0a0510]"
      style={{ boxShadow: '0 0 40px -10px rgba(239,68,68,0.15)' }}
    >
      {/* Glow accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-400 to-rose-500" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm leading-tight">Actions Urgentes</h3>
              <p className="text-red-400/70 text-[10px] font-mono mt-0.5">Ruptures imminentes · &lt; 7j</p>
            </div>
          </div>
          <span className="flex items-center gap-1 bg-red-500/15 border border-red-500/20 text-red-400 text-[10px] font-black px-2 py-1 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
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
                className="group relative bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/25 rounded-xl p-3 transition-all cursor-pointer"
                onClick={() => onGeminiClick({ ...item, type: 'URGENT' })}
              >
                {/* AI badge */}
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-violet-500/20 rounded-full border border-violet-500/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-3 h-3 text-violet-400" />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[8px] text-red-400/60 font-mono">{i + 1}.</span>
                      <p className="text-white text-xs font-semibold truncate">{item.productName}</p>
                      <ABCBadge cls={item.abcClass} />
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-mono">
                      <span className="text-slate-400">Stock: <span className="text-red-300 font-bold">{item.stock}</span></span>
                      <span className="text-slate-600">|</span>
                      <span className="text-slate-400">Seuil: <span className="text-slate-300">{item.minStock}</span></span>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-1.5 w-full bg-slate-800 rounded-full h-1">
                      <div
                        className="h-1 rounded-full bg-gradient-to-r from-red-600 to-red-400 transition-all"
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
      className="relative rounded-2xl overflow-hidden border border-orange-500/20 bg-gradient-to-br from-orange-950/40 via-[#0d0a06] to-[#080508]"
      style={{ boxShadow: '0 0 40px -10px rgba(249,115,22,0.15)' }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 via-amber-400 to-yellow-500" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm leading-tight">Commandes Recommandées</h3>
              <p className="text-orange-400/70 text-[10px] font-mono mt-0.5">EOQ — Formule de Wilson</p>
            </div>
          </div>
          <span className="flex items-center gap-1 bg-orange-500/15 border border-orange-500/20 text-orange-400 text-[10px] font-black px-2 py-1 rounded-full">
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
                className="group relative bg-orange-500/5 hover:bg-orange-500/10 border border-orange-500/10 hover:border-orange-500/25 rounded-xl p-3 transition-all cursor-pointer"
                onClick={() => onGeminiClick({ ...item, type: 'ORDER' })}
              >
                {/* AI badge */}
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-violet-500/20 rounded-full border border-violet-500/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-3 h-3 text-violet-400" />
                </div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[8px] text-orange-400/60 font-mono">{i + 1}.</span>
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
      color: 'text-blue-300',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/25',
      icon: <ArrowDown className="w-3 h-3" />,
      label: 'Surstock',
    },
    LOW_ROTATION: {
      color: 'text-sky-300',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
      icon: <RefreshCw className="w-3 h-3" />,
      label: 'Rotation faible',
    },
    ANOMALY: {
      color: 'text-violet-300',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      icon: <Info className="w-3 h-3" />,
      label: 'Anomalie',
    },
  }

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.005 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative rounded-2xl overflow-hidden border border-blue-500/20 bg-gradient-to-br from-blue-950/40 via-[#060812] to-[#060810]"
      style={{ boxShadow: '0 0 40px -10px rgba(59,130,246,0.15)' }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-500" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm leading-tight">Optimisation du Stock</h3>
              <p className="text-blue-400/70 text-[10px] font-mono mt-0.5">Surstock · Rotation faible</p>
            </div>
          </div>
          <span className="flex items-center gap-1 bg-blue-500/15 border border-blue-500/20 text-blue-400 text-[10px] font-black px-2 py-1 rounded-full">
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
                  className={`group relative ${cfg.bg} border ${cfg.border} hover:brightness-125 rounded-xl p-3 transition-all cursor-pointer`}
                  onClick={() => onGeminiClick({ ...item, type: 'OPTIMIZATION' })}
                >
                  {/* AI badge */}
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-violet-500/20 rounded-full border border-violet-500/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="w-3 h-3 text-violet-400" />
                  </div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-white text-xs font-semibold truncate">{item.productName}</p>
                    <span className={`flex items-center gap-1 text-[9px] font-bold ${cfg.color} bg-black/20 rounded-full px-2 py-0.5`}>
                      {cfg.icon}{cfg.label}
                    </span>
                  </div>
                  <p className={`text-[10px] font-mono ${cfg.color} opacity-80`}>{item.detail}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-blue-400/60 flex-shrink-0" />
                    <span className="text-slate-300 text-[10px]">{item.recommendation}</span>
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
      className="relative rounded-2xl overflow-hidden border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 via-[#060d09] to-[#060810]"
      style={{ boxShadow: '0 0 40px -10px rgba(16,185,129,0.15)' }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 via-green-400 to-teal-500" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm leading-tight">Prévisions 7 Jours</h3>
              <p className="text-emerald-400/70 text-[10px] font-mono mt-0.5">WMA · Demande prévue</p>
            </div>
          </div>
          <span className="flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-1 rounded-full">
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
                className="group relative bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 hover:border-emerald-500/25 rounded-xl p-3 transition-all cursor-pointer"
                onClick={() => onGeminiClick({ ...item, type: 'FORECAST' })}
              >
                {/* AI badge */}
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-violet-500/20 rounded-full border border-violet-500/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-3 h-3 text-violet-400" />
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <p className="text-white text-xs font-semibold truncate">{item.productName}</p>
                    <ABCBadge cls={item.abcClass} />
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-emerald-400 font-black text-sm font-mono">{item.forecast7d}</span>
                    <span className="text-emerald-400/50 text-[9px] ml-0.5">u</span>
                  </div>
                </div>
                {/* Confidence bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-800 rounded-full h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.confidence}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                      className="h-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-400"
                    />
                  </div>
                  <span className="text-emerald-400 text-[10px] font-mono font-bold w-8 text-right">
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
    HIGH: { label: 'Haute', dot: 'bg-red-400', text: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    MEDIUM: { label: 'Moyenne', dot: 'bg-orange-400', text: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    LOW: { label: 'Faible', dot: 'bg-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
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
          className="relative w-full max-w-5xl max-h-[85vh] bg-[#060d1a] border border-white/10 rounded-3xl overflow-hidden flex flex-col"
          style={{ boxShadow: '0 40px 120px -20px rgba(0,0,0,0.9), 0 0 60px -20px rgba(6,182,212,0.1)' }}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 bg-gradient-to-r from-cyan-950/30 to-transparent flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-white font-bold text-base">Toutes les Recommandations IA</h2>
                <p className="text-slate-500 text-xs">{rows.length} produits analysés · Trié par criticité</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Table */}
          <div className="overflow-y-auto overflow-x-auto flex-1 overscroll-contain">
            <table className="w-full text-xs min-w-[800px]">
              <thead className="sticky top-0 bg-[#060d1a] border-b border-white/8 z-10">
                <tr>
                  {['Priorité', 'Produit', 'Classe', 'Risque', 'Jours', 'Recommandation'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((row, i) => {
                  const cfg = priorityConfig[row.priority]
                  return (
                    <motion.tr
                      key={row.productId}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.02, 0.3) }}
                      className="border-b border-white/5 hover:bg-white/3 transition-colors"
                    >
                      {/* Priority */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 border rounded-full px-2 py-0.5 font-bold ${cfg.bg} ${cfg.text}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </td>
                      {/* Product */}
                      <td className="px-4 py-3">
                        <p className="text-white font-semibold">{row.productName}</p>
                      </td>
                      {/* ABC Class */}
                      <td className="px-4 py-3">
                        <ABCBadge cls={row.abcClass} />
                      </td>
                      {/* Risk */}
                      <td className="px-4 py-3">
                        <span className={`font-mono font-semibold ${cfg.text}`}>{row.risk}</span>
                      </td>
                      {/* Days */}
                      <td className="px-4 py-3">
                        <span className={`font-mono font-bold ${row.days !== null && row.days < 7 ? 'text-red-400' : row.days !== null && row.days < 14 ? 'text-orange-400' : 'text-slate-500'}`}>
                          {row.days !== null ? `${row.days}j` : '∞'}
                        </span>
                      </td>
                      {/* Recommendation */}
                      <td className="px-4 py-3 text-slate-300 flex items-center justify-between">
                        {row.recommendation}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onGeminiClick({ ...row, type: 'MODAL_ROW' });
                          }}
                          className="w-6 h-6 rounded-full bg-violet-500/10 hover:bg-violet-500/30 border border-violet-500/30 flex items-center justify-center transition-all"
                          title="Demander à l'IA"
                        >
                          <Sparkles className="w-3 h-3 text-violet-400" />
                        </button>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-white/8 bg-black/20 flex items-center justify-between flex-shrink-0">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center justify-between">
                <p className="text-slate-600 text-[10px] font-mono">
                  Moteur WMA · EOQ Wilson · Classification ABC · Z-Score · Confiance algorithmique
                </p>
                <button
                  onClick={onClose}
                  className="text-xs text-slate-400 hover:text-white border border-white/10 hover:border-white/20 rounded-xl px-4 py-1.5 transition-all"
                >
                  Fermer
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
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
              </div>
              <h2 className="text-white font-black text-lg tracking-tight">
                🤖 Centre de Décision IA
              </h2>
              {/* Live badge */}
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-2.5 py-1"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider">Live</span>
              </motion.div>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed max-w-2xl">
              Recommandations intelligentes générées automatiquement à partir des prévisions de
              consommation, des niveaux de stock, des mouvements récents et des risques de rupture.
            </p>
          </div>

          {/* CTA Button */}
          {!loading && predictions.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setModalOpen(true)}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 hover:border-cyan-500/50 text-cyan-300 hover:text-cyan-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Voir toutes les recommandations
            </motion.button>
          )}
        </div>

        {/* ── 2×2 Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : predictions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 border border-white/5 rounded-2xl bg-white/2">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-center">
              <BrainCircuit className="w-8 h-8 text-cyan-500/40" />
            </div>
            <div className="text-center">
              <p className="text-slate-400 font-semibold">Aucune donnée disponible</p>
              <p className="text-slate-600 text-xs mt-1">Chargez des produits et des mouvements pour activer l&apos;IA</p>
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
            className="mt-4 flex items-center justify-center gap-2 text-slate-700 text-[10px] font-mono"
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
