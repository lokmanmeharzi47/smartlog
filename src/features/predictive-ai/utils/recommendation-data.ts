import type { Prediction } from '../types'
import type { UrgentItem, OrderItem, OptimItem, ForecastItem, ModalRow } from '../types/recommendation'

export function deriveUrgent(predictions: Prediction[]): UrgentItem[] {
  return predictions
    .filter(p => p.status === 'URGENT')
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 5)
    .map(p => ({
      productId: p.productId,
      productName: p.productName,
      stock: p.stock,
      minStock: p.minStock,
      daysRemaining: p.daysRemaining,
      recommendedQty: p.eoq > 0 ? p.eoq : Math.max(p.minStock * 2 - p.stock, 10),
      abcClass: p.abcClass,
    }))
}

export function deriveOrders(predictions: Prediction[]): OrderItem[] {
  return predictions
    .filter(p => p.status !== 'OK' && p.eoq > 0)
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 5)
    .map(p => ({
      productId: p.productId,
      productName: p.productName,
      stock: p.stock,
      forecast7d: p.forecast7d,
      eoq: p.eoq,
      abcClass: p.abcClass,
    }))
}

export function deriveOptim(predictions: Prediction[]): OptimItem[] {
  const items: OptimItem[] = []
  for (const p of predictions) {
    if (p.stock > p.minStock * 3) {
      const surplusPct = Math.round(((p.stock - p.minStock * 3) / (p.minStock * 3)) * 100)
      items.push({
        productId: p.productId,
        productName: p.productName,
        issue: 'OVERSTOCK',
        detail: `Surstock +${surplusPct}%`,
        recommendation: 'Suspendre les commandes',
        surplusPct,
      })
    } else if (p.wma <= 0.1 && p.stock > p.minStock) {
      items.push({
        productId: p.productId,
        productName: p.productName,
        issue: 'LOW_ROTATION',
        detail: 'Rotation très faible',
        recommendation: 'Réduire le réapprovisionnement',
      })
    } else if (p.anomalyLevel === 'CRITICAL') {
      items.push({
        productId: p.productId,
        productName: p.productName,
        issue: 'ANOMALY',
        detail: `Anomalie détectée (Z=${p.zScore})`,
        recommendation: 'Vérifier les mouvements récents',
      })
    }
    if (items.length >= 5) break
  }
  return items
}

export function deriveForecast(predictions: Prediction[]): ForecastItem[] {
  return predictions
    .filter(p => p.forecast7d > 0)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5)
    .map(p => ({
      productId: p.productId,
      productName: p.productName,
      forecast7d: p.forecast7d,
      confidence: p.confidence,
      wma: p.wma,
      abcClass: p.abcClass,
    }))
}

export function deriveModalRows(predictions: Prediction[]): ModalRow[] {
  return [...predictions]
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .map(p => {
      let priority: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW'
      let risk = 'Stock OK'
      let recommendation = 'Maintenir le niveau de stock'

      if (p.status === 'URGENT') {
        priority = 'HIGH'
        risk = 'Rupture imminente'
        recommendation = `Commander ${p.eoq > 0 ? p.eoq : p.minStock * 2} unités`
      } else if (p.status === 'THIS_WEEK') {
        priority = 'MEDIUM'
        risk = 'Stock faible'
        recommendation = `Planifier commande (EOQ: ${p.eoq})`
      } else if (p.stock > p.minStock * 3) {
        priority = 'LOW'
        risk = 'Surstock'
        recommendation = 'Suspendre les commandes'
      } else if (p.anomalyLevel !== 'NORMAL') {
        priority = 'MEDIUM'
        risk = `Anomalie (Z=${p.zScore})`
        recommendation = 'Investiguer les mouvements'
      }

      return {
        productId: p.productId,
        productName: p.productName,
        priority,
        risk,
        days: p.daysRemaining >= 999 ? null : p.daysRemaining,
        recommendation,
        abcClass: p.abcClass,
      }
    })
}
