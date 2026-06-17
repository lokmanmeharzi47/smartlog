'use client'

import { useState } from 'react'
import { createProduct } from '@/lib/api'
import { X, Package, Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface AddProductModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function AddProductModal({ onClose, onSuccess }: AddProductModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    barcode: '',
    name: '',
    category: '',
    stock: 0,
    min_stock: 0,
    zone: '',
    max_stock: null,
    unit_price: null,
    lead_time_days: null,
    order_cost: null,
    holding_cost_pct: null,
    item_storage_cost: null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createProduct(formData)
      toast.success('Produit ajouté avec succès')
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'ajout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <Package className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-slate-900 font-semibold">Ajouter un produit</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Code / Barcode *
              </label>
              <input
                required
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm placeholder-slate-400 focus:border-primary/30 focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                placeholder="Ex: P-001"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Désignation *
              </label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm placeholder-slate-400 focus:border-primary/30 focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                placeholder="Ex: Ordinateur"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Catégorie
              </label>
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm placeholder-slate-400 focus:border-primary/30 focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                placeholder="Ex: Informatique"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Zone
              </label>
              <input
                name="zone"
                value={formData.zone}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm placeholder-slate-400 focus:border-primary/30 focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                placeholder="Ex: A-01"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Quantité Initiale
              </label>
              <input
                type="number"
                min="0"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm placeholder-slate-400 focus:border-primary/30 focus:ring-1 focus:ring-primary/30 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Seuil Minimum
              </label>
              <input
                type="number"
                min="0"
                name="min_stock"
                value={formData.min_stock}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm placeholder-slate-400 focus:border-primary/30 focus:ring-1 focus:ring-primary/30 outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              {loading ? (
                'Enregistrement...'
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Sauvegarder
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
