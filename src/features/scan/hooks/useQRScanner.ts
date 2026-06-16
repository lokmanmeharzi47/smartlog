import { useState, useCallback } from 'react'
import type { Product } from '@/types/database'
import { scanService } from '../services/scan.service'
import toast from 'react-hot-toast'

export type ScanResult = {
  code: string
  product?: Product
}

export function useQRScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [loading, setLoading] = useState(false)

  const openScanner = useCallback(() => {
    setIsScanning(true)
    setResult(null)
  }, [])

  const closeScanner = useCallback(() => {
    setIsScanning(false)
  }, [])

  const handleScanSuccess = useCallback(async (code: string) => {
    if (!code) return null
    
    setLoading(true)
    const toastId = toast.loading('Identification du produit...', { id: 'scan-loading' })
    
    try {
      const product = await scanService.identifyProduct(code)
      if (product) {
        setResult({ code, product })
        toast.success(`Produit identifié : ${product.name}`, { id: toastId })
        setIsScanning(false)
        return product
      } else {
        toast.error(`Code introuvable : ${code}`, { id: toastId })
        return null
      }
    } catch (error) {
      toast.error('Erreur de recherche', { id: toastId })
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    isScanning,
    openScanner,
    closeScanner,
    handleScanSuccess,
    result,
    loading
  }
}
