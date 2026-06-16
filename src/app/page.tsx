'use client'

import React from 'react'
import { motion, useScroll, useTransform, Variants } from 'framer-motion'
import Link from 'next/link'
import { 
  Radio, BrainCircuit, Activity, BarChart4, Box, 
  ShieldCheck, Zap, Server, ChevronRight, Lock
} from 'lucide-react'

// Animations
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

export default function LandingPage() {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-[#0099e0]/20 overflow-hidden relative">
      
      {/* ── BACKGROUND GLOWS ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[500px] bg-gradient-to-b from-[#0099e0]/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-[40vh] -right-40 w-96 h-96 bg-secondary/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-[80vh] -left-40 w-96 h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Box className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black text-primary tracking-tight">SmartLog<span className="text-secondary">.</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#solution" className="hover:text-primary transition-colors">La Solution</a>
            <a href="#architecture" className="hover:text-primary transition-colors">Architecture</a>
            <a href="#valeurs" className="hover:text-primary transition-colors">Valeurs</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-primary transition-colors">
              <Lock className="w-4 h-4" /> Espace Client
            </Link>
            <Link href="/dashboard" className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 flex items-center gap-2">
              Lancer WMS <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <motion.section 
        style={{ opacity, scale }}
        className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 max-w-7xl mx-auto text-center"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-semibold text-xs tracking-widest uppercase mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          Première plateforme WMS + RFID + IA en Algérie
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8"
        >
          La fin de l&apos;inventaire <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">manuel.</span><br />
          Le début de la <span className="text-primary">visibilité absolue.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto mb-12 leading-relaxed font-medium"
        >
          Transformez votre entrepôt avec la solution SaaS algérienne qui combine la traçabilité RFID ultra-rapide et l&apos;Intelligence Artificielle prédictive. Éliminez 99% des erreurs et anticipez la demande.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/dashboard" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 group">
            Accéder à la plateforme
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="#solution" className="w-full sm:w-auto bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-8 py-4 rounded-2xl text-base font-bold transition-all hover:bg-slate-50 flex items-center justify-center">
            Découvrir l&apos;architecture
          </Link>
        </motion.div>
      </motion.section>

      {/* ── HYBRID ARCHITECTURE ── */}
      <section id="solution" className="py-24 bg-white border-y border-slate-200 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-primary font-black text-3xl md:text-4xl mb-4">Architecture Hybride</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Une combinaison puissante de matériel industriel et de logiciel Cloud intelligent pour une numérisation totale.</p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Hardware */}
            <motion.div variants={fadeInUp} className="bg-slate-50 rounded-[2rem] p-10 border border-slate-200 hover:shadow-xl transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl rounded-full group-hover:bg-secondary/20 transition-colors" />
              <div className="w-14 h-14 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center mb-6">
                <Radio className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Hardware : Kit RFID UHF</h3>
              <p className="text-slate-600 leading-relaxed mb-8">
                Remplacement complet du scan code-barres. Portiques de détection automatique Impinj R700 et lecteurs mobiles Zebra pour un inventaire à la vitesse de la lumière (sans visibilité directe).
              </p>
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
            </motion.div>

            {/* Software */}
            <motion.div variants={fadeInUp} className="bg-primary rounded-[2rem] p-10 shadow-2xl relative overflow-hidden group text-white">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-3xl rounded-full group-hover:bg-white/20 transition-colors" />
              <div className="w-14 h-14 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                <Server className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Software : WMS SaaS + IA</h3>
              <p className="text-white/80 leading-relaxed mb-8">
                Plateforme Cloud centralisée accessible de partout. Tableau de bord temps réel, alertes intelligentes (Z-Score) et prévision de la demande.
              </p>
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
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 4 STRATEGIC VALUES ── */}
      <section id="valeurs" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-primary font-black text-3xl md:text-4xl mb-4">Les 4 Piliers Stratégiques</h2>
            <p className="text-slate-500 text-lg">Pourquoi les PME algériennes choisissent SmartLog.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap, color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20',
                title: 'Modernité',
                desc: 'Premier WMS en Algérie unifiant matériel RFID et intelligence artificielle Cloud.'
              },
              {
                icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20',
                title: 'Performance',
                desc: 'Précision des stocks passant de 60% à 99%. Vitesse d\'opération accélérée de 50%.'
              },
              {
                icon: BarChart4, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20',
                title: 'Réduction Coûts',
                desc: 'Le temps d\'inventaire est divisé par 10. Baisse de 20% des charges logistiques.'
              },
              {
                icon: ShieldCheck, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20',
                title: 'Réduction Risques',
                desc: 'Traçabilité absolue (HACCP/GDP) et alertes proactives avant la rupture de stock.'
              }
            ].map((v, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${v.bg} ${v.border} border`}>
                  <v.icon className={`w-6 h-6 ${v.color}`} />
                </div>
                <h4 className="text-slate-900 font-bold text-lg mb-2">{v.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA / FOOTER ── */}
      <section className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
            <BrainCircuit className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-6">Prêt à digitaliser votre logistique ?</h2>
          <p className="text-slate-500 mb-8 max-w-xl">
            Rejoignez la révolution logistique en Algérie. Fini les fichiers Excel obsolètes et les inventaires interminables.
          </p>
          <Link href="/dashboard" className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl text-base font-bold shadow-xl transition-all hover:scale-105 flex items-center gap-2">
            Entrer dans l&apos;application WMS <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
      
    </div>
  )
}
