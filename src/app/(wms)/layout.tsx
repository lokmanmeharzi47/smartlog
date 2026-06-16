'use client'

import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { Menu } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-slate-50 text-slate-800">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          collapsed={isSidebarCollapsed}
          setCollapsed={setIsSidebarCollapsed}
        />

        {/* Mobile top bar */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 flex items-center px-4 z-40 shadow-sm">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="ml-3 font-bold text-primary text-sm tracking-tight">SmartLog</div>
        </div>

        {/* Main content — shift based on sidebar state */}
        <div
          className={`flex-1 flex flex-col min-h-screen relative pt-14 md:pt-0 transition-all duration-300 ${
            isSidebarCollapsed ? 'md:ml-[72px]' : 'md:ml-64'
          }`}
        >
          <div className="relative z-10 flex flex-col min-h-screen">
            {children}
          </div>
        </div>
      </div>
    </AuthProvider>
  )
}
