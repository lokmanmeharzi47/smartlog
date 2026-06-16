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
      className="mt-6 p-6 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-[2rem] relative overflow-hidden group"
    >
      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-700" />
      
      <div className="flex items-start gap-5 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 shadow-inner group-hover:border-emerald-500/40 transition-colors">
          <CheckCircle className="w-7 h-7 text-emerald-400" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold text-lg tracking-tight">{product.name}</h3>
            <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[2px] text-emerald-400">
                  Prêt pour mouvement
                </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 mt-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center">
                <Tag className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Référence</p>
                <p className="text-slate-300 text-xs font-mono font-medium">{product.barcode}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center">
                <Layers className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Catégorie</p>
                <p className="text-slate-300 text-xs font-medium">{product.category || 'Standard'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Emplacement</p>
                <p className="text-slate-300 text-xs font-medium">Béjaïa Central</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center">
                <Package className="w-4 h-4 text-cyan-500" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-cyan-500/60 font-bold">Stock Actuel</p>
                <p className="text-white text-sm font-black font-mono">
                  {product.stock} <span className="text-slate-500 text-[10px] uppercase tracking-widest ml-1">unités</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
