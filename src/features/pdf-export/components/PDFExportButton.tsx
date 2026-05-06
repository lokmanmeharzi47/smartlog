'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, ChevronDown, Download, Package, AlertTriangle, BrainCircuit, Loader2 } from 'lucide-react'
import { usePdfExport, ExportScope } from '../hooks/usePdfExport'

interface Props {
  className?: string
}

const menuItems: { label: string; scope: ExportScope; icon: React.ReactNode; desc: string }[] = [
  { label: 'Rapport complet',  scope: 'full',        icon: <FileText className="w-3.5 h-3.5" />,      desc: 'KPIs + Inventaire + IA' },
  { label: 'Inventaire',       scope: 'inventory',   icon: <Package className="w-3.5 h-3.5" />,       desc: 'Liste produits & statuts' },
  { label: 'Alertes',          scope: 'alerts',      icon: <AlertTriangle className="w-3.5 h-3.5" />, desc: 'Articles critiques' },
  { label: 'Prédictions IA',   scope: 'predictions', icon: <BrainCircuit className="w-3.5 h-3.5" />,  desc: 'WMA & ruptures' },
]

export default function PDFExportButton({ className = '' }: Props) {
  const { exportPDF, exporting } = usePdfExport()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Main button */}
      <motion.div className="flex" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        {/* Left: export icon + label */}
        <button
          onClick={() => exportPDF('full')}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500/15 border border-cyan-500/20 border-r-0 text-cyan-300 rounded-l-2xl text-xs font-bold uppercase tracking-wider transition-all hover:bg-cyan-500/25 hover:shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50"
        >
          {exporting
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <FileText className="w-4 h-4" />
          }
          {exporting ? 'Génération...' : 'Exporter PDF'}
        </button>
        {/* Right: chevron for dropdown */}
        <button
          onClick={() => setOpen(o => !o)}
          disabled={exporting}
          className="flex items-center px-2.5 py-2.5 bg-cyan-500/15 border border-cyan-500/20 text-cyan-300 rounded-r-2xl transition-all hover:bg-cyan-500/25 disabled:opacity-50"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </motion.div>

      {/* Dropdown menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 bg-[#081225] border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50"
          >
            <div className="px-3 py-2 border-b border-white/5">
              <p className="text-slate-500 text-[10px] uppercase tracking-wider font-bold">Options d&apos;export</p>
            </div>
            {menuItems.map((item) => (
              <button
                key={item.scope}
                onClick={() => { exportPDF(item.scope); setOpen(false) }}
                disabled={exporting}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-cyan-500/10 transition-colors group"
              >
                <span className="text-cyan-400 group-hover:text-cyan-300">{item.icon}</span>
                <div className="text-left">
                  <p className="text-white text-xs font-semibold">{item.label}</p>
                  <p className="text-slate-500 text-[10px]">{item.desc}</p>
                </div>
                <Download className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 ml-auto" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
