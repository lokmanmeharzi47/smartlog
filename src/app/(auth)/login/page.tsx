'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import { Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/')
    })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast.success('Welcome back!')
        router.push('/')
        router.refresh()
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        toast.success('Account created. Please check your email.')
        setMode('login')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-primary flex-col justify-between p-12 relative overflow-hidden">
        {/* Subtle decorative background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden p-1">
            <Image src="/logo.png" alt="SmartLog" width={40} height={40} className="object-cover" />
          </div>
          <div>
            <span className="text-white font-bold text-lg tracking-tight">SmartLog</span>
            <div className="text-white/40 text-[10px] font-mono tracking-widest uppercase">WMS v2.0</div>
          </div>
        </div>

        {/* Main copy */}
        <div className="relative">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Intelligent Warehouse<br />Management
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-xs">
            Real-time inventory tracking, AI-powered predictions, and smart restocking recommendations — all in one platform.
          </p>

          {/* Feature list */}
          <div className="mt-8 space-y-3">
            {[
              'Real-time stock monitoring',
              'AI demand forecasting',
              'Automated restocking alerts',
              'Advanced analytics & reports',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                <span className="text-white/70 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative text-white/25 text-xs font-mono">
          SmartLog WMS v2.0 &middot; eu-central-1
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center overflow-hidden p-1">
              <Image src="/logo.png" alt="SmartLog" width={36} height={36} className="object-cover" />
            </div>
            <span className="text-primary font-bold text-lg tracking-tight">SmartLog WMS</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {mode === 'login' ? 'Sign in to your account' : 'Create an account'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {mode === 'login'
                ? 'Enter your credentials to access the dashboard'
                : 'Fill in the details to get started'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all shadow-sm shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-slate-500 mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setMode(m => m === 'login' ? 'signup' : 'login')}
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              {mode === 'login' ? 'Create account' : 'Sign in'}
            </button>
          </p>

          <div className="mt-10 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
            SmartLog WMS &middot; Powered by Supabase
          </div>
        </div>
      </div>
    </div>
  )
}
