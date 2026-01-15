'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  Sparkles, 
  Float, 
  Text, 
  Stars,
  Trail,
  Html
} from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'

// Brand colors matching the fireflies
const PARTICLE_COLORS = [
  new THREE.Color('#7B2FF7'), // Purple
  new THREE.Color('#F72585'), // Pink
  new THREE.Color('#00F5D4'), // Teal
  new THREE.Color('#FFB627'), // Gold
]

// ============================================
// ANIMATION TIMING CONSTANTS (in milliseconds)
// FULL 1.5 SECONDS of theatrical mic animation
// Then IMMEDIATE transition (no purple circle wait)
// ============================================
const TIMING = {
  INITIAL_DELAY: 300,        // Brief anticipation - particles drift
  PARTICLE_REFORM: 900,      // Graceful particle reformation
  ARCS_DURATION: 1000,       // Electric arcs during reform
  LOGO_FADE_IN: 300,         // Logo fades in elegantly
  HOLD_AFTER_LOGO: 200,      // Brief moment to appreciate
}

// Total animation: 1500ms (1.5 seconds) exactly
const MIN_ANIMATION_DURATION = 1500

// The actual logo SVG rendered in 3D space
function LogoDisplay({ 
  visible,
  scale = 1 
}: { 
  visible: boolean
  scale?: number
}) {
  const [opacity, setOpacity] = useState(0)
  const fadeStartTime = useRef<number | null>(null)
  
  useFrame(() => {
    if (visible && opacity < 1) {
      if (fadeStartTime.current === null) {
        fadeStartTime.current = Date.now()
      }
      const elapsed = Date.now() - fadeStartTime.current
      const progress = Math.min(elapsed / TIMING.LOGO_FADE_IN, 1)
      // Smooth ease-out
      setOpacity(1 - Math.pow(1 - progress, 3))
    }
  })
  
  if (!visible && opacity === 0) return null
  
  return (
    <Float speed={1.5} rotationIntensity={0.08} floatIntensity={0.2}>
      <Html
        center
        transform
        distanceFactor={4}
        style={{
          opacity,
          pointerEvents: 'none',
        }}
      >
        <svg
          width={220 * scale}
          height={220 * scale}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: 'drop-shadow(0 0 25px rgba(247, 37, 133, 0.7)) drop-shadow(0 0 50px rgba(123, 47, 247, 0.5))',
          }}
        >
          {/* Mic head - rounded rectangle with gradient stroke */}
          <rect
            x="14"
            y="4"
            width="20"
            height="26"
            rx="10"
            stroke="url(#micGradientAnim)"
            strokeWidth="4.5"
            fill="none"
          />
          
          {/* Mic grille lines */}
          <line x1="18" y1="12" x2="30" y2="12" stroke="url(#micGradientAnim)" strokeWidth="3" strokeLinecap="round" />
          <line x1="18" y1="17" x2="30" y2="17" stroke="url(#micGradientAnim)" strokeWidth="3" strokeLinecap="round" />
          <line x1="18" y1="22" x2="30" y2="22" stroke="url(#micGradientAnim)" strokeWidth="3" strokeLinecap="round" />
          
          {/* Mic stand curve */}
          <path
            d="M12 30C12 36.627 17.373 42 24 42C30.627 42 36 36.627 36 30"
            stroke="url(#micGradientAnim)"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* Mic stand vertical */}
          <line x1="24" y1="42" x2="24" y2="46" stroke="url(#micGradientAnim)" strokeWidth="4.5" strokeLinecap="round" />
          
          {/* Mic stand base */}
          <line x1="18" y1="46" x2="30" y2="46" stroke="url(#micGradientAnim)" strokeWidth="4.5" strokeLinecap="round" />
          
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="micGradientAnim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7B2FF7" />
              <stop offset="50%" stopColor="#F72585" />
              <stop offset="100%" stopColor="#FF6B6B" />
            </linearGradient>
          </defs>
        </svg>
      </Html>
    </Float>
  )
}

// Glowing ring that pulses around the logo
function GlowRing({ visible }: { visible: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null)
  const [opacity, setOpacity] = useState(0)
  const fadeStartTime = useRef<number | null>(null)
  
  useFrame(({ clock }) => {
    if (visible) {
      // Fade in
      if (fadeStartTime.current === null) {
        fadeStartTime.current = Date.now()
      }
      const elapsed = Date.now() - fadeStartTime.current
      const fadeProgress = Math.min(elapsed / 800, 1)
      setOpacity(fadeProgress * 0.6)
      
      // Animate
      if (ringRef.current) {
        ringRef.current.rotation.z = clock.elapsedTime * 0.2
        ringRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 1.5) * 0.05)
      }
    }
  })
  
  if (!visible) return null
  
  return (
    <mesh ref={ringRef} position={[0, 0, -0.5]}>
      <ringGeometry args={[1.8, 2, 64]} />
      <meshBasicMaterial
        color="#7B2FF7"
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

// Particles that scatter and reform into position around the logo
function ScatterParticles({ 
  animationStartTime,
  onReformComplete 
}: { 
  animationStartTime: number
  onReformComplete: () => void 
}) {
  const particlesRef = useRef<THREE.Points>(null)
  const originalPositions = useRef<Float32Array | null>(null)
  const scatteredPositions = useRef<Float32Array | null>(null)
  const hasCalledComplete = useRef(false)
  const isInitialized = useRef(false)
  
  const particleCount = 800
  
  // Initialize particles once
  useEffect(() => {
    if (!particlesRef.current || isInitialized.current) return
    isInitialized.current = true
    
    const positions = new Float32Array(particleCount * 3)
    const scattered = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    
    // Create particles that will form around the logo silhouette
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Assign random color from brand palette
      const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)]
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
      
      // Vary particle sizes for more organic look
      sizes[i] = 0.04 + Math.random() * 0.06
      
      // Final positions - create a microphone-ish shape outline
      const section = Math.random()
      let x, y, z
      
      if (section < 0.4) {
        // Around the mic head (oval)
        const angle = Math.random() * Math.PI * 2
        const rx = 0.9 + Math.random() * 0.3
        const ry = 1.2 + Math.random() * 0.3
        x = Math.cos(angle) * rx
        y = Math.sin(angle) * ry * 0.6 + 0.8
        z = (Math.random() - 0.5) * 0.5
      } else if (section < 0.6) {
        // Arc under the mic
        const angle = Math.random() * Math.PI
        const r = 1.1 + Math.random() * 0.2
        x = Math.cos(angle) * r
        y = -Math.sin(angle) * r * 0.5 - 0.3
        z = (Math.random() - 0.5) * 0.4
      } else if (section < 0.75) {
        // Stand
        x = (Math.random() - 0.5) * 0.3
        y = -1.2 - Math.random() * 0.5
        z = (Math.random() - 0.5) * 0.3
      } else {
        // Scattered sparkles around
        const angle = Math.random() * Math.PI * 2
        const r = 2 + Math.random() * 1.5
        x = Math.cos(angle) * r
        y = (Math.random() - 0.5) * 4
        z = (Math.random() - 0.5) * 1
      }
      
      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z
      
      // Scattered position (random in space)
      scattered[i3] = (Math.random() - 0.5) * 15
      scattered[i3 + 1] = (Math.random() - 0.5) * 15
      scattered[i3 + 2] = (Math.random() - 0.5) * 8
    }
    
    originalPositions.current = positions
    scatteredPositions.current = scattered
    
    // Start scattered
    const geometry = particlesRef.current.geometry
    geometry.setAttribute('position', new THREE.BufferAttribute(scattered.slice(), 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  }, [])
  
  useFrame(() => {
    if (!particlesRef.current || !originalPositions.current || !scatteredPositions.current) return
    if (animationStartTime === 0) return // Not started yet
    
    const positions = particlesRef.current.geometry.attributes.position
    if (!positions) return
    
    const elapsed = Date.now() - animationStartTime
    const reformStartTime = TIMING.INITIAL_DELAY
    const reformEndTime = TIMING.INITIAL_DELAY + TIMING.PARTICLE_REFORM
    
    if (elapsed < reformStartTime) {
      // Initial delay - particles drift slowly, creating anticipation
      const driftTime = elapsed / 1000
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        // Slow, gentle drift - inviting the user in
        positions.array[i3] = scatteredPositions.current[i3] + Math.sin(driftTime * 0.3 + i * 0.03) * 0.2
        positions.array[i3 + 1] = scatteredPositions.current[i3 + 1] + Math.cos(driftTime * 0.3 + i * 0.03) * 0.2
        positions.array[i3 + 2] = scatteredPositions.current[i3 + 2] + Math.sin(driftTime * 0.2 + i * 0.02) * 0.1
      }
      positions.needsUpdate = true
    } else if (elapsed < reformEndTime) {
      // Reforming phase - slow, graceful, theatrical movement
      const reformElapsed = elapsed - reformStartTime
      const reformDuration = TIMING.PARTICLE_REFORM
      const progress = reformElapsed / reformDuration
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        // Staggered delay per particle for flowing wave effect
        const particleDelay = (i / particleCount) * 0.5
        const particleProgress = Math.max(0, Math.min(1, (progress - particleDelay) / (1 - particleDelay)))
        // Smooth ease-in-out-quint for buttery smooth movement
        const particleEased = particleProgress < 0.5
          ? 16 * particleProgress * particleProgress * particleProgress * particleProgress * particleProgress
          : 1 - Math.pow(-2 * particleProgress + 2, 5) / 2
        
        positions.array[i3] = scatteredPositions.current[i3] + 
          (originalPositions.current[i3] - scatteredPositions.current[i3]) * particleEased
        positions.array[i3 + 1] = scatteredPositions.current[i3 + 1] + 
          (originalPositions.current[i3 + 1] - scatteredPositions.current[i3 + 1]) * particleEased
        positions.array[i3 + 2] = scatteredPositions.current[i3 + 2] + 
          (originalPositions.current[i3 + 2] - scatteredPositions.current[i3 + 2]) * particleEased
      }
      positions.needsUpdate = true
    } else {
      // Reform complete - gentle idle animation
      if (!hasCalledComplete.current) {
        hasCalledComplete.current = true
        onReformComplete()
      }
      
      const idleTime = (elapsed - reformEndTime) / 1000
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const angle = idleTime * 0.3 + i * 0.01
        positions.array[i3] = originalPositions.current[i3] + Math.sin(angle) * 0.04
        positions.array[i3 + 1] = originalPositions.current[i3 + 1] + Math.cos(angle * 0.7) * 0.04
      }
      positions.needsUpdate = true
    }
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <pointsMaterial
        size={0.07}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Secondary particles - multi-colored like fireflies
function SecondaryParticles({ visible }: { visible: boolean }) {
  const particlesRef = useRef<THREE.Points>(null)
  const isInitialized = useRef(false)
  
  useEffect(() => {
    if (!particlesRef.current || isInitialized.current) return
    isInitialized.current = true
    
    const count = 300
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const angle = Math.random() * Math.PI * 2
      const r = 1.5 + Math.random() * 2
      positions[i3] = Math.cos(angle) * r
      positions[i3 + 1] = (Math.random() - 0.5) * 4
      positions[i3 + 2] = Math.sin(angle) * r * 0.5
      
      // Random color from brand palette
      const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)]
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }
    
    particlesRef.current.geometry.setAttribute(
      'position', 
      new THREE.BufferAttribute(positions, 3)
    )
    particlesRef.current.geometry.setAttribute(
      'color', 
      new THREE.BufferAttribute(colors, 3)
    )
  }, [])
  
  useFrame(({ clock }) => {
    if (particlesRef.current && visible) {
      // Slow, graceful orbit
      particlesRef.current.rotation.y = clock.elapsedTime * 0.03
    }
  })
  
  if (!visible) return null
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <pointsMaterial
        size={0.06}
        vertexColors
          transparent
          opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        />
    </points>
  )
}

// The "OPEN MICS" text that appears
function OpenMicsText({ visible }: { visible: boolean }) {
  const textRef = useRef<THREE.Mesh>(null)
  const [opacity, setOpacity] = useState(0)
  const fadeStartTime = useRef<number | null>(null)
  
  useFrame(({ clock }) => {
    if (visible) {
      // Fade in
      if (fadeStartTime.current === null) {
        fadeStartTime.current = Date.now()
      }
      const elapsed = Date.now() - fadeStartTime.current
      const fadeProgress = Math.min(elapsed / 800, 1)
      setOpacity(fadeProgress)
      
      // Float animation
      if (textRef.current) {
        textRef.current.position.y = -2.8 + Math.sin(clock.elapsedTime * 1.2) * 0.06
      }
    }
  })
  
  if (!visible) return null
  
  return (
      <Text
        ref={textRef}
      fontSize={0.5}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      position={[0, -2.8, 0]}
        font="/fonts/Sora-Bold.woff"
      outlineWidth={0.012}
        outlineColor="#7B2FF7"
      >
        OPEN MICS
        <meshStandardMaterial 
          color="#FFFFFF" 
          emissive="#F72585"
        emissiveIntensity={0.3}
          transparent
          opacity={opacity}
        />
      </Text>
  )
}

// Electric energy arcs
function ElectricArcs({ visible }: { visible: boolean }) {
  const arcsRef = useRef<THREE.Group>(null)
  
  useFrame(({ clock }) => {
    if (arcsRef.current && visible) {
      // Slow, graceful rotation
      arcsRef.current.rotation.z = clock.elapsedTime * 0.2
    }
  })
  
  if (!visible) return null
  
  return (
    <group ref={arcsRef}>
      {[...Array(6)].map((_, i) => (
        <Trail
          key={i}
          width={0.15}
          length={5}
          color={new THREE.Color(i % 2 === 0 ? '#7B2FF7' : '#F72585')}
          attenuation={(t) => t * t}
        >
          <mesh position={[
            Math.cos((i / 6) * Math.PI * 2) * 2.2,
            Math.sin((i / 6) * Math.PI * 2) * 2.2,
            0
          ]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#7B2FF7' : '#F72585'} />
          </mesh>
        </Trail>
      ))}
    </group>
  )
}

// Main scene - starts animation immediately for snappy experience
function Scene({ onAnimationComplete }: { onAnimationComplete: () => void }) {
  const [animationStartTime, setAnimationStartTime] = useState(0)
  const [showLogo, setShowLogo] = useState(false)
  const [showText, setShowText] = useState(false)
  const [showArcs, setShowArcs] = useState(false)
  const [showSecondary, setShowSecondary] = useState(false)
  const hasCompletedAnimation = useRef(false)
  const frameCount = useRef(0)
  const hasStarted = useRef(false)
  
  // Start animation after first few frames render (ensures scene is visible)
  useFrame(() => {
    if (!hasStarted.current) {
      frameCount.current++
      if (frameCount.current >= 3) {
        hasStarted.current = true
        setAnimationStartTime(Date.now())
      }
    }
  })
  
  // Animation timers - only start after animationStartTime is set
  useEffect(() => {
    if (animationStartTime === 0) return
    
    // Show arcs during particle reformation
    const arcsTimer = setTimeout(() => {
      setShowArcs(true)
    }, TIMING.INITIAL_DELAY)
    
    // Hide arcs
    const hideArcsTimer = setTimeout(() => {
      setShowArcs(false)
    }, TIMING.INITIAL_DELAY + TIMING.ARCS_DURATION)
    
    // Show logo after particles reform (around 1.2s)
    const forceLogoTimer = setTimeout(() => {
      setShowLogo(true)
      setShowSecondary(true)
      setShowText(true)
    }, TIMING.INITIAL_DELAY + TIMING.PARTICLE_REFORM)
    
    // Complete animation at exactly 1.5 seconds - IMMEDIATE transition, no waiting
    const completeTimer = setTimeout(() => {
      if (!hasCompletedAnimation.current) {
        hasCompletedAnimation.current = true
        onAnimationComplete()
      }
    }, MIN_ANIMATION_DURATION)
    
    return () => {
      clearTimeout(arcsTimer)
      clearTimeout(hideArcsTimer)
      clearTimeout(forceLogoTimer)
      clearTimeout(completeTimer)
    }
  }, [animationStartTime, onAnimationComplete])
  
  // Handle reform complete - show logo and text
  const handleReformComplete = () => {
    setShowLogo(true)
    setShowSecondary(true)
    setShowText(true)
  }
  
  // Use frame to check if we should complete the animation
  useFrame(() => {
    if (animationStartTime === 0 || hasCompletedAnimation.current) return
    
    const elapsed = Date.now() - animationStartTime
    
    // Complete at exactly 1.5 seconds - no waiting for logo
    if (elapsed >= MIN_ANIMATION_DURATION) {
      hasCompletedAnimation.current = true
      onAnimationComplete()
  }
  })
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#FFFFFF" />
      <pointLight position={[-5, 3, 2]} intensity={0.6} color="#7B2FF7" />
      <pointLight position={[3, -3, 3]} intensity={0.5} color="#F72585" />
      
      {/* Background stars */}
      <Stars 
        radius={50} 
        depth={50} 
        count={600} 
        factor={4} 
        saturation={0.5} 
        fade 
        speed={0.8}
      />
      
      {/* Ambient sparkles - slow, dreamy, matching firefly colors */}
      <Sparkles
        count={80}
        scale={10}
        size={2.5}
        speed={0.08}
        color="#F72585"
      />
      
      <Sparkles
        count={60}
        scale={9}
        size={2}
        speed={0.06}
        color="#7B2FF7"
      />
      
      <Sparkles
        count={40}
        scale={8}
        size={2}
        speed={0.07}
        color="#00F5D4"
      />
      
      <Sparkles
        count={30}
        scale={7}
        size={1.8}
        speed={0.09}
        color="#FFB627"
      />
      
      {/* Scatter particles that form around the logo */}
      <ScatterParticles 
        animationStartTime={animationStartTime}
        onReformComplete={handleReformComplete} 
      />
      
      {/* Secondary orbiting particles */}
      <SecondaryParticles visible={showSecondary} />
      
      {/* Glow ring behind logo */}
      <GlowRing visible={showLogo} />
      
      {/* The actual logo */}
      <LogoDisplay visible={showLogo} scale={1.2} />
      
      {/* Electric arcs during formation */}
      <ElectricArcs visible={showArcs} />
      
      {/* Text */}
      <OpenMicsText visible={showText} />
      
      {/* Post-processing effects - enhanced glow like fireflies */}
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.1}
          luminanceSmoothing={0.95}
          intensity={1.8}
          radius={0.8}
        />
        <ChromaticAberration 
          offset={new THREE.Vector2(0.001, 0.001)}
        />
      </EffectComposer>
    </>
  )
}

// Responsive camera that adjusts based on screen size
function ResponsiveCamera() {
  const { camera, size } = useThree()
  
  useEffect(() => {
    // Adjust camera position based on viewport aspect ratio
    const aspect = size.width / size.height
    
    if (aspect < 0.7) {
      // Very tall/narrow (mobile portrait) - zoom out more
      camera.position.z = 8
    } else if (aspect < 1) {
      // Tall (tablet portrait)
      camera.position.z = 7
    } else {
      // Wide (landscape/desktop)
      camera.position.z = 6
    }
    
    camera.updateProjectionMatrix()
  }, [camera, size])
  
  return null
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
  
  // Cap DPR for performance
  const pixelRatio = typeof window !== 'undefined' 
    ? Math.min(window.devicePixelRatio, 2) 
    : 1
  
  return (
    <div className="fixed inset-0 z-100 pointer-events-none">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 50 }}
          style={{ background: 'transparent', width: '100%', height: '100%', display: 'block' }}
          dpr={pixelRatio}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          resize={{ scroll: false, debounce: { scroll: 50, resize: 50 } }}
        >
          <ResponsiveCamera />
          <Scene onAnimationComplete={onComplete || (() => {})} />
        </Canvas>
      </Suspense>
    </div>
  )
}
