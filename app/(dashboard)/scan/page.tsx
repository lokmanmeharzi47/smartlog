'use client'

import { useState } from 'react'
import Topbar from '@/components/Topbar'
import { getProductByBarcode, createMovement } from '@/lib/api'
import type { Product } from '@/types/database'
import toast from 'react-hot-toast'
import { ScanLine, ArrowUp, ArrowDown, Plus, Minus, CheckCircle, XCircle, Loader2 } from 'lucide-react'

type MovType = 'IN' | 'OUT'

export default function ScanPage() {
  const [barcode, setBarcode]   = useState('')
  const [qty, setQty]           = useState(1)
  const [type, setType]         = useState<MovType>('IN')
  const [note, setNote]         = useState('')
  const [product, setProduct]   = useState<Product | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [searching, setSearching] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!barcode.trim()) return
    setSearching(true)
    setNotFound(false)
    setProduct(null)
    try {
      const p = await getProductByBarcode(barcode.trim())
      if (p) {
        setProduct(p)
        toast.success(`Produit trouvé : ${p.name}`)
      } else {
        setNotFound(true)
        toast.error('Code-barres introuvable')
      }
    } catch {
      toast.error('Erreur de recherche')
    } finally {
      setSearching(false)
    }
  }

  async function handleSubmit() {
    if (!product) return
    setSubmitting(true)
    try {
      await createMovement(product.id, type, qty, note || undefined)
      const action = type === 'IN' ? 'Entrée' : 'Sortie'
      toast.success(`${action} de ${qty} unité(s) enregistrée !`)
      // Reset
      setBarcode('')
      setProduct(null)
      setQty(1)
      setNote('')
      setNotFound(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const newStock = product
    ? type === 'IN'
      ? product.stock + qty
      : product.stock - qty
    : null

  const stockAfterOk = newStock !== null && newStock >= 0

  return (
    <>
      <Topbar title="Scan & Mouvement" subtitle="Saisie manuelle de code-barres" />

      <main className="flex-1 p-6 flex justify-center fade-in">
        <div className="w-full max-w-lg space-y-5">

          {/* Step 1: Barcode search */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center">
                <ScanLine className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-sm">Étape 1 — Identifier le produit</h2>
                <p className="text-slate-500 text-xs">Saisissez le code-barres du produit</p>
              </div>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                id="barcode-input"
                type="text"
                value={barcode}
                onChange={e => setBarcode(e.target.value)}
                placeholder="Ex: P-0001"
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-sm placeholder-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
              />
              <button
                type="submit"
                disabled={searching || !barcode.trim()}
                id="barcode-search"
                className="px-5 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white font-semibold rounded-xl text-sm transition-all flex items-center gap-2 disabled:cursor-not-allowed"
              >
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanLine className="w-4 h-4" />}
                Chercher
              </button>
            </form>

            {/* Result */}
            {notFound && (
              <div className="mt-4 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">Produit introuvable pour ce code-barres.</p>
              </div>
            )}

            {product && (
              <div className="mt-4 p-4 bg-emerald-500/8 border border-emerald-500/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-white font-semibold text-sm">{product.name}</div>
                    <div className="text-slate-400 text-xs font-mono mt-0.5">
                      {product.barcode} · {product.category} · Stock actuel: <span className="text-cyan-400 font-bold">{product.stock}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Movement details (shown only when product found) */}
          {product && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-xl bg-orange-500/15 border border-orange-500/20 flex items-center justify-center">
                  <ArrowUp className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-sm">Étape 2 — Définir le mouvement</h2>
                  <p className="text-slate-500 text-xs">Choisissez l&apos;action et la quantité</p>
                </div>
              </div>

              {/* IN / OUT toggle */}
              <div className="grid grid-cols-2 gap-2">
                {(['IN', 'OUT'] as MovType[]).map(t => (
                  <button
                    key={t}
                    id={`type-${t.toLowerCase()}`}
                    onClick={() => setType(t)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border transition-all ${
                      type === t
                        ? t === 'IN'
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                          : 'bg-red-500/15 border-red-500/30 text-red-400'
                        : 'border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                    }`}
                  >
                    {t === 'IN' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    {t === 'IN' ? 'Entrée (IN)' : 'Sortie (OUT)'}
                  </button>
                ))}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Quantité
                </label>
                <div className="flex items-center gap-4">
                  <button
                    id="qty-minus"
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-white text-3xl font-extrabold font-mono min-w-[60px] text-center">{qty}</span>
                  <button
                    id="qty-plus"
                    onClick={() => setQty(q => q + 1)}
                    className="w-10 h-10 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Note (optionnel)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Ex: Commande #1234, retour fournisseur…"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                />
              </div>

              {/* Stock preview */}
              <div className={`p-4 rounded-xl border ${
                !stockAfterOk
                  ? 'bg-red-500/8 border-red-500/20'
                  : newStock !== null && product.min_stock && newStock < product.min_stock
                  ? 'bg-amber-500/8 border-amber-500/20'
                  : 'bg-slate-800/60 border-slate-700'
              }`}>
                <div className="text-xs text-slate-500 mb-1">Aperçu après mouvement</div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono text-sm">{product.stock}</span>
                  <span className="text-slate-600">→</span>
                  <span className={`font-mono font-bold text-lg ${!stockAfterOk ? 'text-red-400' : 'text-emerald-400'}`}>
                    {newStock}
                  </span>
                  {!stockAfterOk && <span className="text-red-400 text-xs ml-2">⚠ Stock insuffisant</span>}
                  {stockAfterOk && newStock !== null && product.min_stock && newStock < product.min_stock && (
                    <span className="text-amber-400 text-xs ml-2">⚠ Sous le seuil minimum</span>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                id="submit-movement"
                onClick={handleSubmit}
                disabled={submitting || !stockAfterOk}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/20 disabled:shadow-none flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Valider le mouvement
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
