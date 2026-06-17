'use client'

import React, { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  Radio, BrainCircuit, BarChart4, ShieldCheck, Zap,
  ChevronRight, Lock, Globe, TrendingUp, ScanLine,
  Menu, X, Check, Bell, PieChart, Target,
  ArrowUpRight, ChevronDown, Cpu, Activity, Warehouse,
  Sparkles, Send
} from 'lucide-react'
import AIChatWidget from '@/features/chat/components/AIChatWidget'

const team = [
  { name: 'Bellili Mohammed', role: 'Chef de Projet', initials: 'BM' },
  { name: 'Daabi Imad', role: 'Développeur Fullstack', initials: 'DI' },
  { name: 'Otmane Abdelmoudjib', role: 'Data Scientist', initials: 'OA' },
  { name: 'Ghezali Hani', role: 'DevOps & Infrastructure', initials: 'GH' },
]

export default function LandingPage() {
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const statsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased">

      {/* ── NAVBAR ── */}
      <motion.nav
        initial={{ y: -60 }} animate={{ y: 0 }}
        className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
              <Image src="/logo.png" alt="SmartLog" width={36} height={36} className="object-cover" />
            </div>
            <div>
              <span className="text-base md:text-lg font-bold text-slate-800 tracking-tight">SmartLog</span>
              <span className="hidden sm:block text-[8px] font-semibold text-slate-400 tracking-[2px] uppercase leading-tight">WMS · RFID · IA</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {[
              { href: '#features', label: 'Produit' },
              { href: '#dashboard', label: 'Dashboard' },
              { href: '#ai', label: 'IA' },
              { href: '#platform', label: 'Plateforme' },
              { href: '#equipe', label: 'Équipe' },
            ].map(item => (
              <a key={item.href} href={item.href} className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors">{item.label}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors px-4 py-2 rounded-lg hover:bg-slate-50">
              <Lock className="w-3.5 h-3.5" /> Connexion
            </Link>
            <Link href="/dashboard" className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-sm hover:shadow-md">
              Démarrer <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-slate-500 hover:text-slate-800">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden border-t border-slate-100 bg-white overflow-hidden">
              <div className="px-6 py-4 space-y-2">
                {[
                  { href: '#features', label: 'Produit' },
                  { href: '#dashboard', label: 'Dashboard' },
                  { href: '#ai', label: 'IA' },
                  { href: '#platform', label: 'Plateforme' },
                  { href: '#equipe', label: 'Équipe' },
                ].map(item => (
                  <a key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">{item.label}</a>
                ))}
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg border-t border-slate-100 mt-2 pt-4">Connexion</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── HERO ── */}
      <motion.section style={{ opacity: heroOpacity }} className="relative pt-32 md:pt-40 pb-24 md:pb-32 px-6 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-secondary/5 via-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto text-center relative">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.05] mb-6"
          >
            La fin de l&apos;inventaire manuel.<br />
            <span className="text-gradient">Le début de la visibilité absolue.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            className="text-base md:text-lg text-slate-500 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            SmartLog est la première solution SaaS algérienne qui combine traçabilité RFID UHF et intelligence artificielle prédictive. Un WMS complet qui élimine Excel, réduit les erreurs de 30% à 1%, et anticipe vos ruptures de stock.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard" className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white px-8 py-3.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 group">
              Accéder à la plateforme <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <a href="#dashboard" className="w-full sm:w-auto border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 bg-white shadow-sm hover:shadow-md">
              <BarChart4 className="w-4 h-4" /> Voir le Dashboard
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400"
          >
            <span className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-secondary" /> RFID UHF 700 tags/s</span>
            <span className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-secondary" /> Précision 99%</span>
            <span className="flex items-center gap-2"><BrainCircuit className="w-3.5 h-3.5 text-secondary" /> IA Prédictive WMA→LSTM</span>
            <span className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-secondary" /> Bilingue FR/AR</span>
          </motion.div>
        </div>
      </motion.section>

      {/* ── STATS ── */}
      <section ref={statsRef} className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: 99, suffix: '%', label: 'Précision inventaire' },
              { value: 50, suffix: '%', label: "Gain d'efficacité" },
              { value: 10, suffix: 'x', label: 'Inventaire plus rapide' },
              { value: 20, suffix: '%', label: 'Réduction des coûts' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-1 tracking-tight">
                  {statsInView && <Counter to={stat.value} from={0} suffix={stat.suffix} />}
                </div>
                <div className="text-slate-500 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">L&apos;essentiel de votre entrepôt, en un coup d&apos;oeil.</h2>
            <p className="text-lg text-slate-500">De la réception RFID à la prévision IA, SmartLog couvre l&apos;ensemble de vos processus logistiques.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Radio, title: 'Scan RFID UHF', desc: 'Portiques Impinj R700. 700 tags/seconde, sans contact, sans visibilité directe.' },
              { icon: BrainCircuit, title: 'IA Prédictive', desc: 'Anticipez la demande avec WMA, Prophet et LSTM. Détection anomalies Z-Score.' },
              { icon: BarChart4, title: 'Dashboard KPIs', desc: 'KPIs temps réel : rotation, couverture, valeur stock, score santé. Rafraîchi toutes les 5s.' },
              { icon: Bell, title: 'Alertes Intelligentes', desc: 'Seuils min/max, détection Z-Score et ML avancé (Isolation Forest) des anomalies.' },
              { icon: Target, title: 'EOQ — Wilson', desc: 'Quantité optimale de commande. Stock sécurité intégré. Minimise coût commande + stockage.' },
              { icon: PieChart, title: 'Classification ABC', desc: 'Pareto 80/20. Stratégies A (strict), B (modéré), C (lot) par valeur de consommation.' },
              { icon: ShieldCheck, title: 'Traçabilité Totale', desc: 'Conforme HACCP/GDP. Chaque mouvement horodaté et attribué. Audit prêt.' },
              { icon: ScanLine, title: 'Scan & Mouvements', desc: 'Entrées/sorties par QR code ou RFID. Mise à jour temps réel du stock.' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                className="group bg-white rounded-xl border border-slate-200/50 hover:border-slate-200 p-5 -m-5 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <f.icon className="w-5 h-5 text-slate-500 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-slate-800 font-semibold text-sm mb-1.5">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD ── */}
      <section id="dashboard" className="py-24 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">Un tableau de bord qui parle.</h2>
              <p className="text-lg text-slate-500 mb-8">KPIs temps réel, graphiques dynamiques et fil d&apos;événements live. Rafraîchissement automatique toutes les 5 secondes.</p>
              <div className="space-y-4">
                {[
                  { label: 'Total stock', value: '4 928 unités', desc: 'Σ Quantité de tous les articles' },
                  { label: 'Taux de couverture', value: '95%', desc: '19 articles OK sur 20' },
                  { label: 'Score santé', value: '90/100', desc: 'Basé sur critiques, faibles, surstock et rotation' },
                ].map((kpi, i) => (
                  <div key={i} className="flex items-center justify-between bg-white rounded-xl px-5 py-4 border border-slate-200 shadow-sm">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{kpi.label}</p>
                      <p className="text-xs text-slate-400">{kpi.desc}</p>
                    </div>
                    <span className="text-lg font-bold text-primary font-mono">{kpi.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 space-y-4"
            >
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs text-slate-400 font-mono ml-2">Dashboard — Temps réel</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Stock total', value: '4 928u' },
                  { label: 'Critiques', value: '1', accent: 'text-red-500' },
                  { label: 'Taux couv.', value: '95%' },
                  { label: 'Rotation', value: '0.58x' },
                ].map((s, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-400">{s.label}</p>
                    <p className={`text-lg font-bold font-mono ${s.accent || 'text-primary'}`}>{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="h-32 bg-slate-50 rounded-lg flex items-center justify-center">
                <BarChart4 className="w-8 h-8 text-slate-300" />
                <span className="text-xs text-slate-300 ml-2">Graphique stock par article</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── AI ── */}
      <section id="ai" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mb-16">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-4 block">Intelligence Artificielle</span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">Des prévisions qui anticipent vos ruptures.</h2>
            <p className="text-lg text-slate-500">Trois phases de maturité : du WMA classique au Deep Learning LSTM. Plus vos données murissent, plus les prédictions sont précises.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 mb-16">
            {[
              { phase: '0-6 mois', method: 'WMA — Moyenne Pondérée', desc: 'Poids [1,2,3,4,5,6,7] sur 7 jours. Le jour récent a le poids le plus fort.', mape: '15-20%' },
              { phase: '6-12 mois', method: 'Prophet (Meta)', desc: 'Capture les tendances et la saisonnalité. Idéal pour données à moyen terme.', mape: '10-15%' },
              { phase: '12+ mois', method: 'LSTM — Deep Learning', desc: 'Réseau de neurones récurrent. Apprend les patterns complexes long terme.', mape: '< 10%' },
            ].map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-primary/20 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">{m.phase}</span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">{m.mape}</span>
                </div>
                <h3 className="font-semibold text-slate-800 mb-1.5">{m.method}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200"
            >
              <h3 className="font-semibold text-slate-800 mb-3">Algorithme WMA</h3>
              <p className="text-sm text-slate-500 mb-3">WMA = Σ(wᵢ × xᵢ) / Σwᵢ avec poids [1,2,3,4,5,6,7]</p>
              <div className="bg-white rounded-xl p-4 text-xs text-slate-600 font-mono space-y-1 border border-slate-200">
                <p>Exemple SL-006 : WMA = 95.5 u/jour</p>
                <p>Prévision 7j = 668u · 14j = 1 337u</p>
                <p className="text-emerald-600">Stock restant : 13 jours → Rupture le 31 mars 2026</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200"
            >
              <h3 className="font-semibold text-slate-800 mb-3">Recommandations automatiques</h3>
              <div className="space-y-2">
                {[
                  { status: 'Urgent', cond: 'Jours < 7', action: 'Commander maintenant', color: 'text-red-600' },
                  { status: 'Cette semaine', cond: '7 ≤ Jours < 14', action: 'Planifier commande', color: 'text-amber-600' },
                  { status: 'OK', cond: 'Jours ≥ 14', action: 'Stock suffisant', color: 'text-emerald-600' },
                ].map((r, i) => (
                  <div key={i} className="bg-white rounded-xl px-4 py-3 flex items-center justify-between border border-slate-200">
                    <div>
                      <p className={`text-sm font-medium ${r.color}`}>{r.status}</p>
                      <p className="text-xs text-slate-400">{r.cond}</p>
                    </div>
                    <span className="text-xs text-slate-500">{r.action}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── LLM / ASSISTANT ── */}
      <section className="py-24 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-4 block">Assistant IA</span>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">Un LLM qui parle logistique.</h2>
              <p className="text-lg text-slate-500 mb-8">
                Posez une question en langage naturel. L&apos;assistant SmartLog comprend votre contexte, analyse vos données et vous répond comme un consultant supply chain.
              </p>
              <div className="space-y-4">
                {[
                  { q: 'Quels sont mes articles en stock critique ?', tag: 'Stock' },
                  { q: 'Quand dois-je commander le SL-006 ?', tag: 'Prévision' },
                  { q: 'Explique-moi le score santé du stock', tag: 'KPI' },
                  { q: 'Quelle est la formule EOQ pour la catégorie A ?', tag: 'Optimisation' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white rounded-xl px-5 py-4 border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-md">{item.tag}</span>
                    <span className="text-sm text-slate-600 flex-1">{item.q}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-3 text-xs text-slate-400">
                <Sparkles className="w-4 h-4 text-secondary" />
                Propulsé par Google Gemma 4 31B — Contexte WMA, Z-Score, EOQ, Pareto ABC
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden"
            >
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-200 bg-slate-50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs text-slate-400 font-mono ml-2">Assistant SmartLog</span>
                <span className="ml-auto text-[10px] text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Gemini 4
                </span>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex justify-start">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 max-w-[85%]">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">SmartLog IA</p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Bonjour ! Je suis votre assistant logistique. Je peux analyser vos stocks, anticiper les ruptures et recommander des commandes. Que souhaitez-vous savoir ?
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-secondary/20 border border-secondary/30 rounded-xl px-4 py-3 max-w-[85%]">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary/70 mb-1">Vous</p>
                    <p className="text-xs text-slate-800">Quels sont les articles en stock critique aujourd'hui ?</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 max-w-[90%]">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">SmartLog IA</p>
                    <div className="text-xs text-slate-600 leading-relaxed space-y-1">
                      <p className="font-semibold text-slate-900">3 articles critiques détectés :</p>
                      <p>• <strong>SL-003</strong> — 12 u (seuil 50) → <span className="text-red-600">Commander 38 u</span></p>
                      <p>• <strong>SL-008</strong> — 5 u (seuil 30) → <span className="text-red-600">Commander 25 u</span></p>
                      <p>• <strong>SL-012</strong> — 0 u (seuil 20) → <span className="text-red-600">Rupture, commander 20 u</span></p>
                      <p className="text-amber-600 mt-2">Risque : perte de 340 000 DZD de CA si non réapprovisionné sous 48h.</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-1">
                  <div className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-400">
                    Posez votre question...
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                    <Send className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PLATFORM ── */}
      <section id="platform" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mb-16">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-4 block">Architecture</span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">Hardware + Software, une synergie complète.</h2>
            <p className="text-lg text-slate-500">Du portique RFID au dashboard IA, chaque couche est conçue pour fonctionner ensemble.</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center mb-5">
                <Radio className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Kit RFID UHF</h3>
              <p className="text-sm text-slate-500 mb-5">Remplace le scan code-barres. Portiques Impinj R700 et lecteurs Zebra. 8-12h d'inventaire réduits à 10-15 min.</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { label: 'Fréquence', value: 'UHF 865-868 MHz' },
                  { label: 'Débit', value: '700 tags/s' },
                  { label: 'Portée', value: '10 mètres' },
                  { label: 'Standard', value: 'EPC Gen2' },
                ].map((s, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg px-3 py-2 text-xs">
                    <span className="text-slate-400 block">{s.label}</span>
                    <span className="text-slate-700 font-semibold">{s.value}</span>
                  </div>
                ))}
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                {['Lecteurs fixes aux quais', 'Antennes directionnelles 70m²', 'Middleware RFID anti-redondance', 'Tags UHF passifs EPC Gen2'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-sky-500 shrink-0" />{item}</li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center mb-5">
                <BarChart4 className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">WMS SaaS + IA</h3>
              <p className="text-sm text-slate-500 mb-5">Plateforme cloud centralisée. Dashboard temps réel, alertes Z-Score, prévisions IA progressives.</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { label: 'Disponibilité', value: '99.9%' },
                  { label: 'Sécurité', value: 'HACCP/GDP' },
                  { label: 'Données', value: 'Temps réel' },
                  { label: 'Déploiement', value: 'Cloud/Hybride' },
                ].map((s, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg px-3 py-2 text-xs border border-slate-100">
                    <span className="text-slate-400 block">{s.label}</span>
                    <span className="text-slate-700 font-semibold">{s.value}</span>
                  </div>
                ))}
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                {['Dashboard KPIs (5s refresh)', 'Alertes anomalies Z-Score', 'Prévisions WMA → Prophet → LSTM', 'Assistant IA conversationnel', 'Bilingue Français/Arabe'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-sky-500 shrink-0" />{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section id="equipe" className="py-24 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mb-16">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-4 block">Équipe</span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">Derrière SmartLog.</h2>
            <p className="text-lg text-slate-500">Master 2 SCM — EHEC Alger · 2025-2026</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-600 font-bold text-sm">
                  {m.initials}
                </div>
                <h3 className="font-semibold text-slate-800 text-sm">{m.name}</h3>
                <p className="text-xs text-slate-400">{m.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">Questions fréquentes.</h2>
            <p className="text-lg text-slate-500">Tout ce que vous devez savoir avant de démarrer.</p>
          </motion.div>
          <div className="space-y-3">
            {[
              { q: "Quel est le coût d'un kit RFID UHF SmartLog ?", a: "Nos kits démarrent à 450 000 DZD pour une configuration PME (1 portique, 2 antennes, 1000 tags). Le déploiement complet d'un entrepôt de 500m² est généralement entre 1.2M et 2.5M DZD, incluant l'installation et la formation." },
              { q: 'Puis-je utiliser SmartLog sans matériel RFID ?', a: "Absolument. Vous pouvez utiliser l'application en mode scan code-barres. Le WMS fonctionne parfaitement sans RFID et vous pouvez migrer vers le RFID quand vous le souhaitez." },
              { q: "Comment fonctionne la migration depuis mon système actuel ?", a: "Notre équipe vous accompagne. L'import des données se fait via Excel ou CSV. Comptez 2 à 5 jours ouvrés pour une migration complète." },
              { q: 'SmartLog est-il conforme à la réglementation algérienne ?', a: "Oui. SmartLog respecte la loi 18-05 sur le commerce électronique. Nos serveurs sont situés en Algérie chez un hébergeur agréé." },
              { q: "Quand les fonctionnalités IA avancées sont-elles disponibles ?", a: "Les alertes simples et le Z-Score sont opérationnels dès le jour 1. Les modèles Prophet (6-12 mois) et LSTM (12+ mois) nécessitent un historique suffisant." },
            ].map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                className="border border-slate-200 rounded-xl overflow-hidden"
              >
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <span className="text-sm font-medium text-slate-700 pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                      <p className="px-5 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-4">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Prêt à digitaliser votre logistique ?
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
              Rejoignez les PME algériennes qui ont modernisé leur entrepôt. Fini Excel et les inventaires interminables.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100 px-8 py-3.5 rounded-xl text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2 group">
                Entrer dans l'application <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <Link href="/login" className="w-full sm:w-auto border border-slate-600 hover:border-slate-500 text-slate-300 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" /> Espace client
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                  <Image src="/logo.png" alt="SmartLog" width={28} height={28} className="object-cover" />
                </div>
                <span className="font-bold text-white text-sm">SmartLog</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-md">Première solution SaaS algérienne combinant RFID UHF et intelligence artificielle pour la gestion d'entrepôts.</p>
              <div className="flex items-center gap-4 mt-4 text-xs text-slate-600">
                <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Alger, Algérie</span>
                <span>contact@smartlog.dz</span>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Produit</h4>
              <div className="space-y-2.5 text-sm text-slate-500">
                {['Fonctionnalités', 'Dashboard', 'IA Prédictive', 'Tarifs'].map(item => (
                  <p key={item} className="hover:text-white cursor-pointer transition-colors">{item}</p>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Équipe</h4>
              <div className="space-y-2.5 text-sm text-slate-500">
                {team.map(m => (
                  <p key={m.name}>{m.name}</p>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <span>© 2026 SmartLog — Tous droits réservés</span>
            <div className="flex items-center gap-4">
              <span>Mentions légales</span>
              <span>Confidentialité</span>
            </div>
          </div>
        </div>
      </footer>

      <AIChatWidget />
    </div>
  )
}

function Counter({ from = 0, to, suffix = '', decimals = 0 }: { from?: number; to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = React.useState(from)
  React.useEffect(() => {
    if (!isInView) return
    let start = from; const duration = 2000; const steps = 60
    const increment = (to - from) / steps; let step = 0
    const timer = setInterval(() => { step++; start += increment; if (step >= steps) { setCount(to); clearInterval(timer) } else { setCount(start) } }, duration / steps)
    return () => clearInterval(timer)
  }, [isInView, from, to])
  return <span ref={ref}>{count.toFixed(decimals)}{suffix}</span>
}
