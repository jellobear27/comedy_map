'use client'

import { useState, useEffect, ReactNode } from 'react'

interface PageRevealProps {
  children: ReactNode
  /** Delay before animation starts (ms) */
  delay?: number
  /** Duration of the reveal animation (ms) */
  duration?: number
  /** Type of reveal animation */
  variant?: 'circle' | 'wipe-up' | 'wipe-down' | 'scale'
}

// Get clip-path values based on variant
const getClipPath = (variant: string) => {
  switch (variant) {
    case 'circle':
      return {
        initial: 'circle(0% at 50% 40%)',
        revealed: 'circle(150% at 50% 40%)',
      }
    case 'wipe-up':
      return {
        initial: 'inset(100% 0 0 0)',
        revealed: 'inset(0% 0 0 0)',
      }
    case 'wipe-down':
      return {
        initial: 'inset(0 0 100% 0)',
        revealed: 'inset(0 0 0% 0)',
      }
    case 'scale':
      return {
        initial: 'inset(5%)',
        revealed: 'inset(0%)',
      }
    default:
      return {
        initial: 'inset(100% 0 0 0)',
        revealed: 'inset(0% 0 0 0)',
      }
  }
}

/**
 * PageReveal - Smooth page transition effects
 * 
 * Uses clip-path animations for clean reveals.
 */
export default function PageReveal({ 
  children, 
  delay = 1000,
  duration = 800,
  variant = 'wipe-up'
}: PageRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  const clipPath = getClipPath(variant)

  useEffect(() => {
    setIsMounted(true)
    
    const timer = setTimeout(() => {
      setIsRevealed(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  // SSR: render hidden
  if (!isMounted) {
    return (
      <div style={{ opacity: 0, clipPath: clipPath.initial }}>
        {children}
      </div>
    )
  }

  return (
    <div
      className="page-reveal-wrapper"
      style={{
        clipPath: isRevealed ? clipPath.revealed : clipPath.initial,
        opacity: isRevealed ? 1 : 0,
        transition: `
          clip-path ${duration}ms cubic-bezier(0.4, 0, 0.2, 1),
          opacity ${duration * 0.5}ms ease-out
        `,
        willChange: 'clip-path, opacity',
      }}
    >
      {children}
    </div>
  )
}
