import { supabase } from '@/lib/supabaseClient'
import { fetchPredictions } from '@/features/predictive-ai/services/predictive.service'

export interface ReportDashboardData {
  totalStock: number
  totalStockValue: number
  coverageRate: number
  stockHealthScore: number
  rotationRate: number
  pendingOrders: number
  todayMovements: number
  criticalProducts: number
  
  // Charts
  stockValueByCategory: { name: string; value: number }[]
  inventoryDistribution: { name: string; value: number }[]
  monthlyMovements: { name: string; in: number; out: number }[]
}

export async function fetchReportDashboard(): Promise<ReportDashboardData> {
  // 1. Fetch data
  const [prodsRes, movRes, predictions] = await Promise.all([
    supabase.from('products').select('*'),
    supabase.from('movements').select('*'),
    fetchPredictions()
  ])

  const products = prodsRes.data ?? []
  const movements = movRes.data ?? []

  // 2. Base metrics
  const totalItems = products.length
  let totalStock = 0
  let totalStockValue = 0
  
  const categoryValues: Record<string, number> = {}
  
  products.forEach(p => {
    totalStock += p.stock
    const val = p.stock * (p.unit_price ?? 0)
    totalStockValue += val
    
    const cat = p.category ?? 'Autre'
    categoryValues[cat] = (categoryValues[cat] || 0) + val
  })

  // 3. Statuses (from predictions)
  const critical = predictions.filter(p => p.stock <= p.minStock).length
  const low = predictions.filter(p => p.stock > p.minStock && p.stock <= p.minStock * 1.5).length
  const overstock = predictions.filter(p => p.stock > p.minStock * 3).length
  const okItems = totalItems - critical - low - overstock

  const coverageRate = totalItems > 0 ? (okItems / totalItems) * 100 : 0

  // 4. Movements and Rotation
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  let outputsLast30Days = 0
  
  const todayStr = new Date().toISOString().split('T')[0]
  let todayMovements = 0

  movements.forEach(m => {
    const d = new Date(m.created_at ?? '')
    if (d >= thirtyDaysAgo && m.type === 'OUT') {
      outputsLast30Days += m.quantity
    }
    if (m.created_at?.startsWith(todayStr)) {
      todayMovements++
    }
  })

  const rotationRate = totalStock > 0 ? outputsLast30Days / totalStock : 0

  // 5. Stock Health Score
  let score = 100 - (critical * 12) - (low * 4) - (overstock * 3)
  if (rotationRate >= 0.1) score += 10 // target rotation = 10%
  const stockHealthScore = Math.max(0, Math.min(100, score))

  // 6. Charts prep
  const stockValueByCategory = Object.entries(categoryValues).map(([name, value]) => ({ name, value }))
  
  const inventoryDistribution = [
    { name: 'Critique', value: critical },
    { name: 'Faible', value: low },
    { name: 'OK', value: okItems },
    { name: 'Surstock', value: overstock },
  ]

  // Calculate actual monthly movements for the last 6 months
  const monthlyData: Record<string, { in: number, out: number }> = {}
  const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
  
  // Initialize last 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    monthlyData[key] = { in: 0, out: 0 }
  }

  movements.forEach(m => {
    if (!m.created_at) return
    const d = new Date(m.created_at)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    if (monthlyData[key]) {
      if (m.type === 'IN') monthlyData[key].in += m.quantity
      if (m.type === 'OUT') monthlyData[key].out += m.quantity
    }
  })

  const monthlyMovements = Object.entries(monthlyData).map(([key, data]) => {
    const [year, month] = key.split('-').map(Number)
    return {
      name: monthNames[month],
      in: data.in,
      out: data.out
    }
  })

  return {
    totalStock,
    totalStockValue,
    coverageRate: Math.round(coverageRate),
    stockHealthScore: Math.round(stockHealthScore),
    rotationRate: Math.round(rotationRate * 100) / 100,
    pendingOrders: 12, // Mocked pending orders since there's no orders table
    todayMovements,
    criticalProducts: critical,
    stockValueByCategory,
    inventoryDistribution,
    monthlyMovements,
  }
}
