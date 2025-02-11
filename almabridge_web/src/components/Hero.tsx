"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { useEffect, useRef, useState } from "react"

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const [containerHeight, setContainerHeight] = useState(0)
  const [backgroundElements, setBackgroundElements] = useState<any[]>([])

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.offsetHeight)

      const elements = Array.from({ length: 200 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        width: Math.random() * 4 + 1,
        height: Math.random() * 4 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        duration: Math.random() * 5 + 5
      }))
      setBackgroundElements(elements)
    }
  }, [])

  const y = useTransform(scrollY, [0, containerHeight], [0, containerHeight / 2])

  return (
    <section
      ref={containerRef}
      className="min-h-screen relative flex items-center justify-center overflow-hidden pt-20"
    >
      <AnimatedBackground y={y} elements={backgroundElements} />
      <div className="container mx-auto px-4 z-10 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left lg:ps-5 mt-10 lg:mt-0"
          >
            <motion.div
              className="inline-block mb-4 px-4 py-1 rounded-full border border-white/10 bg-white/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              ✨ Welcome to the future of mentorship
            </motion.div>
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-space-grotesk"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Connect Your <span className="text-glow">Academic Journey</span>
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-400 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Bridge the gap between students and alumni through AI-powered mentorship and career guidance.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button size="lg" className="bg-white text-black hover:bg-white/90">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/10">
                Learn More
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative"
          >
            <HeroIllustration />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function AnimatedBackground({ y, elements }: { y: any, elements: any[] }) {
  return (
    <div className="absolute inset-0 z-0">
      <motion.div className="absolute inset-0 opacity-50" style={{ y }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black to-black/50" />
        <div className="h-[200%] w-full">
          {elements.map((el) => (
            <motion.div
              key={el.id}
              className="absolute bg-white rounded-full"
              style={{
                top: `${el.top}%`,
                left: `${el.left}%`,
                width: `${el.width}px`,
                height: `${el.height}px`,
                opacity: el.opacity,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: el.duration,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function HeroIllustration() {

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative w-full h-[600px]">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Grid Pattern */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-4">
          {Array.from({ length: 64 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-full h-full bg-white/5 rounded-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.5,
                delay: Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                repeatDelay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-white/10 to-transparent rounded-full"
          animate={{
            y: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        <motion.div
          className="absolute bottom-1/4 right-1/4 w-40 h-40 border border-white/20 rounded-full"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full">
          <motion.path
            d="M100,100 C150,150 200,150 250,100"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </svg>
      </motion.div>
    </div>
  )
}

