/**
 * Calculates the Weighted Moving Average.
 * data: oldest → newest (7 values). Weights: [1,2,3,4,5,6,7]
 */
export function calculateWMA(data: number[]): number {
  const weights = [1, 2, 3, 4, 5, 6, 7]
  const slice = data.slice(-7)
  const w = weights.slice(-slice.length)
  const sumProd = slice.reduce((acc, v, i) => acc + v * w[i], 0)
  const sumW = w.reduce((a, b) => a + b, 0)
  return sumW > 0 ? sumProd / sumW : 0
}

export function calculateForecast(wma: number, days: number): number {
  return Math.round(wma * days)
}

export function calculateDaysRemaining(stock: number, wma: number): number {
  if (wma <= 0) return 999
  return Math.floor(stock / wma)
}

export function estimateStockoutDate(daysRemaining: number): string | null {
  if (daysRemaining >= 999) return null
  const d = new Date()
  d.setDate(d.getDate() + daysRemaining)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function estimateThresholdDate(stock: number, minStock: number, wma: number): string | null {
  if (wma <= 0) return null
  const daysToThreshold = Math.floor((stock - minStock) / wma)
  if (daysToThreshold < 0) return 'Déjà atteint'
  const d = new Date()
  d.setDate(d.getDate() + daysToThreshold)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}
