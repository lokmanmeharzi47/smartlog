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
  const [language, setLanguage] = useState<'FR' | 'AR'>('FR')

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

  useEffect(() => {
    document.documentElement.dir = language === 'AR' ? 'rtl' : 'ltr'
  }, [language])

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center px-4 md:px-8 py-3 md:py-0 min-h-[5rem] gap-4 md:gap-6">
      <div className="flex-1 w-full">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_10px_rgba(0,153,224,0.5)] shrink-0" />
          <h1 className="text-primary font-bold text-lg md:text-xl tracking-tight truncate">{title}</h1>
        </div>
        {subtitle && (
          <p className="text-slate-500 text-[10px] md:text-xs mt-1 ml-5 font-medium uppercase tracking-[1px] line-clamp-2 md:line-clamp-1">
            {subtitle} {period && <span className="ml-2 text-slate-600">| {period}</span>}
          </p>
        )}
      </div>

      <div className="flex items-center w-full justify-between md:justify-end md:w-auto gap-2 md:gap-4 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
        {/* Real-time Clock */}
        <div className="hidden lg:flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
          <Clock className="w-4 h-4 text-secondary" />
          <span className="text-slate-600 text-xs font-mono font-medium tracking-tight">
            {time}
          </span>
        </div>

        {/* Global Filter */}
        {showFilter && (
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-primary transition-all text-xs font-bold uppercase tracking-widest">
            <Filter className="w-4 h-4" />
            Filtrer
          </button>
        )}

        {/* PDF Export / Actions */}
        {showExport && (
          <div className="flex items-center gap-2">
            <PDFExportButton />
          </div>
        )}

        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(l => l === 'FR' ? 'AR' : 'FR')}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-primary transition-all text-xs font-bold"
        >
          {language}
        </button>

        {/* Notifications */}
        <button className="relative w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/30 transition-all shadow-sm group">
          <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
      </div>
    </header>
  )
}
