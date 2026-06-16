'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion'
import Link from 'next/link'
import { 
  Radio, BrainCircuit, Activity, BarChart4, Box, 
  ShieldCheck, Zap, ChevronRight, Lock,
  Globe, Cpu, Cloud, Eye, TrendingUp,
  ArrowDown, Sparkles, ScanLine, Quote
} from 'lucide-react'


function Counter({ from = 0, to, suffix = '', decimals = 0 }: { from?: number; to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = React.useState(from)
  
  React.useEffect(() => {
    if (!isInView) return
    let start = from
    const duration = 2000
    const steps = 60
    const increment = (to - from) / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      start += increment
      if (step >= steps) {
        setCount(to)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [isInView, from, to])
  
  return (
    <span ref={ref}>
      {count.toFixed(decimals)}{suffix}
    </span>
  )
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

export default function LandingPage() {
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 300])
  
  const statsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true })

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 })

  function handleMouseMove(e: React.MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-[#0099e0]/20 overflow-x-hidden">
      
      {/* ── AMBIENT BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] h-[600px] bg-gradient-to-b from-[#0099e0]/8 via-primary/5 to-transparent blur-[120px]" />
        <div className="absolute top-[30vh] -right-40 w-96 h-96 bg-secondary/8 blur-[100px] rounded-full" />
        <div className="absolute top-[60vh] -left-40 w-96 h-96 bg-primary/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-t from-white to-transparent" />
        <motion.div className="absolute inset-0 opacity-[0.03]" style={{ y: bgY, backgroundImage: 'radial-gradient(circle at 1px 1px, #00509d 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      {/* ── NAVBAR ── */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-200/50"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all group-hover:scale-105">
              <Box className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black text-primary tracking-tight">SmartLog<span className="text-secondary">.</span></span>
              <span className="block text-[9px] font-mono text-slate-400 tracking-[3px] uppercase -mt-0.5">WMS + RFID + IA</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            {[
              { href: '#solution', label: 'Solution' },
              { href: '#stats', label: 'Chiffres' },
              { href: '#tech', label: 'Technologie' },
              { href: '#valeurs', label: 'Valeurs' },
            ].map(item => (
              <a key={item.href} href={item.href} className="relative hover:text-primary transition-colors group py-2">
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors px-4 py-2 rounded-xl hover:bg-slate-100">
              <Lock className="w-4 h-4" /> Connexion
            </Link>
            <Link href="/dashboard" className="relative bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 flex items-center gap-2 group overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Démarrer <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-32 pb-20"
      >
        {/* Floating 3D orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[20%] left-[10%] w-20 h-20 border border-primary/10 rounded-[2rem] bg-primary/5 backdrop-blur-xl"
          />
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[40%] right-[15%] w-16 h-16 border border-secondary/10 rounded-full bg-secondary/5 backdrop-blur-xl"
          />
          <motion.div
            animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-[30%] left-[20%] w-24 h-24 border border-primary/10 rounded-[3rem] bg-primary/[0.03] backdrop-blur-xl"
          />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10 text-primary font-bold text-xs tracking-widest uppercase mb-8 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            Première plateforme WMS + RFID + IA en Algérie
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.95] mb-8"
          >
            <span className="block">La fin de l&apos;inventaire</span>
            <span className="block mt-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-secondary">manuel.</span>
            </span>
            <span className="block mt-2 text-4xl sm:text-5xl md:text-6xl text-slate-400 font-bold">
              Le début de la <span className="text-primary">visibilité absolue</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto mb-12 leading-relaxed font-medium"
          >
            Transformez votre entrepôt avec la solution SaaS algérienne qui combine la traçabilité RFID ultra-rapide et l&apos;Intelligence Artificielle prédictive. Éliminez <span className="text-primary font-bold">99%</span> des erreurs et anticipez la demande.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard" className="group relative w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-10 py-5 rounded-2xl text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 overflow-hidden">
              <span className="relative z-10 flex items-center gap-3">
                Accéder à la plateforme
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.5 }}
              />
            </Link>
            <Link href="#solution" className="w-full sm:w-auto bg-white/80 backdrop-blur-sm border-2 border-slate-200 hover:border-primary/30 text-slate-700 px-10 py-5 rounded-2xl text-base font-bold transition-all hover:bg-white hover:shadow-lg flex items-center justify-center gap-2">
              <ScanLine className="w-5 h-5 text-secondary" />
              Découvrir la solution
            </Link>
          </motion.div>

          {/* Floating badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400"
          >
            {['RFID UHF', 'IA Prédictive', 'Dashboard Temps Réel', 'Made in Algeria'].map((badge, i) => (
              <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/50 backdrop-blur-sm rounded-full border border-slate-200/50">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                {badge}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-slate-300">
            <ArrowDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ── STATS BANNER ── */}
      <section id="stats" ref={statsRef} className="relative z-10 -mt-16 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50"
          >
            {[
              { icon: Zap, value: 99, suffix: '%', label: 'Précision Stock', color: 'text-secondary', bg: 'bg-secondary/5' },
              { icon: TrendingUp, value: 50, suffix: '%', label: "Gain d'Efficacité", color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
              { icon: Activity, value: 10, suffix: 'x', label: 'Inventaire Plus Rapide', color: 'text-purple-500', bg: 'bg-purple-500/5' },
              { icon: ShieldCheck, value: 20, suffix: '%', label: 'Réduction Coûts', color: 'text-orange-500', bg: 'bg-orange-500/5' },
            ].map((stat, i) => (
              <div key={i} className={`${stat.bg} p-8 md:p-10 text-center flex flex-col items-center justify-center`}>
                <div className={`w-14 h-14 rounded-2xl ${stat.bg} border border-slate-200/50 flex items-center justify-center mb-5`}>
                  <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <div className={`text-4xl md:text-5xl font-black text-slate-900 mb-2 font-mono tracking-tighter`}>
                  {statsInView && <Counter to={stat.value} suffix={stat.suffix} />}
                </div>
                <div className="text-slate-500 text-sm font-semibold">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HYBRID ARCHITECTURE ── */}
      <section id="solution" className="py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <Cpu className="w-3.5 h-3.5" /> Architecture
            </div>
            <h2 className="text-primary font-black text-4xl md:text-5xl mb-4 tracking-tight">Architecture Hybride</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Une combinaison puissante de matériel industriel et de logiciel Cloud intelligent pour une numérisation totale de votre entrepôt.</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Hardware Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              onMouseMove={handleMouseMove}
              className="group relative bg-gradient-to-br from-slate-50 to-white rounded-[2rem] p-10 border border-slate-200 hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/5 blur-[80px] rounded-full group-hover:bg-secondary/10 transition-all duration-700" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/5 blur-[60px] rounded-full" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center group-hover:shadow-md group-hover:border-secondary/30 transition-all">
                    <Radio className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[3px] text-slate-400">Hardware</span>
                    <h3 className="text-2xl font-bold text-slate-900">Kit RFID UHF</h3>
                  </div>
                </div>
                
                <p className="text-slate-600 leading-relaxed mb-8">
                  Remplacement complet du scan code-barres. Portiques de détection automatique <span className="font-bold text-slate-800">Impinj R700</span> et lecteurs mobiles <span className="font-bold text-slate-800">Zebra</span> pour un inventaire à la vitesse de la lumière.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { label: 'Fréquence', value: 'UHF 865-868 MHz' },
                    { label: 'Portée', value: 'Jusqu\'à 10m' },
                    { label: 'Tags/s', value: '700 tags/seconde' },
                    { label: 'Standards', value: 'EPC Gen2 / ISO' },
                  ].map((spec, i) => (
                    <div key={i} className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-slate-200/50">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{spec.label}</div>
                      <div className="text-sm font-bold text-slate-800">{spec.value}</div>
                    </div>
                  ))}
                </div>

                <ul className="space-y-3">
                  {[
                    'Tags UHF passifs (EPC Gen2)',
                    'Lecteurs fixes aux quais (Entrées/Sorties)',
                    'Antennes directionnelles (couverture 70m²)',
                    'Middleware RFID anti-redondance'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Software Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative bg-gradient-to-br from-primary to-primary-container rounded-[2rem] p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 blur-[80px] rounded-full group-hover:bg-white/10 transition-all duration-700" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/10 blur-[60px] rounded-full" />
              
              <div className="relative z-10 text-white">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all">
                    <Cloud className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[3px] text-white/50">Software</span>
                    <h3 className="text-2xl font-bold">WMS SaaS + IA</h3>
                  </div>
                </div>
                
                <p className="text-white/80 leading-relaxed mb-8">
                  Plateforme Cloud centralisée accessible de partout. Tableau de bord temps réel, <span className="font-bold text-white">alertes intelligentes (Z-Score)</span> et prévision de la demande par IA.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { label: 'Disponibilité', value: '99.9% SLA' },
                    { label: 'Sécurité', value: 'HACCP / GDPR' },
                    { label: 'Mise à jour', value: 'Temps réel' },
                    { label: 'Déploiement', value: 'Cloud / Hybride' },
                  ].map((spec, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-white/40 mb-0.5">{spec.label}</div>
                      <div className="text-sm font-bold text-white">{spec.value}</div>
                    </div>
                  ))}
                </div>

                <ul className="space-y-3">
                  {[
                    'Dashboard KPIs en temps réel',
                    'Alertes anomalies et ruptures (Z-Score)',
                    'Modèles de prévision (WMA → Prophet → LSTM)',
                    'Agent Conversationnel IA Intégré'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-semibold text-white/90">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TECH FLOW ── */}
      <section id="tech" className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <BrainCircuit className="w-3.5 h-3.5" /> Technologie
            </div>
            <h2 className="text-primary font-black text-4xl md:text-5xl mb-4 tracking-tight">Comment ça marche</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Du scan RFID à la décision IA, en 3 étapes simples.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: ScanLine,
                title: 'Capture RFID',
                desc: 'Les articles passent sous le portique Impinj R700. Les tags UHF sont lus instantanément, sans contact et sans visibilité directe.',
                color: 'text-secondary',
                border: 'border-secondary/20',
                bg: 'bg-secondary/5'
              },
              {
                step: '02',
                icon: BrainCircuit,
                title: 'Analyse IA',
                desc: 'Nos algorithmes (WMA, Z-Score, Prophet) analysent les flux en temps réel. Détection des anomalies et prévision de la demande.',
                color: 'text-primary',
                border: 'border-primary/20',
                bg: 'bg-primary/5'
              },
              {
                step: '03',
                icon: Eye,
                title: 'Visibilité Totale',
                desc: 'KPIs en direct, alertes proactives de rupture, recommandations EOQ. Prenez les bonnes décisions au bon moment.',
                color: 'text-emerald-500',
                border: 'border-emerald-500/20',
                bg: 'bg-emerald-500/5'
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-white rounded-[2rem] p-8 border border-slate-200 hover:shadow-xl transition-all group"
              >
                <div className={`text-6xl font-black text-slate-100 absolute top-4 right-6 group-hover:scale-110 transition-transform pointer-events-none`}>
                  {step.step}
                </div>
                <div className={`w-16 h-16 rounded-2xl ${step.bg} ${step.border} border flex items-center justify-center mb-6 relative z-10`}>
                  <step.icon className={`w-8 h-8 ${step.color}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 relative z-10">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed relative z-10">{step.desc}</p>
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary rounded-b-[2rem] scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 STRATEGIC VALUES ── */}
      <section id="valeurs" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <BarChart4 className="w-3.5 h-3.5" /> Pourquoi SmartLog
            </div>
            <h2 className="text-primary font-black text-4xl md:text-5xl mb-4 tracking-tight">Les 4 Piliers Stratégiques</h2>
            <p className="text-slate-500 text-lg">Pourquoi les PME algériennes choisissent SmartLog.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap, color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20',
                title: 'Modernité',
                desc: 'Premier WMS en Algérie unifiant matériel RFID et intelligence artificielle Cloud.',
                gradient: 'from-secondary/5 to-transparent'
              },
              {
                icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20',
                title: 'Performance',
                desc: 'Précision des stocks passant de 60% à 99%. Vitesse d\'opération accélérée de 50%.',
                gradient: 'from-emerald-500/5 to-transparent'
              },
              {
                icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20',
                title: 'Réduction Coûts',
                desc: 'Le temps d\'inventaire est divisé par 10. Baisse de 20% des charges logistiques.',
                gradient: 'from-purple-500/5 to-transparent'
              },
              {
                icon: ShieldCheck, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20',
                title: 'Réduction Risques',
                desc: 'Traçabilité absolue (HACCP/GDP) et alertes proactives avant la rupture de stock.',
                gradient: 'from-orange-500/5 to-transparent'
              }
            ].map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative group bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-2 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-b ${v.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${v.bg} ${v.border} border group-hover:scale-110 transition-transform`}>
                    <v.icon className={`w-7 h-7 ${v.color}`} />
                  </div>
                  <h4 className="text-slate-900 font-bold text-lg mb-2">{v.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST / TESTIMONIAL ── */}
      <section className="py-24 bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Quote className="w-12 h-12 text-primary/20 mx-auto mb-6" />
            <blockquote className="text-2xl md:text-3xl font-bold text-slate-800 leading-relaxed mb-8">
              &ldquo;SmartLog a transformé notre gestion d&apos;entrepôt. 
              <span className="text-primary"> Nous sommes passés de 3 jours d&apos;inventaire à 2 heures.</span>
              Et nous n&apos;avons plus jamais eu de rupture de stock.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                KM
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-800">Kamel Mansouri</p>
                <p className="text-sm text-slate-500">Directeur Logistique, Groupe SPA</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA / FOOTER ── */}
      <section className="bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[400px] bg-gradient-to-b from-primary/10 to-transparent blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-white/5 rounded-[1.5rem] flex items-center justify-center mb-6 border border-white/10">
              <BrainCircuit className="w-10 h-10 text-secondary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Prêt à digitaliser votre logistique ?</h2>
            <p className="text-slate-400 mb-10 max-w-xl text-lg">
              Rejoignez la révolution logistique en Algérie. Fini les fichiers Excel obsolètes et les inventaires interminables.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-10 py-5 rounded-2xl text-base font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 flex items-center gap-3 group">
                Entrer dans l&apos;application WMS <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-10 py-5 rounded-2xl text-base font-bold transition-all flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Espace Client
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Box className="w-5 h-5 text-secondary" />
              <span className="font-bold text-slate-400">SmartLog WMS</span>
            </div>
            <div className="flex items-center gap-6">
              <span>© 2026 SmartLog</span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Algérie
              </span>
              <span className="text-[10px] font-mono text-slate-600">v2.0.0</span>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  )
}
