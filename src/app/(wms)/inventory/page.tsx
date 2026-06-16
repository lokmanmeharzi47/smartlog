'use client'

import { useEffect, useState, useCallback } from 'react'
import TopBar from '@/components/layout/TopBar'
import { getProducts } from '@/lib/api'
import { supabase } from '@/lib/supabaseClient'
import type { Product } from '@/types/database'
import toast from 'react-hot-toast'
import { Search, Plus, Package, Loader2 } from 'lucide-react'
import { getStockStatus } from '@/features/inventory/utils/stock'
import StatusBadge from '@/components/ui/StatusBadge'
import { motion } from 'framer-motion'
import PDFExportButton from '@/features/pdf-export/components/PDFExportButton'
import AddProductModal from '@/features/inventory/components/AddProductModal'
import { deleteProduct } from '@/lib/api'
import { Pagination } from '@/components/ui/Pagination'


export default function InventoryPage() {
  const [products, setProducts]   = useState<Product[]>([])
  const [filtered, setFiltered]   = useState<Product[]>([])
  const [search, setSearch]       = useState('')
  const [loading, setLoading]     = useState(true)
  const [page, setPage]           = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'movements' }, load)
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

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le produit "${name}" ?`)) return
    try {
      await deleteProduct(id)
      toast.success('Produit supprimé')
      load()
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la suppression')
    }
  }

  return (
    <>
      <TopBar title="Inventaire" subtitle={`${products.length} produits — Mise à jour temps réel`} />

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
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all shadow-sm"
            />
          </div>

          {/* Stats chips */}
          <div className="flex gap-2 ml-auto">
            <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono px-3 py-1.5 rounded-lg">
              ⚠ {products.filter(p => getStockStatus(p.stock, p.min_stock) === 'CRITICAL').length} critiques
            </span>
            <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono px-3 py-1.5 rounded-lg">
              ⚡ {products.filter(p => getStockStatus(p.stock, p.min_stock) === 'LOW').length} faibles
            </span>
            <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono px-3 py-1.5 rounded-lg">
              ✓ {products.filter(p => getStockStatus(p.stock, p.min_stock) === 'OK').length} OK
            </span>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Ajouter produit
            </button>
            <PDFExportButton />
          </div>
        </div>

        {/* Table / Cards */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm block md:table">
              <thead className="hidden md:table-header-group">
                <tr className="border-b border-slate-200 bg-slate-50">
                  {['Code', 'Désignation', 'Catégorie', 'Quantité', 'Seuil min', 'Zone', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-bold uppercase tracking-[0.25em] text-slate-400 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="block md:table-row-group">
                {loading ? (
                  [...Array(8)].map((_, i) => (
                    <tr key={i} className="block md:table-row border-b border-slate-200 p-4 md:p-0">
                      {[...Array(8)].map((_, j) => (
                        <td key={j} className="block md:table-cell px-2 py-2 md:px-5 md:py-4">
                          <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : paginated.length === 0 ? (
                  <tr className="block md:table-row">
                    <td colSpan={8} className="block md:table-cell px-5 py-12 text-center text-slate-600">
                      <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      {search ? 'Aucun produit trouvé' : 'Aucun produit'}
                    </td>
                  </tr>
                ) : (
                  paginated.map((p) => {
                    const status = getStockStatus(p.stock, p.min_stock)
                    const pct = p.max_stock
                      ? Math.min(100, Math.round((p.stock / p.max_stock) * 100))
                      : null
                    const barColor = status === 'CRITICAL' ? 'bg-red-500' : status === 'LOW' ? 'bg-orange-400' : 'bg-secondary'

                    return (
                      <tr key={p.id} className="block md:table-row border-b border-slate-200 hover:bg-slate-50 transition-all duration-300 group p-4 md:p-0">
                        <td className="flex justify-between items-center md:table-cell px-2 py-2 md:px-5 md:py-4">
                          <span className="md:hidden text-xs text-slate-500 uppercase font-bold tracking-wider">Code</span>
                          <span className="font-mono text-secondary">{p.barcode}</span>
                        </td>
                        <td className="flex justify-between items-center md:table-cell px-2 py-2 md:px-5 md:py-4">
                          <span className="md:hidden text-xs text-slate-500 uppercase font-bold tracking-wider">Désignation</span>
                          <span className="font-semibold text-primary line-clamp-2 md:line-clamp-none text-right md:text-left">{p.name}</span>
                        </td>
                        <td className="flex justify-between items-center md:table-cell px-2 py-2 md:px-5 md:py-4">
                          <span className="md:hidden text-xs text-slate-500 uppercase font-bold tracking-wider">Catégorie</span>
                          <span className="bg-slate-100 text-slate-600 rounded-lg px-3 py-1 whitespace-nowrap">
                            {p.category ?? '—'}
                          </span>
                        </td>
                        <td className="flex justify-between items-center md:table-cell px-2 py-2 md:px-5 md:py-4">
                          <span className="md:hidden text-xs text-slate-500 uppercase font-bold tracking-wider">Quantité</span>
                          <div className="flex flex-col gap-1.5 items-end md:items-start">
                            <span className={`font-mono text-sm ${status === 'CRITICAL' ? 'text-red-500' : status === 'LOW' ? 'text-orange-500' : 'text-primary'}`}>
                              {p.stock}
                            </span>
                            {pct !== null && (
                              <div className="w-16 bg-slate-200 rounded-full h-1 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ duration: 1, ease: 'easeOut' }}
                                  className={`h-full rounded-full transition-colors duration-500 ${barColor}`}
                                />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="flex justify-between items-center md:table-cell px-2 py-2 md:px-5 md:py-4">
                          <span className="md:hidden text-xs text-slate-500 uppercase font-bold tracking-wider">Seuil min</span>
                          <span className="text-slate-500 font-mono">{p.min_stock}</span>
                        </td>
                        <td className="flex justify-between items-center md:table-cell px-2 py-2 md:px-5 md:py-4">
                          <span className="md:hidden text-xs text-slate-500 uppercase font-bold tracking-wider">Zone</span>
                          <span className="bg-secondary/10 text-secondary border border-secondary/20 rounded-lg px-2.5 py-1 text-xs whitespace-nowrap">
                            {p.zone ?? 'A-01'}
                          </span>
                        </td>
                        <td className="flex justify-between items-center md:table-cell px-2 py-2 md:px-5 md:py-4">
                          <span className="md:hidden text-xs text-slate-500 uppercase font-bold tracking-wider">Statut</span>
                          <StatusBadge 
                            status={status === 'CRITICAL' ? 'error' : status === 'LOW' ? 'warning' : 'success'} 
                            label={status} 
                          />
                        </td>
                        <td className="flex justify-between items-center md:table-cell px-2 py-2 md:px-5 md:py-4">
                          <span className="md:hidden text-xs text-slate-500 uppercase font-bold tracking-wider">Actions</span>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
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
            <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-slate-500 text-xs font-mono">
                {filtered.length} résultats
              </span>
              <Pagination 
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />

            </div>
          )}
        </div>
      </main>

      {isAddModalOpen && (
        <AddProductModal 
          onClose={() => setIsAddModalOpen(false)} 
          onSuccess={() => {
            setIsAddModalOpen(false)
            load()
          }} 
        />
      )}
    </>
  )
}
