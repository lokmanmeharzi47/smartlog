'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Package, Tag, MapPin, Layers } from 'lucide-react'
import type { Product } from '@/types/database'

interface ProductPreviewProps {
  product: Product
}

export function ProductPreview({ product }: ProductPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl relative overflow-hidden group"
    >
      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-900 font-bold text-base tracking-tight">{product.name}</h3>
              <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-[2px] text-emerald-600">
                    Prêt pour mouvement
                  </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 mt-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Tag className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Référence</p>
                  <p className="text-slate-700 text-xs font-mono font-medium">{product.barcode}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Catégorie</p>
                  <p className="text-slate-700 text-xs font-medium">{product.category || 'Standard'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Emplacement</p>
                  <p className="text-slate-700 text-xs font-medium">Béjaïa Central</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Package className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Stock Actuel</p>
                  <p className="text-slate-900 text-sm font-black font-mono">
                    {product.stock} <span className="text-slate-400 text-[10px] uppercase tracking-widest ml-1">unités</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
