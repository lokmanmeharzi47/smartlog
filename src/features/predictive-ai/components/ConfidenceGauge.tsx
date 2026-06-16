'use client'

import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'

interface Props {
  confidence: number
  loading?: boolean
}

export default function ConfidenceGauge({ confidence, loading }: Props) {
  const clamp = Math.max(0, Math.min(100, confidence))
  const color = clamp >= 85 ? '#10b981' : clamp >= 70 ? '#22d3ee' : '#fb923c'
  const label = clamp >= 85 ? 'Élevée' : clamp >= 70 ? 'Moyenne' : 'Faible'

  const r = 52
  const cx = 64
  const cy = 64
  const startAngle = -210
  const sweepMax = 240
  const sweep = (clamp / 100) * sweepMax

  function polar(angle: number) {
    const rad = (angle * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  function arcPath(startDeg: number, endDeg: number) {
    const s = polar(startDeg)
    const e = polar(endDeg)
    const large = endDeg - startDeg > 180 ? 1 : 0
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`
  }

  const trackPath = arcPath(startAngle, startAngle + sweepMax)
  const fillPath = arcPath(startAngle, startAngle + sweep)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck className="w-4 h-4 text-secondary" />
        <h3 className="text-primary font-bold text-sm">Taux de Confiance Moyen</h3>
      </div>
      <p className="text-slate-400 text-xs mb-5">
        Le coefficient de variation mesure la stabilité de la demande. CV faible → haute confiance.
      </p>

      {loading ? (
        <div className="w-32 h-32 rounded-full bg-slate-100 animate-pulse mx-auto" />
      ) : (
        <div className="flex flex-col items-center gap-4">
          <svg width={128} height={100} viewBox="0 0 128 128">
            <path d={trackPath} stroke="#e2e8f0" strokeWidth="10" fill="none" strokeLinecap="round" />
            <motion.path
              d={fillPath}
              stroke={color}
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            <text x={cx} y={cy - 4} textAnchor="middle" fill={color} fontSize="20" fontWeight="bold" fontFamily="monospace">
              {clamp}%
            </text>
            <text x={cx} y={cy + 14} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="sans-serif">
              {label}
            </text>
          </svg>

          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center">
              <p className="text-[10px] text-slate-500 mb-0.5">CV faible</p>
              <p className="text-emerald-500 font-bold text-[11px]">Demande stable</p>
              <p className="text-slate-400 text-[9px] mt-0.5">Confiance élevée</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center">
              <p className="text-[10px] text-slate-500 mb-0.5">CV élevé</p>
              <p className="text-orange-500 font-bold text-[11px]">Demande instable</p>
              <p className="text-slate-400 text-[9px] mt-0.5">Confiance réduite</p>
            </div>
          </div>

          <div className="bg-slate-100 rounded-xl p-2.5 w-full">
            <p className="text-slate-400 text-[10px] font-mono text-center">
              Confiance = max(60%, min(97%, (1 − CV × 0.8) × 100%))
            </p>
          </div>
        </div>
      )}
    </motion.div>
  )
}
