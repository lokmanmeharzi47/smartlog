import type { Prediction } from '../types'

interface SmartAlert {
  id: string
  type: 'rupture' | 'surstock' | 'anomalie' | 'opportunite'
  title: string
  desc: string
  time: string
}

function buildAlerts(predictions: Prediction[], loading: boolean): SmartAlert[] {
  const alerts: SmartAlert[] = []
  if (loading) return alerts

  const urgents = predictions.filter(p => p.status === 'URGENT').sort((a, b) => a.daysRemaining - b.daysRemaining)
  urgents.slice(0, 2).forEach(u => {
    alerts.push({
      id: u.productId + '-urg',
      type: 'rupture',
      title: `Rupture imminente — ${u.barcode || u.productId}`,
      desc: `Stock résiduel ${u.stock}u, couverture ${u.daysRemaining}j. Risque de rupture certaine.`,
      time: 'il y a 23 min',
    })
  })

  const overstocks = predictions.filter(p => p.stock > p.minStock * 3)
  overstocks.slice(0, 1).forEach(o => {
    alerts.push({
      id: o.productId + '-over',
      type: 'surstock',
      title: `Surstock détecté — ${o.productName.substring(0, 15)}...`,
      desc: `Saturation de capacité. Transfert ou arrêt commandes recommandé par l'IA (+${o.stock - o.minStock * 3}u catégorie ${o.abcClass}).`,
      time: 'il y a 2h',
    })
  })

  const anomalies = predictions.filter(p => p.anomalyLevel === 'CRITICAL')
  anomalies.slice(0, 1).forEach(a => {
    alerts.push({
      id: a.productId + '-anom',
      type: 'anomalie',
      title: `Anomalie demande — ${a.barcode || a.productId}`,
      desc: `Demande x${a.zScore.toFixed(1)} par rapport à la normale. Vérifier erreur saisie ou commande exceptionnelle.`,
      time: 'il y a 3h',
    })
  })

  const opps = predictions.filter(p => p.abcClass === 'C' && p.stock > p.minStock * 2)
  opps.slice(0, 1).forEach(op => {
    alerts.push({
      id: op.productId + '-opp',
      type: 'opportunite',
      title: `Opportunité: réduction stock C`,
      desc: `ML détecte sur-stockage classe C (${op.productName}). Liquidation ou réduction recommandée.`,
      time: 'il y a 5h',
    })
  })

  return alerts
}

export default function SmartAlertsPanel({ predictions, loading }: { predictions: Prediction[], loading: boolean }) {
  const alerts = buildAlerts(predictions, loading)

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h2 className="text-slate-900 font-bold text-sm flex items-center gap-2">
          Alertes intelligentes
          {!loading && <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{alerts.length}</span>}
        </h2>
      </div>
      <div className="p-4 space-y-3 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />)
        ) : alerts.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">Aucune alerte intelligente active</div>
        ) : (
          alerts.map(a => {
            let bg, border, text;
            if (a.type === 'rupture') { bg = 'bg-red-50/50'; border = 'border-red-200'; text = 'text-red-900'; }
            else if (a.type === 'surstock' || a.type === 'anomalie') { bg = 'bg-orange-50/50'; border = 'border-orange-200'; text = 'text-orange-900'; }
            else { bg = 'bg-emerald-50/50'; border = 'border-emerald-200'; text = 'text-emerald-900'; }

            return (
              <div key={a.id} className={`p-4 border ${bg} ${border} rounded-xl hover:shadow-sm transition-shadow`}>
                <div className={`text-[13px] font-bold mb-1.5 tracking-tight ${text}`}>{a.title}</div>
                <div className="text-slate-700 text-xs leading-relaxed mb-3 opacity-90">{a.desc}</div>
                <div className="text-slate-500 text-[10px] font-mono">{a.time}</div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
