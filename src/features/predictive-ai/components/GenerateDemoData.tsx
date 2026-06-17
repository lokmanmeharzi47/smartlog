'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Loader2, Database } from 'lucide-react'
import toast from 'react-hot-toast'

export default function GenerateDemoData() {
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const { data: products, error: pErr } = await supabase.from('products').select('id, stock')
      if (pErr) throw pErr
      if (!products || products.length === 0) throw new Error("Aucun produit trouvé.")

      const now = new Date()
      const movements = []

      // Generate OUT movements for all products over the last 7 days
      for (const product of products) {
        for (let i = 0; i < 7; i++) {
          if (Math.random() > 0.1) {
            const qty = Math.floor(Math.random() * 25) + 5 // 5 to 30 items
            const date = new Date(now)
            date.setDate(now.getDate() - i)
            
            movements.push({
              product_id: product.id,
              type: 'OUT',
              quantity: qty,
              created_at: date.toISOString(),
              note: 'Auto-généré pour démo IA'
            })
          }
        }
      }

      const { error: mErr } = await supabase.from('movements').insert(movements)
      if (mErr) throw mErr

      toast.success(`${movements.length} mouvements générés avec succès ! Rechargez la page.`)
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la génération')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full backdrop-blur-sm transition-all hover:bg-primary/20 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 text-primary animate-spin" />
      ) : (
        <Database className="w-4 h-4 text-primary" />
      )}
      <span className="text-primary text-xs font-bold tracking-wider uppercase">Générer Historique (Démo)</span>
    </button>
  )
}
