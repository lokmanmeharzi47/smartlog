'use client'

import { useEffect, useState, useCallback } from 'react'
import TopBar from '@/components/layout/TopBar'
import { getProducts } from '@/lib/api'
import { supabase } from '@/lib/supabaseClient'
import type { Product } from '@/types/database'
import toast from 'react-hot-toast'
import { AlertTriangle, TrendingDown, Package } from 'lucide-react'
<<<<<<< HEAD
import { Pagination } from '@/components/ui/Pagination'
=======
>>>>>>> 681af6f013aef3d5caa7fa6f7e13c0fd885cf425

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
      critical:  { bg: 'bg-red-500/8 border-red-500/20',   text: 'text-red-400',    label: 'Stock critique',    icon: <AlertTriangle className="w-4 h-4 text-red-400" /> },
      overstock: { bg: 'bg-amber-500/8 border-amber-500/20',text: 'text-amber-400',  label: 'Surstock',          icon: <Package className="w-4 h-4 text-amber-400" /> },
      nearMin:   { bg: 'bg-orange-500/8 border-orange-500/20',text: 'text-orange-400',label: 'Proche du seuil', icon: <TrendingDown className="w-4 h-4 text-orange-400" /> },
    }[variant]

    const shortage = variant === 'critical' ? p.min_stock - p.stock : 0

    return (
      <div className={`flex items-center gap-4 p-4 ${config.bg} border rounded-xl`}>
        <div className="flex-shrink-0">{config.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="text-slate-200 font-medium text-sm truncate">{p.name}</div>
          <div className="text-slate-500 text-xs font-mono">{p.barcode} · {p.category}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className={`${config.text} font-mono font-bold text-sm`}>
            {p.stock} / {p.min_stock} min
          </div>
          {variant === 'critical' && (
            <div className="text-red-500 text-xs font-mono">−{shortage} à commander</div>
          )}
          {variant === 'overstock' && (
            <div className="text-amber-500 text-xs font-mono">+{p.stock - (p.max_stock ?? 0)} en excès</div>
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
<<<<<<< HEAD
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const paginatedItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    const totalPages = Math.ceil(items.length / itemsPerPage)

=======
>>>>>>> 681af6f013aef3d5caa7fa6f7e13c0fd885cf425
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${items.length > 0 ? (variant === 'critical' ? 'bg-red-400' : 'bg-amber-400') : 'bg-emerald-400'}`} />
            <span className="text-white font-semibold text-sm">{title}</span>
          </div>
          <span className={`text-xs font-mono px-2.5 py-1 rounded-lg border ${
            items.length > 0
              ? variant === 'critical' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          }`}>
            {items.length} {items.length !== 1 ? 'articles' : 'article'}
          </span>
        </div>
        <div className="p-4 space-y-2">
          {loading ? (
            [...Array(3)].map((_, i) => <div key={i} className="skeleton h-14 w-full" />)
          ) : items.length === 0 ? (
            <p className="text-slate-600 text-sm text-center py-4">{emptyMsg}</p>
          ) : (
<<<<<<< HEAD
            paginatedItems.map(p => <AlertRow key={p.id} p={p} variant={variant} />)
          )}
        </div>
        {!loading && items.length > 0 && totalPages > 1 && (
          <div className="border-t border-slate-800 px-4 pb-2">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
=======
            items.map(p => <AlertRow key={p.id} p={p} variant={variant} />)
          )}
        </div>
>>>>>>> 681af6f013aef3d5caa7fa6f7e13c0fd885cf425
      </div>
    )
  }

  return (
    <>
      <TopBar title="Alertes" subtitle="Surveillance automatique des niveaux de stock" />

      <main className="flex-1 p-6 space-y-5 fade-in">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Critiques',       count: critical.length,  color: 'red',    desc: 'À commander immédiatement' },
            { label: 'Proches du seuil', count: nearMin.length,  color: 'orange', desc: 'Commander bientôt' },
            { label: 'Surstock',         count: overstock.length, color: 'amber',  desc: 'Au-dessus du max' },
          ].map(({ label, count, color, desc }) => (
            <div key={label} className={`bg-slate-900 border rounded-xl p-4 border-${color}-500/20`}>
              <div className={`text-${color}-400 text-2xl font-extrabold font-mono`}>{count}</div>
              <div className="text-white text-sm font-medium mt-0.5">{label}</div>
              <div className="text-slate-500 text-xs">{desc}</div>
            </div>
          ))}
        </div>

        <Section title="🚨 Stock critique" items={critical} variant="critical" emptyMsg="✓ Aucun article en stock critique" />
        <Section title="⚠ Proche du seuil minimum" items={nearMin} variant="nearMin" emptyMsg="✓ Aucun article proche du seuil" />
        <Section title="📦 Surstock" items={overstock} variant="overstock" emptyMsg="✓ Aucun article en surstock" />
      </main>
    </>
  )
}
