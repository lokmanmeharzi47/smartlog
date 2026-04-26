'use client'

import { useEffect, useState, useCallback } from 'react'
import Topbar from '@/components/Topbar'
import { getProducts, deleteProduct } from '@/lib/api'
import { supabase } from '@/lib/supabaseClient'
import type { Product } from '@/types/database'
import toast from 'react-hot-toast'
import { Search, Plus, Trash2, AlertTriangle, Package, Loader2 } from 'lucide-react'

export default function InventoryPage() {
  const [products, setProducts]   = useState<Product[]>([])
  const [filtered, setFiltered]   = useState<Product[]>([])
  const [search, setSearch]       = useState('')
  const [loading, setLoading]     = useState(true)
  const [deleting, setDeleting]   = useState<string | null>(null)
  const [page, setPage]           = useState(1)
  const perPage = 15

  const load = useCallback(async () => {
    try {
      const data = await getProducts()
      setProducts(data)
      setFiltered(data)
    } catch {
      toast.error('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const ch = supabase
      .channel('inventory-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, load)
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [load])

  // Filter on search
  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      q ? products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.barcode.toLowerCase().includes(q) ||
        (p.category ?? '').toLowerCase().includes(q)
      ) : products
    )
    setPage(1)
  }, [search, products])

  const paginated = filtered.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.ceil(filtered.length / perPage)

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Supprimer "${name}" ?`)) return
    setDeleting(id)
    try {
      await deleteProduct(id)
      toast.success(`"${name}" supprimé`)
    } catch {
      toast.error('Suppression impossible')
    } finally {
      setDeleting(null)
    }
  }

  function stockStatus(p: Product) {
    if (p.stock < p.min_stock) return 'critical'
    if (p.max_stock && p.stock > p.max_stock) return 'overstock'
    return 'ok'
  }

  const statusBadge: Record<string, string> = {
    critical:  'bg-red-500/15 text-red-400 border-red-500/20',
    overstock: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    ok:        'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  }
  const statusLabel: Record<string, string> = {
    critical: 'Critique', overstock: 'Surstock', ok: 'OK',
  }

  return (
    <>
      <Topbar title="Inventaire" subtitle={`${products.length} produits — Mise à jour temps réel`} />

      <main className="flex-1 p-6 fade-in">
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="inventory-search"
              type="text"
              placeholder="Rechercher par nom, code, catégorie…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-sm placeholder-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
            />
          </div>

          {/* Stats chips */}
          <div className="flex gap-2 ml-auto">
            <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono px-3 py-1.5 rounded-lg">
              ⚠ {products.filter(p => p.stock < p.min_stock).length} critiques
            </span>
            <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono px-3 py-1.5 rounded-lg">
              ✓ {products.filter(p => p.stock >= p.min_stock).length} OK
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40">
                  {['Produit', 'Code-barres', 'Catégorie', 'Stock', 'Stock min', 'Statut', 'Prix unit. (DZD)', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-500 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(8)].map((_, i) => (
                    <tr key={i} className="border-b border-slate-800/40">
                      {[...Array(8)].map((_, j) => (
                        <td key={j} className="px-5 py-3.5">
                          <div className="skeleton h-4 w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-slate-600">
                      <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      {search ? 'Aucun produit trouvé' : 'Aucun produit'}
                    </td>
                  </tr>
                ) : (
                  paginated.map((p) => {
                    const status = stockStatus(p)
                    const pct = p.max_stock
                      ? Math.min(100, Math.round((p.stock / p.max_stock) * 100))
                      : null

                    return (
                      <tr key={p.id} className="border-b border-slate-800/40 hover:bg-slate-800/30 transition-colors group">
                        <td className="px-5 py-3.5 text-slate-200 font-medium">{p.name}</td>
                        <td className="px-5 py-3.5 font-mono text-slate-500 text-xs">{p.barcode}</td>
                        <td className="px-5 py-3.5">
                          <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded font-mono">
                            {p.category ?? '—'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className={`font-mono font-bold ${status === 'critical' ? 'text-red-400' : 'text-slate-200'}`}>
                              {p.stock}
                            </span>
                            {pct !== null && (
                              <div className="w-16 bg-slate-800 rounded-full h-1.5">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    status === 'critical' ? 'bg-red-500' :
                                    status === 'overstock' ? 'bg-amber-500' : 'bg-cyan-500'
                                  }`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">{p.min_stock}</td>
                        <td className="px-5 py-3.5">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${statusBadge[status]}`}>
                            {statusLabel[status]}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">
                          {p.unit_price?.toLocaleString('fr-DZ') ?? '—'}
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            disabled={deleting === p.id}
                            className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all disabled:opacity-50"
                          >
                            {deleting === p.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-slate-500 text-xs font-mono">
                {filtered.length} résultats · Page {page}/{totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white disabled:opacity-40 transition-all"
                >
                  ← Préc.
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white disabled:opacity-40 transition-all"
                >
                  Suiv. →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
