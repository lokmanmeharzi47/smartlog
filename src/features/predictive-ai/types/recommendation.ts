export interface UrgentItem {
  productId: string
  productName: string
  stock: number
  minStock: number
  daysRemaining: number
  recommendedQty: number
  abcClass: 'A' | 'B' | 'C'
}

export interface OrderItem {
  productId: string
  productName: string
  stock: number
  forecast7d: number
  eoq: number
  abcClass: 'A' | 'B' | 'C'
}

export interface OptimItem {
  productId: string
  productName: string
  issue: 'OVERSTOCK' | 'LOW_ROTATION' | 'ANOMALY'
  detail: string
  recommendation: string
  surplusPct?: number
}

export interface ForecastItem {
  productId: string
  productName: string
  forecast7d: number
  confidence: number
  wma: number
  abcClass: 'A' | 'B' | 'C'
}

export interface ModalRow {
  productId: string
  productName: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  risk: string
  days: number | null
  recommendation: string
  abcClass: 'A' | 'B' | 'C'
}

export interface GeminiContext {
  type: string
  [key: string]: any
}
