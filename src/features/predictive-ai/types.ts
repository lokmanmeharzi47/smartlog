export type PredictionStatus = 'URGENT' | 'THIS_WEEK' | 'OK'

export interface Prediction {
  productId: string
  productName: string
  barcode: string
  stock: number
  minStock: number
  wma: number
  forecast7d: number
  forecast14d: number
  daysRemaining: number
  confidence: number
  stockoutDate: string | null
  thresholdDate: string | null
  status: PredictionStatus
}

export interface RealtimeInsight {
  id: string
  type: 'stockout' | 'anomaly' | 'spike' | 'variation'
  message: string
  productName: string
  timestamp: Date
  severity: 'high' | 'medium' | 'low'
}
