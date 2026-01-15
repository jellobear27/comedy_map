'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the 3D scene to avoid SSR issues
const OpenMicsExplosion = dynamic(
  () => import('./OpenMicsExplosion'),
  { 
    ssr: false,
    // Show loading indicator while chunk downloads
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-[#7B2FF7] border-t-transparent animate-spin opacity-50" />
      </div>
    )
  }
)

// Maximum time to show intro before forcing completion
// Give enough time for cold start: chunk download + WebGL init + animation
const MAX_INTRO_DURATION = 8000

export default function TheatricalIntro() {
  const [mounted, setMounted] = useState(false)
  const [sceneStarted, setSceneStarted] = useState(false)
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

  // Called when the scene signals it has started rendering
  const handleSceneReady = useCallback(() => {
    setSceneStarted(true)
  }, [])

  useEffect(() => {
    setMounted(true)
    
    // FAILSAFE: Force complete after max duration (for slow connections)
    const failsafeTimer = setTimeout(() => {
      if (!hasCompleted.current) {
        console.warn('TheatricalIntro: Failsafe triggered after', MAX_INTRO_DURATION, 'ms')
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
      {mounted && (
        <OpenMicsExplosion 
          onComplete={handleComplete} 
          onSceneReady={handleSceneReady}
        />
      )}
      
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


