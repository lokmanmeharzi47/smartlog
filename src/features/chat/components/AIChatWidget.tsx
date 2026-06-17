'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Loader2, Sparkles, Bot, ChevronRight } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const quickQuestions = [
  'Quels sont les KPIs principaux de SmartLog ?',
  'Comment fonctionne la prédiction WMA ?',
  'Qu\'est-ce que le score santé stock ?',
  'Comment démarrer avec SmartLog ?',
]

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Bonjour ! Je suis l\'assistant IA SmartLog. Posez-moi des questions sur la plateforme, les fonctionnalités, ou comment optimiser votre gestion d\'entrepôt.',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  async function handleSend(text: string) {
    const q = text.trim()
    if (!q || loading) return

    setMessages(prev => [...prev, { role: 'user', content: q }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: { question: q, source: 'landing-page-chat' } }),
      })
      const data = await res.json()

      if (data.explanation) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.explanation }])
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Désolé, je n\'ai pas pu traiter votre question. Veuillez réessayer ou contacter notre équipe à contact@smartlog.dz.',
        }])
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Une erreur est survenue. Veuillez réessayer plus tard.',
      }])
    } finally {
      setLoading(false)
    }
  }

  function renderContent(content: string) {
    const lines = content.split('\n')
    return lines.map((line, i) => {
      if (line.startsWith('## ')) return <h3 key={i} className="text-sm font-bold text-slate-900 mt-3 mb-1">{line.slice(3)}</h3>
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="text-xs font-semibold text-slate-800 mb-1">{line.slice(2, -2)}</p>
      if (line.startsWith('- ')) return <li key={i} className="text-xs text-slate-600 ml-3 list-disc">{line.slice(2)}</li>
      if (line.trim() === '') return <div key={i} className="h-1" />
      return <p key={i} className="text-xs text-slate-600 leading-relaxed">{line}</p>
    })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-secondary hover:bg-secondary/90 text-white rounded-2xl shadow-lg shadow-secondary/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        aria-label="Ouvrir le chat IA"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ maxHeight: 'min(600px, calc(100vh - 120px))' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <p className="text-slate-900 text-sm font-semibold">Assistant SmartLog</p>
                  <p className="text-slate-400 text-[10px]">IA Conversationnelle</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: 'thin' }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 ${
                    msg.role === 'user'
                      ? 'bg-secondary/20 border border-secondary/30 text-slate-800'
                      : 'bg-slate-50 border border-slate-200 text-slate-600'
                  }`}>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      {msg.role === 'user' ? 'Vous' : 'SmartLog IA'}
                    </div>
                    <div className="text-xs leading-relaxed">
                      {msg.role === 'assistant' ? renderContent(msg.content) : msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-secondary" />
                      <span className="text-xs text-slate-500">Réflexion...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && (
              <div className="px-4 pb-2 flex-shrink-0">
                <p className="text-[10px] text-slate-400 mb-2">Questions rapides :</p>
                <div className="flex flex-wrap gap-1.5">
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(q)}
                      className="text-[10px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-700 rounded-lg px-2.5 py-1.5 transition-all flex items-center gap-1"
                    >
                      {q} <ChevronRight className="w-2.5 h-2.5" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex-shrink-0">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(input) }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Posez votre question..."
                  disabled={loading}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-secondary/50 transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-9 h-9 bg-secondary hover:bg-secondary/90 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl flex items-center justify-center transition-all flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
