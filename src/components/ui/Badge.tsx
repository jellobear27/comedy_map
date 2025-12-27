'use client'

import { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md'
}

export default function Badge({ 
  className = '', 
  variant = 'default', 
  size = 'md',
  children, 
  ...props 
}: BadgeProps) {
  const variants = {
    default: 'bg-[#7B2FF7]/20 text-[#7B2FF7] border-[#7B2FF7]/30',
    success: 'bg-[#00F5D4]/20 text-[#00F5D4] border-[#00F5D4]/30',
    warning: 'bg-[#FFB627]/20 text-[#FFB627] border-[#FFB627]/30',
    danger: 'bg-[#FF6B6B]/20 text-[#FF6B6B] border-[#FF6B6B]/30',
    info: 'bg-[#F72585]/20 text-[#F72585] border-[#F72585]/30',
  }

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
  }

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  )
}

