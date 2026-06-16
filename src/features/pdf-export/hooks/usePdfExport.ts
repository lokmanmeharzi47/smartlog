'use client'

import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { getProducts } from '@/lib/api'
import { getDashboardStats } from '@/lib/api'
import { fetchPredictions } from '@/features/predictive-ai/services/predictive.service'
import { generatePDFReport } from '../services/pdf.service'
import type { ReportData } from '../services/pdf.service'

export type ExportScope = 'full' | 'inventory' | 'alerts' | 'predictions'

export function usePdfExport() {
  const [exporting, setExporting] = useState(false)

  const exportPDF = useCallback(async (scope: ExportScope = 'full') => {
    setExporting(true)
    const toastId = toast.loading('ℹ️ Génération du rapport PDF...')

    try {
      // Fetch all data in parallel
      const [products, stats, predictions] = await Promise.all([
        getProducts(),
        getDashboardStats(),
        fetchPredictions(),
      ])

      const data: ReportData = {
        products,
        predictions,
        stats,
        generatedBy: 'Admin WMS',
      }

      await generatePDFReport(data)

      toast.success('✅ Rapport généré avec succès', { id: toastId, duration: 4000 })
    } catch (err) {
      console.error('PDF export error:', err)
      toast.error('❌ Erreur lors de la génération PDF', { id: toastId, duration: 6000 })
    } finally {
      setExporting(false)
    }
  }, [])

  return { exportPDF, exporting }
}
