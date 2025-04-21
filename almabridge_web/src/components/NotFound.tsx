  "use client"

  import { useState, useRef, useEffect } from "react"
  import { Canvas, useFrame, useThree } from "@react-three/fiber"
  import { OrbitControls, Text } from "@react-three/drei"
  import * as THREE from "three"
  import { Button } from "@/components/ui/Button"
  import { FloatingTextProps } from "@/types"
  import { useRouter } from "next/navigation"

  function JellyCharacter() {
    const bodyRef = useRef<THREE.Mesh>(null)
    const leftEyeRef = useRef<THREE.Mesh>(null)
    const rightEyeRef = useRef<THREE.Mesh>(null)
    const tentaclesRef = useRef<THREE.Group>(null)
    const { clock } = useThree()

    useFrame(() => {

      if (!bodyRef.current || !leftEyeRef.current || !rightEyeRef.current || !tentaclesRef.current) return

      const t = clock.getElapsedTime()

      // Body wobble
      bodyRef.current.scale.x = 1 + Math.sin(t * 2) * 0.1
      bodyRef.current.scale.y = 1 + Math.cos(t * 2) * 0.1
      bodyRef.current.position.y = Math.sin(t) * 0.1

      // Eye movement
      leftEyeRef.current.position.x = 0.3 + Math.sin(t * 3) * 0.05
      rightEyeRef.current.position.x = -0.3 + Math.sin(t * 3) * 0.05

      // Tentacle animation
      const tentacles = tentaclesRef.current.children
      tentacles.forEach((tentacle, index) => {
        tentacle.position.y = Math.sin(t * 2 + index * 0.5) * 0.1
      })
    })

    return (
      <group>
        {/* Jelly body */}
        <mesh ref={bodyRef}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhongMaterial color="#88CCFF" transparent opacity={0.7} />
        </mesh>

        {/* Eyes */}
        <mesh ref={leftEyeRef} position={[0.3, 0.2, 0.8]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh ref={rightEyeRef} position={[-0.3, 0.2, 0.8]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>

        {/* Tentacles */}
        <group ref={tentaclesRef}>
          {[...Array(8)].map((_, index) => (
            <mesh key={index} position={[Math.sin(index * 0.8) * 0.5, -0.8, Math.cos(index * 0.8) * 0.5]}>
              <cylinderGeometry args={[0.05, 0.02, 0.5, 8]} />
              <meshPhongMaterial color="#88CCFF" transparent opacity={0.7} />
            </mesh>
          ))}
        </group>
      </group>
    )
  }

  function Bubbles() {
    const bubblesRef = useRef<THREE.Points>(null)
    const bubbleCount = 20

    useFrame(() => {
      if (bubblesRef.current) {
        const positions = bubblesRef.current.geometry.attributes.position.array
        for (let i = 0; i < bubbleCount; i++) {
          const idx = i * 3
          positions[idx + 1] += 0.01
          if (positions[idx + 1] > 3) {
            positions[idx] = (Math.random() - 0.5) * 5
            positions[idx + 1] = -3
            positions[idx + 2] = (Math.random() - 0.5) * 5
          }
        }
        bubblesRef.current.geometry.attributes.position.needsUpdate = true
      }
    })

    const bubblePositions = new Float32Array(bubbleCount * 3)
    for (let i = 0; i < bubbleCount; i++) {
      bubblePositions[i * 3] = (Math.random() - 0.5) * 5
      bubblePositions[i * 3 + 1] = Math.random() * 6 - 3
      bubblePositions[i * 3 + 2] = (Math.random() - 0.5) * 5
    }

    return (
      <points ref={bubblesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={bubbleCount} array={bubblePositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.1} color="#FFFFFF" transparent opacity={0.6} />
      </points>
    )
  }

  function FloatingText({ position, children }: FloatingTextProps) {
    const textRef = useRef<THREE.Object3D>(null)

    useFrame(({ clock }) => {
      if (!textRef.current) return
      
      const posY = Array.isArray(position) 
        ? position[1] 
        : position.y

      textRef.current.position.y = posY + Math.sin(clock.getElapsedTime() * 2) * 0.05
    })

    return (
      <Text 
        ref={textRef} 
        position={position} 
        fontSize={0.5} 
        color="#FFFFFF" 
        anchorX="center" 
        anchorY="middle"
      >
        {children}
      </Text>
    )
  }

const messages = [
      "404: Page has wobbled away",
      "Oops! This jelly isn't the page you're looking for",
      "Looks like we're in a sticky situation",
      "Error 404: Jelly.js not responding",
      "This page has jiggled out of existence",
      "Whoops! You've bounced into the wrong place",
    ]

  export default function NotFound() {
    const [message, setMessage] = useState(messages[0])

    const router = useRouter();

    const handleGoBack = () => {
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back()
      } else {
        router.push("/")
      }
    }

    

    useEffect(() => {
      const interval = setInterval(() => {
        setMessage(messages[Math.floor(Math.random() * messages.length)])
      }, 4000)
      return () => clearInterval(interval)
    }, [])

    return (
      <div className="h-screen  flex flex-col items-center justify-center p-4">
        <div className="w-full h-96 mb-8">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <JellyCharacter />
            <Bubbles />
            <FloatingText position={[0, 2, 0]}>404</FloatingText>
            <OrbitControls enableZoom={false} />
          </Canvas>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-center">{message}</h1>

        <p className="text-xl text-blue-200 mb-8 text-center">
          Our jelly friend is bouncing around looking for your page. Why not wiggle back home?
        </p>

        <Button
          onClick={() => handleGoBack()}
          size="lg"
          className="bg-white text-blue-600 hover:bg-blue-100 transition-all duration-300 transform hover:scale-105"
        >
          Bounce Back
        </Button>
      </div>
    )
  }
