'use client'

import { useEffect, useState } from 'react'
import { Bell, Clock } from 'lucide-react'

interface TopbarProps {
  title: string
  subtitle?: string
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const [time, setTime] = useState('')

  useEffect(() => {
    function update() {
      setTime(new Date().toLocaleString('fr-FR', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      }))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 flex items-center px-6 gap-4 sticky top-0 z-40">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
          <h1 className="text-white font-semibold text-base tracking-tight">{title}</h1>
        </div>
        {subtitle && <p className="text-slate-500 text-xs mt-0.5 ml-4">{subtitle}</p>}
      </div>

      {/* Clock */}
      <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5">
        <Clock className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-slate-300 text-xs font-mono">{time}</span>
      </div>

      {/* Notifications */}
      <button
        id="notifications-btn"
        className="relative w-9 h-9 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-all"
      >
        <Bell className="w-4 h-4" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">1</span>
      </button>
    </header>
  )
}
