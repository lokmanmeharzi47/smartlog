import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { getAdvancedMetrics } from '../services/dashboard.service'
import { AdvancedMetrics } from '../types'
import toast from 'react-hot-toast'

export function useAdvancedMetrics() {
  const [metrics, setMetrics] = useState<AdvancedMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  const loadMetrics = useCallback(async () => {
    try {
      const data = await getAdvancedMetrics()
      setMetrics(data)
    } catch (error) {
      console.error('Failed to load advanced metrics:', error)
      toast.error('Erreur lors du chargement des indicateurs avancés')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMetrics()

    const channel = supabase
      .channel('advanced-metrics-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        loadMetrics()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'movements' }, () => {
        loadMetrics()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        loadMetrics()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadMetrics])

  return { metrics, loading }
}
