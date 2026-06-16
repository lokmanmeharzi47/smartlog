'use client'

import { useEffect, useState, useCallback } from 'react'
import TopBar from '@/components/layout/TopBar'
import { getProducts } from '@/lib/api'
import { supabase } from '@/lib/supabaseClient'
import type { Product } from '@/types/database'
import toast from 'react-hot-toast'
import { Search, Plus, Package } from 'lucide-react'
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
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ?`)) return
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

      <main className="flex-1 p-4 md:p-6 fade-in max-w-[1600px] mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, code, catégorie…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm placeholder-slate-400 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-red-50 border border-red-200 text-red-500 text-[10px] font-mono px-2.5 py-1 rounded-lg">
              ⚠ {products.filter(p => getStockStatus(p.stock, p.min_stock) === 'CRITICAL').length} critiques
            </span>
            <span className="bg-orange-50 border border-orange-200 text-orange-500 text-[10px] font-mono px-2.5 py-1 rounded-lg">
              ⚡ {products.filter(p => getStockStatus(p.stock, p.min_stock) === 'LOW').length} faibles
            </span>
            <span className="bg-emerald-50 border border-emerald-200 text-emerald-500 text-[10px] font-mono px-2.5 py-1 rounded-lg">
              ✓ {products.filter(p => getStockStatus(p.stock, p.min_stock) === 'OK').length} OK
            </span>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Ajouter
            </button>
            <PDFExportButton />
          </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm block md:table">
              <thead className="hidden md:table-header-group">
                <tr className="border-b border-slate-200 bg-slate-50">
                  {['Code', 'Désignation', 'Catégorie', 'Quantité', 'Seuil min', 'Zone', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="block md:table-row-group">
                {loading ? (
                  [...Array(8)].map((_, i) => (
                    <tr key={i} className="block md:table-row border-b border-slate-200 p-3 md:p-0">
                      {[...Array(8)].map((_, j) => (
                        <td key={j} className="block md:table-cell px-2 py-2 md:px-4 md:py-3">
                          <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : paginated.length === 0 ? (
                  <tr className="block md:table-row">
                    <td colSpan={8} className="block md:table-cell px-4 py-10 text-center text-slate-400">
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
                      <tr key={p.id} className="block md:table-row border-b border-slate-200 hover:bg-slate-50 transition-all p-3 md:p-0">
                        <td className="flex justify-between items-center md:table-cell px-2 py-1.5 md:px-4 md:py-3">
                          <span className="md:hidden text-[10px] text-slate-400 uppercase font-bold">Code</span>
                          <span className="font-mono text-secondary text-xs">{p.barcode}</span>
                        </td>
                        <td className="flex justify-between items-center md:table-cell px-2 py-1.5 md:px-4 md:py-3">
                          <span className="md:hidden text-[10px] text-slate-400 uppercase font-bold">Désignation</span>
                          <span className="font-semibold text-primary text-xs">{p.name}</span>
                        </td>
                        <td className="flex justify-between items-center md:table-cell px-2 py-1.5 md:px-4 md:py-3">
                          <span className="md:hidden text-[10px] text-slate-400 uppercase font-bold">Catégorie</span>
                          <span className="bg-slate-100 text-slate-500 rounded-lg px-2.5 py-0.5 text-[11px]">
                            {p.category ?? '—'}
                          </span>
                        </td>
                        <td className="flex justify-between items-center md:table-cell px-2 py-1.5 md:px-4 md:py-3">
                          <span className="md:hidden text-[10px] text-slate-400 uppercase font-bold">Quantité</span>
                          <div className="flex flex-col gap-1 items-end md:items-start">
                            <span className={`font-mono text-sm ${status === 'CRITICAL' ? 'text-red-500' : status === 'LOW' ? 'text-orange-500' : 'text-primary'}`}>
                              {p.stock}
                            </span>
                            {pct !== null && (
                              <div className="w-14 bg-slate-200 rounded-full h-1 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ duration: 0.8, ease: 'easeOut' }}
                                  className={`h-full rounded-full ${barColor}`}
                                />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="flex justify-between items-center md:table-cell px-2 py-1.5 md:px-4 md:py-3">
                          <span className="md:hidden text-[10px] text-slate-400 uppercase font-bold">Seuil min</span>
                          <span className="text-slate-400 font-mono text-xs">{p.min_stock}</span>
                        </td>
                        <td className="flex justify-between items-center md:table-cell px-2 py-1.5 md:px-4 md:py-3">
                          <span className="md:hidden text-[10px] text-slate-400 uppercase font-bold">Zone</span>
                          <span className="bg-secondary/10 text-secondary border border-secondary/20 rounded-lg px-2 py-0.5 text-[10px]">
                            {p.zone ?? 'A-01'}
                          </span>
                        </td>
                        <td className="flex justify-between items-center md:table-cell px-2 py-1.5 md:px-4 md:py-3">
                          <span className="md:hidden text-[10px] text-slate-400 uppercase font-bold">Statut</span>
                          <StatusBadge
                            status={status === 'CRITICAL' ? 'error' : status === 'LOW' ? 'warning' : 'success'}
                            label={status}
                          />
                        </td>
                        <td className="flex justify-between items-center md:table-cell px-2 py-1.5 md:px-4 md:py-3">
                          <span className="md:hidden text-[10px] text-slate-400 uppercase font-bold">Actions</span>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-slate-400 text-xs font-mono">
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
