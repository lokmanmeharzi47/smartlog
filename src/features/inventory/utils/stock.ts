export type StockStatus = 'OK' | 'LOW' | 'CRITICAL';

export function getStockStatus(quantity: number, threshold: number): StockStatus {
  if (quantity <= threshold) return 'CRITICAL';
  if (quantity <= threshold * 1.5) return 'LOW';
  return 'OK';
}
