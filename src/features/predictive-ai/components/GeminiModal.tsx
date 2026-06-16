'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BrainCircuit, AlertCircle, Bot, Loader2 } from 'lucide-react'

interface GeminiModalProps {
  context: any;
  onClose: () => void;
}

export default function GeminiModal({ context, onClose }: GeminiModalProps) {
  const [loading, setLoading] = useState(true);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
          throw new Error(data.error || 'Failed to generate analysis');
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
                  AI Analysis
                  <span className="bg-secondary/10 text-secondary text-[9px] font-semibold px-2 py-0.5 rounded-full border border-secondary/20 uppercase tracking-wider">
                    Powered by Google
                  </span>
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">Detailed recommendation analysis</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Context bar */}
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center gap-2.5 text-xs">
            <Bot className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Analysis for:</span>
            <span className="text-primary font-semibold">{context.productName}</span>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[55vh]" style={{ scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent' }}>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-14 gap-4">
                <Loader2 className="w-7 h-7 text-primary animate-spin" />
                <p className="text-slate-500 text-sm">Generating strategic analysis...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-14 gap-3">
                <AlertCircle className="w-9 h-9 text-red-400" />
                <p className="text-slate-700 text-sm font-medium">{error}</p>
                <p className="text-slate-400 text-xs">Please check your API key or try again later.</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                {explanation && renderMarkdown(explanation)}
              </motion.div>
            )}
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
