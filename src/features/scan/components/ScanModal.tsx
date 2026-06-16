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
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[#081225] border border-cyan-500/20 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-2xl flex flex-col"
          >
            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

            {/* Header */}
            <div className="px-8 py-7 border-b border-white/5 flex items-center justify-between relative">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-inner">
                  <QrCode className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-xl tracking-tight">Scanner un QR Code</h2>
                  <p className="text-slate-400 text-sm font-medium mt-0.5">Positionnez le QR code dans la zone</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-11 h-11 rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-500 hover:text-white hover:border-slate-700 transition-all flex items-center justify-center group"
              >
                <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Scanner Body */}
            <div className="p-8 md:p-10">
              <div className="relative group">
                {/* Decorative border */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-[2rem] blur-md opacity-50 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative rounded-[2rem] overflow-hidden border border-white/10">
                  <QRCodeScanner 
                    onScanSuccess={onScanSuccess} 
                    onScanError={(err) => console.log("Scan error:", err)}
                  />
                </div>
              </div>
              
              <div className="mt-8 flex items-center justify-center gap-4">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></span>
                  </div>
                  <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[3px] font-mono">Scan en cours...</p>
              </div>
            </div>

            {/* Footer / Instructions */}
            <div className="px-10 py-7 bg-slate-950/60 border-t border-white/5 text-center">
                <p className="text-slate-400 text-xs font-medium leading-relaxed max-w-sm mx-auto opacity-80">
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
