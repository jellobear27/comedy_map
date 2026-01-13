'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the 3D scene to avoid SSR issues
const OpenMicsExplosion = dynamic(
  () => import('./OpenMicsExplosion'),
  { 
    ssr: false,
    // No loading spinner - just show black background
    loading: () => null
  }
)

// Maximum time to show intro before forcing completion (2.5 seconds)
const MAX_INTRO_DURATION = 2500

export default function TheatricalIntro() {
  const [mounted, setMounted] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [removed, setRemoved] = useState(false)
  const hasCompleted = useRef(false)

  const handleComplete = useCallback(() => {
    // Prevent double-calling
    if (hasCompleted.current) return
    hasCompleted.current = true
    
    // Immediately start fade - no delay
    setFadeOut(true)
    
    // Remove from DOM almost instantly
    setTimeout(() => {
      setRemoved(true)
    }, 300)
  }, [])

  useEffect(() => {
    setMounted(true)
    
    // FAILSAFE: Force complete after max duration
    const failsafeTimer = setTimeout(() => {
      if (!hasCompleted.current) {
        handleComplete()
      }
    }, MAX_INTRO_DURATION)
    
    return () => clearTimeout(failsafeTimer)
  }, [handleComplete])

  // Remove from DOM entirely once done
  if (removed) return null

  return (
    <div 
      className={`
        fixed inset-0 z-200 bg-[#050505] 
        transition-opacity duration-300 ease-out
        ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}
      `}
    >
      {mounted && <OpenMicsExplosion onComplete={handleComplete} />}
      
      {/* Skip button */}
      <button
        onClick={handleComplete}
        className="absolute bottom-8 right-8 text-[#A0A0A0] hover:text-white text-sm transition-colors z-201 pointer-events-auto"
      >
        Skip →
      </button>
    </div>
  )
}


