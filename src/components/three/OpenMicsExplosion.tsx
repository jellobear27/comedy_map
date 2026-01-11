'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  Sparkles, 
  Float, 
  Text, 
  MeshDistortMaterial,
  Stars,
  Trail
} from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'

// Exploding particles that burst outward then reform
function ExplodingParticles({ 
  explode, 
  onComplete 
}: { 
  explode: boolean
  onComplete: () => void 
}) {
  const particlesRef = useRef<THREE.Points>(null)
  const [phase, setPhase] = useState<'idle' | 'explode' | 'reform' | 'done'>('idle')
  const originalPositions = useRef<Float32Array | null>(null)
  const velocities = useRef<Float32Array | null>(null)
  const startTime = useRef(0)
  
  const particleCount = 500
  
  // Initialize particles in a microphone shape
  useEffect(() => {
    if (!particlesRef.current) return
    
    const positions = new Float32Array(particleCount * 3)
    const vels = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Create microphone shape
      const section = Math.random()
      let x, y, z
      
      if (section < 0.6) {
        // Mic head (sphere)
        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI
        const r = 0.8 + Math.random() * 0.2
        x = r * Math.sin(phi) * Math.cos(theta)
        y = r * Math.sin(phi) * Math.sin(theta) + 1.2
        z = r * Math.cos(phi) * 0.3
      } else if (section < 0.85) {
        // Mic body (cylinder)
        const angle = Math.random() * Math.PI * 2
        const r = 0.3 + Math.random() * 0.1
        x = Math.cos(angle) * r
        y = Math.random() * 1.5 - 0.5
        z = Math.sin(angle) * r * 0.3
      } else {
        // Mic stand
        x = (Math.random() - 0.5) * 0.2
        y = Math.random() * -1.5 - 0.5
        z = (Math.random() - 0.5) * 0.1
      }
      
      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z
      
      // Random explosion velocities
      vels[i3] = (Math.random() - 0.5) * 15
      vels[i3 + 1] = (Math.random() - 0.5) * 15
      vels[i3 + 2] = (Math.random() - 0.5) * 8
    }
    
    originalPositions.current = positions.slice()
    velocities.current = vels
    
    const geometry = particlesRef.current.geometry
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  }, [])
  
  // Trigger explosion
  useEffect(() => {
    if (explode && phase === 'idle') {
      setPhase('explode')
      startTime.current = Date.now()
    }
  }, [explode, phase])
  
  useFrame(() => {
    if (!particlesRef.current || !originalPositions.current || !velocities.current) return
    
    const positions = particlesRef.current.geometry.attributes.position
    if (!positions) return
    
    const elapsed = (Date.now() - startTime.current) / 1000
    
    if (phase === 'explode') {
      // Explode outward
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const progress = Math.min(elapsed / 0.8, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        
        positions.array[i3] = originalPositions.current[i3] + velocities.current[i3] * eased
        positions.array[i3 + 1] = originalPositions.current[i3 + 1] + velocities.current[i3 + 1] * eased
        positions.array[i3 + 2] = originalPositions.current[i3 + 2] + velocities.current[i3 + 2] * eased
      }
      positions.needsUpdate = true
      
      if (elapsed > 0.8) {
        setPhase('reform')
        startTime.current = Date.now()
      }
    } else if (phase === 'reform') {
      // Reform back to original shape
      const reformElapsed = (Date.now() - startTime.current) / 1000
      const progress = Math.min(reformElapsed / 1.2, 1)
      const eased = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const explodedX = originalPositions.current[i3] + velocities.current[i3]
        const explodedY = originalPositions.current[i3 + 1] + velocities.current[i3 + 1]
        const explodedZ = originalPositions.current[i3 + 2] + velocities.current[i3 + 2]
        
        positions.array[i3] = explodedX + (originalPositions.current[i3] - explodedX) * eased
        positions.array[i3 + 1] = explodedY + (originalPositions.current[i3 + 1] - explodedY) * eased
        positions.array[i3 + 2] = explodedZ + (originalPositions.current[i3 + 2] - explodedZ) * eased
      }
      positions.needsUpdate = true
      
      if (reformElapsed > 1.2) {
        setPhase('done')
        onComplete()
      }
    } else if (phase === 'done') {
      // Gentle floating animation
      const floatTime = Date.now() / 1000
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        positions.array[i3] = originalPositions.current[i3] + Math.sin(floatTime + i * 0.1) * 0.02
        positions.array[i3 + 1] = originalPositions.current[i3 + 1] + Math.cos(floatTime + i * 0.1) * 0.02
      }
      positions.needsUpdate = true
    }
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <pointsMaterial
        size={0.08}
        color="#F72585"
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Glowing orb in the center
function GlowingCore({ visible }: { visible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 2) * 0.1)
    }
  })
  
  if (!visible) return null
  
  return (
    <Float speed={4} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <MeshDistortMaterial
          color="#7B2FF7"
          emissive="#F72585"
          emissiveIntensity={2}
          distort={0.4}
          speed={4}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  )
}

// The "OPEN MICS" text that appears
function OpenMicsText({ visible }: { visible: boolean }) {
  const textRef = useRef<THREE.Mesh>(null)
  const [opacity, setOpacity] = useState(0)
  
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setOpacity(1), 100)
      return () => clearTimeout(timer)
    }
  }, [visible])
  
  useFrame(({ clock }) => {
    if (textRef.current && visible) {
      textRef.current.position.y = Math.sin(clock.elapsedTime * 1.5) * 0.1
    }
  })
  
  if (!visible) return null
  
  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
      <Text
        ref={textRef}
        fontSize={0.6}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        position={[0, -2.5, 0]}
        font="/fonts/Sora-Bold.woff"
        outlineWidth={0.02}
        outlineColor="#7B2FF7"
      >
        OPEN MICS
        <meshStandardMaterial 
          color="#FFFFFF" 
          emissive="#F72585"
          emissiveIntensity={0.5}
          transparent
          opacity={opacity}
        />
      </Text>
    </Float>
  )
}

// Electric arcs / lightning
function ElectricArcs({ active }: { active: boolean }) {
  const arcsRef = useRef<THREE.Group>(null)
  
  useFrame(({ clock }) => {
    if (arcsRef.current && active) {
      arcsRef.current.rotation.z = Math.sin(clock.elapsedTime * 3) * 0.1
    }
  })
  
  if (!active) return null
  
  return (
    <group ref={arcsRef}>
      {[...Array(6)].map((_, i) => (
        <Trail
          key={i}
          width={0.3}
          length={8}
          color={new THREE.Color(i % 2 === 0 ? '#7B2FF7' : '#00F5D4')}
          attenuation={(t) => t * t}
        >
          <mesh position={[
            Math.cos((i / 6) * Math.PI * 2) * 3,
            Math.sin((i / 6) * Math.PI * 2) * 3,
            0
          ]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#7B2FF7' : '#00F5D4'} />
          </mesh>
        </Trail>
      ))}
    </group>
  )
}

// Main scene
function Scene({ onAnimationComplete }: { onAnimationComplete: () => void }) {
  const [explode, setExplode] = useState(false)
  const [showCore, setShowCore] = useState(false)
  const [showText, setShowText] = useState(false)
  const [showArcs, setShowArcs] = useState(false)
  
  useEffect(() => {
    // Start the sequence
    const timer1 = setTimeout(() => setExplode(true), 500)
    const timer2 = setTimeout(() => setShowArcs(true), 600)
    const timer3 = setTimeout(() => setShowArcs(false), 1800)
    
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])
  
  const handleParticlesComplete = () => {
    setShowCore(true)
    setShowText(true)
    setTimeout(onAnimationComplete, 500)
  }
  
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#7B2FF7" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#F72585" />
      
      {/* Background stars */}
      <Stars 
        radius={50} 
        depth={50} 
        count={1000} 
        factor={4} 
        saturation={0.5} 
        fade 
        speed={2}
      />
      
      {/* Main sparkles */}
      <Sparkles
        count={200}
        scale={10}
        size={3}
        speed={0.5}
        color="#F72585"
      />
      
      <Sparkles
        count={100}
        scale={8}
        size={2}
        speed={0.3}
        color="#7B2FF7"
      />
      
      <Sparkles
        count={50}
        scale={6}
        size={4}
        speed={0.8}
        color="#00F5D4"
      />
      
      {/* Exploding microphone particles */}
      <ExplodingParticles explode={explode} onComplete={handleParticlesComplete} />
      
      {/* Glowing core */}
      <GlowingCore visible={showCore} />
      
      {/* Electric arcs during explosion */}
      <ElectricArcs active={showArcs} />
      
      {/* Text */}
      <OpenMicsText visible={showText} />
      
      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={1.5}
        />
        <ChromaticAberration 
          offset={new THREE.Vector2(0.002, 0.002)}
        />
      </EffectComposer>
    </>
  )
}

// Loading fallback
function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-4 border-[#7B2FF7] border-t-transparent animate-spin" />
    </div>
  )
}

// Main component
export default function OpenMicsExplosion({ 
  onComplete 
}: { 
  onComplete?: () => void 
}) {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!isClient) return null
  
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <Suspense fallback={<Loader />}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          style={{ background: 'transparent' }}
          gl={{ alpha: true, antialias: true }}
        >
          <Scene onAnimationComplete={onComplete || (() => {})} />
        </Canvas>
      </Suspense>
    </div>
  )
}

