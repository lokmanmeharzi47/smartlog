import { supabase } from '@/lib/supabaseClient'
import { AdvancedMetrics } from '../types'

export async function getAdvancedMetrics(): Promise<AdvancedMetrics> {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [movesOutRes, prodsRes, configRes, ordersRes] = await Promise.all([
    supabase
      .from('movements')
      .select('quantity')
      .eq('type', 'OUT')
      .gte('created_at', thirtyDaysAgo.toISOString()),
    supabase
      .from('products')
      .select('*, product_prices(*)'),
    (supabase as any).from('warehouse_config').select('key, value'),
    (supabase as any).from('orders').select('*') // Fetch all to handle variants in code
  ])

  const movesOut = movesOutRes.data ?? []
  const products = (prodsRes.data ?? []) as any[]
  const configs = (configRes.data ?? []).reduce((acc: any, c: any) => ({ ...acc, [c.key]: Number(c.value) }), {} as Record<string, number>)
  const allOrders = ordersRes.data ?? []

  // --- Configuration Defaults ---
  const surface     = configs.warehouse_surface  ?? 1200
  const costPerM2   = configs.cost_per_m2        ?? 850
  const opCount     = configs.operator_count      ?? 8
  const opSalary    = configs.operator_salary     ?? 45000
  const rotationObj = configs.rotation_objective ?? 0.5

  // --- A. Valeur Totale Stock ---
  const stockValue = products.reduce((acc, p) => {
    const price = p.product_prices?.unit_price ?? (Number(p.unit_price) > 0 ? Number(p.unit_price) : 500)
    return acc + ((p.stock || 0) * price)
  }, 0)

  // DEBUG: per-product breakdown
  console.log('Valeur Stock Breakdown:', products.map(p => ({
    name: p.name,
    stock: p.stock,
    price: p.product_prices?.unit_price ?? (Number(p.unit_price) > 0 ? Number(p.unit_price) : 500),
    subtotal: (p.stock || 0) * (p.product_prices?.unit_price ?? (Number(p.unit_price) > 0 ? Number(p.unit_price) : 500))
  })))

  // --- B. Précision RFID ---
  const rfidAccuracy = 100.0

  // --- C. Coût de Stockage ---
  const articleStorageCost = products.reduce((acc, p) => {
    const itemCost = p.product_prices?.item_storage_cost ?? Number(p.item_storage_cost) ?? 2.5
    return acc + ((p.stock || 0) * itemCost)
  }, 0)
  const surfaceCost = (surface * costPerM2 / 100)
  const salaryCost = (opCount * opSalary / 20)
  const storageCost = articleStorageCost + surfaceCost + salaryCost

  // DEBUG: storage cost breakdown
  console.log('Storage Cost Breakdown:', { articleStorageCost, surfaceCost, salaryCost, total: storageCost })

  // --- D. Articles en Surstock ---
  const overstockItemsCount = products.filter(p => {
    const stockMax = p.product_prices?.stock_max ?? p.max_stock
    if (stockMax != null) return p.stock > stockMax
    return p.stock > (p.min_stock || 10) * 3
  }).length

  // --- E. Commandes en Attente ---
  const pendingVariants = ['EN_ATTENTE', 'pending', 'EN ATTENTE']
  const inProgressVariants = ['EN_COURS', 'in_progress', 'EN COURS']
  
  const pendingOrdersList = allOrders.filter((o: any) => 
    pendingVariants.includes(o.status) || inProgressVariants.includes(o.status)
  )
  const pendingOrders = pendingOrdersList.length
  
  // DEBUG: order breakdown
  console.log('Orders Breakdown:', {
    pending: allOrders.filter((o: any) => pendingVariants.includes(o.status)).length,
    in_progress: allOrders.filter((o: any) => inProgressVariants.includes(o.status)).length,
    total: pendingOrders
  })

  // --- 1. Taux de Rotation ---
  const totalSorties = movesOut.reduce((acc, curr) => acc + (curr.quantity || 0), 0)
  const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0)
  const rotationRate = totalStock > 0 ? Number((totalSorties / totalStock).toFixed(2)) : 0

  // --- 3. Mouvements Aujourd'hui ---
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const { count: todayMovements } = await supabase
    .from('movements')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today.toISOString())

  // --- F. Score Santé Stock ---
  const criticalItems = products.filter(p => p.stock <= (p.min_stock || 0)).length
  const lowItems = products.filter(p => p.stock > (p.min_stock || 0) && p.stock <= (p.min_stock || 0) * 1.5).length
  
  let score = 100 - (criticalItems * 12) - (lowItems * 4) - (overstockItemsCount * 3)
  if (rotationRate >= rotationObj) score += 10
  
  const stockHealthScore = Math.max(0, Math.min(100, Math.round(score)))

  return {
    rotationRate,
    stockValue,
    todayMovements: todayMovements || 0,
    rfidAccuracy,
    storageCost,
    overstockItems: overstockItemsCount,
    pendingOrders,
    stockHealthScore
  }
}
