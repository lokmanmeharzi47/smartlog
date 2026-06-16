'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...buttonProps } = props as any
  
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest'
  
  const variants = {
    primary: 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-lg shadow-cyan-500/20 border border-cyan-400/20',
    secondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 shadow-lg shadow-black/20',
    outline: 'bg-transparent border border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600',
    ghost: 'bg-transparent text-slate-400 hover:bg-slate-800 hover:text-white',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 shadow-lg shadow-red-500/10',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-[10px] gap-1.5',
    md: 'px-5 py-2.5 text-xs gap-2',
    lg: 'px-8 py-3.5 text-sm gap-3',
  }

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...buttonProps}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </motion.button>
  )
}
