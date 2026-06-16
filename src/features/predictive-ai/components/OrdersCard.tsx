'use client'

import { motion } from 'framer-motion'
import { ShoppingCart, Package, Sparkles } from 'lucide-react'
import type { OrderItem } from '../types/recommendation'
import ABCBadge from './ABCBadge'
import EmptyState from './EmptyState'

interface Props {
  items: OrderItem[]
  onGeminiClick: (ctx: any) => void
}

export default function OrdersCard({ items, onGeminiClick }: Props) {
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
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-violet-50 rounded-full border border-violet-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-3 h-3 text-violet-500" />
                </div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <p className="text-slate-900 text-xs font-semibold truncate">{item.productName}</p>
                    <ABCBadge cls={item.abcClass} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-1.5 text-center">
                    <div className="text-slate-500 text-[8px] uppercase mb-0.5">Stock</div>
                    <div className="text-slate-800 font-bold">{item.stock}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-1.5 text-center">
                    <div className="text-slate-500 text-[8px] uppercase mb-0.5">Prévu 7j</div>
                    <div className="text-slate-700 font-bold">{item.forecast7d}</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200/50 rounded-lg p-1.5 text-center">
                    <div className="text-orange-600/70 text-[8px] uppercase mb-0.5">EOQ</div>
                    <div className="text-orange-700 font-bold">{item.eoq}</div>
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
