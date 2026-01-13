'use client'

import { useEffect, useState } from 'react'

interface Firefly {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  color: string
}

const COLORS = [
  '#7B2FF7', // Purple
  '#F72585', // Pink
  '#00F5D4', // Teal
  '#FFB627', // Gold
]

export default function Fireflies({ count = 15 }: { count?: number }) {
  const [fireflies, setFireflies] = useState<Firefly[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Generate random fireflies
    const flies: Firefly[] = []
    for (let i = 0; i < count; i++) {
      flies.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 3 + Math.random() * 4,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * 5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      })
    }
    setFireflies(flies)
  }, [count])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {fireflies.map((fly) => (
        <div
          key={fly.id}
          className="absolute rounded-full"
          style={{
            left: `${fly.x}%`,
            top: `${fly.y}%`,
            width: fly.size,
            height: fly.size,
            backgroundColor: fly.color,
            boxShadow: `
              0 0 ${fly.size * 2}px ${fly.color},
              0 0 ${fly.size * 4}px ${fly.color},
              0 0 ${fly.size * 6}px ${fly.color}
            `,
            animation: `
              firefly-float ${fly.duration}s ease-in-out infinite,
              firefly-glow ${fly.duration * 0.5}s ease-in-out infinite alternate
            `,
            animationDelay: `${fly.delay}s, ${fly.delay * 0.7}s`,
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes firefly-float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(${Math.random() > 0.5 ? '' : '-'}30px, -40px) scale(0.8);
          }
          50% {
            transform: translate(${Math.random() > 0.5 ? '' : '-'}50px, 20px) scale(1.1);
          }
          75% {
            transform: translate(${Math.random() > 0.5 ? '' : '-'}20px, -30px) scale(0.9);
          }
        }
        
        @keyframes firefly-glow {
          0% {
            opacity: 0.3;
            filter: blur(0px);
          }
          100% {
            opacity: 1;
            filter: blur(1px);
          }
        }
      `}</style>
    </div>
  )
}

