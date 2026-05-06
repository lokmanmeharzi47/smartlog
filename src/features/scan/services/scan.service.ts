import { getProductByBarcode, createMovement } from '@/lib/api'
import type { Product } from '@/types/database'

export const scanService = {
  /**
   * Identifie un produit à partir de son code QR / Barcode
   */
  async identifyProduct(code: string): Promise<Product | null> {
    return getProductByBarcode(code)
  },

  /**
   * Enregistre un mouvement de stock
   */
  async recordMovement(productId: string, type: 'IN' | 'OUT', quantity: number, note?: string) {
    return createMovement(productId, type, quantity, note)
  }
}
