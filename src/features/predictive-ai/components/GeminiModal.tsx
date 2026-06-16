'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, AlertCircle, Bot, Loader2 } from 'lucide-react'

interface GeminiModalProps {
  context: any;
  onClose: () => void;
}

export default function GeminiModal({ context, onClose }: GeminiModalProps) {
  const [loading, setLoading] = useState(true);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => {
    async function fetchExplanation() {
      try {
        const response = await fetch('/api/ai/recommendation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ context }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to generate explanation');
        }

        setExplanation(data.explanation);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchExplanation();
  }, [context]);

  const renderFormattedText = (text: string) => {
    // Match **bold** or *italic*
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-white font-bold">{part.substring(2, part.length - 2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <em key={index} className="text-violet-300 italic">{part.substring(1, part.length - 1)}</em>;
      }
      return part;
    });
  };

  // Simple markdown renderer for the response
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.trim() === '') return <div key={i} className="h-2"></div>;
      // Handle Headers
      const headerMatch = line.match(/^(#{1,4})\s+(.*)/);
      if (headerMatch) {
        const level = headerMatch[1].length;
        const content = headerMatch[2];
        if (level === 4) return <h4 key={i} className="text-[13px] uppercase tracking-wider font-bold text-violet-400 mt-5 mb-2 flex items-center gap-2">{renderFormattedText(content)}</h4>;
        if (level === 3) return <h3 key={i} className="text-sm font-bold text-violet-300 mt-5 mb-2">{renderFormattedText(content)}</h3>;
        if (level === 2) return <h2 key={i} className="text-base font-bold text-violet-200 mt-5 mb-2">{renderFormattedText(content)}</h2>;
        if (level === 1) return <h1 key={i} className="text-lg font-bold text-white mt-5 mb-2">{renderFormattedText(content)}</h1>;
      }
      
      // Handle list items
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return <li key={i} className="ml-5 list-disc text-slate-300 my-1.5 marker:text-violet-500">{renderFormattedText(line.substring(2))}</li>;
      }
      
      // Handle numbered lists or headers like "3. Actionable Steps"
      const numberMatch = line.match(/^(\d+\.)\s(.*)/);
      if (numberMatch) {
        return (
          <div key={i} className="mt-5 mb-3 flex gap-2">
            <span className="text-violet-400 font-bold">{numberMatch[1]}</span>
            <span className="text-white font-bold">{renderFormattedText(numberMatch[2])}</span>
          </div>
        );
      }
      
      return <p key={i} className="text-slate-300 text-sm my-2 leading-relaxed">{renderFormattedText(line)}</p>;
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
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-[#0a0510] border border-violet-500/30 rounded-3xl overflow-hidden flex flex-col"
          style={{ boxShadow: '0 0 80px -20px rgba(139,92,246,0.25)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-violet-500/20 bg-gradient-to-r from-violet-950/40 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h2 className="text-white font-bold text-base flex items-center gap-2">
                  Gemini AI Analysis
                  <span className="bg-violet-500/20 text-violet-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-violet-500/30 uppercase tracking-wider">
                    Powered by Google
                  </span>
                </h2>
                <p className="text-violet-200/60 text-xs">Analyse détaillée de la recommandation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Context Summary Bar */}
          <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex items-center gap-3 text-xs">
            <Bot className="w-4 h-4 text-violet-400" />
            <span className="text-slate-400">Analyse pour :</span>
            <span className="text-white font-semibold">{context.productName}</span>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                <p className="text-violet-300/80 text-sm animate-pulse">Génération de l'analyse stratégique...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-red-400">
                <AlertCircle className="w-10 h-10 opacity-80" />
                <p className="text-sm font-medium">{error}</p>
                <p className="text-xs text-red-400/60">Veuillez vérifier votre clé API ou réessayer plus tard.</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="prose prose-invert max-w-none"
              >
                {explanation && renderMarkdown(explanation)}
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-violet-500/20 bg-black/40 flex items-center justify-between">
            <p className="text-violet-200/40 text-[10px] font-mono">
              L'IA peut faire des erreurs. Vérifiez toujours les informations importantes.
            </p>
            <button
              onClick={onClose}
              className="text-xs font-semibold text-violet-300 hover:text-white bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 rounded-xl px-5 py-2 transition-all"
            >
              Fermer
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
