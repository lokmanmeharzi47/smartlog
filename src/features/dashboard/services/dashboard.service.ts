import { supabase } from '@/lib/supabaseClient'
import { AdvancedMetrics } from '../types'

export async function getAdvancedMetrics(): Promise<AdvancedMetrics> {
  // --- 1. Taux de Rotation ---
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [movesOutRes, prodsRes] = await Promise.all([
    supabase
      .from('movements')
      .select('quantity')
      .eq('type', 'OUT')
      .gte('created_at', thirtyDaysAgo.toISOString()),
    supabase.from('products').select('*')
  ])

  const movesOut = movesOutRes.data ?? []
  const products = prodsRes.data ?? []

  const totalSorties = movesOut.reduce((acc, curr) => acc + (curr.quantity || 0), 0)
  const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0)

  const rotationRate = totalStock > 0 ? Number((totalSorties / totalStock).toFixed(2)) : 0

  // --- 2. Valeur Totale Stock ---
  const stockValue = products.reduce((acc, p) => {
    const price = p.unit_price ?? 500
    return acc + ((p.stock || 0) * price)
  }, 0)

  // --- 3. Mouvements Aujourd'hui ---
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const { count: todayMovements } = await supabase
    .from('movements')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today.toISOString())

  // --- 4. Précision RFID (Simulée entre 95 et 100) ---
  const rfidAccuracy = 95 + Math.random() * 5

  // --- 5. Coût de Stockage (Calcul ou simulation) ---
  // Simulation since storage_cost, surface, etc. might not be fully configured in current DB
  const storageCost = 150000 + (totalStock * 15) // Example simulation DZD

  // --- 6. Articles en Surstock ---
  const overstockItems = products.filter(p => {
    if (p.max_stock != null) return p.stock > p.max_stock
    return p.stock > (p.min_stock || 10) * 3
  }).length

  // --- 7. Commandes en attente (Simulation car table non existante dans le schéma actuel) ---
  const pendingOrders = 4

  // --- 8. Score Santé Stock ---
  const criticalItems = products.filter(p => p.stock < (p.min_stock || 0)).length
  const lowItems = products.filter(p => p.stock === (p.min_stock || 0)).length
  
  let score = 100 - (criticalItems * 12) - (lowItems * 4) - (overstockItems * 3)
  if (rotationRate >= 0.5) score += 10 // Objectif config: rotation >= 0.5
  
  const stockHealthScore = Math.max(0, Math.min(100, Math.round(score)))

  return {
    rotationRate,
    stockValue,
    todayMovements: todayMovements || 0,
    rfidAccuracy,
    storageCost,
    overstockItems,
    pendingOrders,
    stockHealthScore
  }
}
