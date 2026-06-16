import type { PredictionStatus } from '../types'

export function getPredictionStatus(daysRemaining: number): PredictionStatus {
  if (daysRemaining < 7) return 'URGENT'
  if (daysRemaining < 14) return 'THIS_WEEK'
  return 'OK'
}

export function getRecommendation(status: PredictionStatus): string {
  switch (status) {
    case 'URGENT': return 'Commander maintenant'
    case 'THIS_WEEK': return 'Planifier commande'
    case 'OK': return 'Stock suffisant'
  }
}
