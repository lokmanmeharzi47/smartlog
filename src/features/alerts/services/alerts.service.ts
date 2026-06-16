import { fetchPredictions } from '@/features/predictive-ai/services/predictive.service'
import type { Prediction } from '@/features/predictive-ai/types'

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO'
export type AlertType = 'CRITICAL_STOCK' | 'WARNING_STOCK' | 'PREDICTIVE' | 'OVERSTOCK'

export interface Alert {
  id: string
  productId: string
  productName: string
  sku: string
  type: AlertType
  severity: AlertSeverity
  currentStock: number
  threshold: number
  message: string
  recommendedAction: string
  createdAt: string
}

export async function fetchAlerts(): Promise<Alert[]> {
  const predictions = await fetchPredictions()
  const alerts: Alert[] = []
  const now = new Date().toISOString()

  for (const p of predictions) {
    const { productId, productName, barcode: sku, stock, minStock } = p
    const maxStock = minStock * 3 // Fallback rule for maxStock if not defined

    // 1. Critical Alert: stock <= minStock
    if (stock <= minStock) {
      alerts.push({
        id: `${productId}-critical`,
        productId,
        productName,
        sku,
        type: 'CRITICAL_STOCK',
        severity: 'CRITICAL',
        currentStock: stock,
        threshold: minStock,
        message: 'Stockout imminent.',
        recommendedAction: 'Order immediately.',
        createdAt: now
      })
    } 
    // 2. Warning Alert: stock <= minStock * 1.5
    else if (stock <= minStock * 1.5) {
      alerts.push({
        id: `${productId}-warning`,
        productId,
        productName,
        sku,
        type: 'WARNING_STOCK',
        severity: 'WARNING',
        currentStock: stock,
        threshold: minStock * 1.5,
        message: 'Replenishment should be planned.',
        recommendedAction: 'Prepare order.',
        createdAt: now
      })
    }

    // 3. Predictive Alert: daysRemaining < 7
    if (p.daysRemaining < 7 && stock > 0) {
      alerts.push({
        id: `${productId}-predictive`,
        productId,
        productName,
        sku,
        type: 'PREDICTIVE',
        severity: 'WARNING',
        currentStock: stock,
        threshold: 7, // days
        message: `Predicted stockout in ${p.daysRemaining} days.`,
        recommendedAction: 'Review forecast and order.',
        createdAt: now
      })
    }

    // 4. Overstock Alert: stock > maxStock
    if (stock > maxStock) {
      alerts.push({
        id: `${productId}-overstock`,
        productId,
        productName,
        sku,
        type: 'OVERSTOCK',
        severity: 'INFO',
        currentStock: stock,
        threshold: maxStock,
        message: 'Excess inventory detected.',
        recommendedAction: 'Hold orders, consider discount.',
        createdAt: now
      })
    }
  }

  return alerts
}
