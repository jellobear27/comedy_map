'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the 3D scene to avoid SSR issues
const OpenMicsExplosion = dynamic(
  () => import('./OpenMicsExplosion'),
  { ssr: false }
)

// Failsafe: if scene never loads, skip after 4 seconds
const SCENE_LOAD_TIMEOUT = 4000

export default function TheatricalIntro() {
  const [mounted, setMounted] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [removed, setRemoved] = useState(false)
  const hasCompleted = useRef(false)

  const handleComplete = useCallback(() => {
    if (hasCompleted.current) return
    hasCompleted.current = true
    setFadeOut(true)
    setTimeout(() => setRemoved(true), 300)
  }, [])

  useEffect(() => {
    setMounted(true)
    
    // Failsafe: skip if scene never loads (slow connection)
    const failsafe = setTimeout(() => {
      if (!hasCompleted.current) handleComplete()
    }, SCENE_LOAD_TIMEOUT)
    
    return () => clearTimeout(failsafe)
  }, [handleComplete])

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
    </div>
  )
}


