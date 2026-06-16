'use client'

import { useEffect, useState } from 'react'
import { Bell, Clock, Download } from 'lucide-react'
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
  period,
}: TopBarProps) {
  const [time, setTime] = useState('')
  const [language, setLanguage] = useState<'FR' | 'AR'>('FR')

  useEffect(() => {
    function update() {
      setTime(new Date().toLocaleString('en-US', {
        weekday: 'short', day: 'numeric', month: 'short',
        hour: '2-digit', minute: '2-digit',
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
    <header
      className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center px-4 md:px-6 h-14 gap-4"
      dir={language === 'AR' ? 'rtl' : 'ltr'}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-secondary shrink-0" />
          <h1 className="text-primary font-bold text-base md:text-lg tracking-tight truncate">{title}</h1>
          {subtitle && (
            <span className="hidden md:inline text-slate-400 text-xs font-medium truncate">— {subtitle}</span>
          )}
        </div>
        {subtitle && (
          <p className="hidden max-md:block text-slate-400 text-[10px] font-medium truncate ml-4.5">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm">
          <Clock className="w-3.5 h-3.5 text-secondary" />
          <span className="text-slate-500 text-[11px] font-mono font-medium">
            {time}
          </span>
        </div>

        <button
          onClick={() => setLanguage(l => l === 'FR' ? 'AR' : 'FR')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-primary transition-all text-[11px] font-bold min-w-[48px] justify-center"
        >
          {language === 'FR' ? 'FR' : 'AR'}
        </button>

        <button className="relative w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        {showExport && <PDFExportButton />}
      </div>
    </header>
  )
}
