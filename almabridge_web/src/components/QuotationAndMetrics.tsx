"use client"

import { motion, useInView, useAnimation } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import { metrics, scrambleText, highlightWords } from "@/data";


function ScrambleText({ text, highlightWords }: { text: string; highlightWords: string[] }) {
  const [displayText, setDisplayText] = useState("")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const componentRef = useRef(null)
  const isInView = useInView(componentRef, { once: true })
  const hasStartedRef = useRef(false)
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  
  useEffect(() => {
    // Only start the animation if the component is in view and hasn't started yet
    if (isInView && !hasStartedRef.current) {
      hasStartedRef.current = true
      let currentIndex = 0
      const finalText = text
      const textArray = new Array(text.length).fill("")
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      const scramble = () => {
        intervalRef.current = setInterval(() => {
          if (currentIndex >= text.length) {
            if (intervalRef.current) clearInterval(intervalRef.current)
            return
          }

          textArray.forEach((_, index) => {
            if (index > currentIndex) {
              if (text[index] !== " ") {
                textArray[index] = characters[Math.floor(Math.random() * characters.length)]
              } else {
                textArray[index] = " "
              }
            } else {
              textArray[index] = finalText[index]
            }
          })

          setDisplayText(textArray.join(""))
          currentIndex += 0.5
        }, 50)
      }

      // Initial fill with random characters
      textArray.forEach((_, index) => {
        if (text[index] !== " ") {
          textArray[index] = characters[Math.floor(Math.random() * characters.length)]
        } else {
          textArray[index] = " "
        }
      })
      setDisplayText(textArray.join(""))

      // Start scrambling after a short delay
      setTimeout(scramble, 500)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [text, isInView])

  const words = displayText.split(" ")
  
  return (
    <div className="relative" ref={componentRef}>
      {/* Decorative SVGs - only show when in view */}
      {isInView && (
        <>
          <motion.svg
            className="absolute -left-16 -top-8 w-12 h-12 text-blue-500/30"
            viewBox="0 0 24 24"
            initial={{ rotate: 0, scale: 0.5 }}
            animate={{ rotate: 360, scale: [0.5, 1, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M12 2L12 22M2 12L22 12" stroke="currentColor" strokeWidth="2" />
          </motion.svg>

          <motion.svg
            className="absolute -right-12 -bottom-8 w-10 h-10 text-blue-500/30"
            viewBox="0 0 24 24"
            initial={{ rotate: 0, scale: 0.5 }}
            animate={{ rotate: -360, scale: [0.5, 1, 0.5] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <polygon 
              points="12 2 19 21 5 21"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </motion.svg>

          <motion.svg
            className="absolute left-1/2 -top-12 w-8 h-8 text-blue-500/30"
            viewBox="0 0 24 24"
            initial={{ rotate: 0, opacity: 0.5 }}
            animate={{ rotate: 180, opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M4 12L20 12M12 4L12 20" stroke="currentColor" strokeWidth="2" />
          </motion.svg>
        </>
      )}

      <p className="text-xl md:text-3xl font-medium text-white italic">
        {words.map((word, index) => (
          <span
            key={index}
            className={highlightWords.includes(words[index]) ? "text-blue-400 font-bold" : ""}
          >
            {word}{" "}
          </span>
        ))}
      </p>
    </div>
  )
}


function InteractiveLightbulb() {
  const [isOn, setIsOn] = useState(true)
  const controls = useAnimation()

  useEffect(() => {
    controls.start("on")
  }, [controls])

  const handleClick = () => {
    setIsOn(!isOn)
    controls.start(isOn ? "off" : "on")
  }

  const bulbVariants = {
    off: { fill: "#333", filter: "drop-shadow(0px 0px 0px #FFA500)" },
    on: { fill: "#FFA500", filter: "drop-shadow(0px 0px 15px #FFA500)" },
  }

  const filamentVariants = {
    off: { stroke: "#555" },
    on: { stroke: "#FFA500" },
  }

  const rayVariants = {
    off: { opacity: 0, scale: 0 },
    on: { opacity: 1, scale: 1 },
  }

  const sparkVariants = {
    off: { opacity: 0 },
    on: { opacity: [0, 1, 0], transition: { repeat: Number.POSITIVE_INFINITY, duration: 1 } },
  }

  return (
    <div className="cursor-pointer mx-auto mb-8" onClick={handleClick}>
      <svg width="100" height="100" viewBox="0 0 200 200">
        {/* Base */}
        <rect x="90" y="160" width="20" height="20" fill="#888" />
        <path d="M85 160 Q100 180 115 160" fill="#888" />

        {/* Bulb */}
        <motion.path d="M70 80 Q100 20 130 80 L130 140 Q100 160 70 140 Z" animate={controls} variants={bulbVariants} />

        {/* Filament */}
        <motion.path
          d="M85 120 Q100 140 115 120"
          fill="none"
          strokeWidth="2"
          animate={controls}
          variants={filamentVariants}
        />

        {/* Rays */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.line
            key={i}
            x1="100"
            y1="60"
            x2={100 + 60 * Math.cos((i * Math.PI) / 3)}
            y2={60 + 60 * Math.sin((i * Math.PI) / 3)}
            stroke="#FFA500"
            strokeWidth="2"
            initial="off"
            animate={controls}
            variants={rayVariants}
          />
        ))}

        {/* Sparks */}
        {[0, 1, 2, 3].map((i) => (
          <motion.circle
            key={i}
            cx={80 + Math.random() * 40}
            cy={60 + Math.random() * 40}
            r="2"
            fill="#FFA500"
            initial="off"
            animate={controls}
            variants={sparkVariants}
          />
        ))}
      </svg>
    </div>
  )
}




export default function QuotationAndMetrics() {
  return (
    <section id="metrics" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />

      {/* Quotation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center flex flex-col items-center justify-center min-h-[50vh]"
        >
          <InteractiveLightbulb />
          <div className="relative">
            <ScrambleText text={scrambleText} highlightWords={highlightWords} />
          </div>
        </motion.div>
      </div>

      {/* Metrics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk">
            Numbers <span className="text-glow">Speaking</span> for Themselves
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-white/5 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
              <div className="relative p-6 rounded-lg bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-colors duration-300 h-48 flex flex-col items-center justify-center">
                <metric.icon className="w-12 h-12 text-white mb-4" />
                <motion.div
                  className="text-4xl md:text-5xl font-bold text-white mb-2 font-space-grotesk"
                  initial={{ scale: 1 }}
                  whileInView={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.8, times: [0, 0.5, 1] }}
                  viewport={{ once: true }}
                >
                  {metric.value}
                </motion.div>
                <p className="text-gray-400 text-center">{metric.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}