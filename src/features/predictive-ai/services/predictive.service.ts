import { supabase } from '@/lib/supabaseClient'
import { calculateWMA, calculateForecast, calculateDaysRemaining, estimateStockoutDate, estimateThresholdDate } from '../utils/wma'
import { calculateConfidence } from '../utils/confidence'
import { getPredictionStatus } from '../utils/forecast'
import type { Prediction } from '../types'

type ProductRow = {
  id: string
  name: string
  barcode: string
  stock: number
  min_stock: number
}

type MovementRow = {
  product_id: string
  quantity: number
  created_at: string | null
}

export async function fetchPredictions(): Promise<Prediction[]> {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const [prodsRes, movRes] = await Promise.all([
    supabase.from('products').select('id, name, barcode, stock, min_stock'),
    supabase
      .from('movements')
      .select('product_id, quantity, created_at')
      .eq('type', 'OUT')
      .gte('created_at', sevenDaysAgo.toISOString()),
  ])

  const products: ProductRow[] = (prodsRes.data ?? []) as ProductRow[]
  const movements: MovementRow[] = (movRes.data ?? []) as MovementRow[]

  // Build daily consumption map per product
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - 6 + i)
    return d.toISOString().split('T')[0]
  })

  const grouped: Record<string, Record<string, number>> = {}
  movements.forEach((m) => {
    const date = (m.created_at ?? '').split('T')[0]
    if (!grouped[m.product_id]) grouped[m.product_id] = {}
    grouped[m.product_id][date] = (grouped[m.product_id][date] || 0) + m.quantity
  })

  return products.map((p) => {
    const history = dates.map((d) => grouped[p.id]?.[d] ?? 0)
    const wma = calculateWMA(history)
    const daysRemaining = calculateDaysRemaining(p.stock, wma)
    const confidence = calculateConfidence(history)
    const stockoutDate = estimateStockoutDate(daysRemaining)
    const thresholdDate = estimateThresholdDate(p.stock, p.min_stock, wma)
    const status = getPredictionStatus(daysRemaining)

    return {
      productId: p.id,
      productName: p.name,
      barcode: p.barcode,
      stock: p.stock,
      minStock: p.min_stock,
      wma: Math.round(wma * 10) / 10,
      forecast7d: calculateForecast(wma, 7),
      forecast14d: calculateForecast(wma, 14),
      daysRemaining: daysRemaining >= 999 ? 999 : daysRemaining,
      confidence,
      stockoutDate,
      thresholdDate,
      status,
    }
  })
}
