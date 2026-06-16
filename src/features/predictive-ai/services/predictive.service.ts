import { supabase } from '@/lib/supabaseClient'
import { calculateWMA, calculateForecast, calculateDaysRemaining, estimateStockoutDate, estimateThresholdDate } from '../utils/wma'
import { calculateConfidence } from '../utils/confidence'
import { getPredictionStatus } from '../utils/forecast'
import type { Prediction } from '../types'

import { calculateZScore, getAnomalyLevel, calculateEOQ, calculateSafetyStock, classifyABC } from '../utils/advanced'

type ProductRow = {
  id: string
  name: string
  barcode: string
  stock: number
  min_stock: number
  unit_price: number | null
  lead_time_days: number | null
  order_cost: number | null
  holding_cost_pct: number | null
}

type MovementRow = {
  product_id: string
  quantity: number
  created_at: string | null
}

export async function fetchPredictions(): Promise<Prediction[]> {
  // Always anchor to NOW() so newly added products' demo movements are always captured
  const anchorDate = new Date()

  const sevenDaysAgo = new Date(anchorDate)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const [prodsRes, movRes] = await Promise.all([
    supabase.from('products').select('id, name, barcode, stock, min_stock, unit_price, lead_time_days, order_cost, holding_cost_pct'),
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
    const d = new Date(anchorDate)
    d.setDate(d.getDate() - 6 + i)
    return d.toISOString().split('T')[0]
  })

  const grouped: Record<string, Record<string, number>> = {}
  movements.forEach((m) => {
    const date = (m.created_at ?? '').split('T')[0]
    if (!grouped[m.product_id]) grouped[m.product_id] = {}
    grouped[m.product_id][date] = (grouped[m.product_id][date] || 0) + m.quantity
  })

  // Pre-calculate to run ABC classification
  const intermediate = products.map(p => {
    const history = dates.map((d) => grouped[p.id]?.[d] ?? 0)
    const wma = calculateWMA(history)
    const annualDemand = wma * 365
    const unitPrice = p.unit_price ?? 0
    const annualValue = annualDemand * unitPrice
    return { p, history, wma, annualDemand, unitPrice, annualValue }
  })

  const abcClassifications = classifyABC(intermediate.map(i => ({ id: i.p.id, annualValue: i.annualValue })))

  return intermediate.map(({ p, history, wma, annualDemand, unitPrice, annualValue }) => {
    const daysRemaining = calculateDaysRemaining(p.stock, wma)
    const confidence = calculateConfidence(history)
    const stockoutDate = estimateStockoutDate(daysRemaining)
    const thresholdDate = estimateThresholdDate(p.stock, p.min_stock, wma)
    const status = getPredictionStatus(daysRemaining)

    // Advanced Metrics
    const mean = history.reduce((a, b) => a + b, 0) / 7
    const variance = history.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / 7
    const stdDev = Math.sqrt(variance)

    const latestValue = history[history.length - 1] ?? 0
    const zScore = calculateZScore(latestValue, mean, stdDev)
    const anomalyLevel = getAnomalyLevel(zScore)
    
    const leadTime = p.lead_time_days ?? 14
    const orderCost = p.order_cost ?? 50
    const holdingCostPct = p.holding_cost_pct ?? 0.20
    
    const eoq = calculateEOQ(annualDemand, orderCost, holdingCostPct, unitPrice)
    const safetyStock = calculateSafetyStock(stdDev, leadTime)

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

      unitPrice,
      annualDemand,
      annualValue,
      abcClass: abcClassifications[p.id],
      eoq,
      safetyStock,
      zScore: Math.round(zScore * 100) / 100,
      anomalyLevel,
    }
  })
}
