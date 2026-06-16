import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-poppins' })

export const metadata: Metadata = {
  title: 'SmartLog WMS',
  description: 'Warehouse Management System — Production-ready SaaS',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={poppins.variable}>
      <body className="antialiased bg-slate-50 font-poppins">
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
