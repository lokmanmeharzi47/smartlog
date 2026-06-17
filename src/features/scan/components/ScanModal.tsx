'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, QrCode } from 'lucide-react'
import { QRCodeScanner } from './QRCodeScanner'

interface ScanModalProps {
  isOpen: boolean
  onClose: () => void
  onScanSuccess: (code: string) => void
}

export function ScanModal({ isOpen, onClose, onScanSuccess }: ScanModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-slate-900 font-bold text-base tracking-tight">Scanner un QR Code</h2>
                  <p className="text-slate-500 text-sm mt-0.5">Positionnez le QR code dans la zone</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-400 hover:text-slate-600 transition-all flex items-center justify-center"
              >
                <X className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} />
              </button>
            </div>

            {/* Scanner Body */}
            <div className="p-6 md:p-8">
              <div className="relative rounded-xl overflow-hidden border border-slate-200">
                <QRCodeScanner 
                  onScanSuccess={onScanSuccess} 
                  onScanError={(err) => console.log("Scan error:", err)}
                />
              </div>
              
              <div className="mt-6 flex items-center justify-center gap-3">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </div>
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[3px] font-mono">Scan en cours...</p>
              </div>
            </div>

            {/* Footer / Instructions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-center">
                <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto">
                    Détection automatique des codes QR, Code 128 et EAN-13.
                    Assurez-vous que le code est bien éclairé.
                </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
