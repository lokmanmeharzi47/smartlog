'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import {
  LayoutDashboard,
  Package,
  ScanLine,
  AlertTriangle,
  LogOut,
  FileText,
  BrainCircuit,
  Activity,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react'
import Image from 'next/image'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/inventory', label: 'Inventory', icon: Package },
  { href: '/scan', label: 'Scan / Move', icon: ScanLine },
  { href: '/predictive-ai', label: 'Predictive AI', icon: BrainCircuit },
  { href: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { href: '/ai-recommendations', label: 'AI Recommendations', icon: Activity },
  { href: '/reports', label: 'Reports', icon: FileText },
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
      toast.success('Logged out successfully')
      router.push('/login')
      router.refresh()
    } catch {
      toast.error('Error signing out')
    }
  }

  const isCollapsed = collapsed ?? false

  return (
    <>
      {/* Mobile overlay */}
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
        {/* Logo */}
        <div className={`flex items-center border-b border-white/10 ${isCollapsed ? 'justify-center px-0 py-5' : 'gap-3 px-5 py-5'}`}>
          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center flex-shrink-0 overflow-hidden p-1 shadow-md">
            <Image src="/logo.png" alt="SmartLog" width={36} height={36} className="object-cover" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <div className="text-white font-bold text-sm tracking-tight leading-tight">SmartLog</div>
              <div className="text-white/40 text-[10px] font-mono tracking-widest uppercase">WMS v2.0</div>
            </div>
          )}
        </div>

        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setCollapsed?.(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-16 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-md items-center justify-center text-slate-500 hover:text-primary hover:border-primary/30 transition-all z-10"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed
            ? <ChevronRight className="w-3.5 h-3.5" />
            : <ChevronLeft className="w-3.5 h-3.5" />
          }
        </button>

        {/* Connection status */}
        {!isCollapsed && (
          <div className="mx-4 mt-5 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <span className="text-emerald-400 text-[10px] font-semibold tracking-wider uppercase">Connected</span>
            </div>
            <div className="text-white/40 text-[10px] font-mono mt-0.5">Realtime Engine Active</div>
          </div>
        )}
        {isCollapsed && (
          <div className="flex justify-center mt-4">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'none' }}>
          {!isCollapsed && (
            <div className="px-3 pb-2 text-white/30 text-[9px] font-bold uppercase tracking-[2px]">
              Management
            </div>
          )}

          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                title={isCollapsed ? label : undefined}
                className={`
                  flex items-center rounded-lg text-sm font-medium transition-all duration-150 group relative
                  ${isCollapsed ? 'justify-center h-11 w-full' : 'gap-3 px-3 py-2.5'}
                  ${isActive
                    ? 'bg-white/15 text-white'
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
                {/* Tooltip on hover when collapsed */}
                {isCollapsed && (
                  <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-white/10">
                    {label}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className={`border-t border-white/10 py-4 ${isCollapsed ? 'px-2' : 'px-3'}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 px-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 border border-white/20">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate">Admin User</p>
                <p className="text-white/40 text-[10px] truncate">System Manager</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            title={isCollapsed ? 'Sign Out' : undefined}
            className={`
              flex items-center rounded-lg text-xs font-medium text-white/50
              hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 w-full
              ${isCollapsed ? 'justify-center h-10' : 'gap-2.5 px-3 py-2.5'}
            `}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>

          {!isCollapsed && (
            <div className="flex items-center gap-1.5 mt-3 px-2">
              <Zap className="w-3 h-3 text-secondary flex-shrink-0" />
              <span className="text-white/25 text-[9px] font-mono truncate">eu-central-1-prod</span>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
