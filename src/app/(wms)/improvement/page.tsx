'use client'

import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import { Lightbulb, TrendingUp, Zap, MessageSquare, Plus, ArrowRight, ThumbsUp } from "lucide-react";

const recommendations = [
  {
    id: 1, title: "Optimiser le réapprovisionnement Catégorie A",
    description: "Les articles de classe A (Palette bois, Détergent) représentent 70% de la valeur mais seulement 20% du volume. Augmenter la fréquence de réapprovisionnement à 2x/semaine pour réduire le stock de sécurité de 15%.",
    impact: 'high' as const, action: 'Planifier optimisation'
  },
  {
    id: 2, title: "Réorganisation Zone B3 — Saturation détectée",
    description: "La zone B3 dépasse 85% de capacité. Proposition : déplacer les articles saisonniers vers la zone C1 (disponible à 40%) pour équilibrer la charge.",
    impact: 'high' as const, action: 'Planifier transfert'
  },
  {
    id: 3, title: "Réduction stock Catégorie C",
    description: "6 articles de classe C ont un taux de rotation inférieur à 0.1x. Suggestion : suspendre les commandes et liquider le stock excédentaire pour libérer 12m² de surface.",
    impact: 'medium' as const, action: 'Étudier proposition'
  },
  {
    id: 4, title: "Anomalie SL-008 — Z-Score > 2.5",
    description: "Le SL-008 (Gants nitrile) présente un pic de sorties anormal (Z=3.2). Vérifier s'il s'agit d'une commande exceptionnelle ou d'une erreur de saisie.",
    impact: 'medium' as const, action: 'Vérifier mouvement'
  },
]

const staffSuggestions = [
  { user: "Sarah J.", title: "Scanner Battery Swap", desc: "Suggesting rotating chargers for scanners on Shift A to avoid mid-collection dead zones.", votes: 12 },
  { user: "Kevin M.", title: "Bay 4 Labeling", desc: "Pathology labels are often smudged. Requesting thermal printer upgrade for Bay 4.", votes: 8 },
  { user: "Ahmed T.", title: "Recycling Incentives", desc: "Could we implement a 'Green Team' recognition for departments with zero misclassifications?", votes: 24 }
]

export default function ImprovementPage() {
  const [voted, setVoted] = useState<number[]>([])

  return (
    <div className="min-h-full">
      <TopBar title="Continuous Improvement" subtitle="AI-driven suggestions and staff-submitted optimizations" />

      <div className="px-4 md:px-8 py-5 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Operational Backlog</h2>
            <p className="text-sm text-slate-400 mt-0.5">Total of {recommendations.length} improvements identified this month. {recommendations.filter(r => r.impact === 'high').length} high priority.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-semibold transition-all shadow-sm">
            <Plus className="w-4 h-4" /> New Suggestion
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Strategic Recommendations (AI-Driven)</p>
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div key={rec.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      rec.impact === 'high' ? 'bg-rose-50 border border-rose-200' : 'bg-emerald-50 border border-emerald-200'
                    }`}>
                      {rec.impact === 'high' ? <Zap className="w-5 h-5 text-rose-500" /> : <TrendingUp className="w-5 h-5 text-emerald-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <h3 className="text-sm font-bold text-slate-800 truncate">{rec.title}</h3>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap ${
                          rec.impact === 'high' ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        }`}>
                          {rec.impact} Impact
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{rec.description}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> 4 Comments</span>
                          <span>ID: RE-{842 + rec.id}</span>
                        </div>
                        <button className="text-[10px] font-semibold text-primary hover:text-primary/80 border border-primary/20 hover:bg-primary/5 rounded-lg px-3 py-1.5 transition-all flex items-center gap-1">
                          {rec.action} <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Latest Staff Submissions</p>
            <div className="space-y-3">
              {staffSuggestions.map((s, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-all shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{s.user}</span>
                    <button
                      onClick={() => setVoted(v => v.includes(i) ? v.filter(x => x !== i) : [...v, i])}
                      className={`flex items-center gap-1 text-[10px] font-bold transition-all ${
                        voted.includes(i) ? 'text-secondary' : 'text-slate-400 hover:text-secondary'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" /> {s.votes + (voted.includes(i) ? 1 : 0)}
                    </button>
                  </div>
                  <h4 className="text-xs font-bold text-slate-700 mb-1">{s.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
            <button className="w-full text-[10px] font-semibold text-slate-400 border border-slate-200 rounded-xl px-4 py-2.5 hover:bg-slate-50 transition-all">
              View All Staff Proposals
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
