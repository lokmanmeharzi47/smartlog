'use client'

import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { Menu } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-slate-50 text-slate-800 selection:bg-secondary/30 selection:text-primary">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        {/* Mobile top bar with hamburger */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center px-4 z-40">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="ml-4 font-bold text-primary tracking-tight">SmartLog</div>
        </div>

        <div className="flex-1 md:ml-64 flex flex-col min-h-screen relative pt-16 md:pt-0">
          {/* Background decorative elements */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
          </div>
          
          <div className="relative z-10 flex flex-col min-h-screen">
            {children}
          </div>
        </div>
      </div>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

    </AuthProvider>
  )
}
