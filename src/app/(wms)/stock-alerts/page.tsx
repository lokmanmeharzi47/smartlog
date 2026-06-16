'use client'

import { useEffect, useState, useCallback } from 'react'
import TopBar from '@/components/layout/TopBar'
import { getProducts } from '@/lib/api'
import { supabase } from '@/lib/supabaseClient'
import type { Product } from '@/types/database'
import toast from 'react-hot-toast'
import { AlertTriangle, TrendingDown, Package } from 'lucide-react'
import { Pagination } from '@/components/ui/Pagination'

export default function AlertsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)

  const load = useCallback(async () => {
    try {
      const data = await getProducts()
      setProducts(data)
    } catch {
      toast.error('Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const ch = supabase
      .channel('alerts-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, load)
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [load])

  const critical  = products.filter(p => p.stock < p.min_stock)
  const overstock = products.filter(p => p.max_stock && p.stock > p.max_stock)
  const nearMin   = products.filter(p => p.stock >= p.min_stock && p.stock < p.min_stock * 1.3 && p.stock > 0)

  function AlertRow({ p, variant }: { p: Product; variant: 'critical' | 'overstock' | 'nearMin' }) {
    const config = {
      critical:  { bg: 'bg-red-50 border-red-200',   text: 'text-red-600',    label: 'Stock critique',    icon: <AlertTriangle className="w-4 h-4 text-red-500" /> },
      overstock: { bg: 'bg-amber-50 border-amber-200',text: 'text-amber-600',  label: 'Surstock',          icon: <Package className="w-4 h-4 text-amber-500" /> },
      nearMin:   { bg: 'bg-orange-50 border-orange-200',text: 'text-orange-600',label: 'Proche du seuil', icon: <TrendingDown className="w-4 h-4 text-orange-500" /> },
    }[variant]

    const shortage = variant === 'critical' ? p.min_stock - p.stock : 0

    return (
      <div className={`flex items-center gap-3 p-3.5 ${config.bg} border rounded-xl`}>
        <div className="flex-shrink-0">{config.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="text-slate-700 font-semibold text-xs truncate">{p.name}</div>
          <div className="text-slate-400 text-[10px] font-mono">{p.barcode} · {p.category}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className={`${config.text} font-mono font-bold text-sm`}>
            {p.stock} / {p.min_stock} min
          </div>
          {variant === 'critical' && (
            <div className="text-red-500 text-[10px] font-mono">−{shortage} à commander</div>
          )}
          {variant === 'overstock' && (
            <div className="text-amber-500 text-[10px] font-mono">+{p.stock - (p.max_stock ?? 0)} en excès</div>
          )}
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${config.bg} ${config.text} flex-shrink-0`}>
          {config.label}
        </span>
      </div>
    )
  }

  function Section({ title, items, variant, emptyMsg }: {
    title: string
    items: Product[]
    variant: 'critical' | 'overstock' | 'nearMin'
    emptyMsg: string
  }) {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const paginatedItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    const totalPages = Math.ceil(items.length / itemsPerPage)

    return (
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${items.length > 0 ? (variant === 'critical' ? 'bg-red-500' : 'bg-amber-500') : 'bg-emerald-500'}`} />
            <span className="text-primary font-semibold text-sm">{title}</span>
          </div>
          <span className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border flex-shrink-0 ${
            items.length > 0
              ? variant === 'critical' ? 'bg-red-50 border-red-200 text-red-500' : 'bg-amber-50 border-amber-200 text-amber-500'
              : 'bg-emerald-50 border-emerald-200 text-emerald-500'
          }`}>
            {items.length} {items.length !== 1 ? 'articles' : 'article'}
          </span>
        </div>
        <div className="p-4 space-y-2">
          {loading ? (
            [...Array(3)].map((_, i) => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />)
          ) : items.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">{emptyMsg}</p>
          ) : (
            paginatedItems.map(p => <AlertRow key={p.id} p={p} variant={variant} />)
          )}
        </div>
        {!loading && items.length > 0 && totalPages > 1 && (
          <div className="border-t border-slate-100 px-4 py-2">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <TopBar title="Alertes Stock" subtitle="Surveillance automatique des niveaux de stock" />

      <main className="flex-1 p-4 md:p-6 space-y-4 fade-in max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Critiques', count: critical.length, color: 'text-red-500', desc: 'À commander immédiatement' },
            { label: 'Proches du seuil', count: nearMin.length, color: 'text-orange-500', desc: 'Commander bientôt' },
            { label: 'Surstock', count: overstock.length, color: 'text-amber-500', desc: 'Au-dessus du max' },
          ].map(({ label, count, color, desc }) => (
            <div key={label} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4">
              <div className={`${color} text-2xl font-bold font-mono`}>{count}</div>
              <div className="text-slate-700 text-xs font-semibold mt-0.5">{label}</div>
              <div className="text-slate-400 text-[10px]">{desc}</div>
            </div>
          ))}
        </div>

        <Section title="Stock critique" items={critical} variant="critical" emptyMsg="✓ Aucun article en stock critique" />
        <Section title="Proche du seuil minimum" items={nearMin} variant="nearMin" emptyMsg="✓ Aucun article proche du seuil" />
        <Section title="Surstock" items={overstock} variant="overstock" emptyMsg="✓ Aucun article en surstock" />
      </main>
    </>
  )
}
