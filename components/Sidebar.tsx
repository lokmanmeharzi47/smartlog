'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import {
  LayoutDashboard, Package, ScanLine, AlertTriangle,
  LogOut, Zap, BarChart3
} from 'lucide-react'

const navItems = [
  { href: '/dashboard',  label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/inventory',  label: 'Inventaire',  icon: Package },
  { href: '/scan',       label: 'Scan / Mouvement', icon: ScanLine },
  { href: '/analytics',  label: 'Analytique',  icon: BarChart3 },
  { href: '/alerts',     label: 'Alertes',     icon: AlertTriangle },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router   = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    toast.success('Déconnecté')
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-slate-800 flex flex-col z-50">
      {/* Ambient top glow */}
      <div className="absolute top-0 left-0 w-full h-32 bg-cyan-500/5 pointer-events-none" />

      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800 relative">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/30 flex-shrink-0">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm tracking-tight">SmartLog</div>
            <div className="text-slate-500 text-xs font-mono tracking-widest">WMS v2.0</div>
          </div>
        </div>
      </div>

      {/* Live status badge */}
      <div className="mx-4 mt-4 px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 live-dot flex-shrink-0" />
          <span className="text-emerald-400 text-xs font-semibold">SUPABASE CONNECTÉ</span>
        </div>
        <div className="text-slate-500 text-xs font-mono mt-1">Realtime actif</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-slate-600 text-[10px] font-bold uppercase tracking-[2px] font-mono">
          Modules
        </div>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                active
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-cyan-400' : 'group-hover:text-slate-300'}`} />
              {label}
              {href === '/alerts' && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  !
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-slate-800 pt-4">
        <button
          id="logout-btn"
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full group"
        >
          <LogOut className="w-4 h-4 group-hover:text-red-400" />
          Déconnexion
        </button>
        <div className="flex items-center gap-2 mt-3 px-3">
          <Zap className="w-3 h-3 text-cyan-500" />
          <span className="text-slate-600 text-xs font-mono">eu-central-1</span>
        </div>
      </div>
    </aside>
  )
}
