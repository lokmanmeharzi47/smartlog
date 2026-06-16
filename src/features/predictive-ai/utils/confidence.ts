/**
 * Confidence = based on coefficient of variation (CV = σ / μ).
 * Low CV → stable demand → high confidence.
 */
export function calculateConfidence(data: number[]): number {
  if (data.length < 2) return 75
  const mean = data.reduce((a, b) => a + b, 0) / data.length
  if (mean === 0) return 60
  const variance = data.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / data.length
  const stdDev = Math.sqrt(variance)
  const cv = stdDev / mean
  const confidence = (1 - cv * 0.8) * 100
  return Math.round(Math.max(60, Math.min(97, confidence)))
}
