'use client'

import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react'

// Lazy load Three.js component - starts loading immediately when this module loads
const OpenMicsExplosion = lazy(() => import('./OpenMicsExplosion'))

// Start preloading the chunk immediately (before component mounts)
if (typeof window !== 'undefined') {
  import('./OpenMicsExplosion')
}

// Failsafe: if scene never loads, skip after 3 seconds
const SCENE_LOAD_TIMEOUT = 3000

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
    
    // Failsafe: skip if scene never loads
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
      {mounted && (
        <Suspense fallback={null}>
          <OpenMicsExplosion onComplete={handleComplete} />
        </Suspense>
      )}
    </div>
  )
}


