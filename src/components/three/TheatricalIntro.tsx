'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the 3D scene to avoid SSR issues
const OpenMicsExplosion = dynamic(
  () => import('./OpenMicsExplosion'),
  { ssr: false }
)

export default function TheatricalIntro() {
  const [showAnimation, setShowAnimation] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Check if we've already shown the animation this session
    const hasAnimated = sessionStorage.getItem('theatricalIntroPlayed')
    
    if (!hasAnimated) {
      setShowAnimation(true)
      sessionStorage.setItem('theatricalIntroPlayed', 'true')
    }
  }, [])

  const handleComplete = () => {
    // Start fade out
    setFadeOut(true)
    
    // Remove after fade
    setTimeout(() => {
      setAnimationComplete(true)
    }, 1000)
  }

  if (!showAnimation || animationComplete) return null

  return (
    <div 
      className={`
        fixed inset-0 z-[200] bg-[#050505] transition-opacity duration-1000
        ${fadeOut ? 'opacity-0' : 'opacity-100'}
      `}
    >
      <OpenMicsExplosion onComplete={handleComplete} />
      
      {/* Skip button */}
      <button
        onClick={handleComplete}
        className="absolute bottom-8 right-8 text-[#A0A0A0] hover:text-white text-sm transition-colors z-[201]"
      >
        Skip →
      </button>
    </div>
  )
}

