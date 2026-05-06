'use client'

import { useEffect, useState } from 'react'
import { Bell, Clock, Calendar, Download, Filter } from 'lucide-react'
import PDFExportButton from '@/features/pdf-export/components/PDFExportButton'

interface TopBarProps {
  title: string
  subtitle?: string
  showExport?: boolean
  showFilter?: boolean
  period?: string
}

export default function TopBar({
  title,
  subtitle,
  showExport = true,
  showFilter = false,
  period,
}: TopBarProps) {
  const [time, setTime] = useState('')

  useEffect(() => {
    function update() {
      setTime(new Date().toLocaleString('en-US', {
        weekday: 'short', day: 'numeric', month: 'short',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      }))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 flex items-center px-8 h-20 gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
          <h1 className="text-white font-bold text-xl tracking-tight">{title}</h1>
        </div>
        {subtitle && (
          <p className="text-slate-500 text-xs mt-1 ml-5 font-medium uppercase tracking-[1px]">
            {subtitle} {period && <span className="ml-2 text-slate-600">| {period}</span>}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Real-time Clock */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 shadow-sm">
          <Clock className="w-4 h-4 text-cyan-500" />
          <span className="text-slate-300 text-xs font-mono font-medium tracking-tight">
            {time}
          </span>
        </div>

        {/* Global Filter */}
        {showFilter && (
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        )}

        {/* PDF Export / Actions */}
        {showExport && (
          <div className="flex items-center gap-2">
            <PDFExportButton />
          </div>
        )}

        {/* Notifications */}
        <button className="relative w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all shadow-sm group">
          <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900" />
        </button>
      </div>
    </header>
  )
}
