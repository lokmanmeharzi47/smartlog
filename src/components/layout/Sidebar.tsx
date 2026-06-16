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
  Activity,
  Zap,
  FileText,
  BrainCircuit
} from 'lucide-react'

import Image from 'next/image'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/inventory', label: 'Inventory', icon: Package },
  { href: '/scan', label: 'Scan / Move', icon: ScanLine },
  { href: '/predictive-ai', label: 'Predictive AI', icon: BrainCircuit },
  { href: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { href: '/ai-recommendations', label: 'AI Recommendations', icon: BrainCircuit },
  { href: '/reports', label: 'Reports', icon: FileText },
]

<<<<<<< HEAD
import { X } from 'lucide-react'

export default function Sidebar({ 
  isOpen, 
  setIsOpen 
}: { 
  isOpen?: boolean; 
  setIsOpen?: (val: boolean) => void 
}) {
=======
export default function Sidebar() {
>>>>>>> 681af6f013aef3d5caa7fa6f7e13c0fd885cf425
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    try {
      await supabase.auth.signOut()
      toast.success('Successfully logged out')
      router.push('/login')
      router.refresh()
    } catch (error) {
      toast.error('Error logging out')
    }
  }

  return (
<<<<<<< HEAD
    <aside className={`fixed left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50 overflow-hidden transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Mobile close button */}
      {setIsOpen && (
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg z-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}

=======
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50 overflow-hidden">
>>>>>>> 681af6f013aef3d5caa7fa6f7e13c0fd885cf425
      {/* Ambient glow */}
      <div className="absolute top-0 left-0 w-full h-32 bg-cyan-500/5 pointer-events-none" />

      {/* Logo Section */}
      <div className="px-6 py-8 border-b border-slate-800 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/30 flex-shrink-0 overflow-hidden">
            <Image src="/logo.png" alt="SmartLog Logo" width={40} height={40} className="object-cover" />
          </div>
          <div>
            <div className="text-white font-bold text-base tracking-tight">SmartLog</div>
            <div className="text-slate-500 text-[10px] font-mono tracking-widest uppercase">WMS v2.0</div>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mx-4 mt-6 px-4 py-3 bg-slate-800/40 border border-slate-700/50 rounded-xl backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          <span className="text-emerald-400 text-[10px] font-bold tracking-wider uppercase">Connected</span>
        </div>
        <div className="text-slate-500 text-[10px] font-mono mt-1">Realtime Engine Active</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto no-scrollbar">
        <div className="px-4 py-2 text-slate-600 text-[10px] font-bold uppercase tracking-[2px] font-mono mb-2">
          Management
        </div>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-cyan-400' : 'group-hover:text-slate-300'}`} />
              {label}
              {href === '/alerts' && (
                <span className="ml-auto bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/20">
                  !
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer / Profile Section */}
      <div className="px-4 py-6 border-t border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white border border-slate-600">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-bold truncate">Admin User</p>
            <p className="text-slate-500 text-[10px] truncate uppercase tracking-tighter">System Manager</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full group uppercase tracking-widest border border-transparent hover:border-red-500/10"
        >
          <LogOut className="w-4 h-4 group-hover:text-red-400" />
          Sign Out
        </button>

        <div className="flex items-center gap-2 mt-4 px-2">
          <Zap className="w-3 h-3 text-cyan-500" />
          <span className="text-slate-600 text-[10px] font-mono">eu-central-1-prod</span>
        </div>
      </div>
    </aside>
  )
}
