export interface AdvancedMetrics {
  productId: string;
  productName: string;
  // ABC
  annualDemand: number;
  annualValue: number;
  abcClass: 'A' | 'B' | 'C';
  // EOQ & Safety Stock
  eoq: number;
  safetyStock: number;
  // Z-Score Anomaly
  zScore: number;
  anomalyLevel: 'CRITICAL' | 'MODERATE' | 'NORMAL';
}

export function calculateZScore(value: number, mean: number, stdDev: number): number {
  if (stdDev === 0) return 0;
  return Math.abs(value - mean) / stdDev;
}

export function getAnomalyLevel(zScore: number): 'CRITICAL' | 'MODERATE' | 'NORMAL' {
  if (zScore > 2.5) return 'CRITICAL';
  if (zScore > 1.5) return 'MODERATE';
  return 'NORMAL';
}

export function calculateEOQ(annualDemand: number, orderCost: number, holdingCostPct: number, unitPrice: number): number {
  const h = holdingCostPct * unitPrice;
  if (h <= 0) return 0;
  const eoq = Math.sqrt((2 * annualDemand * orderCost) / h);
  return Math.round(eoq);
}

export function calculateSafetyStock(stdDev: number, leadTimeDays: number): number {
  // Service level = 95% -> z = 1.65
  return Math.round(1.65 * stdDev * Math.sqrt(leadTimeDays));
}

export function classifyABC(items: { id: string; annualValue: number }[]) {
  const sorted = [...items].sort((a, b) => b.annualValue - a.annualValue);
  const totalValue = sorted.reduce((sum, item) => sum + item.annualValue, 0);
  
  if (totalValue === 0) {
    return Object.fromEntries(sorted.map(item => [item.id, 'C' as const]));
  }

  let cumulative = 0;
  const classification: Record<string, 'A' | 'B' | 'C'> = {};

  for (const item of sorted) {
    cumulative += item.annualValue;
    const percentage = cumulative / totalValue;
    
    if (percentage <= 0.70) {
      classification[item.id] = 'A';
    } else if (percentage <= 0.90) {
      classification[item.id] = 'B';
    } else {
      classification[item.id] = 'C';
    }
  }

  return classification;
}
