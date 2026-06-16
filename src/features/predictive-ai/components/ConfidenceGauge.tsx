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

  // SVG arc math
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
      className="bg-[#081225] border border-white/10 rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-4 h-4 text-cyan-400" />
        <h3 className="text-white font-bold text-sm">6.3 Taux de Confiance Moyen</h3>
      </div>
      <p className="text-slate-400 text-xs mb-6">
        Le coefficient de variation mesure la stabilité de la demande. CV faible → haute confiance.
      </p>

      {loading ? (
        <div className="w-32 h-32 rounded-full bg-white/5 animate-pulse mx-auto" />
      ) : (
        <div className="flex flex-col items-center gap-4">
          <svg width={128} height={100} viewBox="0 0 128 128">
            {/* Track */}
            <path d={trackPath} stroke="rgba(255,255,255,0.06)" strokeWidth="10" fill="none" strokeLinecap="round" />
            {/* Fill */}
            <motion.path
              d={fillPath}
              stroke={color}
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
            />
            {/* Center text */}
            <text x={cx} y={cy - 4} textAnchor="middle" fill={color} fontSize="20" fontWeight="bold" fontFamily="monospace">
              {clamp}%
            </text>
            <text x={cx} y={cy + 14} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="sans-serif">
              {label}
            </text>
          </svg>

          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="bg-slate-900/60 border border-slate-700/30 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-500 mb-1">CV faible</p>
              <p className="text-emerald-400 font-bold text-xs">Demande stable</p>
              <p className="text-slate-600 text-[10px] mt-0.5">Confiance élevée</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-700/30 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-500 mb-1">CV élevé</p>
              <p className="text-orange-300 font-bold text-xs">Demande instable</p>
              <p className="text-slate-600 text-[10px] mt-0.5">Confiance réduite</p>
            </div>
          </div>

          <div className="bg-slate-900/40 rounded-xl p-3 w-full">
            <p className="text-slate-500 text-[10px] font-mono text-center">
              Confiance = max(60%, min(97%, (1 − CV × 0.8) × 100%))
            </p>
          </div>
        </div>
      )}
    </motion.div>
  )
}
