'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import {
  LayoutDashboard, Package, ScanLine, AlertTriangle,
  LogOut, FileText, BrainCircuit, ChevronLeft,
  ChevronRight, Settings,
} from 'lucide-react'
import Image from 'next/image'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/inventory', label: 'Inventaire', icon: Package },
  { href: '/scan', label: 'Scan', icon: ScanLine },
  { href: '/predictive-ai', label: 'IA Prédictive', icon: BrainCircuit },
  { href: '/alerts', label: 'Alertes', icon: AlertTriangle },
  { href: '/reports', label: 'Rapports', icon: FileText },
]

interface SidebarProps {
  isOpen?: boolean
  setIsOpen?: (val: boolean) => void
  collapsed?: boolean
  setCollapsed?: (val: boolean) => void
}

export default function Sidebar({ isOpen, setIsOpen, collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    try {
      await supabase.auth.signOut()
      toast.success('Déconnexion réussie')
      router.push('/login')
      router.refresh()
    } catch {
      toast.error('Erreur de déconnexion')
    }
  }

  const isCollapsed = collapsed ?? false

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen?.(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 bottom-0 z-50 flex flex-col
          bg-primary shadow-xl transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-[72px]' : 'w-64'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className={`flex items-center border-b border-white/10 ${isCollapsed ? 'justify-center px-0 py-5' : 'gap-3 px-5 py-5'}`}>
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0 overflow-hidden p-1 shadow-md">
            <Image src="/logo.png" alt="SmartLog" width={36} height={36} className="object-cover" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <div className="text-white font-bold text-sm tracking-tight leading-tight">SmartLog</div>
              <div className="text-white/40 text-[10px] font-mono tracking-widest uppercase">WMS v2.0</div>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed?.(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-16 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-md items-center justify-center text-slate-500 hover:text-primary hover:border-primary/30 transition-all z-10"
          aria-label={isCollapsed ? 'Développer' : 'Réduire'}
        >
          {isCollapsed
            ? <ChevronRight className="w-3.5 h-3.5" />
            : <ChevronLeft className="w-3.5 h-3.5" />
          }
        </button>

        {!isCollapsed && (
          <div className="mx-4 mt-5 px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0 glow-dot" />
              <span className="text-emerald-400 text-[10px] font-semibold tracking-wider uppercase">Connecté</span>
            </div>
            <div className="text-white/40 text-[10px] font-mono mt-0.5">Moteur temps réel actif</div>
          </div>
        )}
        {isCollapsed && (
          <div className="flex justify-center mt-4">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse glow-dot" />
          </div>
        )}

        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'none' }}>
          {!isCollapsed && (
            <div className="px-3 pb-2 text-white/30 text-[9px] font-bold uppercase tracking-[2px]">
              Navigation
            </div>
          )}

          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (pathname.startsWith(href) && href !== '/')
            return (
              <Link
                key={href}
                href={href}
                title={isCollapsed ? label : undefined}
                className={`
                  flex items-center rounded-xl text-sm font-medium transition-all duration-150 group relative
                  ${isCollapsed ? 'justify-center h-11 w-full' : 'gap-3 px-3 py-2.5'}
                  ${isActive
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-white/55 hover:text-white hover:bg-white/8'
                  }
                `}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-white/55 group-hover:text-white'}`} />
                {!isCollapsed && (
                  <>
                    <span className="truncate">{label}</span>
                    {href === '/alerts' && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                    )}
                  </>
                )}
                {isCollapsed && href === '/alerts' && (
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-400" />
                )}
                {isCollapsed && (
                  <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-white/10">
                    {label}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className={`border-t border-white/10 py-4 ${isCollapsed ? 'px-2' : 'px-3'}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3 px-2 mb-3 bg-white/5 rounded-xl border border-white/10 p-2 cursor-pointer group transition-colors hover:bg-white/10">
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-[10px] font-bold text-white">AD</div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-primary rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">Administrateur</p>
                <p className="text-[10px] text-white/40 font-mono truncate">SmartLog v2.0</p>
              </div>
              <Settings className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
            </div>
          )}

          <button
            onClick={handleLogout}
            title={isCollapsed ? 'Déconnexion' : undefined}
            className={`
              flex items-center rounded-xl text-xs font-medium text-white/50
              hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 w-full
              ${isCollapsed ? 'justify-center h-10' : 'gap-2.5 px-3 py-2.5'}
            `}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>Déconnexion</span>}
          </button>

          {!isCollapsed && (
            <div className="flex items-center gap-1.5 mt-3 px-2">
              <div className="w-2 h-2 rounded-full bg-secondary/50" />
              <span className="text-white/25 text-[9px] font-mono truncate">eu-central-1-prod</span>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
