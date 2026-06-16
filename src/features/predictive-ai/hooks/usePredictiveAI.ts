'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { fetchPredictions } from '../services/predictive.service'
import type { Prediction } from '../types'

export function usePredictiveAI() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const data = await fetchPredictions()
      setPredictions(data)
    } catch (e) {
      console.error('Prediction fetch failed:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const ch = supabase
      .channel('predictive-ai')
      // Delay reload after product changes to allow demo movements to be inserted first
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        setTimeout(load, 1200)
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'movements' }, load)
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [load])

  const kpis = useMemo(() => {
    const urgent = predictions.filter(p => p.status === 'URGENT').length
    const thisWeek = predictions.filter(p => p.status === 'THIS_WEEK').length
    const ok = predictions.filter(p => p.status === 'OK').length
    const avgConf = predictions.length > 0
      ? Math.round(predictions.reduce((a, p) => a + p.confidence, 0) / predictions.length)
      : 0
    return { urgent, thisWeek, ok, avgConf }
  }, [predictions])

  return { predictions, loading, kpis }
}
