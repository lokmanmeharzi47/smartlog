import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'SmartLog WMS',
  description: 'Warehouse Management System — Production-ready SaaS',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="antialiased bg-slate-950">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #334155',
              borderRadius: '12px',
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#18a265', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#d63031', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  )
}
