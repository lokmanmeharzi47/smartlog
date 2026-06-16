'use client'

import React, { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Radio, BrainCircuit, Activity, BarChart4, Box, 
  ShieldCheck, Zap, ChevronRight, Lock,
  Globe, Cloud, Eye, TrendingUp,
  ScanLine, Quote, Menu, X, Check,
  Sparkles, Layers, Bell, Database,
  PieChart, LineChart, AlertTriangle, Target,
  Clock, DollarSign, Package, Calendar, Cpu
} from 'lucide-react'
import AIChatWidget from '@/features/chat/components/AIChatWidget'

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

function SectionHeading({ label, title, desc }: { label: string; title: string; desc?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-widest mb-5">{label}</span>
      <h2 className="text-slate-900 font-bold text-3xl md:text-4xl tracking-tight mb-4">{title}</h2>
      {desc && <p className="text-slate-500 text-lg max-w-2xl mx-auto">{desc}</p>}
    </motion.div>
  )
}

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay }} className={className}>
      {children}
    </motion.div>
  )
}

const team = [
  { name: 'Bellili Mohammed', role: 'Chef de Projet', initials: 'BM', color: 'bg-sky-500' },
  { name: 'Daabi Imad', role: 'Développeur Fullstack', initials: 'DI', color: 'bg-indigo-500' },
  { name: 'Otmane Abdelmoudjib', role: 'Data Scientist', initials: 'OA', color: 'bg-emerald-500' },
  { name: 'Ghezali Hani', role: 'DevOps & Infrastructure', initials: 'GH', color: 'bg-amber-500' },
]

const features = [
  { icon: Radio, title: 'Scan RFID UHF', desc: 'Portiques Impinj R700 et lecteurs Zebra. 700 tags/seconde, sans contact, sans visibilité directe.', color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200' },
  { icon: BrainCircuit, title: 'IA Prédictive', desc: 'Anticipez la demande avec WMA, Prophet et LSTM. Détection anomalies Z-Score en temps réel.', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  { icon: BarChart4, title: 'Dashboard KPIs', desc: 'KPIs temps réel: rotation, couverture, valeur stock, score santé. Rafraîchissement toutes les 5 secondes.', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { icon: Bell, title: 'Alertes 2 Niveaux', desc: 'Seuils simples (min/max) + Z-Score statistique. Détection ML avancée (Isolation Forest) des anomalies.', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
  { icon: Target, title: 'EOQ — Formule Wilson', desc: 'Quantité optimale de commande. Stock sécurité intégré. Minimise coût commande + stockage.', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  { icon: PieChart, title: 'Pareto ABC', desc: 'Classification 80/20 des articles par valeur. Stratégies différenciées A (strict), B (modéré), C (lot).', color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200' },
  { icon: Layers, title: 'Clustering Dynamique', desc: 'Profils: Stable (WMA), Saisonnier (Holt-Winters), Irrégulier (stock sécurité élevé), Faible (contrôle allégé).', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  { icon: ShieldCheck, title: 'Traçabilité Totale', desc: 'Conforme HACCP/GDP. Chaque mouvement horodaté et attribué. Audit prêt à tout moment.', color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
]

const faqs = [
  { q: 'Quel est le coût d\'un kit RFID UHF SmartLog ?', a: 'Nos kits démarrent à 450 000 DZD pour une configuration PME (1 portique, 2 antennes, 1000 tags). Le déploiement complet d\'un entrepôt de 500m² est généralement entre 1.2M et 2.5M DZD, incluant l\'installation et la formation.' },
  { q: 'Puis-je utiliser SmartLog sans matériel RFID ?', a: 'Absolument. Vous pouvez utiliser l\'application en mode scan code-barres avec des lecteurs Zebra standards. Le WMS fonctionne parfaitement sans RFID et vous pouvez migrer vers le RFID quand vous le souhaitez.' },
  { q: 'Comment fonctionne la migration depuis mon système actuel ?', a: 'Notre équipe technique vous accompagne. L\'import des données (produits, stocks, fournisseurs) se fait via fichier Excel ou CSV. Comptez 2 à 5 jours ouvrés pour une migration complète selon la taille de votre catalogue.' },
  { q: 'SmartLog est-il conforme à la réglementation algérienne ?', a: 'Oui. SmartLog respecte la loi 18-05 sur le commerce électronique et la protection des données. Nos serveurs sont situés en Algérie chez un hébergeur agréé. Nous supportons l\'intégration avec le système comptable intégré (SCI).' },
  { q: 'Quand les fonctionnalités IA avancées sont-elles disponibles ?', a: 'Les alertes simples et le Z-Score sont opérationnels dès le jour 1. Les modèles Prophet (6-12 mois) et LSTM (12+ mois) nécessitent un historique de données suffisant pour fournir des prédictions fiables.' },
]

const kpiMain = [
  { label: 'Total articles en stock', formula: 'Σ Quantité de tous les articles', example: '4 928 unités', icon: Package, color: 'text-sky-600', bg: 'bg-sky-50' },
  { label: 'Articles stock critique', formula: 'Quantité ≤ Seuil Minimum', example: '1 article (SL-003: 28 ≤ 30)', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
  { label: 'Articles stock OK', formula: 'Total - Articles critiques', example: '19 articles sur 20', icon: Check, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Taux de couverture', formula: '(N_OK / N_total) × 100', example: '95%', icon: BarChart4, color: 'text-indigo-600', bg: 'bg-indigo-50' },
]

const advancedIndicators = [
  { label: 'Taux de rotation', formula: 'Sorties 30j / Stock total', example: '0.58x', icon: TrendingUp },
  { label: 'Valeur totale stock', formula: 'Σ (Qté × Prix unitaire)', example: '2 464 000 DZD', icon: DollarSign },
  { label: 'Mouvements aujourd\'hui', formula: 'Count(Mouvements date=ajd)', example: '47 scans', icon: Activity },
  { label: 'Coût de stockage', formula: 'Articles + Surface + Salaires', example: '38 056 DZD/mois', icon: Clock },
  { label: 'Articles en surstock', formula: 'Qté > Stock max (ou > 3×Seuil)', example: '0 article', icon: TrendingUp },
  { label: 'Commandes en attente', formula: 'Count(EN_ATTENTE ou EN_COURS)', example: '3 commandes', icon: Database },
  { label: 'Score santé stock', formula: '100 - (Critique×12) - (Faible×4) - (Surstock×3) + Bonus', example: '90/100', icon: Target },
]

const aiModels = [
  { phase: '0-6 mois', method: 'WMA — Weighted Moving Average', desc: 'Poids [1,2,3,4,5,6,7] sur 7 jours. Le jour le plus récent a le poids le plus fort.', mape: '15-20%', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { phase: '6-12 mois', method: 'Prophet (Meta)', desc: 'Capture les tendances et la saisonnalité. Idéal pour les données à moyen terme.', mape: '10-15%', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { phase: '12+ mois', method: 'LSTM — Deep Learning', desc: 'Réseau de neurones récurrent. Apprend les patterns complexes sur le long terme.', mape: '< 10%', color: 'bg-purple-50 text-purple-700 border-purple-200' },
]

const sheetsArch = [
  { name: 'Stock', cols: 'Code, Quantité, Seuil_Min, Zone', role: 'Stock en temps réel' },
  { name: 'Historique', cols: 'Date, Code, Quantité', role: 'Sorties journalières (988 lignes)' },
  { name: 'Mouvements', cols: 'Timestamp, Code, Action, Quantité', role: 'Log des scans' },
  { name: 'Prix', cols: 'Code, Prix_Unitaire, Coût_Stockage, Stock_Max', role: 'Données financières' },
  { name: 'Commandes', cols: 'ID, Statut, Fournisseur, Montant', role: 'Suivi des commandes' },
  { name: 'Config', cols: 'Paramètre, Valeur', role: 'Surface, salaires, objectifs' },
]

export default function LandingPage() {
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.97])
  const statsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [openEan, setOpenEan] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased">
      
      {/* ── NAVBAR ── */}
      <motion.nav
        initial={{ y: -60 }} animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/60"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
              <Image src="/logo.png" alt="SmartLog" width={36} height={36} className="object-cover" />
            </div>
            <div>
              <span className="text-base md:text-lg font-bold text-slate-800 tracking-tight">SmartLog</span>
              <span className="hidden sm:block text-[8px] font-semibold text-slate-400 tracking-[2px] uppercase leading-tight">WMS · RFID · IA</span>
            </div>
          </Link>
          
          <div className="hidden lg:flex items-center gap-1">
            {[
              { href: '#features', label: 'Fonctionnalités' },
              { href: '#dashboard', label: 'Dashboard' },
              { href: '#ai', label: 'IA Prédictive' },
              { href: '#alerts', label: 'Alertes' },
              { href: '#architecture', label: 'Architecture' },
              { href: '#equipe', label: 'Équipe' },
            ].map(item => (
              <a key={item.href} href={item.href} className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors">{item.label}</a>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors px-4 py-2 rounded-lg hover:bg-slate-50">
              <Lock className="w-3.5 h-3.5" /> Connexion
            </Link>
            <Link href="/dashboard" className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-sm">
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
                  { href: '#features', label: 'Fonctionnalités' },
                  { href: '#dashboard', label: 'Dashboard' },
                  { href: '#ai', label: 'IA Prédictive' },
                  { href: '#alerts', label: 'Alertes' },
                  { href: '#architecture', label: 'Architecture' },
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
      <motion.section style={{ opacity: heroOpacity, scale: heroScale }} className="relative pt-32 md:pt-40 pb-20 md:pb-28 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold tracking-wider mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-400" />
            Startup Algérienne — Smart Warehousing
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.05] mb-6"
          >
            La fin de l&apos;inventaire manuel.<br />
            <span className="text-slate-400">Le début de la visibilité absolue.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg text-slate-500 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            SmartLog est la première solution SaaS algérienne qui combine la traçabilité RFID UHF et l&apos;intelligence artificielle prédictive. Un WMS complet qui élimine Excel, réduit les erreurs de 30% à 1%, et anticipe vos ruptures de stock.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard" className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white px-8 py-3.5 rounded-xl text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2">
              Accéder à la plateforme <ChevronRight className="w-4 h-4" />
            </Link>
            <a href="#dashboard" className="w-full sm:w-auto border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 bg-white">
              <BarChart4 className="w-4 h-4" /> Voir le Dashboard
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-slate-400"
          >
            {['RFID UHF 865-868 MHz', '700 tags/seconde', 'Précision 99%', 'Dashboard Temps Réel', 'IA Prédictive WMA→LSTM', 'Bilingue FR/AR'].map(badge => (
              <span key={badge} className="flex items-center gap-1.5"><Check className="w-3 h-3 text-slate-300" />{badge}</span>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ── STATS BANNER ── */}
      <section id="stats" ref={statsRef} className="py-16 md:py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading label="Chiffres clés" title="Des résultats mesurables" desc="L'impact de SmartLog sur la gestion d'entrepôt." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Zap, value: 99, suffix: '%', label: 'Précision inventaire', color: 'text-sky-600' },
              { icon: TrendingUp, value: 50, suffix: '%', label: "Gain d'efficacité", color: 'text-emerald-600' },
              { icon: Activity, value: 10, suffix: 'x', label: 'Inventaire plus rapide', color: 'text-indigo-600' },
              { icon: ShieldCheck, value: 20, suffix: '%', label: 'Réduction des coûts', color: 'text-amber-600' },
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 0.05} className="bg-white rounded-xl p-6 text-center border border-slate-200">
                <div className="text-3xl md:text-4xl font-bold text-slate-800 mb-1 tracking-tight">{statsInView && <Counter to={stat.value} suffix={stat.suffix} />}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading label="Fonctionnalités" title="8 modules clés pour votre entrepôt"
            desc="De la réception RFID à la prévision IA, SmartLog couvre l'ensemble des processus logistiques." />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <FadeIn key={i} delay={i * 0.03} className="bg-white rounded-xl p-6 border border-slate-200 hover:border-slate-300 transition-all hover:shadow-sm">
                <div className={`w-11 h-11 rounded-lg ${f.bg} ${f.border} border flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="text-slate-800 font-bold text-base mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD KPIS ── */}
      <section id="dashboard" className="py-20 md:py-28 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading label="Dashboard Principal" title="KPIs en temps réel"
            desc="Page d'accueil de SmartLog. Rafraîchissement automatique toutes les 5 secondes." />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {kpiMain.map((kpi, i) => (
              <FadeIn key={i} delay={i * 0.05} className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                    <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{kpi.label}</span>
                </div>
                <p className="text-xs text-slate-400 font-mono mb-1">{kpi.formula}</p>
                <p className="text-lg font-bold text-slate-800">{kpi.example}</p>
              </FadeIn>
            ))}
          </div>

          <SectionHeading label="Indicateurs Avancés" title="7 métriques pour une visibilité totale" desc="" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {advancedIndicators.map((ind, i) => (
              <FadeIn key={i} delay={i * 0.03} className="bg-white rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <ind.icon className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-700">{ind.label}</span>
                </div>
                <p className="text-xs text-slate-400 font-mono mb-1">{ind.formula}</p>
                <p className="text-base font-bold text-slate-800">{ind.example}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHARTS SECTION ── */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading label="Analytics" title="4 visualisations clés"
            desc="Graphiques dynamiques pour une compréhension instantanée de votre entrepôt." />
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: BarChart4, title: 'Niveau de stock par article', desc: 'Barres colorées : Cyan (OK), Orange (Faible), Rouge (Critique) vs seuil minimum.', color: 'text-sky-600', bg: 'bg-sky-50' },
              { icon: PieChart, title: 'Répartition par catégorie', desc: 'Donut montrant la distribution : Chimie, Emballage, Logistique, Sécurité.', color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { icon: Activity, title: 'Remplissage des zones', desc: 'Barres de progression par emplacement. 100% = capacité max théorique (Seuil×3).', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: Database, title: 'Fil d\'événements temps réel', desc: 'Journal des scans, connexions et alertes. Entrées les plus récentes en premier.', color: 'text-amber-600', bg: 'bg-amber-50' },
            ].map((chart, i) => (
              <FadeIn key={i} delay={i * 0.05} className="bg-white rounded-xl p-6 border border-slate-200 flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${chart.bg} flex items-center justify-center shrink-0`}>
                  <chart.icon className={`w-6 h-6 ${chart.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">{chart.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{chart.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI PREDICTION MODULE ── */}
      <section id="ai" className="py-20 md:py-28 bg-slate-800 text-white border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 text-white/50 text-xs font-semibold uppercase tracking-widest mb-5">
              <BrainCircuit className="w-3.5 h-3.5" /> Intelligence Artificielle
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Module Prédiction IA</h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">Trois phases de maturité : du WMA classique au Deep Learning LSTM.</p>
          </motion.div>

          {/* AI Models */}
          <div className="grid md:grid-cols-3 gap-5 mb-16">
            {aiModels.map((m, i) => (
              <FadeIn key={i} delay={i * 0.1} className="rounded-xl p-6 border bg-white/5 border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">{m.phase}</span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">{m.mape}</span>
                </div>
                <h3 className="font-bold text-white text-base mb-2">{m.method}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{m.desc}</p>
              </FadeIn>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* WMA Detail */}
            <FadeIn className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
                <LineChart className="w-5 h-5 text-sky-400" /> Algorithme WMA
              </h3>
              <div className="space-y-3 text-sm">
                <p className="text-white/60"><span className="text-white font-semibold">Formule :</span> WMA = Σ(wᵢ × xᵢ) / Σwᵢ avec poids [1,2,3,4,5,6,7]</p>
                <div className="bg-white/5 rounded-lg p-4 font-mono text-xs text-white/60">
                  <p className="text-white/80 mb-2">Exemple SL-006 :</p>
                  <p>WMA = (66×1 + 83×2 + 87×3 + 75×4 + 94×5 + 74×6 + 138×7) / 28</p>
                  <p className="text-sky-400 mt-1">WMA = 95.5 u/jour → Prévision 7j = 668u · 14j = 1 337u</p>
                </div>
                <p className="text-white/60"><span className="text-white font-semibold">Date de rupture :</span> Jours_restants = floor(Stock / WMA)</p>
                <p className="text-white/60"><span className="text-white font-semibold">Taux de confiance :</span> CV = σ/μ · Confiance = max(60%, min(97%, (1-CV×0.8)×100%))</p>
              </div>
            </FadeIn>

            {/* Recommendations */}
            <FadeIn className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" /> Recommandations automatiques
              </h3>
              <div className="space-y-3">
                {[
                  { status: '🔴 Urgent', cond: 'Jours < 7', action: 'Commander maintenant', color: 'text-rose-300' },
                  { status: '🟠 Cette semaine', cond: '7 ≤ Jours < 14', action: 'Planifier commande', color: 'text-amber-300' },
                  { status: '🟢 OK', cond: 'Jours ≥ 14', action: 'Stock suffisant', color: 'text-emerald-300' },
                ].map((r, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className={`font-semibold text-sm ${r.color}`}>{r.status}</p>
                      <p className="text-xs text-white/40">{r.cond}</p>
                    </div>
                    <span className="text-xs text-white/60">{r.action}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── ANOMALIES + ABC + EOQ ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading label="Modules IA Avancés" title="Détection d'anomalies, Pareto ABC & EOQ"
            desc="Des algorithmes de classe enterprise pour une gestion scientifique des stocks." />

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Z-Score */}
            <FadeIn className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="w-11 h-11 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="font-bold text-slate-800 mb-3">Z-Score — Anomalies</h3>
              <p className="text-xs text-slate-400 font-mono mb-3">Z = |x - μ| / σ</p>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">Détecte les comportements anormaux dans les sorties de stock. Anomalie si Z &gt; 1.5σ, Critique si Z &gt; 2.5σ.</p>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-slate-600 mb-1">Exemple SL-003 :</p>
                <p className="text-xs text-slate-500 font-mono">μ=4u/j, σ=2, valeur=8 → Z=(8-4)/2=2.0 → HAUSSE MODÉRÉE</p>
              </div>
            </FadeIn>

            {/* ABC Pareto */}
            <FadeIn delay={0.05} className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="w-11 h-11 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center mb-4">
                <PieChart className="w-5 h-5 text-cyan-600" />
              </div>
              <h3 className="font-bold text-slate-800 mb-3">Pareto — Classification ABC</h3>
              <p className="text-xs text-slate-400 font-mono mb-3">Valeur_i = Demande_annuelle × Prix_unitaire</p>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">Classe les articles par valeur de consommation selon la loi 80/20.</p>
              <div className="space-y-2">
                {[
                  { cls: 'A', part: '0→70%', strategy: 'Contrôle strict · Réappro fréquent', color: 'bg-cyan-500' },
                  { cls: 'B', part: '70→90%', strategy: 'Contrôle modéré · Réappro mensuel', color: 'bg-emerald-500' },
                  { cls: 'C', part: '90→100%', strategy: 'Contrôle allégé · Commande en lot', color: 'bg-slate-400' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs">
                    <span className={`w-6 h-6 rounded ${c.color} text-white font-bold flex items-center justify-center`}>{c.cls}</span>
                    <span className="text-slate-500">{c.part}</span>
                    <span className="text-slate-400">— {c.strategy}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* EOQ */}
            <FadeIn delay={0.1} className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="w-11 h-11 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center mb-4">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-bold text-slate-800 mb-3">EOQ — Formule Wilson</h3>
              <p className="text-xs text-slate-400 font-mono mb-3">EOQ = √(2 × D × K / h)</p>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">Quantité optimale à commander. Minimise coût de commande + coût de stockage.</p>
              <div className="bg-slate-50 rounded-lg p-4 space-y-1">
                <p className="text-xs font-semibold text-slate-600 mb-1">Exemple SL-001 :</p>
                <p className="text-xs text-slate-500 font-mono">D=1825u/an, K=1500DZD, h=12DZD/u/an</p>
                <p className="text-xs text-slate-500 font-mono">EOQ = √(2×1825×1500/12) = <span className="text-purple-600 font-bold">675 unités</span></p>
                <p className="text-xs text-slate-500 font-mono">Stock sécurité (95%) = 1.65 × σ × √délai = <span className="text-purple-600 font-bold">35u</span></p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── CLUSTERING + RUPTURE CALENDAR ── */}
      <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Clustering */}
            <FadeIn>
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="w-11 h-11 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-bold text-slate-800 mb-4">Clustering — Profils de demande</h3>
                <p className="text-sm text-slate-500 mb-5">Regroupe les articles par comportement pour adapter la stratégie de prédiction.</p>
                <div className="space-y-3">
                  {[
                    { profile: 'Stable', criterion: 'CV < 0.5', model: 'WMA', color: 'bg-sky-50 text-sky-700 border-sky-200' },
                    { profile: 'Saisonnier', criterion: 'Ratio max/min > 1.8', model: 'Holt-Winters', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
                    { profile: 'Irrégulier', criterion: 'CV > 0.5', model: 'WMA + Stock sécu. élevé', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                    { profile: 'Faible', criterion: 'Moyenne < 2u/j', model: 'Contrôle allégé', color: 'bg-slate-100 text-slate-600 border-slate-200' },
                  ].map((p, i) => (
                    <div key={i} className={`rounded-lg p-4 border ${p.color}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm">{p.profile}</span>
                        <span className="text-xs font-mono">{p.criterion}</span>
                      </div>
                      <p className="text-xs opacity-70">Modèle : {p.model}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Rupture Calendar */}
            <FadeIn delay={0.1}>
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="w-11 h-11 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center mb-4">
                  <Calendar className="w-5 h-5 text-rose-600" />
                </div>
                <h3 className="font-bold text-slate-800 mb-4">Calendrier des ruptures</h3>
                <p className="text-sm text-slate-500 mb-5">Tableau trié par urgence avec date exacte de rupture prévue.</p>
                <div className="space-y-2">
                  {[
                    { status: 'Rupture imminente', jours: '< 7j', action: 'Commander immédiatement', color: 'text-rose-600', bg: 'bg-rose-50' },
                    { status: 'Urgent', jours: '7-14j', action: 'Commander cette semaine', color: 'text-orange-600', bg: 'bg-orange-50' },
                    { status: 'Surveiller', jours: '14-30j', action: 'Planifier', color: 'text-sky-600', bg: 'bg-sky-50' },
                    { status: 'OK', jours: '> 30j', action: 'Aucune action', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  ].map((r, i) => (
                    <div key={i} className={`${r.bg} rounded-lg px-4 py-3 flex items-center justify-between`}>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${r.color}`}>{r.status}</span>
                        <span className="text-xs text-slate-400 font-mono">{r.jours}</span>
                      </div>
                      <span className={`text-xs font-semibold ${r.color}`}>{r.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Scan Module workflow */}
          <FadeIn className="mt-8">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-11 h-11 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center">
                  <ScanLine className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Module Scan — Mouvements de stock</h3>
                  <p className="text-sm text-slate-500">Enregistrement des entrées/sorties via scan QR ou saisie manuelle. Mise à jour Google Sheets en temps réel.</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-4 gap-4">
                {[
                  { step: '1', label: 'Choisir', desc: '📤 Sortie ou 📥 Entrée' },
                  { step: '2', label: 'Définir', desc: 'Quantité (+/-)' },
                  { step: '3', label: 'Scanner', desc: 'QR code ou saisie manuelle' },
                  { step: '4', label: 'Valider', desc: 'Mise à jour temps réel' },
                ].map((s, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-4 text-center">
                    <span className="text-2xl font-bold text-slate-200 block mb-1">{s.step}</span>
                    <p className="text-xs font-semibold text-slate-600 mb-0.5">{s.label}</p>
                    <p className="text-xs text-slate-400">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── ALERTS ── */}
      <section id="alerts" className="py-20 md:py-28 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading label="Alertes & Notifications" title="Système d'alerte à deux niveaux"
            desc="Des notifications proactives pour ne jamais être pris au dépourvu." />
          
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Simple alerts */}
            <FadeIn className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Alertes Simples</h3>
                  <p className="text-xs text-slate-400">Opérationnelles dès le Jour 1</p>
                </div>
                <span className="ml-auto bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">ACTIF</span>
              </div>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Seuils min/max personnalisables</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Détection Z-Score (|Z| &gt; 3)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Alertes de rupture et surstock</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Notifications Toast (Succès/Erreur/Info)</li>
              </ul>
            </FadeIn>

            {/* AI alerts */}
            <FadeIn delay={0.05} className="bg-slate-800 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h3 className="font-bold">Alertes IA Avancées</h3>
                  <p className="text-xs text-white/40">Activation progressive (6-12 mois)</p>
                </div>
                <span className="ml-auto bg-amber-400/10 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/20">PROGRESSIF</span>
              </div>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-sky-400 shrink-0" /> Détection ML (Isolation Forest)</li>
                <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-sky-400 shrink-0" /> Apprentissage des patterns normaux</li>
                <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-sky-400 shrink-0" /> Drape les déviations avant rupture</li>
                <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-sky-400 shrink-0" /> Recommandations contextualisées</li>
              </ul>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURE ── */}
      <section id="architecture" className="py-20 md:py-28 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading label="Architecture" title="Hardware + Software, une synergie complète"
            desc="Du portique RFID au dashboard IA, chaque couche est conçue pour fonctionner ensemble." />

          <div className="grid lg:grid-cols-2 gap-8">
            <FadeIn>
              <div className="bg-white rounded-2xl p-8 md:p-10 border border-slate-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-sky-50 rounded-xl border border-sky-200 flex items-center justify-center">
                    <Radio className="w-7 h-7 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hardware</p>
                    <h3 className="text-xl font-bold text-slate-800">Kit RFID UHF</h3>
                  </div>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">Remplacement complet du scan code-barres. Portiques Impinj R700 et lecteurs mobiles Zebra. Élimine 8-12h d'inventaire manuel en 10-15 minutes.</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { label: 'Fréquence', value: 'UHF 865-868 MHz' },
                    { label: 'Portée max', value: '10 mètres' },
                    { label: 'Débit', value: '700 tags/s' },
                    { label: 'Standard', value: 'EPC Gen2' },
                  ].map((spec, i) => (
                    <div key={i} className="bg-slate-50 rounded-lg p-3">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{spec.label}</p>
                      <p className="text-sm font-semibold text-slate-700">{spec.value}</p>
                    </div>
                  ))}
                </div>
                <ul className="space-y-2.5">
                  {['Lecteurs fixes aux quais (Entrées/Sorties)', 'Antennes directionnelles (couverture 70m²)', 'Middleware RFID anti-redondance', 'Tags UHF passifs EPC Gen2'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-600"><Check className="w-4 h-4 text-sky-500 shrink-0" />{item}</li>
                  ))}
                </ul>
                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-xs font-semibold text-amber-700">💡 Ce qu'il remplace :</p>
                  <p className="text-xs text-amber-600 mt-1">Scan code-barres manuel · Visibilité directe · Comptage unitaire → 8-12h réduits à 10-15 min</p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.05}>
              <div className="bg-slate-800 rounded-2xl p-8 md:p-10 text-white">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center">
                    <Cloud className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Software</p>
                    <h3 className="text-xl font-bold">WMS SaaS + IA</h3>
                  </div>
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-6">Plateforme Cloud centralisée accessible depuis n'importe où. Dashboard en temps réel, alertes Z-Score, prévision de la demande par IA progressive (WMA → Prophet → LSTM).</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { label: 'Disponibilité', value: '99.9% SLA' },
                    { label: 'Sécurité', value: 'HACCP / GDPR' },
                    { label: 'Données', value: 'Temps réel' },
                    { label: 'Déploiement', value: 'Cloud / Hybride' },
                  ].map((spec, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-0.5">{spec.label}</p>
                      <p className="text-sm font-semibold text-white">{spec.value}</p>
                    </div>
                  ))}
                </div>
                <ul className="space-y-2.5">
                  {['Dashboard KPIs (rafraîchi toutes les 5s)', 'Alertes anomalies Z-Score', 'Prévisions WMA → Prophet → LSTM', 'Assistant IA conversationnel', 'Bilingue Français / Arabe'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white/80"><Check className="w-4 h-4 text-emerald-400 shrink-0" />{item}</li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── GOOGLE SHEETS ARCHITECTURE ── */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading label="Architecture Données" title="6 feuilles Google Sheets interconnectées"
            desc="Une architecture simple, transparente et accessible. Chaque feuille a un rôle précis." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sheetsArch.map((s, i) => (
              <FadeIn key={i} delay={i * 0.03} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-700 text-sm">{s.name}</h3>
                  <Database className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-xs text-slate-400 font-mono mb-1">{s.cols}</p>
                <p className="text-xs text-slate-500">{s.role}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading label="Fonctionnement" title="Comment ça marche"
            desc="Du scan RFID à la décision IA, en 3 étapes." />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '1', icon: Radio, title: 'Capture RFID', desc: 'Les articles passent sous le portique Impinj R700. Les tags UHF sont lus instantanément, sans contact.', color: 'text-sky-600', bg: 'bg-sky-50' },
              { step: '2', icon: BrainCircuit, title: 'Analyse IA', desc: 'Nos algorithmes WMA, Z-Score et Prophet analysent les flux en temps réel.', color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { step: '3', icon: Eye, title: 'Décision & Action', desc: 'KPIs, alertes, recommandations EOQ. Prenez les bonnes décisions au bon moment.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            ].map((step, i) => (
              <FadeIn key={i} delay={i * 0.1} className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-slate-200">{step.step}</span>
                  <div className={`w-10 h-10 rounded-lg ${step.bg} flex items-center justify-center`}><step.icon className={`w-5 h-5 ${step.color}`} /></div>
                </div>
                <h3 className="text-slate-800 font-bold text-base mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-20 md:py-28 bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 text-white/50 text-xs font-semibold uppercase tracking-widest mb-5">Notre vision</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Les 4 piliers stratégiques</h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">Pourquoi les PME algériennes nous font confiance.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Cpu, title: 'Modernité', desc: 'Premier WMS en Algérie unifiant matériel RFID et IA Cloud.' },
              { icon: Activity, title: 'Performance', desc: 'Précision stocks 60%→99%. Opérations 50% plus rapides.' },
              { icon: TrendingUp, title: 'Réduction coûts', desc: 'Inventaire divisé par 10. Baisse de 20% des charges logistiques.' },
              { icon: ShieldCheck, title: 'Sécurité', desc: 'Traçabilité HACCP/GDP. Alertes proactives avant rupture.' },
            ].map((v, i) => (
              <FadeIn key={i} delay={i * 0.05} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                <v.icon className="w-8 h-8 text-sky-400 mb-4" />
                <h3 className="font-bold text-base mb-2">{v.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{v.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Quote className="w-10 h-10 text-slate-200 mx-auto mb-6" />
            <blockquote className="text-xl md:text-2xl text-slate-600 leading-relaxed mb-8">
              &ldquo;SmartLog a transformé notre gestion d&apos;entrepôt. Nous sommes passés de 3 jours d&apos;inventaire à 2 heures. Et nous n&apos;avons plus jamais eu de rupture de stock.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">KM</div>
              <div className="text-left">
                <p className="font-semibold text-slate-800 text-sm">Kamel Mansouri</p>
                <p className="text-xs text-slate-400">Directeur Logistique, Groupe SPA</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section id="equipe" className="py-20 md:py-28 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading label="Équipe" title="L'équipe SmartLog"
            desc="Master 2 SCM — EHEC Alger · 2025-2026" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((m, i) => (
              <FadeIn key={i} delay={i * 0.05} className="bg-white rounded-xl p-6 border border-slate-200 text-center hover:shadow-sm transition-shadow">
                <div className={`w-16 h-16 rounded-xl ${m.color} flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg shadow-sm`}>
                  {m.initials}
                </div>
                <h3 className="font-bold text-slate-800 text-sm">{m.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{m.role}</p>
              </FadeIn>
            ))}
          </div>
          <FadeIn className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              EHEC Alger · Master 2 Supply Chain Management · Sous la direction de l'équipe pédagogique
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 md:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <SectionHeading label="FAQ" title="Questions fréquentes" desc="Tout ce que vous devez savoir avant de démarrer." />
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                  <span className="text-sm font-semibold text-slate-700 pr-4">{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-6 overflow-hidden">
              <Image src="/logo.png" alt="SmartLog" width={40} height={40} className="object-cover" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Prêt à digitaliser votre logistique ?
            </h2>
            <p className="text-slate-500 text-lg mb-8 max-w-xl mx-auto">
              Rejoignez les PME algériennes qui ont déjà modernisé leur entrepôt. Fini les fichiers Excel et les inventaires interminables.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white px-8 py-3.5 rounded-xl text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2">
                Entrer dans l'application <ChevronRight className="w-4 h-4" />
              </Link>
              <Link href="/login" className="w-full sm:w-auto border border-slate-200 hover:border-slate-300 text-slate-600 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 bg-white">
                <Lock className="w-4 h-4" /> Espace client
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                  <Image src="/logo.png" alt="SmartLog" width={28} height={28} className="object-cover" />
                </div>
                <span className="font-bold text-white text-sm">SmartLog</span>
              </div>
              <p className="text-sm text-white/40 leading-relaxed max-w-md">Première plateforme SaaS algérienne combinant RFID UHF et intelligence artificielle pour la gestion d'entrepôts.</p>
              <div className="flex items-center gap-4 mt-4 text-xs text-white/30">
                <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Alger, Algérie</span>
                <span>contact@smartlog.dz</span>
                <span>+213 (0) 770 12 34 56</span>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-4">Produit</h4>
              <div className="space-y-2.5">
                {['Fonctionnalités', 'Dashboard', 'IA Prédictive', 'Documentation API'].map(item => (
                  <p key={item} className="text-sm text-white/50 hover:text-white cursor-pointer transition-colors">{item}</p>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-4">Équipe</h4>
              <div className="space-y-2.5 text-sm text-white/50">
                {team.map(m => (
                  <p key={m.name}>{m.name} — {m.role}</p>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30">
            <span>© 2026 SmartLog — Tous droits réservés</span>
            <div className="flex items-center gap-4">
              <span>Mentions légales</span>
              <span>Confidentialité</span>
              <span>www.smartlog.dz</span>
            </div>
          </div>
        </div>
      </footer>
      
      <AIChatWidget />
    </div>
  )
}
