'use client'

import { useState } from 'react'
import TopBar from '@/components/layout/TopBar'
import { getProductByBarcode, createMovement } from '@/lib/api'
import type { Product } from '@/types/database'
import toast from 'react-hot-toast'
import { 
  ScanLine, ArrowUp, ArrowDown, Plus, Minus, 
  XCircle, Loader2, QrCode, CheckCircle, Radio
} from 'lucide-react'

// Features
import { useQRScanner } from '@/features/scan/hooks/useQRScanner'
import { ScanModal } from '@/features/scan/components/ScanModal'
import { ProductPreview } from '@/features/scan/components/ProductPreview'

type MovType = 'IN' | 'OUT'

export default function ScanPage() {
  const [activeTab, setActiveTab] = useState<'MANUAL' | 'RFID'>('MANUAL')
  const [isRfidActive, setIsRfidActive] = useState(false)
  const [rfidItems, setRfidItems] = useState<string[]>([])
  const [barcode, setBarcode]   = useState('')
  const [qty, setQty]           = useState(1)
  const [type, setType]         = useState<MovType>('IN')
  const [note, setNote]         = useState('')
  const [product, setProduct]   = useState<Product | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [searching, setSearching] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // QR Scanner Hook
  const { isScanning, openScanner, closeScanner, handleScanSuccess } = useQRScanner()

  async function handleSearch(e?: React.FormEvent, manualCode?: string) {
    if (e) e.preventDefault()
    const codeToSearch = (manualCode || barcode).trim()
    if (!codeToSearch) return

    setSearching(true)
    setNotFound(false)
    setProduct(null)
    try {
      const p = await getProductByBarcode(codeToSearch)
      if (p) {
        setProduct(p)
        setBarcode(p.barcode)
        toast.success(`Produit identifié : ${p.name}`)
      } else {
        setNotFound(true)
        toast.error('Produit introuvable')
      }
    } catch {
      toast.error('Erreur de recherche')
    } finally {
      setSearching(false)
    }
  }

  const onQRScanSuccess = async (code: string) => {
    const p = await handleScanSuccess(code)
    if (p) {
        setProduct(p)
        setBarcode(p.barcode)
    } else {
        setNotFound(true)
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
      <TopBar title="Scan & Mouvement" subtitle="Scanner un produit ou saisie manuelle" />

      <main className="flex-1 p-6 flex justify-center fade-in">
        <div className="w-full max-w-lg space-y-6">

          {/* Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-2xl shadow-inner">
            <button
              onClick={() => setActiveTab('MANUAL')}
              className={`flex-1 py-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${
                activeTab === 'MANUAL'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Mode Manuel (Code-Barres)
            </button>
            <button
              onClick={() => setActiveTab('RFID')}
              className={`flex-1 py-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'RFID'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Radio className="w-4 h-4 hidden sm:block" />
              Portique RFID (UHF)
            </button>
          </div>

          {activeTab === 'MANUAL' && (
            <>
              {/* Step 1: Identification */}
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl rounded-full" />

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center shadow-sm">
                <ScanLine className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h2 className="text-primary font-bold text-lg tracking-tight">Étape 1 — Identifier le produit</h2>
                <p className="text-slate-500 text-xs font-medium">Saisissez ou scannez le code du produit</p>
              </div>
            </div>

            <div className="space-y-4">
              <form onSubmit={(e) => handleSearch(e)} className="flex gap-2">
                <input
                  id="barcode-input"
                  type="text"
                  value={barcode}
                  onChange={e => setBarcode(e.target.value)}
                  placeholder="Ex: P-0001, SL-001..."
                  className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-mono text-sm placeholder-slate-400 focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all shadow-sm"
                />
                <button
                  type="submit"
                  disabled={searching || !barcode.trim()}
                  id="barcode-search"
                  className="px-6 py-4 bg-primary hover:bg-primary/90 border border-transparent disabled:bg-slate-200 disabled:border-slate-200 disabled:text-slate-400 text-white font-bold rounded-2xl text-xs uppercase tracking-widest transition-all flex items-center gap-2 disabled:cursor-not-allowed group shadow-sm"
                >
                  {searching ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <ScanLine className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />}
                  <span>Chercher</span>
                </button>
              </form>

              {/* QR Scan Button */}
              <button
                onClick={openScanner}
                className="w-full flex items-center justify-center gap-3 bg-secondary/5 border border-secondary/20 text-secondary rounded-2xl px-6 py-5 backdrop-blur-xl hover:bg-secondary/10 hover:shadow-[0_0_20px_rgba(0,153,224,0.15)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] group"
              >
                <div className="p-2 bg-secondary/10 rounded-lg group-hover:bg-secondary/20 transition-colors">
                  <QrCode className="w-5 h-5 text-secondary" />
                </div>
                <span className="font-bold text-sm uppercase tracking-[0.2em]">
                  <span className="hidden md:inline">Scanner QR Code</span>
                  <span className="md:hidden">Scan QR Code</span>
                </span>
              </button>
            </div>

            {/* Error Result */}
            {notFound && (
              <div className="mt-6 flex items-center gap-4 p-5 bg-rose-500/5 border border-rose-500/10 rounded-2xl animate-shake">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-5 h-5 text-rose-400" />
                </div>
                <p className="text-rose-400 text-sm font-medium">Code introuvable. Veuillez vérifier ou saisir manuellement.</p>
              </div>
            )}

            {/* Success Result */}
            {product && <ProductPreview product={product} />}
          </div>

          {/* Step 2: Movement details */}
          {product && (
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 space-y-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full" />

              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center shadow-sm">
                  <ArrowUp className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-primary font-bold text-lg tracking-tight">Étape 2 — Définir le mouvement</h2>
                  <p className="text-slate-500 text-xs font-medium">Choisissez l&apos;action et la quantité</p>
                </div>
              </div>

              {/* IN / OUT toggle */}
              <div className="grid grid-cols-2 gap-3">
                {(['IN', 'OUT'] as MovType[]).map(t => (
                  <button
                    key={t}
                    id={`type-${t.toLowerCase()}`}
                    onClick={() => setType(t)}
                    className={`flex flex-col items-center justify-center gap-3 py-5 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest border-2 transition-all duration-300 ${
                      type === t
                        ? t === 'IN'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm'
                          : 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:text-slate-700'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${type === t ? 'bg-current opacity-20' : 'bg-slate-200'}`}>
                      {t === 'IN' ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
                    </div>
                    {t === 'IN' ? '📥 Entrée (IN)' : '📤 Sortie (OUT)'}
                  </button>
                ))}
              </div>

              {/* Quantity Selector */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
                <label className="block text-[10px] font-black uppercase tracking-[3px] text-slate-500 mb-6 text-center">
                  Quantité à enregistrer
                </label>
                <div className="flex items-center justify-center gap-8">
                  <button
                    id="qty-minus"
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-14 h-14 rounded-2xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700 flex items-center justify-center transition-all shadow-sm active:scale-90"
                  >
                    <Minus className="w-6 h-6" />
                  </button>
                  <div className="flex flex-col items-center">
                    <span className="text-primary text-5xl font-black font-mono tracking-tighter">{qty}</span>
                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">unités</span>
                  </div>
                  <button
                    id="qty-plus"
                    onClick={() => setQty(q => q + 1)}
                    className="w-14 h-14 rounded-2xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700 flex items-center justify-center transition-all shadow-sm active:scale-90"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Note input */}
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-[3px] text-slate-500 ml-4">
                  Note ou référence externe
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Ex: Commande #1234, retour fournisseur…"
                  className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 text-sm placeholder-slate-400 focus:border-secondary/50 outline-none transition-all shadow-sm"
                />
              </div>

              {/* Stock preview */}
              <div className={`p-6 rounded-3xl border transition-all duration-500 ${
                !stockAfterOk
                  ? 'bg-rose-500/5 border-rose-500/20'
                  : newStock !== null && product.min_stock && newStock < product.min_stock
                  ? 'bg-amber-500/5 border-amber-500/20'
                  : 'bg-emerald-500/[0.02] border-emerald-500/10'
              }`}>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Projection Stock</span>
                    {!stockAfterOk && <span className="text-rose-400 text-[10px] font-bold uppercase tracking-widest animate-pulse">⚠ Stock insuffisant</span>}
                    {stockAfterOk && newStock !== null && product.min_stock && newStock < product.min_stock && (
                        <span className="text-amber-400 text-[10px] font-bold uppercase tracking-widest animate-pulse">⚠ Sous seuil minimum</span>
                    )}
                </div>
                
                <div className="flex items-center justify-center gap-6">
                  <div className="text-center">
                      <p className="text-slate-500 text-[9px] uppercase font-bold mb-1">Actuel</p>
                      <span className="text-slate-600 font-mono text-xl">{product.stock}</span>
                  </div>
                  <div className="text-slate-300">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                      <p className="text-slate-600 text-[9px] uppercase font-bold mb-1">Final</p>
                      <span className={`font-mono font-black text-3xl ${!stockAfterOk ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {newStock}
                      </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="submit-movement"
                onClick={handleSubmit}
                disabled={submitting || !stockAfterOk}
                className="w-full py-5 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-primary/20 disabled:shadow-none flex items-center justify-center gap-3 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                Valider le mouvement
              </button>
            </div>
          )}
          </>
          )}

          {activeTab === 'RFID' && (
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl rounded-full" />
              
              <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                <div className={`absolute inset-0 border-2 border-secondary/20 rounded-full transition-all duration-1000 ${isRfidActive ? 'animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]' : ''}`} />
                <div className={`absolute inset-2 border-2 border-secondary/40 rounded-full transition-all duration-1000 delay-150 ${isRfidActive ? 'animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]' : ''}`} />
                <Radio className={`w-16 h-16 relative z-10 transition-all duration-500 ${isRfidActive ? 'text-secondary scale-110' : 'text-slate-300'}`} />
              </div>

              <h2 className="text-primary font-bold text-xl mb-2">Lecteur Impinj R700</h2>
              <p className="text-slate-500 text-sm mb-8">
                Placez les articles dans la zone de lecture du portique.
              </p>
              
              {!isRfidActive && rfidItems.length === 0 && (
                <button
                  onClick={() => {
                    setIsRfidActive(true)
                    setTimeout(() => {
                      setIsRfidActive(false)
                      setRfidItems(['P-0001 (Palette A)', 'P-0002 (Carton B)', 'P-0003 (Carton B)', 'P-0004 (Vrac)', 'P-0005 (Vrac)', 'P-0006 (Carton C)'])
                      toast.success('6 articles détectés instantanément !')
                    }, 2000)
                  }}
                  className="px-8 py-4 bg-secondary text-white font-bold rounded-2xl text-sm uppercase tracking-widest hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Activer Portique RFID
                </button>
              )}

              {isRfidActive && (
                <div className="flex flex-col items-center animate-in fade-in">
                  <p className="text-secondary font-bold mb-2">Scan des ondes UHF en cours...</p>
                  <p className="text-slate-400 text-xs font-mono">FRQ: 865.6 MHz - PWR: 30.0 dBm</p>
                </div>
              )}

              {rfidItems.length > 0 && (
                <div className="text-left animate-in fade-in slide-in-from-bottom-4 mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-700">{rfidItems.length} articles détectés en 0.2s</h3>
                    <button 
                      onClick={() => setRfidItems([])}
                      className="text-xs text-rose-500 font-bold hover:text-rose-600 transition-colors"
                    >
                      Réinitialiser
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-auto pr-2 custom-scrollbar">
                    {rfidItems.map((id, i) => (
                      <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between shadow-sm" style={{ animationDelay: `${i * 50}ms` }}>
                        <div className="flex items-center gap-3">
                            <Radio className="w-4 h-4 text-secondary/50" />
                            <span className="font-mono text-sm text-slate-700 font-medium">{id}</span>
                        </div>
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-6 py-4 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold rounded-2xl text-sm uppercase tracking-widest transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
                    <CheckCircle className="w-5 h-5" />
                    Valider le lot
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* QR Scan Modal */}
      <ScanModal 
        isOpen={isScanning} 
        onClose={closeScanner} 
        onScanSuccess={onQRScanSuccess} 
      />
    </>
  )
}

function ArrowRight(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
    )
}
