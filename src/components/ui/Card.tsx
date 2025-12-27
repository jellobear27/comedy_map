'use client'

import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient'
  hover?: boolean
}

export default function Card({ 
  className = '', 
  variant = 'default', 
  hover = true, 
  children, 
  ...props 
}: CardProps) {
  const variants = {
    default: 'bg-[#1A0033]/40 border border-[#7B2FF7]/20',
    glass: 'bg-[#7B2FF7]/8 backdrop-blur-xl border border-[#7B2FF7]/20',
    gradient: 'bg-gradient-to-br from-[#7B2FF7]/20 via-[#F72585]/10 to-transparent border border-[#7B2FF7]/30',
  }

  const hoverStyles = hover 
    ? 'hover:border-[#7B2FF7]/50 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(123,47,247,0.15)]' 
    : ''

  return (
    <div
      className={`
        rounded-2xl p-6 transition-all duration-300
        ${variants[variant]}
        ${hoverStyles}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

