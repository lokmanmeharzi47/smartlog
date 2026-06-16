'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BrainCircuit, AlertCircle, Bot, Loader2, TrendingUp, PackageSearch, AlertTriangle, BarChart4 } from 'lucide-react'

interface QuickPrompt {
  label: string
  icon: typeof BrainCircuit
  prompt: string
}

const QUICK_PROMPTS: QuickPrompt[] = [
  { label: 'Synthétiser les KPIs', icon: BarChart4, prompt: 'Quels sont les KPIs les plus critiques du tableau de bord en ce moment ?' },
  { label: 'Analyser les risques de rupture', icon: AlertTriangle, prompt: 'Quels articles risquent une rupture de stock cette semaine ?' },
  { label: 'Optimiser les réapprovisionnements', icon: TrendingUp, prompt: 'Suggestions d\'optimisation des réapprovisionnements basées sur l\'EOQ.' },
  { label: 'Scan RFID -> Actions', icon: PackageSearch, prompt: 'Comment le scan RFID peut-il réduire les erreurs d\'inventaire ?' },
]

interface GeminiModalProps {
  context: any;
  onClose: () => void;
}

export default function GeminiModal({ context, onClose }: GeminiModalProps) {
  const [loading, setLoading] = useState(true);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customQuery, setCustomQuery] = useState('');
  const [contextData, setContextData] = useState(context);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  async function fetchExplanation(ctx?: any) {
    const payload = ctx || context
    setLoading(true)
    setError(null)
    setExplanation(null)
    try {
      const response = await fetch('/api/ai/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: payload }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate analysis');
      }

      setExplanation(data.explanation);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchExplanation();
  }, [context]);

  async function handleQuickPrompt(prompt: string) {
    setCustomQuery(prompt)
    await fetchExplanation({ ...contextData, customQuery: prompt })
  }

  async function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!customQuery.trim()) return
    await fetchExplanation({ ...contextData, customQuery: customQuery })
  }

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-slate-900 font-semibold">{part.substring(2, part.length - 2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <em key={index} className="text-primary italic">{part.substring(1, part.length - 1)}</em>;
      }
      return part;
    });
  };

  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.trim() === '') return <div key={i} className="h-2" />;

      const headerMatch = line.match(/^(#{1,4})\s+(.*)/);
      if (headerMatch) {
        const level = headerMatch[1].length;
        const content = headerMatch[2];
        if (level >= 3) return <h4 key={i} className="text-[11px] uppercase tracking-wider font-bold text-slate-500 mt-5 mb-2">{renderFormattedText(content)}</h4>;
        if (level === 2) return <h3 key={i} className="text-sm font-bold text-primary mt-5 mb-2">{renderFormattedText(content)}</h3>;
        if (level === 1) return <h2 key={i} className="text-base font-bold text-primary mt-5 mb-2">{renderFormattedText(content)}</h2>;
      }

      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={i} className="ml-5 text-slate-600 text-sm my-1.5 leading-relaxed" style={{ listStyleType: 'disc' }}>
            {renderFormattedText(line.substring(2))}
          </li>
        );
      }

      const numberMatch = line.match(/^(\d+\.)\s(.*)/);
      if (numberMatch) {
        return (
          <div key={i} className="mt-5 mb-3 flex gap-2">
            <span className="text-primary font-bold text-sm">{numberMatch[1]}</span>
            <span className="text-slate-800 font-semibold text-sm">{renderFormattedText(numberMatch[2])}</span>
          </div>
        );
      }

      return <p key={i} className="text-slate-600 text-sm my-2 leading-relaxed">{renderFormattedText(line)}</p>;
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-slate-900/20"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <BrainCircuit className="w-4.5 h-4.5 text-primary" style={{ width: '18px', height: '18px' }} />
              </div>
              <div>
                <h2 className="text-slate-900 font-semibold text-sm flex items-center gap-2">
                  Analyse IA
                  <span className="bg-secondary/10 text-secondary text-[9px] font-semibold px-2 py-0.5 rounded-full border border-secondary/20 uppercase tracking-wider">
                    Propulsé par Google
                  </span>
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">Analyse de recommandation détaillée</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Badge */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 px-6 py-2 border-b border-slate-100 flex items-center gap-2 text-xs">
            <BrainCircuit className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary font-bold uppercase tracking-wider text-[10px]">KPI Synthesizer</span>
            <span className="text-slate-300 mx-1">|</span>
            <span className="text-slate-500">Assistant IA prédictif — SmartLog</span>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[55vh]" style={{ scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent' }}>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-14 gap-4">
                <Loader2 className="w-7 h-7 text-primary animate-spin" />
                <p className="text-slate-500 text-sm">Génération de l'analyse stratégique...</p>
                <p className="text-slate-400 text-xs font-mono">Synthèse des KPIs en cours</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-14 gap-3">
                <AlertCircle className="w-9 h-9 text-red-400" />
                <p className="text-slate-700 text-sm font-medium">{error}</p>
                <p className="text-slate-400 text-xs">Vérifiez votre clé API ou réessayez plus tard.</p>
              </div>
            ) : explanation ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                {renderMarkdown(explanation)}
              </motion.div>
            ) : (
              /* Quick prompts when no analysis yet */
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center border border-primary/10">
                    <BrainCircuit className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-slate-800 font-bold text-base mb-1">Assistant KPI SmartLog</h3>
                  <p className="text-slate-500 text-xs">Posez une question sur vos données logistiques ou cliquez sur un prompt rapide :</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {QUICK_PROMPTS.map((qp, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickPrompt(qp.prompt)}
                      className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-xl hover:border-primary/30 hover:bg-primary/5 transition-all text-center group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <qp.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 group-hover:text-primary transition-colors leading-tight">
                        {qp.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chat input */}
          <div className="px-6 py-3 border-t border-slate-100 bg-white">
            <form onSubmit={handleCustomSubmit} className="flex gap-2">
              <input
                type="text"
                value={customQuery}
                onChange={e => setCustomQuery(e.target.value)}
                placeholder="Poser une question personnalisée..."
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm placeholder-slate-400 focus:border-primary/30 focus:bg-white outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!customQuery.trim() || loading}
                className="px-5 py-2.5 bg-primary hover:bg-primary/90 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-2 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <BrainCircuit className="w-3.5 h-3.5" />}
                <span>Analyser</span>
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <p className="text-slate-400 text-[10px] font-mono">
              AI may make errors. Always verify critical information.
            </p>
            <button
              onClick={onClose}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 transition-all"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
