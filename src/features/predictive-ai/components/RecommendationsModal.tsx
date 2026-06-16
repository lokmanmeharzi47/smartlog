'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BrainCircuit, Sparkles } from 'lucide-react'
import type { ModalRow } from '../types/recommendation'
import { Pagination } from '@/components/ui/Pagination'
import ABCBadge from './ABCBadge'

interface Props {
  rows: ModalRow[]
  onClose: () => void
  onGeminiClick: (ctx: any) => void
}

const priorityConfig = {
  HIGH: { label: 'High', dot: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-50 border-red-200' },
  MEDIUM: { label: 'Medium', dot: 'bg-orange-500', text: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
  LOW: { label: 'Low', dot: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
}

export default function RecommendationsModal({ rows, onClose, onGeminiClick }: Props) {
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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-5xl max-h-[85vh] bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-slate-900/15"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h2 className="text-primary font-bold text-base">All AI Recommendations</h2>
                <p className="text-slate-400 text-xs">{rows.length} products analyzed · Sorted by criticality</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

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
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 border rounded-full px-2 py-0.5 text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-slate-800 font-semibold">{row.productName}</p>
                      </td>
                      <td className="px-4 py-3">
                        <ABCBadge cls={row.abcClass} />
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-mono font-semibold text-xs ${cfg.text}`}>{row.risk}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-mono font-bold ${row.days !== null && row.days < 7 ? 'text-red-500' : row.days !== null && row.days < 14 ? 'text-orange-500' : 'text-slate-400'}`}>
                          {row.days !== null ? `${row.days}d` : '∞'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <div className="flex items-center justify-between gap-3">
                          <span>{row.recommendation}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onGeminiClick({ ...row, type: 'MODAL_ROW' })
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
